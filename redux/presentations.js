import * as ActionTypes from './ActionTypes';

export const presentations = (state = { isLoading: true, errMess: null, presentations: [] }, action) => {
    switch (action.type) {
        case ActionTypes.ADD_PRESENTATIONS:
            return { ...state, isLoading: false, errMess: null, presentations: action.payload };

        case ActionTypes.PRESENTATIONS_LOADING:
            return { ...state, isLoading: true, errMess: null, presentations: [] };

        case ActionTypes.PRESENTATIONS_FAILED:
            return { ...state, isLoading: false, errMess: action.payload, presentations: [] };

        default:
            return state;
    }
};
