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
};

// auth-controller

export { register, login };
