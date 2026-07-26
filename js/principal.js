/**
 * MÍDIA KIT — LÓGICA DA PÁGINA
 * ------------------------------------------------------------------
 * Lê os números de js/dados.js e monta a tela.
 * Não precisa editar este arquivo para atualizar métricas.
 */

(function () {
  'use strict';

  var dados = window.DADOS_MIDIA_KIT;
  if (!dados) {
    console.error('[Mídia Kit] js/dados.js não foi carregado antes de js/principal.js.');
    return;
  }

  /* Estado atual da tela */
  var redeSelecionada = 'instagram';
  var periodoSelecionado = '28dias';

  var rotuloPeriodo = {
    '7dias': 'Últimos 7 dias',
    '28dias': 'Últimos 28 dias'
  };

  /* Rótulo da métrica -> nome do ícone (arquivo em imagens/icones/).
     Rótulo sem entrada aqui simplesmente não recebe ícone. */
  var ICONES_METRICA = {
    'Seguidores':            'pessoas',
    'Impressões':            'visualizacoes',
    'Curtidas':              'curtidas',
    'Alcance médio':         'alcance',
    'Alcance total':         'alcance',
    'Engajamento dos posts': 'engajamento-posts',
    'Engajamento médio':     'engajamento'
  };

  var ICONES_CONTEUDO = {
    'Views':        'visualizacoes',
    'Curtidas':     'curtidas',
    'Comentários':  'comentarios',
    'Compart.':     'compartilhamentos',
    'Engajamento':  'engajamento',
    'Salvamentos':  'salvamentos',       // bookmark
    'Alcance':      'alcance-conteudo'    // circle-plus (distinto do 'alcance'/raio da Performance)
  };

  /* ----------------------------------------------------------------
     FUNÇÕES AUXILIARES
     ---------------------------------------------------------------- */

  /** 17400 -> "17,4k"  ·  384 -> "384"  ·  1300000 -> "1,3M" */
  function formatarNumero(numero) {
    if (typeof numero !== 'number' || isNaN(numero)) return '—';
    if (numero >= 1000000) return trocarPonto((numero / 1000000).toFixed(1)) + 'M';
    if (numero >= 1000)    return trocarPonto((numero / 1000).toFixed(1)) + 'k';
    return String(numero);
  }

  /** Decimal no padrão brasileiro: "17.4" -> "17,4" (e some o ",0") */
  function trocarPonto(texto) {
    return texto.replace('.0', '').replace('.', ',');
  }

  /** 72.7 -> "72,7%" */
  function formatarPercentual(valor) {
    return trocarPonto(valor.toFixed(1)) + '%';
  }

  function buscar(id) {
    return document.getElementById(id);
  }

  /** Devolve o <span> do ícone para um rótulo, ou '' se não houver mapeamento. */
  function iconeDe(mapa, rotulo) {
    var nome = mapa[rotulo];
    return nome ? '<span class="icone icone-' + nome + '" aria-hidden="true"></span>' : '';
  }

  /* ----------------------------------------------------------------
     TOPO — números de destaque
     ---------------------------------------------------------------- */
  function montarDestaques() {
    buscar('destaqueSeguidores').textContent = formatarNumero(dados.destaques.seguidores);
    buscar('destaqueImpressoes').textContent = formatarNumero(dados.destaques.impressoes);
    buscar('destaqueCurtidas').textContent   = formatarNumero(dados.destaques.curtidas);
    buscar('dataAtualizacao').textContent    = dados.atualizadoEm;
  }

  /* ----------------------------------------------------------------
     PERFORMANCE — cartões de métrica da rede/período escolhidos
     ---------------------------------------------------------------- */
  function montarMetricas() {
    var grade = buscar('gradeMetricas');
    var rede = dados.redes[redeSelecionada];
    var metricas = rede && rede.periodos[periodoSelecionado];

    if (!metricas) {
      grade.innerHTML = '<p class="aviso-atualizacao">Sem dados para este período.</p>';
      return;
    }

    grade.innerHTML = metricas.map(function (metrica) {
      // "Seguidores" é um número total, não faz sentido marcar período nele
      var mostrarPeriodo = metrica.rotulo.toLowerCase() !== 'seguidores';
      return (
        '<div class="cartao-metrica">' +
          '<span class="cartao-metrica__rotulo">' + iconeDe(ICONES_METRICA, metrica.rotulo) + metrica.rotulo + '</span>' +
          '<span class="cartao-metrica__valor">' + formatarNumero(metrica.valor) + '</span>' +
          (mostrarPeriodo
            ? '<span class="cartao-metrica__periodo">' + rotuloPeriodo[periodoSelecionado] + '</span>'
            : '') +
        '</div>'
      );
    }).join('');
  }

  /* ----------------------------------------------------------------
     PÚBLICO — rosca de gênero, barras de idade e tabela de cidades
     ---------------------------------------------------------------- */
  function montarGenero() {
    var fatias = dados.publico.genero;
    var cores = ['var(--cor-grafico-1)', 'var(--cor-grafico-2)', 'var(--cor-grafico-3)'];
    var acumulado = 0;
    var pedacos = [];

    fatias.forEach(function (fatia, indice) {
      var cor = cores[indice % cores.length];
      var inicio = acumulado;
      acumulado += fatia.percentual;
      pedacos.push(cor + ' ' + inicio + '% ' + acumulado + '%');
    });

    buscar('roscaGenero').style.background = 'conic-gradient(' + pedacos.join(', ') + ')';

    buscar('legendaGenero').innerHTML = fatias.map(function (fatia, indice) {
      return (
        '<li class="item-legenda">' +
          '<span class="item-legenda__cor" style="background:' + cores[indice % cores.length] + '"></span>' +
          '<span class="item-legenda__rotulo">' + fatia.rotulo + '</span>' +
          '<span class="item-legenda__valor">' + formatarPercentual(fatia.percentual) + '</span>' +
        '</li>'
      );
    }).join('');
  }

  function montarFaixasEtarias() {
    var faixas = dados.publico.faixasEtarias;
    // A barra mais larga é a maior faixa (leitura comparativa fica melhor)
    var maior = Math.max.apply(null, faixas.map(function (f) { return f.percentual; }));

    buscar('listaFaixasEtarias').innerHTML = faixas.map(function (faixa) {
      var largura = (faixa.percentual / maior) * 100;
      return (
        '<li class="faixa-etaria">' +
          '<span class="faixa-etaria__rotulo">' + faixa.rotulo + '</span>' +
          '<div class="barra" role="img" aria-label="' + faixa.rotulo + ': ' + formatarPercentual(faixa.percentual) + '">' +
            '<div class="barra__preenchimento" style="width:' + largura.toFixed(1) + '%"></div>' +
          '</div>' +
          '<span class="faixa-etaria__valor">' + formatarPercentual(faixa.percentual) + '</span>' +
        '</li>'
      );
    }).join('');
  }

  function montarLocalidades() {
    buscar('corpoTabelaLocalidade').innerHTML = dados.publico.localidades.map(function (local, indice) {
      return (
        '<tr>' +
          '<td>' + (indice + 1) + '</td>' +
          '<td class="celula-cidade">' + local.cidade + '</td>' +
          '<td>' + local.estado + '</td>' +
          '<td>' + formatarNumero(local.usuarios) + '</td>' +
          '<td class="celula-percentual">' + formatarPercentual(local.percentual) + '</td>' +
        '</tr>'
      );
    }).join('');
  }

  /* ----------------------------------------------------------------
     CONTEÚDOS EM ALTA
     ---------------------------------------------------------------- */
  function montarConteudos() {
    var rede = dados.redes[redeSelecionada];

    // Mostra só os conteúdos da rede que está selecionada nas abas
    var conteudosDaRede = dados.conteudos.filter(function (conteudo) {
      return (conteudo.rede || '').toLowerCase() === redeSelecionada;
    });

    if (conteudosDaRede.length === 0) {
      buscar('gradeConteudos').innerHTML =
        '<p class="aviso-sem-conteudo">Ainda não há conteúdos cadastrados para ' +
        (rede ? rede.nome : 'esta rede') + '. Adicione em <code>js/dados.js</code>.</p>';
      return;
    }

    buscar('gradeConteudos').innerHTML = conteudosDaRede.map(function (conteudo) {
      var m = conteudo.metricas;

      var linhas = [
        { rotulo: 'Views',        valor: m.views, destaque: true },
        { rotulo: 'Curtidas',     valor: m.curtidas },
        { rotulo: 'Comentários',  valor: m.comentarios },
        { rotulo: 'Compart.',     valor: m.compartilhamentos },
        { rotulo: 'Salvamentos',  valor: m.salvamentos },
        { rotulo: 'Alcance',      valor: m.alcance },
        { rotulo: 'Engajamento',  valor: m.engajamento }
      ];

      var metricasHtml = linhas.map(function (linha) {
        if (typeof linha.valor !== 'number') return '';
        return (
          '<div class="metrica-conteudo' + (linha.destaque ? ' metrica-conteudo--destaque' : '') + '">' +
            '<span class="metrica-conteudo__rotulo">' + iconeDe(ICONES_CONTEUDO, linha.rotulo) + linha.rotulo + '</span>' +
            '<span class="metrica-conteudo__valor">' + formatarNumero(linha.valor) + '</span>' +
          '</div>'
        );
      }).join('');

      var capa = conteudo.capa
        ? '<img class="cartao-conteudo__capa" src="' + conteudo.capa + '" alt="Capa do conteúdo de ' + conteudo.data + '" loading="lazy">'
        : '';

      var interno =
        '<div class="cartao-conteudo__topo">' +
          '<span class="cartao-conteudo__formato">' + conteudo.formato + '</span>' +
          '<span class="cartao-conteudo__usuario">' + (rede ? rede.usuario : '') + '</span>' +
          '<span class="cartao-conteudo__data">' + conteudo.data + '</span>' +
        '</div>' +
        capa +
        '<div class="cartao-conteudo__metricas">' + metricasHtml + '</div>';

      return conteudo.link
        ? '<a class="cartao-conteudo" href="' + conteudo.link + '" target="_blank" rel="noopener">' + interno + '</a>'
        : '<article class="cartao-conteudo">' + interno + '</article>';
    }).join('');
  }

  /* ----------------------------------------------------------------
     INTERAÇÃO — trocar rede e período
     ---------------------------------------------------------------- */
  function ligarAbasDeRede() {
    var abas = document.querySelectorAll('.aba');

    abas.forEach(function (aba) {
      aba.addEventListener('click', function () {
        redeSelecionada = aba.dataset.rede;

        abas.forEach(function (outra) {
          var ativa = outra === aba;
          outra.classList.toggle('aba--ativa', ativa);
          outra.setAttribute('aria-selected', ativa ? 'true' : 'false');
        });

        // Instagram é a única rede que entrega dados de público hoje
        buscar('publico').classList.toggle('oculto', redeSelecionada !== 'instagram');

        montarMetricas();
        montarConteudos();
      });
    });
  }

  function ligarFiltroDePeriodo() {
    var botoes = document.querySelectorAll('.botao-periodo');

    botoes.forEach(function (botao) {
      botao.addEventListener('click', function () {
        periodoSelecionado = botao.dataset.periodo;

        botoes.forEach(function (outro) {
          outro.classList.toggle('botao-periodo--ativo', outro === botao);
        });

        montarMetricas();
      });
    });
  }

  /* ----------------------------------------------------------------
     INÍCIO
     ---------------------------------------------------------------- */
  /* ----------------------------------------------------------------
     FORMULÁRIO DE PROPOSTA (modal + mailto)
     Ao enviar, abre o app de e-mail da pessoa já preenchido.
     ---------------------------------------------------------------- */
  var EMAIL_DESTINO = 'contato.iibiank@gmail.com';

  function ligarFormularioProposta() {
    var modal   = buscar('modalProposta');
    var fechar  = buscar('fecharFormulario');
    var cancelar= buscar('cancelarFormulario');
    var form    = buscar('formularioProposta');
    // Qualquer elemento com data-abrir-proposta abre o modal (botão da CTA, e-mail...)
    var gatilhos = document.querySelectorAll('[data-abrir-proposta]');
    if (!modal || !form || !gatilhos.length) return;

    // <dialog> nativo: usa showModal() quando existe; senão, cai num atributo
    function abrirModal() {
      if (typeof modal.showModal === 'function') modal.showModal();
      else modal.setAttribute('open', '');
    }
    function fecharModal() {
      if (typeof modal.close === 'function') modal.close();
      else modal.removeAttribute('open');
    }

    gatilhos.forEach(function (g) {
      g.addEventListener('click', function (e) {
        e.preventDefault();   // se for o link de e-mail, ignora o mailto e abre o modal
        abrirModal();
      });
    });
    if (fechar)   fechar.addEventListener('click', fecharModal);
    if (cancelar) cancelar.addEventListener('click', fecharModal);

    // Clicar fora do formulário (no fundo escuro) fecha
    modal.addEventListener('click', function (e) {
      if (e.target === modal) fecharModal();
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var dados = new FormData(form);
      var nome  = (dados.get('nome')     || '').trim();
      var marca = (dados.get('marca')    || '').trim();
      var tipo  = (dados.get('tipo')     || '').trim();
      var msg   = (dados.get('mensagem') || '').trim();

      var assunto = 'Proposta de parceria' + (marca ? ' — ' + marca : (nome ? ' — ' + nome : ''));

      var corpo =
        'Olá, Bianca!\n\n' +
        'Nome: ' + nome + '\n' +
        (marca ? 'Marca/empresa: ' + marca + '\n' : '') +
        'Tipo de parceria: ' + tipo + '\n\n' +
        'Mensagem:\n' + msg + '\n';

      var url = 'mailto:' + EMAIL_DESTINO +
                '?subject=' + encodeURIComponent(assunto) +
                '&body='    + encodeURIComponent(corpo);

      // Abre o app de e-mail da pessoa com tudo preenchido
      window.location.href = url;
      fecharModal();
    });
  }

  function iniciar() {
    montarDestaques();
    montarMetricas();
    montarGenero();
    montarFaixasEtarias();
    montarLocalidades();
    montarConteudos();
    ligarAbasDeRede();
    ligarFiltroDePeriodo();
    ligarFormularioProposta();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }

})();
