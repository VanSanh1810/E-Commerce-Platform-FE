import * as Types from '../constants/actionTypes';
import storage from '../../util/localStorage';

export const addToCart = (product, user) => async (dispatch) => {
    try {
        if (user) {
        }
        dispatch({
            type: Types.ADD_TO_CART,
            payload: { product },
        });
    } catch (err) {
        console.error(err);
    }
};

export const deleteFromCart = (productId, user) => async (dispatch) => {
    try {
        if (user) {
        }
        dispatch({
            type: Types.DELETE_FROM_CART,
            payload: { productId },
        });
    } catch (err) {
        console.error(err);
    }
};

export const increaseQuantity = (productId) => (dispatch) => {
    dispatch({
        type: Types.INCREASE_QUANTITY,
        payload: { productId },
    });
};

export const decreaseQuantity = (productId) => (dispatch) => {
    dispatch({
        type: Types.DECREASE_QUANTITY,
        payload: { productId },
    });
};

export const openCart = () => (dispatch) => {
    dispatch({
        type: Types.OPEN_CART,
    });
};

export const clearCart = (user) => async (dispatch) => {
    try {
        if (user) {
        }
        dispatch({
            type: Types.CLEAR_CART,
        });
    } catch (err) {
        console.error(err);
    }
};

export const closeCart = () => (dispatch) => {
    dispatch({
        type: Types.CLOSE_CART,
    });
};
