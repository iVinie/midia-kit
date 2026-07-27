/**
 * PARCERIAS — editável à mão (NÃO é tocado pelo RPA)
 * ------------------------------------------------------------------
 * Cada item vira um card no carrossel da seção "Parcerias".
 * A parceria aparece na aba da rede indicada em "rede".
 * Campos:
 *   rede       -> "Instagram" ou "TikTok" (define a aba e o ícone)
 *   formato    -> "Reels", "Vídeo", "Publipost"...
 *   data       -> texto livre, ex.: "Ago/2026"
 *   descricao  -> texto curto explicando o que foi a parceria (opcional)
 *   capa       -> caminho de imagem (opcional), ex.: "imagens/parcerias/marca.jpg"
 *   link       -> link do post/vídeo (opcional; se tiver, o card vira clicável)
 *   metricas   -> só o que quiser mostrar; o resto some sozinho
 * ------------------------------------------------------------------ */

window.DADOS_PARCERIAS = [
  {
    "rede": "Instagram",
    "formato": "Reels",
    "data": "29/05/2026 às 17:01",
    "descricao": "Campanha com a Higiebox 1 reels.",
    "capa": "/imagens/parcerias/higiebox.webp",
    "link": "https://www.instagram.com/reel/DY72tN-xHLm/",
    "metricas": {
      "views": 512134,
      "curtidas": 38600,
      "comentarios": 635,
      "compartilhamentos": 20829,
      "salvamentos": 2579,
      "alcance": 358159,
      "engajamento": 63006
    }
  },
  {
    "rede": "Instagram",
    "formato": "Reels",
    "data": "28/04/2026 às 17:59",
    "descricao": "Blaise - Problema x Solução",
    "capa": "/imagens/parcerias/blaise.jpeg",
    "link": "https://www.instagram.com/reels/DXrfWmmE-1r/",
    "metricas": {
      "views": 21734,
      "curtidas": 1200,
      "comentarios": 58,
      "compartilhamentos": 203,
      "salvamentos": 337,
      "alcance": 16595,
      "engajamento": 1.803
    }
  },
  {
    "rede": "Instagram",
    "formato": "Reels",
    "data": "10/05/2026 às 17:52",
    "descricao": "Studio 11 - Customização",
    "capa": "/imagens/parcerias/studio11.webp",
    "link": "https://www.instagram.com/reels/DYLJhSNTAXw/",
    "metricas": {
      "views": 12466,
      "curtidas": 565,
      "comentarios": 38,
      "compartilhamentos": 29,
      "salvamentos": 55,
      "alcance": 8026,
      "engajamento": 694
    }
  },
  {
    "rede": "Instagram",
    "formato": "Reels",
    "data": "08/06/2026 às 17:15",
    "descricao": "Blaise Unboxing",
    "capa": "/imagens/parcerias/blaise.jpeg",
    "link": "https://www.instagram.com/reels/DXZX5s4k59e/",
    "metricas": {
      "views": 9976,
      "curtidas": 300,
      "comentarios": 25,
      "compartilhamentos": 38,
      "salvamentos": 88,
      "alcance": 6794,
      "engajamento": 452
    }
  },
  {
    "rede": "TikTok",
    "formato": "Vídeo",
    "data": "29/05/2026 às 17:20",
    "descricao": "Ex.: vídeo de unboxing do capacete da Marca Y, com cupom de desconto para a comunidade.",
    "capa": "",
    "link": "https://www.tiktok.com/@iibiank/video/7645401529251417365?utm_campaign=tt4d_open_api&utm_source=aw77esvx2dqumjlw",
    "metricas": {
      "views": 388955,
      "curtidas": 40997,
      "comentarios": 387,
      "compartilhamentos": 4774,
      "engajamento": 46158
    }
  },
  {
    "rede": "TikTok",
    "formato": "Vídeo",
    "data": "01/06/2026 às 17:58",
    "descricao": "",
    "capa": "",
    "link": "https://www.tiktok.com/@iibiank/video/7646534201835064596?utm_campaign=tt4d_open_api&utm_source=aw77esvx2dqumjlw",
    "metricas": {
      "views": 122418,
      "curtidas": 13548,
      "comentarios": 258,
      "compartilhamentos": 452,
      "engajamento": 14258
    }
  },
  {
    "rede": "TikTok",
    "formato": "Vídeo",
    "data": "24/04/2026 às 18:29",
    "descricao": "",
    "capa": "",
    "link": "https://www.tiktok.com/@iibiank/video/7632441066444147988?utm_campaign=tt4d_open_api&utm_source=aw77esvx2dqumjlw",
    "metricas": {
      "views": 83459,
      "curtidas": 10353,
      "comentarios": 150,
      "compartilhamentos": 141,
      "engajamento": 10644
    }
  },
  {
    "rede": "TikTok",
    "formato": "Vídeo",
    "data": "08/06/2026 às 17:34",
    "descricao": "",
    "capa": "",
    "link": "https://www.tiktok.com/@iibiank/video/7649125718311423252?utm_campaign=tt4d_open_api&utm_source=aw77esvx2dqumjlw",
    "metricas": {
      "views": 63830,
      "curtidas": 9194,
      "comentarios": 135,
      "compartilhamentos": 214,
      "engajamento": 9543
    }
  },
  {
    "rede": "TikTok",
    "formato": "Vídeo",
    "data": "16/07/2026 às 10:14",
    "descricao": "",
    "capa": "",
    "link": "https://www.tiktok.com/@iibiank/video/7663113548746509588?utm_campaign=tt4d_open_api&utm_source=aw77esvx2dqumjlw",
    "metricas": {
      "views": 35382,
      "curtidas": 8136,
      "comentarios": 679,
      "compartilhamentos": 261,
      "engajamento": 9076
    }
  },
  {
    "rede": "TikTok",
    "formato": "Vídeo",
    "data": "06/05/2026 às 19:11",
    "descricao": "",
    "capa": "",
    "link": "https://www.tiktok.com/@iibiank/video/7636904740990815508?utm_campaign=tt4d_open_api&utm_source=aw77esvx2dqumjlw",
    "metricas": {
      "views": 76217,
      "curtidas": 8517,
      "comentarios": 137,
      "compartilhamentos": 121,
      "engajamento": 8775
    }
  }
];
