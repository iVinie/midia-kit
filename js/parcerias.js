/**
 * PARCERIAS — editável à mão (NÃO é tocado pelo RPA)
 * ------------------------------------------------------------------
 * Cada item vira um card no carrossel da seção "Parcerias".
 * A parceria aparece na aba da rede indicada em "rede".
 * Campos:
 *   rede       -> "Instagram" ou "TikTok" (define o ícone)
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
    "data": "29/05/2026",
    "descricao": "Reels orgânico com utilização para divulgação de serviço.",
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
    "data": "10/05/2026",
    "descricao": "Reels estilo unboxing para apresentação,  demonstração e utilização do produto.",
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
    "data": "28/04/2026",
    "descricao": "Reels no estilo problema x solução, para divulgação de diferencial do produto.",
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
    "data": "21/04/2026",
    "descricao": "Reels estilo unboxing para apresentação do produto em lançamento.",
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
  }
];
