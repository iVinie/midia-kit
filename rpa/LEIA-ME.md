# RPA — Atualizar os números do mídia kit

Script que lê o mídia kit do **Playnest** e reescreve o `js/dados.js` com os
números novos (Instagram + TikTok, 7 e 28 dias, público e conteúdos).

## Por que funciona sem API do Instagram/TikTok

O Playnest já puxa esses dados das plataformas e os entrega **embutidos no
HTML** da página (bloco `__NEXT_DATA__` do Next.js). O RPA só baixa a página,
lê esse JSON e remapeia para o nosso formato. **Não precisa** de App Review,
token, nem navegador/Playwright — é um `GET` simples.

## Como rodar

Precisa do **Node 18+** instalado. Na pasta do projeto:

```bash
node rpa/atualizar-dados.js
```

Ele reescreve o `js/dados.js`. Depois, **suba o `js/dados.js`** para a
hospedagem (FTP) ou comite no git. Pronto — números atualizados.

> Só mexe em números (`js/dados.js`). Bio, nichos e e-mail ficam no
> `index.html` e não são tocados.

## Hostinger — versão PHP (a que roda sozinha no servidor)

Como o site está no **Hostinger**, use o **`atualizar-dados.php`** — o cron da
Hostinger roda PHP, então ele se atualiza sozinho, sem seu PC ligado.
(O `atualizar-dados.js` continua útil pra rodar/testar no PC.)

### 1) Subir os arquivos (mesma estrutura de pastas do projeto)

```
public_html/
├── js/dados.js              (será reescrito pelo script)
├── rpa/atualizar-dados.php
└── ... (resto do site)
```

### 2) Testar UMA vez à mão ANTES de agendar (importante)

No **hPanel → Avançado → Cron Jobs**, use "executar agora", OU pelo terminal SSH:

```bash
php ~/domains/SEU-DOMINIO/public_html/rpa/atualizar-dados.php
```

Deve imprimir `[RPA] OK — js/dados.js atualizado ...`. Abra o site e confira os
números. Se aparecer erro de permissão de escrita, dê permissão de escrita à
pasta `js/` (755/644 costuma bastar no Hostinger).

### 3) Agendar (depois que o teste passou)

**hPanel → Avançado → Cron Jobs → Criar**:

- **Comando:**
  ```
  /usr/bin/php /home/SEU-USUARIO/domains/SEU-DOMINIO/public_html/rpa/atualizar-dados.php
  ```
  (o caminho absoluto aparece no Gerenciador de Arquivos; alguns planos usam
  `/opt/alt/php82/usr/bin/php` — o hPanel geralmente já sugere o binário certo.)
- **Frequência:** 1x por dia (ex.: 06:00).

Pronto: todo dia ele baixa do Playnest e reescreve o `js/dados.js` sozinho.

### Segurança do arquivo PHP

Fica em `public_html`, então é acessível por URL. Por padrão ele **só roda via
cron (linha de comando)** — abrir pela URL retorna "Acesso negado". Se algum dia
quiser disparar manualmente pela URL, defina `TOKEN_SECRETO` no topo do arquivo
e chame `.../rpa/atualizar-dados.php?token=SEUTOKEN`.

## Outras formas (se um dia mudar de hospedagem)

- **PC com Windows:** Agendador de Tarefas → `node rpa/atualizar-dados.js` +
  subir o `dados.js`.
- **GitHub Pages:** GitHub Action agendado (`schedule: cron`) roda o `.js` e
  comita o `dados.js`. Grátis.

## Se um dia parar de funcionar

O script valida a estrutura e, se o Playnest tiver mudado o site, ele **falha
avisando** e **não altera** o `dados.js` (mantém o último bom). Nesse caso, o
mapeamento em `atualizar-dados.js` precisa de um ajuste — é onde os campos do
Playnest viram os nossos (`montarDados`).

## De onde vem cada número (resumo do mapeamento)

| No site            | No Playnest (`data.data…`)                    |
|--------------------|-----------------------------------------------|
| Destaques do topo  | soma IG + TikTok, 28 dias                      |
| Métricas IG        | `instagram.metrics.{7d,28d}` + `.followers`   |
| Métricas TikTok    | `tiktok.metrics.{7d,28d}` + `.followers`      |
| Gênero / idade     | `instagram.gender` / `.age` (vira %)          |
| Localidade         | `instagram.location`                          |
| Conteúdos          | `instagram.trending` + `tiktok.trending`      |
| "Atualizado em"    | `extractedAt` (horário de Recife)             |
