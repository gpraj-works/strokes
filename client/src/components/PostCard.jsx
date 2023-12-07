import propTypes from 'prop-types';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { NoProfile } from '../assets';
import moment from 'moment';
import { BsHeart, BsHeartFill, BsTrash3 } from 'react-icons/bs';
import { IoChatbubblesOutline } from 'react-icons/io5';
import { Button, Loading, TextInput } from '../components';
import { useForm } from 'react-hook-form';
import { postComments } from '../utils/TestData';

const ReplyCard = ({ reply, user, handleLike }) => {
	return (
		<div className='w-full py-3'>
			<div className='flex gap-3 items-center mb-1'>
				<Link to={'/profile/' + reply?.userId?._id}>
					<img
						src={reply?.userId?.profileUrl ?? NoProfile}
						alt={reply?.userId?.firstName}
						className='rounded-full w-10 h-10 mt-2 object-cover'
					/>
				</Link>
				<Link
					to={'/profile/' + reply?.userId?._id}
					className='flex flex-col justify-center'
				>
					<p className='text-accent-white capitalize text-sm font-medium truncate ... w-40'>
						{reply?.userId?.firstName} {reply?.userId?.lastName}
					</p>
					<span className='text-accent-light text-xs truncate ...'>
						{moment(reply?.userId?.createdAt).fromNow()}
					</span>
				</Link>
			</div>
			<div className='ml-12 my-2 text-accent-light'>
				{reply?.comment}

				<div className='mt-2 flex gap-2'>
					<button className='outline-none inline-flex items-center gap-2 text-sm'>
						{reply?.likes?.includes(user?._id) ? (
							<BsHeartFill className='text-strokes-700' />
						) : (
							<BsHeart />
						)}{' '}
						<span>{reply?.likes?.length} Likes</span>
					</button>
				</div>
			</div>
		</div>
	);
};

ReplyCard.propTypes = {
	reply: propTypes.object,
	user: propTypes.object,
	handleLike: propTypes.func,
};

const PostComments = ({ user, id, replyAt, getComments }) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const [errMsg, setErrMsg] = useState('');
	const [loading, setLoading] = useState(false);

	const onSubmit = (data) => {};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className='border-b accent-border flex items-center flex-col lg:flex-row'
		>
			<div className='w-full flex items-start justify-between p-4 text-accent-white gap-4'>
				{loading && <Loading />}
				{!loading && (
					<>
						<img
							src={user?.profileUrl ?? NoProfile}
							alt={user?.email}
							className='rounded-full w-10 h-10 mt-2 object-cover'
						/>
						<TextInput
							name='comment'
							placeholder={replyAt ? `Reply @${replyAt}` : 'Comment this post'}
							type='text'
							register={register('comment', {
								required: 'Your comment is empty',
							})}
							styles='w-full rounded-full'
							error={errors.comment ? errors.comment.message : ''}
						/>

						{errMsg?.message && (
							<span
								className={`text-sm ${
									errMsg?.status == 'failed' ? 'text-danger' : 'text-success'
								} mt-1`}
							>
								{errMsg?.message}
							</span>
						)}

						<Button
							title={'Post'}
							type='submit'
							style='bg-strokes-700 text-white px-4 py-1.5 mt-2 rounded-full'
						/>
					</>
				)}
			</div>
		</form>
	);
};

PostComments.propTypes = {
	user: propTypes.object,
	id: propTypes.string,
	getComments: propTypes.func,
	replyAt: propTypes.string,
};

