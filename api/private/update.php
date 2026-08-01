<?php include_once('../conexao.php');


//ini_set('display_errors',1);
//ini_set('display_startup_erros',1);
//error_reporting(E_ALL);

error_reporting(E_ALL);
ini_set('display_errors', 1);


if(isset($_POST['token'])){
	if(isset($_POST['acao'])){
		if(isset($_POST['id'])){
		
			function base64ErlEoncode($data){
				return str_replace(['+', '/', '='], ['-', '_', ''],  base64_encode($data));
			}
			
			$parts = explode('.', $_POST['token']);
			$assinatura = base64ErlEoncode(hash_hmac('sha256', $parts[0].'.'.$parts[1], '15102510', true));
			
			if($assinatura == $parts[2]){
				
				$payload = json_decode(base64_decode($parts[1]));
				
				$dataa = date("d/m/Y");
				

		        if($dataa == $payload->validade){
					$id = $payload->id;
					$nivel = $payload->nivel;

					if($_POST['acao'] == 'alterar_senha'){
						$id_usuario = mysqli_real_escape_string($conexao, $_POST['id']);
						$senha_atual = mysqli_real_escape_string($conexao, $_POST['senha_atual']);
						$nova_senha = mysqli_real_escape_string($conexao, $_POST['nova_senha']);

						if($id_usuario != $id){
							$result = json_encode(array('code'=>403, 'message'=>'Usuário inválido para alteração de senha.'));
						}else if($senha_atual == '' || $nova_senha == ''){
							$result = json_encode(array('code'=>400, 'message'=>'Informe a senha atual e a nova senha.'));
						}else{
							$ConsultaSenha = "SELECT senha FROM usuarios WHERE id = '$id_usuario' LIMIT 1";
							$ExConsultaSenha = mysqli_query($conexao, $ConsultaSenha);
							$DadosConsultaSenha = mysqli_fetch_assoc($ExConsultaSenha);

							if(!$DadosConsultaSenha){
								$result = json_encode(array('code'=>404, 'message'=>'Usuário não encontrado.'));
							}else if($DadosConsultaSenha['senha'] != $senha_atual){
								$result = json_encode(array('code'=>400, 'message'=>'Senha atual incorreta.'));
							}else{
								$AtualizarSenha = "UPDATE usuarios SET senha = '$nova_senha' WHERE id = '$id_usuario'";
								mysqli_query($conexao, $AtualizarSenha);
								$result = json_encode(array('code'=>200, 'message'=>'Senha alterada com sucesso!'));
							}
						}
					}

					if($_POST['acao'] == 'salvar_img_produto'){

						$versao = rand(1, 1000);
						move_uploaded_file($_FILES['img_175']['tmp_name'], '../assets/images/produtos/'.$_POST['id'].'.jpg');
						move_uploaded_file($_FILES['img_50']['tmp_name'], '../assets/images/produtos/micro/'.$_POST['id'].'.jpg');
						$result = json_encode(array('code'=>200, 'img'=>'assets/images/produtos/'.$_POST['id'].'.jpg?v='.$versao.''));

					}

					if($_POST['acao'] == 'status_produto'){

						$id_produto = mysqli_real_escape_string($conexao, $_POST['id']);
						$status = mysqli_real_escape_string($conexao, $_POST['status']);

						$Atualizar = "UPDATE produtos SET status='$status' WHERE id = '$id_produto'";
						mysqli_query($conexao, $Atualizar);

						$result = json_encode(array('code'=>200, 'message'=>'Atualizado com sucesso!'));

					}

					if($_POST['acao'] == 'produto_atualizar'){
						$id_produto = mysqli_real_escape_string($conexao, $_POST['id']);
						$titulo = mysqli_real_escape_string($conexao, $_POST['titulo']);
						$codigo = mysqli_real_escape_string($conexao, $_POST['codigo']);
						$descricao = mysqli_real_escape_string($conexao, $_POST['descricao']);
						$categoria = mysqli_real_escape_string($conexao, $_POST['categoria']);
						$multiplo = mysqli_real_escape_string($conexao, $_POST['multiplo']);
						$marca = mysqli_real_escape_string($conexao, $_POST['marca']);
						$garantia = mysqli_real_escape_string($conexao, $_POST['garantia']);
						$link_ml = mysqli_real_escape_string($conexao, $_POST['link_ml']);
						$link_youtube = mysqli_real_escape_string($conexao, $_POST['link_youtube']);
						$descricao_longa = mysqli_real_escape_string($conexao, $_POST['descricao_longa']);

						$Atualizar = "UPDATE produtos SET 
						codigo='$codigo',
						titulo='$titulo',
						descricao='$descricao',
						descricao_longa='$descricao_longa',
						cat='$categoria',
						multiplo='$multiplo',
						marca='$marca',
						garantia='$garantia',
						link_ml='$link_ml',
						link_youtube='$link_youtube'
						WHERE id = '$id_produto'";
						$ExAtualizar = mysqli_query($conexao, $Atualizar);
	
						$result = json_encode(array('code'=>200, 'message'=>'Atualizado com sucesso!'));
	
					}

					
					if($_POST['acao'] == 'status_cliente'){

						$id_cliente = mysqli_real_escape_string($conexao, $_POST['id']);
						$status = mysqli_real_escape_string($conexao, $_POST['status']);
	
						$Atualizar = "UPDATE clientes SET status='$status' WHERE id = '$id_cliente'";
						$ExAtualizar = mysqli_query($conexao, $Atualizar);
	
						$result = json_encode(array('code'=>200, 'message'=>'Atualizado com sucesso!'));
	
					}

					if($_POST['acao'] == 'status_categoria'){

						$id_categoria = mysqli_real_escape_string($conexao, $_POST['id']);
						$status = mysqli_real_escape_string($conexao, $_POST['status']);
	
						$Atualizar = "UPDATE categorias SET status='$status' WHERE id = '$id_categoria'";
						$ExAtualizar = mysqli_query($conexao, $Atualizar);
	
						$result = json_encode(array('code'=>200, 'message'=>'Atualizado com sucesso!'));
	
					}


					

					if($_POST['acao'] == 'categoria'){

						$id_categoria = mysqli_real_escape_string($conexao, $_POST['id']);
						$nome = mysqli_real_escape_string($conexao, $_POST['nome']);
	
						$Atualizar = "UPDATE categorias SET nome='$nome' WHERE id = '$id_categoria'";
						$ExAtualizar = mysqli_query($conexao, $Atualizar);
	
						$result = json_encode(array('code'=>200, 'message'=>'Atualizado com sucesso!'));
	
					}



				}
				
			}else{
				$result = json_encode(array('success'=>false, 'aviso'=>'Token invalido!'));
			}
			
		}else{
			$result = json_encode(array('success'=>false, 'aviso'=>'Parametro não informado!'));
		}
			
	}else{
		$result = json_encode(array('success'=>false, 'aviso'=>'Ação não informado!'));
	}

}else{
	$result = json_encode(array('success'=>false, 'aviso'=>'Token não encontrado!'));
}



echo $result;



	



 ?>
