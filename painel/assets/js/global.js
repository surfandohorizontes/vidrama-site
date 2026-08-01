var token = localStorage.getItem('token');
var id = localStorage.getItem('id');
var nome = localStorage.getItem('nome');
var nivel = localStorage.getItem('nivel');
var Cargo = '';

if(nivel == 1){ Cargo = 'Usuário Geral'; }
if(nivel == 2){ Cargo = 'Estoquista'; }
if(nivel == 3){ Cargo = 'Vendedor'; }
if(nivel == 4){ Cargo = 'Gerente de Produção'; }
if(nivel == 5){ Cargo = 'Refrigeração e Eletrica'; }
if(nivel == 6){ Cargo = 'Teste de Qualidade'; }
if(nivel == 7){ Cargo = 'Acabamento e Fechamento'; }

function FormatoMoeda(valor){
    valorReais = valor / 100;
    return new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(valorReais);
}


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


var urlAtual = window.location.href;
var url = urlAtual.split('/');

rota = './';
thumbPadrao = rota + 'assets/images/logo.png';

//if(url.length == 6){ rota = '../'; }else{ rota = ''; }

Dashboard = '';

if(nivel == 1){ // Administrador

    Dashboard = '<div class="col-12 col-md-4">'+
        '<div class="card">'+
            '<div class="card-body">'+
                '<div class="grid-margin">'+
                    '<div style="float: left;">'+
                        '<h3 style="font-weight: 300;">Usuarios</h3>'+
                        '<p style="margin-bottom: 0px; font-size: 30px; font-weight: 400;" id="total_clientes">0</p>'+
                    '</div>'+
                    '<i class="fa-solid fa-user" style="float: right;font-size: 70px;color: #c4c4c4;"></i>'+
                '</div>'+
            '</div>'+
        '</div>'+
    '</div>'+
    
    '<div class="col-12 col-md-4">'+
        '<div class="card">'+
            '<div class="card-body">'+
                '<div class="grid-margin">'+
                    '<div style="float: left;">'+
                        '<h3 style="font-weight: 300;">Produtos</h3>'+
                        '<p style="margin-bottom: 0px; font-size: 30px; font-weight: 400;" id="total_produtos">0</p>'+
                    '</div>'+
                    '<i class="fa-solid fa-cart-shopping" style="float: right;font-size: 70px;color: #c4c4c4;"></i>'+
                '</div>'+
            '</div>'+
        '</div>'+
    '</div>'+
    
    '<div class="col-12 col-md-4">'+
        '<div class="card">'+
            '<div class="card-body">'+
                '<div class="grid-margin">'+
                    '<div style="float: left;">'+
                        '<h3 style="font-weight: 300;">Visitantes</h3>'+
                        '<p style="margin-bottom: 0px; font-size: 30px; font-weight: 400;" id="total_visitas">0</p>'+
                    '</div>'+
                    '<i class="fa-solid fa-user-group" style="float: right;font-size: 70px;color: #c4c4c4;"></i>'+
                '</div>'+
            '</div>'+
        '</div>'+
    '</div>';

    menu = '<li class="is-expanded">'+
        '<a class="side-menu__item" href="'+rota+'principal"><span class="side-menu__label">Dashboard</span><i class="side-menu__icon icon icon-screen-desktop"></i></a>'+
    '</li>'+

    '<li class="is-expanded">'+
        '<a class="side-menu__item" href="'+rota+'usuarios"><span class="side-menu__label">Usuários</span><i class="side-menu__icon icon icon-people"></i></a>'+
    '</li>'+

    '<li class="is-expanded">'+
        '<a class="side-menu__item" href="'+rota+'produtos"><span class="side-menu__label">Produtos</span><i class="side-menu__icon fe fe-shopping-bag"></i></a>'+
    '</li>'+

    '<li class="is-expanded">'+
        '<a class="side-menu__item" href="'+rota+'categorias"><span class="side-menu__label">Categorias</span><i class="side-menu__icon fe fe-shopping-bag"></i></a>'+
    '</li>'+

    '<li class="is-expanded">'+
        '<a class="side-menu__item" href="#" onclick="sair()"><span class="side-menu__label">Sair</span><i class="side-menu__icon icon icon-power"></i></a>'+
    '</li>';

}



$('.principal-dashboard').html(Dashboard);

app_header = '<a class="header-brand header-brand1" href="./">'+
        //'<img src="'+rota+'assets/images/brand/logo-white.png" class="header-brand-img desktop-logo" alt="logo">'+
        '<img src="'+rota+'assets/images/brand/logo-1.png" class="header-brand-img mobile-logo" alt="logo">'+
    '</a>'+
