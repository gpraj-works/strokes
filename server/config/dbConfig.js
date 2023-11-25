import mongoose from 'mongoose';
import { env } from './envConfig.js';
import { useEnc } from '../utils/encUtils.js';

const dbConnect = async () => {
	try {
		await mongoose.connect(useEnc(env.conn));
		console.log('🔸 Database connected!');
	} catch (error) {
		console.log('database connection failed : ' + error);
	}
};

export default dbConnect;
