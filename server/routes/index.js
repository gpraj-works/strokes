import express from 'express';
import authRoute from './authRouter.js';
import userRoute from './userRouter.js';
import postRouter from './postRouter.js';

const router = express.Router();

router.use('/auth', authRoute); //register_login
router.use('/users', userRoute);
router.use('/posts', postRouter);

export default router;
