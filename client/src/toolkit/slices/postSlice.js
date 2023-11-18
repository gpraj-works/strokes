import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	post: {},
};

const postSlice = createSlice({
	name: 'post',
	initialState,
	reducers: {
		getPost(state, action) {
			state.theme = action.payload;
		},
	},
});

export default postSlice.reducer;

export const SetPost = (post) => {
	return (dispatch) => {
		dispatch(postSlice.actions.getPost(post));
	};
};
