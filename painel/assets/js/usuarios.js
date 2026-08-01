
$('.token').val(token);

function Consultar(){

    $.ajax({
        type: "POST",
        url: "../api/private/select",  
        data: {token: token, acao: 'usuarios', pesquisa: ''},
        success: function(resposta) {

            if(resposta.code == 200){

                html = '';
                for (let index = 0; index < resposta.dados.length; index++) {
                    
                    if(resposta.dados[index].status == 1){
                        BtnStatus = '<i class="fa-solid fa-circle status-'+resposta.dados[index].id+'" onclick="Status('+resposta.dados[index].id+')" style="color: #0cdb1e;margin-right: 10px;cursor: pointer;z-index: 1;position: relative;top: 1px;"></i>';
                    }else{ 
                        BtnStatus = '<i class="fa-solid fa-circle status-'+resposta.dados[index].id+'" onclick="Status('+resposta.dados[index].id+')" style="color: #ed0d00;margin-right: 10px;cursor: pointer;z-index: 1;position: relative;top: 1px;"></i>';
                    }

                    html += '<tr style="background: #ffffff; color:#000000;">'+
                        '<td>'+resposta.dados[index].nome+'</td>'+
                        '<td class="text-center" style="padding-right: 12px;">'+
                            BtnStatus+
                            '<i class="fa-regular fa-pen-to-square" onclick="Editar('+resposta.dados[index].id+')" data-toggle="modal" data-target="#editar" style="font-size: 17px;cursor: pointer;margin-right: 10px;"></i>'+
                            '<i class="fa-regular fa-trash-can" onclick="Deletar('+resposta.dados[index].id+')" style="cursor: pointer;"></i>'+
                        '</td>'+
                    '</tr>';
                }

                $('#resultados').html(html);

            }

        }
    });
}


Consultar();

$('#pesquisar').on('keyup', function(){
    Consultar();
});

function Editar(id){

    $('#id_usuario').val(id);

    $.ajax({
        type: "POST",
        url: "../api/private/select",  
        data: {token: token, acao: 'dados_usuario', id: id},
        success: function(resposta) {

            $('.nome_editar').val(resposta.dados[0].nome);
            $('.login_editar').val(resposta.dados[0].login);
            $('.senha_editar').val(resposta.dados[0].senha);

        }
    });

}

function Deletar(id){

    var r = confirm("Deseja realmente deletar esse usuário?");
    if (r == true) {

        $.ajax({
            type: "POST",
            url: "../api/private/delete",  
            data: {token: token, acao: 'usuario', id: id},
            success: function(resposta) {

                if(resposta.code == 200){
                    alerta('success', 'Deletado com sucesso!');
                    Consultar();
                }else{
                    alerta('error', resposta.message)
                }

            }

        });
        
    }

}

function Salvar(){

    id = $('#id_usuario').val();
    nome = $('.nome_editar').val();
    login = $('.login_editar').val();
    senha = $('.senha_editar').val();
    
    if(nome == ''){ return alerta('error', 'Informe um nome!'); }
    if(login == ''){ return alerta('error', 'Informe um login!'); }
    if(senha == ''){ return alerta('error', 'Informe uma senha!'); }

    $.ajax({
        type: "POST",
        url: "../api/private/update",  
        data: { token: token, 
            acao: 'usuario', 
            nome: nome, 
            login: login, 
            senha: senha, 
            id: id
        },
        success: function(resposta) {

            if(resposta.code == 200){
                alerta('success', 'Salvo com sucesso!');
                Consultar();
                $('#editar').modal('hide');
            }else{
                alerta('error', resposta.message)
            }

        }
    });
}

function Cadastrar(){
    nome = $('.nome_cadastrar').val();
    login = $('.login_cadastrar').val();
    senha = $('.senha_cadastrar').val();
    
    if(nome == ''){ return alerta('error', 'Informe um nome!'); }
    if(login == ''){ return alerta('error', 'Informe um login!'); }
    if(senha == ''){ return alerta('error', 'Informe uma senha!'); }

    $.ajax({
        type: "POST",
        url: "../api/private/insert",  
        data: { token: token, acao: 'usuario', nome: nome, login: login, senha: senha },
        success: function(resposta) {

            if(resposta.code == 200){
                alerta('success', 'Cadastrado com sucesso!');
                Consultar();
                $('#cadastrar').modal('hide');
            }else{
                alerta('error', resposta.message)
            }

        }

    });
}

function Status(id){

    color = $(".status-"+id).css('Color');

    if(color == 'rgb(12, 219, 30)'){ BtnStatus = 0; $(".status-"+id).css("color","#ed0d00"); }else{ BtnStatus = 1; $(".status-"+id).css("color","#0cdb1e"); }

    $.ajax({
        type: "POST",
        url: "../api/private/update",  
        data: {token: token, acao: 'status_usuario', id: id, status: BtnStatus},
        success: function(resposta) {
            if(resposta.code == 200){
                alerta('success', resposta.message);
            }
        }

    });

}





const inputImagens = document.getElementById("inputImagens");
inputImagens.addEventListener("change", function (e) {

  const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    const reader = new FileReader();

    reader.onload = function (event) {
        img.src = event.target.result;
    };

    img.onload = function () {
        function cropProportional(image, targetWidth, targetHeight) {
            const canvas = document.createElement("canvas");
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            const ctx = canvas.getContext("2d");

            const srcRatio = image.width / image.height;
            const dstRatio = targetWidth / targetHeight;

            let sx, sy, sw, sh;

            if (srcRatio > dstRatio) {
                sh = image.height;
                sw = sh * dstRatio;
                sx = (image.width - sw) / 2;
                sy = 0;
            } else {
                sw = image.width;
                sh = sw / dstRatio;
                sx = 0;
                sy = (image.height - sh) / 2;
            }

            ctx.drawImage(image, sx, sy, sw, sh, 0, 0, targetWidth, targetHeight);
            return canvas;
        }

        function canvasToBlobPromise(canvas, type = "image/jpeg", quality = 0.9) {
            return new Promise(resolve => {
                canvas.toBlob(blob => resolve(blob), type, quality);
            });
        }

        const canvas175 = cropProportional(img, 250, 250);
        //const canvas50 = cropProportional(img, 30, 30);

        Promise.all([
            canvasToBlobPromise(canvas175),
            //canvasToBlobPromise(canvas50)
        ]).then(([blob175, blob50]) => {
            const Dados = new FormData();
            Dados.append("img", blob175, "imagem_250x250.jpg");
            //Dados.append("img_30", blob50, "imagem_30x30.jpg");
            Dados.append("token", token);
            Dados.append("acao", 'salvar_img_temp');

            $.ajax({
                url: "../api/private/insert",
                type: "POST",
                data: Dados,
                processData: false,
                cache: false,
                contentType: false,
                success: function (resposta) {
                    if (resposta.code == 200) {
                        versao = Math.floor(Math.random() * 2000) + 1;
                        document.querySelector("#img-item").setAttribute('src', '../api/private/temp/'+id+'.jpg?v='+versao+'');
                    }
                }
            });
        });
    };

    reader.readAsDataURL(file);

});

