import { csrfFetch } from "./csrf";

const GET_SPOTS = 'GET_SPOTS';
const GET_SPOT_BY_ID = 'GET_SPOT_BY_ID';
const ADD_NEW_SPOT = 'ADD_NEW_SPOT';
const GET_SPOT_REVIEWS = 'GET_SPOT_REVIEWS';
const GET_SPOTS_BY_OWNER = 'GET_SPOTS_BY_OWNER';

//GET ALL SPOTS----------------------------------------------------------------------------------------
export const getSpots = spots => ({
    type: GET_SPOTS,
    payload: spots
});

export const fetchSpots = () => async(dispatch) => {
    // try{
        const res = await fetch('/api/spots');
        // if(!res.ok){
        //     throw new Error('Could not retrieve spots');
        // }
        const spots = await res.json();
        dispatch(getSpots(spots));
    // } catch(error) {
    //     console.error(error)
    // }
};

//GET SPOT BY ID-----------------------------------------------------------------------------------------
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

export const createSpot = (userInput) => async(dispatch) => {
    const res = await csrfFetch('/api/spots', {                 
        method: 'POST',
        body: JSON.stringify(userInput)
    })
    console.log('RES FOR CreateSpot -------------> ', res)    //  <--------------
    if(!res.ok){
        const errors = await res.json()
        dispatch(addNewSpot(errors))
    }
    const newSpot = await res.json()
    dispatch(addNewSpot(newSpot))
}

//GET SPOT REVIEWS-------------------------------------------------------------------------------------------
export const viewSpotReviews = reviews => ({
    type: GET_SPOT_REVIEWS,
    payload: reviews
});

export const fetchReviews = (spotId) => async(dispatch) => {
    const res = await fetch(`api/spots/${spotId}/reviews`)
    const reviews = await res.json()
    dispatch(viewSpotReviews(reviews))
}

//GET SPOTS BY OWNER------------------------------------------------------------------------------------------
export const getSpotsByOwner = spots => ({
    type: GET_SPOTS_BY_OWNER,
    payload: spots
});

export const fetchSpotsByOwner = () => async(dispatch) => {
    const res = await csrfFetch('api/spots/current')
    const spots = await res.json()
    dispatch(getSpotsByOwner(spots))
}

//REDUCER----------------------------------------------------------------------------------------
const initialState = {allSpots: {}, oneSpot: {}, userSpots: {}}

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
        case GET_SPOTS_BY_OWNER:{
            const newState = {...state};
            action.payload.Spots.forEach(spot => {
                newState.userSpots[spot.id] = spot
            })
            return newState
        }
        default:
            return state;
    }
};

export default spotsReducer;