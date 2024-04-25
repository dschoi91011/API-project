import { useModal } from '../../context/Modal';
import { useDispatch } from 'react-redux';

function DeleteFormModal(){
const {closeModal} = useModal()
const dispatch = useDispatch()

const handleSubmit = (e) => {
    e.preventDefault()
}

    return(
        <form onSubmit={handleSubmit}>
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to remove this spot?</p>
            <button>Yes (Delete Spot)</button>
            <button>No (Keep Spot)</button>
        </form>

    )


}

export default DeleteFormModal;