import Users from '../models/userModel.js';
import { sendVerificationEmail } from '../utils/emailUtils.js';
import { createToken, hashString } from '../utils/tokenUtils.js';
import { StatusCodes } from 'http-status-codes';

export const register = async (req, res) => {
	const hashedPassword = await hashString(req.body.password);
	req.body.password = hashedPassword;
	const user = await Users.create(req.body);
    await sendVerificationEmail(user, res);
    
	return res.status(StatusCodes.CREATED).json({ message: 'User created' });
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
