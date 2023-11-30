import express from 'express';
import path from 'path';
import {
	changePassword,
	requestPasswordReset,
	resetPassword,
	verifyEmail,
	userById,
	updateUser,
	friendRequest,
	acceptRequest,
	getFriendRequest,
} from '../controllers/index.js';
import {
	validateRequestResetPassword,
	validateResetPassword,
	validateVerifyEmail,
	validateUpdateUser,
	authUser,
} from '../middlewares/index.js';

const router = express.Router();
const __dirname = path.resolve(path.dirname(''));

router.get('/verify/:userId/:token', validateVerifyEmail, verifyEmail);

//reset-password
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

// user
router.get('/userById/:id', authUser, userById);
router.put('/update-user', authUser, validateUpdateUser, updateUser);

// friend-request
router.post('/friend-request', authUser, friendRequest);
router.post('/get-friend-request', authUser, getFriendRequest);
router.post('/accept-request', authUser, acceptRequest);

// views
router.get('/verified', (req, res) => {
	console.log(__dirname);
	return res.sendFile(path.join(__dirname, './views/', 'verified.html'));
});

router.get('/reset-password', (req, res) => {
	console.log(__dirname);
	return res.sendFile(path.join(__dirname, './views/', 'reset-password.html'));
});

export default router;
