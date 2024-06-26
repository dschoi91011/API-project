import {useState, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchSpotsByOwner} from '../../store/spots'
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// import {useModal} from "../../context/Modal";
import DeleteFormModal from "../DeleteFormModal";
import OpenModalButton from '../OpenModalButton';
import './ManageSpots.css';


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
        <div>
        <h1 className="title" style={{fontSize: '40px'}}>Manage Spots</h1>
        <div className="user-spots">
        {isLoaded && sessionUser && (
            Object.values(spots).length ? (
            Object.values(spots).map(obj =>(
            <div className="tile-spot" key={obj.id}>
                <NavLink className='spots-navlink' to={`/${obj.id}`}>
                    <div className="tile-img-container">
                        <img className='tile-img' src={obj.previewImage} alt='previewImage'/>
                    </div>
                    <h3 className='tile-location' style={{fontSize: '25px'}}>{obj.city}, {obj.state}</h3>
                    <div className="tile-footer">
                        <div className="avg-rating-group">
                            <img className='tile-star' src="/black-star.jpg" alt="img"/>
                            <h3 className='tile-avg-rating' style={{fontSize: '25px'}}>{typeof obj.avgRating === 'number' ? obj.avgRating.toFixed(1) : 'New'}</h3>
                        </div>
                        <div className="tile-price-container">
                            <p className='tile-price' style={{fontSize: '25px'}}>{`${obj.price} / night`}</p>
                        </div>
                    </div>
                </NavLink>

                <div className="buttons">
                    <button className='update-spot' onClick={() => redirect(`/${obj.id}/update`)} style={{fontSize: '25px', width: '100px'}}>Update</button>
                    <OpenModalButton
                        className='delete-spot'
                        buttonText='Delete'
                        modalComponent={<DeleteFormModal spotId={obj.id}/>}
                    />
                </div>
            </div>)))
        : (<NavLink to='/spots/new'>Create a New Spot</NavLink>))}
        </div>
        </div>
    )
}

export default ManageSpots;