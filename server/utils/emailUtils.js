import { StatusCodes } from 'http-status-codes';
import nodemailer from 'nodemailer';
import { v4 as uuid } from 'uuid';
import { env } from '../config/envConfig.js';
import Verification from '../models/emailVerification.js';
import { hashString } from './tokenUtils.js';

let transporter = nodemailer.createTransport({ ...env.mail });

export const sendVerificationEmail = async (user) => {
	const { _id, email, firstName, lastName } = user;
	const token = _id + uuid();
	const link = env.appUrl + 'users/verify/' + _id + '/' + token;

	const mailOptions = {
		from: `"Strokes" <${env.mail?.auth.user}>`,
		to: email,
		subject: 'Email verification',
		//use express-handlebars (if needed)
		html: `<h1>Hi ${firstName} ${lastName}</h1><br /> <p>Please verify your account through following link. <em>Note : It will expire within one hour!</em></p><br /><a href="${link}"> Click to verify </a>`,
	};

	try {
		const hashedToken = await hashString(token);
		const isVerified = await Verification.create({
			userId: _id,
			token: hashedToken,
			createdAt: Date.now(),
			expiresAt: Date.now() + 3600000,
		});

		if (isVerified) {
			await transporter.sendMail(mailOptions);
			return true;
		}
	} catch (error) {
		console.log(error);
		return false;
	}
};
