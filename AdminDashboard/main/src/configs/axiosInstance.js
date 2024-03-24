import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_SERVER_DOMAIN,
});

axiosInstance.defaults.withCredentials = true;
//axiosInstance.defaults.headers.common['XSRF-Token'] = document.cookie.slice(6);

export default axiosInstance;
