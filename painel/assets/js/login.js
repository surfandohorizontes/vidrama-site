function alerta(tipo, mensagem) {
    Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
    }).fire({
    icon: tipo,
    title: mensagem
    });
}

function entrar() {

    login = $('.login').val();
    senha = $('.senha').val();

    if(login != ''){
        if(senha != ''){

            $.ajax({
                type: "POST",
                url: "../api/private/autenticar",
                data: {login: login, senha: senha},
                success: function(resposta) {
        
                    if(resposta.success){
        
                        localStorage.setItem('token', resposta.dados[0].token);
                        localStorage.setItem('id', resposta.dados[0].id);
                        localStorage.setItem('nome', resposta.dados[0].nome);
                        localStorage.setItem('nivel', resposta.dados[0].nivel);
                        
                        window.location.href = "painel/principal";

                    }else{
                        alerta('error', resposta.aviso);
        
                    }
        
                }
        
            });

        }else{
            alerta('error', 'Senha não informada!');
        }
    }else{
        alerta('error', 'Login não informado!');
    }

}

$(".senha").keypress(function(e){
    if(e.keyCode == 13){ entrar() }
});