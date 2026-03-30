<?php
class Service {
    private $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function getAll() {
        $stmt = $this->db->query("SELECT * FROM services WHERE actiu = 1");
        return $stmt->fetchAll();
    }

    public function create($nom, $descripcio, $preu) {
        $sql = "INSERT INTO services (nom, descripcio, preu) VALUES (:nom, :descripcio, :preu)";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            ':nom' => $nom,
            ':descripcio' => $descripcio,
            ':preu' => $preu
        ]);
    }

    public function delete($id) {
        $stmt = $this->db->prepare("UPDATE services SET actiu = 0 WHERE id = ?");
        return $stmt->execute([$id]);
    }
}