import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { BiCheck, BiImageAdd, BiSolidUserPlus, BiX } from 'react-icons/bi';
import { BsFiletypeGif } from 'react-icons/bs';
import { RiPlayCircleLine } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { NoProfile } from '../assets';
import { Button,	FriendsCard, ProfileCard, TextInput, TopBar, Loading, PostCard, EditProfile } from '../components'; //prettier-ignore
import { friends, suggest } from '../utils/TestData';
import fileUpload from '../utils/fileUpload.js';
import { apiRequest, fetchPosts, likePost } from '../utils/httpReq.js';

const HomePage = () => {
	const { user, edit } = useSelector((state) => state.user);
	const { posts } = useSelector((state) => state.posts);
	const [friendRequest, setFriendRequest] = useState(friends);
	const [suggestedFriends, setSuggestedFriends] = useState(suggest);
	const dispatch = useDispatch();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm();

	const [errMsg, setErrMsg] = useState('');
	const [file, setFile] = useState(null);
	const [posting, setPosting] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleUploadPost = async (data) => {
		setPosting(false);

		try {
			const uri = file && (await fileUpload(file));
			const newData = uri ? { ...data, image: uri } : data;

			const response = await apiRequest({
				url: '/posts/create-post',
				data: newData,
				token: user?.token,
				method: 'POST',
			});

			if (response?.status === 'FAILED') {
				setErrMsg(response);
				setPosting(false);
				return false;
			}

			reset({ description: '' });
			setFile(null);
			setErrMsg('');
			await fetchPost();
			setPosting(false);
		} catch (error) {
			console.log(error);
			setPosting(false);
		}
	};

	const fetchPost = async () => {
		await fetchPosts(user?.token, dispatch);
		setLoading(false);
	};

	const handleLikePost = async (uri) => {
		await likePost({ uri, token: user?.token });
		await fetchPost();
	};

	const handleDelete = async () => {};
	const fetchFriendRequests = async () => {};
	const fetchSuggestedFriends = async () => {};
	const handleFriendRequest = async () => {};
	const acceptFriendRequest = async () => {};
	const getUser = async () => {};

	useEffect(() => {
		setLoading(false);
		getUser();
		fetchPost();
		fetchFriendRequests();
		fetchSuggestedFriends();
	}, []);

	return (
		<>
			<div className='home w-full px-0 lg:px-10 pb-12 2xl:px-40 bg-dark h-screen overflow-hidden'>
				<TopBar />
				<div className='w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full'>
					<div className='hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-3 overflow-y-auto'>
						<ProfileCard user={user} />
						<FriendsCard friends={user?.friends} />
					</div>
					<div className='flex-1 h-full px-4 flex flex-col gap-4 overflow-y-auto'>
						<form
							onSubmit={handleSubmit(handleUploadPost)}
							className='bg-primary px-4 rounded-xl'
						>
							<div className='w-full flex items-center justify-between border-b accent-border p-4 text-accent-white gap-4'>
								<img
									src={user?.profileUrl ?? NoProfile}
									alt={user?.email}
									className='rounded-full w-10 h-10 mt-2 object-cover'
								/>
								<TextInput
									name='description'
									placeholder='Say something...'
									type='text'
									register={register('description', {
										required: 'Write something about post',
									})}
									styles='w-full rounded-full'
									error={errors.description ? errors.description.message : ''}
								/>
							</div>
							{errMsg?.message && (
								<span
									className={`text-sm ${
										errMsg?.status == 'failed' ? 'text-danger' : 'text-success'
									} mt-1`}
								>
									{errMsg?.message}
								</span>
							)}

							<div className='p-4 flex items-center justify-between'>
								<label
									htmlFor='postImage'
									className='flex items-center text-accent-light gap-1 cursor-pointer'
								>
									<input
										type='file'
										className='hidden'
										id='postImage'
										data-max-size='5120'
										accept='.jpg, .png, .jpeg'
										onChange={(e) => setFile(e.target.files[0])}
									/>
									<BiImageAdd />
									<span>Image</span>
								</label>
								<label
									htmlFor='postVideo'
									className='flex items-center text-accent-light gap-1 cursor-pointer'
								>
									<input
										type='file'
										className='hidden'
										id='postVideo'
										data-max-size='5120'
										accept='.mp4, .webp'
										onChange={(e) => setFile(e.target.files[0])}
									/>
									<RiPlayCircleLine />
									<span>Video</span>
								</label>
								<label
									htmlFor='postGif'
									className='flex items-center text-accent-light gap-1 cursor-pointer'
								>
									<input
										type='file'
										className='hidden'
										id='postGif'
										data-max-size='5120'
										accept='.gif'
										onChange={(e) => setFile(e.target.files[0])}
									/>
									<BsFiletypeGif />
									<span>GIF</span>
								</label>

								<Button
									type='submit'
									title='Post it'
									style='inline-flex justify-center rounded-full bg-strokes-700 hover:bg-strokes-500 px-6 py-2 text-sm font-medium text-white outline-none'
								/>
							</div>
						</form>
						{loading ? (
							<Loading />
						) : posts?.length ? (
							posts?.map((post) => (
								<PostCard
									key={post?._id}
									post={post}
									user={user}
									deletePost={() => {}}
									likePost={handleLikePost}
								/>
							))
						) : (
							<div className='flex w-full h-full items-center justify-center'>
								<p className='text-lg text-accent-light'>No Post Available</p>
							</div>
						)}
					</div>
					<div className='hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-3 overflow-y-auto'>
						<div className='w-full bg-primary flex flex-col items-center shadow-sm rounded-xl px-6 py-4'>
							<div className='w-full flex items-center justify-between border-b accent-border pb-2 text-accent-white'>
								<span>Friend requests</span>
								<span>{friendRequest?.length}</span>
							</div>
							<div className='w-full flex flex-col gap-4 pt-4'>
								{friendRequest?.map((friend) => (
									<div
										key={friend?._id}
										className='flex items-center justify-between'
									>
										<Link to={'/profile/' + friend?._id} className='flex gap-4'>
											<img
												src={friend?.profileUrl ?? NoProfile}
												alt={friend?.email}
												className='rounded-full w-10 h-10 object-cover'
											/>
											<div className='flex flex-col justify-center'>
												<p className='text-accent-white font-medium truncate ... w-40'>
													{friend?.firstName} {friend?.lastName}
												</p>
												<span className='text-accent-light text-sm truncate ...'>
													{friend?.profession ?? 'No Profession'}
												</span>
											</div>
										</Link>

										<div className='inline-flex gap-2'>
											<Button
												title={<BiX size={20} />}
												style='border border-accent-light text-accent-light rounded-full p-0.5'
											/>
											<Button
												title={<BiCheck size={20} />}
												style='border border-strokes-700 text-strokes-700 rounded-full p-0.5'
											/>
										</div>
									</div>
								))}
							</div>
						</div>
						<div className='w-full bg-primary flex flex-col items-center shadow-sm rounded-xl px-6 py-4'>
							<div className='w-full flex items-center justify-between border-b accent-border pb-2 text-accent-white'>
								<span>Friend suggestions</span>
							</div>
							<div className='w-full flex flex-col gap-4 pt-4'>
								{suggestedFriends?.map((friend) => (
									<div
										key={friend?._id}
										className='flex items-center justify-between'
									>
										<Link to={'/profile/' + friend?._id} className='flex gap-4'>
											<img
												src={friend?.profileUrl ?? NoProfile}
												alt={friend?.email}
												className='rounded-full w-10 h-10 object-cover'
											/>
											<div className='flex flex-col justify-center'>
												<p className='text-accent-white font-medium truncate ... w-40'>
													{friend?.firstName} {friend?.lastName}
												</p>
												<span className='text-accent-light text-sm truncate ...'>
													{friend?.profession ?? 'No Profession'}
												</span>
											</div>
										</Link>

										<Button
											title={<BiSolidUserPlus size={23} />}
											style='text-accent-light'
										/>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
			{edit && <EditProfile />}
		</>
	);
};

export default HomePage;
