import Post from '../models/postModel.js';
import { StatusCodes } from 'http-status-codes';
import Users from '../models/userModel.js';
import Posts from '../models/postModel.js';

export const createPost = async (req, res) => {
	const { userId } = req.body.user;
	const { description, image } = req.body;

	try {
		const post = await Post.create({ userId, description, image });
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

		const postResponse = null;

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
