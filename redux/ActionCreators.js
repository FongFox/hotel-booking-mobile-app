import * as ActionTypes from './ActionTypes';
import { baseUrl } from '../shared/baseUrl';

// leaders
export const fetchLeaders = () => (dispatch) => {
    dispatch(leadersLoading());
    return fetch(baseUrl + 'leaders')
        .then((response) => {
            if (!response.ok) throw Error('Error ' + response.status + ': ' + response.statusText);
            else return response.json();
        })
        .then((leaders) => dispatch(addLeaders(leaders)))
        .catch((error) => dispatch(leadersFailed(error.message)));
};
const leadersLoading = () => ({
    type: ActionTypes.LEADERS_LOADING
});
const leadersFailed = (errmess) => ({
    type: ActionTypes.LEADERS_FAILED,
    payload: errmess
});
const addLeaders = (leaders) => ({
    type: ActionTypes.ADD_LEADERS,
    payload: leaders
});

// hotels
export const fetchHotels = () => (dispatch) => {
    dispatch(hotelsLoading());
    return fetch(baseUrl + 'hotels')
        .then((response) => {
            if (!response.ok) throw Error('Error ' + response.status + ': ' + response.statusText);
            else return response.json();
        })
        .then((hotels) => dispatch(addHotels(hotels)))
        .catch((error) => dispatch(hotelsFailed(error.message)));
};
const hotelsLoading = () => ({
    type: ActionTypes.HOTELS_LOADING
});
const hotelsFailed = (errmess) => ({
    type: ActionTypes.HOTELS_FAILED,
    payload: errmess
});
const addHotels = (hotels) => ({
    type: ActionTypes.ADD_HOTELS,
    payload: hotels
});

// comments
export const fetchComments = () => (dispatch) => {
    return fetch(baseUrl + 'comments')
        .then((response) => {
            if (!response.ok) throw Error('Error ' + response.status + ': ' + response.statusText);
            else return response.json();
        })
        .then((comments) => dispatch(addComments(comments)))
        .catch((error) => dispatch(commentsFailed(error.message)));
};
const addComments = (comments) => ({
    type: ActionTypes.ADD_COMMENTS,
    payload: comments
});
export const postComment = (hotelId, rating, author, comment) => (dispatch) => {
    var newcmt = { hotelId: hotelId, rating: rating, author: author, comment: comment, date: new Date().toISOString() };
    dispatch(addComment(newcmt));
};
const addComment = (newcmt) => ({
    type: ActionTypes.ADD_COMMENT,
    payload: newcmt
});
const commentsFailed = (errmess) => ({
    type: ActionTypes.COMMENTS_FAILED,
    payload: errmess
});

// promotions
export const fetchPromos = () => (dispatch) => {
    dispatch(promosLoading());
    return fetch(baseUrl + 'promotions')
        .then((response) => {
            if (!response.ok) throw Error('Error ' + response.status + ': ' + response.statusText);
            else return response.json();
        })
        .then((promos) => dispatch(addPromos(promos)))
        .catch((error) => dispatch(promosFailed(error.message)));
};
const promosLoading = () => ({
    type: ActionTypes.PROMOS_LOADING
});
const promosFailed = (errmess) => ({
    type: ActionTypes.PROMOS_FAILED,
    payload: errmess
});
const addPromos = (promos) => ({
    type: ActionTypes.ADD_PROMOS,
    payload: promos
});

// favorites
export const postFavorite = (hotelId) => (dispatch) => {
    dispatch(addFavorite(hotelId));
};
const addFavorite = (hotelId) => ({
    type: ActionTypes.ADD_FAVORITE,
    payload: hotelId
});