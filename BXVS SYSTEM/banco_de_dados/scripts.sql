drop database if exists academia;
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
  
  create table checkin(
  idCheckin int primary key auto_increment, 
  dataHoraEntrada datetime not null default current_timestamp, 
  dataHoraSaida datetime, 
  fkCliente int not null, 
  foreign key (fkCliente) references cliente(idCliente)
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
  _status  ENUM("Ativa", "Inativa", "Pendente") NOT NULL,
  fkCliente INT NOT NULL,
  fkPlano INT NOT NULL,
  FOREIGN KEY (fkCliente) REFERENCES cliente(idCliente),
  FOREIGN KEY (fkPlano) REFERENCES plano(idPlano)
);


CREATE TABLE pagamento (
  idPagamento INT primary key AUTO_INCREMENT,
  valor DECIMAL(10,2) NOT NULL,
  dataPagamento TIMESTAMP NOT NULL DEFAULT current_timestamp,
  metodo ENUM("Dinheiro", "Cartão", "Pix", "Boleto") NOT NULL,
  _status ENUM("Pago", "Pendente", "Atrasado") NOT NULL DEFAULT "Pendente",
  fkMatricula INT NOT NULL,
  FOREIGN KEY (fkMatricula) REFERENCES matricula(idMatricula)
);

create view controleAcesso as 
select idCheckin as id, cl.nome, date_format(dataHoraEntrada, "%H:%i") as horarioChegada, date_format(dataHoraSaida, "%H:%i") as horarioSaida , p._status as situacaoMatricula, pl.nome as plano from cliente as cl 
inner join checkin as ch on ch.fkCliente = cl.idCliente  
inner join matricula as m on m.fkCliente = cl.idCliente 
inner join pagamento as p on p.fkMatricula = m.idMatricula
inner join plano as pl on pl.idPlano = m.fkPlano;

INSERT INTO plano (nome, descricao, preco, duracaoMeses) VALUES
('Básico', 'Acesso à academia durante horário comercial', 100.00, 1),
('Premium', 'Acesso 24h e aulas inclusas', 200.00, 1),
('VIP', 'Acesso total e personal trainer incluso', 400.00, 3);

INSERT INTO cliente (nome, email, senha, telefone, sexo, rg, cpf, dataNascimento, estadoCivil, dataCadastro) VALUES
('João Silva', 'joao@example.com', '1234', '11999990000', 'Masculino', '12345678', '11122233344', '1990-05-12', 'Solteiro', NOW()),
('Maria Oliveira', 'maria@example.com', '1234', '11988880000', 'Feminino', '87654321', '22233344455', '1992-08-20', 'Casada', NOW()),
('Carlos Souza', 'carlos@example.com', '1234', '11977770000', 'Masculino', '13572468', '33344455566', '1985-11-30', 'Solteiro', NOW()),
('Ana Pereira', 'ana@example.com', '1234', '11966660000', 'Feminino', '24681357', '44455566677', '1998-03-15', 'Solteira', NOW());

INSERT INTO matricula (dataInicio, dataFim, _status, fkCliente, fkPlano) VALUES
('2025-09-01','2025-09-30','ativa',1,1),
('2025-09-01','2025-09-30','ativa',2,2),
('2025-09-01','2025-11-30','pendente',3,3),
('2025-09-01','2025-09-30','inativa',4,1);

INSERT INTO pagamento (valor, metodo, _status, fkMatricula) VALUES
(100.00,'pix','pago',1),
(200.00,'cartão','pendente',2),
(400.00,'boleto','atrasado',3),
(100.00,'dinheiro','pago',4);

INSERT INTO checkin (dataHoraEntrada, dataHoraSaida, fkCliente) VALUES
('2025-09-21 08:15:00','2025-09-21 09:45:00',1),
('2025-09-21 17:30:00','2025-09-21 19:00:00',2),
('2025-09-20 06:50:00','2025-09-20 08:10:00',1),
('2025-09-19 18:15:00','2025-09-19 19:30:00',3),
('2025-09-18 07:00:00','2025-09-18 08:20:00',2),
('2025-09-21 10:00:00',NULL,4),  -- ainda dentro da academia
('2025-09-21 12:30:00','2025-09-21 13:45:00',1),
('2025-09-21 20:15:00','2025-09-21 21:30:00',3);

select * from controleAcesso;