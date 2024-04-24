import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton-bonus';
// import CreateSpotForm from '../CreateSpotForm';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  console.log('SessionUser -----------> ', sessionUser)        //  <-----------------------------------
  

  return (
    <div id='navbar'>
        <NavLink id='home-icon' to="/"><img src="" alt="Home"/></NavLink>

      {isLoaded && (<ProfileButton id='profile-button' user={sessionUser} />)}
    </div>
  );
}

export default Navigation;
