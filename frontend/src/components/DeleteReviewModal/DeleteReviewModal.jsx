import { useModal } from '../../context/Modal';
import { useDispatch } from 'react-redux';
import {deleteReview, fetchReviews} from '../../store/reviews';
import { fetchASpot } from '../../store/spots';


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
        <div>
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to delete this review?</p>
            <button onClick={(e) => handleSubmit(e)}>Yes (Delete Review)</button>
            <button onClick={closeModal}>No (Keep Review)</button>
        </div>
    )
}

export default DeleteReviewModal;