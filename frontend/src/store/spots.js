import { csrfFetch } from "./csrf";

const GET_SPOTS = 'GET_SPOTS';
const GET_SPOT_BY_ID = 'GET_SPOT_BY_ID';
const ADD_NEW_SPOT  = 'ADD_NEW_SPOT';
const GET_SPOT_REVIEWS = 'GET_SPOT_REVIEWS';

//Actions--------------------------------------------------------------------------------------
export const getSpots = spots => ({
    type: GET_SPOTS,
    payload: spots
});

export const getSpotsById = spot => ({
    type: GET_SPOT_BY_ID,
    payload: spot
});

export const addNewSpot = newSpot => ({
    type: ADD_NEW_SPOT,
    payload: newSpot
});

export const viewSpotReviews = reviews => ({
    type: GET_SPOT_REVIEWS,
    payload: reviews
});


//Thunks----------------------------------------------------------------------------------------
export const fetchSpots = () => async(dispatch) => {
    try{
        const res = await fetch('/api/spots');
        if(!res.ok){
            throw new Error('Could not retrieve spots');
        }
        const spots = await res.json();
        dispatch(getSpots(spots));
    } catch(error) {
        console.error(error)
    }
};

export const fetchASpot = (spotId) => async(dispatch) => {
    const res = await fetch(`/api/spots/${spotId}`)
    const spot = await res.json();
    // console.log('fetchASpot-----> ', spot)                   //   <-----------------------------
    dispatch(getSpotsById(spot));
}

export const createSpot = (userInput) => async(dispatch) => {
    const res = await csrfFetch('/api/spots', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userInput)
    })
    console.log('RES FOR CreateSpot -------------> ', res)    //  <-------------------------------

    if(!res.ok){
        const errors = await res.json()
        dispatch(addNewSpot(errors))
    }
    const newSpot = await res.json()
    dispatch(addNewSpot(newSpot))
}

export const fetchReviews = (spotId) => async(dispatch) => {
    const res = await fetch(`api/spots/${spotId}/reviews`)
    const reviews = await res.json()
    dispatch(viewSpotReviews(reviews))
}


//REDUCER----------------------------------------------------------------------------------------
const spotsReducer = (state={}, action) => {
    switch(action.type){
        case GET_SPOTS: {
            const newState = {...state};
            action.payload.Spots.forEach(spot => {
                newState[spot.id] = spot;
            });
            return newState;
        }
        case GET_SPOT_BY_ID: {
            const newState = {...state};
            const spot = action.payload;
            newState.spotById = spot;
            return newState;
        }
        case GET_SPOT_REVIEWS:{
            const newState = {...state};
            const allReviews = action.payload.Reviews
            newState.reviews = allReviews
            return newState
        }
        case ADD_NEW_SPOT: {
            const newState = {...state};
            return newState
        }
        default:
            return state;
    }
};

export default spotsReducer;