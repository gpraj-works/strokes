import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	posts: {},
};

const postSlice = createSlice({
	name: 'post',
	initialState,
	reducers: {
		getPost(state, action) {
			state.posts = action.payload;
		},
	},
});

export default postSlice.reducer;

export const SetPosts = (post) => {
	return (dispatch) => {
		dispatch(postSlice.actions.getPost(post));
	};
};
