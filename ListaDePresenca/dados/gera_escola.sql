DROP DATABASE IF EXISTS escolax;

CREATE DATABASE escolax CHARACTER SET latin7 COLLATE latin7_general_ci;
USE escolax;

create table turmas (id_chave_turma int not null auto_increment, nome_turma varchar(100), primary key (id_chave_turma), unique(nome_turma));

create table professores (id_chave_professor int not null auto_increment, nome_professor varchar(200), primary key (id_chave_professor));

create table turmas_professores (id_chave_turma_professor int not null auto_increment, nome_turma_professor varchar(100), id_turma int, id_professor int, primary key (id_chave_turma_professor));

create table estudantes(id_chave_estudante int not null auto_increment, nome_estudante varchar(200), id_turma int, primary key (id_chave_estudante));

create table presencas(id_chave_presenca int not null auto_increment, nome_presenca varchar(100), id_estudante int, time_stamp timestamp, primary key (id_chave_presenca));

ALTER TABLE estudantes ADD CONSTRAINT FK_estudante_turma FOREIGN KEY (id_turma) REFERENCES turmas(id_chave_turma);
ALTER TABLE presencas ADD CONSTRAINT FK_estudante_presenca FOREIGN KEY (id_estudante) REFERENCES estudantes(id_chave_estudante);
ALTER TABLE turmas_professores ADD CONSTRAINT FK_turma_professor FOREIGN KEY (id_turma) REFERENCES turmas(id_chave_turma);
ALTER TABLE turmas_professores ADD CONSTRAINT FK_professor_turma FOREIGN KEY (id_professor) REFERENCES professores(id_chave_professor);

insert into professores(nome_professor) values ( "Joana");
insert into professores(nome_professor) values ( "Tatiane");
insert into professores(nome_professor) values ( "Alfredo");
insert into professores(nome_professor) values ( "Maria");
insert into professores(nome_professor) values ( "Pedro");

insert into turmas (nome_turma) values ("Primeiro Ano A");
insert into turmas (nome_turma) values ("Primeiro Ano B");

insert into turmas (nome_turma) values ("Segundo Ano A");
insert into turmas (nome_turma) values ("Segundo Ano B");

insert into turmas (nome_turma) values ("Terceiro Ano A");
insert into turmas (nome_turma) values ("Terceiro Ano B");

insert into estudantes (id_turma, nome_estudante) values ((select id_chave_turma from turmas where nome_turma="Primeiro Ano A"), "Isabela");
insert into estudantes (id_turma, nome_estudante) values ((select id_chave_turma from turmas where nome_turma="Primeiro Ano A"), "Victoria");
insert into estudantes (id_turma, nome_estudante) values ((select id_chave_turma from turmas where nome_turma="Primeiro Ano A"), "Jose");
insert into estudantes (id_turma, nome_estudante) values ((select id_chave_turma from turmas where nome_turma="Primeiro Ano A"), "Mario");

insert into estudantes (id_turma, nome_estudante) values ((select id_chave_turma from turmas where nome_turma="Primeiro Ano B"), "Roberto");
insert into estudantes (id_turma, nome_estudante) values ((select id_chave_turma from turmas where nome_turma="Primeiro Ano B"), "Paulo");
insert into estudantes (id_turma, nome_estudante) values ((select id_chave_turma from turmas where nome_turma="Primeiro Ano B"), "Fabio");
insert into estudantes (id_turma, nome_estudante) values ((select id_chave_turma from turmas where nome_turma="Primeiro Ano B"), "Carolina");

insert into estudantes (id_turma, nome_estudante) values ((select id_chave_turma from turmas where nome_turma="Segundo Ano B"), "Roberta");
insert into estudantes (id_turma, nome_estudante) values ((select id_chave_turma from turmas where nome_turma="Segundo Ano B"), "Paula");
insert into estudantes (id_turma, nome_estudante) values ((select id_chave_turma from turmas where nome_turma="Segundo Ano B"), "Fabia");
insert into estudantes (id_turma, nome_estudante) values ((select id_chave_turma from turmas where nome_turma="Segundo Ano B"), "Tania");




