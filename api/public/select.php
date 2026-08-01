<?php include_once('../conexao.php');

ini_set('display_errors',1);
ini_set('display_startup_erros',1);
error_reporting(E_ALL);

function vidrama_slug($texto){
	$texto = trim((string)$texto);
	if($texto == ''){ return ''; }
	$convertido = @iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $texto);
	if($convertido !== false){ $texto = $convertido; }
	$texto = strtolower($texto);
	$texto = preg_replace('/[^a-z0-9]+/', '-', $texto);
	return trim($texto, '-');
}

function vidrama_slug_compacto($texto){
	return str_replace('-', '', vidrama_slug($texto));
}

function vidrama_slug_produto($produto){
	$slug = vidrama_slug($produto['titulo']);
	if($slug == ''){ $slug = vidrama_slug($produto['codigo']); }
	return $slug;
}

function vidrama_produto_confere_slug($produto, $slugBusca){
	$slugBusca = vidrama_slug($slugBusca);
	$slugBuscaCompacto = str_replace('-', '', $slugBusca);
	$opcoes = array(
		vidrama_slug($produto['titulo']),
		vidrama_slug($produto['codigo']),
		vidrama_slug($produto['codigo'].' '.$produto['titulo']),
		vidrama_slug($produto['titulo'].' '.$produto['codigo'])
	);

	foreach($opcoes as $slug){
		if($slug == ''){ continue; }
		if($slug == $slugBusca || str_replace('-', '', $slug) == $slugBuscaCompacto){
			return true;
		}

		$restante = $slugBuscaCompacto;
		$palavras = explode('-', $slug);
		usort($palavras, function($a, $b){
			return strlen($b) - strlen($a);
		});

		foreach($palavras as $palavra){
			if(strlen($palavra) < 3){ continue; }
			$pos = strpos($restante, $palavra);
			if($pos !== false){
				$restante = substr_replace($restante, '', $pos, strlen($palavra));
			}
		}

		if($restante == ''){
			return true;
		}
	}

	return false;
}


