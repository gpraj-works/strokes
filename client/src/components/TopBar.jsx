import { useDispatch, useSelector } from 'react-redux';
import { Button, Logo } from '../components';
import { useForm } from 'react-hook-form';
import { TextInput } from '../components';
import { IoSearch } from 'react-icons/io5';
import { BsMoonStars, BsSun, BsBell } from 'react-icons/bs';
import { SetTheme } from '../toolkit/slices/themeSlice';

const TopBar = () => {
	const { theme } = useSelector((state) => state.theme);
	const { user } = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const { register, handleSubmit } = useForm();

	const onSearch = async () => {};

	const changeTheme = () => {
		dispatch(SetTheme(theme === 'dark' ? 'light' : 'dark'));
	};

	return (
		<div className='topbar w-full flex items-center justify-between py-2 px-6 bg-primary rounded-xl mt-2'>
			<div className='w-4/6 flex gap-1 items-center'>
				<Logo className='w-10' />
				<span className='text-3xl text-strokes-700 font-semibold'>Strokes</span>
			</div>
			<form
				className='flex items-center justify-center mx-2 w-full'
				encType='multipart/form-data'
				onSubmit={handleSubmit(onSearch)}
			>
				<TextInput
					name='search'
					placeholder='Search...'
					register={register('email', {
						required: 'Email address is required',
					})}
					styles='w-full rounded-l-full mb-2 border-r-0'
				/>
				<Button
					title={<IoSearch size={16} />}
					type='submit'
					style='inline-flex justify-center rounded-r-full bg-strokes-700 hover:bg-strokes-500 p-2.5 text-sm font-medium text-white border border-l-0 border-strokes-500 outline-none'
				/>
			</form>
			<div className='flex gap-3 items-center justify-end w-4/6'>
				<Button
					title={
						theme === 'dark' ? <BsSun size={16} /> : <BsMoonStars size={16} />
					}
					onClick={changeTheme}
					style='inline-flex justify-center rounded-full bg-strokes-700 hover:bg-strokes-500 p-3 text-sm font-medium text-white outline-none'
				/>
				<Button
					title={<BsBell size={16} />}
					style='inline-flex justify-center rounded-full bg-strokes-700 hover:bg-strokes-500 p-3 text-sm font-medium text-white outline-none'
				/>
			</div>
		</div>
	);
};

export default TopBar;
