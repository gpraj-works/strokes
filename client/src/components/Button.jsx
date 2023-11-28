import PropTypes from 'prop-types';

const Button = ({ title, style, iconRight, type, onClick }) => {
	return (
		<button
			onClick={onClick}
			type={type || 'button'}
			className={`inline-flex items-center text-base ${style}`}
		>
			{title}
			{iconRight && <span className='ml-2'>{iconRight}</span>}
		</button>
	);
};

Button.propTypes = {
	title: PropTypes.any,
	style: PropTypes.string,
	iconRight: PropTypes.element,
	type: PropTypes.string,
	onClick: PropTypes.any,
};

export default Button;
