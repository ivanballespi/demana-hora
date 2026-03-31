<?php
 //Aquest fitxer gestiona totes les peticions de l'aplicació.

// inici de sessió i configuració d'errors 
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once '../config/database.php';
require_once '../controllers/ServiceController.php';
require_once '../controllers/AuthController.php';

// 3. Captura de l'acció de la URL (Ruteig simple)
// Per defecte, si no hi ha acció, anem al 'dashboard' o al 'login'
$action = isset($_GET['action']) ? $_GET['action'] : 'register';

// 4. Instància dels controladors
$serviceController = new ServiceController();
$authController = new AuthController();

// 5. Sistema de rutes (Router)
switch ($action) {
    
    // Rutes d'Autenticació
    case 'login':
        // Si ja està loguejat, el portem al dashboard
        if (isset($_SESSION['user_id'])) {
            header("Location: index.php?action=dashboard");
        } else {
            require_once '../views/login.php';
        }
        break;

    case 'register':
        $authController->mostrarRegistre();
        break;

    case 'do_register':
        $authController = new AuthController();
        $authController->processarRegistre();
        break;

    case 'auth':
        // aquí es on cridaríem al mètode de login del AuthController
        // aqui va la llògica de verificació de credencials
        break;

    case 'logout':
        session_destroy();
        header("Location: index.php?action=login");
        break;

    // Rutes de Negoci (Protegides)
    case 'dashboard':
        // Verificació simple de seguretat
        if (!isset($_SESSION['user_id'])) {
            header("Location: index.php?action=login");
            exit;
        }
        $serviceController->llistar();
        break;

    case 'crear_servei':
        if (isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'admin') {
            $serviceController->guardar();
        } else {
            echo "Accés denegat: Només els administradors poden crear serveis.";
        }
        break;

    case 'eliminar_servei':
        if (isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'admin') {
            $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
            // Aquí cridaríem a un mètode del controlador per esborrar
            header("Location: index.php?action=dashboard");
        }
        break;

    // ruta per defecte 404
    default:
        http_response_code(404);
        echo "<h1>404 - Pàgina no trobada</h1>";
        echo "<p>Ho sentim, la secció que busques a <strong>demana-hora</strong> no existeix.</p>";
        break;
}