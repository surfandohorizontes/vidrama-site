$(document).ready(function () {

	var queryParams = new URLSearchParams(window.location.search);
	var statusTrabalhe = queryParams.get('status');
	var reasonTrabalhe = queryParams.get('reason');
	var reasonMessages = {
		invalid_request: 'Não foi possível processar o envio. Tente novamente.',
		invalid_fields: 'Preencha nome, e-mail e telefone corretamente antes de enviar.',
		missing_file: 'Anexe seu currículo em PDF, DOC ou DOCX para continuar.',
		invalid_file: 'Formato de anexo inválido. Use PDF, DOC ou DOCX.',
		file_too_large: 'O anexo excede o limite de 10 MB.',
		send_failed: 'Não foi possível enviar agora. Tente novamente em instantes.'
	};

	function showTrabalheStatus(type, message) {
		var $status = $("#status-trabalhe");
		if (!$status.length || !message) {
			return;
		}

		$status.removeClass("success error").addClass("show " + type).text(message);
	}

	$('input[name=MERGE4], input[name=tel]').mask('(00) 00000-0000');

	$('input[name=MERGE4], input[name=tel]').on('input', function() {
		this.value = this.value.replace(/[^\d()\-\s]/g, '');
	});

	Form("#form-contato", ".requerido", "input-error");
	Form("#form-servico2", ".requerido2", "input-error");
	Form("#form-trabalhe", ".requerido3", "input-error");

	$("#input-file").on("change", function() {
		var fileName = "";
		var fileIsValid = false;
		if (this.files && this.files.length > 0) {
			var arquivo = this.files[0];
			fileName = arquivo.name;
			var extensao = fileName.split(".").pop().toLowerCase();
			var extensoesPermitidas = ["pdf", "doc", "docx"];

			if ($.inArray(extensao, extensoesPermitidas) === -1) {
				showTrabalheStatus("error", "Formato de anexo inválido. Use PDF, DOC ou DOCX.");
			} else if (arquivo.size > 10 * 1024 * 1024) {
				showTrabalheStatus("error", "O anexo excede o limite de 10 MB.");
			} else {
				fileIsValid = true;
			}
		}

		$("#file-name").text(fileName ? "Arquivo anexado: " + fileName : "");
		$("#input-file").toggleClass("input-error", !fileIsValid);
		$("#file").toggleClass("input-error", !fileIsValid);
		if (fileIsValid) {
			showTrabalheStatus("success", "Anexo salvo no formulário. Agora é só clicar em Enviar.");
		}
	});

	$("#form-trabalhe").submit(function(event) {
		
		if ($("#input-file").hasClass('input-error')) {
			$(".engloba-anexo label").addClass('input-error');
			showTrabalheStatus("error", "Anexe seu currículo antes de enviar.");
		}else{
			$(".engloba-anexo label").removeClass('input-error');
		}

		if (!$("#form-trabalhe .input-error").length) {
			showTrabalheStatus("success", "Enviando currículo...");
			$(this).find("button[type=submit]").prop("disabled", true).text("Enviando...");
		}

	});

	if (statusTrabalhe === 'success') {
		showTrabalheStatus('success', 'Currículo enviado com sucesso.');
	}

	if (statusTrabalhe === 'error') {
		showTrabalheStatus('error', reasonMessages[reasonTrabalhe] || 'Não foi possível enviar o currículo. Verifique os dados e tente novamente.');
	}

	if (statusTrabalhe) {
		queryParams.delete('status');
		queryParams.delete('reason');
		var newQuery = queryParams.toString();
		var newUrl = window.location.pathname + (newQuery ? '?' + newQuery : '') + window.location.hash;
		window.history.replaceState({}, document.title, newUrl);
	}

});

/* 
	Form(primeiroParametro, segundoParametro, terceiroParametro)

	primeiroParametro = id do formulário
	segundoParametro = classe default, se houver mais de um form na mesma pagina tem que ser subtituído
	terceiroParametro = classe sem o ponto da classe com estilo de error
	
*/

function Form(formulario, classe, input_error){

	$(formulario).on("submit", function() {
		var validate = true;
		$(classe).each(function(index, el) {
			if($(this).val() == '' || $(this).val() == null){
				$(this).addClass(input_error);
				validate = false;
			}

			if($(this).attr('type') == 'email'){
				var testEmail = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
				if(!testEmail.test($(this).val())){
					$(this).addClass(input_error);
					validate = false;
				}
			}

			if($(this).attr('name') == 'rules'){
				if(!$(this).is(':checked')){
					$(this).parent().addClass(input_error);
				}
			}
		});

		return validate;
	});


	$(classe).each(function(index, el) {
		$(this).on("blur", function() { 
			var value = $(this).val();
			if(value != "") {
				$(this).removeClass(input_error);
			}	
		});
	});
}
