import mongoose from 'mongoose';
import { env } from './envConfig.js';

const dbConnect = async () => {
	try {
		await mongoose.connect(env.conn);
		console.log('🔸 Database connected!');
	} catch (error) {
		console.log('database connection failed : ' + error);
	}
};

export default dbConnect;
