import crypto from 'crypto-js';
import { env } from '../config/envConfig.js';

const generateIV = () => {
	return crypto.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
};

const encrypt = (message, key, iv) => {
	return crypto.AES.encrypt(message, key, { iv }).toString();
};

const decrypt = (cipherText, key, iv) => {
	const bytes = crypto.AES.decrypt(cipherText, key, { iv });
	return bytes.toString(crypto.enc.Utf8);
};

const newEnc = (message) => encrypt(message, env.code, generateIV);
const useEnc = (encrypted) => decrypt(encrypted, env.code, generateIV);

export { newEnc, useEnc };
