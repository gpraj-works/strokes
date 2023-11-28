import { env } from '../config/envConfig.js';
import Verification from '../models/emailVerification.js';
import Users from '../models/userModel.js';
import { compareString } from '../utils/tokenUtils.js';
import PasswordReset from '../models/passwordReset.js';
import { StatusCodes } from 'http-status-codes';

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
		return res.status(StatusCodes.CREATED).json({
			success: 'FAILED',
			message: 'Something went wrong. Try again later.',
		});
	}
};
