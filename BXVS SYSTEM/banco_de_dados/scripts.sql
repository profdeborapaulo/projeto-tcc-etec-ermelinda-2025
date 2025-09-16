create database academia;
use academia;

CREATE TABLE administrador(
  idProfessor INT primary key AUTO_INCREMENT,
  nome VARCHAR(200) NOT NULL,
  email VARCHAR(200) unique NOT NULL,
  senha VARCHAR(20) NOT NULL
);

CREATE TABLE cliente(
  idCliente INT primary key auto_increment,
  nome VARCHAR(200) NOT NULL,
  email VARCHAR(200) unique NOT NULL,
  senha VARCHAR(20) NOT NULL,
  telefone varchar(20) NOT NULL,
  sexo VARCHAR(9) NOT NULL,
  rg varchar(20) NOT NULL,
  cpf varchar(20) NOT NULL,
  dataNascimento DATE NOT NULL,
  estadoCivil VARCHAR(20) NOT NULL,
  dataCadastro datetime NOT NULL
  );

CREATE TABLE plano(
  idPlano INT primary key AUTO_INCREMENT,
  nome VARCHAR(45) NOT NULL,
  descricao TEXT NOT NULL,
  preco DECIMAL(10,2) NOT NULL,
  duracaoMeses INT NOT NULL
  );

CREATE TABLE matricula (
  idMatricula INT primary key AUTO_INCREMENT,
  dataInicio DATE NOT NULL,
  dataFim DATE NOT NULL,
  _status  ENUM("ativa", "inativa", "pendente") NOT NULL,
  idCliente INT NOT NULL,
  idPlano INT NOT NULL,
  FOREIGN KEY (idCliente) REFERENCES cliente(idCliente),
  FOREIGN KEY (idPlano) REFERENCES plano(idPlano)
);

CREATE TABLE pagamento (
  idPagamento INT primary key AUTO_INCREMENT,
  valor DECIMAL(10,2) NOT NULL,
  dataPagamento TIMESTAMP NOT NULL DEFAULT current_timestamp,
  metodo ENUM("dinheiro", "cartão", "pix", "boleto") NOT NULL,
  _status ENUM("pago", "pendente", "atrasado") NOT NULL DEFAULT "pendente",
  idMatricula INT NOT NULL,
  FOREIGN KEY (idMatricula) REFERENCES matricula(idMatricula)
);

select * from cliente