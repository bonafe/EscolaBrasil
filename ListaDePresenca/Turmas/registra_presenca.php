<?php
// por Victor
if(isset($_GET["nome"])){
  $nome = $_GET["nome"];
} else {$nome="nao forneceu nome";}

if(isset($_GET["id"])){
  $id = $_GET["id"];
} else {$id="nao forneceu id";}

if(isset($_GET["dia"])){
  $dia = $_GET["dia"];
} else {$dia=date('Y-m-d');}




$username="ops";
$pass="ops";
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

$sql="insert into presencas(id_registrado) values (".$id.")";

if ($conn->query($sql)===true){ echo "Presenca de ".$nome." foi registrada.";} else {echo "<br> Deu problema com o sql: ".$sql." erro:".$conn->error;}


$sql="select nome_registrado, time_stamp from registrados, presencas where id_registrado=id_chave_registrado and time_stamp like '".$dia."%'";


$result=$conn->query("$sql");

if ($result->num_rows>0) {
echo "<table>";

    while($row=$result->fetch_assoc()){
	$nome_registrado=$row["nome_registrado"];
	$time_stamp=$row["time_stamp"];
	echo "<tr><td>".$nome_registrado."</td><td>".$time_stamp."</td></tr>";
	}
echo "</table>";
}

?>

