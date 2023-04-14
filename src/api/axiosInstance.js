import axios from 'axios';
import { getItem } from '../utils/storage';

const BASE_URL = 'https://www.pre-onboarding-selection-task.shop';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = getItem('access_token');
  if (accessToken) config.headers['Authorization'] = `Bearer ${accessToken}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // 로그인 에러에서 400으로 에러 메세지를 보내줌. => 그대로 사용해도 되고 안해도 되고..
    // 400 ~ 499 - 에러 메세지 출력
    // 401 - 인증 에러 출력
    // 500 ~ - 서버 에러 출력
    const { statusCode, message: msg } = error.response.data;

    let message = '';

    if (statusCode === 401) {
      message = `${statusCode} 인증 에러입니다. 로그인이 필요합니다.`;
    } else if (statusCode >= 400 && statusCode < 500) {
      message = `${statusCode} ${Array.isArray(msg) ? msg.join(', ') : msg}`;
    } else {
      message = `${statusCode} 서버에 문제가 있습니다.`;
    }
    return Promise.reject({ error, message });
  }
);

export default axiosInstance;
