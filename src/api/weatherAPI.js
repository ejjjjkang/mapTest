import axios from "axios";

// API Axios Get Call.
export const getAPICall = (url) => {
	return axios.get(url);
};
// API Axios Post Call.
export const postAPICall = (url, data) => {
	return axios.post(url, data);
};
// API Axios Put Call.
export const putAPICall = (url, data) => {
	return axios.put(url, data);
};
// API Axios Delete Call.
export const deleteAPICall = (url) => {
	return axios.delete(url);
};

export const weatherAPI = async (url) => {
	try {
		const res = await getAPICall(url);
		return res;
	} catch (err) {
		return err.response;
	}
};
