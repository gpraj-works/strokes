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
import { createPost, getAllPosts, postById } from './postController.js';
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
export { createPost, getAllPosts, postById };

// auth-controller
export { register, login };
