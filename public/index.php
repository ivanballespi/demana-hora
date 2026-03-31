<?php
//Aquest fitxer gestiona totes les peticions de l'aplicació.

// inici de sessió i configuració d'errors 
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once '../config/database.php';
require_once '../controllers/ServiceController.php';
require_once '../controllers/AuthController.php';

$authController = new AuthController();
$serviceController = new ServiceController();
// captura de l'acció de la URL (Ruteig simple)
// per defecte, si no hi ha acció, anem al 'register'
$action = isset($_GET['action']) ? $_GET['action'] : 'register';

// instància dels controladors
$serviceController = new ServiceController();
$authController = new AuthController();

// sistema de rutes (Router)
switch ($action) {

    // rutes d'Autenticació
    case 'login':
        // si ja està loguejat, el portem al dashboard
        if (isset($_SESSION['user_id'])) {
            header("Location: index.php?action=dashboard");
        } else {
            require_once '../views/login.php';
        }
        break;
    
        case 'do_login':
    // Cridem al mètode del controlador que processa el formulari
    $authController->processarLogin();
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
        if (!isset($_SESSION['user_id'])) {
            header("Location: index.php?action=login");
            exit;
        }

        // el controlador demana les dades al Model
        //$cites = $appointmentModel->getByUser($_SESSION['user_id']);
        $cites = []; // Temporalment buit fins que tinguis la consulta SQL

        // es crida a la vista. El fitxer dashboard.php "hereta" la variable $cites
        require_once '../views/dashboard.php';
        break;

    case 'gestio_serveis':
        $serviceController->llistar();
        break;

    case 'crear_servei':
        $serviceController->crear();
        break;

    case 'eliminar_servei':
        $serviceController->esborrar();
        break;

    // ruta per defecte 404
    default:
        http_response_code(404);
        echo "<h1>404 - Pàgina no trobada</h1>";
        echo "<p>Ho sentim, la secció que busques a <strong>demana-hora</strong> no existeix.</p>";
        break;
}