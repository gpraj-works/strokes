import { Outlet, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { HomePage, Login, Register, ResetPassword, Profile } from './pages';
import { useSelector } from 'react-redux';

const Layout = () => {
	const { user } = useSelector((state) => state.user);
	const location = useLocation();

	if (user?.token) {
		return <Outlet />;
	}

	return <Navigate to={'/login'} state={{ from: location }} replace />;
};

function App() {
	const { theme } = useSelector((state) => state.theme);

	return (
		<div data-theme={theme} className='w-full h-[100vh]'>
			<Routes>
				<Route element={<Layout />}>
					<Route path='/' element={<HomePage />} />
					<Route path='/profile/:id?' element={<Profile />} />
				</Route>
				<Route path='/register' element={<Register />} />
				<Route path='/login' element={<Login />} />
				<Route path='/reset-password' element={<ResetPassword />} />
			</Routes>
		</div>
	);
}

export default App;
