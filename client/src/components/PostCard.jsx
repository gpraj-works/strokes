import propTypes from 'prop-types';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { NoProfile } from '../assets';
import moment from 'moment';
import { BsHeart, BsHeartFill } from 'react-icons/bs';
import { IoChatbubblesOutline } from 'react-icons/io5';

const PostCard = ({ post, user, deletePost, likePost }) => {
	const [showAll, setShowAll] = useState(0);
	const [showReply, setShowReply] = useState(0);
	const [comments, setComments] = useState([]);
	const [loading, setLoading] = useState(false);
	const [replyComments, setReplyComments] = useState(0);
	const [showComments, setShowComments] = useState(0);

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
						<p className='text-accent-white font-medium'>
							{post?.userId?.firstName} {post?.userId?.lastName}
						</p>
						<span className='text-accent-light text-sm'>
							{post?.userId?.location}
						</span>
					</div>
				</Link>
				<span className='text-accent-light text-sm'>
					{moment(post?.userId?.createdAt).fromNow()}
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
				<button className='outline-none inline-flex items-center gap-2'>
					{post?.likes?.includes(user?._id) ? (
						<BsHeartFill className='text-strokes-700' />
					) : (
						<BsHeart />
					)}{' '}
					<span>{post?.likes?.length} Likes</span>
				</button>
				<button className='outline-none inline-flex items-center gap-2'>
					<IoChatbubblesOutline /> <span>{post?.likes?.length} Comments</span>
				</button>
			</div>
		</div>
	);
};

PostCard.propTypes = {
	post: propTypes.object,
	user: propTypes.object,
	deletePost: propTypes.object,
	likePost: propTypes.object,
};

export default PostCard;
