import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { createTodo, deleteTodo, updateTodo } from '../../api/Todo';
import useGetTodo from '../../hooks/useGetTodo';
import style from './styles.module.css';
import { getItem, removeItem } from '../../utils/storage';

export default function Todo() {
  const [data, setData, isLoading, fetchTodo] = useGetTodo();
  const [newInput, setNewInput] = useState('');
  const [modifyInput, setModifyInput] = useState('');
  const [modifyId, setModifyId] = useState(0);
  const navigate = useNavigate();

  const accessToken = getItem('access_token');

  const handleAddTodo = () => {
    // 추가버튼을 클릭 했을 때 실행되는 함수.
    if (newInput === '') return;
    createTodo(newInput)
      .then((res) => setData((prev) => [...prev, res.data]))
      .catch(({ message }) => alert(`할 일 추가 중 문제가 발생했습니다.: ${message}`))
      .finally(() => fetchTodo());
  };

  const handleToggleTodo = (id) => {
    // 체크박스를 클릭 했을 때 실행되는 함수.
    setData((prev) =>
      prev.map((todo) => {
        if (todo.id === id) return { ...todo, isCompleted: !todo.isCompleted };
        return todo;
      })
    );

    const { todo, isCompleted } = data.find((todo) => todo.id === id); // 체크박스를 클릭한 todo

    updateTodo({ id, todoInfo: { todo, isCompleted: !isCompleted } })
      .catch(({ message }) => alert(`할 일 수정 중 문제가 발생했습니다.: ${message}`))
      .finally(() => fetchTodo());
  };

  const handleClickModify = (id, todo) => {
    // 수정버튼을 눌렀을 때 실행되는 함수.
    setModifyId(id);
    setModifyInput(todo);
  };

  const handleSubmitModify = () => {
    // 수정사항을 제출 했을 때 실행되는 함수.
    setData((prev) =>
      prev.map((todo) => {
        if (todo.id === modifyId) return { ...todo, todo: modifyInput };
        return todo;
      })
    );

    const { isCompleted } = data.find(({ id }) => id === modifyId); // 수정하려는 todo

    updateTodo({ id: modifyId, todoInfo: { todo: modifyInput, isCompleted } })
      .then(() => setModifyId(-1))
      .catch(({ message }) => alert(`할 일 수정 중 문제가 발생했습니다.: ${message}`))
      .finally(() => fetchTodo());
  };

  const handleDeleteTodo = (id) => {
    // 삭제버튼을 눌렀을 때 실행되는 함수.
    setData((prev) => prev.filter((todo) => todo.id !== id));

    deleteTodo(id)
      .catch(({ message }) => alert(`할 일 삭제 중 문제가 발생했습니다.: ${message}`))
      .finally(() => fetchTodo());
  };

  const handleLogout = () => {
    removeItem('access_token')
      .then(() => navigate('/signin'))
      .catch(({ message }) => alert(`로그아웃에 문제가 있습니다.: ${message}`));
  };

  return !accessToken ? (
    <Navigate to={'/signin'} replace />
  ) : (
    <div className={style.container}>
      <div className={style.title}>TODO</div>
      <button className={style.logout} onClick={handleLogout}>
        로그아웃
      </button>
      <div className={style.form}>
        <input
          data-testid="new-todo-input"
          type="text"
          value={newInput}
          onChange={(e) => setNewInput(e.target.value)}
        />
        <button data-testid="new-todo-add-button" onClick={handleAddTodo}>
          추가
        </button>
      </div>
      <ul className={style.list}>
        {data.map(({ id, isCompleted, todo, userId }) => (
          <li key={id}>
            <label>
              <input type="checkbox" checked={isCompleted} onChange={() => handleToggleTodo(id)} />
              {id === modifyId ? (
                <>
                  <input
                    data-testid="modify-input"
                    type="text"
                    value={modifyInput}
                    onChange={(e) => setModifyInput(e.target.value)}
                  />
                  <button data-testid="submit-button" onClick={handleSubmitModify}>
                    제출
                  </button>
                  <button data-testid="cancel-button" onClick={() => setModifyId(-1)}>
                    취소
                  </button>
                </>
              ) : (
                <>
                  <span>{todo}</span>
                  <button
                    data-testid="modify-button"
                    onClick={() => handleClickModify(id, todo, isCompleted)}
                  >
                    수정
                  </button>
                  <button data-testid="delete-button" onClick={() => handleDeleteTodo(id)}>
                    삭제
                  </button>
                </>
              )}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
