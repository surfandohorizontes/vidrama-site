pathname = window.location.pathname;
url = pathname.split("/");


if(url.length == 2){ rota = url[1]; }
if(url.length == 3){ rota = url[2]; }
if(url[1] == 'produtos'){ rota = 'produtos'; }
home1 = '';
home2 = '';
sobre1 = '';
sobre2 = '';
pro1 = '';
pro2 = '';
serv1 = '';
serv2 = '';
adas1 = '';
adas2 = '';
cont1 = '';
cont2 = '';


if(rota == ''){ home1 = 'menu-ativo'; home2 = 'hover-menu-ativo'; }
if(rota == 'sobre'){ sobre1 = 'menu-ativo'; sobre2 = 'hover-menu-ativo'; }
if(rota == 'produtos'){ pro1 = 'menu-ativo'; pro2 = 'hover-menu-ativo'; }
if(rota == 'servicos'){ serv1 = 'menu-ativo'; serv2 = 'hover-menu-ativo'; }
if(rota == 'adas'){ adas1 = 'menu-ativo'; adas2 = 'hover-menu-ativo'; }
if(rota == 'contato'){ cont1 = 'menu-ativo'; cont2 = 'hover-menu-ativo'; }

function getCookieBanner(){
    return $('#principal-cookier, #consent-popup');
}

function hideCookieBanner(){
    getCookieBanner().hide().addClass('hidden');
}

function showCookieBanner(){
    getCookieBanner().show().removeClass('hidden');
}

function VerificarCookie(){
    if(window.localStorage.getItem('cookies-accepted') === '1'){
        hideCookieBanner();
        return;
    }

    if(getCookieBanner().length === 0){
        return;
    }

    $.getJSON("https://api.ipify.org?format=json", function (data) {
        $.ajax({
            type: "POST",
            url: "api/public/select",  
            data: {acao: 'cookie', ip: data.ip},
            success: function(resposta) {
                if(resposta.code == 200){ 
                    window.localStorage.setItem('cookies-accepted', '1');
                    hideCookieBanner();
                }else{ 
                    showCookieBanner();
                }
            },
            error: function() {
                showCookieBanner();
            }

        });
    }).fail(function() {
        showCookieBanner();
    });
}

VerificarCookie();

function GFG_Fun(){
    window.localStorage.setItem('cookies-accepted', '1');
    hideCookieBanner();

    $.getJSON("https://api.ipify.org?format=json", function (data) {

    $.ajax({
        type: "POST",
        url: "api/public/insert",  
        data: {acao: 'cookie', ip: data.ip},
        success: function(resposta) {
            if(resposta.code == 200){
                hideCookieBanner();
            }
        }

    });

});

    

}


header = '<div class="engloba-header">'+
    '<div class="corpo hide-992">'+
        '<nav>'+                
            '<ul class="menu hide-1100">'+
                '<li style="width: 74px;text-align: center;">'+
                    '<a class="transition '+home1+'" href="./">Home</a>'+
                    '<span class="hover-menu transition '+home2+'"></span>'+
                '</li>'+
                '<li style="width: 76px;text-align: center;">'+
                    '<a class="transition '+sobre1+'" href="sobre">Sobre</a>'+
                    '<span class="hover-menu transition '+sobre2+'"></span> '+
                '</li>'+
                '<li style="width: 70px;text-align: center;">'+
                    '<a class="transition '+pro1+'" href="produtos">Produtos</a>'+
                    '<span class="hover-menu transition '+pro2+'"></span>'+
                '</li>'+
                '<li style="width: 210px;text-align: center;">'+
                    '<a class="transition" href="/"><img alt="Logo" class="logo" src="img/logo.svg"></a>'+
                '</li>'+
                '<li style="text-align: center;">'+
                    '<a class="transition '+serv1+'" href="servicos">Serviços</a>'+
                    '<span class="hover-menu transition '+serv2+'"></span>'+
                '</li>'+
                '<li style="text-align: center;">'+
                    '<a class="transition '+adas1+'" href="adas">Adas</a>'+
                    '<span class="hover-menu transition '+adas2+'"></span>'+
                '</li>'+
                '<li style="text-align: center;">'+
                    '<a class="transition '+cont1+'" href="contato">Contato</a>'+ 
                    '<span class="hover-menu transition '+cont2+'"></span>'+
                '</li>'+            
            '</ul>'+
        '</nav>'+
    '</div>'+
