/**
 * RPA — ATUALIZA js/dados.js A PARTIR DO PLAYNEST
 * ==================================================================
 * O mídia kit do Playnest é um site Next.js: TODOS os números (IG e
 * TikTok, 7 e 28 dias, público e conteúdos) já vêm embutidos no HTML,
 * dentro de <script id="__NEXT_DATA__">. Então este RPA só precisa:
 *
 *   1. baixar a página (um GET simples — sem navegador/Playwright);
 *   2. extrair o JSON do __NEXT_DATA__;
 *   3. remapear para o formato do nosso js/dados.js;
 *   4. reescrever js/dados.js.
 *
 * COMO RODAR:  node rpa/atualizar-dados.js        (precisa Node 18+)
 * Depois, suba o js/dados.js novo para a hospedagem (ou comite no git).
 *
 * IMPORTANTE: este script mexe SÓ nos números (js/dados.js). Textos como
 * bio, nichos e e-mail ficam no index.html e NÃO são tocados aqui.
 * ================================================================== */

'use strict';

const fs = require('fs');
const path = require('path');

/* ------- Configuração ------- */
const SLUG = 'bianca-marques-rodrigues';
const URL_PLAYNEST = `https://app.playnest.com.br/${SLUG}`;
const ARQUIVO_SAIDA = path.join(__dirname, '..', 'js', 'dados.js');
const FUSO = 'America/Recife'; // UTC-3, para bater com os horários do site

/* ------- Utilidades ------- */

// "2026-05-29T20:20:02Z" -> "29/05/2026 às 17:01" (horário de Recife)
function formatarDataHora(iso) {
  const fmt = new Intl.DateTimeFormat('pt-BR', {
    timeZone: FUSO, day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false
  });
  const p = Object.fromEntries(fmt.formatToParts(new Date(iso)).map(x => [x.type, x.value]));
  return `${p.day}/${p.month}/${p.year} às ${p.hour}:${p.minute}`;
}

// contagens {a,b,c} -> percentuais somando ~100, com 1 casa
function paraPercentual(valor, total) {
  return total > 0 ? Math.round((valor / total) * 1000) / 10 : 0;
}

// abrevia p/ log: 17400 -> "17,4k"
function abreviar(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace('.', ',') + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1).replace('.', ',') + 'k';
  return String(n);
}

function garantir(condicao, mensagem) {
  if (!condicao) throw new Error(`[RPA] Estrutura inesperada: ${mensagem}. O Playnest pode ter mudado o site — o mapeamento precisa ser revisto.`);
}

