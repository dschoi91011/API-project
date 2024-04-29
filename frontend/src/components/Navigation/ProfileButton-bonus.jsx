import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import {useNavigate, NavLink} from 'react-router-dom';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './ProfileButton-bonus.css';


function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const redirect = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    redirect('/');
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button onClick={toggleMenu} style={{height: '35px', width: '50px'}}>
        <i className="fas fa-user-circle" />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <div className='user-profile'>
            <p style={{fontSize: '23px'}}>Hello, {user.firstName}</p>
            <p style={{fontSize: '23px'}}>{user.email}</p>
            <p><NavLink style={{fontSize: '23px', textDecoration: 'none'}} to='/spots/current'>Manage Spots</NavLink></p>
            <p>
              <button onClick={logout} style={{fontSize: '23px' ,width: '100px'}}>Log Out</button>
            </p>
          </div>
        ) : (
          <div className='dropdown-menu'>
            <div className='login-btn' style={{fontSize: '23px'}}>
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            </div>
            <div className='signup-btn' style={{fontSize: '23px'}}>
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
            </div>
          </div>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
