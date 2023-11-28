import { useState } from 'react';
import { Logo, TextInput, Button, Loading } from '../components';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { LoginBg } from '../assets';
import { AiOutlineInteraction } from 'react-icons/ai';
import { BsShare } from 'react-icons/bs';
import { ImConnection } from 'react-icons/im';

const Login = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({ mode: 'onChange' });

	const [errMsg, setErrMsg] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const dispatch = useDispatch();

	const onSubmit = async (data) => {
		console.log(data);
	};

	return (
		<div className='w-full h-[100vh] flex items-center justify-center px-6 py-10 bg-dark'>
			<div className='w-full md:w-2/3 h-fit lg:h-full 2xl:h-5/6 py-8 lg:py-0 flex bg-primary rounded-xl overflow-hidden shadow-xl'>
				{/* LEFT_SEC */}
				<div className='w-full lg:w-1/2 h-full p-10 2xl:px-20 flex flex-col justify-center'>
					<div className='w-full flex gap-1 items-center mb-6'>
						<Logo className='w-14' />
						<span className='text-4xl text-strokes-700 font-semibold'>
							Strokes
						</span>
					</div>
					<div className='inline-flex flex-col gap-3'>
						<p className='text-accent-white text-lg font-base'>
							Login to your account
						</p>
						<p className='text-accent-light'>Welcome back!</p>
					</div>
					<form
						className='py-8 flex flex-col gap-5'
						encType='multipart/form-data'
						onSubmit={handleSubmit(onSubmit)}
					>
						<TextInput
							name='email'
							placeholder='email@example.com'
							type='email'
							label='Email Address'
							register={register('email', {
								required: 'Email address is required',
							})}
							styles='w-full rounded-full'
							labelStyle='ml-1'
							error={errors.email ? errors.email.message : ''}
						/>
						<TextInput
							name='password'
							placeholder='Example@123'
							type='password'
							label='Password'
							register={register('password', {
								required: 'Password is required',
							})}
							styles='w-full rounded-full'
							labelStyle='ml-1'
							error={errors.password ? errors.password.message : ''}
						/>
						<Link
							to='/register'
							className='text-strokes-700 text-sm text-end mr-1'
						>
							Forgot password?
						</Link>

						{errMsg?.message && (
							<span
								className={`text-sm ${
									errMsg?.status == 'failed' ? 'text-danger' : 'text-success'
								} mt-1`}
							>
								{errMsg?.message}
							</span>
						)}

						{isSubmitting ? (
							<Loading />
						) : (
							<Button
								type='submit'
								title='Login'
								style='inline-flex justify-center rounded-md bg-strokes-700 hover:bg-strokes-500 px-8 py-3 text-sm font-medium text-white outline-none'
							/>
						)}
					</form>

					<p className='text-accent-light text-sm text-center'>
						Don&apos;t have an account?
						<Link
							to='/register'
							className='text-strokes-700 text-sm ml-2 cursor-pointer'
						>
							Create Account
						</Link>
					</p>
				</div>
				{/* RIGHT_SEC */}
				<div className='hidden w-1/2 h-full lg:flex flex-col items-center justify-center relative'>
					<div className='bg-pattern absolute left-0 right-0 top-0 bottom-0 z-0'></div>
					<div className='relative w-full flex items-center justify-center'>
						<img
							src={LoginBg}
							alt='strokes | Login page'
							className='w-48 2xl:w-64 h-48 2xl:h-64 rounded-full object-cover'
						/>
						<div className='absolute flex items-center gap-1 bg-white right-10 top-10 py-2 px-5 rounded-full'>
							<BsShare size={14} />
							<span className='text-xs font-medium'>Share</span>
						</div>

						<div className='absolute flex items-center gap-1 bg-white left-10 top-6 py-2 px-5 rounded-full'>
							<ImConnection />
							<span className='text-xs font-medium'>Connect</span>
						</div>
						<div className='absolute flex items-center gap-1 bg-white left-12 bottom-6 py-2 px-5 rounded-full'>
							<AiOutlineInteraction />
							<span className='text-xs font-medium'>Interact</span>
						</div>
					</div>
					<div className='relative z-2 flex flex-col items-center gap-6 mt-10'>
						<div className='text-center'>
							<p className='text-white text-base'>
								Connect with friends & have share for fun
							</p>
							<span className='text-sm text-white/80'>
								Share memories with friends and the world.
							</span>
						</div>
						<Button
							title='Invite people'
							style='inline-flex justify-center rounded-md hover:bg-white hover:text-black border px-8 py-3 text-sm font-medium text-white outline-none'
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
