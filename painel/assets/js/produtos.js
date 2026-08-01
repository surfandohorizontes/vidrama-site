function Consultar(){

    $.ajax({
        type: "POST",
        url: "../api/private/select",  
        data: {token: token, acao: 'produtos', pesquisa: ''},
        success: function(resposta) {

            if(resposta.code == 200){

                html = '';
                for (let index = 0; index < resposta.dados.length; index++) {
                    
                    if(resposta.dados[index].status == 1){
                        BtnStatus = '<i class="fa-solid fa-circle status-'+resposta.dados[index].id+'" onclick="Status('+resposta.dados[index].id+')" style="color: #0cdb1e;margin-right: 10px;cursor: pointer;z-index: 1;position: relative;top: 1px;"></i>';
                    }else{ 
                        BtnStatus = '<i class="fa-solid fa-circle status-'+resposta.dados[index].id+'" onclick="Status('+resposta.dados[index].id+')" style="color: #ed0d00;margin-right: 10px;cursor: pointer;z-index: 1;position: relative;top: 1px;"></i>';
                    }

                    html += '<div id="produto-card-'+resposta.dados[index].id+'" style="margin-bottom: 10px;width: 15%;float: left; border: 1px solid #dddddd; padding: 10px;border-radius: 8px;">'+
                        '<img id="produto-img-'+resposta.dados[index].id+'" src="'+resposta.dados[index].img+'" style="width: 100%;margin-bottom: 10px;border-radius: 6px;">'+
                        '<div style="float: left;">'+
                            '<p style="margin-bottom: 0px;font-weight: 600;display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;">'+resposta.dados[index].titulo+'</p>'+
                            '<p style="margin-bottom: 0px;">Codigo: <span style="font-weight: 600;">'+resposta.dados[index].codigo+'</span></p>'+
                            '<p style="margin-bottom: 0px; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;">'+resposta.dados[index].descricao+'</p>'+
                            '<div style="margin-top: 5px;">'+
                                BtnStatus+
                                '<i class="fa-regular fa-pen-to-square" onclick="Editar('+resposta.dados[index].id+')" data-toggle="modal" data-target="#editar" style="font-size: 17px;cursor: pointer;margin-right: 10px;position: relative;top: 1px;"></i>'+
                                '<i class="fa-regular fa-trash-can" onclick="Deletar('+resposta.dados[index].id+')" style="cursor: pointer;"></i>'+
                            '</div>'+
                        '</div>'+
                    '</div>';
                }

                $('#resultados').html(html);

            }

        }
    });
}


Consultar();

function Status(id){
    color = $('.status-'+id).css('Color');

    if(color == 'rgb(237, 13, 0)'){ 
        $('.status-'+id).css('color', '#0cdb1e'); status = 1; 
    }else{ 
        $('.status-'+id).css('color', '#ed0d00'); status = 0; 
    }

    $.ajax({
        type: "POST",
        url: "../api/private/update",  
        data: {token: token, acao: 'status_produto', id: id, status: status}
    });

}

function Deletar(id){

    if(!confirm('Deseja deletar este produto?')){ return; }

    $.ajax({
        type: "POST",
        url: "../api/private/delete",  
        data: {token: token, acao: 'produto', id: id},
        success: function(resposta) { 
            if(resposta.code == 200){
                $('#produto-card-'+id).remove();
            }
        }
    });
    
}


function Categorias(){
    $.ajax({
        type: "POST",
        url: "../api/private/select",  
        data: {token: token, acao: 'select_categorias'},
        success: function(resposta) {

            if(resposta.code == 200){

                html = '<option value="0">Selecione</option>';
                for (let index = 0; index < resposta.dados.length; index++) {
                    html += '<option value="'+resposta.dados[index].id+'">'+resposta.dados[index].nome+'</option>';
                }

                $('.categoria').html(html);
                $('.categoria_editar').html(html);

            }

        }
    });
}

Categorias();

var cadastroPrimaryIndex = 0;
var cadastroImages = [null, null, null, null, null, null];
var cadastroImagesServer = [null, null, null, null, null, null];
var cadastroImagesSrc = [null, null, null, null, null, null];

