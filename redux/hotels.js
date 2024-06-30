import * as ActionTypes from './ActionTypes';

export const hotels = (state = { isLoading: true, errMess: null, hotels: [] }, action) => {
    switch (action.type) {
        case ActionTypes.ADD_HOTELS:
            return { ...state, isLoading: false, errMess: null, hotels: action.payload };
        case ActionTypes.HOTELS_LOADING:
            return { ...state, isLoading: true, errMess: null, hotels: [] }
        case ActionTypes.HOTELS_FAILED:
            return { ...state, isLoading: false, errMess: action.payload };
        default:
            return state;
    }
};