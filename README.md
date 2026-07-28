# Mídia Kit — Bianca Marques

Página estática (HTML + CSS + JavaScript puro, sem build) com as métricas de
Instagram e TikTok da creator **@iibiank**, para envio a marcas e agências.

- **Publicar / atualizar números / integrar API:** ver [LEIA-ME.md](LEIA-ME.md)
- **Histórico de decisões técnicas:** ver [docs/process-log.md](docs/process-log.md)

## Estrutura

| Arquivo | Para quê |
| --- | --- |
| `index.html` | Textos fixos (bio, nichos, contato) e esqueleto das seções |
| `css/estilos.css` | Visual. Todas as cores ficam no `:root` do topo |
| `js/dados.js` | **Os números.** Único arquivo que muda no dia a dia |
| `js/principal.js` | Monta a tela a partir do `dados.js` |
| `imagens/` | `perfil.jpg` e `favicon.png` |

Para ver localmente, basta abrir o `index.html` no navegador.
