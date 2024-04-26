import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './ReviewFormModal.css';

function ReviewFormModal(){
    const dispatch = useDispatch();
    const {closeModal} = useModal();
    const [review, setReview] = useState('');
    const [star, setStar] = useState(false);


    const handleSubmit = async(e) => {
        e.preventDefault();
        const userReview = {review, stars}
        await dispatch(addReview(userReview, spotId))
        closeModal()
    }

    const handleClick = (e) => {

    }

    const starArr = [1, 2, 3, 4, 5]

    return(
        <form onSubmit={handleSubmit}>
        <h1>How was your stay?</h1>
        <label htmlFor="user-review"><textarea id='user-review' rows='2' cols='100' 
        placeholder='Leave your review here...' value={review} onChange={e => setReview(e.target.value)}/></label>

        <div className='stars-group'>
            {starArr.map((star, i) => (
                <div key={i} className='star' style={{fontSize: '30px'}} onClick={handleClick}>
                    {star === 1 ? '💩' : star === 2 ? '🙁' : star === 3 ? '😐' : star === 4 ? '🙂' : '🤩'}
                </div>
                )
            )}
        </div>

        <div className='button-container'>
            <button className='submit-button' type='submit' disabled={review.length < 10 || stars === null}>Submit Your Review</button>
        </div>
        </form>
    )

}

export default ReviewFormModal;