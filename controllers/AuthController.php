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

    /**
     * Gestiona la lògica d'inici de sessió
     */
    public function processarLogin() {
        // 1. Només acceptem peticions POST
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            
            // 2. Netegem les dades d'entrada per seguretat
            $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
            $password = $_POST['password'];

            // 3. Validem que els camps no estiguin buits
            if (empty($email) || empty($password)) {
                header("Location: index.php?action=login&error=camps_buits");
                exit;
            }

            // 4. Demanem al Model que busqui l'usuari i verifiqui la contrasenya
            // Nota: El mètode validarLogin() ha d'existir al fitxer models/User.php
            $usuari = $this->userModel->validarLogin($email, $password);

            if ($usuari) {
                // 5. LOGIN CORRECTE: Creem la sessió de l'usuari
                $_SESSION['user_id'] = $usuari['id'];
                $_SESSION['user_nom'] = $usuari['nom'];
                $_SESSION['user_rol'] = $usuari['rol'];

                // 6. Redirigim al Dashboard (Inici)
                header("Location: index.php?action=dashboard");
                exit;
            } else {
                // 7. LOGIN INCORRECTE: Tornem al formulari amb error
                header("Location: index.php?action=login&error=login_incorrecte");
                exit;
            }
        }
    }
}