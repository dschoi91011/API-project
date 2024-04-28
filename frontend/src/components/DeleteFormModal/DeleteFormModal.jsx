import { useModal } from '../../context/Modal';
import { useDispatch } from 'react-redux';
import {deleteSpot} from '../../store/spots';
import './DeleteFormModal.css';

function DeleteFormModal({spotId}){

    const {closeModal} = useModal()
    const dispatch = useDispatch()

    const handleSubmit = async() => {
        
        await dispatch(deleteSpot(spotId))
        closeModal()
    }

    return(
        <div className='modal-container'>
            <h1 className='title'>Confirm Delete</h1>
            <p>Are you sure you want to remove this spot?</p>
            <div className='buttons-container'>
                <button id='yes-btn' onClick={handleSubmit}>Yes (Delete Spot)</button>
                <button id='no-btn' onClick={closeModal}>No (Keep Spot)</button>
            </div>
        </div>

    )

}

export default DeleteFormModal;