const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
const ivLength = 16; // Длина IV для aes-256-cbc

// Проверка длины ключа
if (key.length !== 32) {
    throw new Error('Invalid key length. It should be 32 bytes for aes-256-cbc.');
}

/**
 * Шифрует сообщение.
 * @param {string} message - Сообщение для шифрования.
 * @returns {object} - Объект с зашифрованным сообщением и IV.
 */
const encryptMessage = (message) => {
    if (typeof message !== 'string' || !message.length) {
        throw new Error('Invalid message. It should be a non-empty string.');
    }

    const iv = crypto.randomBytes(ivLength);  // Генерация нового IV для каждого сообщения
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    let encrypted = '';
    try {
        encrypted += cipher.update(message, 'utf8', 'hex');
        encrypted += cipher.final('hex');
    } catch (err) {
        console.error('Encryption failed:', err);
        throw err;
    }

    return { encryptedMessage: encrypted, iv: iv.toString('hex') };
};

/**
 * Дешифрует сообщение.
 * @param {string} encryptedMessage - Зашифрованное сообщение.
 * @param {string} ivHex - IV в формате hex.
 * @returns {string} - Дешифрованное сообщение.
 */
const decryptMessage = (encryptedMessage, ivHex) => {
    if (typeof encryptedMessage !== 'string' || !encryptedMessage.length) {
        throw new Error('Invalid encrypted message. It should be a non-empty string.');
    }

    const iv = Buffer.from(ivHex, 'hex');

    if (iv.length !== ivLength) {
        throw new Error('Invalid IV length. It should be 16 bytes for aes-256-cbc.');
    }

    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    let decrypted = '';
    try {
        decrypted += decipher.update(encryptedMessage, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
    } catch (err) {
        console.error('Decryption failed:', err);
        throw err;
    }

    return decrypted;
};

module.exports = {
    encryptMessage,
    decryptMessage
};
