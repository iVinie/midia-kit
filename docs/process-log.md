# Process log — bianca-midia-kit

## 2026-07-24 — Primeira versão da página

- **Objetivo:** recriar como site próprio o mídia kit que hoje vive em `app.playnest.com.br/bianca-marques-rodrigues`, para a cliente hospedar em domínio dela (Hostinger ou HostGator, a decidir).

- **Arquivos criados:** `index.html`, `css/estilos.css`, `js/dados.js`, `js/principal.js`, `LEIA-ME.md`, `CLAUDE.md`, `docs/process-log.md`.

- **Levantamento:** abri o mídia kit original no navegador e extraí (a) a paleta real via `getComputedStyle` — coral `#FD9E8A`, laranja `#E54D2E`, vermelho de texto `#CB3314`, preto `#1C1C1C`, cinza `#706B76`; (b) os quatro estados de métrica (Instagram e TikTok × 7 e 28 dias), alternando as abas por script; (c) público e conteúdos em alta.

- **Decisões técnicas:**
  - **HTML/CSS/JS puro, zero build.** Hospedagem compartilhada não roda Node; entrega via FTP tem que funcionar sem etapa de compilação.
  - **Dados separados da view** (`js/dados.js` com `window.DADOS_MIDIA_KIT`). Cliente atualiza número sem tocar em HTML, e um futuro script PHP regrava esse mesmo arquivo sem alterar mais nada.
  - **`<script>` em vez de `fetch('dados.json')`** — `fetch` quebra por CORS quando o arquivo é aberto direto do disco (`file://`), o que atrapalharia o teste local dela.
  - **Nomes em PT-BR** (`.cartao-metrica`, `montarConteudos`, `formatarNumero`) por pedido explícito da cliente.
  - **Rosca e barras em CSS puro** (`conic-gradient` + largura relativa ao maior valor). Evita 60kb+ de biblioteca de gráfico numa página de uma tela só.
  - **Valores inteiros crus + `formatarNumero()`** em vez de string `"17,4k"` no arquivo de dados: é o formato que a API devolve, então a troca para automático não exige reescrever nada.
  - **`?v=N` nos links de css/js**: hospedagem compartilhada não invalida cache, e a cliente vai reenviar arquivos por FTP.

- **Correções durante a validação:**
  - Cartões de conteúdo apareciam também na aba TikTok (dados são só de Instagram) → passei a filtrar por `conteudo.rede` e a mostrar aviso quando a rede não tem conteúdo cadastrado.
  - Estouro horizontal em 375px: a tabela de localidade (`min-width: 460px`) esticava o cartão porque item de grid tem `min-width: auto` → adicionado `min-width: 0` em `.cartao-publico` e `.rolagem-tabela`.
  - Placeholder da foto mostrava o texto alternativo e o ícone de imagem quebrada → `font-size: 0` + `color: transparent` na classe `.perfil__foto--vazia`.

- **Validação executada:** página aberta no navegador; console sem erros; conferido render dos 3 destaques, das 6 métricas do Instagram/28d, dos 7 grupos etários, das 5 cidades e dos 6 conteúdos; troca de aba (Instagram ↔ TikTok) e de período (7 ↔ 28 dias) recalculando os cartões e escondendo a seção Público no TikTok; `aria-selected` acompanhando a aba ativa; zero estouro horizontal a 375px; screenshots de topo, performance e público conferidos.

- **Resultado:** página completa e navegável, pronta para subir em `public_html/`. Pendências que dependem da cliente: `imagens/perfil.jpg` e `imagens/favicon.png`.

- **Próximo passo:** definir a hospedagem e subir. Se ela quiser atualização automática das métricas, montar `atualizar-dados.php` + cron diário (análise das APIs de Instagram e TikTok já registrada no `LEIA-ME.md`).

## 2026-07-24 — `.gitignore`

- **Objetivo:** proteger credenciais e evitar lixo no repositório.
- **Arquivos:** `.gitignore` (novo).
- **Decisão técnica:** o foco são segredos e configuração de deploy — `config.php`, `.env`, `*.token` (tokens de Instagram/TikTok do futuro `atualizar-dados.php`) e arquivos de FTP (`.ftpconfig`, `sftp-config.json`), que guardam senha da hospedagem em texto puro. Somados a lixo de SO/editor, backups e logs. Nada do site em si é ignorado.
- **Validação:** conferido que nenhum padrão casa com `index.html`, `css/`, `js/` ou `imagens/`.
- **Próximo passo:** rodar `git init` na pasta quando for versionar (o vault hoje não é repositório).

## 2026-07-24 — Ícones (webp) e favicon/foto de perfil

