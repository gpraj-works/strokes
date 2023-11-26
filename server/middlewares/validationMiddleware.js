import { StatusCodes } from 'http-status-codes';
import Users from '../models/userModel.js';
import { compareString } from '../utils/tokenUtils.js';
import Verification from '../models/emailVerification.js';

export const validateRegister = async (req, res, next) => {
	const { firstName, lastName, email, password } = req.body;

	if (!(firstName || lastName || email || password)) {
		return res.status(StatusCodes.FAILED_DEPENDENCY).json({
			success: 'FAILED',
			message: 'Provide required fields',
		});
	}

	const isExist = await Users.findOne({ email });

	if (isExist) {
		return res.status(StatusCodes.CONFLICT).json({
			success: 'FAILED',
			message: 'Email id already exists',
		});
	}

	next();
};

export const validateLogin = async (req, res, next) => {
	const { email, password } = req.body;

	if (!(email || password)) {
		return res.status(StatusCodes.FAILED_DEPENDENCY).json({
			success: 'FAILED',
			message: 'Provide required fields',
		});
	}

	const isExist = await Users.findOne({ email }).select('+password').populate({
		path: 'friends',
		select: 'firstName lastName location profileUrl -password',
	});

	if (!isExist) {
		return res.status(StatusCodes.NOT_FOUND).json({
			success: 'FAILED',
			message: 'Invalid email or password',
		});
	}

	if (!isExist?.verified) {
		return res.status(StatusCodes.FORBIDDEN).json({
			success: 'FAILED',
			message: 'Email not verified. Check your email and verify.',
		});
	}

	const isCorrectPassword = await compareString(password, isExist?.password);

	if (!isCorrectPassword) {
		return res.status(StatusCodes.UNAUTHORIZED).json({
			success: 'FAILED',
			message: 'Invalid email or password',
		});
	}

	next();
};

export const validateVerifyEmail = async (req, res, next) => {
	const { userId } = req.params;
	const isExist = await Verification.findOne({ userId });

	console.log(isExist);

	if (isExist) {
		const { expiresAt } = isExist;

		if (expiresAt < Date.now()) {
			try {
				await Verification.findOneAndDelete({ userId });
				await Users.findOneAndDelete({ _id: userId });
				const message = 'Verification token has expired.';
				return res.redirect(`users/verified?status=error&message=${message}`);
			} catch (error) {
				console.log(error);
				return res.redirect('users/verified?status=error&message=');
			}
		}

		next();
	}

	return res.redirect('users/verified?message=');
};
