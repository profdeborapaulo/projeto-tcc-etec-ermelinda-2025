create database buscafarma;
use buscafarma;

create table Pharmacy (
id int auto_increment primary key,
CNPJ varchar(20) not null unique,
Name varchar(100) not null,
CEP varchar(20) not null,
Numero int,
isPopularPharmacy boolean DEFAULT FALSE,
email varchar(100) unique,
phone varchar(20),
password varchar(100),
createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
passwordResetToken VARCHAR(255)
);

CREATE TABLE User (
id INT AUTO_INCREMENT PRIMARY KEY,
Name VARCHAR(100) NOT NULL,
Email VARCHAR(100) UNIQUE,
ProfileImage VARCHAR(255),
Password VARCHAR(100) NOT NULL,
Phone VARCHAR(20),
createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
passwordResetToken VARCHAR(255)
);

CREATE TABLE Stock (
id INT AUTO_INCREMENT PRIMARY KEY,
idPharmacy INT NOT NULL,
idMedication INT NOT NULL,
Quantity INT DEFAULT 0 NOT NULL,
FOREIGN KEY (idPharmacy) REFERENCES Pharmacy(id) ON DELETE CASCADE,
UNIQUE (idPharmacy, idMedication) 
);

CREATE TABLE Scheduling (
id INT AUTO_INCREMENT PRIMARY KEY,
idUser INT NOT NULL,
idPharmacy INT NOT NULL,
idMedication INT NOT NULL,
date DATETIME NOT NULL,
status ENUM('Pendente', 'Confirmado', 'Cancelado', 'Finalizado') DEFAULT 'Pendente',
FOREIGN KEY (idUser) REFERENCES User(id),
FOREIGN KEY (idPharmacy) REFERENCES Pharmacy(id)
);

CREATE TABLE Notification (
id INT AUTO_INCREMENT PRIMARY KEY,
idRecipient INT NOT NULL,
message TEXT NOT NULL,
date DATETIME DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (idRecipient) REFERENCES User(id)
);
