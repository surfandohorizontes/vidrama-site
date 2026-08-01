function Consultar(){

    $.ajax({
        type: "POST",
        url: "../api/private/select",  
        data: {token: token, acao: 'principal'},
        success: function(resposta) {

            if(resposta.code == 200){
                $('#total_clientes').html(resposta.usuarios);
                $('#total_produtos').html(resposta.produtos);
                $('#total_visitas').html(resposta.visitas);
            }else{
                alerta('error', resposta.message)
            }

        }
    });


}

Consultar();