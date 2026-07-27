/**
 * PARCERIAS — editável à mão (NÃO é tocado pelo RPA)
 * ------------------------------------------------------------------
 * Cada item vira um card na seção "Parcerias".
 * Campos:
 *   rede       -> "Instagram" ou "TikTok" (aparece o selo)
 *   formato    -> "Reels", "Vídeo", "Publipost"...
 *   data       -> texto livre, ex.: "Ago/2026"
 *   capa       -> caminho de uma imagem (opcional), ex.: "imagens/parcerias/marca.jpg"
 *                 deixe "" para não mostrar imagem
 *   link       -> link do post/vídeo (opcional; se tiver, o card vira clicável)
 *   metricas   -> só o que você quiser mostrar; o resto some sozinho
 * ------------------------------------------------------------------ */

window.DADOS_PARCERIAS = [
  {
    "rede": "Instagram",
    "formato": "Reels",
    "data": "29/05/2026 às 17:01",
    "capa": "",
    "link": "https://www.instagram.com/reel/DY72tN-xHLm/",
    "metricas": {
      "views": 511939,
      "curtidas": 38600,
      "comentarios": 635,
      "compartilhamentos": 20829,
      "salvamentos": 2579,
      "alcance": 358159,
      "engajamento": 62985
    }
  },
  {
    "rede": "Instagram",
    "formato": "Reels",
    "data": "14/07/2026 às 17:59",
    "capa": "",
    "link": "https://www.instagram.com/reel/DayZsvSTwoI/",
    "metricas": {
      "views": 123572,
      "curtidas": 30646,
      "comentarios": 2667,
      "compartilhamentos": 3590,
      "salvamentos": 1547,
      "alcance": 95388,
      "engajamento": 39510
    }
  },
  {
    "rede": "Instagram",
    "formato": "Reels",
    "data": "01/06/2026 às 17:52",
    "capa": "",
    "link": "https://www.instagram.com/reel/DZDq01cT22y/",
    "metricas": {
      "views": 163385,
      "curtidas": 14912,
      "comentarios": 289,
      "compartilhamentos": 1857,
      "salvamentos": 1679,
      "alcance": 109222,
      "engajamento": 18838
    }
  },
  {
    "rede": "Instagram",
    "formato": "Reels",
    "data": "08/06/2026 às 17:15",
    "capa": "",
    "link": "https://www.instagram.com/reel/DZVoRfyp4ye/",
    "metricas": {
      "views": 57889,
      "curtidas": 6852,
      "comentarios": 172,
      "compartilhamentos": 599,
      "salvamentos": 929,
      "alcance": 41586,
      "engajamento": 8631
    }
  },
  {
    "rede": "Instagram",
    "formato": "Reels",
    "data": "13/07/2026 às 18:19",
    "capa": "",
    "link": "https://www.instagram.com/reel/Dav3ULxzaTh/",
    "metricas": {
      "views": 27167,
      "curtidas": 2601,
      "comentarios": 31,
      "compartilhamentos": 107,
      "salvamentos": 80,
      "alcance": 14961,
      "engajamento": 2871
    }
  },
  {
    "rede": "Instagram",
    "formato": "Reels",
    "data": "22/05/2026 às 18:29",
    "capa": "",
    "link": "https://www.instagram.com/reel/DYp_KMMTopb/",
    "metricas": {
      "views": 24740,
      "curtidas": 2095,
      "comentarios": 49,
      "compartilhamentos": 99,
      "salvamentos": 91,
      "alcance": 14243,
      "engajamento": 2353
    }
  },
  {
    "rede": "TikTok",
    "formato": "Vídeo",
    "data": "29/05/2026 às 17:20",
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
