// import colors from 'tailwindcss/colors';

export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				dark: 'rgb(var(--color-bg) / <alpha-value>)',
				primary: 'rgb(var(--color-primary) / <alpha-value>)',
				secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
				blue: 'rgb(var(--color-blue) / <alpha-value>)',
				white: 'rgb(var(--color-white) / <alpha-value>)',
				accent: {
					white: 'rgb(var(--color-ascent1) / <alpha-value>)',
					light: 'rgb(var(--color-ascent2) / <alpha-value>)',
				},
				danger: '#F45050',
				success: '#186F65',
				strokes: {
					700: '#2F8F9D',
					500: '#3BACB6',
					300: '#82DBD8',
					100: '#B3E8E5',
				},
			},
		},
		screens: {
			sm: '640px',
			md: '768px',
			lg: '1024px',
			xl: '1280px',
			'2xl': '1536px',
		},
	},
	plugins: [],
};
