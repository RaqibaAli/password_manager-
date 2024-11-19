async function initializeKeychain() {
    const password = document.getElementById("master-password").value;

    if (!password) {
        alert("Please enter a master password");
        return;
    }

    const response = await fetch("/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
    });

    const result = await response.json();
    if (result.message === "Keychain initialized") {
        document.getElementById("init-section").style.display = "none";
        document.getElementById("main-section").style.display = "block";
    }
}

async function savePassword() {
    const url = document.getElementById("url").value;
    const password = document.getElementById("password").value;

    const response = await fetch("/set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, password })
    });

    const result = await response.json();
    alert(result.message);
}

async function getPassword() {
    const url = document.getElementById("lookup-url").value;

    const response = await fetch("/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
    });

    const result = await response.json();
    document.getElementById("retrieved-password").textContent = result.password
        ? `Password: ${result.password}`
        : "Password not found";
}

async function removePassword() {
    const url = document.getElementById("remove-url").value;

    const response = await fetch("/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
    });

    const result = await response.json();
    alert(result.removed ? "Password removed" : "Password not found");
}
