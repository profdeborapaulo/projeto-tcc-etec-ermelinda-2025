CREATE DATABASE buscafarma;
USE buscafarma;

CREATE TABLE pharmacys (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  CNPJ VARCHAR(20) NOT NULL UNIQUE,
  pharmacyName VARCHAR(100) NOT NULL,
  address VARCHAR(250) NOT NULL,
  CEP VARCHAR(20) NOT NULL,
  addressNumber INT NOT NULL,
  location POINT NOT NULL,
  isPharmacy BOOLEAN DEFAULT FALSE,
  email VARCHAR(100) UNIQUE,
  phone VARCHAR(20),
  profileImage VARCHAR(255),
  pharmacyPassword VARCHAR(100),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  passwordResetToken VARCHAR(255),
  SPATIAL INDEX(location)
);

CREATE TABLE users (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  username VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE,
  profileImage VARCHAR(255),
  userPassword VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  passwordResetToken VARCHAR(255)
);

CREATE TABLE stock (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  idPharmacy CHAR(36) NOT NULL,
  idMedication CHAR(36) NOT NULL,
  
  medicationName VARCHAR(255) NOT NULL,
  presentation VARCHAR(255) NOT NULL,
  pharmaceuticalForms VARCHAR(255) NOT NULL,
  badge VARCHAR(50) NOT NULL,
  regulatoryCategory VARCHAR(50) NOT NULL,
  activeIngredient VARCHAR(1000) NOT NULL,
  consumeWay VARCHAR(255) NOT NULL,
  enterpriseName VARCHAR(255) NOT NULL,
  enterpriseCNPJ VARCHAR(18) NOT NULL,
  registrationSituation INT NOT NULL,
  
  quantity INT DEFAULT 0 NOT NULL,
  reservedQuantity INT DEFAULT 0 NOT NULL,
  totalQuantity INT DEFAULT 0 NOT NULL,
  price FLOAT DEFAULT 0,
  isPopularPharmacy BOOLEAN DEFAULT FALSE,
  
  FOREIGN KEY (idPharmacy) REFERENCES pharmacys(id) ON DELETE CASCADE,
  UNIQUE (idPharmacy, idMedication)
);

CREATE TABLE schedulings (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  idUser CHAR(36) NOT NULL,
  idPharmacy CHAR(36) NOT NULL,
  medications JSON NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,  
  approvedAt DATETIME NULL,                               
  expiresAt DATETIME NULL,                            
  status ENUM('pendente', 'aprovado', 'recusado', 'completado', 'expirado', 'cancelado') DEFAULT 'pendente', 
  pin VARCHAR(6) NOT NULL,                  
  FOREIGN KEY (idUser) REFERENCES users(id),
  FOREIGN KEY (idPharmacy) REFERENCES pharmacys(id)
);

CREATE TABLE notifications (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  recipientType ENUM('user', 'pharmacy') NOT NULL,
  recipientId CHAR(36) NOT NULL,
  senderId CHAR(36),
  message TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  isRead BOOLEAN NOT NULL DEFAULT FALSE
);


CREATE TABLE refreshTokens (
  id CHAR(36) PRIMARY KEY,
  userId CHAR(36),
  pharmacyId CHAR(36),
  accountType ENUM('user', 'pharmacy') DEFAULT 'user',
  token CHAR(36) NOT NULL,
  expiresAt DATETIME NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  userAgent VARCHAR(255),
  ip VARCHAR(45),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE resetTokens (
  id CHAR(36) PRIMARY KEY,
  userId CHAR(36),
  pharmacyId CHAR(36),
  accountType ENUM('user', 'pharmacy') DEFAULT 'user',
  token CHAR(36) NOT NULL,
  expiresAt DATETIME NOT NULL,
  userAgent VARCHAR(255),
  ip VARCHAR(45),
  type VARCHAR(45),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
