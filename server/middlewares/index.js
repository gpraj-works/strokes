import {
	validateLogin,
	validateRegister,
	validateVerifyEmail,
} from './validationMiddleware.js';
import errorMiddleware from './errorMiddleware.js';

export {
	validateLogin,
	validateRegister,
	validateVerifyEmail,
	errorMiddleware,
};
