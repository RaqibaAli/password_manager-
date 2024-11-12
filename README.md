

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

**3. In our proposed defense against the rollback attack (Section 2.2), we assume that we can store the SHA-256 hash in a trusted location beyond the reach of an adversary. Is it necessary to assume that such a trusted location exists, in order to defend against rollback attacks? Briefly justify your answer.**
No, it is not strictly necessary to assume a trusted location for storing a hash to defend against rollback attacks.Rather, either a secure timestamping solution or a secure blockchain could be deployed for data protection. With the immutability of the database schema and SHA-256 hashes posted on such a log, even the attacker who tries to alter the password database can’t do so, since the history of hashes cannot be deleted from the independently outlined log. This approach eliminates the need for any parameters that authenticate separate trustworthy storage, which protects the most current version of data from unauthorized persons.

**4. Because HMAC is a deterministic MAC (that is, its output is the same if it is run multiple times with the same input), we were able to look up domain names using their HMAC values. There are also randomized MACs, which can output different tags on multiple runs with the same input. Explain how you would do the look up if you had to use a randomized MAC instead of HMAC. Is there a performance penalty involved, and if so, what?**
Supposing that the randomized MAC is used instead of the HMAC, a whole different mechanism would be needed to resolve the domain names. As a result of randomized MAC and MAC which is different from one computation to the other, consistent looking up cannot be done as only the MAC is stored. Built-in constraints include storing a mapping for the original domain names whose randomized MAC has been verified with a deterministic key. During Lookups, first, Thomson retrieving the domain-name and keys, decrypt them, compute the randomized MAC, and make a match. However, this kind of approach leads to a degradation of performance, because other additional storage and decryption for each lookup are needed. In addition to that, such a MAC for the requested data was randomized that prevents its caching and reusability, which makes the lookups even worse.

**6. What is a way we can add multi-user support for specific sites to our password manager**
system without compromising security for other sites that these users may wish to store passwords of? That is, if Alice and Bob wish to access one stored password (say for nytimes) that either of them can get and update, without allowing the other to access their passwords for other websites

1.CREATING SHARED VOLTS.
For sites requiring shared access like nytimes create a "shared vault" which is a separate data structure accessible to both users (Alice and Bob).
 Each vault should be associated with access permissions, such as the ability to view or update specific credentials. This vault should be stored and encrypted separately from individual vaults to keep it isolated.
2. Per-User Encryption Keys
•	Each user will have their own encryption key for their private vault (where they store credentials for non-shared sites).
•	Shared vaults are encrypted using a shared encryption key, derived through a secure key-exchange mechanism for instance  Diffie-Hellman or using a KDF like PBKDF2 on a shared passphrase if that is an option.
•	When Alice and Bob need access to a shared credential, they decrypt it using the shared key, but they use their private keys for their individual vaults.
3. Access Control and Permission Management
•	Assign permissions to each user for each shared vault. For instance, restricting access to view-only for some users while giving full access to others.
4. Separation of User Sessions and Data
•	Each user logs in with their credentials, which only grants them access to their private vault and any shared vaults for which they have permissions.
•	Enforce strict access controls to ensure that a session tied to Alice cannot view or alter Bob’s private vault.
5. Auditing and Logging
•	Log access attempts and modifications to shared vaults to track any unauthorized attempts.
•	This can provide accountability and may alert users if an unauthorized change occurs.

---

