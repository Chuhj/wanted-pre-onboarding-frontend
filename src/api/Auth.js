import axiosInstance from './axiosInstance';

export const signUp = async ({ email, password }) => {
  return await axiosInstance.post('/auth/signup', { email, password });
};

export const signIn = async ({ email, password }) => {
  return await axiosInstance.post('/auth/signin', { email, password });
};