'</div>'+
'<div class="engloba-menu-mobile transition">'+
    '<div class="engloba-topo-mob">'+
        '<a href="/"><img alt="Logo" class="logo" src="img/logo.svg" /></a>'+
        '<div id="hamburger" class="hamburger">'+
            '<label for="hamburger">'+
                '<input type="checkbox" id="hamburger"/>'+
                '<div class="container">'+
                    '<div class="menu2"></div>'+
                '</div>'+
            '</label> '+
        '</div>'+
    '</div>'+                             
'</div>';

$('#header').html(header);

function RemoverItemUnidadesMenu() {
    $('#header a, #container-nav-mob a').each(function () {
        var $link = $(this);
        var texto = ($link.text() || '').trim().toLowerCase();
        var href = ($link.attr('href') || '').toLowerCase();
        if (texto === 'unidades' || href.indexOf('unidades') !== -1) {
            $link.closest('li').remove();
        }
    });
}

RemoverItemUnidadesMenu();


footer = '<div class="corpo">'+
    '<div class="engloba-footer">'+
        '<div class="engloba-social">'+
            '<div class="logo-rodape">'+
                '<a href="/"><img src="img/logo.svg" alt="Vidrama"></a>'+
            '</div>'+
            '<div class="redes-sociais">'+
                '<a class="social-link transition" target="_blank" aria-label="Facebook" href="https://www.facebook.com/vidrama"><img src="img/icons/facebook.svg" alt=""></a>'+
                '<a class="social-link transition" target="_blank" aria-label="Instagram" href="https://www.instagram.com/vidrama"><img src="img/icons/instagram.svg" alt=""></a>'+
                '<a class="social-link transition" target="_blank" aria-label="YouTube" href="https://www.youtube.com/channel/UC6n3n4PivQBd5sP-nKRnrdA"><img src="img/icons/youtube.svg" alt=""></a>'+
                '<a class="social-link transition" target="_blank" aria-label="LinkedIn" href="https://www.linkedin.com/company/vidrama/"><img src="img/icons/linkedin.svg" alt=""></a>'+
            '</div>'+
            '<div class="footer-marketplaces">'+
                '<a class="footer-badge" href="https://www.reclameaqui.com.br/empresa/vidrama-vidros-automotivos/" target="_blank"><img src="img/reclameaqui.png" alt="Reclame Aqui"></a>'+
                '<a class="footer-badge" href="https://www.mercadolivre.com.br/loja/vidrama" target="_blank"><img src="img/mercadolivre.png?v=2" alt="Mercado Livre"></a>'+
            '</div>'+
        '</div>'+
        '<div class="engloba-links-rodape">'+
            '<div class="links-mob">'+
                '<a class="transition" href="produtos">Produtos</a>'+
                '<a class="transition" href="servicos">Serviços</a>'+
                '<a class="transition" href="contato">Contato</a>'+
                '<a class="transition" href="politica-de-privacidade">Política de Privacidade</a>'+
                '<a class="transition" target="_blank" href="https://vidrama.becompliance.com/canal-etica/canal-denuncias?origin=%242y%2410%24D3ahggO4WU5uNR2U9OE2OOmflQIyGsuOuRT9OC2Sj7ynJgKEbFUci">Canal de Ética</a>'+
            '</div>'+
            '<a class="trabalhe-conosco transition" href="trabalhe-conosco">Trabalhe Conosco</a>'+
        '</div>'+
    '</div>'+
    '<div class="engloba-diretos">'+
        '<p>© 2018 Vidrama. Todos os direitos reservados</p>'+
    '</div>'+
'</div>';

$('.footer').html(footer);
