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

## 2026-07-26 — RPA que atualiza os números a partir do Playnest

- **Objetivo:** automatizar a atualização dos dados (IG + TikTok, 7 e 28 dias) puxando do mídia kit do Playnest, sem depender das APIs oficiais/App Review.
- **Descoberta chave:** o Playnest é Next.js e entrega TODOS os números embutidos no HTML, no `<script id="__NEXT_DATA__">` (`props.pageProps.data.data`) — confirmei que vêm no HTML cru (fetch simples, sem navegador). Campos com inteiros exatos: `instagram/tiktok.{followers, metrics.{7d,28d}, gender, age, location, trending}`.
- **Arquivos:** `rpa/atualizar-dados.js` (o RPA), `rpa/LEIA-ME.md`. `js/dados.js` passou a ser **gerado** (cabeçalho avisa "não editar à mão").
- **Decisão técnica:** RPA = script Node (fetch → regex extrai `__NEXT_DATA__` → `montarDados` remapeia → reescreve `js/dados.js`). Sem Playwright. Destaques = soma IG+TikTok (28d); gênero/idade viram % a partir das contagens; conteúdos = `trending` de IG + TikTok (TikTok não traz alcance/impressões/salvamentos → viram `undefined`, e o card ignora). `capa` fica vazia (thumbs do Playnest são URLs assinadas que expiram). Valida a estrutura e, em erro, **não** altera o `dados.js`.
- **Validação:** `node rpa/atualizar-dados.js` gerou o `dados.js`; conferência cruzada com o print — destaques 27,1k/743,9k/83,9k (= 18252+8826 / 642639+101235 / 69651+14293); IG 7d 157,2k impressões e 16,7k curtidas batem. Site local recarregado: destaques, métricas das 2 redes/2 períodos, 7 faixas, 5 cidades e 6+6 conteúdos renderizando; console sem erros. Backup do `dados.js` anterior salvo no scratchpad.
- **Só mexe em números.** Bio/nichos/e-mail seguem no `index.html`, intocados.
- **Próximo passo:** escolher agendamento (Task Scheduler no PC, GitHub Action, ou porto para PHP no cron da Hostinger). O RPA não precisa ir para `public_html`.

## 2026-07-26 — RPA portado para PHP (cron da Hostinger)

- **Objetivo:** rodar o RPA sozinho no servidor, já que o site está no Hostinger (cron roda PHP, não Node).
- **Arquivos:** `rpa/atualizar-dados.php` (porte 1:1 do `.js`), `rpa/LEIA-ME.md` (instruções de cron), `.gitignore` (ignora `js/dados.js.tmp`).
- **Decisão técnica:** mesmo pipeline (cURL → regex `__NEXT_DATA__` → `montarDados` → escreve `js/dados.js`). Gravação **atômica** (`.tmp` + `rename`) pra nunca deixar o `dados.js` corrompido no meio de um cron. Trava de acesso: só CLI (cron); via URL exige `?token=` (constante `TOKEN_SECRETO`, precisa ser trocada). `encerrarComErro` tolera web (sem `STDERR`) e CLI.
- **Validação:** NÃO consegui executar PHP localmente (sem PHP no PATH; Docker Desktop não subiu a tempo; download de PHP portátil não resolveu). Fiz revisão linha a linha; a lógica é idêntica ao `.js` já testado com dados reais. Corrigi 1 bug encontrado na revisão: uso de `STDERR` quebraria no disparo via web. **Pendente: teste no próprio servidor** (rodar 1x pelo hPanel/SSH antes de agendar) — documentado no LEIA-ME.
- **Estrutura de pastas no Hostinger é igual à do projeto** (confirmado pela cliente), então `__DIR__ . '/../js/dados.js'` resolve certo.

## 2026-07-26 — Bug: dados atualizam no arquivo mas não no navegador (cache)

