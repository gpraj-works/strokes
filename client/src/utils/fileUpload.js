import axios from 'axios';

const CLOUD = import.meta.env.VITE_REACT_CLOUD_NAME;
const BASE_URL = `https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`;

const fileUpload = async (uploadFile) => {
	const formData = new FormData();
	formData.append('file', uploadFile);
	formData.append('upload_preset', 'strokes');

	try {
		const response = await axios.post(BASE_URL, formData);
		return response?.data?.secure_url;
	} catch (error) {
		console.log(error);
	}
};

export default fileUpload;
