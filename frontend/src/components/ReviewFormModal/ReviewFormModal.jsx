import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';

function ReviewFormModal(){
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [review, setReview] = useState('');
    const [stars, setStars] = useState(null);
    const [errors, setErrors] = useState({});

    const handleSubmit = e => {
        e.preventDefault();
        setErrors({});
    }


    return(
        <form onSubmit={handleSubmit}>
        <h1>How was your stay?</h1>
        <label htmlFor="user-review"><textarea id='user-review' rows='2' cols='100' 
        placeholder='Leave your review here...' value={review} onChange={e => setReview(e.target.value)}/></label>

        <label htmlFor="star-rating"><input type="radio" id="star1" value='1'/>1 Star</label>
        <label htmlFor="star-rating"><input type="radio" id="star2" value='2'/>2 Stars</label>
        <label htmlFor="star-rating"><input type="radio" id="star3" value='3'/>3 Stars</label>
        <label htmlFor="star-rating"><input type="radio" id="star3" value='4'/>4 Stars</label>
        <label htmlFor="star-rating"><input type="radio" id="star5" value='5'/>5 Stars</label>

        <button type='submit' disabled={review.length < 10 || stars === null}>Submit Your Review</button>
        </form>
    )

}

export default ReviewFormModal;