function CancelarCadastroProduto(){

    $.ajax({
        type: "POST",
        url: "../api/private/delete",  
        data: {token: token, acao: 'cancelar_cadastro_produto'},
        success: function(resposta) { 
            cadastroImages = [null, null, null, null, null, null];
            cadastroImagesServer = [null, null, null, null, null, null];
            cadastroImagesSrc = [null, null, null, null, null, null];
            $('.slot-delete').hide();
           document.getElementById("inputImagem0").value = "";
           document.getElementById("inputImagem1").value = "";
           document.getElementById("inputImagem2").value = "";
           document.getElementById("inputImagem3").value = "";
           document.getElementById("inputImagem4").value = "";
           document.getElementById("inputImagem5").value = "";
           updateMainPreview();
        }
    });

}

function initCadastroProdutoModal() {
    cadastroPrimaryIndex = 0;
    cadastroImages = [null, null, null, null, null, null];
    $('#primary_index').val(0);
    for (let i = 0; i < 6; i++) {
        $('#img-item-' + i).attr('src', 'assets/images/sem-foto.webp');
        $('.image-slot[data-slot="'+i+'"]').off('click').on('click', function(e){
            // abrir seletor de arquivo ao clicar no slot
            if (!$(e.target).hasClass('slot-delete')) {
                $('#inputImagem' + i).trigger('click');
            }
        });
        $('#inputImagem' + i).off('change').on('change', function () {
            var file = this.files && this.files[0] ? this.files[0] : null;
            if (file) {
                cadastroImages[i] = file;
                var reader = new FileReader();
                reader.onload = function(ev){
                    $('#img-item-' + i).attr('src', ev.target.result);
                    cadastroImagesSrc[i] = ev.target.result;
                    $('.image-slot[data-slot="'+i+'"] .slot-delete').show();
                    uploadSlotFile(i, file);
                    updateMainPreview();
                };
                reader.readAsDataURL(file);
            }
        });
    }
    $('#main-preview').off('click').on('click', function(){
        $('#inputImagem' + cadastroPrimaryIndex).trigger('click');
    });
    $('.image-slot').off('dragstart').on('dragstart', function (e) {
        e.originalEvent.dataTransfer.setData('text/plain', $(this).data('slot'));
    });
    $('.slot-image').off('dragstart').on('dragstart', function (e) {
        var idx = $(this).closest('.image-slot').data('slot');
        e.originalEvent.dataTransfer.setData('text/plain', idx);
    });
    $('.image-slot').off('dragover').on('dragover', function (e) {
        e.preventDefault();
    });
    $('.image-slot').off('drop').on('drop', function (e) {
        e.preventDefault();
        var sourceIdx = parseInt(e.originalEvent.dataTransfer.getData('text/plain'));
        var targetIdx = $(this).data('slot');
        if (sourceIdx === targetIdx) return;
        var tmpFile = cadastroImages[sourceIdx];
        cadastroImages[sourceIdx] = cadastroImages[targetIdx];
        cadastroImages[targetIdx] = tmpFile;
        var srcSource = $('#img-item-' + sourceIdx).attr('src');
        var srcTarget = $('#img-item-' + targetIdx).attr('src');
        $('#img-item-' + sourceIdx).attr('src', srcTarget);
        $('#img-item-' + targetIdx).attr('src', srcSource);
        var tmpSrc = cadastroImagesSrc[sourceIdx];
        cadastroImagesSrc[sourceIdx] = cadastroImagesSrc[targetIdx];
        cadastroImagesSrc[targetIdx] = tmpSrc;
        var tmpServer = cadastroImagesServer[sourceIdx];
        cadastroImagesServer[sourceIdx] = cadastroImagesServer[targetIdx];
        cadastroImagesServer[targetIdx] = tmpServer;
        var wasPrimary = cadastroPrimaryIndex;
        if (wasPrimary === sourceIdx) cadastroPrimaryIndex = targetIdx;
        if (wasPrimary === targetIdx) cadastroPrimaryIndex = sourceIdx;
        $('#primary_index').val(cadastroPrimaryIndex);
        toggleDeleteVisibility(sourceIdx);
        toggleDeleteVisibility(targetIdx);
        updatePrimaryHighlight();
        updateMainPreview();
        updateServerAllPositions();
    });
    $('#main-preview').off('dragover').on('dragover', function (e) { e.preventDefault(); });
    $('#main-preview').off('drop').on('drop', function (e) {
        e.preventDefault();
        var sourceIdx = parseInt(e.originalEvent.dataTransfer.getData('text/plain'));
        if (isNaN(sourceIdx)) return;
        if (sourceIdx === cadastroPrimaryIndex) return;
        var targetIdx = cadastroPrimaryIndex;
        var tmpFile = cadastroImages[sourceIdx];
        cadastroImages[sourceIdx] = cadastroImages[targetIdx];
        cadastroImages[targetIdx] = tmpFile;
        var srcSource = $('#img-item-' + sourceIdx).attr('src');
        var srcTarget = $('#img-item-' + targetIdx).attr('src');
        $('#img-item-' + sourceIdx).attr('src', srcTarget);
        $('#img-item-' + targetIdx).attr('src', srcSource);
        var tmpSrc = cadastroImagesSrc[sourceIdx];
        cadastroImagesSrc[sourceIdx] = cadastroImagesSrc[targetIdx];
        cadastroImagesSrc[targetIdx] = tmpSrc;
        var tmpServer = cadastroImagesServer[sourceIdx];
        cadastroImagesServer[sourceIdx] = cadastroImagesServer[targetIdx];
        cadastroImagesServer[targetIdx] = tmpServer;
        $('#primary_index').val(cadastroPrimaryIndex);
        toggleDeleteVisibility(sourceIdx);
        toggleDeleteVisibility(targetIdx);
        updatePrimaryHighlight();
        updateMainPreview();
        updateServerAllPositions();
    });
    $('.slot-delete').off('click').on('click', function (e) {
        e.stopPropagation();
        var idx = $(this).closest('.image-slot').data('slot');
        var caminhoAntigo = cadastroImagesServer[idx];
        cadastroImages[idx] = null;
        cadastroImagesServer[idx] = null;
        cadastroImagesSrc[idx] = null;
        $('#inputImagem' + idx).val('');
        $('#img-item-' + idx).attr('src', 'assets/images/sem-foto.webp');
        if (caminhoAntigo) {
            removeTempUpload(caminhoAntigo);
        }
        toggleDeleteVisibility(idx);
        if (cadastroPrimaryIndex === idx) {
            var next = firstFilledIndex();
            cadastroPrimaryIndex = next >= 0 ? next : 0;
            $('#primary_index').val(cadastroPrimaryIndex);
        }
        updatePrimaryHighlight();
        updateMainPreview();
        updateServerAllPositions();
    });
    updatePrimaryHighlight();
    updateMainPreview();
    updateServerAllPositions();
}

