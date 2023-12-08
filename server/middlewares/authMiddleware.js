import { StatusCodes } from 'http-status-codes';
import { validateToken } from '../utils/tokenUtils.js';

export const authUser = async (req, res, next) => {
	const authHeader = req?.headers?.authorization;

	if (!authHeader || !authHeader?.startsWith('Bearer')) {
		return res.status(StatusCodes.UNAUTHORIZED).json({
			status: 'FAILED',
			message: 'Authentication failed',
		});
	}

	const token = authHeader?.split(' ')[1];

	try {
		const authToken = validateToken(token);
		req.body.user = { userId: authToken?.userId };
		next();
	} catch (error) {
		console.log(error);
		return res.status(StatusCodes.UNAUTHORIZED).json({
			status: 'FAILED',
			message: 'Authentication failed',
		});
	}
};
