<?php include_once('../conexao.php');


if(isset($_POST['login'])){

	if(isset($_POST['senha'])){

		$login = mysqli_real_escape_string($conexao, $_POST['login']);
		$senha = mysqli_real_escape_string($conexao, $_POST['senha']);

		$Usuarios = "SELECT * from usuarios where login = '$login'";
		$ExUsuarios = mysqli_query($conexao, $Usuarios);

		if(mysqli_num_rows($ExUsuarios) == 1){

			$DadosUsuario = mysqli_fetch_assoc($ExUsuarios);

            if($DadosUsuario['status'] == 1){
				
			  if($DadosUsuario['senha'] == $senha){

					function base64ErlEoncode($data){ return str_replace(['+', '/', '='], ['-', '_', ''],  base64_encode($data)); }

					$dataa = date("d/m/Y");

					$header = base64ErlEoncode('{"alg": "HS256", "typ": "JWT"}');
					$payload = base64ErlEoncode('{ "id": "'.$DadosUsuario['id'].'", "nivel": "'.$DadosUsuario['nivel'].'", "validade": "'.$dataa.'" }');
					$asinatura = base64ErlEoncode(hash_hmac('sha256', $header.'.'.$payload, '15102510', true));
					$token =  $header.'.'.$payload.'.'.$asinatura;
					$DataAtual = date("Y-m-d");


					$dados[] = array(
						'token' => $token,
						'id' => $DadosUsuario['id'],
						'nome' => $DadosUsuario['nome'],
						'nivel' => $DadosUsuario['nivel'],
					);

					$result = json_encode(array('success'=>true, 'dados'=>$dados ));
					
				}else{
					$result = json_encode(array('success'=>false, 'aviso'=>'Senha inválida!'));
				}
					
			}else{
				$result = json_encode(array('success'=>false, 'aviso'=>'Usuário Bloqueado!'));
			}

		}else{
			$result = json_encode(array('success'=>false, 'aviso'=>'Usuario não encontrado!'));
		}

	}else{
		$result = json_encode(array('success'=>false, 'aviso'=>'Senha não informada!'));
	}



}else{
	$result = json_encode(array('success'=>false, 'aviso'=>'Login não informado!'));
}


echo $result;



 ?>
