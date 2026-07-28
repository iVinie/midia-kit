# bianca-midia-kit

Objetivo: mídia kit público da creator Bianca Marques (@iibiank) para fechar publis com marcas — substitui o link do Playnest por um domínio dela.

Stack: HTML + CSS + JS puro, sem build · Porquê: cliente vai hospedar em Hostinger/HostGator (FTP, sem Node); página única não justifica framework.

Rodar: abrir `index.html` no navegador · Build: não tem · Publicar: enviar o conteúdo da pasta para `public_html/`

Estrutura:
- `index.html` — textos fixos (bio, nichos, contato, CTA) e o esqueleto das seções
- `css/estilos.css` — `:root` com toda a paleta; mobile-first, quebras em 620px e 900px
- `js/dados.js` — todos os números (métricas, público, conteúdos); único arquivo de manutenção
- `js/principal.js` — renderiza a partir do `dados.js`; abas de rede e filtro de período

Regras próprias:
- **Nomes em PT-BR** — classes, ids, funções e variáveis. Cliente edita sem saber inglês.
- Nenhum número escrito direto no HTML/JS: sempre em `js/dados.js`.
- Valores são inteiros crus (`17400`); a formatação `17,4k` é do `formatarNumero()`.
- Zero dependência externa além da fonte do Google Fonts. Nada de framework ou lib de gráfico — rosca e barras são CSS puro.
- Ao alterar css/js, subir o `?v=N` no `index.html` (cache de hospedagem compartilhada).
- Público é só do Instagram; a seção se esconde sozinha na aba TikTok.
