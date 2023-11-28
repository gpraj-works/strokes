
import express from 'express';
import path from 'path';
import { requestPasswordReset, verifyEmail } from '../controllers/index.js';
import { validateVerifyEmail } from '../middlewares/index.js';
import { validateResetPassword } from '../middlewares/validationMiddleware.js';

const router = express.Router();
const __dirname = path.resolve(path.dirname(''));

router.get('/verify/:userId/:token', validateVerifyEmail, verifyEmail);

router.post('/request-password-reset', validateResetPassword, requestPasswordReset);
router.get('/reset-password/:userId/:token', resetPassword);
router.post('/reset-password', changePassword);

router.get('/verified', (req, res) => {
	console.log(__dirname);
	return res.sendFile(path.join(__dirname, './views/build'));
});

export default router;
