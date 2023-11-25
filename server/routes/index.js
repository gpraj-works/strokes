import express from 'express';
import authRoute from './authRouter.js';

const router = express.Router();

router.use('/auth', authRoute); //register_login

export default router;
