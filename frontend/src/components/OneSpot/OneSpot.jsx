import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {fetchASpot} from '../../store/spots';
import {fetchReviews} from '../../store/reviews';    
import {useModal} from "../../context/Modal";
import ReviewFormModal from "../ReviewFormModal";
import DeleteReviewModal from "../DeleteReviewModal";
import OpenModalButton from '../OpenModalButton';

function OneSpot(){
    const [isLoaded, setIsLoaded] = useState(false);
    const dispatch = useDispatch();
    const {spotId} = useParams();
    const spot = useSelector(state => state.spots.oneSpot.spotById);
    const reviews = useSelector(state => state.reviews.reviews);
    const sessionUser = useSelector(state => state.session.user);

    const {setModalContent} = useModal();

    // console.log('Reviews from useSelector-----> ', reviews)
    // console.log('OneSpot ----------->', stateSpot)

    useEffect(() => {
        async function getSpotData(){
           await dispatch(fetchASpot(spotId));
           await dispatch(fetchReviews(spotId));
           setIsLoaded(true);
        }
        getSpotData();
    }, [dispatch, spotId, isLoaded]);

    const reserveClick = () => {
        alert('Feature coming soon')
    }

    const handleReviewModal = () => {
        setModalContent(<ReviewFormModal spotId={spotId}/>)
    }


    return(
        <div>
            {isLoaded && spot &&
            
                <div id='spotbyid'>
                    <h1 className="spot-name" style={{fontSize: '40px'}}>{spot.name}</h1>
                    <h3 className="spot-location" style={{fontSize: '28px'}}>{spot.city}, {spot.state}, {spot.country}</h3>

                    <div className='spot-imgs-block'>
                        <div className='spot-main-pic-container'>
                            <img className='spot-main-pic' style={{height: '600px', width: '500px'}}src={spot.SpotImages[0]?.url} alt="main-pic"/>
                        </div>
                        <div className='spot-quad-pics-container'>
                            <img className="spot-quad-pic" style={{height: '250px', width: 'auto'}} src={spot.SpotImages[1]?.url || '/chicken-no-img.jpg'} alt="small-1" />
                            <img className="spot-quad-pic" style={{height: '250px', width: 'auto'}} src={spot.SpotImages[2]?.url || '/chicken-no-img.jpg'} alt="small-1" />
                            <img className="spot-quad-pic" style={{height: '250px', width: 'auto'}} src={spot.SpotImages[3]?.url || '/chicken-no-img.jpg'} alt="small-1" />
                            <img className="spot-quad-pic" style={{height: '250px', width: 'auto'}} src={spot.SpotImages[4]?.url || '/chicken-no-img.jpg'} alt="small-1" />
                        </div>
                    </div>

                    <div className="spot-page-lower">
                        <div className="spot-page-lower-left">
                            <p className="spot-host" style={{fontSize: '28px'}}>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</p>
                            <p className="spot-description" style={{fontSize: '25px'}}>Hi-lights: {spot.description}</p>

                            {!spot.numReviews ? <p style={{fontSize: '25px'}}>New</p> : 
                            spot.numReviews === 1 ? <p className="det-rev-sum" style={{fontSize: '25px'}}><img className="details-black-star" src='/black-star.jpg'/>
                            {spot.avgStarRating.toFixed(1)} &#183; {spot.numReviews} Review</p> :
                            <p className="det-rev-sum" style={{fontSize: '25px'}}><img className='details-black-star' src='/black-star.jpg'/> 
                            {spot.avgStarRating.toFixed(1)} &#183; {spot.numReviews} Reviews</p>}

                            <div className='spot-review-list'>
                                {!reviews.length && sessionUser && sessionUser.id !== spot.Owner.id ? 
                                (
                                <>
                                    <p style={{fontSize: '25px'}}>Be the first to post a review!</p>
                                    <button onClick={handleReviewModal} style={{fontSize: '25px'}}>Post Your Review</button>
                                </>
                                ) : (
                                <>
                                    <p className="spot-reviews-subtitle" style={{fontSize: '25px'}}>Reviews:</p>
                                    {sessionUser && sessionUser.id !== spot.Owner.id && !reviews.find(obj => obj.userId === sessionUser.id) && 
                                    (<button onClick={handleReviewModal} style={{fontSize: '25px'}}>Post Your Review</button>)}
                                </>
                                )}
                                
                                {
                                reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                .map((review, index) => (
                                    <div key={index}>
                                        <p style={{fontSize: '25px'}}>Reviewer: {review.User.firstName}</p>
                                        <p style={{fontSize: '25px'}}>Date of review: {new Date(review.createdAt).toLocaleString("default", { month: "long", year: "numeric" })}</p>
                                        <p style={{fontSize: '25px'}}>Comments: {review.review}</p>
                                        <p style={{fontSize: '25px'}}>Rating: {review.stars}</p>
                                        
                                        {sessionUser && review.userId === sessionUser.id && 
                                        (<OpenModalButton className='delete-spot' buttonText='Delete' modalComponent={<DeleteReviewModal spotId={spotId} reviewId={review.id}/>}/>)}
                                        
                                        <p>____________________________________________________</p>
                                    </div>
                                ))}
                          
                            </div>
                        </div>
    
                        <div className="spot-page-lower-right">
                            <div className='callout-box'>
                                <div className="callout-box-upper"><h2 style={{fontSize: '40px'}}>Don&apos;t miss out!</h2></div>
                                <div className='callout-box-mid'>
                                    <div className="callout-right-text">
                                        {!spot.numReviews ? <p className="callout-review-group" style={{fontSize: '30px'}}>New</p> : 
                                        spot.numReviews === 1 ? (<p className="callout-review-group" style={{fontSize: '30px'}}><img className="callout-black-star" src='/black-star.jpg'/>
                                        {spot.avgStarRating.toFixed(1)} &#183; {spot.numReviews} Review</p>) : 
                                        <p className="callout-review-group" style={{fontSize: '30px'}}>
                                            <img className="callout-black-star" src='/black-star.jpg'/>
                                            {spot.avgStarRating.toFixed(1)} &#183; {spot.numReviews} Reviews
                                        </p>}
                                    </div>
                                    <p className="callout-right-price" style={{fontSize: '30px'}}>{`$${spot.price} / night`}</p>
                                </div>
                                <button className='callout-box-reserve' onClick={reserveClick} style={{fontSize: '30px'}}>Reserve</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default OneSpot;