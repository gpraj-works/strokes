import {
	verifyEmail,
	requestPasswordReset,
	resetPassword,
	changePassword,
} from './userController.js';
import { register, login } from './authController.js';

export {
	requestPasswordReset,
	verifyEmail,
	register,
	login,
	resetPassword,
	changePassword,
};
