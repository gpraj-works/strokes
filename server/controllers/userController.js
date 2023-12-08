import { env } from '../config/envConfig.js';
import Verification from '../models/emailVerification.js';
import Users from '../models/userModel.js';
import { compareString, createToken, hashString } from '../utils/tokenUtils.js';
import PasswordReset from '../models/passwordReset.js';
import { StatusCodes } from 'http-status-codes';
import { resetPasswordLink } from '../utils/emailUtils.js';
import FriendRequest from '../models/friendRequest.js';

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

	try {
		const isRequestExist = await PasswordReset.findOne({ email });

		if (isRequestExist) {
			if (isRequestExist.expiresAt > Date.now()) {
				return res.status(StatusCodes.CREATED).json({
					status: 'PENDING',
					message: 'Reset password link already sent to your email.',
				});
			}

			await PasswordReset.findOneAndDelete({ email });
		}

		const isSent = await resetPasswordLink(user);

		if (!isSent) {
			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				status: 'FAILED',
				message: 'Something went wrong. Try again later.',
			});
		}

		return res.status(StatusCodes.CREATED).json({
			status: 'PENDING',
			message: 'Reset password link sent to your email.',
		});
	} catch (error) {
		console.log(error);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			status: 'FAILED',
			message: 'Something went wrong!',
		});
	}
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

	try {
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
	} catch (error) {
		console.log(error);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			status: 'FAILED',
			message: 'Something went wrong!',
		});
	}
};

export const userById = async (req, res) => {
	const { userId } = req.body.user;
	const { id } = req.params;

	try {
		const user = await Users.findById(id ?? userId).populate({
			path: 'friends',
			select: '-password',
		});

		if (!user) {
			return res.status(StatusCodes.NOT_FOUND).json({
				status: false,
				message: 'User not found!',
			});
		}

		user.password = undefined;

		return res.status(StatusCodes.OK).json({ status: true, user });
	} catch (error) {
		console.log(error);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			status: 'FAILED',
			message: 'Something went wrong!',
		});
	}
};

export const updateUser = async (req, res) => {
	const { userId } = req.body.user;

	try {
		const updatedUser = await Users.findByIdAndUpdate(userId, req?.toUpdate, {
			new: true,
		});

		if (!updatedUser) {
			return res.status(StatusCodes.NOT_FOUND).json({
				status: 'FAILED',
				message: 'User not found!',
			});
		}

		await updatedUser.populate({ path: 'friends', select: '-password' });

		const token = createToken(updateUser?._id);
		updatedUser.password = undefined;

		return res.status(StatusCodes.OK).json({
			status: true,
			message: 'User updated successfully',
			user: updatedUser,
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

export const friendRequest = async (req, res) => {
	const { from, to } = req.request;

	try {
		const newRequest = await FriendRequest.create({
			requestTo: to,
			requestFrom: from,
		});

		return res.status(StatusCodes.CREATED).json({
			status: true,
			message: 'Friend request sent successfully',
		});
	} catch (error) {
		console.log(error);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			status: 'FAILED',
			message: 'Something went wrong!',
		});
	}
};

export const getFriendRequest = async (req, res) => {
	const { userId } = req.body.user;

	try {
		const requests = await FriendRequest.find({
			requestTo: userId,
			requestStatus: 'Pending',
		}).populate({
			path: 'requestFrom',
			select: 'firstName lastName profileUrl profession -password',
		}).limit(10).sort({_id: -1 }); //prettier-ignore

		return res.status(StatusCodes.OK).json({
			status: true,
			data: requests,
		});
	} catch (error) {
		console.log(error);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			status: 'FAILED',
			message: 'Something went wrong!',
		});
	}
};

export const acceptRequest = async (req, res) => {
	const id = req.body.user.userId;
	const { rid, status } = req.body;

	try {
		const requestExist = await FriendRequest.findById(rid);
		if (!requestExist) {
			return res.status(StatusCodes.NOT_FOUND).json({
				status: false,
				message: 'Friend request not found!',
			});
		}

		const updatedResponse = await FriendRequest.findOneAndUpdate(
			{ _id: rid },
			{ requestStatus: status }
		);

		if (status === 'Accepted') {
			const user = await Users.findById(id);

			if (!user?.friends.includes(updatedResponse?.requestFrom)) {
				user?.friends.push(updatedResponse?.requestFrom);
				await user.save();
			}

			const friend = await Users.findById(updatedResponse?.requestFrom);

			if (!friend?.friends.includes(updatedResponse?.requestTo)) {
				friend?.friends.push(updatedResponse?.requestTo);
				await friend.save();
			}
		} else {
			await FriendRequest.findOneAndUpdate(
				{ _id: rid },
				{ requestStatus: status }
			);
		}

		return res.status(StatusCodes.OK).json({
			status: true,
			message: 'Friend request ' + status,
		});
	} catch (error) {
		console.log(error);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			status: 'FAILED',
			message: 'Something went wrong!',
		});
	}
};

export const profileViews = async (req, res) => {
	const { userId } = req.body.user;
	const { id } = req.body;

	try {
		const user = await Users.findById(id);
		if (!user?.views.includes(userId)) {
			user?.views.push(userId);
			await user.save();
		}
		return res.status(StatusCodes.OK).json({
			status: true,
			message: 'Profile viewed',
		});
	} catch (error) {
		console.log(error);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			status: 'FAILED',
			message: 'Something went wrong!',
		});
	}
};

export const suggestedFriends = async (req, res) => {
	const { userId } = req.body.user;
	let query = {};

	query._id = { $ne: userId };
	query.friends = { $nin: userId };

	try {
		const suggestedFriends = await Users.find(query)
			.limit(15)
			.select('firstName lastName profileUrl profession -password');
		return res.status(StatusCodes.OK).json({
			status: true,
			data: suggestedFriends,
		});
	} catch (error) {
		console.log(error);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			status: 'FAILED',
			message: 'Something went wrong!',
		});
	}
};
