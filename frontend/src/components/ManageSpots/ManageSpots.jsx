import {useState, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchSpotsByOwner} from '../../store/spots'
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// import {useModal} from "../../context/Modal";
import DeleteFormModal from "../DeleteFormModal";
import OpenModalButton from '../OpenModalButton';


function ManageSpots(){
    const [isLoaded, setIsLoaded] = useState(false);
    const dispatch = useDispatch();
    const redirect = useNavigate();
    const spots = useSelector(state => state.spots.allSpots);
    const sessionUser = useSelector(state => state.session.user);
    // const {setModalContent} = useModal();

    useEffect(() => {
        async function getSpotsData(){
            await dispatch(fetchSpotsByOwner());
            setIsLoaded(true);
        }
        getSpotsData();
    }, [dispatch]);


    return(
        <div className="user-spots">
        <h1>Manage Spots</h1>
        {isLoaded && sessionUser && (
            Object.values(spots).length ? (
            Object.values(spots).map(obj =>(
            !obj.SpotImages && 
            <div key={obj.id}>
           <NavLink className='spots-navlink' to={`/${obj.id}`}>
            <img className='tile-img' src='' alt={obj.previewImage}/>
            <h3 className='tile-location'>{obj.city}, {obj.state}</h3>
            <img className='tile-star' src="" alt="img"/>
            <h3 className='tile-avg-rating'>{typeof obj.avgRating === 'number' ? obj.avgRating.toFixed(1) : 'New'}</h3>
            <p className='tile-price'>{`${obj.price} / night`}</p>
           </NavLink>
            <button className='update-spot' onClick={() => redirect(`/${obj.id}/update`)}>Update</button>
            <OpenModalButton
                className='delete-spot'
                buttonText='Delete'
                modalComponent={<DeleteFormModal spotId={obj.id}/>}
            />
            </div>)))
        : (<NavLink to='/spots/new'>Create a New Spot</NavLink>)
        )}
        </div>
    )
}

export default ManageSpots;