import CryptoJS from 'crypto-js';
import forge from 'node-forge'

export const loadContract = async (name) => {
    return fetch(`/contracts/${name}.json`)
        .then(res => res.json())
        .catch((err) => console.log(err))
}

export const encryptAES = (plaintext, key) => {
    const encryptedData = CryptoJS.AES.encrypt(plaintext, key).toString();
    return encryptedData
}
export const decryptAES = (encryptedString, key) => {
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedString, key);
    return decryptedBytes.toString(CryptoJS.enc.Utf8);
}

export const digitalSignature = (plaintext) => {
    // Tạo key
    const keyPair = forge.pki.rsa.generateKeyPair({ bits: 2048 })
    const privateKey_pem = forge.pki.privateKeyToPem(keyPair.privateKey);
    const publicKey_pem = forge.pki.publicKeyToPem(keyPair.publicKey);

    // Kí
    const privateKey = forge.pki.privateKeyFromPem(privateKey_pem);
    const md = forge.md.sha256.create();
    md.update(plaintext, 'utf8');
    return { signature: privateKey.sign(md), publickey: publicKey_pem }
}

