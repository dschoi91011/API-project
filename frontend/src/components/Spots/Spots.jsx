import {useState, useEffect} from "react";
import { NavLink } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {fetchSpots} from '../../store/spots';

function Spots(){
    const [isLoaded, setIsLoaded] = useState(false);
    const dispatch = useDispatch();
    const spots = useSelector(state => state.spots);

    console.log('SPOTS!!! ----------> ', spots)

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
        <div>
            {isLoaded &&
            Object.values(spots).map(obj =>(
                <div className='spot-tile'>
                <NavLink key={obj.id} to={`/${obj.id}`}>
                    <img src='' alt={obj.previewImage} />
                    <h3>{obj.city}, {obj.state}</h3>
                    <h3>{typeof obj.avgRating === 'number' ? obj.avgRating.toFixed(1) : 'New'}</h3>
                    <p>{`${obj.price} / night`}</p>
                </NavLink>
                </div>
            ))}
        </div>
    )
}

export default Spots;