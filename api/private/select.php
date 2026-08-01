<?php include_once('../conexao.php');

ini_set('display_errors',1);
ini_set('display_startup_erros',1);
error_reporting(E_ALL);

if(isset($_POST['token'])){
	if(isset($_POST['acao'])){

		function deixarSomenteDigitos($input) {
			return preg_replace('/[^0-9]/', '', $input);    
		}

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

				if($_POST['acao'] == 'usuarios'){ 

					$pesquisa = mysqli_real_escape_string($conexao, $_POST['pesquisa']);

					$Consulta = "select * from usuarios where nome LIKE '%$pesquisa%' order by id DESC";
					$ExConsulta = mysqli_query($conexao, $Consulta);
					while($DadosConsulta = mysqli_fetch_assoc($ExConsulta)){ 
							
						$dados[] = array(
							'id' => $DadosConsulta['id'],
							'nome' => $DadosConsulta['nome'],
							'status' => $DadosConsulta['status'],
						);
					}

					$result = json_encode(array('code'=>200, 'dados'=>$dados));

				}

				if($_POST['acao'] == 'categorias'){ 

					$pesquisa = mysqli_real_escape_string($conexao, $_POST['pesquisa']);

					$Consulta = "select * from categorias where nome LIKE '%$pesquisa%' order by id DESC";
					$ExConsulta = mysqli_query($conexao, $Consulta);
					while($DadosConsulta = mysqli_fetch_assoc($ExConsulta)){ 
							
						$dados[] = array(
							'id' => $DadosConsulta['id'],
							'nome' => $DadosConsulta['nome'],
							'status' => $DadosConsulta['status'],
						);
					}

					$result = json_encode(array('code'=>200, 'dados'=>$dados));

				}

				

				if($_POST['acao'] == 'principal'){ 

					$Consulta = "select count(*) as usuarios, 
					(select count(*) as total from produtos) as produtos, 
					(select Sum(visitas) as total from visitantes) as visitas from usuarios";
					$ExConsulta = mysqli_query($conexao, $Consulta);
					$DadosConsulta = mysqli_fetch_assoc($ExConsulta);

					$result = json_encode(array(
						'code'=>200, 
						'usuarios'=>$DadosConsulta['usuarios'],
						'produtos'=>$DadosConsulta['produtos'],
						'visitas'=>$DadosConsulta['visitas'],
					));

				}

				if($_POST['acao'] == 'dados_usuario'){ 

					$id_usuario = mysqli_real_escape_string($conexao, $_POST['id']);

					$Consulta = "select * from usuarios where id = $id_usuario";
					$ExConsulta = mysqli_query($conexao, $Consulta);
					$DadosConsulta = mysqli_fetch_assoc($ExConsulta);
							
					$dados[] = array(
						'id' => $DadosConsulta['id'],
						'nome' => $DadosConsulta['nome'],
						'login' => $DadosConsulta['login'],
						'senha' => $DadosConsulta['senha'],
					);
				
					$result = json_encode(array('code'=>200, 'dados'=>$dados));

				}

				if($_POST['acao'] == 'dados_categoria'){ 

					$id_categoria = mysqli_real_escape_string($conexao, $_POST['id']);

					$Consulta = "select * from categorias where id = $id_categoria";
					$ExConsulta = mysqli_query($conexao, $Consulta);
					$DadosConsulta = mysqli_fetch_assoc($ExConsulta);
							
					$dados[] = array(
						'id' => $DadosConsulta['id'],
						'nome' => $DadosConsulta['nome']
					);
				
					$result = json_encode(array('code'=>200, 'dados'=>$dados));

				}


				

				if($_POST['acao'] == 'select_categorias'){ 

					$Consulta = "select * from categorias where status = 1 order by id ASC";
					$ExConsulta = mysqli_query($conexao, $Consulta);
					while($DadosConsulta = mysqli_fetch_assoc($ExConsulta)){ 
							
						$dados[] = array(
							'id' => $DadosConsulta['id'],
							'nome' => $DadosConsulta['nome'],
						);
					}

					$result = json_encode(array('code'=>200, 'dados'=>$dados));

				}

				if($_POST['acao'] == 'produtos'){ 

					$pesquisa = mysqli_real_escape_string($conexao, $_POST['pesquisa']);

					$Consulta = "select * from produtos where titulo LIKE '%$pesquisa%' order by id DESC";
					$ExConsulta = mysqli_query($conexao, $Consulta);
					while($DadosConsulta = mysqli_fetch_assoc($ExConsulta)){ 

						$principalBase = $DadosConsulta['id'].'_1.jpg';
						$arquivo = "../../img/produtos/".$DadosConsulta['id']."/micro/".$principalBase;
 						if (file_exists($arquivo)) {
							$ver = @filemtime($arquivo);
							if(!$ver){ $ver = time(); }
							$img = '../img/produtos/'.$DadosConsulta['id'].'/micro/'.$principalBase."?v=".$ver;
						} else {
							$img = '../../img/sem_imagem.jpg?v=2';
						}
							
							
						$dados[] = array(
							'id' => $DadosConsulta['id'],
							'img' => $img,
							'codigo' => $DadosConsulta['codigo'],
							'titulo' => $DadosConsulta['titulo'],
							'descricao' => $DadosConsulta['descricao'],
							'descricao_longa' => $DadosConsulta['descricao_longa'],
							'cat' => $DadosConsulta['cat'],
							'multiplo' => $DadosConsulta['multiplo'],
							'marca' => $DadosConsulta['marca'],
							'garantia' => $DadosConsulta['garantia'],
							'link_ml' => $DadosConsulta['link_ml'],
							'link_youtube' => $DadosConsulta['link_youtube'],
							'status' => $DadosConsulta['status'],
						);
					}

					$result = json_encode(array('code'=>200, 'dados'=>$dados));
				}
				
				if($_POST['acao'] == 'produto_imagens'){ 
					$id_produto = isset($_POST['id']) ? intval($_POST['id']) : 0;
					$lista = array();
					if($id_produto > 0){
						for($i = 1; $i <= 6; $i++){
							$main = "../../img/produtos/".$id_produto."/".$id_produto."_".$i.".jpg";
							$micro = "../../img/produtos/".$id_produto."/micro/".$id_produto."_".$i.".jpg";
							$existsMain = file_exists($main);
							$existsMicro = file_exists($micro);
							if($existsMain || $existsMicro){
								$ver = $existsMicro ? @filemtime($micro) : ($existsMain ? @filemtime($main) : time());
								if(!$ver){ $ver = time(); }
								$lista[] = array(
									'pos' => $i - 1,
									'main' => $existsMain ? ('../img/produtos/'.$id_produto.'/'.$id_produto.'_'.$i.'.jpg?v='.$ver) : '',
									'micro' => $existsMicro ? ('../img/produtos/'.$id_produto.'/micro/'.$id_produto.'_'.$i.'.jpg?v='.$ver) : '',
								);
							}
						}
					}
					$result = json_encode(array('code'=>200, 'imagens'=>$lista));
				}
				
			}else{
				$result = json_encode(array('code'=>401, 'message'=>'Token expirado!'));
			}

		}else{
			$result = json_encode(array('code'=>400, 'message'=>'Token inválido!'));
		}

			
	}else{
		$result = json_encode(array('code'=>400, 'message'=>'Ação não informado!'));
	}

}else{
	$result = json_encode(array('code'=>400, 'message'=>'Token não informado!'));
}



echo $result;



	



 ?>
