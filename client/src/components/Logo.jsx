import PropTypes from 'prop-types';

const Logo = ({ className, color }) => {
	const defaultColor = color ?? '#2F8F9D';
	return (
		<svg viewBox='0 0 512 512' className={className}>
			<g id='bgCarrier' strokeWidth='0' />
			<g id='tracerCarrier' strokeLinecap='round' strokeLinejoin='round' />
			<g id='iconCarrier'>
				<path
					fill={defaultColor}
					d='M19.49 289.3C105.4 130.1 284.9 17.56 491.1 30.3c-91.5 46.11-179.2 101.3-240.3 155 41.4-8.7 113-24.8 172.7-7.9-83.7 29.6-180.7 64.2-208.6 95.7 51.9-6.5 122-7.3 161.5 17.7-75.3 5.2-174 18.7-188.5 36.3 41.9.8 109.3 36.9 130 60.4-67.6-11.8-106-17-153.5-7.1 58.3 8.9 85.6 49.7 102.6 75.3-51.5-19.6-88.3-30.3-111.9-31 23 23 32.4 43.5 45.1 70.8C107.4 463.2-2.716 330.4 19.49 289.3z'
				/>
			</g>
		</svg>
	);
};

Logo.propTypes = {
	className: PropTypes.string.isRequired,
	color: PropTypes.string,
};

export default Logo;
