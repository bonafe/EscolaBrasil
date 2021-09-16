<?php

if(isset($_GET["nome"])){
  $nome = $_GET["nome"];
} else {$nome="nao forneceu nome";}

if(isset($_GET["dia"])){
  $dia = $_GET["dia"];
} else {$dia=date('Y-m-d');}




$username="victor";
$pass="aerofolio";
$database="escolax";
$agora=date('Y-m-d');

echo "
<style>
body {
	font-size: 6 rem;

}

table, td {
	border: 1px solid black;

}
</style>

";


$conn= new mysqli("localhost", $username, $pass, $database);

$sql="insert into presencas (id_estudante) values ((select id_chave_estudante from estudantes where nome_estudante='".$nome."'))";

if ($conn->query($sql)===true){ echo "Presenca de ".$nome." foi registrada.";} else {echo "<br> Deu problema com o sql: ".$sql." erro:".$conn->error;}


$sql="select nome_estudante, time_stamp from estudantes, presencas where id_estudante=id_chave_estudante and time_stamp like '".$dia."%'";


$result=$conn->query("$sql");

if ($result->num_rows>0) {
echo "<table>";

    while($row=$result->fetch_assoc()){
	$nome_estudante=$row["nome_estudante"];
	$time_stamp=$row["time_stamp"];
	echo "<tr><td>".$nome_estudante."</td><td>".$time_stamp."</td></tr>";
	}
echo "</table>";
}

?>

