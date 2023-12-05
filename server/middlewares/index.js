import {
	validateLogin,
	validateRegister,
	validateVerifyEmail,
	validateRequestResetPassword,
	validateResetPassword,
	validateUpdateUser,
	validateFriendRequest,
	validateCreatePost
} from './validationMiddleware.js';
import { authUser } from './authMiddleware.js';
import errorMiddleware from './errorMiddleware.js';

// validation-middleware

export {
	validateLogin,
	validateRegister,
	validateVerifyEmail,
	validateRequestResetPassword,
	validateResetPassword,
	validateUpdateUser,
	validateFriendRequest,
	validateCreatePost
};
	
// other middlewares

export { authUser, errorMiddleware };
