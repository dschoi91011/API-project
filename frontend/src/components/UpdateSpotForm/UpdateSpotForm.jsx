import {useState, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {fetchASpot, updateSpot} from '../../store/spots';

function UpdateSpotForm(){
    const redirect = useNavigate();
    const spot = useSelector(state => state.spots.oneSpot.spotById)

    const {spotId} = useParams()
    // const [isLoaded, setIsLoaded] = useState(false)
    const [address, setAddress] = useState('')          // (spot?.address || '')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [country, setCountry] = useState('')
    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [description, setDescription] = useState('')
    const [mainImg, setMainImg] = useState('')
    const [inputError, setInputError] = useState({})
    const dispatch = useDispatch()

    useEffect(() => {
        async function getSpotData(){
           await dispatch(fetchASpot(spotId));
        //    setIsLoaded(true);
        }
        getSpotData();
    }, [dispatch, spotId]);

    useEffect(() => {
        if(spot){
            setAddress(spot.address)
            setCity(spot.city)
            setState(spot.state)
            setCountry(spot.country)
            setDescription(spot.description)
            setName(spot.name)
            setPrice(spot.price)
            setMainImg(spot.SpotImages[0].url)
        }
    }, [spot])

    function handleErrors(){
        const errorObj = {};
        if(!address) errorObj.err = 'Address is required'
        if(!city) errorObj.err = 'City is required'
        if(!state) errorObj.err = 'State is required'
        if(!country) errorObj.err = 'Country is required'
        if(!name) errorObj.err = 'Name is required'
        if(price < 1) errorObj.err = 'Price per night is required'
        if(description.length < 30) errorObj.description = 'Description needs 30 or more characters'
        if(!mainImg) errorObj.mainImg = 'Preview image is required'
        setInputError(errorObj)
        
        if(inputError.err){
            return true;
        }
        return false;
    }


    const handleSubmit = async(e) => {
        e.preventDefault()
        if(handleErrors() === true){
            return;
        }
        const updatedObj = {address, city, state, country, description, name, price, mainImg}
        await dispatch(updateSpot(spotId, updatedObj))
        redirect(`/${spot.id}`)
    }

    return(
        <form onSubmit={handleSubmit}>
        <h1 style={{fontSize: '40px'}}>Update your Spot</h1>
        <div id='update-spot-form-section1'>
            <h3 className='update-section-form-title' style={{fontSize: '30px'}}>Where&apos;s your place located?</h3>
            <p className='update-section-caption' style={{fontSize: '25px'}}>Guests will only get your exact address once they booked a reservation.</p>
            <label htmlFor="country"><input id="country" type="text" style={{height: '30px', width: '300px', fontSize: '25px'}} value={country} onChange={e => setCountry(e.target.value)}/></label>

            <label htmlFor="address"><input id="address" type="text" style={{height: '30px', width: '300px', fontSize: '25px'}} value={address} onChange={e => setAddress(e.target.value)}/></label>

            <label htmlFor="city"><input id="city" type="text" style={{height: '30px', width: '300px', fontSize: '25px'}} value={city} onChange={e => setCity(e.target.value)}/></label>

            <label htmlFor="state"><input id="state" type="text" style={{height: '30px', width: '300px', fontSize: '25px'}} value={state} onChange={e => setState(e.target.value)}/></label>


        </div>
        <div id='update-spot-form-section2'>
            <h3 className='update-section-form-title' style={{fontSize: '30px'}}>Describe your place to guests</h3>
            <p className='update-section-caption' style={{fontSize: '25px'}}>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
            <label htmlFor="description"><textarea id="description" rows='2' cols='150' style={{fontSize: '25px'}} value={description}
            onChange={e => setDescription(e.target.value)}/></label>
  

        </div>
        <div id='update-spot-form-section3'>
            <h3 className='update-section-form-title' style={{fontSize: '30px'}}>Create a title for your spot</h3>
            <p className='update-section-caption' style={{fontSize: '25px'}}>Catch guests&apos; attention with a spot title that highlights what makes your place special.</p>
            <label htmlFor="spotname"><input id="spotname" type="text" style={{height: '30px', width: '300px', fontSize: '25px'}} value={name} onChange={e => setName(e.target.value)}/></label>


        </div>
        <div id='update-spot-form-section4'>
            <h3 className='update-section-form-title' style={{fontSize: '30px'}}>Set a base price for your spot</h3>
            <p className='update-section-caption' style={{fontSize: '25px'}}>Competitive pricing can help your listing stand out and rank higher in search results.</p>
            <label htmlFor="price"><input id="price" type="number" style={{height: '30px', width: '300px', fontSize: '25px'}} value={price} onChange={e => setPrice(e.target.value)}/></label>


        </div>
        {/* <div id='update-spot-form-section5'>
            <h3 className='update-section-form-title'>Liven up your spot with photos</h3>
            <p className='update-section-caption'>Submit a link to at least one photo to publish your spot.</p>
            <label htmlFor="main-img"><input id="main-img" type="text" placeholder="Preview Image URL"/></label>
            <label htmlFor="img1"><input id="img1" type="text" placeholder="Image URL"/></label>
            <label htmlFor="img2"><input id="img2" type="text" placeholder="Image URL"/></label>
            <label htmlFor="img3"><input id="img3" type="text" placeholder="Image URL"/></label>
            <label htmlFor="img4"><input id="img4" type="text" placeholder="Image URL"/></label>

        </div> */}
        <button type='submit' style={{height: '40px', width: '150px', fontSize: '25px', margin: '20px 0px'}}>Update your Spot</button>
        </form>
    )
}

export default UpdateSpotForm;