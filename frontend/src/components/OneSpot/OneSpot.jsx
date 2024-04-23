import {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {fetchASpot} from '../../store/spots';

function OneSpot(){
    const [isLoaded, setIsLoaded] = useState(false);
    const dispatch = useDispatch();
    const {spotId} = useParams();
    const spot = useSelector(state => state.spots.spotById);

    console.log('OneSpot ----------->', spot)

    useEffect(() => {
        // dispatch(fetchSpots()).then(() => {
        //     setIsLoaded(true);
        async function getSpotData(){
           await dispatch(fetchASpot(spotId));
            setIsLoaded(true);
        }
        getSpotData();
    }, [dispatch]);

    const reserveClick = () => {
        alert('Feature coming soon')
    }

    return(
        <div>
            {isLoaded && spot &&
            
                <div id='spotbyid'>
                    <h1>{spot.name}</h1>
                    <h3>{spot.city}, {spot.state}, {spot.country}</h3>
                    <img src="" alt="main-pic" />
                    <img src="" alt="small-1" />
                    <img src="" alt="small-2" />
                    <img src="" alt="small-3" />
                    <img src="" alt="small-4" />
                    <p>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</p>
                    <p>Paragraph: {spot.description}</p>
                    <ul className='spot-review-list'>

                    </ul>
                    <div className='callout-box'>
                        <h3>{spot.price} / night</h3>
                        {!spot.numReviews ? <p>New</p> : 
                        spot.numReviews === 1 ? <p>{spot.avgStarRating.toFixed(1)} &#183; {spot.numReviews} Review</p> :
                        <p>{spot.avgStarRating.toFixed(1)} &#183; {spot.numReviews} Reviews</p>}

                        <button className='callout-box-reserve' onClick={reserveClick}>Reserve</button>
                    </div>
                </div>
            }
        </div>
    )
}

export default OneSpot;