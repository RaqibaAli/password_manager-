<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // Allow requests from your frontend
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");  // Specify allowed HTTP methods
header("Access-Control-Allow-Headers: Content-Type");        // Specify allowed headers

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Handle preflight request
    http_response_code(200);
    exit;
}

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
        // Encrypting password
        $encryptedPassword = openssl_encrypt($password, 'aes-128-cbc', 'encryptionkey', 0, '1234567890123456');

        $stmt = $conn->prepare("INSERT INTO passwords (url, password) VALUES (?, ?)");
        $stmt->bind_param("ss", $url, $encryptedPassword);
        $stmt->execute();
        $stmt->close();
        echo "Password saved successfully.";

    } elseif ($action === 'retrieve') {
        $url = $_POST['url'];
        $stmt = $conn->prepare("SELECT password FROM passwords WHERE url = ?");
        $stmt->bind_param("s", $url);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($row = $result->fetch_assoc()) {
            // Decrypt password
            $decryptedPassword = openssl_decrypt($row['password'], 'aes-128-cbc', 'encryptionkey', 0, '1234567890123456');
            echo $decryptedPassword;
        } else {
            echo "Password not found.";
        }
        $stmt->close();
    }

    elseif ($action === 'delete') {
        $id = $_POST['id'];
        $stmt = $conn->prepare("DELETE FROM passwords WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $stmt->close();
        echo "Password deleted successfully.";
    }
    elseif ($action === 'edit') {
        $id = $_POST['id'];
        $password = $_POST['password'];
    
        // Encrypt the new password
        $encryptedPassword = openssl_encrypt($password, 'aes-128-cbc', 'encryptionkey', 0, '1234567890123456');
    
        // Update the password in the database
        $stmt = $conn->prepare("UPDATE passwords SET password = ? WHERE id = ?");
        $stmt->bind_param("si", $encryptedPassword, $id);
        $stmt->execute();
        $stmt->close();
    
        echo "Password updated successfully.";
    }
    

    if ($action === 'list') {
        $result = $conn->query("SELECT id, url, password FROM passwords");
        $passwords = [];
        while ($row = $result->fetch_assoc()) {
            // Decrypt passwords before sending
            $row['password'] = openssl_decrypt($row['password'], 'aes-128-cbc', 'encryptionkey', 0, '1234567890123456');
            $passwords[] = $row;
        }
        echo json_encode($passwords);
    }

}

$conn->close();
?>