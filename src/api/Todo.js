import axiosInstance from './axiosInstance';

export const getTodo = async () => {
  return await axiosInstance.get('/todos');
};

export const createTodo = async (todo) => {
  return await axiosInstance.post('/todos', { todo });
};

export const updateTodo = async ({ id, todoInfo }) => {
  return await axiosInstance.put(`/todos/${id}`, todoInfo);
};

export const deleteTodo = async (id) => {
  return await axiosInstance.delete(`/todos/${id}`);
};
