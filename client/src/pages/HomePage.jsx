import { useSelector } from 'react-redux';
import { TopBar, ProfileCard, FriendsCard } from '../components';

const HomePage = () => {
	const { user } = useSelector((state) => state.user);
	return (
		<div className='home w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-dark h-screen overflow-hidden'>
			<TopBar />
			<div className='w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full'>
				<div className='hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-3 overflow-y-auto'>
					<ProfileCard user={user} />
					<FriendsCard friends={user?.friends} />
				</div>
			</div>
		</div>
	);
};

export default HomePage;
