import { StatusCodes } from 'http-status-codes';
import Users from '../models/userModel.js';
import { compareString } from '../utils/tokenUtils.js';

export const validateRegister = async (req, res, next) => {
	const { firstName, lastName, email, password } = req.body;

	if (!(firstName || lastName || email || password)) {
		return res.status(StatusCodes.FAILED_DEPENDENCY).json({
			message: 'Provide required fields',
		});
	}

	const isExist = await Users.findOne({ email });

	if (isExist) {
		return res.status(StatusCodes.CONFLICT).json({
			message: 'Email id already exists',
		});
	}

	next();
};

export const validateLogin = async (req, res, next) => {
	const { email, password } = req.body;

	if (!(email || password)) {
		return res.status(StatusCodes.FAILED_DEPENDENCY).json({
			message: 'Provide required fields',
		});
	}

	const isExist = await Users.findOne({ email }).select('+password').populate({
		path: 'friends',
		select: 'firstName lastName location profileUrl -password',
	});

	if (!isExist) {
		return res.status(StatusCodes.NOT_FOUND).json({
			message: 'Invalid email or password',
		});
	}

	if (!isExist?.verified) {
		return res.status(StatusCodes.FORBIDDEN).json({
			message: 'Email not verified. Check your email and verify.',
		});
	}

	const isCorrectPassword = await compareString(password, isExist?.password);

	if (!isCorrectPassword) {
		return res.status(StatusCodes.UNAUTHORIZED).json({
			message: 'Invalid email or password',
		});
	}

	next();
};
