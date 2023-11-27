import { env } from '../config/envConfig.js';
import Verification from '../models/emailVerification.js';
import Users from '../models/userModel.js';
import { compareString } from '../utils/tokenUtils.js';

export const verifyEmail = async (req, res) => {
	const { userId, token } = req.params;
	const isExist = await Verification.findOne({ userId });
	const { token: hashedToken } = isExist;
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
