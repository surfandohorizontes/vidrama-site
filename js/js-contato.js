$(document).ready(function(){
	
	$("#regiao, #regiao2").change(function() {

		var regiao = $(this).val();
		//console.log(regiao);

		var id = 0;

		switch(regiao){
			case 'Curitiba-PR': id = '1b71dd1fe9';
			break;

			case 'Londrina-PR': id = 'aec80fa544';
			break;

			case 'Porto Alegre-RS': id = '1cbe59afff';
			break;

			case 'São José-SC': id = '63d1b611e3';
			break;

			case 'São Paulo-SP': id = 'c2507b87e7';
			break;

			case 'Outros': id = '';
			break;
		}

		$("#id_regiao, #id_regiao2").attr('value', id).prop('value', id);

	});

	$("#form-contato").on("submit", function(){

		var pessoa = $("#pessoa option:selected").val();
		var regiao = $("#regiao option:selected").val();
		var email2 = $(this).find("input[name=MERGE0]").val();

		if(pessoa == "pessoa"){
			$("#pessoa").addClass('input-error');
		}
		if(regiao == "regiao"){
			$("#regiao").addClass('input-error');
		}
		if(email2 == ""){
			$("#MERGE0_contato").addClass('input-error');
		}
		if(pessoa == "pessoa" || email2 == "" || regiao == "regiao"){
			return false;
		}
	});

	$("#pessoa").on("click", function(){
		var pessoa = $("#pessoa option:selected").val();
		if(pessoa != "pessoa"){
			$("#pessoa").removeClass('input-error');
		}
	});
	$("#regiao").on("click", function(){
		var regiao = $("#regiao option:selected").val();
		if(regiao != "regiao"){
			$("#regiao").removeClass('input-error');
		}
	});
	$("#MERGE0_contato").on("blur", function(){
		var email_conf = $("#form-contato").find("input[name=MERGE0]").val();
		if(email_conf != ""){
			$("#MERGE0_contato").removeClass('input-error');
		}
	});

	$("#form-servico2").on("submit", function(){

		var servico = $("#servico option:selected").val();
		var regiao2 = $("#regiao2 option:selected").val();
		var email = $(this).find("input[name=MERGE0]").val();

		if(servico == "servico"){
			$("#servico").addClass('input-error');
		}
		if(regiao2 == "regiao2"){
			$("#regiao2").addClass('input-error');
		}
		if(email == ""){
			$("#MERGE0_servico").addClass('input-error');
		}
		if(servico == "servico" || email == "" || regiao2 == "regiao2"){
			return false;
		}
	});

	$("#servico").on("click", function(){
		var servico = $("#servico option:selected").val();
		if(servico != "servico"){
			$("#servico").removeClass('input-error');
		}
	});
	$("#regiao2").on("click", function(){
		var regiao2 = $("#regiao2 option:selected").val();
		if(regiao2 != "regiao2"){
			$("#regiao2").removeClass('input-error');
		}
	});
	$("#MERGE0_servico").on("blur", function(){
		var email_conf = $("#form-servico2").find("input[name=MERGE0]").val();
		if(email_conf != ""){
			$("#MERGE0_servico").removeClass('input-error');
		}
	});

});
