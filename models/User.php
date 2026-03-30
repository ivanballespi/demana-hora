<?php
require_once '../models/User.php';

class AuthController {
    private $userModel;

    public function __construct() {
        $this->userModel = new User();
    }

    public function mostrarRegistre() {
        require_once '../views/register.php';
    }

    public function processarRegistre() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Neteja de dades bàsica
            $nom = htmlspecialchars(trim($_POST['nom']));
            $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
            $pass = $_POST['password'];

            // Validacions simples
            if (empty($nom) || empty($email) || empty($pass)) {
                header("Location: index.php?action=register&error=camps_buits");
                exit;
            }

            if ($this->userModel->emailExisteix($email)) {
                header("Location: index.php?action=register&error=email_duplicat");
                exit;
            }

            // Intentar registre
            if ($this->userModel->registrar($nom, $email, $pass)) {
                header("Location: index.php?action=login&success=registre_ok");
            } else {
                header("Location: index.php?action=register&error=error_sistema");
            }
        }
    }
}