if(isset($_POST['acao'])){


	if($_POST['acao'] == 'home'){

		$dados = [];
		$Consulta = "SELECT 
		id, 
		nome, 
		valor, 
		avaliacoes 
		FROM usuarios where status = 1 order by id DESC limit 6";
		$ExConsulta = mysqli_query($conexao, $Consulta);
		while($DadosConsulta = mysqli_fetch_assoc($ExConsulta)){ 

			$arquivo = "../../assets/img/".$DadosConsulta['id'].".jpg";
 
			if (file_exists($arquivo)) {
				$img = $url."assets/img/".$DadosConsulta['id'].".jpg";
			} else {
				$img = $url."assets/img/sem-img.jpg";
			}
							
			$dados[] = array(
				'id' => $DadosConsulta['id'],
				'img' => $img,
				'nome' => $DadosConsulta['nome'],
				'valor' => $DadosConsulta['valor'],
				'avaliacoes' => $DadosConsulta['avaliacoes'],
			);
		}

		$result = json_encode(array('code'=>200, 'dados'=>$dados));

	}

	if($_POST['acao'] == 'cookie'){

		$ip = mysqli_real_escape_string($conexao, $_POST['ip']);

		$Consulta = "SELECT count(*) as total FROM cookies where ip = '$ip'";
		$ExConsulta = mysqli_query($conexao, $Consulta);
		$DadosConsulta = mysqli_fetch_assoc($ExConsulta);

		$ConsultaVisita = "SELECT id, count(*) as total FROM visitantes where data = CURDATE()";
		$ExConsultaVisita = mysqli_query($conexao, $ConsultaVisita);
		$DadosConsultaVisita = mysqli_fetch_assoc($ExConsultaVisita);	

		if($DadosConsultaVisita['total'] == 0){
			$Salvar = "INSERT INTO visitantes (visitas, data) VALUES ('1',CURDATE())";
			mysqli_query($conexao, $Salvar);
		}else{
			$update = "UPDATE visitantes SET visitas = visitas + 1 WHERE id = ".$DadosConsultaVisita['id']."";
            mysqli_query($conexao, $update);
		}

		

		if($DadosConsulta['total'] == 0){
			$result = json_encode(array('code'=>400, 'message'=>'Cookie não aceito!'));
		}else{
			$result = json_encode(array('code'=>200, 'message'=>'Cookie aceito com sucesso!'));
		}

	}

	if($_POST['acao'] == 'produtos'){
		
		$filtro = mysqli_real_escape_string($conexao, $_POST['filtro']);
		$pesquisa = mysqli_real_escape_string($conexao, $_POST['pesquisa']);

		$pesquisando = '';
		if($filtro == 0){
			if($pesquisa != ''){ $pesquisando = "AND (titulo like '%$pesquisa%' OR codigo like '%$pesquisa%')"; }
			$Consulta = "SELECT * FROM produtos where status = 1 $pesquisando order by id ASC";
		}else{
			if($pesquisa != ''){ $pesquisando = "AND (titulo like '%$pesquisa%' OR codigo like '%$pesquisa%')"; }
			$Consulta = "SELECT * FROM produtos where cat = $filtro $pesquisando AND status = 1 order by id ASC";
		}

		$dados = [];
		$ExConsulta = mysqli_query($conexao, $Consulta);
		while($DadosConsulta = mysqli_fetch_assoc($ExConsulta)){ 

			$arquivoMain = "../../img/produtos/".$DadosConsulta['id']."/".$DadosConsulta['id']."_1.jpg";
			$arquivoMicro = "../../img/produtos/".$DadosConsulta['id']."/micro/".$DadosConsulta['id']."_1.jpg";
 
			if (file_exists($arquivoMain)) {
				$versao = @filemtime($arquivoMain);
				if(!$versao){ $versao = time(); }
				// Usa imagem principal para manter qualidade alta na vitrine.
				$img = "img/produtos/".$DadosConsulta['id']."/".$DadosConsulta['id']."_1.jpg?v=".$versao;
			} else if (file_exists($arquivoMicro)) {
				$versao = @filemtime($arquivoMicro);
				if(!$versao){ $versao = time(); }
				$img = "img/produtos/".$DadosConsulta['id']."/micro/".$DadosConsulta['id']."_1.jpg?v=".$versao;
			} else {
				$img = $url."img/sem_imagem.jpg";
			}
					
			$dados[] = array(
				'id' => $DadosConsulta['id'],
				'img' => $img,
				'slug' => vidrama_slug_produto($DadosConsulta),
				'codigo' => $DadosConsulta['codigo'],
				'titulo' => $DadosConsulta['titulo'],
				'descricao' => $DadosConsulta['descricao'],
			);
		}


		$result = json_encode(array('code'=>200, 'dados'=>$dados));

	}

	if($_POST['acao'] == 'detalhes'){

		$dados = [];
		$DadosConsulta = null;

		if(isset($_POST['slug']) && trim($_POST['slug']) != ''){
			$slug = mysqli_real_escape_string($conexao, $_POST['slug']);
			$Consulta = "SELECT p.*, c.nome as categoria_nome FROM produtos p LEFT JOIN categorias c ON c.id = p.cat where p.status = 1 order by p.id ASC";
			$ExConsulta = mysqli_query($conexao, $Consulta);
			while($Produto = mysqli_fetch_assoc($ExConsulta)){
				if(vidrama_produto_confere_slug($Produto, $slug)){
					$DadosConsulta = $Produto;
					break;
				}
			}
		}else{
			$id = isset($_POST['id']) ? intval($_POST['id']) : 0;
			$Consulta = "SELECT p.*, c.nome as categoria_nome FROM produtos p LEFT JOIN categorias c ON c.id = p.cat where p.id = $id";
			$ExConsulta = mysqli_query($conexao, $Consulta);
			$DadosConsulta = mysqli_fetch_assoc($ExConsulta);
		}

		if(!$DadosConsulta){
			$result = json_encode(array('code'=>404, 'message'=>'Produto não encontrado!'));
			echo $result;
			exit;
		}

		$imagens = [];
		$img = $url."img/sem_imagem.jpg";
		for($i = 1; $i <= 6; $i++){
			$arquivoMain = "../../img/produtos/".$DadosConsulta['id']."/".$DadosConsulta['id']."_".$i.".jpg";
			$arquivoMicro = "../../img/produtos/".$DadosConsulta['id']."/micro/".$DadosConsulta['id']."_".$i.".jpg";
			if(file_exists($arquivoMain) || file_exists($arquivoMicro)){
				$versao = file_exists($arquivoMain) ? @filemtime($arquivoMain) : @filemtime($arquivoMicro);
				if(!$versao){ $versao = time(); }
				$imagemAtual = "img/produtos/".$DadosConsulta['id']."/".$DadosConsulta['id']."_".$i.".jpg?v=".$versao;
				if(!file_exists($arquivoMain) && file_exists($arquivoMicro)){
					$imagemAtual = "img/produtos/".$DadosConsulta['id']."/micro/".$DadosConsulta['id']."_".$i.".jpg?v=".$versao;
				}

				if(count($imagens) == 0){
					$img = $imagemAtual;
				}

				$imagens[] = $imagemAtual;
			}
		}
						
		$dados[] = array(
			'id' => $DadosConsulta['id'],
			'img' => $img,
			'imagens' => $imagens,
			'slug' => vidrama_slug_produto($DadosConsulta),
			'codigo' => $DadosConsulta['codigo'],
			'titulo' => $DadosConsulta['titulo'],
			'descricao' => $DadosConsulta['descricao'],
			'descricao_longa' => $DadosConsulta['descricao_longa'],
			'categoria_id' => $DadosConsulta['cat'],
			'categoria_nome' => $DadosConsulta['categoria_nome'] != '' ? $DadosConsulta['categoria_nome'] : $DadosConsulta['cat'],
			'multiplo' => $DadosConsulta['multiplo'],
			'marca' => $DadosConsulta['marca'],
			'garantia' => $DadosConsulta['garantia'],
			'link_ml' => $DadosConsulta['link_ml'],
			'link_youtube' => $DadosConsulta['link_youtube'],
		);



		$result = json_encode(array('code'=>200, 'dados'=>$dados));

	}

	if($_POST['acao'] == 'categorias'){

		$dados = [];
		$Consulta = "SELECT * FROM categorias where status = 1";
		$ExConsulta = mysqli_query($conexao, $Consulta);
		while($DadosConsulta = mysqli_fetch_assoc($ExConsulta)){ 

			$dados[] = array(
				'id' => $DadosConsulta['id'],
				'nome' => $DadosConsulta['nome'],
			);

		}

		$result = json_encode(array('code'=>200, 'dados'=>$dados));

	}

	
}else{
	$result = json_encode(array('code'=>400, 'message'=>'Parametro não informado!'));
}



echo $result;



	



 ?>
