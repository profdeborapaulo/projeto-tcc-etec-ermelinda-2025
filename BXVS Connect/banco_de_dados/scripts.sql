-- ============================================================
-- 🏋️‍♂️ BANCO DE DADOS: academia
-- Versão com pagamentos automáticos mensais e controle de atrasos
-- ============================================================

DROP DATABASE IF EXISTS academia;
CREATE DATABASE academia;
USE academia;

-- ===============================
-- TABELAS PRINCIPAIS
-- ===============================

CREATE TABLE administrador (
  idProfessor INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(200) NOT NULL,
  email VARCHAR(200) UNIQUE NOT NULL,
  senha VARCHAR(20) NOT NULL, 
  tema varchar(100) default "Padrão", 
  corPrimaria varchar(100) default "Padrão (BXVS)", 
  idioma varchar(100) default "Português", 
  mostrarDataHora bool default true, 
  fusoHorario varchar(100) default "Horário de Brasília", 
  notificacoes bool default true
);

  CREATE TABLE cliente (
    idCliente INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(200) NOT NULL,
    email VARCHAR(200) UNIQUE NOT NULL,
    senha VARCHAR(20) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    sexo VARCHAR(9) NOT NULL,
    rg VARCHAR(20) NOT NULL,
    cpf VARCHAR(20) NOT NULL,
    dataNascimento DATE NOT NULL,
    estadoCivil VARCHAR(20) NOT NULL,
    dataCadastro DATETIME NOT NULL, 
    face_embedding LONGTEXT null,
    endereco varchar(200) not null, 
    notaInterna text null
  );

CREATE TABLE checkin (
  idCheckin INT PRIMARY KEY AUTO_INCREMENT,
  dataHoraEntrada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  dataHoraSaida DATETIME,
  fkCliente INT NOT NULL,
  FOREIGN KEY (fkCliente) REFERENCES cliente(idCliente)
);

CREATE TABLE plano (
  idPlano INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(45) NOT NULL,
  descricao TEXT NOT NULL,
  preco DECIMAL(10,2) NOT NULL,
  duracaoMeses INT NOT NULL,
  diasPermitidos VARCHAR(20) NOT NULL
);

CREATE TABLE matricula (
  idMatricula INT PRIMARY KEY AUTO_INCREMENT,
  dataInicio DATE NOT NULL,
  dataFim DATE NOT NULL,
  _status ENUM('Ativa', 'Inativa', 'Pendente') NOT NULL,
  fkCliente INT NOT NULL,
  fkPlano INT NOT NULL,
  FOREIGN KEY (fkCliente) REFERENCES cliente(idCliente),
  FOREIGN KEY (fkPlano) REFERENCES plano(idPlano)
);

CREATE TABLE pagamento (
  idPagamento INT PRIMARY KEY AUTO_INCREMENT,
  valor DECIMAL(10,2) NOT NULL,
  dataPagamento TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  metodo ENUM('Dinheiro','Cartão','Pix','Boleto') NOT NULL,
  _status ENUM('Pago','Pendente','Atrasado') NOT NULL DEFAULT 'Pendente',
  dataVencimento DATE NULL,
  fkMatricula INT NOT NULL,
  FOREIGN KEY (fkMatricula) REFERENCES matricula(idMatricula)
);

-- ===============================
-- TABELAS AUXILIARES
-- ===============================

DROP TABLE IF EXISTS calendario;
CREATE TABLE calendario (
    dia DATE PRIMARY KEY
);

CREATE TABLE biometria_fotos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id VARCHAR(255) NOT NULL,
    instrucao VARCHAR(100) NOT NULL,
    foto_data LONGTEXT NOT NULL,
    data_captura TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- POPULANDO O CALENDÁRIO
-- ===============================

