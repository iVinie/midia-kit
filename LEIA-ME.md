# Mídia Kit — Bianca Marques

Página única, estática (HTML + CSS + JavaScript). Sem build, sem Node, sem banco.
Sobe em qualquer hospedagem — Hostinger, HostGator, Vercel, Netlify.

## Arquivos

```
bianca-midia-kit/
├── index.html          ← textos fixos (bio, nichos, e-mail, chamada final)
├── css/estilos.css     ← visual; as cores ficam todas no :root do topo
├── js/dados.js         ← ★ NÚMEROS. É o único arquivo que muda no dia a dia
├── js/principal.js     ← monta a tela a partir do dados.js (não precisa mexer)
└── imagens/
    ├── perfil.jpg      ← foto da Bianca (quadrada, ~600x600)
    └── favicon.png     ← ícone da aba (32x32 ou 64x64)
```

A pasta `imagens/` ainda está vazia: enquanto não houver `perfil.jpg`, aparece um avatar cinza no lugar.

## Como publicar na Hostinger / HostGator

1. Painel → **Gerenciador de Arquivos** (ou FTP via FileZilla).
2. Entre em `public_html/`.
3. Envie **o conteúdo** da pasta (`index.html`, `css/`, `js/`, `imagens/`) — não a pasta em si.
4. Aponte o domínio e ative o SSL grátis (Let's Encrypt) no painel.

Pronto: `https://dominiodela.com.br` já abre o mídia kit.

> **Ao reenviar um arquivo alterado**, troque a versão no `index.html`
> (`estilos.css?v=3` → `?v=4`). Isso obriga o navegador de quem já visitou a
> baixar a versão nova em vez de mostrar a antiga do cache.

## Como atualizar os números

Abra `js/dados.js` no Bloco de Notas e troque os valores. São números puros, sem ponto e sem "k":

```js
{ rotulo: 'Impressões', valor: 620000 }   // aparece como "620k"
```

A formatação brasileira (`17400` → `17,4k`) é automática. Também dá para editar
`atualizadoEm`, a lista de `conteudos` e os dados de `publico`.

## Personalizar cores

Tudo no bloco `:root` de `css/estilos.css`. Trocar `--cor-laranja` muda botões,
barras e etiquetas do site inteiro de uma vez. A paleta atual é a mesma do
mídia kit do Playnest (coral `#FD9E8A` + laranja `#E54D2E`).

---

# Puxar os dados automaticamente por API

Resposta curta: **dá, mas não direto do navegador** — e as duas plataformas exigem
aprovação de app. Vale a pena se a Bianca não quiser editar o arquivo todo mês.

## Por que não dá para fazer só no front-end

Chamar a API pelo JavaScript da página exigiria colocar o token de acesso dentro
do `dados.js` — que qualquer visitante lê com Ctrl+U. Token exposto = conta dela
acessível por terceiros. **O token tem que ficar no servidor.**

## Arquitetura recomendada (funciona na Hostinger e na HostGator)

Os dois planos de hospedagem compartilhada têm **PHP e cron job**, que é tudo que precisa:

```
cron 1x por dia
   └─> atualizar-dados.php        (fora ou dentro do public_html, com token protegido)
         ├─ chama a API do Instagram
         ├─ chama a API do TikTok
         └─ regrava js/dados.js com os números novos
```

Vantagens: a página continua 100% estática (carrega rápido), e se a API cair a
página segue no ar mostrando o último número válido.

## Instagram

- A antiga **Basic Display API foi desligada em dezembro de 2024** — qualquer
  tutorial que cite ela está desatualizado.
- Hoje se usa a **Instagram API with Instagram Login** (a conta dela precisa ser
  Profissional/Criador) ou a versão com Facebook Login, se a conta estiver
  ligada a uma Página.
- Passos: criar um app no Meta for Developers → pedir os escopos
  `instagram_business_basic` e `instagram_business_manage_insights` →
  passar pelo **App Review** (leva de dias a semanas) → autorizar com a conta dela.
- O que a API entrega, e que já tem lugar no `dados.js`:
  seguidores, impressões/views, curtidas, alcance, engajamento, salvamentos,
  compartilhamentos e a demografia de público (gênero, faixa etária, cidade).
- Atenção ao token: nasce válido por 1 hora, você troca por um de **60 dias**, e
  ele precisa ser renovado antes de expirar — o mesmo cron pode fazer isso.
  Se ninguém renovar, a atualização automática simplesmente para.
- A demografia só volta se a conta tiver **100+ seguidores** (o caso dela, ok).

## TikTok

- **TikTok Display API**, em TikTok for Developers: `user.info.stats`
  (seguidores, curtidas totais) e `video.list` (views, curtidas, comentários,
  compartilhamentos por vídeo).
- Também exige app aprovado + autorização OAuth da conta dela.
  Token de acesso dura 24h; o refresh token, 1 ano.
- **Limitação real:** o TikTok não libera demografia de público por API pública
  (isso só existe na Research API, restrita a pesquisa acadêmica). Ou seja, o
  bloco "Público" continuaria sendo só do Instagram — que é exatamente como a
  página já está montada hoje.

## Minha recomendação

Começar **manual**: são 5 minutos por mês editando `js/dados.js`, zero custo,
zero dependência de aprovação. Se ela quiser automático depois, eu monto o
`atualizar-dados.php` + cron — a estrutura do `dados.js` já foi desenhada para
receber isso sem mexer no HTML nem no CSS.

Se preferir pular a burocracia de App Review, existem intermediários pagos
(Phyllo, Modash, Apify) que já vêm com as duas conexões prontas e cobram
mensalidade — só compensa se virar serviço para vários creators.
