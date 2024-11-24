<?php
$servername = "localhost";
$username = "root";
$password = ""; // Default password for XAMPP
$dbname = "password_manager";

// Connect to the database
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Handle requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'];

    if ($action === 'save') {
        $url = $_POST['url'];
        $password = $_POST['password'];
        $stmt = $conn->prepare("INSERT INTO passwords (url, password) VALUES (?, ?)");
        $stmt->bind_param("ss", $url, $password);
        $stmt->execute();
        $stmt->close();
        echo "Password saved successfully.";
    } elseif ($action === 'retrieve') {
        $url = $_POST['url'];
        $stmt = $conn->prepare("SELECT password FROM passwords WHERE url = ?");
        $stmt->bind_param("s", $url);
        $stmt->execute();
        $stmt->bind_result($retrievedPassword);
        if ($stmt->fetch()) {
            echo $retrievedPassword;
        } else {
            echo "Password not found.";
        }
        $stmt->close();
    } elseif ($action === 'delete') {
        $id = $_POST['id'];
        $stmt = $conn->prepare("DELETE FROM passwords WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $stmt->close();
        echo "Password deleted successfully.";
    }
}

$conn->close();
?>
