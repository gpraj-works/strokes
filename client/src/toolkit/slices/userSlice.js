import { createSlice } from '@reduxjs/toolkit';
import { loadState, removeState, saveState } from '../../utils/localStorage';

const initialState = {
	user: loadState('user') ?? {},
	edit: false,
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		login(state, action) {
			state.user = action.payload;
			saveState({ name: 'user', value: action.payload });
		},
		logout(state) {
			state.user = null;
			removeState('user');
		},
		updateProfile(state, action) {
			state.edit = action.payload;
		},
	},
});

export default userSlice.reducer;

export const UserLogin = (user) => {
	return (dispatch) => {
		dispatch(userSlice.actions.login(user));
	};
};

export const UserLogout = () => {
	return (dispatch) => {
		dispatch(userSlice.actions.logout());
	};
};

export const UpdateProfile = (values) => {
	return (dispatch) => {
		dispatch(userSlice.actions.updateProfile(values));
	};
};
