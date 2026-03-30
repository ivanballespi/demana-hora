<?php
require_once '../models/Service.php';

class ServiceController {
    private $serviceModel;

    public function __construct() {
        $this->serviceModel = new Service();
    }

    public function llistar() {
        $serveis = $this->serviceModel->getAll();
        require_once '../views/dashboard.php';
    }

    public function guardar() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_SESSION['user_role'] === 'admin') {
            $nom = htmlspecialchars($_POST['nom']);
            $desc = htmlspecialchars($_POST['descripcio']);
            $preu = (float)$_POST['preu'];

            if ($this->serviceModel->create($nom, $desc, $preu)) {
                header("Location: index.php?action=dashboard&success=1");
            }
        }
    }
}