- **Objetivo:** colocar na página os ícones do mídia kit original, que a cliente subiu em `.webp`, nos mesmos lugares; usar a foto do perfil (@) como favicon.
- **Arquivos:** `index.html`, `css/estilos.css`, `js/principal.js`, `imagens/**` (renomeados), `imagens/icones/ICONES.md`.
- **Levantamento:** o original usa Font Awesome (SVG inline). Mapeei ícone→rótulo via script no site (`svg.fa-*` + texto do card mais próximo). Os arquivos chegaram com nomes automáticos (`imgi_N_default.webp`); montei uma folha de contato HTML e identifiquei cada um por screenshot, depois renomeei para PT-BR e movi para `imagens/icones/`. Duplicados (setas do carrossel, versões repetidas em vermelho) e 2 fotos extras foram para `imagens/_extras/`.
- **Decisões técnicas:**
  - **Recolorir por CSS (`mask-image` + `background:currentColor`)** em vez de `<img>`. Os webp são monocromáticos com fundo transparente (confirmei alpha=0 via canvas); assim o mesmo arquivo serve em qualquer contexto e a cor sai do `:root` — aba ativa fica branco, rótulo fica vermelho, título fica laranja, tudo sem arquivo duplicado. Reproduz o comportamento do original (ícones tingidos por CSS).
  - **Ícone escolhido por classe, não por caminho inline** — `.icone-<nome>` guarda o `mask-image`; o JS só concatena o nome da classe (`iconeDe(mapa, rotulo)`), mantendo o caminho num único lugar (relativo ao CSS).
  - **Favicon = `perfil.webp`** (a foto quadrada 1080 do @, a da moto) e a mesma vira a foto do topo. `type="image/webp"` declarado.
  - **2 ícones ausentes** (bookmark/Salvamentos e circle-plus/Alcance) ficam sem ícone via mapeamento parcial em `ICONES_CONTEUDO` — degrada limpo, sem placeholder quebrado.
