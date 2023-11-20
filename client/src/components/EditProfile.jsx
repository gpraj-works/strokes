import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const EditProfile = () => {
	const { user } = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const [errMsg, setErrMsg] = useState('');
	const [isSubmitting, setSubmitting] = useState(false);
	const [picture, setPicture] = useState(null);

	return <div>EditProfile</div>;
};

export default EditProfile;
