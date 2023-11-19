import propTypes from 'prop-types';

const PostCard = ({ post, user, deletePost, likePost }) => {
	return <div>PostCard</div>;
};

PostCard.propTypes = {
	post: propTypes.object,
	user: propTypes.object,
	deletePost: propTypes.object,
	likePost: propTypes.object,
};

export default PostCard;
