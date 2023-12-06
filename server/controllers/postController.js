import { StatusCodes } from 'http-status-codes';
import Users from '../models/userModel.js';
import Posts from '../models/postModel.js';
import Comments from '../models/commentModel.js';

export const createPost = async (req, res) => {
	const { userId } = req.body.user;
	const { description, image } = req.body;

	try {
		const post = await Posts.create({ userId, description, image });
		return res.status(StatusCodes.CREATED).json({
			status: true,
			message: 'Post created successfully',
			data: post,
		});
	} catch (error) {
		console.log(error);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			status: 'FAILED',
			message: 'Something went wrong!',
		});
	}
};

export const getAllPosts = async (req, res) => {
	const { userId } = req.body.user;
	const { search } = req.body;

	try {
		const user = await Users.findById(userId);
		const friends = user?.friends.toString().split(',') ?? [];
		if (!friends.includes(userId)) {
			friends.push(userId);
		}

		const query = { $or: [{ description: { $regex: search, $options: 'i' } }] };

		const posts = await Posts.find(search ? query : {}).populate({
			path: 'userId',
			select: 'firstName lastName location profileUrl -password',
        }).sort({ _id: -1 }); //prettier-ignore

		const friendsPosts = posts?.filter((post) => {
			return friends.includes(post?.userId?._id.toString());
		});

		const otherPosts = posts?.filter(
			(post) => !friends.includes(post?.userId?._id.toString())
		);

		let postResponse = null;

		if (friendsPosts?.length > 0) {
			postResponse = search ? friendsPosts : [...friendsPosts, ...otherPosts];
		} else {
			postResponse = posts;
		}

		return res.status(StatusCodes.OK).json({
			status: true,
			data: postResponse,
		});
	} catch (error) {
		console.log(error);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			status: 'FAILED',
			message: 'Something went wrong!',
		});
	}
};

export const postById = async (req, res) => {
	const { id } = req.params;

	try {
		const post = await Posts.findById(id).populate({
			path: 'userId',
			select: 'firstName lastName location profileUrl -password',
		});
		return res.status(StatusCodes.OK).json({
			status: true,
			data: post,
		});
	} catch (error) {
		console.log(error);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			status: 'FAILED',
			message: 'Something went wrong!',
		});
	}
};

export const getUserPost = async (req, res) => {
	const { id } = req.params;

	try {
		const post = await Posts.find({ userId: id }).populate({
			path: 'userId',
			select: 'firstName lastName location profileUrl -password',
		}).sort({ _id: -1 }); //prettier-ignore
		return res.status(StatusCodes.OK).json({
			status: true,
			data: post,
		});
	} catch (error) {
		console.log(error);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			status: 'FAILED',
			message: 'Something went wrong!',
		});
	}
};

export const getComments = async (req, res) => {
	const { postId } = req.params;

	try {
		const comments = await Comments.find({ postId })
			.populate({
				path: 'userId',
				select: 'firstName lastName location profileUrl -password',
			})
			.populate({
				path: 'replies.userId',
				select: 'firstName lastName location profileUrl -password',
			})
			.sort({ _id: -1 });

		return res.status(StatusCodes.OK).json({
			status: true,
			data: comments,
		});
	} catch (error) {
		console.log(error);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			status: 'FAILED',
			message: 'Something went wrong!',
		});
	}
};

export const likePost = async (req, res) => {
	const { userId } = req.body.user;
	const { id } = req.params;

	try {
		const post = await Posts.findById(id);
		const index = post?.likes.findIndex((pid) => pid === String(userId));

		if (index === -1) {
			post.likes.push(userId);
		} else {
			post.likes = post.likes.filter((pid) => pid !== String(userId));
		}

		const newPost = await Posts.findByIdAndUpdate(id, post, { new: true });

		return res.status(StatusCodes.OK).json({
			status: true,
			data: newPost,
		});
	} catch (error) {
		console.log(error);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			status: 'FAILED',
			message: 'Something went wrong!',
		});
	}
};

export const likePostComment = async (req, res) => {
	const { userId } = req.body.user;
	const { id, rid } = req.params;

	try {
		if (rid === undefined || rid === null || rid === 'false') {
			const comment = await Comments.findById(id);
			const index = comment?.likes.findIndex((id) => id === String(userId));

			if (index === -1) {
				comment.likes.push(userId);
			} else {
				comment.likes = comment?.likes.filter((id) => id !== String(userId));
			}

			const updated = await Comments.findOneAndUpdate({ _id: id }, comment, {
				new: true,
			});

			return res.status(StatusCodes.OK).json({
				status: true,
				data: updated,
			});
		} else {
			const replyComments = await Comments.findOne(
				{ _id: id },
				{
					replies: {
						$elemMatch: {
							_id: rid,
						},
					},
				}
			);

			const index = replyComments?.replies[0]?.likes.findIndex(
				(id) => id === String(userId)
			);

			if (index === -1) {
				replyComments.replies[0].likes.push(userId);
			} else {
				replyComments.replies[0].likes = replyComments.replies[0]?.likes.filter(
					(id) => id !== String(userId)
				);
			}

			const query = { _id: id, 'replies._id': rid };

			const updated = {
				$set: {
					'replies.$.likes': replyComments.replies[0].likes,
				},
			};

			const result = await Comments.updateOne(query, updated, { new: true });

			return res.status(StatusCodes.OK).json({
				status: true,
				data: result,
			});
		}
	} catch (error) {
		console.log(error);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			status: 'FAILED',
			message: 'Something went wrong!',
		});
	}
};

export const postComment = async (req, res) => {
	const { comment, from } = req.body;
	const { userId } = req.body.user;
	const { id } = req.params;

	try {
		const newComment = new Comments({ comment, from, userId, postId: id });
		await newComment.save();

		const post = await Posts.findById(id);
		post.comments.push(newComment._id);

		const updatedPost = await Posts.findByIdAndUpdate(id, post, {
			new: true,
		});
		return res.status(StatusCodes.OK).json({
			status: true,
			data: updatedPost,
		});
	} catch (error) {
		console.log(error);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			status: 'FAILED',
			message: 'Something went wrong!',
		});
	}
};

export const replyPostComment = async (req, res) => {
	const { userId } = req.body.user;
	const { comment, replyAt, from } = req.body;
	const { id } = req.params;

	try {
		const commentInfo = await Comments.findById(id);

		commentInfo.replies.push({
			comment,
			replyAt,
			from,
			userId,
			created_At: Date.now(),
		});

		commentInfo.save();

		return res.status(StatusCodes.OK).json({
			status: true,
			data: commentInfo,
		});
	} catch (error) {
		console.log(error);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			status: 'FAILED',
			message: 'Something went wrong!',
		});
	}
};

export const deletePost = async (req, res) => {
	const { id } = req.params;

	try {
		await Posts.findByIdAndDelete(id);
		return res.status(StatusCodes.OK).json({
			status: true,
			message: 'Post deleted successfully',
		});
	} catch (error) {
		console.log(error);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			status: 'FAILED',
			message: 'Something went wrong!',
		});
	}
};
