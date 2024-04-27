import {useState, useEffect} from "react";
import {NavLink} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {fetchSpots} from '../../store/spots';

function Spots(){
    const [isLoaded, setIsLoaded] = useState(false);
    const dispatch = useDispatch();
    const spots = useSelector(state => state.spots.allSpots);

    useEffect(() => {
        async function getSpotsData(){
            await dispatch(fetchSpots());
            setIsLoaded(true);
        }
        getSpotsData();
    }, [dispatch]);


    return(
        <div className='all-spots'>
            {isLoaded && Object.values(spots).map(obj =>(

                <NavLink className='spots-navlink' key={obj.id} to={`/${obj.id}`}>
                    <div className='spot-tile'>
                        <div className="tile-img-container">
                            <div className='tile-tooltip'>
                                <span className='tile-tooltip-text'>{obj.name}</span>
                            </div>
                            <img className='tile-img' src={obj.previewImage} alt='house'/>
                        </div>
                        <h3 className='tile-location'>{obj.city}, {obj.state}</h3>
                        <div className="tile-footer">
                            <div className='tile-star-grouping'>
                                <img className='tile-star' src="/black-star.jpg" alt="img"/>
                                <h3 className='tile-avg-rating'>{typeof obj.avgRating === 'number' ? obj.avgRating.toFixed(1) : 'New'}</h3>
                            </div>
                            <p className='tile-price'>{`${obj.price} / night`}</p>
                        </div>
                    </div>
                </NavLink>
                
            ))}
        </div>
    )
}

export default Spots;