- **Sintoma:** o RPA reescreve `js/dados.js` (visível no File Manager), mas o site mostra números velhos, mesmo limpando cache do navegador e do servidor.
- **Causa:** o `dados.js` era carregado com `?v=1` FIXO. Como a URL nunca muda, uma camada de cache (provável CDN/edge do Hostinger, que "limpar cache do servidor" não zera) servia a cópia antiga. O RPA muda o conteúdo mas não a URL, então o cache não invalidava.
- **Correção:** carregar `dados.js` com **timestamp único por visita** via `document.write('<script src="js/dados.js?t=' + Date.now() + '">')` — URL sempre nova fura qualquer cache (mesma-origem, sem intervention do Chrome). Reforçado o `.htaccess`: `FilesMatch (index.html|dados.js)` com `Cache-Control no-cache/no-store`, `Pragma`, `Expires 0` e fallback `mod_expires`.
- **Validação:** `dados.js` carrega como `?t=<ms>`; `window.DADOS_MIDIA_KIT` OK; destaques renderizam; console sem erros/avisos (document.write de script same-origin não dispara intervention).
- **Re-upload:** `index.html`, `.htaccess`. (Depois, limpar o cache do Hostinger 1x pra ele pegar o index.html novo; daí em diante o timestamp resolve sozinho.)

## 2026-07-28 — Nome curto "Bianca Marques" + foto de capa visível no desktop

- **Nome:** trocadas as 8 ocorrências de "Bianca Marques Rodrigues" → "Bianca Marques" em `index.html` (h1, rodapé, `description`, `og:title`, `alt` da foto), `README.md`, `CLAUDE.md`, `LEIA-ME.md`. Grep final: 0 restantes.
- **Foto de capa — diagnóstico:** a imagem é **retrato 1035x1600**. Com `background-size: cover` num banner full-bleed de 1425px de largura, ela renderiza a ~2203px de altura → só **17%** aparecia (daí "só o capacete"). Medi isso no browser; ajustar `background-position` não resolvia, só escolhia QUAL fatia de 17% mostrar.
- **1ª tentativa (descartada):** foto inteira centralizada (`auto 100%`) com backdrop desfocado nas laterais. Mostrava 100% da imagem, mas a cliente esclareceu que quer a foto **preenchendo o fundo todo**, sem tarja — só com mais do tronco visível. Revertido.
- **Solução final:** mantém `cover` full-bleed; ganho vem da **altura maior** + enquadramento. Desktop (≥900px): `height: clamp(380px, 48vh, 480px)` e `background-position: center 53%`. O 53% foi escolhido testando no browser: 50% mostrava capacete mas quase nada de tronco; 55%/71% cortavam o topo do capacete; 53% dá capacete inteiro com folga + tronco e braços até a borda do card.
- **Mobile inalterado:** 200px, `center 48%` (regra base fora do media query).
- **Validação:** desktop 1366px → banner 413px, `cover`, largura total, posição 53%; mobile 390px → 200px, 48%, sem overflow; console limpo. `css v=19`.
- **Re-upload:** `index.html`, `css/estilos.css`.

## 2026-07-27 — "Ver no Instagram/TikTok" vira botão, com ícone da rede

- **Pedido:** botão "Ver no Instagram" / "Ver no TikTok" filtrado pela rede.
- **Estado anterior:** o rótulo já trocava por rede (`'Ver no ' + conteudo.rede`), mas era só uma linha de texto — e todos os 4 itens do `parcerias.js` são Instagram, então na tela só aparecia "Ver no Instagram".
- **Arquivos:** `js/principal.js` (botão passa a incluir o ícone da rede: `icone-instagram`/`icone-tiktok` derivado de `conteudo.rede`), `css/estilos.css` (`.botao-ver-post` = pílula com borda laranja; preenche no `:hover` e no `:active`; substituiu `.cartao-conteudo__abrir`), `index.html` (`css v=16`, `principal v=13`).
- **Validação:** como todos os itens reais são Instagram, adicionei um item TikTok TEMPORÁRIO ao `parcerias.js`, recarreguei e confirmei os 5 botões: 4x "Ver no Instagram → icone-instagram" + 1x "Ver no TikTok → icone-tiktok". Botão com borda/cor `#E54D2E` e raio 999px. **Arquivo restaurado do backup** (4 itens, sem o item de teste — conferido). Console limpo.
- **Re-upload:** `index.html`, `js/principal.js`, `css/estilos.css`.

