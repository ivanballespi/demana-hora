<?php
class Service {
    private $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function getAll() {
        $stmt = $this->db->query("SELECT * FROM services ORDER BY nom ASC");
        return $stmt->fetchAll();
    }

    public function afegir($nom, $descripcio, $preu, $durada) {
        $sql = "INSERT INTO services (nom, descripcio, preu, durada) VALUES (?, ?, ?, ?)";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([$nom, $descripcio, $preu, $durada]);
    }

    
    public function eliminar($id) {
        $sql = "DELETE FROM services WHERE id = :id";
        $stmt = $this->db->prepare("DELETE FROM services WHERE id = ?");
        return $stmt->execute([$id]);
    }
}