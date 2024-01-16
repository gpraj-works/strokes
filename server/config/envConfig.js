import dotenv from 'dotenv';
dotenv.config();

const envConfig = {
	conn: process.env.MONGO_URI,
	code: process.env.SECRET,
	port: 3002,
	// appUrl: 'http://localhost:3002/api/v1',
	appUrl: 'https://strokeserver.vercel.app/api/v1',
	mail: {
		host: process.env.MAIL_HOST,
		secureConnection: true,
		auth: {
			user: process.env.MAIL_USERNAME,
			pass: process.env.MAIL_PASSWORD,
		},
	},
};

export const env = envConfig;