## 2026-07-27 — Affordance de clique nos cards de Parceria (mobile)

- **Problema:** o único indício de que o card era clicável era o `:hover` — que não existe no toque. No celular o card parecia só informação.
- **Decisão:** afordância explícita ANTES do toque (hover/`:active` só reagem depois). Rodapé "Ver no Instagram/TikTok ↗" (seta external-link em SVG inline) separado por borda, na cor de destaque; renderizado só quando o item tem `link`. Somado a `a.cartao-conteudo:active { scale(.985) }` como feedback tátil.
- **Arquivos:** `js/principal.js` (`verPost` no fim do card), `css/estilos.css` (`.cartao-conteudo__abrir`, `:active`), `index.html` (`css v=15`, `principal v=12`).
- **Validação:** 4/4 cards com link exibem o rodapé; texto "Ver no Instagram"; SVG presente; cor `#FF9068`; alvo de 34px de altura no rodapé e o card inteiro clicável (350x688); console limpo.
- **Re-upload:** `index.html`, `js/principal.js`, `css/estilos.css`.

## 2026-07-27 — Bug: CSS novo não aplicava no site (cache de 7 dias do Hostinger)

- **Sintoma:** no site publicado os cards de Parcerias apareciam empilhados e a seta fora de lugar — visual do CSS antigo, apesar do HTML novo (setas/dica) estar presente.
- **Diagnóstico (curl no site no ar):** os arquivos no servidor estavam CORRETOS (`estilos.css` continha `.carrossel__trilha`/`.carrossel__seta`, `principal.js` com `configurarCarrossel`, `index.html` referenciando `?v=13`/`?v=10`). O problema estava nos headers: `index.html` e `dados.js` vinham com `no-cache` (meu `.htaccess` OK), mas **`estilos.css` e `principal.js` vinham com `Cache-Control: public, max-age=604800`** — padrão do Hostinger/LiteSpeed = 7 dias travados no navegador.
- **Correção:** `.htaccess` — trocado o `FilesMatch (index.html|dados.js)` por `FilesMatch \.(html|css|js)$` com `no-cache, must-revalidate` + `Header unset Expires` (navegador revalida sempre; 304 barato quando não mudou). Imagens seguem com cache longo. Versões bumpadas (`estilos.css?v=14`) para furar o cache já travado nos navegadores.
- **Re-upload:** `.htaccess`, `index.html`.

## 2026-07-27 — Parcerias: lista única (não muda por aba), com logo da rede

- **Pedido:** Parcerias deixa de alternar por aba Instagram/TikTok — vira uma coisa só —, mantendo o logo da rede em cada card.
- **Arquivos:** `js/principal.js` (`montarConteudos` não filtra mais por `redeSelecionada`; empty state genérico; removida a re-renderização no clique das abas), `index.html` (`principal.js?v=11`).
- **Nota:** o logo por card continua vindo do campo `rede` de cada item em `js/parcerias.js` — é ele que define IG ou TikTok no card, independente da aba de Performance.
- **Validação:** 10 cards / 10 bolinhas; lista idêntica antes e depois de trocar a aba; logos por card = 4 Instagram (Reels) + 6 TikTok (Vídeo) na mesma lista; console limpo.
- **Re-upload:** `index.html`, `js/principal.js`.

## 2026-07-26 — Setas de navegação no carrossel (desktop)

- **Pedido:** setas de navegação no carrossel de Parcerias na versão desktop, na cor laranja dos botões.
- **Arquivos:** `index.html` (2 `<button class="carrossel__seta">` com SVG chevron dentro de `.carrossel`; `css v=13`, `principal v=10`), `css/estilos.css` (`.carrossel__seta` laranja/circular, `display:none` no mobile e `inline-flex` a partir de 900px; `.carrossel { padding: 0 52px }` no desktop pra abrir gutter pras setas), `js/principal.js` (em `configurarCarrossel`: `onclick` rola ±1 card com `scrollBy`; `atualizarSetas()` desativa no início/fim, chamada no `onscroll` e no init).
- **Decisão técnica:** gutter de 52px no `.carrossel` (desktop) pra as setas ficarem nas laterais SEM cobrir os cards (confirmado: seta esq termina em x=152, 1º card começa em x=164). Cor `--cor-laranja`; hover `--cor-laranja-escuro`; `disabled` esmaece. Só no desktop (mobile usa arrasto + bolinhas).
- **Validação:** setas visíveis no desktop, cor `rgb(229,77,46)`, esquerda desativada no início / direita ativa; não cobrem card; sem overflow horizontal; console limpo. (Preview não simula o scroll do clique, mas `scrollBy` é padrão.)
- **Re-upload:** `index.html`, `css/estilos.css`, `js/principal.js`.

