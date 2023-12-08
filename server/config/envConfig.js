import dotenv from 'dotenv';
dotenv.config();

const envConfig = {
	conn: process.env.CONN,
	code: process.env.CODE,
	port: 3002,
	appUrl: 'https://strokeserver.vercel.app/api/v1',
	mail: {
		host: process.env.MH,
		secureConnection: true,
		auth: {
			user: process.env.MU,
			pass: process.env.MP,
		},
	},
};

export const env = envConfig;
