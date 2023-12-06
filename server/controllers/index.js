import {
	verifyEmail,
	requestPasswordReset,
	resetPassword,
	changePassword,
	userById,
	updateUser,
	friendRequest,
	getFriendRequest,
	acceptRequest,
	profileViews,
	suggestedFriends,
} from './userController.js';
import {
	createPost,
	getAllPosts,
	postById,
	getUserPost,
	getComments,
	likePost,
	likePostComment,
	postComment,
	replyPostComment,
	deletePost,
} from './postController.js';
import { register, login } from './authController.js';

// user-controller
export {
	requestPasswordReset,
	verifyEmail,
	resetPassword,
	changePassword,
	userById,
	updateUser,
	friendRequest,
	getFriendRequest,
	acceptRequest,
	profileViews,
	suggestedFriends,
};

// post-controller
export {
	createPost,
	getAllPosts,
	postById,
	getUserPost,
	getComments,
	likePost,
	likePostComment,
	postComment,
	replyPostComment,
	deletePost,
};

// auth-controller
export { register, login };
