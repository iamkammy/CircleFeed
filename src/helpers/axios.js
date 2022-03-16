import axios from 'axios';
import { getBaseApiUrl } from '../config';

const axiosInstance = axios.create({
    baseURL: getBaseApiUrl(),
    headers: {
        'Content-Type': 'application/json',
    }
})

export default axiosInstance;