function updatePrimaryHighlight() {
    $('.image-slot').each(function () {
        var idx = $(this).data('slot');
        if (idx === cadastroPrimaryIndex) {
            $(this).css('border-color', '#1071b8');
        } else {
            $(this).css('border-color', '#dddddd');
        }
    });
}

function updateMainPreview() {
    var src = $('#img-item-' + cadastroPrimaryIndex).attr('src') || 'assets/images/sem-foto.webp';
    $('#main-preview-img').attr('src', src);
}

function toggleDeleteVisibility(idx) {
    var hasFile = !!cadastroImages[idx];
    if (!hasFile) {
        var src = $('#img-item-' + idx).attr('src');
        if (src && src.indexOf('blob:') === 0) hasFile = true;
    }

    if (hasFile && $('#img-item-' + idx).attr('src') && $('#img-item-' + idx).attr('src').indexOf('sem-foto.webp') === -1) {
        $('.image-slot[data-slot="'+idx+'"] .slot-delete').show();
    } else {
        $('.image-slot[data-slot="'+idx+'"] .slot-delete').hide();
    }

}

function uploadSlotFile(idx, file) {
    var fd = new FormData();
    fd.append('token', token);
    fd.append('acao', 'salvar_arquivo');
    fd.append('arquivo[]', file);
    fd.append('posicao', idx);
    $.ajax({
        type: "POST",
        url: "../api/private/insert",
        data: fd,
        processData: false,
        contentType: false,
        dataType: "json",
        success: function (resposta) {
            try {
                if (typeof resposta === 'string') resposta = JSON.parse(resposta);
            } catch(e) {}
            if (resposta && resposta.code == 200) {
                var idxToUse = (typeof resposta.posicao === 'number') ? resposta.posicao : idx;
                var caminhoResp = resposta.ultimo_caminho || resposta.caminho || (resposta.dados && resposta.dados.length ? resposta.dados[0].caminho : null);
                if (caminhoResp) {
                    cadastroImagesServer[idxToUse] = caminhoResp;
                    toggleDeleteVisibility(idxToUse);
                }
                updateServerAllPositions();
            }
        }
    });
}

