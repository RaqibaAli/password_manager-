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
        passwords.push({ url, password });
        renderPasswordList();
        document.getElementById('url').value = '';
        document.getElementById('password').value = '';
    } else {
        alert('Please fill in both fields!');
    }
}

function editPassword(index) {
    const newPassword = prompt('Enter new password:');
    if (newPassword) {
        passwords[index].password = newPassword;
        renderPasswordList();
    }
}

function deletePassword(index) {
    passwords.splice(index, 1);
    renderPasswordList();
}

function retrievePassword() {
    const retrieveUrl = document.getElementById('retrieve-url').value;
    const result = passwords.find(item => item.url === retrieveUrl);

    const retrievedPasswordElement = document.getElementById('retrieved-password');
    if (result) {
        retrievedPasswordElement.style.display = 'block';
        retrievedPasswordElement.textContent = `Password for ${result.url}: ${result.password}`;
    } else {
        retrievedPasswordElement.style.display = 'none';
        alert('Password not found for this domain!');
    }
}

function renderPasswordList() {
    const passwordList = document.getElementById('password-list');
    passwordList.innerHTML = '';
    passwords.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span>${item.url}: ${item.password}</span>
            <div class="actions">
                <button onclick="editPassword(${index})">Edit</button>
                <button onclick="deletePassword(${index})">Delete</button>
            </div>
        `;
        passwordList.appendChild(listItem);
    });
}
