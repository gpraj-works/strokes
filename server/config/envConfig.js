import dotenv from 'dotenv';
dotenv.config();

const envConfig = {
	conn: process.env.CONN,
	code: process.env.CODE,
	port: 3002,
};

export const env = envConfig;
