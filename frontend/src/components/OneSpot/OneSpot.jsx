import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {fetchASpot} from '../../store/spots';
import {fetchReviews} from '../../store/spots';
import {useModal} from "../../context/Modal";
import ReviewFormModal from "../ReviewFormModal";

function OneSpot(){
    const [isLoaded, setIsLoaded] = useState(false);
    const dispatch = useDispatch();
    const {spotId} = useParams();
    const spot = useSelector(state => state.spots.oneSpot.spotById);
    const reviews = useSelector(state => state.spots.reviews);
    const sessionUser = useSelector(state => state.session.user);
    const {setModalContent} = useModal();

    // console.log('Reviews from useSelector-----> ', reviews)
    // console.log('OneSpot ----------->', spot)
    // console.log('OneSpot session user---------->', sessionUser)

    useEffect(() => {
        async function getSpotData(){
           await dispatch(fetchASpot(spotId));
           await dispatch(fetchReviews(spotId));
           setIsLoaded(true);
        }
        getSpotData();
    }, [dispatch, spotId]);

    const reserveClick = () => {
        alert('Feature coming soon')
    }

    const handleModal = () => {
        setModalContent(<ReviewFormModal/>)
    }

    return(
        <div>
            {isLoaded && spot &&
            
                <div id='spotbyid'>
                    <h1 className="spot-name">{spot.name}</h1>
                    <h3 className="spot-location">{spot.city}, {spot.state}, {spot.country}</h3>

                    <div className='spot-imgs-block'>
                        <div className='spot-main-pic-container'>
                            <img className='spot-main-pic' src="" alt="main-pic"/>
                        </div>
                        <div className='spot-quad-pics-container'>
                            <img className="spot-quad-pic" src="" alt="small-1" />
                            <img className="spot-quad-pic" src="" alt="small-2" />
                            <img className="spot-quad-pic" src="" alt="small-3" />
                            <img className="spot-quad-pic" src="" alt="small-4" />
                        </div>
                    </div>

                    <div className="spot-page-lower">
                        <div className="spot-page-lower-left">
                            <p className="spot-host">Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</p>
                            <p className="spot-description">Paragraph: {spot.description}</p>

                            {!spot.numReviews ? <p>New</p> : 
                            spot.numReviews === 1 ? <p>{spot.avgStarRating.toFixed(1)} &#183; {spot.numReviews} Review</p> :
                            <p>{spot.avgStarRating.toFixed(1)} &#183; {spot.numReviews} Reviews</p>}

                            <div className='spot-review-list'>
                                {!reviews.length && sessionUser && sessionUser.id !== spot.Owner.id ? 
                                (<><p>Be the first to post a review!</p>
                                <button onClick={handleModal}>Post Your Review</button></>) : 
                                (<>
                                <p className="spot-reviews-subtitle">Reviews:</p>

                                {sessionUser && sessionUser.id !== spot.Owner.id && !reviews.find(obj => obj.userId === sessionUser.id) && 
                                (<button onClick={handleModal}>Post Your Review</button>)}

                                {reviews.map((review, index) => (
                                    <div key={index}>
                                        <p>{review.User.firstName}</p>
                                        <p>{new Date(review.createdAt).toLocaleString("default", { month: "long", year: "numeric" })}</p>
                                        <p>{review.review}</p>
                                        <p>{review.stars}</p>
                                    </div>
                                ))}
                                </>
                                )}
                            </div>
                        </div>

                        <div className="spot-page-lower-right">
                            <div className='callout-box'>
                                <div className='callout-box-upper'>
                                    <div className="callout-right-text">
                                        {!spot.numReviews ? <p>New</p> : 
                                        spot.numReviews === 1 ? <p>{spot.avgStarRating.toFixed(1)} &#183; {spot.numReviews} Review</p> :
                                        <p>{spot.avgStarRating.toFixed(1)} &#183; {spot.numReviews} Reviews</p>}
                                    </div>
                                    <h3 className="callout-right-price">{spot.price} / night</h3>
                                </div>
                                <button className='callout-box-reserve' onClick={reserveClick}>Reserve</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default OneSpot;