function removeTempUpload(caminho) {
    if (!caminho) return;
    var fd = new FormData();
    fd.append('token', token);
    fd.append('acao', 'remover_arquivo_temp');
    fd.append('caminho', caminho);
    $.ajax({
        type: "POST",
        url: "../api/private/insert",
        data: fd,
        processData: false,
        contentType: false
    });
}

function updateServerPosition(idx) {
    var caminho = cadastroImagesServer[idx] || '';
    if (!caminho) return;
    var fd = new FormData();
    fd.append('token', token);
    fd.append('acao', 'posicao_arquivo');
    fd.append('posicao', idx);
    fd.append('caminho', caminho);
    $.ajax({
        type: "POST",
        url: "../api/private/insert",
        data: fd,
        processData: false,
        contentType: false,
        dataType: "json",
        success: function (resposta) {
            try {
                if (typeof resposta === 'string') resposta = JSON.parse(resposta);
            } catch(e) {}
            if (resposta && resposta.code == 200 && Array.isArray(resposta.posicoes)) {
                for (var i = 0; i < 6; i++) {
                    var cam = resposta.posicoes[i] || '';
                    cadastroImagesServer[i] = cam || null;
                    toggleDeleteVisibility(i);
                }
                updatePrimaryHighlight();
                updateMainPreview();
            }
        }
    });
}

function updateServerAllPositions() {
    var payload = [];
    for (var i = 0; i < 6; i++) {
        var caminho = cadastroImagesServer[i] || '';
        payload.push({ posicao: i, caminho: caminho });
    }
    var fd = new FormData();
    fd.append('token', token);
    fd.append('acao', 'posicoes_arquivos');
    fd.append('posicoes', JSON.stringify(payload));
    fd.append('principal', cadastroPrimaryIndex);
    $.ajax({
        type: "POST",
        url: "../api/private/insert",
        data: fd,
        processData: false,
        contentType: false
    });
}

function firstFilledIndex() {
    for (var i = 0; i < 6; i++) {
        if (cadastroImages[i] || cadastroImagesServer[i]) return i;
    }
    return -1;
}

$(document).ready(function () {
    $('#cadastrar').on('shown.bs.modal', function () {
        initCadastroProdutoModal();
    });
    $('#editar').on('shown.bs.modal', function () {
        if (window.editProdutoId) {
            initEditarProdutoModal(window.editProdutoId);
        }
    });
});

