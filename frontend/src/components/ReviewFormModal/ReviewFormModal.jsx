import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import {createReview} from '../../store/reviews';
// import { fetchASpot } from '../../store/spots';
import './ReviewFormModal.css';

function ReviewFormModal({spotId}){
    const dispatch = useDispatch();
    const {closeModal} = useModal();
    const [review, setReview] = useState('');
    const [starRating, setStarRating] = useState(0);

    const handleSubmit = async(e) => {
        e.preventDefault();
        // setIsLoaded(false);
        const userReview = {review, stars: Number(starRating)}
        return dispatch(createReview(userReview, spotId)).then(closeModal)

    }

    const handleClick = (star) => {
        setStarRating(star)
    }

    const starArr = [1, 2, 3, 4, 5]

    return(
        <form onSubmit={handleSubmit}>
        <div className='title'>
        <h1>How was your stay?</h1>
        </div>
        <label htmlFor="user-review"><textarea id='user-review' rows='3' cols='100' style={{margin: '10px 20px'}}
        placeholder='Leave your review here...' value={review} onChange={e => setReview(e.target.value)}/></label>

        <div className='stars-group'>
            {starArr.map((star, i) => (
                <div key={i} className='star' style={{fontSize: '30px'}} onClick={() => handleClick(star)}>
                    {star === 1 ? '💩' : star === 2 ? '🙁' : star === 3 ? '😐' : star === 4 ? '🙂' : '🤩'}
                </div>
                )
            )}
        </div>

        <div className='button-container'>
            <button className='submit-button' style={{height: '40px', width: '200px'}} type='submit' disabled={review.length < 10 || starRating === 0}>Submit Your Review</button>
        </div>
        </form>
    )

}

export default ReviewFormModal;