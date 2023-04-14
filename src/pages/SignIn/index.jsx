import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import style from '../SignUp/styles.module.css';
import { signIn } from '../../api/Auth';
import { getItem, setItem } from '../../utils/storage';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const accessToken = getItem('access_token');

  const handleChangeEmail = (e) => setEmail(e.target.value);
  const handleChangePassword = (e) => setPassword(e.target.value);

  // 이메일, 비밀번호 검증
  const validEmail = (email) => email.includes('@');
  const validPassword = (pass) => pass.length >= 8;

  const handleSignIn = (e) => {
    // 로그인 버튼을 눌렀을 때 실행되는 함수.
    e.preventDefault();
    signIn({ email, password }).then(handleSignInSuccess).catch(handleSignInError);
  };

  const handleSignInSuccess = (res) => {
    // 로그인 성공했을 때 실행되는 함수
    const { access_token } = res.data;

    setItem('access_token', access_token)
      .then(() => navigate('/todo'))
      .catch(({ error, message }) => alert(message));
  };

  const handleSignInError = ({ error, message }) => {
    // 로그인 실패했을 때 실행되는 함수
    const { statusCode } = error.response.data;
    if (statusCode >= 400 && statusCode < 500) {
      alert('로그인에 실패했습니다. 이메일이나 비밀번호를 확인해주세요.');
    } else {
      alert(message);
    }
  };

  return accessToken ? (
    <Navigate to={'/todo'} replace />
  ) : (
    <div className={style.container}>
      <div className={style.formWrap}>
        <div className={style.title}>로그인</div>
        <form className={style.form} onSubmit={handleSignIn}>
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
            data-testid="signin-button"
            className={style.button}
            disabled={validEmail(email) && validPassword(password) ? false : true}
          >
            로그인
          </button>
        </form>
        <button className={style.signup} onClick={() => navigate('/signup')}>
          회원가입
        </button>
      </div>
    </div>
  );
}
