-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Tempo de geração: 13/12/2025 às 20:29
-- Versão do servidor: 11.8.3-MariaDB-log
-- Versão do PHP: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `u879079983_sageadata`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `esportes`
--

CREATE TABLE `esportes` (
  `id` int(11) NOT NULL,
  `nome` varchar(50) NOT NULL,
  `vagas_totais` int(11) DEFAULT 30,
  `vagas_ocupadas` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `esportes`
--

INSERT INTO `esportes` (`id`, `nome`, `vagas_totais`, `vagas_ocupadas`) VALUES
(1, 'Futebol', 20, 1),
(2, 'Vôlei', 50, 4),
(3, 'Natação', 15, 3),
(4, 'Musculação', 50, 1),
(5, 'hidroginástica', 5, 0),
(6, 'jiu-jitsu', 10, 0);

-- --------------------------------------------------------

--
-- Estrutura para tabela `frequencia`
--

CREATE TABLE `frequencia` (
  `id` int(11) NOT NULL,
  `aluno_id` int(11) NOT NULL,
  `data_aula` date NOT NULL,
  `presenca` enum('presente','falta','justificada') NOT NULL DEFAULT 'presente',
  `observacao` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `frequencia`
--

INSERT INTO `frequencia` (`id`, `aluno_id`, `data_aula`, `presenca`, `observacao`) VALUES
(8, 10, '2025-11-25', 'presente', NULL),
(9, 7, '2025-11-25', 'presente', NULL),
(10, 14, '2025-11-26', 'presente', NULL),
(11, 7, '2025-12-03', 'presente', NULL),
(12, 7, '2025-12-04', 'presente', NULL);

-- --------------------------------------------------------

--
-- Estrutura para tabela `inscricoes`
--

CREATE TABLE `inscricoes` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `nome_completo` varchar(255) NOT NULL,
  `data_nascimento` date NOT NULL,
  `cpf` varchar(14) NOT NULL,
  `rg` varchar(20) DEFAULT NULL,
  `telefone` varchar(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `endereco` varchar(255) NOT NULL,
  `cidade` varchar(100) NOT NULL,
  `estado` varchar(2) NOT NULL,
  `modalidade` varchar(50) NOT NULL,
  `horario` varchar(50) NOT NULL,
  `contato_emergencia` varchar(255) NOT NULL,
  `telefone_emergencia` varchar(20) NOT NULL,
  `parentesco` varchar(50) NOT NULL,
  `termos_aceitos` tinyint(1) DEFAULT 0,
  `foto_caminho` varchar(255) DEFAULT NULL,
  `status_inscricao` enum('pendente','ativo','rejeitado') DEFAULT 'pendente',
  `atestado_medico` varchar(255) DEFAULT NULL,
  `prontuario_caminho` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `inscricoes`
--

INSERT INTO `inscricoes` (`id`, `usuario_id`, `nome_completo`, `data_nascimento`, `cpf`, `rg`, `telefone`, `email`, `endereco`, `cidade`, `estado`, `modalidade`, `horario`, `contato_emergencia`, `telefone_emergencia`, `parentesco`, `termos_aceitos`, `foto_caminho`, `status_inscricao`, `atestado_medico`, `prontuario_caminho`) VALUES
(1, 1, 'Ricardo', '2000-01-01', '16216216210', '606616656', '21965994303', 'admin@gmail.com', 'Rua Tananan Numero 10', 'Santana de Parnaiba', 'SP', 'volei', 'tarde', 'Minha mae', '118384883874', 'Mae', 1, 'assets/uploads/1_1764014500.jpg', 'ativo', NULL, NULL),
(2, 2, 'Matheus Teles Batista', '2007-06-07', '55116216845', '569221928', '11946340829', 'matheustellesbatista@gmail.com', 'rua professor Edgar de Moraes 251', 'Santana de Parnaíba ', 'SP', 'natacao', 'manha', 'César Batista ', '11946340829', 'Pai', 1, 'assets/uploads/2_1764015299.jpeg', 'ativo', NULL, NULL),
(3, 3, 'Paulo Henrick de Souza Paixão', '2007-10-22', '44851492855', '559114448', '11933358701', 'paulohenrickdesouzapaixao@gmail.com', 'Rua domingos fernandes, 1033', 'Santana de Parnaíba', 'SP', 'basquete', 'noite', 'Meire', '11987366404', 'Mãe', 1, 'assets/uploads/3_1764066950.jpg', 'ativo', NULL, NULL),
(4, 4, 'Matheus rocha', '2025-11-11', '12344556667778', '151728', '216161', 'matheus@rocha', 'Hajaja', 'Najaja', 'SP', 'volei', 'manha', 'Jana', '7994', 'Hahajw', 1, NULL, 'pendente', NULL, NULL),
(5, 5, 'Renan Rilley da Silva Arruda', '2007-12-21', '54560953864', '53.657.792-4', '11969294774', 'renanrilley0@gmail.com', 'Rua Suécia, 492', 'Santana de Parnaíba', 'SP', 'volei', 'tarde', 'MOISES ALVES DE ARRUDA', '11971516805', 'Pai', 1, 'assets/uploads/5_1764016454.jpeg', 'ativo', NULL, NULL),
(6, 7, 'Dyego', '2000-01-01', '16216216210', '03434332323', '432435235234', 'teste2@gmail.com', 'kdsfihsifhdifhia', 'grsgrgre', 'SP', 'Vôlei', 'Tarde', 'aggrgegrg', 'grgrwgwg', 'reagrgerg', 1, NULL, 'ativo', 'assets/docs/atestado_7_1764036679.pdf', NULL),
(7, 10, 'Cesar Batista', '1981-08-09', '288.878.928-6', '56.129.678-5', '(11) 94634-0829', 'cesarbatistakm@gmail.com', 'Rua Professor Edgar de Moraes, 251 - Vila Nova', 'Santana de Parnaíba', 'SP', 'Natação', 'Manhã', 'Matheus Teles Batista', '(11) 94634-0822', 'Filho', 1, 'assets/uploads/10_1764804901.jpeg', 'ativo', 'assets/docs/atestado_10_1764071273.pdf', NULL),
(8, 14, 'Carlos Eduardo', '2025-11-25', '400.289.224-79', '59.263.838-3', '(11) 94343-4664', 'carlos@gmail.com', 'Rua Domingos Fernandes, 871 - Cristal Park', 'Santana de Parnaíba', 'SP', 'Musculação', 'Noite', 'Roger', '(11) 95764-8075', 'Tio', 1, 'assets/uploads/14_1764078232.jpeg', 'pendente', 'assets/docs/atestado_14_1764078119.pdf', 'assets/docs/prontuario_8_1764079835.pdf'),
(9, 16, 'Giovanna Sales', '2025-11-25', '318.697.848-39', '55.923.729-8', '(11) 96742-6123', 'gi@gmail.com', 'Rua Domingos Fernandes, 171 - Cristal Park', 'Santana de Parnaíba', 'SP', 'Natação', 'Tarde', 'Cicera', '(11) 94002-8922', 'Mãe', 1, NULL, 'ativo', 'assets/docs/atestado_16_1764081540.pdf', NULL),
(10, 13, 'Bruno', '2000-09-07', '657.658.565-68', '77.678.567-4', '(11) 96742-6123', 'bruno2@gmail.com', 'Rua Suécia, 492 - Jardim São Luís', 'Santana de Parnaíba', 'SP', 'Musculação', 'Manhã', 'Maria Desaparecida', '(11) 98497-8738', 'Mamãe', 1, 'assets/uploads/13_1764082535.jpeg', 'ativo', 'assets/docs/atestado_13_1764082517.pdf', NULL),
(11, 17, 'renan', '2007-10-22', '000.000.000-00', '00.000.000-0', '(11) 93573-6473', 'teste@gmail', 'Rua Domingos Fernandes, 1033 - Cristal Park', 'Santana de Parnaíba', 'SP', 'Vôlei', 'Tarde', 'paulo', '(00) 00000-0000', 'pai', 1, 'assets/uploads/17_1764084482.jpeg', 'pendente', 'assets/docs/atestado_17_1764084445.pdf', NULL),
(12, 18, 'Gabriel Antonio', '2004-02-18', '502.725.028-20', '58.596.548-1', '(11) 99156-1686', 'gabrielzinho@gmail.com', 'Rua Marangatu, 348 - Colinas de Parnaíba I', 'Santana de Parnaíba', 'SP', 'Vôlei', 'Tarde', 'Gabriela', '(11) 99156-6186', 'Mãe', 1, 'assets/uploads/18_1764096355.jpeg', 'pendente', 'assets/docs/atestado_18_1764096283.pdf', NULL),
(13, 20, 'Kauanny Teles ', '2004-03-18', '728.283.838-38', '92.929.393-9', '(11) 96017-1590', 'kauannyteles7@gmail.com', 'Rua Professor Edgar de Moraes, 251 - Vila Nova', 'Santana de Parnaíba', 'SP', 'Vôlei', 'Manhã', 'Kauanny Teles Batista', '(11) 96017-1590', 'amiga', 1, 'assets/uploads/20_1764109764.jpg', 'ativo', 'assets/docs/atestado_20_1764109741.pdf', NULL),
(14, 21, 'João Samuel Malara de Andrade', '2025-11-26', '413.060.228-43', '67.777.777-7', '(11) 98913-1726', 'joaosmalara@gmail.com', 'Rua Jacarandá, 177 - Tamboré', 'Santana de Parnaíba', 'SP', 'Futebol', 'Manhã', 'João Samuel Malara', '(11) 11111-1111', 'Pai', 1, NULL, 'ativo', 'assets/docs/atestado_21_1764160246.pdf', NULL),
(15, 22, 'Renan Rilley', '2007-12-21', '545.609.538-64', '56.129.678-5', '(11) 93573-6473', 'r3nanrilley@gmail.com', 'Rua Suécia, 492 - Jardim São Luís', 'Santana de Parnaíba', 'SP', 'Vôlei', 'Manhã', 'MOISES ALVES DE ARRUDA', '(11) 93573-6473', 'pai', 1, 'assets/uploads/22_1764598508.jpg', 'pendente', 'assets/docs/atestado_22_1764598469.pdf', NULL);

-- --------------------------------------------------------

--
-- Estrutura para tabela `questionario_saude`
--

CREATE TABLE `questionario_saude` (
  `id` int(11) NOT NULL,
  `inscricao_id` int(11) NOT NULL,
  `q1_coracao` enum('sim','nao') NOT NULL,
  `q2_dor_peito` enum('sim','nao') NOT NULL,
  `q3_dor_ultimo_mes` enum('sim','nao') NOT NULL,
  `q4_tontura` enum('sim','nao') NOT NULL,
  `q5_osseo` enum('sim','nao') NOT NULL,
  `q6_medicamento` enum('sim','nao') NOT NULL,
  `q7_outra_razao` enum('sim','nao') NOT NULL,
  `data_resposta` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `questionario_saude`
--

INSERT INTO `questionario_saude` (`id`, `inscricao_id`, `q1_coracao`, `q2_dor_peito`, `q3_dor_ultimo_mes`, `q4_tontura`, `q5_osseo`, `q6_medicamento`, `q7_outra_razao`, `data_resposta`) VALUES
(1, 1, 'nao', 'sim', 'nao', 'nao', 'sim', 'sim', 'sim', '2025-11-24 19:43:27'),
(2, 2, 'nao', 'nao', 'nao', 'nao', 'nao', 'nao', 'nao', '2025-11-24 20:14:42'),
(3, 3, 'nao', 'nao', 'nao', 'nao', 'nao', 'nao', 'sim', '2025-11-24 20:17:16'),
(4, 4, 'nao', 'nao', 'nao', 'nao', 'nao', 'nao', 'nao', '2025-11-24 20:23:40'),
(5, 5, 'nao', 'nao', 'nao', 'nao', 'nao', 'nao', 'nao', '2025-11-24 20:33:43'),
(6, 6, 'nao', 'nao', 'sim', 'sim', 'sim', 'nao', 'sim', '2025-11-25 02:11:37'),
(7, 7, 'nao', 'nao', 'nao', 'nao', 'nao', 'nao', 'nao', '2025-11-25 11:48:13'),
(8, 8, 'nao', 'nao', 'nao', 'nao', 'nao', 'nao', 'nao', '2025-11-25 13:42:09'),
(9, 9, 'nao', 'nao', 'nao', 'nao', 'nao', 'nao', 'nao', '2025-11-25 14:39:13'),
(10, 10, 'sim', 'nao', 'sim', 'sim', 'sim', 'nao', 'nao', '2025-11-25 14:55:29'),
(11, 11, 'nao', 'nao', 'nao', 'nao', 'nao', 'nao', 'nao', '2025-11-25 15:27:46'),
(12, 12, 'nao', 'nao', 'nao', 'nao', 'nao', 'nao', 'nao', '2025-11-25 18:45:17'),
(13, 13, 'nao', 'nao', 'nao', 'nao', 'nao', 'nao', 'nao', '2025-11-25 22:29:14'),
(14, 14, 'nao', 'nao', 'nao', 'nao', 'nao', 'nao', 'nao', '2025-11-26 12:31:00'),
(15, 15, 'nao', 'nao', 'nao', 'nao', 'nao', 'nao', 'nao', '2025-12-01 14:14:49');

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `criado_em` timestamp NULL DEFAULT current_timestamp(),
  `is_admin` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `usuarios`
--

INSERT INTO `usuarios` (`id`, `nome`, `email`, `senha`, `criado_em`, `is_admin`) VALUES
(1, 'Cácio', 'admin@gmail.com', '1234', '2025-11-24 19:35:43', 0),
(2, 'Matheus Teles Batista', 'matheustellesbatista@gmail.com', 'Telles007&', '2025-11-24 20:13:08', 0),
(3, 'Paulo Henrick de Souza Paixão', 'paulohenrickdesouzapaixao@gmail.com', 'Ph221007', '2025-11-24 20:14:12', 0),
(4, 'Matheus rocha', 'matheus@rocha', '1234', '2025-11-24 20:22:28', 0),
(5, 'Renan Rilley da Silva Arruda', 'renanrilley0@gmail.com', 'Ren@n211207', '2025-11-24 20:31:12', 0),
(6, 'Administrador', 'admin@sage.com', '1234', '2025-11-25 01:32:05', 1),
(7, 'Ricardo', 'teste2@gmail.com', '1234', '2025-11-25 02:09:12', 0),
(9, 'Mario Jesus', 'mario@gmail', 'mario123', '2025-11-25 10:33:56', 0),
(10, 'Cesar Batista', 'cesarbatistakm@gmail.com', 'cesar1234', '2025-11-25 11:24:04', 0),
(11, 'Sueli da silva Arruda', 'ssueliarruda@gmail', '170419Ju', '2025-11-25 11:28:03', 0),
(12, 'Sueli da silva Arruda', 'ssueli@gmail.com', '170419', '2025-11-25 11:29:00', 0),
(13, 'Bruno', 'bruno2@gmail.com', '1234', '2025-11-25 11:32:29', 0),
(14, 'Carlos Eduardo', 'carlos@gmail.com', 'carlos123', '2025-11-25 13:33:48', 0),
(15, 'Fabricio Bruno', 'fabricio@gmail.com', '1234', '2025-11-25 13:49:21', 0),
(16, 'Giovanna Sales', 'gi@gmail.com', '1234', '2025-11-25 14:36:27', 0),
(17, 'renan', 'teste@gmail', '1234', '2025-11-25 15:25:33', 0),
(18, 'Gabriel Antonio', 'gabrielzinho@gmail.com', '1234', '2025-11-25 18:42:24', 0),
(19, 'Valeria Teles Batista', 'valeriatelles.enf@gmail.com', '1234', '2025-11-25 22:18:45', 0),
(20, 'Kauanny Teles ', 'kauannyteles7@gmail.com', '12345', '2025-11-25 22:27:58', 0),
(21, 'João Samuel Malara de Andrade', 'joaosmalara@gmail.com', '1234', '2025-11-26 12:13:27', 0),
(22, 'Renan Rilley', 'r3nanrilley@gmail.com', '1234', '2025-12-01 14:09:34', 0);

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `esportes`
--
ALTER TABLE `esportes`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `frequencia`
--
ALTER TABLE `frequencia`
  ADD PRIMARY KEY (`id`),
  ADD KEY `aluno_id` (`aluno_id`);

--
-- Índices de tabela `inscricoes`
--
ALTER TABLE `inscricoes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Índices de tabela `questionario_saude`
--
ALTER TABLE `questionario_saude`
  ADD PRIMARY KEY (`id`),
  ADD KEY `inscricao_id` (`inscricao_id`);

--
-- Índices de tabela `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `esportes`
--
ALTER TABLE `esportes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de tabela `frequencia`
--
ALTER TABLE `frequencia`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de tabela `inscricoes`
--
ALTER TABLE `inscricoes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de tabela `questionario_saude`
--
ALTER TABLE `questionario_saude`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de tabela `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `frequencia`
--
ALTER TABLE `frequencia`
  ADD CONSTRAINT `frequencia_ibfk_1` FOREIGN KEY (`aluno_id`) REFERENCES `inscricoes` (`id`);

--
-- Restrições para tabelas `inscricoes`
--
ALTER TABLE `inscricoes`
  ADD CONSTRAINT `inscricoes_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

--
-- Restrições para tabelas `questionario_saude`
--
ALTER TABLE `questionario_saude`
  ADD CONSTRAINT `questionario_saude_ibfk_1` FOREIGN KEY (`inscricao_id`) REFERENCES `inscricoes` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
