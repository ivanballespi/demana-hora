CREATE DATABASE IF NOT EXISTS demanahora_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE demanahora_db;

-- Taula d'Usuaris
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'client') DEFAULT 'client',
    creat_el TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Taula de Serveis
CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    descripcio TEXT,
    preu DECIMAL(10, 2) NOT NULL,
    actiu BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB;

-- Taula de Cites
CREATE TABLE appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    service_id INT NOT NULL,
    data_cita DATETIME NOT NULL,
    estat ENUM('pendent', 'confirmat', 'cancel·lat') DEFAULT 'pendent',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Dades d'exemple (Contrasenya: admin123 i client123)
INSERT INTO users (nom, email, password, rol) VALUES 
('Admin Principal', 'admin@service.cat', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('Joan Client', 'joan@correu.cat', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'client');

INSERT INTO services (nom, descripcio, preu) VALUES 
('Consultoria Tècnica', 'Sessió d''una hora d''assessorament especialitzat.', 75.00),
('Manteniment Web', 'Revisió mensual de seguretat i actualitzacions.', 120.00);