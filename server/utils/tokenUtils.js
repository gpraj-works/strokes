import bcrypt from 'bcryptjs';
import Jwt from 'jsonwebtoken';
import { env } from '../config/envConfig.js';

export const hashString = async (string) => {
	const salt = await bcrypt.genSalt(10);
	return await bcrypt.hash(string, salt);
};

export const compareString = async (string, hash) => {
	return await bcrypt.compare(string, hash);
};

export const createToken = (userId) => {
	return Jwt.sign({ userId }, env.code, { expiresIn: '1d' });
};

export const validateToken = (token) => {
	return Jwt.verify(token, env.code);
};
