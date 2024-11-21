const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
let userDatabase = {}; // In-memory user storage

app.use(cors());
app.use(bodyParser.json());

// Serve a default message or HTML for the root URL
app.get('/', (req, res) => {
    res.send('Welcome to the Password Manager API');
});

// Register a user
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (userDatabase[username]) {
        return res.status(400).send({ error: 'User already exists' });
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.createHmac('sha256', salt).update(password).digest('hex');
    const checksum = crypto.createHash('sha256').update(hash).digest('hex');

    userDatabase[username] = { salt, representation: hash, checksum };
    res.send({ success: true });
});

// Login user
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = userDatabase[username];
    if (!user) {
        return res.status(404).send({ error: 'User not found' });
    }

    const hash = crypto.createHmac('sha256', user.salt).update(password).digest('hex');
    const checksum = crypto.createHash('sha256').update(hash).digest('hex');

    if (checksum !== user.checksum) {
        return res.status(401).send({ error: 'Invalid credentials' });
    }

    res.send({ success: true, message: 'Login successful!' });
});

// Save password for user
app.post('/save-password', (req, res) => {
    const { username, url, password } = req.body;

    if (!userDatabase[username]) {
        return res.status(404).send({ error: 'User not found' });
    }

    if (!userDatabase[username].passwords) {
        userDatabase[username].passwords = [];
    }

    userDatabase[username].passwords.push({ url, password });
    res.send({ success: true });
});

// Retrieve passwords
app.post('/retrieve-passwords', (req, res) => {
    const { username } = req.body;

    const user = userDatabase[username];
    if (!user || !user.passwords) {
        return res.status(404).send({ error: 'No passwords found' });
    }

    res.send({ passwords: user.passwords });
});

app.listen(3000, () => console.log('Server running on port 3000'));
