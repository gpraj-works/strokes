import { StatusCodes } from 'http-status-codes';
import Users from '../models/userModel.js';
import { compareString } from '../utils/tokenUtils.js';
import Verification from '../models/emailVerification.js';
import { env } from '../config/envConfig.js';
import PasswordReset from '../models/passwordReset.js';

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
	const redirectUrl = `${env.appUrl}/users/verified`;

	if (isExist) {
		const { expiresAt, token: hashedToken } = isExist;

		if (expiresAt < Date.now()) {
			try {
				await Verification.findOneAndDelete({ userId });
				await Users.findOneAndDelete({ _id: userId });
				const msg = 'Verification token has expired';
				return res.redirect(redirectUrl + `?status=error&message=${msg}`);
			} catch (error) {
				console.log(error);
				const msg = 'Unable to verify, Please retry';
				return res.redirect(redirectUrl + `?status=error&message=${msg}`);
			}
		}

		req.hashedToken = hashedToken;
		next();
	}
};

export const validateRequestResetPassword = async (req, res, next) => {
	const { email } = req.body;
	const isUserExist = await Users.findOne({ email });

	if (!isUserExist) {
		return res.status(StatusCodes.NOT_FOUND).json({
			success: 'FAILED',
			message: 'Email id not found!',
		});
	}

	req.user = isUserExist;
	next();
};

export const validateResetPassword = async (req, res, next) => {
	const { userId, token } = req.params;
	const isExist = await Users.findById(userId);
	const redirectUrl = `${env.appUrl}/users/reset-password`;

	if (!isExist) {
		const msg = 'Invalid password reset link. Try again';
		return res.redirect(redirectUrl + `?status=error&message=${msg}`);
	}

	const resetPassword = await PasswordReset.findOne({ userId });

	if (!resetPassword) {
		const msg = 'Invalid password reset link. Try again';
		return res.redirect(redirectUrl + `?status=error&message=${msg}`);
	}

	req.resetPassword = resetPassword;

	next();
};
