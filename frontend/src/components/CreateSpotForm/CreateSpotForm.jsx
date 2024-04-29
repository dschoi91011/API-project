import {useState} from "react";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {createSpot} from '../../store/spots';

function CreateSpotForm(){
    const dispatch = useDispatch();
    const redirect = useNavigate();

    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [country, setCountry] = useState('')
    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [description, setDescription] = useState('')
    const [mainImg, setMainImg] = useState('')
    const [smImg1, setSmImg1] = useState('')
    const [smImg2, setSmImg2] = useState('')
    const [smImg3, setSmImg3] = useState('')
    const [smImg4, setSmImg4] = useState('')
    const [inputError, setInputError] = useState({})

    const hasErrors = () => {
        let errorObj = {};
        if(!address) errorObj.address = 'Address is required'
        if(!city) errorObj.city = 'City is required'
        if(!state) errorObj.state = 'State is required'
        if(!country) errorObj.country = 'Country is required'
        if(!name) errorObj.name = 'Name is required'
        if(!price || price < 1) errorObj.price = 'Price per night is required, and must be greater than 0'
        if(description.length < 30) errorObj.description = 'Description needs 30 or more characters'
        if(!mainImg) errorObj.mainImg = 'Preview image is required'
        return errorObj
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        const newErr = hasErrors()
        setInputError(newErr)
        
        if(Object.keys(newErr).length === 0){
            const userInput = {address, city, state, country, name, price, description, lat: 0, lng: 0}
            const images = {smImg1, smImg2, smImg3, smImg4}
            const prevImg = mainImg

            // for(let img in images){
            //     if(!img) images[img] = '/chicken-no-img.jpg'
            // }

            const newSpot = await dispatch(createSpot(userInput, images, prevImg))
            redirect(`/${newSpot.id}`)
        }
        // if(Object.keys(newErr).length === 0){
        //     const images = [mainImg, smImg1, smImg2, smImg3, smImg4]
        //     const userInput = {address, city, state, country, name, price, description, lat: 0, lng: 0}
        //     const newSpot = await dispatch(createSpot(userInput, images))
        //     if(newSpot) redirect(`/spots/${newSpot.id}`)
        // }

    }

    return(
        <form onSubmit={handleSubmit}>
        <h1 style={{fontSize: '40px'}}>Create a New Spot</h1>

        <div id='create-spot-form-section1'>
            <h3 className='section-form-title' style={{fontSize: '30px'}}>Where&apos;s your place located?</h3>
            <p className='section-caption' style={{fontSize: '25px'}}>Guests will only get your exact address once they booked a reservation.</p>
            <label htmlFor="country"><input id="country" type="text" placeholder="Country" style={{height: '30px', width: '300px', fontSize: '25px'}} value={country} onChange={e => setCountry(e.target.value)}/></label>
            {inputError.country && <p style={{color: 'red', fontSize: '22px'}}>{inputError.country}</p>}
            <label htmlFor="address"><input id="address" type="text" placeholder="Street Address" style={{height: '30px', width: '300px', fontSize: '25px'}} value={address} onChange={e => setAddress(e.target.value)}/></label>
            {inputError.address && <p style={{color: 'red', fontSize: '22px'}}>{inputError.address}</p>}
            <label htmlFor="city"><input id="city" type="text" placeholder="City" style={{height: '30px', width: '300px', fontSize: '25px'}} value={city} onChange={e => setCity(e.target.value)}/></label>
            {inputError.city && <p style={{color: 'red', fontSize: '22px'}}>{inputError.city}</p>}
            <label htmlFor="state"><input id="state" type="text" placeholder="State" style={{height: '30px', width: '300px', fontSize: '25px'}} value={state} onChange={e => setState(e.target.value)}/></label>
            {inputError.state && <p style={{color: 'red', fontSize: '22px'}}>{inputError.state}</p>}

        </div>
        <div id='create-spot-form-section2'>
            <h3 className='section-form-title' style={{fontSize: '30px'}}>Describe your place to guests</h3>
            <p className='section-caption' style={{fontSize: '25px'}}>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
            <label htmlFor="description"><textarea id="description" rows='2' cols='150' placeholder="Please write at least 30 characters" style={{fontSize: '25px'}}value={description}
            onChange={e => setDescription(e.target.value)}/></label>
            {inputError.description && <p style={{color: 'red', fontSize: '22px'}}>{inputError.description}</p>}

        </div>
        <div id='create-spot-form-section3'>
            <h3 className='section-form-title' style={{fontSize: '30px'}}>Create a title for your spot</h3>
            <p className='section-caption' style={{fontSize: '25px'}}>Catch guests&apos; attention with a spot title that highlights what makes your place special.</p>
            <label htmlFor="spotname"><input id="spotname" type="text" placeholder="Name of your spot" style={{height: '30px', width: '300px', fontSize: '25px'}} value={name} onChange={e => setName(e.target.value)}/></label>
            {inputError.name && <p style={{color: 'red', fontSize: '22px'}}>{inputError.name}</p>}

        </div>
        <div id='create-spot-form-section4'>
            <h3 className='section-form-title' style={{fontSize: '30px'}}>Set a base price for your spot</h3>
            <p className='section-caption' style={{fontSize: '25px'}}>Competitive pricing can help your listing stand out and rank higher in search results.</p>
            <label htmlFor="price"><input id="price" type="number" placeholder="Price per night (USD)" style={{height: '30px', width: '300px', fontSize: '25px'}} value={price} onChange={e => setPrice(e.target.value)}/></label>
            {inputError.price && <p style={{color: 'red', fontSize: '22px'}}>{inputError.price}</p>}

        </div>
        <div id='create-spot-form-section5'>
            <h3 className='section-form-title' style={{fontSize: '30px'}}>Liven up your spot with photos</h3>
            <p className='section-caption' style={{fontSize: '25px'}}>Submit a link to at least one photo to publish your spot.</p>
            <label htmlFor="main-img"><input id="main-img" type="text" placeholder="Preview Image URL" style={{height: '30px', width: '300px', fontSize: '25px'}} value={mainImg} onChange={e => setMainImg(e.target.value)}/></label>
            {inputError.mainImg && <p style={{color: 'red', fontSize: '22px'}}>{inputError.mainImg}</p>}

            <label htmlFor="img1"><input id="img1" type="text" placeholder="Image URL" style={{height: '30px', width: '300px', fontSize: '25px'}}
            value={smImg1 === '' ? '' : smImg1} defaultValue={smImg1 === '' ? '/chicken-no-img.jpg' : undefined} onChange={e => setSmImg1(e.target.value)}/></label>
            <label htmlFor="img2"><input id="img2" type="text" placeholder="Image URL" style={{height: '30px', width: '300px', fontSize: '25px'}}
            value={smImg2 === '' ? '' : smImg2} defaultValue={smImg2 === '' ? '/chicken-no-img.jpg' : undefined} onChange={e => setSmImg2(e.target.value)}/></label>
            <label htmlFor="img3"><input id="img3" type="text" placeholder="Image URL" style={{height: '30px', width: '300px', fontSize: '25px'}}
            value={smImg3 === '' ? '' : smImg3} defaultValue={smImg3 === '' ? '/chicken-no-img.jpg' : undefined} onChange={e => setSmImg3(e.target.value)}/></label>
            <label htmlFor="img4"><input id="img4" type="text" placeholder="Image URL" style={{height: '30px', width: '300px', fontSize: '25px'}}
            value={smImg4 === '' ? '' : smImg4} defaultValue={smImg4 === '' ? '/chicken-no-img.jpg' : undefined} onChange={e => setSmImg4(e.target.value)}/></label>

            {/* <label htmlFor="img1"><input id="img1" type="text" placeholder="Image URL" value={smImg1} onChange={e => setSmImg4(e.target.value)}/></label>
            <label htmlFor="img2"><input id="img2" type="text" placeholder="Image URL" value={smImg2} onChange={e => setSmImg4(e.target.value)}/></label>
            <label htmlFor="img3"><input id="img3" type="text" placeholder="Image URL" value={smImg3} onChange={e => setSmImg4(e.target.value)}/></label>
            <label htmlFor="img4"><input id="img4" type="text" placeholder="Image URL" value={smImg4} onChange={e => setSmImg4(e.target.value)}/></label> */}

        </div>
        <button type='submit' style={{height: '40px', width: '100px', fontSize: '25px', margin: '20px 0px'}}>Create Spot</button>
        </form>
    )
}

export default CreateSpotForm;