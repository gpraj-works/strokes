import { env } from '../config/envConfig.js';
import Verification from '../models/emailVerification.js';
import Users from '../models/userModel.js';
import { compareString, hashString } from '../utils/tokenUtils.js';
import PasswordReset from '../models/passwordReset.js';
import { StatusCodes } from 'http-status-codes';
import { resetPasswordLink } from '../utils/emailUtils.js';

export const verifyEmail = async (req, res) => {
	const { userId, token } = req.params;
	const hashedToken = req.hashedToken;
	const redirectUrl = `${env.appUrl}/users/verified`;

	const isMatch = await compareString(token, hashedToken);

	if (isMatch) {
		try {
			await Users.findOneAndUpdate({ _id: userId }, { verified: true });
			await Verification.findOneAndDelete({ userId });
			const msg = 'Email verified successfully';
			return res.redirect(redirectUrl + `?status=success&message=${msg}`);
		} catch (error) {
			console.log(error);
			const msg = 'Verification failed or link is invalid';
			return res.redirect(redirectUrl + `?status=error&message=${msg}`);
		}
	}
};

export const requestPasswordReset = async (req, res) => {
	const { email } = req.body;
	const user = req.user;
	const isRequestExist = await PasswordReset.findOne({ email });

	if (isRequestExist) {
		if (isRequestExist.expiresAt > Date.now()) {
			return res.status(StatusCodes.CREATED).json({
				success: 'PENDING',
				message: 'Reset password link already sent to your email.',
			});
		}

		await PasswordReset.findOneAndDelete({ email });
	}

	const isSent = await resetPasswordLink(user);

	if (!isSent) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			success: 'FAILED',
			message: 'Something went wrong. Try again later.',
		});
	}

	return res.status(StatusCodes.CREATED).json({
		success: 'PENDING',
		message: 'Reset password link sent to your email.',
	});
};

export const resetPassword = async (req, res) => {
	const { userId, token } = req.params;
	const { expiresAt, token: resetToken } = req.resetPassword;
	const redirectUrl = `${env.appUrl}/users/reset-password`;

	if (expiresAt < Date.now()) {
		const msg = 'Reset link has expired. Please retry.';
		return res.redirect(redirectUrl + `?status=error&message=${msg}`);
	}

	const isMatch = await compareString(token, resetToken);

	if (!isMatch) {
		const msg = 'Invalid password reset link. Try again';
		return res.redirect(redirectUrl + `?status=error&message=${msg}`);
	}

	return res.redirect(redirectUrl + '?type=reset&id=' + userId);
};

export const changePassword = async (req, res) => {
	const { userId, password } = req.body;
	const hashedPassword = await hashString(password);
	const redirectUrl = `${env.appUrl}/users/reset-password`;

	const isChanged = await Users.findOneAndUpdate(
		{ _id: userId },
		{ password: hashedPassword }
	);

	if (isChanged) {
		await PasswordReset.findOneAndDelete({ userId });
		return res.status(StatusCodes.OK).json({
			status: 'success',
			message: 'Password reset successfully',
		});
	}
};
