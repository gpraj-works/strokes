import { createSlice } from '@reduxjs/toolkit';
import { loadState, saveState } from '../../utils/localStorage';

const initialState = {
	theme: loadState('theme') ?? 'light',
};

const themeSlice = createSlice({
	name: 'theme',
	initialState,
	reducers: {
		setTheme(state, action) {
			state.theme = action.payload;
			saveState({ name: 'theme', value: action.payload });
		},
	},
});

export default themeSlice.reducer;

export const SetTheme = (value) => {
	return (dispatch) => {
		dispatch(themeSlice.actions.setTheme(value));
	};
};
