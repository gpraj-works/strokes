import express from 'express';
import path from 'path';
import {
	requestPasswordReset,
	verifyEmail,
	resetPassword,
	changePassword,
} from '../controllers/index.js';
import {
	validateVerifyEmail,
	validateRequestResetPassword,
	validateResetPassword,
} from '../middlewares/index.js';

const router = express.Router();
const __dirname = path.resolve(path.dirname(''));

router.get('/verify/:userId/:token', validateVerifyEmail, verifyEmail);

router.post(
	'/request-password-reset',
	validateRequestResetPassword,
	requestPasswordReset
);

router.get(
	'/reset-password/:userId/:token',
	validateResetPassword,
	resetPassword
);

router.post('/reset-password', changePassword);

router.get('/verified', (req, res) => {
	console.log(__dirname);
	return res.sendFile(path.join(__dirname, './views/', 'verified.html'));
});

router.get('/reset-password', (req, res) => {
	console.log(__dirname);
	return res.sendFile(path.join(__dirname, './views/', 'reset-password.html'));
});

export default router;
