import {useState, useEffect} from "react";
import {NavLink} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {fetchSpots} from '../../store/spots';

function Spots(){
    const [isLoaded, setIsLoaded] = useState(false);
    const dispatch = useDispatch();
    const spots = useSelector(state => state.spots);

    // console.log('SPOTS!!! ----------> ', spots)

    useEffect(() => {
        // dispatch(fetchSpots()).then(() => {
        //     setIsLoaded(true);
        async function getSpotsData(){
            await dispatch(fetchSpots());
            setIsLoaded(true);
        }
        getSpotsData();
    }, [dispatch]);


    return(
        <div className='all-spots'>
            {isLoaded && Object.values(spots).map(obj =>(

                !obj.SpotImages && <NavLink className='spots-navlink' key={obj.id} to={`/${obj.id}`}>
                    <div className='spot-tile'>
                        <div className="tile-img-container">
                            <div className='tile-tooltip'>
                                <img className='tile-img' src='' alt={obj.previewImage}/>
                                <span className='tile-tooltip-text'>{obj.name}</span>
                            </div>
                        </div>
                        <h3 className='tile-location'>{obj.city}, {obj.state}</h3>
                        <div className="tile-footer">
                            <div className='tile-star-grouping'>
                                <img className='tile-star' src="" alt="img"/>
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