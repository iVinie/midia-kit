<?php
/**
 * RPA (PHP) — ATUALIZA js/dados.js A PARTIR DO PLAYNEST
 * ==================================================================
 * Versão PHP para rodar no CRON da Hostinger (o cron de lá roda PHP,
 * não Node). Faz o mesmo que o rpa/atualizar-dados.js:
 *   1. baixa a página do Playnest (cURL);
 *   2. extrai o JSON do <script id="__NEXT_DATA__">;
 *   3. remapeia para o formato do nosso js/dados.js;
 *   4. reescreve js/dados.js (gravação atômica: .tmp + rename).
 *
 * COMO AGENDAR NA HOSTINGER (hPanel -> Avançado -> Cron Jobs):
 *   Comando:  /usr/bin/php <caminho-absoluto>/rpa/atualizar-dados.php
 *   Frequência: 1x por dia (ex.: às 6h).
 *   (O caminho absoluto aparece no Gerenciador de Arquivos, algo como
 *    /home/uXXXXXXX/domains/SEU-DOMINIO/public_html/rpa/atualizar-dados.php)
 *
 * SEGURANÇA: por padrão só roda via linha de comando (cron). Se quiser
 * disparar pela URL, defina um TOKEN abaixo e chame com ?token=SEUTOKEN.
 *
 * Mexe SÓ em números (js/dados.js). Bio/nichos/e-mail ficam no index.html.
 * ================================================================== */

/* ------- Configuração ------- */
const SLUG          = 'bianca-marques-rodrigues';
const URL_PLAYNEST  = 'https://app.playnest.com.br/' . SLUG;
const FUSO          = 'America/Recife';        // UTC-3, p/ bater com o site
const TOKEN_SECRETO = 'TROQUE_ISTO';           // usado só se rodar via URL

$ARQUIVO_SAIDA = __DIR__ . '/../js/dados.js';  // rpa/ -> ../js/dados.js

/* ------- Trava de acesso (cron OK; via web só com token) ------- */
$viaCli  = (php_sapi_name() === 'cli');
$tokenOk = isset($_GET['token']) && is_string($_GET['token'])
        && TOKEN_SECRETO !== 'TROQUE_ISTO' && hash_equals(TOKEN_SECRETO, $_GET['token']);
if (!$viaCli && !$tokenOk) {
    http_response_code(403);
    exit("Acesso negado.\n");
}

/* ------- Utilidades ------- */

function encerrarComErro($mensagem) {
    $txt = "[RPA] FALHOU: $mensagem\n      js/dados.js NAO foi alterado.\n";
    if (defined('STDERR')) {          // CLI (cron)
        fwrite(STDERR, $txt);
    } else {                          // via web
        http_response_code(500);
        echo $txt;
    }
    exit(1);
}

// "2026-05-29T20:20:02Z" -> "29/05/2026 às 17:01" (horário de Recife)
function formatarDataHora($iso) {
    try {
        $dt = new DateTime($iso);
        $dt->setTimezone(new DateTimeZone(FUSO));
        return $dt->format('d/m/Y') . ' às ' . $dt->format('H:i');
    } catch (Exception $e) {
        return '';
    }
}

function paraPercentual($valor, $total) {
    return $total > 0 ? round(($valor / $total) * 100, 1) : 0;
}

function abreviar($n) {
    if ($n >= 1000000) return str_replace('.', ',', number_format($n / 1000000, 1)) . 'M';
    if ($n >= 1000)    return str_replace('.', ',', number_format($n / 1000, 1)) . 'k';
    return (string) $n;
}

/* ------- 1) Baixar e extrair o __NEXT_DATA__ ------- */
function baixarDadosPlaynest() {
    $ch = curl_init(URL_PLAYNEST);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT        => 30,
        CURLOPT_USERAGENT      => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        CURLOPT_SSL_VERIFYPEER => true,
    ]);
    $html   = curl_exec($ch);
    $codigo = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $erroC  = curl_error($ch);
    curl_close($ch);

    if ($html === false)   encerrarComErro("cURL: $erroC");
    if ($codigo !== 200)   encerrarComErro("HTTP $codigo ao baixar a pagina");

    if (!preg_match('#<script id="__NEXT_DATA__" type="application/json">(.*?)</script>#s', $html, $m)) {
        encerrarComErro('nao achei o bloco __NEXT_DATA__ no HTML');
    }

    $raiz = json_decode($m[1], true);
    $dados = $raiz['props']['pageProps']['data']['data'] ?? null;
    if (!$dados || empty($dados['instagram']) || empty($dados['tiktok'])) {
        encerrarComErro('props.pageProps.data.data.{instagram,tiktok} ausente');
    }
    return $dados;
}

/* ------- 2) Remapear ------- */

function metricasInstagram($m, $seguidores) {
    return [
        ['rotulo' => 'Seguidores',            'valor' => $seguidores],
        ['rotulo' => 'Impressões',            'valor' => $m['impressions']],
        ['rotulo' => 'Curtidas',              'valor' => $m['likes']],
        ['rotulo' => 'Alcance médio',         'valor' => $m['averageReach']],
        ['rotulo' => 'Alcance total',         'valor' => $m['totalReach']],
        ['rotulo' => 'Engajamento dos posts', 'valor' => $m['postsEngagement']],
    ];
}

