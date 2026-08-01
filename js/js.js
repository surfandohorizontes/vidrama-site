$(document).ready(function(){
	
	$(".hamburger").click(function(event) {
		$("#container-nav-mob").toggle(200);
		if($(this).children().children('input').hasClass('open')){
			$(this).children().children('input').attr('checked', false).prop('checked', false);
			$(this).children().children('input').removeClass('open');
			$(".filtro-vidrama").fadeOut(0);
		}else{
			$(this).children().children('input').attr('checked', true).prop('checked', true);
			$(this).children().children('input').addClass('open');
			$(".filtro-vidrama").fadeIn(0);
		}
	});

	$(".filtro-vidrama").click(function(event) {
		$(".hamburger").children().children('input').attr('checked', false).prop('checked', false);
		$(".hamburger").children().children('input').removeClass('open');
		$(".filtro-vidrama").fadeOut(0);
		$("#container-nav-mob").toggle(200);
	});

	$("#servico, #servico2").click(function(event) {
		$(".filtro-popup").fadeIn();
		$(".popup-servico").fadeIn();
	});

	$(".fecha-popup, .filtro-popup").click(function(event) {
		$(".popup-servico").fadeOut();
		$(".filtro-popup").fadeOut();
	});

	$("#servicos-page").click(function(event) {
		window.location.href = "servicos";
	});
	
	// $("#nossas-pesquisas").click(function(event) {
	// 	window.location.href = "https://pt.surveymonkey.com/r/Vidrama-site";
	// });

	/*$('#carousel-home').owlCarousel({
	    autoplay:true,
		autoplayTimeout:2000,
		loop:true,
		items:1,
		dotData:false,
		margin:0,
		smartSpeed: 1000,
		nav:false
	});*/

	$('#carousel-parceiros').owlCarousel({
	    autoplay: true, 
		autoplayTimeout: 2000, 
		autoplayHoverPause: true, 
		loop:true, 
		items:2, 
		dotData:true,
		nav:false,
		smartSpeed: 1000,
		responsive:{
			320:{items:1},
			600:{items:2},
			950:{items:3},
			1250:{items:4}
		}
	});

	var owl = $('#carousel-parceiros');
	owl.owlCarousel();
	// Go to the next item
	$('.custon-angle-right').click(function() {
	    owl.trigger('next.owl.carousel');
	})
	// Go to the previous item
	$('.custon-angle-left').click(function() {
	    // With optional speed parameter
	    // Parameters has to be in square bracket '[]'
	    owl.trigger('prev.owl.carousel');
	})

});

$(window).on("load", function() {
    $(".wow").length > 0 && (wow = new WOW({
        mobile: false,
        offset: 100
    }), wow.init());
});

$(document).ready(function() {
	$("#accept").click(function() {
		window.localStorage.setItem('cookies-accepted', '1');
	});
});
