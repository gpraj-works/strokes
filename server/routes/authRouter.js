import express from 'express';
import { validateLogin, validateRegister } from '../middlewares/index.js';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

export default router;
