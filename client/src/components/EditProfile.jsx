import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { MdClose } from 'react-icons/md';
import { Loading, Button, TextInput } from '../components';
import { UpdateProfile, UserLogin } from '../toolkit/slices/userSlice';
import fileUpload from '../utils/fileUpload';
import { apiRequest } from '../utils/httpReq';

const EditProfile = () => {
	const { user } = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const [errMsg, setErrMsg] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [picture, setPicture] = useState(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({ mode: 'onChange', defaultValues: { ...user } });

	const onSubmit = async (data) => {
		setIsSubmitting(true);

		try {
			const uri = picture && (await fileUpload(picture));
			const response = await apiRequest({
				url: '/users/update-user',
				data: {
					...data,
					profileUrl: uri ? uri : user?.profileUrl,
				},
				method: 'PUT',
				token: user?.token,
			});

			if (response?.status === 'FAILED') {
				setErrMsg(response);
				setIsSubmitting(false);
				return false;
			}

			const auth = { token: response?.token, ...response?.user };
			dispatch(UserLogin(auth));
			setTimeout(() => dispatch(UpdateProfile(false)), 3000);
			setIsSubmitting(false);
		} catch (error) {
			console.log(error);
			setIsSubmitting(false);
		}
	};

	const handleClose = () => dispatch(UpdateProfile(false));
	const handleSelect = (e) => setPicture(e.target.files[0]);

	return (
		<div className='fixed z-50 inset-0 overflow-y-auto'>
			<div className='flex items-center justify-center min-h-screen pb-20 text-center sm:block sm:p-0'>
				<div className='fixed inset-0 transition-opacity'>
					<div className='absolute inset-0 bg-[#000] opacity-70'>f</div>
				</div>
				<span className='sm:inline-block sm:align-middle sm:h-screen text-transparent'>
					#
				</span>
				<div
					className='inline-block align-bottom bg-primary rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full p-6'
					role='dialog'
					aria-modal='true'
					aria-labelledby='modal-headline'
				>
					<div className='flex justify-between px-6 pt-4 pb-2'>
						<label
							htmlFor='name'
							className='block font-medium text-xl text-ascent-1 text-left'
						>
							Edit Profile
						</label>

						<button className='text-ascent-1' onClick={handleClose}>
							<MdClose size={22} />
						</button>
					</div>
					<form
						className='pt-4 pb-6 sm:px-6 flex flex-col gap-3 2xl:gap-6'
						onSubmit={handleSubmit(onSubmit)}
					>
						<div className='flex gap-4 items-center'>
							<TextInput
								name='firstName'
								label='First Name'
								placeholder='First Name'
								type='text'
								styles='w-full capitalize'
								register={register('firstName', {
									required: 'First Name is required!',
								})}
								error={errors.firstName ? errors.firstName?.message : ''}
							/>

							<TextInput
								name='lastName'
								label='Last Name'
								placeholder='Last Name'
								type='text'
								styles='w-full capitalize'
								register={register('lastName', {
									required: 'Last Name do no match',
								})}
								error={errors.lastName ? errors.lastName?.message : ''}
							/>
						</div>
						<div className='flex gap-4 items-center'>
							<TextInput
								name='profession'
								label='Profession'
								placeholder='Profession'
								type='text'
								styles='w-full capitalize'
								register={register('profession', {
									required: 'Profession is required!',
								})}
								error={errors.profession ? errors.profession?.message : ''}
							/>

							<TextInput
								name='location'
								label='Location'
								placeholder='Location'
								type='text'
								styles='w-full capitalize'
								register={register('location', {
									required: 'Location do no match',
								})}
								error={errors.location ? errors.location?.message : ''}
							/>
						</div>
						<div className='flex gap-4 items-end'>
							<div className='flex flex-col mt-2 w-2/4'>
								<span className={`text-accent-light text-sm mb-3 `}>
									Profile picture
								</span>
								<label
									htmlFor='imageUpload'
									className='bg-secondary rounded border accent-border outline-none text-sm text-accent-light px-4 py-2 placeholder:text-[#666] cursor-pointer w-full'
								>
									<input
										type='file'
										className='hidden'
										id='imageUpload'
										data-max-size='5120'
										accept='.jpg, .png'
										onChange={(e) => handleSelect(e)}
									/>
									<span>{picture ? picture?.name : 'Upload image'}</span>
								</label>
							</div>
							<div className=''>
								{isSubmitting ? (
									<Loading />
								) : (
									<Button
										type='submit'
										style={`inline-flex items-center text-base inline-flex justify-center rounded-md bg-strokes-700 hover:bg-strokes-500 px-6 py-2.5 text-sm font-medium text-white outline-none`}
										title='Update profile'
									/>
								)}
							</div>
						</div>

						{errMsg?.message && (
							<span
								role='alert'
								className={`text-sm ${
									errMsg?.status === 'failed'
										? 'text-[#f64949fe]'
										: 'text-[#2ba150fe]'
								} mt-0.5`}
							>
								{errMsg?.message}
							</span>
						)}
					</form>
				</div>
			</div>
		</div>
	);
};

export default EditProfile;
