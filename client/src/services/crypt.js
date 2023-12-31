import { JSEncrypt } from 'jsencrypt'; //rsa
import CryptoJS from "crypto-js"; // aes

// Function to generate RSA key pairs.
function generateKeys() {
    const crypt = new JSEncrypt({ default_key_size: 2048 });
    crypt.getKey();
    return {
        'private': crypt.getPrivateKey(),
        'public': crypt.getPublicKey()
    };
}

// Function to generate a random string of a given length.
function generateRandomString(length) {
    var text = "";
    var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
        text += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return text;
}

// Function to package data for transmission with encryption.
const pack = (data, userKeys) => {
    const encrypted = { 'aesKey': {} };
    const aesKey = generateRandomString(32);
    encrypted['data'] = CryptoJS.AES.encrypt(JSON.stringify(data), aesKey).toString();
    for (let key in userKeys) {
        const encrypter = new JSEncrypt();
        encrypter.setKey(userKeys[key]);
        encrypted['aesKey'][key] = encrypter.encrypt(aesKey);
    }
    return encrypted
}

// Function to unpack and decrypt data received from the server.
const unpack = (data, privateKey) => {
    const decrypter = new JSEncrypt();
    decrypter.setKey(privateKey);
    const aesKey = decrypter.decrypt(data.aesKey);
    var bytes = CryptoJS.AES.decrypt(data.data, aesKey);
    var decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decrypted
}

export { pack, unpack, generateKeys }