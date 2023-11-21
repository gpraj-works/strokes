import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { MdClose } from 'react-icons/md';
import { Loading, Button, TextInput } from '../components';
import { UpdateProfile } from '../toolkit/slices/userSlice';

const EditProfile = () => {
	const { user } = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const [errMsg, setErrMsg] = useState('');
	const [isSubmitting, setSubmitting] = useState(false);
	const [picture, setPicture] = useState(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({ mode: 'onChange', defaultValues: { ...user } });

	const onSubmit = async () => {};

	const handleClose = () => {
		dispatch(UpdateProfile(false));
	};

	const handleSelect = (e) => {
		setPicture(e.target.files[0]);
	};

	return (
		<div className='fixed z-50 inset-0 overflow-y-auto'>
			<div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
				<div className='fixed inset-0 transition-opacity'>
					<div className='absolute inset-0 bg-[#000] opacity-70'>f</div>
				</div>
				<span className='hidden sm:inline-block sm:align-middle sm:h-screen'>
					#
				</span>
				<div
					className='inline-block align-bottom bg-primary rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'
					role='dialog'
					aria-modal='true'
					aria-labelledby='modal-headline'
				>
					<div className='flex justify-between px-6 pt-5 pb-2'>
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
						className='px-4 sm:px-6 flex flex-col gap-3 2xl:gap-6'
						onSubmit={handleSubmit(onSubmit)}
					>
						<TextInput
							name='firstName'
							label='First Name'
							placeholder='First Name'
							type='text'
							styles='w-full'
							register={register('firstName', {
								required: 'First Name is required!',
							})}
							error={errors.firstName ? errors.firstName?.message : ''}
						/>

						<TextInput
							label='Last Name'
							placeholder='Last Name'
							type='lastName'
							styles='w-full'
							register={register('lastName', {
								required: 'Last Name do no match',
							})}
							error={errors.lastName ? errors.lastName?.message : ''}
						/>

						<TextInput
							name='profession'
							label='Profession'
							placeholder='Profession'
							type='text'
							styles='w-full'
							register={register('profession', {
								required: 'Profession is required!',
							})}
							error={errors.profession ? errors.profession?.message : ''}
						/>

						<TextInput
							label='Location'
							placeholder='Location'
							type='text'
							styles='w-full'
							register={register('location', {
								required: 'Location do no match',
							})}
							error={errors.location ? errors.location?.message : ''}
						/>

						<div className='flex flex-col mt-2'>
							<span className={`text-accent-light text-sm mb-3 `}>
								Profile picture
							</span>
							<label
								htmlFor='imageUpload'
								className='bg-secondary rounded border accent-border outline-none text-sm text-accent-light px-4 py-2 placeholder:text-[#666] cursor-pointer'
							>
								<input
									type='file'
									className='hidden'
									id='imageUpload'
									data-max-size='5120'
									accept='.jpg, .png'
									onChange={(e) => handleSelect(e)}
								/>
								<span>Upload image</span>
							</label>
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

						<div className='py-5 sm:flex sm:flex-row-reverse border-t border-[#66666645]'>
							{isSubmitting ? (
								<Loading />
							) : (
								<Button
									type='submit'
									containerStyles={`inline-flex justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none`}
									title='Submit'
								/>
							)}
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default EditProfile;