- **Validação (browser):** 44 ícones renderizados; `mask-image` resolvido e `background-color` correto por contexto (rede #1C1C1C, aba ativa #fff, título #E54D2E, métricas/conteúdo/e-mail #CB3314); foto de perfil carregada (não caiu no placeholder); favicon = perfil.webp; console sem erros; screenshots de topo, performance e conteúdos conferidos contra o original.
- **Resultado:** ícones nos mesmos lugares do original, na mesma cor, trocável pelo `:root`. Pendente: subir `salvamentos.webp` e `alcance-conteudo.webp`.
- **Próximo passo:** ao receber os 2 ícones, destravar as 2 linhas em `ICONES_CONTEUDO` (`js/principal.js`) e subir `?v` do JS.

## 2026-07-24 — Correção: ícones não apareciam no Chrome (file://)

- **Sintoma:** aberta direto do disco (`file://`) no Chrome, a foto do perfil aparecia mas nenhum ícone.
- **Causa:** os ícones eram `mask-image: url(imagens/icones/*.webp)`. O Chrome trata a imagem de uma máscara CSS como recurso **cross-origin** e, sob `file://` (cada arquivo é origem única), **bloqueia** a máscara — por isso `<img>` (foto) funcionava e a máscara não. Via `http://` (Hostinger) funcionaria, mas a cliente abre local.
- **Correção:** gerado `css/icones.css` com cada ícone embutido como **data URI base64** (mesma origem → máscara nunca bloqueada). `estilos.css` perdeu as 14 regras `url(../imagens/icones/...)` (viraram comentário apontando para `icones.css`), que agora é carregado depois. Mantida a recolorização por `currentColor`.
- **Também corrigido:** favicon com barra invertida (`imagens\_extras/fav.webp` → `/`, quebraria no Linux) e `og:image` apontando para `perfil.jpg` inexistente (→ `perfil.webp`).
- **Regenerar `icones.css`** (após trocar/adicionar webp em `imagens/icones/`): rodar no PowerShell o script que lê cada `.webp`, converte para base64 e escreve `.icone-<nome>{mask-image:url("data:image/webp;base64,...")}` (registrado no histórico do chat). Depois subir `?v` de `icones.css` no `index.html`.
- **Validação (browser):** `maskImage` computado agora é `url("data:image/webp;base64,...")`; nenhuma regra referencia mais `imagens/icones/*.webp` (`file://`); 44 ícones; console sem erros; screenshots conferidos. Versões: `estilos.css?v=5`, `icones.css?v=1`.
- **Observação p/ deploy:** `icones.css` tem ~69 KB (14 ícones embutidos), mas elimina 14 requisições e resolve o `file://`. Aceitável para página única.

## 2026-07-24 — Cabeçalho estilo "banner + card", enquadramento e TEMA ESCURO

- **Objetivo:** (1) cabeçalho com a foto natural em banner e o perfil num card sobrepondo; (2) ajustar o enquadramento da foto; (3) converter a paleta para tema escuro.
- **Arquivos:** `index.html`, `css/estilos.css`.
- **Banner + card:** `.cabecalho` deixou de ter o véu coral; adicionado `.banner` (foto natural, largura total, `background-image` — que, ao contrário de `mask-image`, carrega normal via file://) e `.cartao-perfil` (card sobrepondo o banner via `margin-top` negativo). Botões de rede passaram a usar `--cor-coral-suave` (o `rgba(255,255,255,.65)` sumiria no card).
- **Enquadramento:** `background-position` do banner de `center 28%/24%` → `center 48%/46%` para centralizar o piloto (a foto é retrato; o banner é faixa larga, então o Y% escolhe a faixa vertical visível).
- **Tema escuro (via `:root`):** os papéis de `--cor-branco` e `--cor-preto` foram **invertidos** — `--cor-branco` virou a superfície escura dos cards (#211B19) e `--cor-preto` virou o texto claro (#F2EDEB); `--cor-fundo` #141110. Assim ~20 regras de card/texto viraram dark sem edição individual. Adicionada `--cor-clara` (#FFFFFF) para os poucos pontos de branco real sobre laranja (aba ativa, selo REELS, CTA, rodapé). Números em `--cor-vermelho-texto` clareados para #FF9068 (contraste no escuro); `--cor-borda` virou `rgba(255,255,255,.08)`; grafico-3 ("Outros") para tom quente discreto; sombra mais forte.
- **Impressão:** `@media print` agora reprograma o `:root` de volta ao claro (fundo branco, texto escuro) — o dark gastaria tinta e ficaria ilegível no papel; banner com `print-color-adjust: exact`.
- **Validação (browser):** computados conferidos — página #141110, cards #211B19, texto #F2EDEB, número #FF9068, aba ativa branca, rodapé #0F0C0B/texto branco; grep confirmou nenhuma cor clara hardcoded fora do `:root`/print; screenshots de topo, Performance, Público e tabela no escuro; console sem erros. `estilos.css?v=9`.
- **Nota de sincronia:** a cliente vinha editando/vendo uma versão escura própria (números 26,8k etc.) enquanto o arquivo em disco estava claro. Ela confirmou "só queria o enquadramento" e depois pediu o tema escuro — agora o arquivo em disco é a versão oficial escura.

## 2026-07-24 — Ícones faltantes (Salvamentos e Alcance) adicionados

- **Objetivo:** completar os 2 ícones que faltavam nos cards de conteúdo.
- **A cliente subiu** `imgi_23`/`imgi_24` em `imagens/`. Identifiquei: 23 = bookmark, 24 = circle-plus. Movidos e renomeados para `icones/salvamentos.webp` e `icones/alcance-conteudo.webp` (nome distinto do `alcance.webp`/raio da Performance).
- **Ligados** em `ICONES_CONTEUDO` (`js/principal.js`): `Salvamentos→salvamentos`, `Alcance→alcance-conteudo`.
- **Regenerado** `css/icones.css` (agora 16 classes, ~83 KB). Versões: `icones.css?v=2`, `principal.js?v=3`.
- **Validação:** os 2 rótulos passaram a ter `.icone` com máscara data URI e cor coral; screenshot do card confirma os 7 metrics com ícone; console sem erros.
- **Conjunto de ícones agora COMPLETO** (16). Nada pendente.

## 2026-07-24 — Formulário de proposta (modal → mailto)

- **Objetivo:** ao clicar em "Enviar proposta por e-mail", abrir um formulário na própria página; ao enviar, abrir o app de e-mail da pessoa já preenchido (destinatário, assunto, corpo).
- **Arquivos:** `index.html` (botão vira `<button>` + `<dialog>` do formulário), `css/estilos.css` (estilos do modal), `js/principal.js` (`ligarFormularioProposta`).
- **Decisão técnica:** `mailto:` montado no cliente a partir do `FormData` (nome, marca, tipo, mensagem) com `encodeURIComponent` — **zero backend**, roda em Hostinger/GitHub Pages. `<dialog>` nativo (`showModal`) com fallback para atributo `open`; fecha no ×, Cancelar, clique no fundo e ESC. E-mail destino numa constante (`EMAIL_DESTINO`).
- **Limitação conhecida:** `mailto:` abre o cliente de e-mail padrão do dispositivo. No celular sempre funciona; no desktop sem app de e-mail configurado (ex.: quem usa Gmail só no navegador) pode não abrir. Alternativa futura, se necessário: serviço de forms (Formspree) para enviar direto sem depender do app — aí sim viraria envio real server-side.
- **Validação (browser):** modal abre centralizado (352×561), tema escuro correto (fundo #211B19, inputs #141110, botão enviar laranja, texto claro); `mailto:` gerado conferido — `subject=Proposta de parceria — <marca>` e corpo com os campos, acentos e quebras (%0A) corretos; fecha após enviar; console sem erros. `estilos.css?v=10`, `principal.js?v=4`.

---

**Antes/depois:** antes, o mídia kit só existia dentro do Playnest — URL de terceiro, sem domínio próprio, sem controle sobre layout e sem como registrar a marca dela na apresentação para as agências. Depois, existe um site autônomo com a mesma paleta e os mesmos números, responsivo do celular ao desktop, com abas de rede e filtro de período funcionando, que ela publica em qualquer hospedagem barata por FTP e atualiza editando um único arquivo de números — e que já está estruturado para receber a integração com as APIs do Instagram e do TikTok sem refazer o front.
