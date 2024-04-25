import { useModal } from '../../context/Modal';
import { useDispatch } from 'react-redux';
import {deleteSpot} from '../../store/spots';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function DeleteFormModal({spotId}){
    const redirect = useNavigate()
    const {closeModal} = useModal()
    const dispatch = useDispatch()
    const spot = useSelector(state => state.spots)

    const handleSubmit = async(e) => {

        await dispatch(deleteSpot(spotId))
        redirect('/')
        closeModal()
    }

    return(
        <div>
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to remove this spot?</p>
            <button onClick={handleSubmit}>Yes (Delete Spot)</button>
            <button onClick={closeModal}>No (Keep Spot)</button>
        </div>

    )


}

export default DeleteFormModal;