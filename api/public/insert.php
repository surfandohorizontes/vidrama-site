<?php include_once('../conexao.php');

ini_set('display_errors',1);
ini_set('display_startup_erros',1);
error_reporting(E_ALL);


if(isset($_POST['acao'])){


	if($_POST['acao'] == 'cookie'){

	    $ip = mysqli_real_escape_string($conexao, $_POST['ip']);

		$Dados = "INSERT INTO cookies (ip) VALUES ('$ip')";
		mysqli_query($conexao, $Dados);

		$result = json_encode(array('code'=>200, 'message'=>'Cookie aceito com sucesso!'));

	}
	
}else{
	$result = json_encode(array('code'=>400, 'message'=>'Parametro não informado!'));
}



echo $result;



	



 ?>
