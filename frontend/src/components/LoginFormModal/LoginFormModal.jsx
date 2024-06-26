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
        <div className='login-container'>
        <form className='form' onSubmit={handleSubmit}>
        <label className='user-email'>
          Username or Email
          <input
            type="text"
            style={{fontSize: '23px'}}
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label className='password'>
          Password
          <input
            type="password"
            style={{fontSize: '23px'}}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential && <p style={{fontSize: '23px', color: 'red'}}>The provided credentials were invalid</p>}

        <div className='btns-container'>
        <button 
        id='log-in-button'
        type="submit"
        disabled={credential.length < 4 || password.length < 6}
        >Log In
        </button>

        <button
        id='log-in-demo-button'
        onClick={demoUserClick}
        >Log in as Demo User
        </button>
        </div>

      </form>
      </div>

    
    </>
  );
}

export default LoginFormModal;
