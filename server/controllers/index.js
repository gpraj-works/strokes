import {
	verifyEmail,
	requestPasswordReset,
	resetPassword,
	changePassword,
	userById,
	updateUser,
	friendRequest,
	getFriendRequest,
	acceptRequest,
	profileViews,
	suggestedFriends,
} from './userController.js';
import { register, login } from './authController.js';

// user-controller

export {
	requestPasswordReset,
	verifyEmail,
	resetPassword,
	changePassword,
	userById,
	updateUser,
	friendRequest,
	getFriendRequest,
	acceptRequest,
	profileViews,
	suggestedFriends,
};

// auth-controller

export { register, login };
