import dotenv from 'dotenv';
dotenv.config();

const envConfig = {
	conn: process.env.CONN,
	code: process.env.CODE,
	port: 3002,
	appUrl: 'http://localhost:3002/api/v1',
	mail: {
		host: 'smtp-relay.brevo.com',
		secureConnection: true,
		auth: {
			user: 'techfewbugs@gmail.com',
			pass: 'a4IHCm3MVr2bjYZG',
		}
	},
};

export const env = envConfig;
