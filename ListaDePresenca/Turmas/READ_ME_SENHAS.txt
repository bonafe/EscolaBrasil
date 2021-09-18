Para o sistema funcionar é preciso colocar dois arquivos nos diretórios "php_backend" e "autophp". 

Estes arquivos são idênticos e é possível dois links lógicos em um dos diretórios, apontando para os arquivos do outro diretório.

O primeiro arquivo tem que se chamar "identifica.php" e deve conter o seguinte:


<?php
$username="usuario";
$pass="senha";
?>


O segundo arquivo tem que se char "identifica_barra_hiphen.php" e deve conter o seguinte:


<?php
$username=\'usuario\';
$pass=\'senha\';
?>



