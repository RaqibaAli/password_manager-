

---

# Secure Password Manager

## Table of Contents
1. [Introduction](#introduction)
2. [Features](#features)
3. [Project Structure](#project-structure)
4. [Setup and Installation](#setup-and-installation)
5. [Usage](#usage)
6. [API Documentation](#api-documentation)
7. [Security Considerations](#security-considerations)
8. [Testing](#testing)
9. [Known Limitations](#known-limitations)
10. [Contributing](#contributing)
11. [Short answer questions](#short-answer-questions)

---

### Introduction
This project is a secure password manager implemented using cryptographic techniques to protect users' passwords. It is designed to securely store and retrieve passwords for various domains, ensuring confidentiality and integrity through encryption and hashing. It serves as a foundational library for managing passwords and can be extended into a full application.

### Features
- **Master Password Protection**: Uses a master password to secure access.
- **AES-GCM Encryption**: Protects passwords individually to avoid decrypting the entire storage for single entries.
- **Key Derivation**: Uses PBKDF2 to generate a secure master key.
- **HMAC-based Domain Keys**: Ensures domain names are hashed, hiding specific domain details.
- **Integrity Check**: SHA-256 checksum prevents rollback attacks.
- **Defenses against Attacks**: Mitigates swap and rollback attacks as specified in the security model.

### Project Structure
- **`password-manager.js`**: Main file containing all logic and methods for password management.
- **`test/test-password-manager.js`**: Unit tests for verifying functionality and security features.
- **`lib.js`**: Helper functions for encoding, buffer conversion, and generating random bytes.

### Setup and Installation
1. Install [Node.js](https://nodejs.org/en/download/) if not already installed.
2. Clone the repository and navigate into the project folder.
3. Install dependencies using `npm install`.
4. Run tests using `npm run test`.

### Usage
1. Import `Keychain` class from `password-manager.js`.
2. Initialize a new keychain with a master password:
   ```javascript
   const keychain = await Keychain.init("master-password");
   ```
3. Store, retrieve, and delete passwords with `set`, `get`, and `remove` methods.
4. Serialize the password manager for storage with `dump` and load it back with `load`.

### API Documentation
- **`static async init(password)`**: Initializes a new Keychain with a given master password.
- **`static async load(password, contents, checksum)`**: Loads an existing Keychain from serialized data, checking integrity if a checksum is provided.
- **`async dump({ includeKVS = false } = {})`**: Serializes the Keychain and returns an array with JSON content and checksum.
- **`async get(url)`**: Retrieves the password for a given domain.
- **`async set(url, password)`**: Stores or updates the password for a domain.
- **`async remove(url)`**: Removes a domain entry from the key-value store.

### Security Considerations
- **Threat Model**: Defends against rollback and swap attacks with integrity checks and separate defenses.
- **Domain Privacy**: Uses HMAC for domain keys to prevent revealing domain names.
- **Encrypted Storage**: Uses AES-GCM to protect individual passwords.
- **Rollback Protection**: SHA-256 checksum provides verification against tampered records.

### Testing
Run `npm test` to execute the suite of tests provided in `test/test-password-manager.js`, which covers:
- Password storage and retrieval
- Serialization and deserialization with integrity checks
- Defenses against swap and rollback attacks

### Known Limitations
- **Single-User Focus**: Designed for a single user's passwords; no support for multi-user access.
- **Security Limitations**: For educational purposes, not suitable for real-world password management without additional security hardening.

### Contributing
Contributions are welcome! Please fork the repository and submit a pull request with detailed information on the changes.

### SHORT ANSWER QUESTIONS
**1. Briefly describe your method for preventing the adversary from learning information about
the lengths of the passwords stored in your password manager.**
To prevent an adversary from deducing password lengths, each password entry in the Keychain is encrypted individually using AES-GCM, with each entry padded or adjusted to a consistent size if necessary (up to a maximum of 64 characters). This design choice prevents any direct correlation between password length and ciphertext length, as the lengths of stored encrypted passwords are uniform regardless of the original password length.

**2. Briefly describe your method for preventing swap attacks (Section 2.2). Provide an argument for why the attack is prevented in your scheme.**
The Keychain defends against swap attacks by maintaining an integrity check (SHA-256 checksum) of the entire key-value store (KVS) before serialization. When deserializing, the manager verifies that the current state matches the saved checksum. This ensures that any swapped records or alterations to specific domain entries are detected and result in an error. Additionally, using HMAC to hash domain names adds another layer of defense, as it obscures domain identifiers from an attacker.

---