INSERT INTO calendario (dia)
SELECT DATE('2025-01-01') + INTERVAL n DAY
FROM (
    SELECT a.N + b.N*10 + c.N*100 AS n
    FROM (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
          UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) a,
         (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
          UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b,
         (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
          UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) c
) nums
WHERE DATE('2025-01-01') + INTERVAL n DAY <= '2026-12-31';

-- ===============================
-- VIEWS DE RELATÓRIOS
-- ===============================

CREATE OR REPLACE VIEW frequenciaAlunos AS
SELECT
    c.idCliente,
    c.nome,
    -- Total de dias possíveis (dias do calendário que batem com diasPermitidos do plano)
    COUNT(DISTINCT CASE 
        WHEN FIND_IN_SET(DAYOFWEEK(cal.dia), pl.diasPermitidos)
        THEN cal.dia
    END) AS diasPossiveis,
    
    -- Total de presenças
    COUNT(DISTINCT CASE 
        WHEN FIND_IN_SET(DAYOFWEEK(cal.dia), pl.diasPermitidos) 
             AND ch.idCheckin IS NOT NULL
        THEN cal.dia
    END) AS presencas,
    
    -- Frequência em %
    CONCAT(
        ROUND(
            COUNT(DISTINCT CASE 
                WHEN FIND_IN_SET(DAYOFWEEK(cal.dia), pl.diasPermitidos) 
                     AND ch.idCheckin IS NOT NULL
                THEN cal.dia
            END) / 
            COUNT(DISTINCT CASE 
                WHEN FIND_IN_SET(DAYOFWEEK(cal.dia), pl.diasPermitidos)
                THEN cal.dia
            END) * 100, 2
        ), '%'
    ) AS frequencia,
    
    -- Total de faltas
    COUNT(DISTINCT CASE 
        WHEN FIND_IN_SET(DAYOFWEEK(cal.dia), pl.diasPermitidos)
             AND ch.idCheckin IS NULL
        THEN cal.dia
    END) AS faltas

FROM cliente c
JOIN matricula m ON c.idCliente = m.fkCliente
JOIN plano pl ON pl.idPlano = m.fkPlano
LEFT JOIN calendario cal ON cal.dia BETWEEN m.dataInicio AND LEAST(m.dataFim, CURDATE())
LEFT JOIN checkin ch 
       ON ch.fkCliente = c.idCliente AND DATE(ch.dataHoraEntrada) = cal.dia
GROUP BY c.idCliente, c.nome;

DROP VIEW IF EXISTS controleAcesso;
CREATE OR REPLACE VIEW controleAcesso AS
SELECT
    ch.idCheckin AS id,
    cl.nome, 
    cl.idCliente,
    DATE_FORMAT(ch.dataHoraEntrada, '%H:%i') AS horarioChegada,
    DATE_FORMAT(ch.dataHoraSaida, '%H:%i') AS horarioSaida,
    p._status AS situacaoMatricula,
    pl.nome AS plano,
    fa.frequencia
FROM cliente cl
JOIN checkin ch ON ch.fkCliente = cl.idCliente
LEFT JOIN matricula m ON m.fkCliente = cl.idCliente
LEFT JOIN pagamento p ON p.fkMatricula = m.idMatricula
LEFT JOIN plano pl ON pl.idPlano = m.fkPlano
LEFT JOIN frequenciaAlunos fa ON fa.idCliente = cl.idCliente
WHERE DATE(ch.dataHoraEntrada) = CURDATE();

CREATE OR REPLACE VIEW totais AS
SELECT
    -- Total de pessoas atualmente dentro da academia (sem saída registrada hoje)
    (SELECT COUNT(idCheckin)
     FROM checkin
     WHERE DATE(dataHoraEntrada) = CURDATE()
       AND dataHoraEntrada IS NOT NULL
       AND dataHoraSaida IS NULL
    ) AS totalPresentes,

    -- Total de entradas feitas hoje
    (SELECT COUNT(idCheckin)
     FROM checkin
     WHERE DATE(dataHoraEntrada) = CURDATE()
    ) AS totalEntradas,

    -- Total de saídas feitas hoje
    (SELECT COUNT(idCheckin)
     FROM checkin
     WHERE DATE(dataHoraSaida) = CURDATE()
    ) AS totalSaidas,

    -- Total de pagamentos pendentes com vencimento até hoje
    (SELECT COUNT(*)
     FROM pagamento p
     INNER JOIN matricula m ON p.fkMatricula = m.idMatricula
     WHERE p._status = 'Pendente'
       AND DATE(p.dataVencimento) <= CURDATE()
    ) AS totalPendencias;

CREATE OR REPLACE VIEW dadosMatriculaCliente AS
SELECT 
    c.idCliente,
    c.nome,
    DATE_FORMAT(c.dataNascimento, '%d/%m/%Y') AS dataNascimento,
    c.sexo,
    c.cpf,
    c.rg,
    c.telefone,
    c.email,
    c.endereco,
    c.estadoCivil,
    c.face_embedding, 
    c.notaInterna,
    DATE_FORMAT(c.dataCadastro, '%d/%m/%Y %H:%i:%s') AS dataCadastro,

    p.nome AS nomePlano,
    p.descricao AS descricaoPlano,
    p.preco AS valorPlano, 
    DATE_FORMAT(m.dataInicio, '%d/%m/%Y') AS dataInicio,
    DATE_FORMAT(m.dataFim, '%d/%m/%Y') AS dataFim,
    m._status AS statusMatricula,

    pg._status AS statusPagamento,
    DATE_FORMAT(pg.dataPagamento, '%d/%m/%Y %H:%i') AS dataPagamento,
    pg.metodo AS metodoPagamento,
    pg.valor AS valorPago,

    DATE_FORMAT(DATE_ADD(m.dataInicio, INTERVAL 1 MONTH), '%d/%m/%Y') AS dataVencimento,

    CASE
        WHEN EXISTS (
            SELECT 1
            FROM pagamento pg2
            WHERE pg2.fkMatricula = m.idMatricula
              AND pg2._status = 'Pago'
              AND DATE_FORMAT(DATE_ADD(m.dataInicio, INTERVAL 0 MONTH), '%Y-%m') = DATE_FORMAT(CURDATE(), '%Y-%m')
        ) THEN 1
        ELSE 0
    END AS parcelaAtualPaga,

    fa.frequencia,
    fa.faltas, 

    -- Último check-in do dia atual, ou último check-in registrado se não houver hoje
    COALESCE(
        (SELECT DATE_FORMAT(ch.dataHoraEntrada, '%Y-%m-%d')
         FROM checkin AS ch
         WHERE ch.fkCliente = c.idCliente
           AND DATE(ch.dataHoraEntrada) = CURDATE()
         ORDER BY ch.dataHoraEntrada DESC
         LIMIT 1),
        (SELECT DATE_FORMAT(ch.dataHoraEntrada, '%Y-%m-%d')
         FROM checkin AS ch
         WHERE ch.fkCliente = c.idCliente
         ORDER BY ch.dataHoraEntrada DESC
         LIMIT 1)
    ) AS ultimoCheckin,

    -- Horário de chegada do dia atual (NULL se não houver)
    (SELECT DATE_FORMAT(ch.dataHoraEntrada, '%H:%i:%s')
     FROM checkin AS ch
     WHERE ch.fkCliente = c.idCliente
       AND DATE(ch.dataHoraEntrada) = CURDATE()
     ORDER BY ch.dataHoraEntrada DESC
     LIMIT 1) AS horarioChegada,

    -- Horário de saída do dia atual (NULL se não houver)
    (SELECT DATE_FORMAT(ch.dataHoraSaida, '%H:%i:%s')
     FROM checkin AS ch
     WHERE ch.fkCliente = c.idCliente
       AND DATE(ch.dataHoraEntrada) = CURDATE()
     ORDER BY ch.dataHoraEntrada DESC
     LIMIT 1) AS horarioSaida

FROM cliente c
LEFT JOIN (
    SELECT * 
    FROM matricula 
    WHERE _status = 'Ativa'
) m ON m.fkCliente = c.idCliente
LEFT JOIN plano p ON p.idPlano = m.fkPlano
LEFT JOIN (
    SELECT * 
    FROM pagamento pg1
    WHERE pg1.idPagamento = (
        SELECT MAX(pg2.idPagamento) 
        FROM pagamento pg2
        WHERE pg2.fkMatricula = pg1.fkMatricula
    )
) pg ON pg.fkMatricula = m.idMatricula
LEFT JOIN frequenciaAlunos fa ON fa.idCliente = c.idCliente;


-- ===============================
-- DADOS INICIAIS
-- ===============================

INSERT INTO plano (nome, descricao, preco, duracaoMeses, diasPermitidos) VALUES
('Básico','Acesso à academia durante horário comercial',100.00,1,'2,3,4,5,6'),
('Premium','Acesso 24h e aulas inclusas',200.00,1,'1,2,3,4,5,6,7'),
('VIP','Acesso total e personal trainer incluso',400.00,3,'2,4,6');


-- ===============================
-- EVENTOS AUTOMÁTICOS DE PAGAMENTO
-- ===============================

SET GLOBAL event_scheduler = ON;

DELIMITER $$

CREATE EVENT IF NOT EXISTS gerar_pagamentos_mensais
ON SCHEDULE EVERY 1 MONTH
STARTS '2025-11-01 00:00:00'
DO
BEGIN
    INSERT INTO pagamento (valor, metodo, _status, fkMatricula, dataVencimento)
    SELECT 
        p.preco,
        'Pix',
        'Pendente',
        m.idMatricula,
        DATE_ADD(LAST_DAY(CURDATE()), INTERVAL 5 DAY)
    FROM matricula m
    JOIN plano p ON p.idPlano = m.fkPlano
    WHERE 
        m._status = 'Ativa'
        AND CURDATE() BETWEEN m.dataInicio AND m.dataFim
        AND NOT EXISTS (
            SELECT 1 FROM pagamento pg
            WHERE pg.fkMatricula = m.idMatricula
              AND YEAR(pg.dataPagamento) = YEAR(CURDATE())
              AND MONTH(pg.dataPagamento) = MONTH(CURDATE())
        );
END$$

CREATE EVENT IF NOT EXISTS atualizar_pagamentos_atrasados
ON SCHEDULE EVERY 1 DAY
STARTS '2025-11-01 00:00:00'
DO
BEGIN
    UPDATE pagamento
    SET _status = 'Atrasado'
    WHERE _status = 'Pendente'
      AND dataVencimento < CURDATE();
END$$

DELIMITER ;

create or replace view estatisticasGestaoAlunos as select count(idMatricula) as matriculados, 
(select count(idMatricula) from matricula where month(dataInicio) = month(now())) as novosMes, 
(select count(m.idMatricula) from matricula as m 
inner join pagamento as p on p.fkMatricula = m.idMatricula 
where p._status = "Atrasado") as inadimplentes, 
(select _status from matricula where _status = "Inativa") as inativos,
(select round(avg(frequencia), 2) from frequenciaAlunos) as presencaMedia from matricula;


select * from dadosMatriculaCliente;