'</div>'+

'<div class="d-flex  ml-auto header-right-icons">'+

    '<div class="dropdown d-md-flex">'+
        '<a class="nav-link icon full-screen-link nav-link-bg"><i class="fe fe-minimize fullscreen-button"></i></a>'+
    '</div>'+

    '<div class="dropdown profile-1">'+
        '<a href="#" data-toggle="dropdown" class="nav-link pr-2 leading-none d-flex">'+
            '<span><img src="'+rota+'assets/images/logo.png" alt="profile-user" class="avatar  profile-user brround cover-image"></span>'+
        '</a>'+
        '<div class="dropdown-menu dropdown-menu-right dropdown-menu-arrow">'+
            '<div class="drop-heading">'+
                '<div class="text-center">'+
                    '<h5 class="text-dark mb-0">Devid Antoni</h5>'+
                    '<small class="text-muted">'+Cargo+'</small>'+
                '</div>'+
            '</div>'+
            '<div class="dropdown-divider m-0"></div>'+
            '<a class="dropdown-item" href="#">'+
                '<i class="dropdown-icon mdi mdi-account-outline"></i> Profile'+
            '</a>'+
            '<a class="dropdown-item" href="#">'+
                '<i class="dropdown-icon  mdi mdi-settings"></i> Settings'+
            '</a>'+
            '<a class="dropdown-item" href="#">'+
                '<span class="float-right"></span>'+
                '<i class="dropdown-icon mdi  mdi-message-outline"></i> Inbox'+
            '</a>'+
            '<a class="dropdown-item" href="#"><i class="dropdown-icon mdi mdi-comment-check-outline"></i> Message</a>'+
            '<div class="dropdown-divider mt-0"></div>'+
            '<a class="dropdown-item" href="#"><i class="dropdown-icon mdi mdi-compass-outline"></i> Need help?</a>'+
            '<a class="dropdown-item" href="login"><i class="dropdown-icon mdi  mdi-logout-variant"></i> Sign out</a>'+
        '</div>'+
    '</div>'+

'</div>';


mobile_header = '<div class="container-fluid">'+
    '<div class="d-flex">'+
        '<div class="app-sidebar__toggle" data-toggle="sidebar">'+
            '<a class="open-toggle" href="#"><i class="fe fe-align-left"></i></a>'+
            '<a class="close-toggle" href="#"><i class="fe fe-x"></i></a>'+
        '</div>'+

        /*
        '<a class="header-brand" href="index">'+
            '<img src="'+rota+'assets/images/brand/logo.png" class="header-brand-img desktop-logo" alt="logo">'+
        '</a>'+
        '<a class="header-brand header-brand1" href="index">'+
            '<img src="'+rota+'assets/images/brand/logo-white.png" class="header-brand-img desktop-logo" alt="logo">'+
        '</a>'+

        */
        '<div class="d-flex order-lg-2 ml-auto header-right-icons">'+

            '<div class="dropdown profile-1">'+
                '<a href="#" data-toggle="dropdown" class="nav-link pr-2 leading-none d-flex">'+
                    '<span>'+
                        '<img src="'+rota+'assets/images/logo.png" alt="profile-user" class="avatar  profile-user brround cover-image">'+
                    '</span>'+
                '</a>'+
                '<div class="dropdown-menu dropdown-menu-right dropdown-menu-arrow">'+
                    '<div class="drop-heading">'+
                        '<div class="text-center">'+
                            '<h5 class="text-dark mb-0">Devid Antoni</h5>'+
                            '<small class="text-muted">'+Cargo+'</small>'+
                        '</div>'+
                    '</div>'+
                    '<div class="dropdown-divider m-0"></div>'+
                    '<a class="dropdown-item" href="#"><i class="dropdown-icon mdi mdi-account-outline"></i> Profile</a>'+
                    '<a class="dropdown-item" href="#"><i class="dropdown-icon  mdi mdi-settings"></i> Settings</a>'+
                    '<a class="dropdown-item" href="#"><span class="float-right"></span><i class="dropdown-icon mdi  mdi-message-outline"></i> Inbox</a>'+
                    '<a class="dropdown-item" href="#"><i class="dropdown-icon mdi mdi-comment-check-outline"></i> Message</a>'+
                    '<div class="dropdown-divider"></div>'+
                    '<a class="dropdown-item" href="#"><i class="dropdown-icon mdi mdi-compass-outline"></i> Need help?</a>'+
                    '<a class="dropdown-item" href="login"><i class="dropdown-icon mdi  mdi-logout-variant"></i> Sign out</a>'+
                '</div>'+
            '</div>'+

        '</div>'+
    '</div>'+
