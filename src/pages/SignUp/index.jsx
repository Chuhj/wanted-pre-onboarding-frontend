import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import style from './styles.module.css';
import { signUp } from '../../api/Auth';
import { getItem } from '../../utils/storage';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const accessToken = getItem('access_token');

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const validEmail = (email) => email.includes('@');

  const validPassword = (pass) => pass.length >= 8;

  const handleSignUp = (e) => {
    // 회원가입 버튼을 클릭 시 실행되는 함수
    e.preventDefault();
    signUp({ email, password }).then(handleSignUpSuccess).catch(handleSignUpError);
  };

  const handleSignUpSuccess = ({ status }) => {
    // 회원가입이 성공했을 때 실행되는 함수
    if (200 <= status && status < 300) {
      alert('회원가입에 성공하였습니다!');
      navigate('/signin');
    }
  };

  const handleSignUpError = ({ error, message }) => {
    // 회원가입 실패했을 때 실행되는 함수
    alert(message);
  };

  return accessToken ? (
    <Navigate to={'/todo'} replace />
  ) : (
    <div className={style.container}>
      <div className={style.formWrap}>
        <div className={style.title}>회원가입</div>
        <form className={style.form} onSubmit={handleSignUp}>
          <div className={style.input}>
            <label htmlFor="email">Email</label>
            <input
              data-testid="email-input"
              id="email"
              value={email}
              placeholder="Email"
              onChange={handleChangeEmail}
            />
          </div>
          <div className={style.input}>
            <label htmlFor="password">Password</label>
            <input
              data-testid="password-input"
              id="password"
              value={password}
              type="password"
              placeholder="Password"
              onChange={handleChangePassword}
            />
          </div>
          <button
            data-testid="signup-button"
            className={style.button}
            disabled={validEmail(email) && validPassword(password) ? false : true}
          >
            회원가입
          </button>
        </form>
        <button className={style.signup} onClick={() => navigate('/signin')}>
          로그인
        </button>
      </div>
    </div>
  );
}
