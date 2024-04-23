import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton-bonus';
import CreateSpotForm from '../CreateSpotForm';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  console.log('SessionUser -----------> ', sessionUser)        //  <-----------------------------------
  
  //create button here that, onClick, will link to CreateSpot form
  return (
    <div id='navbar'>
        <NavLink id='home-icon' to="/">Home</NavLink>


      {sessionUser && (<CreateSpotForm />)}     


      {isLoaded && (<ProfileButton id='profile-button' user={sessionUser} />)}
    </div>
  );
}

export default Navigation;
