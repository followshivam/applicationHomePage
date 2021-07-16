import CryptoJS from 'crypto-js';

export const encryptPassword = (password, token, passwordEncryptionRequired) => {
    try {
        if (passwordEncryptionRequired === "Y") {
            var iv = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
            var salt = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
            const keySize = 4;
            const iterationCount = 1000;
            var key = CryptoJS.PBKDF2(
                token,
                CryptoJS.enc.Hex.parse(salt),
                { keySize: keySize, iterations: iterationCount });
            var ciphertext = CryptoJS.AES.encrypt(
                password,
                key,
                { iv: CryptoJS.enc.Hex.parse(iv) });
            var strEncText = (iv + "::" + salt + "::" + ciphertext);
            strEncText = btoa(strEncText);
            return Promise.resolve(strEncText);
        } else {
            return Promise.resolve(password);
        }
    } catch (e) {
        console.log(e);
        return Promise.resolve(password);
    }
}

