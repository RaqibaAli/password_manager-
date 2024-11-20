// Utility: Check for a strong password
function isStrongPassword(password) {
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
}

// Initialize keychain with master password
async function initializeKeychain() {
    const password = document.getElementById("master-password").value;
    const errorMessage = document.getElementById("error-message");

    if (!password) {
        errorMessage.textContent = "Please enter a master password.";
        errorMessage.style.display = "block";
        return;
    }

    if (!isStrongPassword(password)) {
        errorMessage.textContent =
            "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character.";
        errorMessage.style.display = "block";
        return;
    }

    const response = await fetch("/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
    });

    const result = await response.json();
    if (result.message === "Keychain initialized") {
        document.getElementById("init-section").style.display = "none";
        document.getElementById("main-section").style.display = "block";
        fetchPasswords();
    }
}

// Save a password
async function savePassword() {
    const url = document.getElementById("url").value;
    const password = document.getElementById("password").value;

    const response = await fetch("/set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, password }),
    });

    const result = await response.json();
    alert(result.message);
    fetchPasswords(); // Refresh the list of saved passwords
}

// Retrieve a password by URL
async function getPassword() {
    const url = document.getElementById("lookup-url").value;

    const response = await fetch("/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
    });

    const result = await response.json();
    document.getElementById("retrieved-password").textContent = result.password
        ? `Password: ${result.password}`
        : "Password not found";
}

// Fetch and display saved passwords
async function fetchPasswords() {
    const response = await fetch("/list", { method: "GET" });
    const result = await response.json();

    const passwordList = document.getElementById("password-list");
    passwordList.innerHTML = "";

    result.forEach((item, index) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <strong>${item.url}</strong>: ${item.password} 
            <button onclick="editPassword(${index})">Edit</button>
            <button onclick="deletePassword(${index})">Delete</button>
        `;
        passwordList.appendChild(listItem);
    });
}

// Edit a password
async function editPassword(index) {
    const newPassword = prompt("Enter new password:");
    if (!newPassword) return;

    const response = await fetch(`/edit/${index}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
    });

    const result = await response.json();
    alert(result.message);
    fetchPasswords();
}

// Delete a password
async function deletePassword(index) {
    const response = await fetch(`/delete/${index}`, {
        method: "DELETE",
    });

    const result = await response.json();
    alert(result.message);
    fetchPasswords();
}
