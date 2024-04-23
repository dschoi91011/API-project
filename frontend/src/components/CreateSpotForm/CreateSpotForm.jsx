import {useState, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";


function CreateSpotForm({user}){
    const dispatch = useDispatch();
    const redirect = useNavigate();
    const currentUser = useSelector(state => state.session.user);

    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [country, setCountry] = useState('')
    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [description, setDescription] = useState('')
    const [error, setError] = useState({})

    useEffect(() => {
        const errorObj = {};
    }, [address, city, state, country, name, price, description]);

    const handleSubmit = (e) => {
        e.preventDefault()
        redirect()
    }

    return(
        <form onSubmit={handleSubmit}>
        <h1>Create a New Spot</h1>
        <div id='create-spot-form-section1'>
            <h2 className='section-form-title'>Where's your place located?</h2>
            <p className='section-caption'>Guests will only get your exact address once they booked a reservation.</p>

        </div>
        <div id='create-spot-form-section2'>
            <h2 className='section-form-title'>Describe your place to guests</h2>
            <p className='section-caption'>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>

        </div>
        <div id='create-spot-form-section3'>
            <h2 className='section-form-title'>Create a title for your spot</h2>
            <p className='section-caption'>Catch guests' attention with a spot title that highlights what makes your place special.</p>

        </div>
        <div id='create-spot-form-section4'>
            <h2 className='section-form-title'>Set a base price for your spot</h2>
            <p className='section-caption'>Competitive pricing can help your listing stand out and rank higher in search results.</p>

        </div>
        <div id='create-spot-form-section5'>
            <h2 className='section-form-title'>Liven up your spot with photos</h2>
            <p className='section-caption'>Submit a link to at least one photo to publish your spot.</p>

        </div>
        <button type='submit'>Create Spot</button>
        </form>
    )
}

export default CreateSpotForm;