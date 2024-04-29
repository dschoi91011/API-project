import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data?.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <div id='modal-container' style={{height: '600px'}}>
      <div className='title-container'>
      <h1 id='title' style={{fontSize: '40px'}}>Sign Up</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <div className='sign-up-container'>
          <div className='info-group'>
        <label style={{fontSize: '25px'}}>
          Email
          <input style={{fontSize: '20px', marginLeft: '112px'}}
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {errors.email && <p style={{fontSize: '25px', color: 'red'}}>{errors.email}</p>}
        <label style={{fontSize: '25px'}}>
          Username
          <input style={{fontSize: '20px', marginLeft: '85px'}}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        {errors.username && <p style={{fontSize: '25px', color: 'red'}}>{errors.username}</p>}
        <label style={{fontSize: '25px'}}>
          First Name
          <input style={{fontSize: '20px', marginLeft: '77px'}}
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        {errors.firstName && <p style={{fontSize: '25px', color: 'red'}}>{errors.firstName}</p>}
        <label style={{fontSize: '25px'}}>
          Last Name
          <input style={{fontSize: '20px', marginLeft: '80px'}}
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        {errors.lastName && <p style={{fontSize: '25px', color: 'red'}}>{errors.lastName}</p>}
        <label style={{fontSize: '25px'}}>
          Password
          <input style={{fontSize: '20px', marginLeft: '88px'}}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p style={{fontSize: '25px', color: 'red'}}>{errors.password}</p>}
        <label style={{fontSize: '25px'}}>
          Confirm Password
          <input style={{fontSize: '20px', marginLeft: '30px'}}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {errors.confirmPassword && <p style={{fontSize: '25px', color: 'red'}}>{errors.confirmPassword}</p>}
        </div>
        <button 
        id='sign-up-button' style={{fontSize: '25px', marginTop: '30px'}}
        type="submit"
        disabled={
          !email || !username || !firstName || !lastName || !password || !confirmPassword ||
          username.length < 4 || password.length < 6 || password !== confirmPassword
        }
        >Sign Up</button>
        </div>
      </form>
    </div>
  );
}

export default SignupFormModal;
