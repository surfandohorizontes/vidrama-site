<?php include_once('../conexao.php');


ini_set('display_errors',1);
ini_set('display_startup_erros',1);
error_reporting(E_ALL);

if(isset($_POST['token'])){
	if(isset($_POST['acao'])){
		
		function base64ErlEoncode($data){
			return str_replace(['+', '/', '='], ['-', '_', ''],  base64_encode($data));
		}

		function somente_numeros(string $telefone): string {
			// remove espaços no início/fim e qualquer caractere que não seja dígito
			$limpo = trim($telefone);
			$limpo = preg_replace('/\D+/', '', $limpo);
			return $limpo;
		}

		
		$parts = explode('.', $_POST['token']);
		$assinatura = base64ErlEoncode(hash_hmac('sha256', $parts[0].'.'.$parts[1], '15102510', true));
		
		if($assinatura == $parts[2]){
			
			$payload = json_decode(base64_decode($parts[1]));
			
			$dataa = date("d/m/Y");

		    if($dataa == $payload->validade){
				$id = $payload->id;
				$targetMainSize = 700;
				$targetMicroSize = 420;

				if($_POST['acao'] == 'salvar_img_temp'){

					move_uploaded_file($_FILES['img']['tmp_name'], 'temp/'.$id.'.jpg');

					$result = json_encode(array('code'=>200, 'img'=> 'api/temp/'.$id.'.jpg'));

				}

				if($_POST['acao'] == 'salvar_arquivo'){

					$posicao = mysqli_real_escape_string($conexao, $_POST['posicao']);

					$posicao_upload = isset($_POST['posicao']) ? intval($_POST['posicao']) : null;

					if($posicao_upload !== null){
						$ConsultaAntigos = "select * from arquivos_temp where usuario = '$id' and posicao = '$posicao_upload'";
						$ExAntigos = mysqli_query($conexao, $ConsultaAntigos);
						while($DadosAntigos = mysqli_fetch_assoc($ExAntigos)){
							if(isset($DadosAntigos['caminho']) && $DadosAntigos['caminho'] != '' && file_exists($DadosAntigos['caminho'])){
								@unlink($DadosAntigos['caminho']);
							}
						}
						$DeleteAntigos = "DELETE FROM arquivos_temp WHERE usuario = '$id' AND posicao = '$posicao_upload'";
						mysqli_query($conexao, $DeleteAntigos);
					}

					foreach ($_FILES['arquivo']['tmp_name'] as $key => $value) {

						$extensao = pathinfo($_FILES['arquivo']['name'][$key], PATHINFO_EXTENSION);
						$nomeUnico = $id . '-' . uniqid(); // cria um nome único

						$caminho = "temp/$nomeUnico.$extensao";

						// Verifica o tipo e move o arquivo
						if(in_array($_FILES['arquivo']['type'][$key], ['image/webp', 'image/jpeg', 'image/png'])) {

							move_uploaded_file($_FILES['arquivo']['tmp_name'][$key], $caminho);

							$tipo = '';
							if($_FILES['arquivo']['type'][$key] == 'application/pdf') $tipo = 'pdf';
							if($_FILES['arquivo']['type'][$key] == 'image/webp') $tipo = 'webp';
							if($_FILES['arquivo']['type'][$key] == 'image/jpeg') $tipo = 'jpg';
							if($_FILES['arquivo']['type'][$key] == 'image/png') $tipo = 'png';

							$nomeArquivo = "$nomeUnico.$extensao";

							$Dados = "INSERT INTO arquivos_temp (usuario, nome, caminho, posicao, tipo) 
							VALUES ('$id', '$nomeArquivo', '$caminho', '$posicao', '$tipo')";
							mysqli_query($conexao, $Dados);
							$ultimo_caminho = $caminho;
						}

					}


					$dados = [];
					$Consulta = "select * from arquivos_temp where usuario = $id order by id desc";
					$ExConsulta = mysqli_query($conexao, $Consulta);
					while($DadosConsulta = mysqli_fetch_assoc($ExConsulta)){ 
							
						$dados[] = array(
							'id' => $DadosConsulta['id'],
							'caminho' => $DadosConsulta['caminho'],
							'tipo' => $DadosConsulta['tipo'],
						);
					}

					$result = json_encode(array(
						'code'=>200, 
						'dados'=>$dados, 
						'ultimo_caminho'=> isset($ultimo_caminho) ? $ultimo_caminho : null,
						'posicao'=> $posicao_upload,
						'caminho'=> isset($ultimo_caminho) ? $ultimo_caminho : null
					));


				}

				if($_POST['acao'] == 'remover_arquivo_temp'){
					$caminho = isset($_POST['caminho']) ? mysqli_real_escape_string($conexao, $_POST['caminho']) : '';
					$removidos = 0;
					if($caminho != ''){
						$ConsultaRemover = "select * from arquivos_temp where usuario = '$id' and caminho = '$caminho'";
						$ExRemover = mysqli_query($conexao, $ConsultaRemover);
						while($DadosRemover = mysqli_fetch_assoc($ExRemover)){
							if(isset($DadosRemover['caminho']) && $DadosRemover['caminho'] != '' && file_exists($DadosRemover['caminho'])){
								@unlink($DadosRemover['caminho']);
							}
							$removidos++;
						}
						$DeleteRemover = "DELETE FROM arquivos_temp WHERE usuario = '$id' AND caminho = '$caminho'";
						mysqli_query($conexao, $DeleteRemover);
					}
					$result = json_encode(array('code'=>200, 'removidos'=>$removidos));
				}

				if($_POST['acao'] == 'posicoes_arquivos'){
					$posicoesJson = $_POST['posicoes'];
					$posicoes = json_decode($posicoesJson, true);
					$principal = isset($_POST['principal']) ? intval($_POST['principal']) : 0;
					if(!is_array($posicoes)){ $result = json_encode(array('code'=>400, 'message'=>'Formato inválido')); }
					else{
						$arquivoOrdem = "temp/order_".$id.".json";
						$slots = array('', '', '', '', '', '');
						$seen = array();
						foreach($posicoes as $item){
							if(isset($item['posicao'])){
								$idx = intval($item['posicao']);
								$cam = isset($item['caminho']) ? $item['caminho'] : '';
								$inv = ($cam === '') || (strpos($cam, 'assets/images/sem-foto.webp') !== false) || (strpos($cam, 'data:') === 0) || (strpos($cam, 'blob:') === 0);
								if(!$inv && $idx >= 0 && $idx < count($slots)){
									if(!in_array($cam, $seen, true)){
										$slots[$idx] = $cam;
										$seen[] = $cam;
									}
								}
							}
						}
						$wrapper = array('principal' => $principal, 'posicoes' => $slots);
						file_put_contents($arquivoOrdem, json_encode($wrapper));
						$result = json_encode(array('code'=>200, 'principal'=>$principal, 'posicoes'=>$slots));
					}
				}

	

				if($_POST['acao'] == 'categoria'){ 
					$nome = mysqli_real_escape_string($conexao, $_POST['nome']);

					$Salvar = "INSERT INTO categorias (nome, status) VALUES ('$nome','1')";
					$ExGeral = mysqli_query($conexao, $Salvar);
					$result = json_encode(array('code'=>200, 'message'=>'Cadastrado com sucesso!'));
		
				}

				if($_POST['acao'] == 'importar_produtos'){ 

					if (!isset($_FILES['arquivo'])) {
						$result = json_encode(array('code'=>400, 'message'=>'Nenhum arquivo recebido!'));
						exit;
					}

					$arquivo = $_FILES['arquivo']['tmp_name'];

					if (($handle = fopen($arquivo, 'r')) !== false) {

						// pula o cabeçalho
						fgetcsv($handle);

						while (($dados = fgetcsv($handle, 1000, ';')) !== false) {

							$SKU = utf8_encode(trim($dados[0]));
							$categoria = utf8_encode(trim($dados[1]));
							$descricao_curta = utf8_encode(trim($dados[2]));
							$descricaoCompleta = utf8_encode(trim($dados[3]));
							$marca = utf8_encode(trim($dados[4]));
							$garantia = utf8_encode(trim($dados[5]));
							$multiplo = utf8_encode(trim($dados[6]));
							$linkML = utf8_encode(trim($dados[7]));
							$linkVideo = utf8_encode(trim($dados[8]));

							

							if($SKU != ''){

								$Salvar = "INSERT INTO produtos (codigo,titulo,descricao,descricao_longa,cat,multiplo,marca,garantia,link_ml,link_youtube,status,destaque) 
								VALUES ('$SKU','$descricao_curta','$descricao_curta','$descricaoCompleta','$categoria','$multiplo','$marca','$garantia','$linkML','$linkVideo','0','0')";
								mysqli_query($conexao, $Salvar);
								$ultimo_id = mysqli_insert_id($conexao);

								mkdir('../../img/produtos/'.$ultimo_id, 0777, true);
								mkdir('../../img/produtos/'.$ultimo_id.'/micro', 0777, true);

								require_once('WideImage/WideImage.php');

								$placeholderName = $ultimo_id.'_1.jpg';
								$path700 = '../../img/produtos/'.$ultimo_id.'/'.$placeholderName;
								$pathMicro = '../../img/produtos/'.$ultimo_id.'/micro/'.$placeholderName;
								try{
									
									$img700 = WideImage_TrueColorImage::create($targetMainSize, $targetMainSize);
									$canvas700 = $img700->getCanvas();
									$bg700 = $img700->allocateColorAlpha(240, 240, 240, 0);
									$fg700 = $img700->allocateColorAlpha(60, 60, 60, 0);
									$canvas700->filledRectangle(0, 0, $targetMainSize - 1, $targetMainSize - 1, $bg700);
									$canvas700->useFont('fonts/arial.ttf', 120, $fg700);
									$canvas700->writeText('center', 'middle', strval($ultimo_id));
									$img700->saveToFile($path700);
									
									
									$imgMicro = WideImage_TrueColorImage::create($targetMicroSize, $targetMicroSize);
									$canvasMicro = $imgMicro->getCanvas();
									$bgMicro = $imgMicro->allocateColorAlpha(240, 240, 240, 0);
									$fgMicro = $imgMicro->allocateColorAlpha(60, 60, 60, 0);
									$canvasMicro->filledRectangle(0, 0, $targetMicroSize - 1, $targetMicroSize - 1, $bgMicro);
									$canvasMicro->useFont('fonts/arial.ttf', 96, $fgMicro);
									$canvasMicro->writeText('center', 'middle', strval($ultimo_id));
									$imgMicro->saveToFile($pathMicro);
									
								}catch(Exception $e){
								}

							}

							


						}

						fclose($handle);

						$result = json_encode(array('code'=>200, 'message'=>'Cadastrado com sucesso!'));
					}

					

				}

				

				if($_POST['acao'] == 'usuario'){ 
					$nome = mysqli_real_escape_string($conexao, $_POST['nome']);
					$login = mysqli_real_escape_string($conexao, $_POST['login']);
					$senha = mysqli_real_escape_string($conexao, $_POST['senha']);


					$ConsultaUsuario = "select count(*) as total from usuarios where login = '".$login."'";
					$ExUsuario = mysqli_query($conexao, $ConsultaUsuario);
					$DadosUsuario = mysqli_fetch_assoc($ExUsuario);

					if($DadosUsuario['total'] == 0){
						$SalvarGeral = "INSERT INTO usuarios (nome, login, senha, nivel, status) 
						VALUES ('$nome','$login','$senha','1','1')";
					    $ExGeral = mysqli_query($conexao, $SalvarGeral);
						$result = json_encode(array('code'=>200, 'message'=>'Cadastrado com sucesso!'));
					}else{
                        $result = json_encode(array('code'=>201, 'message'=>'Login já existe!'));
					}

				}

				if($_POST['acao'] == 'produto_cadastrar'){ 
					$titulo = mysqli_real_escape_string($conexao, $_POST['titulo']);
					$codigo = mysqli_real_escape_string($conexao, $_POST['codigo']);
					$descricao = mysqli_real_escape_string($conexao, $_POST['descricao']);
					$categoria = mysqli_real_escape_string($conexao, $_POST['categoria']);
					$multiplo = mysqli_real_escape_string($conexao, $_POST['multiplo']);
					$marca = mysqli_real_escape_string($conexao, $_POST['marca']);
					$garantia = mysqli_real_escape_string($conexao, $_POST['garantia']);
					$link_ml = mysqli_real_escape_string($conexao, $_POST['link_ml']);
					$link_youtube = mysqli_real_escape_string($conexao, $_POST['link_youtube']);
					//$destaque = mysqli_real_escape_string($conexao, $_POST['destaque']);
					$destaque = 0;
					$descricao_longa = mysqli_real_escape_string($conexao, $_POST['descricao_longa']);

					$Salvar = "INSERT INTO produtos 
					(
						codigo, 
						titulo, 
						descricao, 
						descricao_longa, 
						cat, 
						multiplo,
						marca,
						garantia,
						link_ml,
						link_youtube,
						status, 
						destaque
					) 
					VALUES 
					(
						'$codigo',
						'$titulo',
						'$descricao',
						'$descricao_longa',
						'$categoria',
						'$multiplo',
						'$marca',
						'$garantia',
						'$link_ml',
						'$link_youtube',
						'0',
						'$destaque'
					)";
					mysqli_query($conexao, $Salvar);
					$ultimo_id = mysqli_insert_id($conexao);

					mkdir('../../img/produtos/'.$ultimo_id, 0777, true);
					mkdir('../../img/produtos/'.$ultimo_id.'/micro', 0777, true);

					require_once('WideImage/WideImage.php');
					$slots = array('', '', '', '', '', '');
					$arquivoOrdem = "temp/order_".$id.".json";
					if(file_exists($arquivoOrdem)){
						$conteudoOrdem = @file_get_contents($arquivoOrdem);
						$dadosOrdem = json_decode($conteudoOrdem, true);
						if(isset($dadosOrdem['posicoes']) && is_array($dadosOrdem['posicoes'])){
							for($s = 0; $s < 6; $s++){
								if(isset($dadosOrdem['posicoes'][$s])){
									$slots[$s] = $dadosOrdem['posicoes'][$s];
								}
							}
						}
					}

					$ConsultaTemp = "select * from arquivos_temp where usuario = '$id'";
					$ExTemp = mysqli_query($conexao, $ConsultaTemp);
					$porPosicao = array();
					while($DadosTemp = mysqli_fetch_assoc($ExTemp)){
						$idxTemp = is_numeric($DadosTemp['posicao']) ? intval($DadosTemp['posicao']) : -1;
						if($idxTemp >= 0 && $idxTemp < 6){
							$porPosicao[$idxTemp] = $DadosTemp['caminho'];
						}
					}
					for($s = 0; $s < 6; $s++){
						if($slots[$s] == '' && isset($porPosicao[$s])){
							$slots[$s] = $porPosicao[$s];
						}
					}

					$hadImages = false;
					for($idx = 0; $idx < 6; $idx++){
						$src = $slots[$idx];
						if($src == '' || !file_exists($src)){ continue; }
						$seq = $idx + 1;
						$basename = $ultimo_id.'_'.$seq.'.jpg';
						$destMain = '../../img/produtos/'.$ultimo_id.'/'.$basename;
						$destMicro = '../../img/produtos/'.$ultimo_id.'/micro/'.$basename;
						try{
							$img = WideImage::load($src);
							$target700 = $targetMainSize;
							$res700 = $img->resize($target700, $target700, 'outside');
							$left700 = max(0, floor(($res700->getWidth() - $target700) / 2));
							$top700 = max(0, floor(($res700->getHeight() - $target700) / 2));
							$crop700 = $res700->crop($left700, $top700, $target700, $target700);
							$crop700->saveToFile($destMain);
							$targetMicro = $targetMicroSize;
							$resMicro = $img->resize($targetMicro, $targetMicro, 'outside');
							$leftMicro = max(0, floor(($resMicro->getWidth() - $targetMicro) / 2));
							$topMicro = max(0, floor(($resMicro->getHeight() - $targetMicro) / 2));
							$cropMicro = $resMicro->crop($leftMicro, $topMicro, $targetMicro, $targetMicro);
							$cropMicro->saveToFile($destMicro);
							$hadImages = true;
						}catch(Exception $e){
						}
					}

					$ConsultaLimpeza = "select * from arquivos_temp where usuario = '$id'";
					$ExLimpeza = mysqli_query($conexao, $ConsultaLimpeza);
					while($DadosLimpeza = mysqli_fetch_assoc($ExLimpeza)){
						if(isset($DadosLimpeza['caminho']) && $DadosLimpeza['caminho'] != '' && file_exists($DadosLimpeza['caminho'])){
							@unlink($DadosLimpeza['caminho']);
						}
					}
					$DeleteTodos = "DELETE FROM arquivos_temp WHERE usuario = '$id'";
					mysqli_query($conexao, $DeleteTodos);
					if(file_exists($arquivoOrdem)){
						@unlink($arquivoOrdem);
					}

					if(!$hadImages){
						$placeholderName = $ultimo_id.'_1.jpg';
						$path700 = '../../img/produtos/'.$ultimo_id.'/'.$placeholderName;
						$pathMicro = '../../img/produtos/'.$ultimo_id.'/micro/'.$placeholderName;
						try{
							
							$img700 = WideImage_TrueColorImage::create($targetMainSize, $targetMainSize);
							$canvas700 = $img700->getCanvas();
							$bg700 = $img700->allocateColorAlpha(240, 240, 240, 0);
							$fg700 = $img700->allocateColorAlpha(60, 60, 60, 0);
							$canvas700->filledRectangle(0, 0, $targetMainSize - 1, $targetMainSize - 1, $bg700);
							$canvas700->useFont('fonts/arial.ttf', 120, $fg700);
							$canvas700->writeText('center', 'middle', strval($ultimo_id));
							$img700->saveToFile($path700);
							
							
							$imgMicro = WideImage_TrueColorImage::create($targetMicroSize, $targetMicroSize);
							$canvasMicro = $imgMicro->getCanvas();
							$bgMicro = $imgMicro->allocateColorAlpha(240, 240, 240, 0);
							$fgMicro = $imgMicro->allocateColorAlpha(60, 60, 60, 0);
							$canvasMicro->filledRectangle(0, 0, $targetMicroSize - 1, $targetMicroSize - 1, $bgMicro);
							$canvasMicro->useFont('fonts/arial.ttf', 96, $fgMicro);
							$canvasMicro->writeText('center', 'middle', strval($ultimo_id));
							$imgMicro->saveToFile($pathMicro);
							
						}catch(Exception $e){
						}
					}

					$result = json_encode(array('code'=>200, 'message'=>'Cadastrado com sucesso!'));


				}
				
				if($_POST['acao'] == 'produto_editar_imagem'){
					$id_produto = isset($_POST['id']) ? intval($_POST['id']) : 0;
					$posicao = isset($_POST['posicao']) ? intval($_POST['posicao']) : 0;
					if($id_produto <= 0){
						$result = json_encode(array('code'=>400, 'message'=>'ID inválido'));
					}else{
						$dirMain = '../../img/produtos/'.$id_produto;
						$dirMicro = $dirMain.'/micro';
						if(!is_dir($dirMain)){ mkdir($dirMain, 0777, true); }
						if(!is_dir($dirMicro)){ mkdir($dirMicro, 0777, true); }
						$seq = $posicao + 1;
						$basename = $id_produto.'_'.$seq.'.jpg';
						$destMain = $dirMain.'/'.$basename;
						$destMicro = $dirMicro.'/'.$basename;
						if(isset($_FILES['arquivo']) && is_uploaded_file($_FILES['arquivo']['tmp_name'])){
							require_once('WideImage/WideImage.php');
							$srcTmp = $_FILES['arquivo']['tmp_name'];
							try{
								$img = WideImage::load($srcTmp);
								$target700 = $targetMainSize;
								$res700 = $img->resize($target700, $target700, 'outside');
								$left700 = max(0, floor(($res700->getWidth() - $target700) / 2));
								$top700 = max(0, floor(($res700->getHeight() - $target700) / 2));
								$crop700 = $res700->crop($left700, $top700, $target700, $target700);
								$crop700->saveToFile($destMain);
								$targetMicro = $targetMicroSize;
								$resMicro = $img->resize($targetMicro, $targetMicro, 'outside');
								$leftMicro = max(0, floor(($resMicro->getWidth() - $targetMicro) / 2));
								$topMicro = max(0, floor(($resMicro->getHeight() - $targetMicro) / 2));
								$cropMicro = $resMicro->crop($leftMicro, $topMicro, $targetMicro, $targetMicro);
								$cropMicro->saveToFile($destMicro);
								$result = json_encode(array('code'=>200, 'message'=>'Imagem atualizada', 'caminho'=>'../img/produtos/'.$id_produto.'/'.$basename));
							}catch(Exception $e){
								$result = json_encode(array('code'=>500, 'message'=>'Falha ao processar imagem'));
							}
						}else{
							$result = json_encode(array('code'=>400, 'message'=>'Arquivo não enviado'));
						}
					}
				}

				if($_POST['acao'] == 'produto_remover_imagem'){
					$id_produto = isset($_POST['id']) ? intval($_POST['id']) : 0;
					$posicao = isset($_POST['posicao']) ? intval($_POST['posicao']) : -1;
					if($id_produto <= 0 || $posicao < 0 || $posicao > 5){
						$result = json_encode(array('code'=>400, 'message'=>'Parâmetros inválidos'));
					}else{
						$dirMain = '../../img/produtos/'.$id_produto;
						$dirMicro = $dirMain.'/micro';
						$seq = $posicao + 1;

						$alvoMain = $dirMain.'/'.$id_produto.'_'.$seq.'.jpg';
						$alvoMicro = $dirMicro.'/'.$id_produto.'_'.$seq.'.jpg';
						if(file_exists($alvoMain)){ @unlink($alvoMain); }
						if(file_exists($alvoMicro)){ @unlink($alvoMicro); }

						for($i = $seq + 1; $i <= 6; $i++){
							$srcMain = $dirMain.'/'.$id_produto.'_'.$i.'.jpg';
							$dstMain = $dirMain.'/'.$id_produto.'_'.($i - 1).'.jpg';
							if(file_exists($srcMain)){
								if(file_exists($dstMain)){ @unlink($dstMain); }
								@rename($srcMain, $dstMain);
							}

							$srcMicro = $dirMicro.'/'.$id_produto.'_'.$i.'.jpg';
							$dstMicro = $dirMicro.'/'.$id_produto.'_'.($i - 1).'.jpg';
							if(file_exists($srcMicro)){
								if(file_exists($dstMicro)){ @unlink($dstMicro); }
								@rename($srcMicro, $dstMicro);
							}
						}

						$ultimoMain = $dirMain.'/'.$id_produto.'_6.jpg';
						$ultimoMicro = $dirMicro.'/'.$id_produto.'_6.jpg';
						if(file_exists($ultimoMain)){ @unlink($ultimoMain); }
						if(file_exists($ultimoMicro)){ @unlink($ultimoMicro); }

						$result = json_encode(array('code'=>200, 'message'=>'Imagem removida'));
					}
				}
				
				if($_POST['acao'] == 'produto_trocar_posicao'){
					$id_produto = isset($_POST['id']) ? intval($_POST['id']) : 0;
					$source = isset($_POST['source']) ? intval($_POST['source']) : -1;
					$target = isset($_POST['target']) ? intval($_POST['target']) : -1;
					if($id_produto <= 0 || $source < 0 || $target < 0 || $source > 5 || $target > 5){
						$result = json_encode(array('code'=>400, 'message'=>'Parâmetros inválidos'));
					}else{
						$dirMain = '../../img/produtos/'.$id_produto;
						$dirMicro = $dirMain.'/micro';
						if(!is_dir($dirMain)){ mkdir($dirMain, 0777, true); }
						if(!is_dir($dirMicro)){ mkdir($dirMicro, 0777, true); }
						$a = $id_produto.'_'.($source+1).'.jpg';
						$b = $id_produto.'_'.($target+1).'.jpg';
						$pathA = $dirMain.'/'.$a;
						$pathB = $dirMain.'/'.$b;
						$pathAm = $dirMicro.'/'.$a;
						$pathBm = $dirMicro.'/'.$b;
						
						$existA = file_exists($pathA);
						$existB = file_exists($pathB);
						
						$ok = true;
						
						if($existA && $existB){
							$tmpMain = $dirMain.'/'.$id_produto.'_swap_tmp.jpg';
							$tmpMicro = $dirMicro.'/'.$id_produto.'_swap_tmp.jpg';
							if(!@rename($pathA, $tmpMain)) $ok = false;
							if($ok && !@rename($pathB, $pathA)) $ok = false;
							if($ok && !@rename($tmpMain, $pathB)) $ok = false;
							if(file_exists($pathAm)){
								if(!@rename($pathAm, $tmpMicro)) $ok = false;
								if($ok && !@rename($pathBm, $pathAm)) $ok = false;
								if($ok && !@rename($tmpMicro, $pathBm)) $ok = false;
							}else{
								if(file_exists($pathBm)){
									// apenas move micro B para A se A não existe
									if(!@rename($pathBm, $pathAm)) $ok = false;
								}
							}
						}else if($existA && !$existB){
							if(!@rename($pathA, $pathB)) $ok = false;
							if(file_exists($pathAm)){
								if(!@rename($pathAm, $pathBm)) $ok = false;
							}
						}else if(!$existA && $existB){
							if(!@rename($pathB, $pathA)) $ok = false;
							if(file_exists($pathBm)){
								if(!@rename($pathBm, $pathAm)) $ok = false;
							}
						}else{
							$ok = true;
						}
						
						if($ok){
							@touch($pathA);
							@touch($pathB);
							if(file_exists($pathAm)) @touch($pathAm);
							if(file_exists($pathBm)) @touch($pathBm);
							$result = json_encode(array('code'=>200, 'message'=>'Posição atualizada'));
						}else{
							$result = json_encode(array('code'=>500, 'message'=>'Falha ao renomear arquivos'));
						}
					}
				}
					
			}


				
		}
	
	}else{
		$result = json_encode(array('success'=>false, 'aviso'=>'Parametro não informado!'));
	}
}else{
	$result = json_encode(array('success'=>false, 'aviso'=>'Token não informado!'));
}

echo $result;

?>