## 2026-07-26 — Parcerias vira carrossel + campo descrição

- **Pedido:** carrossel (3 no desktop, 1 no mobile), frase itálica cinza em cima ("arraste para o lado para ver mais"), bolinhas embaixo indicando a quantidade, e um campo novo de descrição por parceria.
- **Arquivos:** `index.html` (dica + `.carrossel` > `.carrossel__trilha#gradeConteudos` + `.carrossel__bolas`; `css v=12`, `principal v=9`, `parcerias v=2`), `js/parcerias.js` (campo `descricao` em cada item, header atualizado, 2 exemplos preenchidos), `js/principal.js` (`escaparHtml`; `montarConteudos` monta descrição + chama `configurarCarrossel`; nova função `configurarCarrossel` gera bolinhas, clique rola até o card, `onscroll` marca a bolinha ativa), `css/estilos.css` (`.carrossel*`, `.cartao-conteudo__descricao`; substituídas as regras antigas `.grade-conteudos`).
- **Decisão técnica:** carrossel com **scroll-snap nativo** (arrasta no touch e no desktop, sem biblioteca). Card = `flex:0 0 100%` no mobile; `flex-basis calc((100%-12px)/2)` a partir de 620px (2) e `calc((100%-24px)/3)` a partir de 900px (3). Bolinha ativa = `round(scrollLeft/(larguraCard+gap))`; `GAP=12` no JS bate com o `gap` do CSS. `descricao` escapada com `escaparHtml`. Barra de rolagem escondida.
- **Validação (browser):** desktop 3,0 por tela / mobile 0,97 (=1); dica itálica cinza; 6 cards → 6 bolinhas; card visível casa com a bolinha ativa; descrição renderiza (cor texto-suave); trilha rolável (scrollWidth 2092 > clientWidth). *O preview não simula `scrollLeft` programático, mas a trilha é rolável de verdade e o onscroll é padrão.* Console sem erros.
- **Re-upload:** `index.html`, `js/parcerias.js`, `js/principal.js`, `css/estilos.css`.

## 2026-07-26 — Parcerias: filtrar por aba + ícone da plataforma

- **Pedido:** parceria do TikTok só na aba TikTok e do Instagram só na do Instagram (não misturar); e mostrar o ícone da plataforma em cada card.
- **Arquivos:** `js/principal.js` (`montarConteudos` volta a filtrar por `redeSelecionada`; re-render ao trocar de aba; adiciona `<span class="icone icone-instagram/tiktok cartao-conteudo__rede">` no topo do card via `conteudo.rede`), `css/estilos.css` (`.cartao-conteudo__rede`), `index.html` (`estilos.css?v=11`, `principal.js?v=8`).
- **Validação:** aba IG mostra 6 (todas com `icone-instagram`), aba TikTok mostra 6 (todas `icone-tiktok`); console limpo; screenshot confere "REELS + ícone IG".
- **Re-upload:** `index.html`, `js/principal.js`, `css/estilos.css`.

## 2026-07-26 — "Conteúdos em alta" → "Parcerias" (manual, fora do RPA)

