import { useEffect, useState } from 'react';
import { getTodo } from '../api/Todo';

export default function useGetTodo() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  const fetchTodo = () => {
    setIsLoading(true);
    getTodo()
      .then((res) => setData(res.data))
      .catch(({ message }) => alert(message))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchTodo();
  }, []);

  return [data, setData, isLoading, fetchTodo];
}