function metricasTiktok($m, $seguidores) {
    return [
        ['rotulo' => 'Seguidores',            'valor' => $seguidores],
        ['rotulo' => 'Impressões',            'valor' => $m['impressions']],
        ['rotulo' => 'Curtidas',              'valor' => $m['likes']],
        ['rotulo' => 'Engajamento dos posts', 'valor' => $m['engagement']],
        ['rotulo' => 'Engajamento médio',     'valor' => $m['averageEngagement']],
    ];
}

function montarDados($d) {
    $ig = $d['instagram'];
    $tt = $d['tiktok'];

    // destaques do topo: soma das 2 redes (28 dias)
    $destaques = [
        'seguidores' => $ig['followers'] + $tt['followers'],
        'impressoes' => $ig['metrics']['28d']['impressions'] + $tt['metrics']['28d']['impressions'],
        'curtidas'   => $ig['metrics']['28d']['likes'] + $tt['metrics']['28d']['likes'],
    ];

    // publico (so Instagram)
    $g = $ig['gender'];
    $totalGenero = $g['female'] + $g['male'] + $g['others'];
    $genero = [
        ['rotulo' => 'Feminino',  'percentual' => paraPercentual($g['female'], $totalGenero)],
        ['rotulo' => 'Masculino', 'percentual' => paraPercentual($g['male'],   $totalGenero)],
        ['rotulo' => 'Outros',    'percentual' => paraPercentual($g['others'], $totalGenero)],
    ];

    $a = $ig['age'];
    $totalIdade = array_sum($a);
    $faixasEtarias = [];
    foreach ($a as $faixa => $qtd) {
        $faixasEtarias[] = ['rotulo' => $faixa, 'percentual' => paraPercentual($qtd, $totalIdade)];
    }

    $localidades = [];
    foreach ($ig['location'] as $l) {
        $localidades[] = [
            'cidade'     => $l['city'],
            'estado'     => (!empty($l['province']) ? $l['province'] : '-'),
            'usuarios'   => $l['value'],
            'percentual' => $l['percentage'],
        ];
    }

    // OBS: o RPA NÃO gera "conteudos"/parcerias — isso é manual em js/parcerias.js.

    return [
        'atualizadoEm' => formatarDataHora($d['extractedAt']),
        'destaques'    => $destaques,
        'redes' => [
            'instagram' => [
                'nome' => 'Instagram', 'usuario' => '@iibiank', 'link' => 'https://instagram.com/iibiank',
                'periodos' => [
                    '7dias'  => metricasInstagram($ig['metrics']['7d'],  $ig['followers']),
                    '28dias' => metricasInstagram($ig['metrics']['28d'], $ig['followers']),
                ],
            ],
            'tiktok' => [
                'nome' => 'TikTok', 'usuario' => '@iibiank', 'link' => 'https://tiktok.com/@iibiank',
                'periodos' => [
                    '7dias'  => metricasTiktok($tt['metrics']['7d'],  $tt['followers']),
                    '28dias' => metricasTiktok($tt['metrics']['28d'], $tt['followers']),
                ],
            ],
        ],
        'publico'   => ['genero' => $genero, 'faixasEtarias' => $faixasEtarias, 'localidades' => $localidades],
    ];
}

/* ------- 3) Escrever js/dados.js (atômico) ------- */
function escreverArquivo($caminho, $dados) {
    $json = json_encode($dados, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($json === false) encerrarComErro('json_encode falhou: ' . json_last_error_msg());

    $cabecalho =
        "/**\n" .
        " * DADOS DO MÍDIA KIT — GERADO AUTOMATICAMENTE (RPA PHP)\n" .
        " * ------------------------------------------------------------------\n" .
        " * NÃO edite à mão: reescrito pelo cron. Fonte: " . URL_PLAYNEST . "\n" .
        " * Gerado em: " . gmdate('c') . "\n" .
        " */\n\n" .
        "window.DADOS_MIDIA_KIT = ";

    $conteudo = $cabecalho . $json . ";\n";

    $tmp = $caminho . '.tmp';
    if (file_put_contents($tmp, $conteudo) === false) encerrarComErro("nao consegui escrever em $tmp (permissao?)");
    if (!rename($tmp, $caminho))                       encerrarComErro("nao consegui substituir $caminho");
}

/* ------- Execução ------- */
echo "[RPA] Baixando " . URL_PLAYNEST . " ...\n";
$brutos = baixarDadosPlaynest();
$dados  = montarDados($brutos);
escreverArquivo($ARQUIVO_SAIDA, $dados);

echo "[RPA] OK — js/dados.js atualizado (dados de {$dados['atualizadoEm']}).\n";
echo "      Destaques: " . abreviar($dados['destaques']['seguidores']) . " seguidores · "
   . abreviar($dados['destaques']['impressoes']) . " impressões · "
   . abreviar($dados['destaques']['curtidas']) . " curtidas\n";
echo "      Cidades: " . count($dados['publico']['localidades']) . "\n";
