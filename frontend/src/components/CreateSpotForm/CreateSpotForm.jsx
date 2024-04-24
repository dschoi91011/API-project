import {useState} from "react";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {createSpot} from '../../store/spots';

function CreateSpotForm(){
    // const dispatch = useDispatch();
    const redirect = useNavigate();
    // const currentUser = useSelector(state => state.session.user);

    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [country, setCountry] = useState('')
    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [description, setDescription] = useState('')
    const [inputError, setInputError] = useState({})
    const dispatch = useDispatch()

    // useEffect(() => {
        // const errorObj = {};
        // if(!address) errorObj.address = 'Address is required'
        // if(!city) errorObj.city = 'City is required'
        // if(!state) errorObj.state = 'State is required'
        // if(!country) errorObj.country = 'Country is required'
        // if(!name) errorObj.name = 'Name is required'
        // if(!price) errorObj.price = 'Price per night is required'
        // if(description.length < 30) errorObj.description = 'Description needs 30 or more characters'
        // setInputError(errorObj)

        //if errorObject has errors --> fetch

    // }, [address, city, state, country, name, price, description]);

    const handleSubmit = async (e) => {
        e.preventDefault()
        const userInput = {address, city, state, country, name, price, description}

        const newSpot = await dispatch(createSpot(userInput))
        console.log('newSpot ---------> ', newSpot)
        if(!newSpot.errors){
            redirect(`/spots/${newSpot.id}`)
        } else {
            setInputError(newSpot.errors)
            console.log('CreateSpotForm inputError------>', inputError)
        }

    }

    return(
        <form onSubmit={handleSubmit}>
        <h1>Create a New Spot</h1>
        <div id='create-spot-form-section1'>
            <h3 className='section-form-title'>Where&apos;s your place located?</h3>
            <p className='section-caption'>Guests will only get your exact address once they booked a reservation.</p>
            <label htmlFor="country"><input id="country" type="text" placeholder="Country" value={country} onChange={e => setCountry(e.target.value)}/></label>

            <label htmlFor="address"><input id="address" type="text" placeholder="Street Address" value={address} onChange={e => setAddress(e.target.value)}/></label>

            <label htmlFor="city"><input id="city" type="text" placeholder="City" value={city} onChange={e => setCity(e.target.value)}/></label>

            <label htmlFor="state"><input id="state" type="text" placeholder="State" value={state} onChange={e => setState(e.target.value)}/></label>


        </div>
        <div id='create-spot-form-section2'>
            <h3 className='section-form-title'>Describe your place to guests</h3>
            <p className='section-caption'>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
            <label htmlFor="description"><textarea id="description" rows='2' cols='100' placeholder="Please write at least 30 characters" value={description}
            onChange={e => setDescription(e.target.value)}/></label>
  

        </div>
        <div id='create-spot-form-section3'>
            <h3 className='section-form-title'>Create a title for your spot</h3>
            <p className='section-caption'>Catch guests&apos; attention with a spot title that highlights what makes your place special.</p>
            <label htmlFor="spotname"><input id="spotname" type="text" placeholder="Name of your spot" value={name} onChange={e => setName(e.target.value)}/></label>


        </div>
        <div id='create-spot-form-section4'>
            <h3 className='section-form-title'>Set a base price for your spot</h3>
            <p className='section-caption'>Competitive pricing can help your listing stand out and rank higher in search results.</p>
            <label htmlFor="price"><input id="price" type="number" placeholder="Price per night (USD)" value={price} onChange={e => setPrice(e.target.value)}/></label>


        </div>
        <div id='create-spot-form-section5'>
            <h3 className='section-form-title'>Liven up your spot with photos</h3>
            <p className='section-caption'>Submit a link to at least one photo to publish your spot.</p>
            <label htmlFor="main-img"><input id="main-img" type="text" placeholder="Preview Image URL"/></label>
            <label htmlFor="img1"><input id="img1" type="text" placeholder="Image URL"/></label>
            <label htmlFor="img2"><input id="img2" type="text" placeholder="Image URL"/></label>
            <label htmlFor="img3"><input id="img3" type="text" placeholder="Image URL"/></label>
            <label htmlFor="img4"><input id="img4" type="text" placeholder="Image URL"/></label>

        </div>
        <button type='submit'>Create Spot</button>
        </form>
    )
}

export default CreateSpotForm;