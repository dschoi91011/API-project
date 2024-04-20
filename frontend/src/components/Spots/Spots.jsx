import {useState, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import spotsReducer, {fetchSpots} from '../../store/spots';

function Spots(){
    const [isLoaded, setIsLoaded] = useState(false);
    const dispatch = useDispatch();
    const spots = useSelector(state => state.spots);

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
                <div key={obj.id}>
                    <h1>{obj.name}</h1>
                    <h3>{obj.address}</h3>
                    <h3>{obj.city}</h3>
                    <p>{obj.description}</p>
                    <p>{`${obj.price} per night`}</p>
                </div>
            ))}
        </div>
    )
}

export default Spots;