import propTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { NoProfile } from '../assets';

const FriendsCard = ({ friends }) => {
	return (
		<div className='w-full bg-primary flex flex-col items-center shadow-sm rounded-xl px-6 py-4'>
			<div className='w-full flex items-center justify-between border-b accent-border pb-2 text-accent-white'>
				<span>Friends</span>
				<span>{friends?.length}</span>
			</div>
			<div className='w-full flex flex-col gap-4 pt-4'>
				{friends?.map((friend) => (
					<div key={friend?._id}>
						<Link to={'/profile/' + friend?._id} className='flex gap-3'>
							<img
								src={friend?.profileUrl ?? NoProfile}
								alt={friend?.email}
								className='rounded-full w-10 h-10 object-cover'
							/>
							<div className='flex flex-col justify-center'>
								<p className='text-accent-white font-medium capitalize'>
									{friend?.firstName} {friend?.lastName}
								</p>
								<span className='text-accent-light text-sm'>
									{friend?.profession ?? 'No Profession'}
								</span>
							</div>
						</Link>
					</div>
				))}
			</div>
		</div>
	);
};

FriendsCard.propTypes = { friends: propTypes.array };

export default FriendsCard;
