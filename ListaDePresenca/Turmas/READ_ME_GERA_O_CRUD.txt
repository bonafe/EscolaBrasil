Para gerar o CRUD é preciso garantir que existe um diretório "autophp" no diretório "html". Se vocẽ fizer o "git clone" esse diretório deve ser criado automaticamente e, inclusive, já deve conter uma versao do CRUD que está de acordo com a estrutura de dados presente no arquivo gera_escola.sql, que está no diretório "dados".

Mas se vc quiser alterar a estrutura do banco de dados, vai ter que seguir uma regra de nomeação de campos que não poderei explicar agora. 

Essa alteracao deve ser feita no arquivo gera_escola.sql.

Depois de feita a mudança no arquivo gera_escola.sql, é preciso fazer ele entrar para a base de dados com o comando:

sudo mysql -u root -pSENHA escolax < gera_escola.sql

Depois é preciso abrir o arquivo super_interfaces_sem_pass.php?banco=escolax em algum browser.

Imediatamente o CRUD será criado no diretório autophp.

para chamar o CRUD chame "../autophp/backoffice.html".

NOTA: CRUD é a ferramenta para criar, buscar, atualizar e deletar dados na base de dados.
