import { csrfFetch } from "./csrf";

const GET_SPOTS = 'GET_SPOTS';
const GET_SPOT_BY_ID = 'GET_SPOT_BY_ID';
const ADD_NEW_SPOT = 'ADD_NEW_SPOT';
const GET_SPOT_REVIEWS = 'GET_SPOT_REVIEWS';
const GET_SPOTS_BY_OWNER = 'GET_SPOTS_BY_OWNER';
const UPDATE_SPOT = 'UPDATE_SPOT';
const CREATE_SPOT_IMAGES = 'CREATE_SPOT_IMAGES';


//GET ALL SPOTS-----------------------------------------------------------------------------------------
export const getSpots = spots => ({
    type: GET_SPOTS,
    payload: spots
});

export const fetchSpots = () => async(dispatch) => {
        const res = await fetch('/api/spots');
        const spots = await res.json();
        dispatch(getSpots(spots));
};

//GET SPOT BY ID------------------------------------------------------------------------------------------
export const getSpotsById = spot => ({
    type: GET_SPOT_BY_ID,
    payload: spot
});

export const fetchASpot = (spotId) => async(dispatch) => {
    const res = await fetch(`/api/spots/${spotId}`)
    const spot = await res.json();
    dispatch(getSpotsById(spot));
}

//CREATE SPOT----------------------------------------------------------------------------------------------
export const addNewSpot = newSpot => ({
    type: ADD_NEW_SPOT,
    payload: newSpot
});

export const createSpot = (userInput, images, prevImg) => async(dispatch) => {
    const res = await csrfFetch('/api/spots', {                 
        method: 'POST',
        body: JSON.stringify(userInput)
    })
    const newSpot = res.json()

    await csrfFetch(`/api/spots/${spot.id}/images`, {
        method: 'POST',
        body: JSON.stringify({
            url: prevImg,
            preview: true
        })
    })

    for(let img in images){
        await csrfFetch(`/api/spots/${spot.id}/images`, {
            method: 'POST',
            body: JSON.stringify({
                url: images[img],
                preview: false
            })
        })
    }
    dispatch(addNewSpot(newSpot))
};




//GET SPOT REVIEWS-------------------------------------------------------------------------------------------
export const viewSpotReviews = reviews => ({
    type: GET_SPOT_REVIEWS,
    payload: reviews
});

export const fetchReviews = (spotId) => async(dispatch) => {
    const res = await fetch(`/api/spots/${spotId}/reviews`)
    const reviews = await res.json()
    dispatch(viewSpotReviews(reviews))
}

//GET SPOTS BY OWNER------------------------------------------------------------------------------------------
export const getSpotsByOwner = spots => ({
    type: GET_SPOTS_BY_OWNER,
    payload: spots
});

export const fetchSpotsByOwner = () => async(dispatch) => {
    const res = await csrfFetch('/api/spots/current')
    const spots = await res.json()
    dispatch(getSpotsByOwner(spots))
}

//UPDATE SPOT--------------------------------------------------------------------------------------------------
export const spotUpdated = spot => ({
    type: UPDATE_SPOT,
    payload: spot
})

export const updateSpot = (spotId, updatedObj) => async(dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'PUT',
        body: JSON.stringify(updatedObj)
    })
    const spot = await res.json()
    dispatch(spotUpdated(spot))
}

//DELETE SPOT--------------------------------------------------------------------------------------------------

export const deleteSpot = spotId => async(dispatch) => {
    await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE'
    })
    dispatch(fetchSpotsByOwner())
}

//REDUCER------------------------------------------------------------------------------------------------------
const initialState = {allSpots: {}, oneSpot: {}}

const spotsReducer = (state=initialState, action) => {
    switch(action.type){
        case GET_SPOTS: {
            const newState = {...state};
            action.payload.Spots.forEach(spot => {
                newState.allSpots[spot.id] = spot;
            });
            return newState;
        }
        case GET_SPOT_BY_ID: {
            const newState = {...state};
            const spot = action.payload;
            newState.oneSpot.spotById = spot;
            return newState;
        }
        case GET_SPOT_REVIEWS: {
            const newState = {...state};
            const allReviews = action.payload.Reviews
            newState.reviews = allReviews
            return newState
        }
        case ADD_NEW_SPOT: {
            const newState = {...state};
            const spot = action.payload
            newState.allSpots[spot.id] = spot
            return newState
        }
        case CREATE_SPOT_IMAGES: {
            return {...state, ...action.payload}
        }
        case GET_SPOTS_BY_OWNER: {
            const ownerSpots = {};
            action.payload.Spots.forEach(spot => {
                ownerSpots[spot.id] = spot
            })
            return {allSpots: {...ownerSpots}, oneSpot: {...ownerSpots}}
        }
        case UPDATE_SPOT: {
            const newState = {...state};
            const spot = action.payload;
            newState.oneSpot.spotById = spot;
            return newState;
        }
        default:
            return state;
    }
};

export default spotsReducer;