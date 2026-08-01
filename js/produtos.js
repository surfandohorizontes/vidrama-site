/* Design GIL */
function Produtos(){

    pesquisa = $('#search-input').val();

    $.ajax({
        type: "POST",
        url: "api/public/select",  
        data: {acao: 'produtos', filtro: localStorage.getItem('filtro'), pesquisa: pesquisa},
        success: function(resposta) {

            if(resposta.code == 200){

                html = '';
                if(resposta.dados.length != 0){
                    for (let index = 0; index < resposta.dados.length; index++) {
                        html += '<div onclick="Detalhes('+resposta.dados[index].id+', \''+resposta.dados[index].slug+'\')" class="cada-produto-vidrama" data-code="'+resposta.dados[index].codigo+'" data-category="Adesivos" style="cursor:pointer;">'+
                            '<img src="'+resposta.dados[index].img+'" style="padding: 10px;background: #efefef;width: 100%;">'+
                            '<div class="body-produto">'+
                                '<h2>'+resposta.dados[index].titulo+'</h2>'+
                                '<div>'+
                                    '<p>Código: '+resposta.dados[index].codigo+'</p>'+
                                    '<p>'+resposta.dados[index].descricao+'</p>'+
                                '</div>'+
                                '<div class="produto-card-footer">'+
                                    '<button type="button" class="produto-detalhes-btn" onclick="event.stopPropagation(); Detalhes('+resposta.dados[index].id+', \''+resposta.dados[index].slug+'\')">Ver Detalhes</button>'+
                                '</div>'+
                            '</div>'+
                        '</div>';
                    }
                }else{
                    html = '<p style="font-size: 20px;">Nenhum produto encontrado!</p>';
                }

                $('.engloba-produtos-vidrama').html(html);
                
            }

        }

    });

}


localStorage.setItem('filtro', 0);

function Filtrar(filtro){

    $('.engloba-produtos-vidrama').toggleClass('active-filtro-vitrine');
    $('#principal-categorias').toggleClass('block');
    
    localStorage.setItem('filtro', filtro);
    Produtos();
}

function Categorias(){
    $.ajax({
        type: "POST",
        url: "api/public/select",  
        data: {acao: 'categorias'},
        success: function(resposta) {

            if(resposta.code == 200){

                html = '<p onclick="Filtrar(0)">TODOS<i class="fas fa-angle-right" style="float: right;"></i></p>';
                for (let index = 0; index < resposta.dados.length; index++) {
                    html += '<p onclick="Filtrar('+resposta.dados[index].id+')">'+resposta.dados[index].nome+' <i class="fas fa-angle-right" style="float: right;"></i></p>';
                }

                $('#principal-categorias').html(html);

            }
        }
    });
}

Categorias();

Produtos();

$('#search-input').keyup(function (e) {
    Produtos();
});

function Detalhes(id, slug){
    localStorage.setItem('produto', id);
    if (slug) {
        window.location.href = "produtos/" + encodeURIComponent(slug);
        return;
    }
    window.location.href = "detalhes";
}
function openCategories(){
    $('.engloba-produtos-vidrama').toggleClass('active-filtro-vitrine');
    $('#principal-categorias').toggleClass('block');
    //$("#principal-categorias").css("display","block");
}

// width: calc(100% - 300px);
