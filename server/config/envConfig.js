import dotenv from 'dotenv';
dotenv.config();

const envConfig = {
	conn: process.env.CONN,
	code: process.env.CODE,
	port: 3002,
	appUrl: 'http://localhost:3002/',
	mail: {
		host: 'gpraj@outlook.in',
		auth: {
			user: 'mey.MEY.mey',
			password: 'smtp-mail.outlook.com',
		},
		port: '587',
	},
};

export const env = envConfig;
