<?php
$numero = 123;

$largura = 250;
$altura  = 250;

$img = imagecreatetruecolor($largura, $altura);

// Cor de fundo #efefef
$fundo = imagecolorallocate($img, 239, 239, 239);

// Cor do texto
$texto = imagecolorallocate($img, 0, 0, 0); // preto

// Preenche o fundo
imagefill($img, 0, 0, $fundo);

// Fonte
$fonte = __DIR__ . '/fonts/arial.ttf';
$tamanho = 40;

// Centralização
$box = imagettfbbox($tamanho, 0, $fonte, $numero);
$larguraTexto = $box[2] - $box[0];
$alturaTexto  = $box[1] - $box[7];

$x = ($largura - $larguraTexto) / 2;
$y = ($altura + $alturaTexto) / 2;

// Escreve o número
imagettftext($img, $tamanho, 0, $x, $y, $texto, $fonte, $numero);

// Saída
header('Content-Type: image/png');
imagepng($img);
imagedestroy($img);
