import * as Types from '../constants/actionTypes';

export const setCartSelected = (items) => async (dispatch) => {
    dispatch({
        type: Types.SET_CART_SELECTED,
        payload: { items: items },
    });
};

export const clearCartSelected = () => async (dispatch) => {
    dispatch({
        type: Types.CLEAR_CART_SELECTED,
        payload: {},
    });
};
