import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const demoUserClick = () => {
    return dispatch(sessionActions.login({credential: 'Demo-lition', password: 'password'}))
    .then(closeModal)
  };

  return (
    <>
      <div id='login-title'>
      <h1>Log In</h1>
      </div>
      <form className='form' onSubmit={handleSubmit}>
        <label className='user-email'>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label className='password'>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential && <p>The provided credentials were invalid</p>}
        <button 
        id='log-in-button'
        type="submit"
        disabled={credential.length < 4 || password.length < 6}
        >Log In
        </button>
      </form>

      <div className='demo-btn-container'>
      <button
        id='log-in-demo-button'
        onClick={demoUserClick}
        >Log in as Demo User
      </button>
      </div>
    </>
  );
}

export default LoginFormModal;
