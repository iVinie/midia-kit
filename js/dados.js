/**
 * DADOS DO MÍDIA KIT
 * ------------------------------------------------------------------
 * Este é o ÚNICO arquivo que precisa ser editado para atualizar números.
 * Nada de HTML ou CSS: mexa só aqui.
 *
 * Os valores são números puros (sem ponto, sem "k"). A formatação
 * "17,4k" é feita automaticamente pelo js/principal.js.
 *   Exemplo: 17400 vira "17,4k"  ·  384 continua "384"
 *
 * Quando a API do Instagram/TikTok for ligada, o servidor regrava
 * este mesmo arquivo — a estrutura abaixo não muda. Ver LEIA-ME.md.
 */

window.DADOS_MIDIA_KIT = {

  /* Data mostrada no rodapé da seção Performance */
  atualizadoEm: '24/07/2026 às 12:04',

  /* Números grandes do topo da página (soma das duas redes) */
  destaques: {
    seguidores: 26100,
    impressoes: 717200,
    curtidas: 80800
  },

  /* ------------------------------------------------------------------
     MÉTRICAS POR REDE E POR PERÍODO
     A ordem das métricas aqui é a ordem que aparece na tela.
     ------------------------------------------------------------------ */
  redes: {

    instagram: {
      nome: 'Instagram',
      usuario: '@iibiank',
      link: 'https://instagram.com/iibiank',
      periodos: {
        '7dias': [
          { rotulo: 'Seguidores',            valor: 17400 },
          { rotulo: 'Impressões',            valor: 191100 },
          { rotulo: 'Curtidas',              valor: 21800 },
          { rotulo: 'Alcance médio',         valor: 11500 },
          { rotulo: 'Alcance total',         valor: 68800 },
          { rotulo: 'Engajamento dos posts', valor: 27600 }
        ],
        '28dias': [
          { rotulo: 'Seguidores',            valor: 17400 },
          { rotulo: 'Impressões',            valor: 620000 },
          { rotulo: 'Curtidas',              valor: 67100 },
          { rotulo: 'Alcance médio',         valor: 14200 },
          { rotulo: 'Alcance total',         valor: 199400 },
          { rotulo: 'Engajamento dos posts', valor: 82700 }
        ]
      }
    },

    tiktok: {
      nome: 'TikTok',
      usuario: '@iibiank',
      link: 'https://tiktok.com/@iibiank',
      periodos: {
        '7dias': [
          { rotulo: 'Seguidores',            valor: 8700 },
          { rotulo: 'Impressões',            valor: 12900 },
          { rotulo: 'Curtidas',              valor: 1500 },
          { rotulo: 'Engajamento dos posts', valor: 1500 },
          { rotulo: 'Engajamento médio',     valor: 384 }
        ],
        '28dias': [
          { rotulo: 'Seguidores',            valor: 8700 },
          { rotulo: 'Impressões',            valor: 97200 },
          { rotulo: 'Curtidas',              valor: 13800 },
          { rotulo: 'Engajamento dos posts', valor: 15000 },
          { rotulo: 'Engajamento médio',     valor: 1400 }
        ]
      }
    }

  },

  /* ------------------------------------------------------------------
     PÚBLICO — hoje só o Instagram entrega esses dados.
     A seção some sozinha quando a aba TikTok está selecionada.
     ------------------------------------------------------------------ */
  publico: {
    genero: [
      { rotulo: 'Feminino',  percentual: 72.7 },
      { rotulo: 'Masculino', percentual: 16.3 },
      { rotulo: 'Outros',    percentual: 11.1 }
    ],

    faixasEtarias: [
      { rotulo: '13-17', percentual: 1.6 },
      { rotulo: '18-24', percentual: 22.6 },
      { rotulo: '25-34', percentual: 46.4 },
      { rotulo: '35-44', percentual: 19.6 },
      { rotulo: '45-54', percentual: 7.8 },
      { rotulo: '55-64', percentual: 1.6 },
      { rotulo: '65+',   percentual: 0.4 }
    ],

    localidades: [
      { cidade: 'São Paulo',      estado: 'São Paulo',    usuarios: 1300,  percentual: 7.7 },
      { cidade: 'Rio de Janeiro', estado: 'Rio de Janeiro', usuarios: 797, percentual: 4.6 },
      { cidade: 'Recife',         estado: 'Pernambuco',   usuarios: 435,   percentual: 2.5 },
      { cidade: 'Fortaleza',      estado: 'Ceará',        usuarios: 404,   percentual: 2.3 },
      { cidade: 'Outras',         estado: '-',            usuarios: 14400, percentual: 82.9 }
    ]
  },

  /* ------------------------------------------------------------------
     CONTEÚDOS EM ALTA
     "link" é opcional: se preenchido, o cartão vira clicável.
     "capa" é opcional: caminho de uma imagem em imagens/ (ex.: 'imagens/reel-1.jpg').
     ------------------------------------------------------------------ */
  conteudos: [
    {
      rede: 'Instagram', formato: 'Reels', data: '29/05/2026 às 17:01',
      capa: '', link: 'https://instagram.com/iibiank',
      metricas: { views: 511300, curtidas: 38500, comentarios: 635, compartilhamentos: 20800, salvamentos: 2600, alcance: 358000, engajamento: 62900 }
    },
    {
      rede: 'Instagram', formato: 'Reels', data: '14/07/2026 às 17:59',
      capa: '', link: 'https://instagram.com/iibiank',
      metricas: { views: 115400, curtidas: 28500, comentarios: 2500, compartilhamentos: 3400, salvamentos: 1400, alcance: 89400, engajamento: 36800 }
    },
    {
      rede: 'Instagram', formato: 'Reels', data: '01/06/2026 às 17:52',
      capa: '', link: 'https://instagram.com/iibiank',
      metricas: { views: 161000, curtidas: 14700, comentarios: 286, compartilhamentos: 1800, salvamentos: 1700, alcance: 108300, engajamento: 18600 }
    },
    {
      rede: 'Instagram', formato: 'Reels', data: '08/06/2026 às 17:15',
      capa: '', link: 'https://instagram.com/iibiank',
      metricas: { views: 56200, curtidas: 6600, comentarios: 167, compartilhamentos: 579, salvamentos: 902, alcance: 40600, engajamento: 8400 }
    },
    {
      rede: 'Instagram', formato: 'Reels', data: '13/07/2026 às 18:19',
      capa: '', link: 'https://instagram.com/iibiank',
      metricas: { views: 25900, curtidas: 2500, comentarios: 32, compartilhamentos: 101, salvamentos: 74, alcance: 14400, engajamento: 2700 }
    },
    {
      rede: 'Instagram', formato: 'Reels', data: '22/05/2026 às 18:29',
      capa: '', link: 'https://instagram.com/iibiank',
      metricas: { views: 24400, curtidas: 2100, comentarios: 47, compartilhamentos: 93, salvamentos: 90, alcance: 14100, engajamento: 2300 }
    }
  ]

};