const PostCard = ({ post, user, deletePost, likePost }) => {
	const [showAll, setShowAll] = useState(0);
	const [showReply, setShowReply] = useState(0);
	const [comments, setComments] = useState([]);
	const [loading, setLoading] = useState(false);
	const [replyComments, setReplyComments] = useState(0);
	const [showComments, setShowComments] = useState(0);

	const getComments = async () => {
		setReplyComments(0);

		setComments(postComments);
		setLoading(false);
	};

	const handleLike = async (uri) => {
		await likePost(uri);
		await getComments();
	};

	return (
		<div className='bg-primary p-5 rounded-xl'>
			<div className='flex gap-3 items-center justify-between mb-2'>
				<Link to={'/profile/' + post?.userId?._id} className='flex gap-4'>
					<img
						src={post?.userId?.profileUrl ?? NoProfile}
						alt={post?.userId?.email}
						className='rounded-full w-10 h-10 object-cover'
					/>
					<div className='flex flex-col justify-center'>
						<p className='text-accent-white font-medium capitalize'>
							{post?.userId?.firstName} {post?.userId?.lastName}
						</p>
						<span className='text-accent-light text-sm'>
							{post?.userId?.location}
						</span>
					</div>
				</Link>
				<span className='text-accent-light text-sm'>
					{moment(post?.createdAt).fromNow()}
				</span>
			</div>
			<div className='flex flex-col gap-3 mb-2'>
				<p className='text-accent-light'>
					{showAll === post?._id
						? post?.description
						: post?.description.slice(0, 300)}

					{post?.description?.length > 300 && showAll === post?._id ? (
						<button
							className='text-strokes-700 ml-2 outline-none'
							onClick={() => setShowAll(0)}
						>
							show less
						</button>
					) : (
						post?.description.length >= 300 && (
							<button
								className='text-strokes-700 ml-2 outline-none'
								onClick={() => setShowAll(post?._id)}
							>
								show more
							</button>
						)
					)}
				</p>

				{post?.image && (
					<img
						src={post?.image}
						alt='post image | strokes'
						className='object-cover rounded-xl'
					/>
				)}
			</div>
			<div className='w-full flex items-center justify-between pt-3 text-accent-white'>
				<button
					className='outline-none inline-flex items-center gap-2'
					onClick={() => handleLike('/posts/like/' + post?._id)}
				>
					{post?.likes?.includes(user?._id) ? (
						<BsHeartFill className='text-strokes-700' />
					) : (
						<BsHeart />
					)}{' '}
					<span>{post?.likes?.length} Likes</span>
				</button>

				<button
					className='outline-none inline-flex items-center gap-2'
					onClick={() => {
						setShowComments(showComments === post?._id ? null : post?._id);
						getComments(post?._id);
					}}
				>
					<IoChatbubblesOutline /> <span>{post?.likes?.length} Comments</span>
				</button>

				{user?._id === post?.userId?._id && (
					<button
						className='outline-none inline-flex items-center text-danger gap-2'
						onClick={() => deletePost(post?._id)}
					>
						<BsTrash3 /> <span> Delete</span>
					</button>
				)}
			</div>
			{showComments === post?._id && (
				<>
					<div className='w-full mt-4 border-t accent-border mb-2'>
						<PostComments
							user={user}
							id={post?._id}
							getComments={() => getComments(post?._id)}
						/>
					</div>
					{loading ? (
						<Loading />
					) : (
						comments.push.length > 0 &&
						comments?.map((comment) => (
							<div key={comment?._id} className='w-full py-2'>
								<div className='flex gap-4'>
									<Link to={'/profile/' + comment?.userId?._id}>
										<img
											src={comment?.userId?.profileUrl ?? NoProfile}
											alt='comments'
											className='rounded-full w-8 h-8 object-cover'
										/>
									</Link>

									<Link
										to={'/profile/' + comment?.userId?._id}
										className='flex flex-col justify-center'
									>
										<p className='text-accent-white text-sm font-medium truncate ... w-40'>
											{comment?.userId?.firstName} {comment?.userId?.lastName}
										</p>
										<span className='text-accent-light text-xs truncate ...'>
											{moment(comment?.userId?.createdAt).fromNow()}
										</span>
									</Link>
								</div>
								<div className='ml-12 my-2 text-accent-light'>
									{comment?.comment}

									<div className='mt-2 flex gap-2'>
										<button className='outline-none inline-flex items-center gap-2 text-sm'>
											{comment?.likes?.includes(user?._id) ? (
												<BsHeartFill className='text-strokes-700' />
											) : (
												<BsHeart />
											)}{' '}
											<span>{comment?.likes?.length} Likes</span>
										</button>
										<button
											onClick={() => setReplyComments(comment?._id)}
											className='outline-none inline-flex items-center gap-2 text-sm text-strokes-700'
										>
											Reply
										</button>
									</div>

									{replyComments === comment?._id && (
										<PostComments
											user={user}
											id={post?._id}
											replyAt={comment?.from}
											getComments={() => getComments(post?._id)}
										/>
									)}
								</div>
								<div className='py-2 px-8 mt-4'>
									{comment?.replies?.length > 0 && (
										<button
											className='text-base text-accent-white outline-none'
											onClick={() => {
												setShowReply(
													showReply === comment?.replies?._id
														? 0
														: comment?.replies?._id
												);
											}}
										>
											show replies({comment?.replies?.length})
										</button>
									)}

									{showReply === comment?.replies?._id &&
										comment?.replies?.map((reply) => (
											<ReplyCard
												reply={reply}
												user={user}
												key={reply?._id}
												handleLike={handleLike(
													`/post/like-comment/${comment?._id}/${reply?._id}`
												)}
											/>
										))}
								</div>
							</div>
						))
					)}
				</>
			)}
		</div>
	);
};

PostCard.propTypes = {
	post: propTypes.object,
	user: propTypes.object,
	deletePost: propTypes.func,
	likePost: propTypes.func,
};

export default PostCard;
