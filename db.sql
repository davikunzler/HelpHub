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
DROP TABLE Comentarios;DROP TABLE Comentarios;

CREATE TABLE Comentarios(

    id_comentario INT AUTO_INCREMENT PRIMARY KEY,
    conteudo VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE Avaliacoes (
    id_avaliacao INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    nota INT NOT NULL CHECK (nota BETWEEN 1 AND 5),
    comentario TEXT,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
);

INSERT INTO Usuarios (id_usuario, nome, senha, email)
VALUES ('1', 'ass Teste', 'ssdda1234', 'lol@example.com');

ALTER TABLE Comentarios ADD COLUMN id_postagem INT;

select * from Usuarios;
select * from Avaliacoes;
drop table Usuarios;