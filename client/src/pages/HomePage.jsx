import { useSelector } from 'react-redux';
import { TopBar } from '../components';

const HomePage = () => {
	const { user } = useSelector((state) => state.user);
	return (
		<div className='home w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-dark h-screen overflow-hidden'>
			<TopBar />
		</div>
	);
};

export default HomePage;
