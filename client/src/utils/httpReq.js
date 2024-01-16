import axios from 'axios';
import { SetPosts } from '../toolkit/slices/postSlice';
import { removeState } from './localStorage';

// const API_URL = 'http://localhost:3002/api/v1';
const API_URL = 'https://strokeserver.vercel.app/api/v1';

export const API = axios.create({
	baseURL: API_URL,
	responseType: 'json',
});

export const apiRequest = async ({ url, token, data, method }) => {
	try {
		const result = await API(url, {
			method: method || 'GET',
			data,
			headers: {
				'Content-Type': 'application/json',
				Authorization: token ? `Bearer ${token}` : '',
			},
		});

		return result?.data;
	} catch (error) {
		const response = error?.response?.data;
		return { status: response?.status, message: response?.message };
	}
};

export const fetchPosts = async (token, dispatch, uri, data) => {
	try {
		const response = await apiRequest({
			url: uri || '/posts',
			token,
			method: 'POST',
			data: data || {},
		});

		dispatch(SetPosts(response?.data));
		return false;
	} catch (error) {
		console.log(error);
	}
};

export const likePost = async ({ token, uri: url }) => {
	try {
		return await apiRequest({ url, token, method: 'POST' });
	} catch (error) {
		console.log(error);
	}
};

export const deletePost = async (id, token) => {
	try {
		await apiRequest({ url: '/posts/' + id, token, method: 'DELETE' });
		return false;
	} catch (error) {
		console.log(error);
	}
};

export const getUserInfo = async ({ id, token }) => {
	const baseUrl = '/users/userById/';
	const uri = id === undefined ? baseUrl : baseUrl + id;

	try {
		const response = await apiRequest({ url: uri, token, method: 'POST' });

		if (response?.message === 'Authentication failed') {
			removeState('user');
			window.location.replace('/login');
			console.log('User session expired. Login again.');
		}

		return response?.user;
	} catch (error) {
		console.log(error);
	}
};

export const sendFriendRequest = async (id, token) => {
	try {
		await apiRequest({
			url: '/users/friend-request',
			token,
			method: 'POST',
			data: { requestTo: id },
		});
		return false;
	} catch (error) {
		console.log(error);
	}
};

export const viewUserProfile = async (id, token) => {
	try {
		await apiRequest({
			url: '/users/profile-view',
			token,
			method: 'POST',
			data: { id },
		});
		return false;
	} catch (error) {
		console.log(error);
	}
};