'</div>';




app_sidebar__user = '<div class="dropdown user-pro-body text-center">'+
    '<a href="#" class="user-box">'+
        '<div class="user-pic">'+
            '<span class="avatar avatar-md brround cover-image" data-image-src="'+rota+'assets/images/logo.png">'+
                '<span class="avatar-status bg-primary"></span><span class="avatar-border"></span>'+
            '</span>'+
        '</div>'+
        '<div class="user-info">'+
            '<h5 class=" mb-1 font-weight-bold text-dark">'+nome+'</h5>'+
            '<span class="text-muted app-sidebar__user-name text-sm">'+Cargo+'</span>'+
        '</div>'+
    '</a>'+
'</div>';


settings = '<div class="p-4 border-bottom">'+
    '<span class="fs-17">Profile Settings</span>'+
    '<a href="#" class="sidebar-icon text-right float-right" data-toggle="sidebar-right" data-target=".sidebar-right"><i class="fe fe-x"></i></a>'+
    '</div>'+
    '<div class="card-body p-0">'+
    '<div class="header-user text-center mt-4 pb-4">'+
        '<span class="avatar avatar-xxl brround"><img src="'+rota+'assets/images/logo.png" alt="Profile-img" class="avatar avatar-xxl brround"></span>'+
        '<div class="dropdown-item text-center font-weight-semibold user h3 mb-0 p-0 mt-3">Devid Antoni</div>'+
        '<small>Administrator</small>'+
        '<div class="card-body">'+
            '<div class="form-group">'+
                '<label class="form-label  text-left">Offline/Online</label>'+
                '<select class="form-control select2 " data-placeholder="Choose one">'+
                    '<option label="Choose one"></option>'+
                    '<option value="1">Online</option>'+
                    '<option value="2">Offline</option>'+
                '</select>'+
            '</div>'+
            '<div class="form-group">'+
                '<label class="form-label text-left">Website</label>'+
                '<select class="form-control select2 " data-placeholder="Choose one">'+
                    '<option label="Choose one"></option>'+
                    '<option value="1">Spruko.com</option>'+
                    '<option value="2">sprukosoft.com</option>'+
                    '<option value="3">sprukotechnologies.com</option>'+
                    '<option value="4">sprukoinfo.com</option>'+
                    '<option value="5">sprukotech.com</option>'+
                '</select>'+
            '</div>'+
        '</div>'+
    '</div>'+
    '<a class="dropdown-item  border-top" href="#">'+
        '<i class="dropdown-icon mdi mdi-account-outline"></i> Spruko technologies'+
    '</a>'+
    '<a class="dropdown-item border-top" href="#">'+
        '<i class="dropdown-icon  mdi mdi-account-plus"></i> Add another Account'+
    '</a>'+
    '<div class="card-body border-top">'+
        '<div class="row">'+
            '<div class="col-4 text-center">'+
                '<a class="" href=""><i class="dropdown-icon mdi  mdi-message-outline fs-30 m-0 leading-tight"></i></a>'+
                '<div>Inbox</div>'+
            '</div>'+
            '<div class="col-4 text-center">'+
                '<a class="" href=""><i class="dropdown-icon mdi mdi-tune fs-30 m-0 leading-tight"></i></a>'+
                '<div>Settings</div>'+
            '</div>'+
            '<div class="col-4 text-center">'+
                '<a class="" href=""><i class="dropdown-icon mdi mdi-logout-variant fs-30 m-0 leading-tight"></i></a>'+
                '<div>Sign out</div>'+
            '</div>'+
        '</div>'+
    '</div>'+
'</div>';

$('.settings').html(settings);
$('.mobile-header').html(mobile_header);
$('.app-sidebar__user').html(app_sidebar__user);
$('.app-header').html(app_header);
$('.side-menu').html(menu);

function MenuUsuarioHtml() {
    return '<div class="drop-heading">'+
        '<div class="text-center">'+
            '<h5 class="text-dark mb-0">'+(nome || 'Usuário')+'</h5>'+
            '<small class="text-muted">'+(Cargo || '')+'</small>'+
        '</div>'+
    '</div>'+
    '<div class="dropdown-divider m-0"></div>'+
    '<a class="dropdown-item" href="#" onclick="AbrirModalAlterarSenha(); return false;">'+
        '<i class="dropdown-icon mdi mdi-lock-reset"></i> Alterar senha'+
    '</a>'+
    '<div class="dropdown-divider mt-0"></div>'+
    '<a class="dropdown-item" href="#" onclick="sair(); return false;">'+
        '<i class="dropdown-icon mdi mdi-logout-variant"></i> Sair'+
    '</a>';
}

