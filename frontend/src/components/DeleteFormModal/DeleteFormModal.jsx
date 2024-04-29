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
            <h1 className='title' style={{fontSize: '40px'}}>Confirm Delete</h1>
            <p style={{fontSize: '30px'}}>Are you sure you want to remove this spot?</p>
            <div className='buttons-container'>
                <button id='yes-btn' style={{fontSize: '23px'}} onClick={handleSubmit}>Yes (Delete Spot)</button>
                <button id='no-btn' style={{fontSize: '23px'}} onClick={closeModal}>No (Keep Spot)</button>
            </div>
        </div>

    )

}

export default DeleteFormModal;