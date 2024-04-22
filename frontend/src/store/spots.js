const GET_SPOTS = 'GET_SPOTS';
const GET_SPOT_BY_ID = 'GET_SPOT_BY_ID';

export const getSpots = spots => ({
    type: GET_SPOTS,
    payload: spots
});

export const getSpotsById = spot => ({
    type: GET_SPOT_BY_ID,
    payload: spot
})

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
    console.log('fetchASpot-----> ', spot)                   //   <-----------------------------
    dispatch(getSpotsById(spot));
}

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
        default:
            return state;
    }
};

export default spotsReducer;