function Cadastrar() {
    var titulo = $('.titulo_cadastrar').val();
    var codigo = $('.codigo_cadastrar').val();
    var descricao = $('.descricao_cadastrar').val();
    var categoria = $('.categoria').val();
    var multiplo_caixa = $('.multiplo_caixa_cadastrar').val();
    var marca = $('.marca_cadastrar').val();
    var garantia = $('.garantia_cadastrar').val();
    var link_ml = $('.link_ml_cadastrar').val();
    var link_youtube = $('.link_youtube_cadastrar').val();
    var descricao_longa = $('.descricao_longa_cadastrar').val();
    var fd = new FormData();
    fd.append('token', token);
    fd.append('multiplo', multiplo_caixa);
    fd.append('marca', marca);
    fd.append('garantia', garantia);
    fd.append('link_ml', link_ml);
    fd.append('link_youtube', link_youtube);
    fd.append('acao', 'produto_cadastrar');
    fd.append('titulo', titulo);
    fd.append('codigo', codigo);
    fd.append('categoria', categoria);
    fd.append('descricao', descricao);
    fd.append('descricao_longa', descricao_longa);
    fd.append('primary_index', cadastroPrimaryIndex);
    for (let i = 0; i < 6; i++) {
        if (cadastroImagesServer[i]) {
            fd.append('images_paths[]', cadastroImagesServer[i]);
        } else if (cadastroImages[i]) {
            fd.append('images[]', cadastroImages[i]);
        }
    }
    $.ajax({
        type: "POST",
        url: "../api/private/insert",
        data: fd,
        processData: false,
        contentType: false,
        success: function (resposta) {
            if (resposta && resposta.code == 200) {
                alerta('success', 'Produto cadastrado com sucesso!');
                $('#cadastrar').modal('hide');
                Consultar();
            } else {
                alerta('error', resposta && resposta.message ? resposta.message : 'Erro ao cadastrar produto');
            }
        },
        error: function () {
            alerta('error', 'Falha na requisição de cadastro');
        }
    });
}

var editProdutoId = null;

function Editar(id) {
    editProdutoId = id;
    $('.id_editar').val(id);
    $('#editar').modal('show');
}

function initEditarProdutoModal(id) {
    for (let i = 0; i < 6; i++) {
        var imgSel = $('#img-edit-' + i);
        imgSel.off('error').on('error', function(){ $(this).attr('src', 'assets/images/sem-foto.webp'); });
        $('#img-edit-' + i).attr('src', 'assets/images/sem-foto.webp');
        $('.image-slot-edit[data-slot="'+i+'"] .slot-delete-edit').hide();
        $('.image-slot-edit[data-slot="'+i+'"]').off('click').on('click', function(){
            $('#inputImagemEdit' + i).trigger('click');
        });
        $('.image-slot-edit[data-slot="'+i+'"]').off('dragstart').on('dragstart', function (e) {
            e.originalEvent.dataTransfer.setData('text/plain', $(this).data('slot'));
        });
        $('.image-slot-edit[data-slot="'+i+'"]').off('dragover').on('dragover', function (e) {
            e.preventDefault();
        });
        $('.image-slot-edit[data-slot="'+i+'"]').off('drop').on('drop', function (e) {
            e.preventDefault();
            var sourceIdx = parseInt(e.originalEvent.dataTransfer.getData('text/plain'));
            var targetIdx = $(this).data('slot');
            if (isNaN(sourceIdx) || sourceIdx === targetIdx) return;
            reorderEditPositions(sourceIdx, targetIdx, id);
        });
        $('#inputImagemEdit' + i).off('change').on('change', function(){
            var file = this.files && this.files[0] ? this.files[0] : null;
            if (!file) return;
            var reader = new FileReader();
            reader.onload = function(ev){
                $('#img-edit-' + i).attr('src', ev.target.result);
                $('#main-preview-img-edit').attr('src', ev.target.result);
            };
            reader.readAsDataURL(file);
            uploadSlotFileEdit(i, file, id);
        });
        $('.image-slot-edit[data-slot="'+i+'"] .slot-delete-edit').off('click').on('click', function(e){
            e.stopPropagation();
            removeEditImage(i, id);
        });
    }
    var initialSrc = $('#img-edit-0').attr('src') || 'assets/images/sem-foto.webp';
    $('#main-preview-img-edit').attr('src', initialSrc);
    $('#main-preview-edit').off('dragover').on('dragover', function (e) { e.preventDefault(); });
    $('#main-preview-edit').off('drop').on('drop', function (e) {
        e.preventDefault();
        var sourceIdx = parseInt(e.originalEvent.dataTransfer.getData('text/plain'));
        if (isNaN(sourceIdx) || sourceIdx === 0) return;
        reorderEditPositions(sourceIdx, 0, id);
    });
    refreshEditImages(id);
    $.ajax({
        type: "POST",
        url: "../api/private/select",  
        data: {token: token, acao: 'produtos', pesquisa: ''},
        success: function(resposta) {
            if(resposta.code == 200){
                var item = null;
                for (let i = 0; i < resposta.dados.length; i++) {
                    if (resposta.dados[i].id == id) { item = resposta.dados[i]; break; }
                }
                if (item) {
                    $('.titulo_editar_produto').val(item.titulo || '');
                    $('.codigo_editar_produto').val(item.codigo || '');
                    $('.descricao_editar_produto').val(item.descricao || '');
                    $('.categoria_editar').val(item.cat);
                    $('.multiplo_editar').val(item.multiplo);
                    $('.marca_editar').val(item.marca);
                    $('.garantia_editar').val(item.garantia);
                    $('.link_ml_editar').val(item.link_ml);
                    $('.link_youtube_editar').val(item.link_youtube);
                    $('.descricao_longa_editar_produto').val(item.descricao_longa);
                }
            }
        }
    });
}

