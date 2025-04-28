CREATE DATABASE Feira;
USE Feira;

CREATE TABLE Usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(35) NOT NULL,
    senha VARCHAR(15) NOT NULL,
    email VARCHAR(35) UNIQUE NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Postagens (
    id_postagem INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(40) NOT NULL,
    descricao VARCHAR(200) NOT NULL,
    filtro ENUM ('design','programacao','materialEstudo','projetos'),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE Comentarios(
    id_comentario INT AUTO_INCREMENT PRIMARY KEY,
    conteudo VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

select * from Usuarios;
select * from Comentarios;
drop table Postagens;