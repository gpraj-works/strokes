import express from 'express';
import {
	authUser,
	validateCreatePost,
	validatePostComment,
} from '../middlewares/index.js';
import {
	createPost,
	getAllPosts,
	getUserPost,
	postById,
	getComments,
	likePost,
	likePostComment,
	postComment,
	replyPostComment,
	deletePost,
} from '../controllers/index.js';

const router = express.Router();

// user-posts
router.post('/create-post', authUser, validateCreatePost, createPost);
router.post('/get-user-post/:id', authUser, getUserPost);

// posts
router.post('/', authUser, getAllPosts);
router.get('/:id', authUser, postById);
router.delete('/:id', authUser, deletePost);

// comments
router.post('/comments/:postId', getComments);
router.post('/comment/:id', authUser, validatePostComment, postComment);
router.post(
	'/reply-comment/:id',
	authUser,
	validatePostComment,
	replyPostComment
);

// likes
router.post('/like/:id', authUser, likePost);
router.post('/like-comment/:id/:rid?', authUser, likePostComment);

export default router;
