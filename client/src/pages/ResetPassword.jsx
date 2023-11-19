import { useState } from 'react';
import { TextInput, Button, Loading } from '../components';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

const ResetPassword = () => {
	const {
		register,
		handleSubmit,
		getValues,
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
			<div className='w-full md:w-2/6 h-fit lg:h-auto 2xl:h-5/6 py-8 lg:py-0 flex bg-primary rounded-xl overflow-hidden shadow-xl'>
				<div className='w-full lg:w-5/6 h-full py-10 2xl:px-20 flex flex-col justify-center mx-auto'>
					<div className='inline-flex flex-col gap-2'>
						<p className='text-accent-white text-lg font-base'>
							Enter your email
						</p>
						<span className='text-accent-light text-xs'>
							Enter your registered email address
						</span>
					</div>
					<form
						className='py-5 flex flex-col gap-5'
						encType='multipart/form-data'
						onSubmit={handleSubmit(onSubmit)}
					>
						<TextInput
							name='email'
							placeholder='email@example.com'
							type='email'
							register={register('email', {
								required: 'Email address is required',
							})}
							styles='w-full'
							labelStyle='ml-1'
							error={errors.email ? errors.email.message : ''}
						/>

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
								title='Reset password'
								style='inline-flex justify-center rounded-md bg-strokes-700 hover:bg-strokes-500 px-8 py-3 text-sm font-medium text-white outline-none'
							/>
						)}
					</form>
				</div>
			</div>
		</div>
	);
};

export default ResetPassword;
