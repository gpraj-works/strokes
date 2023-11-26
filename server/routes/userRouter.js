import express from 'express';
import path from 'path';
import { verifyEmail } from '../controllers/userController.js';
import { validateVerifyEmail } from '../middlewares/index.js';

const router = express.Router();
const __dirname = path.resolve(path.dirname(''));

router.get('/verify/:userId/:token', validateVerifyEmail, verifyEmail);

router.get('/verified', (req, res) => {
	return res.sendFile(path.join(__dirname, './view/verified.html'));
});

export default router;
