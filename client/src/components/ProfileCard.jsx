import propTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { NoProfile } from '../assets';
import { BiSolidEdit, BiPlusCircle } from 'react-icons/bi';
import {
	BsBriefcase,
	BsFacebook,
	BsInstagram,
	BsTwitterX,
} from 'react-icons/bs';
import { SlLocationPin } from 'react-icons/sl';
import Button from './Button';
import { UpdateProfile } from '../toolkit/slices/userSlice';
import moment from 'moment';

const ProfileCard = ({ user }) => {
	const { user: data, edit } = useSelector((state) => state.user);
	const dispatch = useDispatch();
	return (
		<div className='w-full bg-primary flex flex-col items-center shadow-sm rounded-xl px-6 py-4'>
			<div className='w-full flex items-center justify-between border-b accent-border pb-4'>
				<Link to={'/profile/' + user?._id} className='flex gap-3'>
					<img
						src={user?.profileUrl ?? NoProfile}
						alt={user?.email}
						className='rounded-full w-10 h-10 object-cover'
					/>
					<div className='flex flex-col justify-center'>
						<p className='text-accent-white font-medium capitalize'>
							{user?.firstName} {user?.lastName}
						</p>
						<span className='text-accent-light text-sm'>
							{user?.profession ?? 'No Profession'}
						</span>
					</div>
				</Link>
				<div className='inline-flex items-center'>
					{user?._id === data?._id ? (
						<Button
							title={<BiSolidEdit size={20} />}
							style='text-strokes-700'
							onClick={() => dispatch(UpdateProfile(true))}
						/>
					) : (
						<Button
							title={<BiPlusCircle size={20} />}
							style='text-strokes-700'
							onClick={() => {}}
						/>
					)}
				</div>
			</div>
			<div className='w-full flex flex-col justify-between gap-2 border-b accent-border py-4'>
				<button className='inline-flex gap-2 items-center'>
					<SlLocationPin className='text-accent-light text-lg font-bold' />
					<span className='text-accent-light'>
						{user?.location ?? 'Add location'}
					</span>
				</button>
				<button className='inline-flex gap-2 items-center'>
					<BsBriefcase className='text-accent-light text-lg' />
					<span className='text-accent-light'>
						{user?.profession ?? 'Add profession'}
					</span>
				</button>
			</div>
			<div className='w-full flex flex-col justify-between gap-2 border-b accent-border py-4'>
				<p className='text-lg text-accent-white font-semibold'>
					{user?.friends?.length} Friends
				</p>
				<div className='inline-flex items-center justify-between'>
					<span className='text-accent-light'>Who viewed your profile</span>
					<span className='text-accent-white text-lg'>
						{user?.views?.length}
					</span>
				</div>
				<span className='text-base text-strokes-700'>
					{user?.verified ? 'Verified account' : 'Not verified'}
				</span>
				<span className='text-sm text-accent-light'>
					Joined{' '}
					<span className='text-accent-white'>
						{moment(user?.createdAt).fromNow()}
					</span>
				</span>
			</div>
			<div className='w-full flex flex-col justify-between gap-2 pt-4'>
				<p className='text-lg text-accent-white font-semibold'>
					Connected accounts
				</p>
				<div className='inline-flex gap-2 items-center'>
					<BsInstagram className='text-accent-light' />
					<span className='text-accent-light'>Instagram</span>
				</div>
				<button className='inline-flex gap-2 items-center'>
					<BsFacebook className='text-accent-light' />
					<span className='text-accent-light'>Facebook</span>
				</button>
				<button className='inline-flex gap-2 items-center'>
					<BsTwitterX className='text-accent-light' />
					<span className='text-accent-light'>Twitter</span>
				</button>
			</div>
		</div>
	);
};

ProfileCard.propTypes = { user: propTypes.object };

export default ProfileCard;
