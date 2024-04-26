import { csrfFetch } from "./csrf";

const GET_SPOT_REVIEWS = 'GET_SPOT_REVIEWS';
const CREATE_REVIEW = 'CREATE_REVIEW';

//FETCH SPOT REVIEWS--------------------------------------------------------------------
export const viewSpotReviews = reviews => ({
    type: GET_SPOT_REVIEWS,
    payload: reviews
});

export const fetchReviews = (spotId) => async(dispatch) => {
    const res = await fetch(`/api/spots/${spotId}/reviews`)
    const reviews = await res.json()
    dispatch(viewSpotReviews(reviews))
}

//CREATE REVIEW--------------------------------------------------------------------------
export const reviewAdded = review => ({
    type: CREATE_REVIEW,
    payload: review
});

export const createReview = (userReview, spotId) => async(dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        body: JSON.stringify(userReview)
    })
    if(res.ok){
        const newReview = await res.json()
        dispatch(reviewAdded(newReview))
        // dispatch(fetchReviews(spotId))
    }
}

//DELETE REVIEW----------------------------------------------------------------------------



//REDUCER----------------------------------------------------------------------------------
const initialState = {allSpots: {}, oneSpot: {}}

const reviewsReducer = (state=initialState, action) => {
    switch(action.type){
        case GET_SPOT_REVIEWS: {
            const newState = {...state};
            const allReviews = action.payload.Reviews
            newState.reviews = allReviews
            return newState
        }
        case CREATE_REVIEW: {
            const newState = {...state}

            return newState
        }

        default: {
            return state;
        }
    }
}

export default reviewsReducer;