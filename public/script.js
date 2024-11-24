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
            renderPasswordList(); // Refresh the list
        })
        .catch(error => console.error('Error:', error));
    } else {
        alert('Please fill in both fields!');
    }
}

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

function renderPasswordList() {
    fetch('http://localhost/password_manager/public/backend.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'action=list'
    })
    .then(response => response.json())
    .then(data => {
        const passwordList = document.getElementById('password-list');
        passwordList.innerHTML = '';
        data.forEach(item => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>${item.url}:</span>
                <input type="password" id="password-${item.id}" value="${item.password}" readonly>
                <button onclick="togglePasswordVisibility(${item.id})">👁️</button>
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

function deletePassword(id) {
    fetch('http://localhost/password_manager/public/backend.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `action=delete&id=${id}`
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
        renderPasswordList(); // Refresh the list
    })
    .catch(error => console.error('Error:', error));
}

function togglePasswordVisibility(index) {
    const passwordField = document.getElementById(`password-${index}`);
    passwordField.type = passwordField.type === 'password' ? 'text' : 'password';
}
