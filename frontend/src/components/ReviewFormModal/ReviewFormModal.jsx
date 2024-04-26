import { useState } from 'react';
// import { useDispatch } from 'react-redux';

function ReviewFormModal(){
    // const dispatch = useDispatch();
    const [review, setReview] = useState('');
    const [stars, setStars] = useState(null);
    // const [errors, setErrors] = useState({});

    const handleSubmit = e => {
        e.preventDefault();
        // const reviewObj = {review, stars}
        // setErrors({});
    }


    return(
        <form onSubmit={handleSubmit}>
        <h1>How was your stay?</h1>
        <label htmlFor="user-review"><textarea id='user-review' rows='2' cols='100' 
        placeholder='Leave your review here...' value={review} onChange={e => setReview(e.target.value)}/></label>

        <label htmlFor="star-rating"><input type="radio" id="star1" name='star-rating' value='1' onChange={e => setStars(e.target.value)}/>1 Star</label>
        <label htmlFor="star-rating"><input type="radio" id="star2" name='star-rating' value='2' onChange={e => setStars(e.target.value)}/>2 Stars</label>
        <label htmlFor="star-rating"><input type="radio" id="star3" name='star-rating' value='3' onChange={e => setStars(e.target.value)}/>3 Stars</label>
        <label htmlFor="star-rating"><input type="radio" id="star3" name='star-rating' value='4' onChange={e => setStars(e.target.value)}/>4 Stars</label>
        <label htmlFor="star-rating"><input type="radio" id="star5" name='star-rating' value='5' onChange={e => setStars(e.target.value)}/>5 Stars</label>

        <button type='submit' disabled={review.length < 10 || stars === null}>Submit Your Review</button>
        </form>
    )

}

export default ReviewFormModal;