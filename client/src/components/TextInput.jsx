import { forwardRef } from 'react';
import PropTypes from 'prop-types';

const TextInput = forwardRef((props, ref) => {
	const { type, placeholder, styles, label, labelStyle, register, name, error } = props; //prettier-ignore

	return (
		<div className='w-full flex flex-col mt-2'>
			{label && (
				<label
					htmlFor={name}
					className={`text-accent-light text-sm mb-3 ${labelStyle}`}
				>
					{label}
				</label>
			)}
			<div>
				<input
					type={type}
					name={name}
					placeholder={placeholder}
					ref={ref}
					id={name}
					className={`bg-secondary rounded border accent-border outline-none text-sm text-accent-white px-4 py-2 placeholder:text-[#666] ${styles}`}
					{...register}
					aria-invalid={ error ? 'true' : 'false' }
					autoComplete='off'
				/>
			</div>
			{error && <p className='text-xs mt-2.5 ml-1 text-danger'>{error}</p>}
		</div>
	);
});

TextInput.displayName = 'TextInput';

TextInput.propTypes = {
	type: PropTypes.string,
	placeholder: PropTypes.string.isRequired,
	styles: PropTypes.string,
	label: PropTypes.string,
	labelStyle: PropTypes.string,
	register: PropTypes.object,
	name: PropTypes.string.isRequired,
	error: PropTypes.string,
};

export default TextInput;
