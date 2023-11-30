import Users from '../models/userModel.js';
import { sendVerificationEmail } from '../utils/emailUtils.js';
import { createToken, hashString } from '../utils/tokenUtils.js';
import { StatusCodes } from 'http-status-codes';

export const register = async (req, res) => {
	const hashedPassword = await hashString(req.body.password);
	req.body.password = hashedPassword;
	const user = await Users.create(req.body);
	const isEmailSent = await sendVerificationEmail(user, res);

	if (!isEmailSent) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			success: 'FAILED',
			message: 'Something went wrong',
		});
	}

	return res.status(StatusCodes.CREATED).json({
		success: 'PENDING',
		message: 'Verification email sent. Check your email and verify.',
	});
};

export const login = async (req, res) => {
	const { email } = req.body;
	const user = await Users.findOne({ email });
	user.password = undefined;
	const token = createToken(user?._id);

	return res.status(StatusCodes.OK).json({
		success: true,
		message: 'Logged in successfully',
		user,
		token,
	});
};