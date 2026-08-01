<?php

$arquivo = 'dados.csv';

if (($handle = fopen($arquivo, 'r')) !== false) {

    // pula o cabeçalho
    fgetcsv($handle);

    while (($dados = fgetcsv($handle, 1000, ';')) !== false) {

        $SKU = utf8_encode(trim($dados[0]));
        $descricao_curta = utf8_encode(trim($dados[2]));
        $descricaoCompleta = utf8_encode(trim($dados[3]));
        $marca = utf8_encode(trim($dados[4]));
        $garantia = utf8_encode(trim($dados[5]));
        $multiplo = utf8_encode(trim($dados[6]));
        $linkML = utf8_encode(trim($dados[7]));
        $linkVideo = utf8_encode(trim($dados[8]));

        echo "SKU: $SKU <br>";
        echo "DESCRIÇÃO CURTA: $descricao_curta <br>";
        echo "DESCRIÇÃO COMPLETA: $descricaoCompleta <br>";
        echo "MARCA: $marca <br>";
        echo "GARANTIA: $garantia <br>";
        echo "MULTIPLO: $multiplo <br>";
        echo "LINK ML: $linkML <br>";
        echo "LINK VIDEO: $linkVideo <br><br>";
    }

    fclose($handle);
}
?>