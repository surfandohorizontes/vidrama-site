function renderCampo(id, label, valor) {
    if (valor && String(valor).trim() !== '') {
        $('#' + id).html('<strong>' + label + ':</strong> ' + valor).show();
    } else {
        $('#' + id).hide();
    }
}

function renderLink(id, label, url) {
    if (url && String(url).trim() !== '') {
        var safeUrl = String(url).trim();
        $('#' + id)
            .html('<strong>' + label + ':</strong> <a href="' + safeUrl + '" target="_blank" rel="noopener noreferrer">' + safeUrl + '</a>')
            .show();
    } else {
        $('#' + id).hide();
    }
}

function renderGaleria(imagens) {
    var thumbsHtml = '';
    if (!Array.isArray(imagens)) {
        imagens = [];
    }

    for (var i = 0; i < imagens.length; i++) {
        var ativo = i === 0 ? ' active' : '';
        thumbsHtml += '<button type="button" class="detalhes-thumb' + ativo + '" data-src="' + imagens[i] + '">' +
            '<img src="' + imagens[i] + '" alt="Miniatura do produto">' +
            '</button>';
    }

    $('#detalhes-thumbs').html(thumbsHtml);

    if (imagens.length <= 1) {
        $('#detalhes-thumbs').hide();
    } else {
        $('#detalhes-thumbs').show();
    }

    $('.detalhes-thumb').off('click').on('click', function () {
        var src = $(this).attr('data-src');
        $('#img').attr('src', src);
        $('.detalhes-thumb').removeClass('active');
        $(this).addClass('active');
    });
}

function getProdutoSlugDaUrl() {
    var partes = window.location.pathname.split('/').filter(function (parte) {
        return parte !== '';
    });
    var indiceProdutos = partes.indexOf('produtos');

    if (indiceProdutos !== -1 && partes[indiceProdutos + 1]) {
        return decodeURIComponent(partes[indiceProdutos + 1]);
    }

    return '';
}

function Consultar() {
    var slugProduto = getProdutoSlugDaUrl();
    var params = new URLSearchParams(window.location.search);
    var idProduto = params.get('id') || localStorage.getItem('produto');

    if (!slugProduto && !idProduto) {
        window.location.href = 'produtos';
        return;
    }

    var requestData = { acao: 'detalhes' };
    if (slugProduto) {
        requestData.slug = slugProduto;
    } else {
        requestData.id = idProduto;
    }

    $.ajax({
        type: "POST",
        url: "api/public/select",
        data: requestData,
        success: function (resposta) {
            if (resposta.code == 200 && resposta.dados && resposta.dados.length) {
                var dados = resposta.dados[0];

                $('#titulo').text(dados.titulo || '--');
                document.title = (dados.titulo ? dados.titulo + ' - ' : '') + 'Vidrama';
                $('#codigo').html('<strong>Código:</strong> ' + (dados.codigo || '--'));
                $('#descricao').text(dados.descricao || '--');
                $('#img').attr('src', dados.img || 'img/sem_imagem.jpg');

                renderCampo('categoria', 'Categoria', dados.categoria_nome);
                renderCampo('marca', 'Marca', dados.marca);
                renderCampo('multiplo', 'Múltiplo da caixa', dados.multiplo);
                renderCampo('garantia', 'Garantia', dados.garantia);
                renderCampo('descricao_longa', 'Descrição', dados.descricao_longa);
                renderLink('link_ml_wrap', 'Mercado Livre', dados.link_ml);
                renderLink('link_youtube_wrap', 'YouTube', dados.link_youtube);

                var imagens = Array.isArray(dados.imagens) ? dados.imagens.slice(0) : [];
                if (!imagens.length && dados.img) {
                    imagens.push(dados.img);
                }

                if (imagens.length) {
                    $('#img').attr('src', imagens[0]);
                }

                renderGaleria(imagens);
            }
        }
    });
}

Consultar();
