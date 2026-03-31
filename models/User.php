<?php
// FITXER: models/User.php

class User {
    private $db;

    public function __construct() {
        // Obtenim la connexió des de la classe Database
        $this->db = Database::getConnection();
    }

    // Funció per comprovar si l'email ja està registrat
    public function emailExisteix($email) {
        $stmt = $this->db->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        return $stmt->fetch() ? true : false;
    }

    // Funció per inserir el nou usuari
    public function registrar($nom, $email, $password) {
        $hash = password_hash($password, PASSWORD_BCRYPT);
        $sql = "INSERT INTO users (nom, email, password, rol) VALUES (:nom, :email, :password, 'client')";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            ':nom' => $nom,
            ':email' => $email,
            ':password' => $hash
        ]);
    }

    // Funció per validar el login (la necessitaràs després)
    public function validarLogin($email, $password) {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            return $user;
        }
        return false;
    }
}