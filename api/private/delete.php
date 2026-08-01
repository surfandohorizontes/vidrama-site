<?php include_once('../conexao.php');

ini_set('display_errors',1);
ini_set('display_startup_erros',1);
error_reporting(E_ALL);

if(isset($_POST['token'])){
	if(isset($_POST['acao'])){
		
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

				function deletarPasta($pasta) {
					if (!is_dir($pasta)) {
						return;
					}

					$arquivos = scandir($pasta);

					foreach ($arquivos as $arquivo) {
						if ($arquivo != '.' && $arquivo != '..') {
							$caminho = $pasta . '/' . $arquivo;

							if (is_dir($caminho)) {
								deletarPasta($caminho);
							} else {
								unlink($caminho);
							}
						}
					}

					rmdir($pasta);
				}

				if($_POST['acao'] == 'produto'){ 
					$Usuario = "DELETE FROM produtos WHERE id = '$_POST[id]'";
					$ExUsuario = mysqli_query($conexao, $Usuario);

					deletarPasta("../../img/produtos/".$_POST['id']."");

					$result = json_encode(array('code'=>200, 'expirou'=>false));
				}

				if($_POST['acao'] == 'cancelar_cadastro_produto'){
					$ConsultaTemp = "select * from arquivos_temp where usuario = '$id'";
					$ExTemp = mysqli_query($conexao, $ConsultaTemp);
					while($DadosTemp = mysqli_fetch_assoc($ExTemp)){
						if(isset($DadosTemp['caminho']) && $DadosTemp['caminho'] != '' && file_exists($DadosTemp['caminho'])){
							@unlink($DadosTemp['caminho']);
						}
					}
					$DeleteTemp = "DELETE FROM arquivos_temp WHERE usuario = '$id'";
					mysqli_query($conexao, $DeleteTemp);

					$arquivoOrdem = "temp/order_".$id.".json";
					if(file_exists($arquivoOrdem)){
						@unlink($arquivoOrdem);
					}

					$result = json_encode(array('code'=>200, 'message'=>'Cadastro cancelado'));
				}



				if($_POST['acao'] == 'usuario'){ 
					$Usuario = "DELETE FROM usuarios WHERE id = '$_POST[id]'";
					$ExUsuario = mysqli_query($conexao, $Usuario);

					$result = json_encode(array('code'=>200));
				}

				if($_POST['acao'] == 'categoria'){ 
					$Categoria = "DELETE FROM categorias WHERE id = '$_POST[id]'";
					$ExCategoria = mysqli_query($conexao, $Categoria);

					$result = json_encode(array('code'=>200));
				}



				
			}
		}else{
			$result = json_encode(array('code'=>201, 'aviso'=>'Token inválido!'));
		}
		
	}else{
		$result = json_encode(array('code'=>201, 'aviso'=>'Parametro não informado!'));
	}
}else{
	$result = json_encode(array('code'=>201, 'aviso'=>'Token não informado!'));
}

echo $result;

?>