function refreshEditImages(id, done) {
    for (var i = 0; i < 6; i++) {
        $('#img-edit-' + i).attr('src', 'assets/images/sem-foto.webp');
        toggleDeleteEditVisibility(i, false);
    }
    $.ajax({
        type: "POST",
        url: "../api/private/select",
        data: {token: token, acao: 'produto_imagens', id: id},
        success: function(resposta) {
            try { if (typeof resposta === 'string') resposta = JSON.parse(resposta); } catch(e){}
            if(resposta && resposta.code == 200 && Array.isArray(resposta.imagens)){
                for (var k = 0; k < resposta.imagens.length; k++) {
                    var it = resposta.imagens[k];
                    var idx = it.pos;
                    var src = it.micro || it.main || 'assets/images/sem-foto.webp';
                    $('#img-edit-' + idx).attr('src', src);
                    toggleDeleteEditVisibility(idx, src.indexOf('sem-foto.webp') === -1);
                }
            }
            var principal = $('#img-edit-0').attr('src') || 'assets/images/sem-foto.webp';
            $('#main-preview-img-edit').attr('src', principal);
            if (typeof done === 'function') {
                done(principal);
            }
        }
    });
}

function toggleDeleteEditVisibility(idx, forceVisible) {
    var visible = !!forceVisible;
    if (!visible) {
        var src = $('#img-edit-' + idx).attr('src') || '';
        visible = src && src.indexOf('sem-foto.webp') === -1;
    }
    if (visible) {
        $('.image-slot-edit[data-slot="'+idx+'"] .slot-delete-edit').show();
    } else {
        $('.image-slot-edit[data-slot="'+idx+'"] .slot-delete-edit').hide();
    }
}

function uploadSlotFileEdit(idx, file, id) {
    var fd = new FormData();
    fd.append('token', token);
    fd.append('acao', 'produto_editar_imagem');
    fd.append('id', id);
    fd.append('posicao', idx);
    fd.append('arquivo', file);
    $.ajax({
        type: "POST",
        url: "../api/private/insert",
        data: fd,
        processData: false,
        contentType: false,
        dataType: "json",
        success: function (resposta) {
            try {
                if (typeof resposta === 'string') resposta = JSON.parse(resposta);
            } catch(e) {}
            if (resposta && resposta.code == 200) {
                alerta('success', 'Imagem atualizada');
                refreshEditImages(id, function(principal){
                    $('#produto-img-' + id).attr('src', principal || 'assets/images/sem-foto.webp');
                });
            } else if (resposta && resposta.message) {
                alerta('error', resposta.message);
            }
        },
        error: function () {
            alerta('error', 'Falha ao atualizar imagem');
        }
    });
}

