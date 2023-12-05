import {
	validateLogin,
	validateRegister,
	validateVerifyEmail,
	validateRequestResetPassword,
	validateResetPassword,
	validateUpdateUser,
	validateFriendRequest
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
	validateFriendRequest
};
	
// other middlewares

export { authUser, errorMiddleware };
