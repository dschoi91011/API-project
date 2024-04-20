const GET_SPOTS = 'GET_SPOTS';

export const getSpots = spots => ({
    type: GET_SPOTS,
    payload: spots
});

export const fetchSpots = () => async(dispatch) => {
    try{
        const res = await fetch('api/spots');
        if(!res.ok){
            throw new Error('Could not retrieve spots');
        }
        const spots = await res.json();
        dispatch(getSpots(spots));
    } catch(error) {
        console.error(error)
    }
};

const spotsReducer = (state={}, action) => {
    switch(action.type){
        case GET_SPOTS: {
            const newState = {};
            action.payload.Spots.forEach(spot => {
                newState[spot.id] = spot;
            });
            return newState
        }
        // default:
    }
    return state;
};

export default spotsReducer;