function reorderEditPositions(sourceIdx, targetIdx, id) {
    var fd = new FormData();
    fd.append('token', token);
    fd.append('acao', 'produto_trocar_posicao');
    fd.append('id', id);
    fd.append('source', sourceIdx);
    fd.append('target', targetIdx);
    $.ajax({
        type: "POST",
        url: "../api/private/insert",
        data: fd,
        processData: false,
        contentType: false,
        dataType: "json",
        success: function (resposta) {
            try {
                if (typeof resposta === 'string') resposta = JSON.parse(resposta);
            } catch(e) {}
            if (resposta && resposta.code == 200) {
                refreshEditImages(id, function(principal){
                    if (sourceIdx === 0 || targetIdx === 0) {
                        $('#produto-img-' + id).attr('src', principal || 'assets/images/sem-foto.webp');
                    }
                });
            } else {
                alerta('error', resposta && resposta.message ? resposta.message : 'Erro ao reordenar');
            }
        },
        error: function () {
            alerta('error', 'Falha ao reordenar');
        }
    });
}

function removeEditImage(idx, id) {
    var fd = new FormData();
    fd.append('token', token);
    fd.append('acao', 'produto_remover_imagem');
    fd.append('id', id);
    fd.append('posicao', idx);
    $.ajax({
        type: "POST",
        url: "../api/private/insert",
        data: fd,
        processData: false,
        contentType: false,
        dataType: "json",
        success: function (resposta) {
            try {
                if (typeof resposta === 'string') resposta = JSON.parse(resposta);
            } catch(e) {}
            if (resposta && resposta.code == 200) {
                alerta('success', 'Imagem removida');
                refreshEditImages(id, function(principal){
                    $('#produto-img-' + id).attr('src', principal || 'assets/images/sem-foto.webp');
                });
            } else {
                alerta('error', resposta && resposta.message ? resposta.message : 'Falha ao remover imagem');
            }
        },
        error: function () {
            alerta('error', 'Falha ao remover imagem');
        }
    });
}

function SalvarEdicao() {
    var id = editProdutoId;
    var titulo = $('.titulo_editar_produto').val();
    var codigo = $('.codigo_editar_produto').val();
    var descricao = $('.descricao_editar_produto').val();
    var categoria = $('.categoria_editar').val();
    var multiplo = $('.multiplo_caixa_editar').val();
    var marca = $('.marca_editar').val();
    var garantia = $('.garantia_editar').val();
    var link_ml = $('.link_ml_editar').val();
    var link_youtube = $('.link_youtube_editar').val();
    var descricao_longa = $('.descricao_longa_editar_produto').val();
    $.ajax({
        type: "POST",
        url: "../api/private/update",
        data: {token: token, acao: 'produto_atualizar', id: id, titulo: titulo, codigo: codigo, categoria: categoria, multiplo: multiplo, marca: marca, garantia: garantia, link_ml: link_ml, link_youtube: link_youtube, descricao: descricao, descricao_longa: descricao_longa},
        success: function(resposta) {
            if (resposta && resposta.code == 200) {
                alerta('success', 'Produto atualizado com sucesso!');
                $('#editar').modal('hide');
                Consultar();
            } else {
                alerta('error', resposta && resposta.message ? resposta.message : 'Erro ao salvar');
            }
        },
        error: function () {
            alerta('error', 'Falha na requisição de atualização');
        }
    });
}


$('#btnImportar').on('click', function () {
    // Abre o seletor de arquivos
    $('#arquivo').click();
});

$('#arquivo').on('change', function () {

    if (this.files.length === 0) {
        return; // usuário cancelou
    }

    var arquivo = this.files[0];
    
    var formData = new FormData();
    formData.append('arquivo', arquivo);
    formData.append('token', token);
    formData.append('acao', 'importar_produtos');

    $.ajax({
        url: '../api/private/insert',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        beforeSend: function () {
            $('#btnImportar').text('Importando...').prop('disabled', true);
        },
        success: function (resposta) {
            try {
                if (typeof resposta === 'string') resposta = JSON.parse(resposta);
            } catch(e) {}
            if (resposta && resposta.code == 200) {
                alerta('success', 'Produtos importados com sucesso!');
                Consultar();
            } else {
                alerta('error', resposta && resposta.message ? resposta.message : 'Erro ao importar');
            }
        },
        error: function () {
            alerta('error', 'Erro ao importar');
        },
        complete: function () {
            $('#btnImportar').text('Importar arquivo').prop('disabled', false);
            $('#arquivo').val(''); // permite reimportar o mesmo arquivo
        }
    });

});
