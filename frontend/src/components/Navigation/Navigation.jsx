import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton-bonus';
// import OpenModalButton from '../OpenModalButton';
// import LoginFormModal from '../LoginFormModal';
// import SignupFormModal from '../SignupFormModal';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  const sessionLinks = sessionUser ?
    (
      <div className='nav-right-section'>
        <NavLink id='create-new-spot-button' to='/spots/new'>Create New Spot</NavLink>
        <ProfileButton className='prof-btn' user={sessionUser} />
      </div>
    ) : (
      <>
        <ProfileButton className='prof-btn'/>
      </>
    );


  return (
    <div id='navbar'>
      <NavLink id='home-icon' to="/"><img src="/chickenscratch.jpg" 
      style={{height: '70px', width: 'auto'}} alt="Home"/></NavLink>
      {isLoaded && sessionLinks}
    </div>
  );
}

export default Navigation;
