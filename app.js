"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const { Keychain } = require("./password-manager");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static("public")); // Serve static front-end files

let keychain = null;

// API routes
app.post("/init", async (req, res) => {
    const { password } = req.body;
    keychain = await Keychain.init(password);
    res.json({ message: "Keychain initialized" });
});

app.post("/set", async (req, res) => {
    const { url, password } = req.body;
    await keychain.set(url, password);
    res.json({ message: "Password saved" });
});

app.post("/get", async (req, res) => {
    const { url } = req.body;
    const password = await keychain.get(url);
    res.json({ password });
});

app.post("/remove", async (req, res) => {
    const { url } = req.body;
    const removed = await keychain.remove(url);
    res.json({ removed });
});

app.post("/dump", async (req, res) => {
    const data = await keychain.dump();
    res.json({ contents: data[0], checksum: data[1] });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
