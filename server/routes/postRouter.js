import express from 'express';
import { authUser, validateCreatePost } from '../middlewares/index.js';
import { createPost, getAllPosts, postById } from '../controllers/index.js';

const router = express.Router();

// user-posts
router.post('/create-post', authUser, validateCreatePost, createPost);
router.post('/get-user-post/:id', authUser);

// posts
router.post('/', authUser, getAllPosts);
router.get('/:id', authUser, postById);

export default router;