- **Pedido:** renomear a seção para "Parcerias"; RPA deve atualizar só os dados GERAIS (destaques, Performance IG/TikTok 7d/28d, Público) — NÃO os vídeos, que a cliente gerencia à mão.
- **Arquivos:** `index.html` (título "Parcerias"; carrega `js/parcerias.js`; `principal.js?v=7`), `js/parcerias.js` (NOVO, manual, seed com os 12 itens atuais), `js/principal.js` (`montarConteudos` lê `window.DADOS_PARCERIAS`, mostra TODAS independentemente da aba, `onerror` na capa), `rpa/atualizar-dados.php` e `.js` (removido `conteudos` + função `mapearConteudos` + logs), `.htaccess` (no-cache no `dados.js`).
- **Decisão técnica:** desacoplar dado manual (parcerias) do automático (números). Parcerias num arquivo próprio que o RPA nunca toca → edições da cliente não são sobrescritas pelo cron. Cada parceria: rede, formato, data, capa (imagem opcional), link, metricas (opcionais).
- **Cache do `dados.js`:** como o RPA reescreve `dados.js` diariamente sob a MESMA URL (`?v=1` fixo), o navegador poderia servir cópia velha e mostrar números defasados. Adicionado `Header Cache-Control "no-cache, must-revalidate"` só para `dados.js` no `.htaccess` (revalida sempre; resto do site segue cacheado).
- **Validação:** `node rpa/atualizar-dados.js` gera `dados.js` SEM `conteudos` (grep=0) e não quebra; página mostra título "Parcerias", 12 cards vindos de `parcerias.js`, independentes da aba; destaques 27,1k/743,9k/83,9k; console sem erros.
- **Re-upload necessário:** `index.html`, `js/parcerias.js`, `js/principal.js`, `rpa/atualizar-dados.php`, `.htaccess`.

## 2026-07-26 — Deploy no Hostinger + cron do RPA no ar (FUNCIONANDO)

- Site publicado em `iibiank.com` (Hostinger). E-mail de destino trocado para `contato@iibiank.com` (link Sobre + `EMAIL_DESTINO` no `principal.js?v=6`).
- **Cron do RPA funcionando:** saída `[RPA] OK — js/dados.js atualizado (dados de 26/07/2026 às 19:32)...`.
- **Pegadinha do caminho (resolvida):** o cron falhava com `Could not open input file: /home/u402181176/public_html/rpa/atualizar-dados.php`. Causa: na Hostinger o domínio fica em `domains/iibiank.com/public_html/`, mesmo o Gerenciador de Arquivos mostrando só `public_html`. Solução: modo **Personalizado** com caminho absoluto `/usr/bin/php /home/u402181176/domains/iibiank.com/public_html/rpa/atualizar-dados.php`. (Diagnóstico que fecharia a dúvida: `find /home/uXXXX -name atualizar-dados.php`.)
- Agendamento final: `0 12 * * *` (diário, meio-dia). Testado com `* * * * *` e revertido.

## 2026-07-26 — Proteção para deploy "subir a pasta inteira"

- **Objetivo:** deixar seguro subir todos os arquivos ao `public_html` sem vazar internos.
- **Arquivos:** `.htaccess` (raiz), `rpa/.htaccess`.
- **Decisão:** `rpa/.htaccess` nega web à pasta do RPA (cron/CLI não é afetado). `.htaccess` da raiz faz `RedirectMatch 404` em `/.git` e `/.env` e nega (`Require all denied` com fallback 2.2) os `*.md`, `.gitignore`, `.gitattributes`, `*.bak/tmp/log` e `CLAUDE.md`. Assim, mesmo subindo tudo, só o site fica acessível.
- **Riscos avaliados:** o RPA não guarda credencial (raspagem de página pública), então não há segredo a vazar; o item crítico de deploy é não expor a pasta `.git` — coberto pelo `.htaccess` (e recomendado nem subir). Docs internos ficam 403.
- **Nota:** `imagens/_extras/` deve ir para o servidor — contém a foto do banner (`foto-moto-paisagem.webp`) e o favicon (`fav.webp`), além de arquivos não usados.

---

**Antes/depois:** antes, o mídia kit só existia dentro do Playnest — URL de terceiro, sem domínio próprio, sem controle sobre layout e sem como registrar a marca dela na apresentação para as agências. Depois, existe um site autônomo com a mesma paleta e os mesmos números, responsivo do celular ao desktop, com abas de rede e filtro de período funcionando, que ela publica em qualquer hospedagem barata por FTP e atualiza editando um único arquivo de números — e que já está estruturado para receber a integração com as APIs do Instagram e do TikTok sem refazer o front.
