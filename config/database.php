<?php
class Database {
    private static $host = 'localhost';
    private static $db_name = 'demanahora_db';
    private static $username = 'root';
    private static $password = ''; 
    private static $conn;

    public static function getConnection() {
        if (self::$conn === null) {
            try {
                self::$conn = new PDO(
                    "mysql:host=" . self::$host . ";dbname=" . self::$db_name,
                    self::$username,
                    self::$password,
                    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::FETCH_ASSOC]
                );
            } catch (PDOException $e) {
                die("Error de connexió: " . $e->getMessage());
            }
        }
        return self::$conn;
    }
}