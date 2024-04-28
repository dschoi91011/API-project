import { useModal } from '../../context/Modal';
import { useDispatch } from 'react-redux';
import {deleteReview, fetchReviews} from '../../store/reviews';
import { fetchASpot } from '../../store/spots';
import './DeleteReviewModal.css';

function DeleteReviewModal({reviewId, spotId}){

    const {closeModal} = useModal()
    const dispatch = useDispatch()

    const handleSubmit = async(e) => {
        e.preventDefault()

        await dispatch(deleteReview(reviewId, spotId))
        await dispatch(fetchASpot(spotId))
        await dispatch(fetchReviews(spotId))
        closeModal()
    }


    return(
        <div className='modal-container'>
            <div className='title'>
                <h1>Confirm Delete</h1>
            </div>
            <p>Are you sure you want to delete this review?</p>
            <div className='buttons-container'>
                <button id='yes-btn' onClick={(e) => handleSubmit(e)}>Yes (Delete Review)</button>
                <button id='no-btn' onClick={closeModal}>No (Keep Review)</button>
            </div>
        </div>
    )
}

export default DeleteReviewModal;