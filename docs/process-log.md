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

---

**Antes/depois:** antes, o mídia kit só existia dentro do Playnest — URL de terceiro, sem domínio próprio, sem controle sobre layout e sem como registrar a marca dela na apresentação para as agências. Depois, existe um site autônomo com a mesma paleta e os mesmos números, responsivo do celular ao desktop, com abas de rede e filtro de período funcionando, que ela publica em qualquer hospedagem barata por FTP e atualiza editando um único arquivo de números — e que já está estruturado para receber a integração com as APIs do Instagram e do TikTok sem refazer o front.
