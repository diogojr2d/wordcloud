<!DOCTYPE html>
<html lang="pt">
<head>
	<meta charset="utf-8">
	<meta name="author" content="Diogo Junior de Souza (Programação), Carol Moura (Design Gráfico), Andrea (Conteúdo).">
	<meta name="description" content="Nuvem de palavras da disciplina de Introdução a EAD (UFSC)">
	<meta name="keywords" content="Nuvem de Palavras, Educação, Introdução a EAD, EAD, Educação a Distância">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">

	<title>Nuvem de Palavras - Intro EAD</title>

	<link rel="stylesheet" href="css/style.css">
	<script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
</head>
<body>
	<?php
	  $login_cookie = $_COOKIE['login'];
	    if(isset($login_cookie)){
	      echo"Bem-Vindo, $login_cookie <br>";
	      echo"Essas informações <font color='red'>PODEM</font> ser acessadas por você";
	    } else {
	      echo"Bem-Vindo, convidado <br>";
	      echo"Essas informações <font color='red'>NÃO PODEM</font> ser acessadas por você";
	      echo"<br><a href='login.html'>Faça Login</a> Para ler o conteúdo";
	    }
	?>
</body>
</html>