const passwords = [];

function isStrongPassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&#])[A-Za-z\d@$!%?&#]{8,}$/;
    return regex.test(password);
}

function initializeKeychain() {
    const masterPassword = document.getElementById('master-password').value;
    const errorElement = document.getElementById('password-error');

    if (!isStrongPassword(masterPassword)) {
        errorElement.style.display = 'block';
        return;
    }
    errorElement.style.display = 'none';
    document.getElementById('init-section').style.display = 'none';
    document.getElementById('main-section').style.display = 'block';
}

// Function to save password
function savePassword() {
    const url = document.getElementById('url').value;
    const password = document.getElementById('password').value;

    if (url && password) {
        fetch('http://localhost/password_manager/public/backend.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `action=save&url=${encodeURIComponent(url)}&password=${encodeURIComponent(password)}`
        })
        .then(response => response.text())
        .then(data => {
            alert(data);
            document.getElementById('url').value = '';
            document.getElementById('password').value = '';
            renderPasswordList(); // Refresh the password list after saving
        })
        .catch(error => console.error('Error:', error));
    } else {
        alert('Please fill in both fields!');
    }
}

// Function to retrieve a password
function retrievePassword() {
    const retrieveUrl = document.getElementById('retrieve-url').value;

    fetch('http://localhost/password_manager/public/backend.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `action=retrieve&url=${encodeURIComponent(retrieveUrl)}`
    })
    .then(response => response.text())
    .then(data => {
        const retrievedPasswordElement = document.getElementById('retrieved-password');
        if (data !== "Password not found.") {
            retrievedPasswordElement.style.display = 'block';
            retrievedPasswordElement.textContent = `Password for ${retrieveUrl}: ${data}`;
        } else {
            retrievedPasswordElement.style.display = 'none';
            alert(data);
        }
    })
    .catch(error => console.error('Error:', error));
}

// Function to render the password list
function renderPasswordList() {
    fetch('http://localhost/password_manager/public/backend.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'action=list'
    })
    .then(response => response.json())
    .then(data => {
        const passwordList = document.getElementById('password-list');
        passwordList.innerHTML = ''; // Clear existing list

        data.forEach(item => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>${item.url}:</span>
                <input type="password" id="password-${item.id}" value="${item.password}" readonly>
                <button onclick="togglePasswordVisibility(${item.id})">👁</button>
                <div class="actions">
                    <button onclick="editPassword(${item.id})">Edit</button>
                    <button onclick="deletePassword(${item.id})">Delete</button>
                </div>
            `;
            passwordList.appendChild(listItem);
        });
    })
    .catch(error => console.error('Error:', error));
}

// Function to delete a password
function deletePassword(id) {
    fetch('http://localhost/password_manager/public/backend.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `action=delete&id=${id}`
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
        renderPasswordList(); // Refresh the password list after deletion
    })
    .catch(error => console.error('Error:', error));
}

// Function to toggle password visibility
function togglePasswordVisibility(id) {
    const passwordField = document.getElementById(`password-${id}`);
    passwordField.type = passwordField.type === 'password' ? 'text' : 'password';
}

// Function to edit a password
function editPassword(id) {
    const passwordField = document.getElementById(`password-${id}`);
    const editButton = passwordField.closest('li').querySelector('.actions button');

    // Ensure the password field exists
    if (!passwordField || !editButton) {
        console.error('Password field or Edit button not found!');
        return;
    }

    // Make the password field editable
    passwordField.readOnly = false;

    // Change the Edit button to Save and bind the saveEditedPassword function directly
    editButton.textContent = 'Save';
    editButton.onclick = () => saveEditedPassword(id);
}

// Function to save an edited password
function saveEditedPassword(id) {
    const passwordField = document.getElementById(`password-${id}`);
    const newPassword = passwordField.value;

    if (newPassword) {
        fetch('http://localhost/password_manager/public/backend.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `action=edit&id=${id}&password=${encodeURIComponent(newPassword)}`
        })
        .then(response => response.text())
        .then(data => {
            alert(data);

            // Lock the password field again and reset the button text to Edit
            passwordField.readOnly = true;
            const editButton = passwordField.closest('li').querySelector('.actions button');
            editButton.textContent = 'Edit';
            editButton.onclick = () => editPassword(id);

            // Refresh the list to reflect updates
            renderPasswordList();
        })
        .catch(error => console.error('Error:', error));
    } else {
        alert('Password cannot be empty!');
    }
}
