import PropTypes from 'prop-types';

const Button = ({ title, containerStyle, iconRight, type, onClick }) => {
	return (
		<button
			onClick={onClick}
			type={type || 'button'}
			className={`inline-flex items-center text-base ${containerStyle}`}
		>
			{title}
			{iconRight && <span className='ml-2'>{iconRight}</span>}
		</button>
	);
};

Button.propTypes = {
	title: PropTypes.string,
	containerStyle: PropTypes.string,
	iconRight: PropTypes.element,
	type: PropTypes.string,
	onClick: PropTypes.object,
};

export default Button;
