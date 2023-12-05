import { StatusCodes } from 'http-status-codes';
import Users from '../models/userModel.js';
import { compareString } from '../utils/tokenUtils.js';
import Verification from '../models/emailVerification.js';
import { env } from '../config/envConfig.js';
import PasswordReset from '../models/passwordReset.js';
import FriendRequest from '../models/friendRequest.js';

export const validateRegister = async (req, res, next) => {
	const { firstName, lastName, email, password } = req.body;

	if (!(firstName || lastName || email || password)) {
		return res.status(StatusCodes.FAILED_DEPENDENCY).json({
			success: 'FAILED',
			message: 'Provide required fields',
		});
	}

	try {
		const isExist = await Users.findOne({ email });

		if (isExist) {
			return res.status(StatusCodes.CONFLICT).json({
				success: 'FAILED',
				message: 'Email id already exists',
			});
		}

		next();
	} catch (error) {
		console.log(error);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			status: 'FAILED',
			message: 'Something went wrong!',
		});
	}
};

export const validateLogin = async (req, res, next) => {
	const { email, password } = req.body;

	if (!(email || password)) {
		return res.status(StatusCodes.FAILED_DEPENDENCY).json({
			success: 'FAILED',
			message: 'Provide required fields',
		});
	}

	try {
		const isExist = await Users.findOne({ email })
			.select('+password')
			.populate({
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
	} catch (error) {
		console.log(error);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			status: 'FAILED',
			message: 'Something went wrong!',
		});
	}
};

export const validateVerifyEmail = async (req, res, next) => {
	const { userId } = req.params;
	const redirectUrl = `${env.appUrl}/users/verified`;

	try {
		const isExist = await Verification.findOne({ userId });

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
	} catch (error) {
		console.log(error);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			status: 'FAILED',
			message: 'Something went wrong!',
		});
	}
};

export const validateRequestResetPassword = async (req, res, next) => {
	const { email } = req.body;

	try {
		const isUserExist = await Users.findOne({ email });

		if (!isUserExist) {
			return res.status(StatusCodes.NOT_FOUND).json({
				success: 'FAILED',
				message: 'Email id not found!',
			});
		}

		req.user = isUserExist;
		next();
	} catch (error) {
		console.log(error);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			status: 'FAILED',
			message: 'Something went wrong!',
		});
	}
};

export const validateResetPassword = async (req, res, next) => {
	const { userId, token } = req.params;
	const redirectUrl = `${env.appUrl}/users/reset-password`;

	try {
		const isExist = await Users.findById(userId);

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
	} catch (error) {
		console.log(error);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			status: 'FAILED',
			message: 'Something went wrong!',
		});
	}
};

export const validateUpdateUser = async (req, res, next) => {
	const { firstName, lastName, location, profileUrl, profession } = req.body;

	if (!(firstName || lastName || location || profileUrl || profession)) {
		return res.status(StatusCodes.FAILED_DEPENDENCY).json({
			success: false,
			message: 'Provide required fields',
		});
	}

	req.toUpdate = { firstName, lastName, location, profileUrl, profession };

	next();
};

export const validateFriendRequest = async (req, res, next) => {
	const { userId } = req.body.user;
	const { requestTo } = req.body;

	try {
		const requestExist = await FriendRequest.findOne({
			requestFrom: userId,
			requestTo,
		});

		if (requestExist) {
			return res.status(StatusCodes.CONFLICT).json({
				success: false,
				message: 'Friend request already sent',
			});
		}

		const accountExist = await FriendRequest.findOne({
			requestFrom: requestTo,
			requestTo: userId,
		});

		if (accountExist) {
			return res.status(StatusCodes.CONFLICT).json({
				success: false,
				message: 'Friend request already sent',
			});
		}

		req.request = { from: userId, to: requestTo };
		next();
	} catch (error) {
		console.log(error);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			status: 'FAILED',
			message: 'Something went wrong!',
		});
	}
};
