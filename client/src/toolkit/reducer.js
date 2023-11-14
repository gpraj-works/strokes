import { combineReducers } from '@reduxjs/toolkit';
import userSlice from './slices/userSlice';
import postSlice from './slices/postSlice';
import themeSlice from './slices/themeSlice';

const rootReducer = combineReducers({
	user: userSlice,
	posts: postSlice,
	theme: themeSlice,
});

export { rootReducer };
