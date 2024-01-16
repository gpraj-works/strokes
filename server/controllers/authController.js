import Users from '../models/userModel.js';
import { sendVerificationEmail } from '../utils/emailUtils.js';
import { createToken, hashString } from '../utils/tokenUtils.js';
import { StatusCodes } from 'http-status-codes';

export const register = async (req, res) => {
	const hashedPassword = await hashString(req.body.password);
	req.body.password = hashedPassword;

	try {
		const user = await Users.create(req.body);
		const isEmailSent = await sendVerificationEmail(user);

		if (!isEmailSent) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				status: 'FAILED',
				message: 'Something went wrong',
			});
		}

		return res.status(StatusCodes.CREATED).json({
			status: 'PENDING',
			message: 'Verification email sent. Check your email and verify.',
		});
	} catch (error) {
		console.log(error);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			status: 'FAILED',
			message: 'Something went wrong!',
		});
	}
};

export const login = async (req, res) => {
	const { email } = req.body;

	try {
		const user = await Users.findOne({ email });
		user.password = undefined;
		const token = createToken(user?._id);

		return res.status(StatusCodes.OK).json({
			status: true,
			message: 'Logged in successfully',
			user,
			token,
		});
	} catch (error) {
		console.log(error);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			status: 'FAILED',
			message: 'Something went wrong!',
		});
	}
};