function AplicarCabecalhoUsuario() {
    $('.app-header .profile-1 .avatar, .mobile-header .profile-1 .avatar').attr('src', thumbPadrao);
    $('.app-sidebar__user [data-image-src]').attr('data-image-src', thumbPadrao);
    $('.settings img').attr('src', thumbPadrao);

    $('.app-header .profile-1 .dropdown-menu').html(MenuUsuarioHtml());
    $('.mobile-header .profile-1 .dropdown-menu').html(MenuUsuarioHtml());
}

function InserirModalAlterarSenha() {
    if ($('#modal-alterar-senha').length) { return; }
    var modal = '<div class="modal fade" id="modal-alterar-senha" tabindex="-1" role="dialog" aria-hidden="true">'+
        '<div class="modal-dialog" role="document">'+
            '<div class="modal-content">'+
                '<div class="modal-header">'+
                    '<h5 class="modal-title">Alterar senha</h5>'+
                    '<button type="button" class="close" data-dismiss="modal" aria-label="Close">'+
                        '<span aria-hidden="true">x</span>'+
                    '</button>'+
                '</div>'+
                '<div class="modal-body">'+
                    '<div class="form-group">'+
                        '<label style="display:block; margin-bottom:6px; font-weight:600;">Senha atual</label>'+
                        '<input type="password" id="senha_atual" class="form-control" placeholder="Senha atual">'+
                    '</div>'+
                    '<div class="form-group">'+
                        '<label style="display:block; margin-bottom:6px; font-weight:600;">Nova senha</label>'+
                        '<input type="password" id="nova_senha" class="form-control" placeholder="Nova senha">'+
                    '</div>'+
                    '<div class="form-group">'+
                        '<label style="display:block; margin-bottom:6px; font-weight:600;">Confirmar nova senha</label>'+
                        '<input type="password" id="confirmar_nova_senha" class="form-control" placeholder="Confirmar nova senha">'+
                    '</div>'+
                '</div>'+
                '<div class="modal-footer">'+
                    '<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>'+
                    '<button type="button" class="btn btn-primary" onclick="AlterarSenhaAtual()">Salvar</button>'+
                '</div>'+
            '</div>'+
        '</div>'+
    '</div>';

    $('body').append(modal);
}

function AbrirModalAlterarSenha() {
    $('#senha_atual').val('');
    $('#nova_senha').val('');
    $('#confirmar_nova_senha').val('');
    $('#modal-alterar-senha').modal('show');
}

function AlterarSenhaAtual() {
    var senhaAtual = $('#senha_atual').val();
    var novaSenha = $('#nova_senha').val();
    var confirmarNovaSenha = $('#confirmar_nova_senha').val();

    if (senhaAtual == '') { return alerta('error', 'Informe sua senha atual.'); }
    if (novaSenha == '') { return alerta('error', 'Informe a nova senha.'); }
    if (novaSenha.length < 4) { return alerta('error', 'A nova senha deve ter ao menos 4 caracteres.'); }
    if (confirmarNovaSenha == '') { return alerta('error', 'Confirme a nova senha.'); }
    if (novaSenha !== confirmarNovaSenha) { return alerta('error', 'As senhas não conferem.'); }

    $.ajax({
        type: "POST",
        url: "../api/private/update",
        data: {
            token: token,
            acao: 'alterar_senha',
            id: id,
            senha_atual: senhaAtual,
            nova_senha: novaSenha
        },
        success: function(resposta) {
            if (resposta && resposta.code == 200) {
                alerta('success', 'Senha alterada com sucesso!');
                $('#modal-alterar-senha').modal('hide');
            } else {
                alerta('error', resposta && resposta.message ? resposta.message : 'Não foi possível alterar a senha.');
            }
        },
        error: function() {
            alerta('error', 'Falha ao alterar a senha.');
        }
    });
}

AplicarCabecalhoUsuario();
InserirModalAlterarSenha();

function sair() {
    localStorage.removeItem('token');
    localStorage.removeItem('nome');
    localStorage.removeItem('id');
    localStorage.removeItem('nivel');
    window.location.href = window.location.origin + '/painel';
}

