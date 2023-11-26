import Verification from '../models/emailVerification.js';
import Users from '../models/userModel.js';
import { compareString } from '../utils/tokenUtils.js';

export const verifyEmail = async (req, res) => {
	const { userId, token } = req.params;
	const isExist = await Verification.findOne({ userId });
	const { token: hashedToken } = isExist;

	const isMatch = await compareString(token, hashedToken);

	if (isMatch) {
		try {
			await Users.findOneAndUpdate({ _id: userId }, { verified: true });
			await Verification.findOneAndDelete({ userId });
			const message = 'Email verified successfully.';
			return res.redirect(`users/verified?status=success&message=${message}`);
		} catch (error) {
			console.log(error);
			const message = 'Verification failed or link is invalid.';
			return res.redirect(`users/verified?status=error&message=${message}`);
		}
	}

	return res.redirect('users/verified?message=');
};
