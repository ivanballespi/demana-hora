<?php
require_once '../models/Service.php';

class ServiceController {
    private $serviceModel;

    public function __construct() {
        $this->serviceModel = new Service();
    }

    public function llistar() {
        $serveis = $this->serviceModel->getAll();
        require_once '../views/gestio_serveis.php';
    }

    public function guardar() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_SESSION['user_role'] === 'admin') {
            $nom = htmlspecialchars($_POST['nom']);
            $desc = htmlspecialchars($_POST['descripcio']);
            $preu = (float)$_POST['preu'];
            $durada = (int)$_POST['durada'];

            if ($this->serviceModel->afegir($nom, $desc, $preu, $durada)) {
                header("Location: index.php?action=dashboard&success=1");
            }
        }
    }

    public function crear() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Recollim dades
            $nom = $_POST['nom'] ?? '';
            $desc = $_POST['descripcio'] ?? '';
            $preu = $_POST['preu'] ?? 0;
            $durada = $_POST['durada'] ?? 0;

            // Validació bàsica
            if (!empty($nom) && $preu > 0) {
                $this->serviceModel->afegir($nom, $desc, $preu, $durada);
                header("Location: index.php?action=gestio_serveis&success=creat");
            } else {
                header("Location: index.php?action=gestio_serveis&error=dades_incompletes");
            }
            exit;
        }
    }

    // AQUEST ÉS EL MÈTODE PER "ESBORRAR"
    public function esborrar() {
        if (isset($_GET['id']) && $_SESSION['user_rol'] === 'admin') {
            $id = $_GET['id'];
            $this->serviceModel->eliminar($id);
            header("Location: index.php?action=gestio_serveis&success=eliminat");
            exit;
        }
    }
}