/* ------- 1) Baixar e extrair o __NEXT_DATA__ ------- */
async function baixarDadosPlaynest() {
  const resposta = await fetch(URL_PLAYNEST, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  garantir(resposta.ok, `HTTP ${resposta.status} ao baixar a página`);

  const html = await resposta.text();
  const m = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
  garantir(m, 'não achei o bloco __NEXT_DATA__ no HTML');

  const raiz = JSON.parse(m[1]);
  const dados = raiz?.props?.pageProps?.data?.data;
  garantir(dados && dados.instagram && dados.tiktok, 'props.pageProps.data.data.{instagram,tiktok} ausente');
  return dados;
}

/* ------- 2) Remapear para o formato do nosso dados.js ------- */

function metricasInstagram(m) {
  return [
    { rotulo: 'Seguidores',            valor: null }, // preenchido fora (é fixo p/ os 2 períodos)
    { rotulo: 'Impressões',            valor: m.impressions },
    { rotulo: 'Curtidas',              valor: m.likes },
    { rotulo: 'Alcance médio',         valor: m.averageReach },
    { rotulo: 'Alcance total',         valor: m.totalReach },
    { rotulo: 'Engajamento dos posts', valor: m.postsEngagement }
  ];
}

function metricasTiktok(m) {
  return [
    { rotulo: 'Seguidores',            valor: null },
    { rotulo: 'Impressões',            valor: m.impressions },
    { rotulo: 'Curtidas',              valor: m.likes },
    { rotulo: 'Engajamento dos posts', valor: m.engagement },
    { rotulo: 'Engajamento médio',     valor: m.averageEngagement }
  ];
}

// injeta o valor de Seguidores (fixo) em cada lista de métricas
function comSeguidores(lista, seguidores) {
  return lista.map(x => x.rotulo === 'Seguidores' ? { rotulo: 'Seguidores', valor: seguidores } : x);
}

function montarDados(d) {
  const ig = d.instagram, tt = d.tiktok;

  // -- destaques do topo: soma das 2 redes (28 dias) --
  const destaques = {
    seguidores: ig.followers + tt.followers,
    impressoes: ig.metrics['28d'].impressions + tt.metrics['28d'].impressions,
    curtidas:   ig.metrics['28d'].likes + tt.metrics['28d'].likes
  };

  // -- público (só Instagram) --
  const g = ig.gender;
  const totalGenero = g.female + g.male + g.others;
  const genero = [
    { rotulo: 'Feminino',  percentual: paraPercentual(g.female, totalGenero) },
    { rotulo: 'Masculino', percentual: paraPercentual(g.male,   totalGenero) },
    { rotulo: 'Outros',    percentual: paraPercentual(g.others, totalGenero) }
  ];

  const a = ig.age;
  const totalIdade = Object.values(a).reduce((s, v) => s + v, 0);
  const faixasEtarias = Object.keys(a).map(faixa => ({
    rotulo: faixa,
    percentual: paraPercentual(a[faixa], totalIdade)
  }));

  const localidades = ig.location.map(l => ({
    cidade: l.city,
    estado: l.province || '-',
    usuarios: l.value,
    percentual: l.percentage
  }));

  // OBS: o RPA NÃO gera "conteudos"/parcerias — isso é manual em js/parcerias.js.

  return {
    atualizadoEm: formatarDataHora(d.extractedAt),
    destaques,
    redes: {
      instagram: {
        nome: 'Instagram', usuario: '@iibiank', link: 'https://instagram.com/iibiank',
        periodos: {
          '7dias':  comSeguidores(metricasInstagram(ig.metrics['7d']),  ig.followers),
          '28dias': comSeguidores(metricasInstagram(ig.metrics['28d']), ig.followers)
        }
      },
      tiktok: {
        nome: 'TikTok', usuario: '@iibiank', link: 'https://tiktok.com/@iibiank',
        periodos: {
          '7dias':  comSeguidores(metricasTiktok(tt.metrics['7d']),  tt.followers),
          '28dias': comSeguidores(metricasTiktok(tt.metrics['28d']), tt.followers)
        }
      }
    },
    publico: { genero, faixasEtarias, localidades }
  };
}

/* ------- 3) Escrever js/dados.js ------- */
function escreverArquivo(dados) {
  const cabecalho =
`/**
 * DADOS DO MÍDIA KIT — GERADO AUTOMATICAMENTE
 * ------------------------------------------------------------------
 * NÃO edite à mão: este arquivo é reescrito pelo RPA.
 * Para atualizar os números, rode:  node rpa/atualizar-dados.js
 * Fonte: ${URL_PLAYNEST}
 * Gerado em: ${new Date().toISOString()}
 */

window.DADOS_MIDIA_KIT = `;

  const conteudo = cabecalho + JSON.stringify(dados, null, 2) + ';\n';
  fs.writeFileSync(ARQUIVO_SAIDA, conteudo, 'utf8');
}

/* ------- Execução ------- */
(async () => {
  try {
    console.log(`[RPA] Baixando ${URL_PLAYNEST} ...`);
    const brutos = await baixarDadosPlaynest();
    const dados = montarDados(brutos);
    escreverArquivo(dados);

    console.log(`[RPA] OK — js/dados.js atualizado (dados de ${dados.atualizadoEm}).`);
    console.log(`      Destaques: ${abreviar(dados.destaques.seguidores)} seguidores · ` +
                `${abreviar(dados.destaques.impressoes)} impressões · ` +
                `${abreviar(dados.destaques.curtidas)} curtidas`);
    console.log(`      Cidades: ${dados.publico.localidades.length}`);
    console.log(`\n      Lembrete: suba o js/dados.js atualizado para a hospedagem.`);
  } catch (erro) {
    console.error('\n[RPA] FALHOU:', erro.message);
    console.error('      js/dados.js NÃO foi alterado.');
    process.exit(1);
  }
})();
