import * as Types from '../constants/actionTypes';

export default (state = [], action) => {
    switch (action.type) {
        case Types.SET_CART_SELECTED:
            return [...action.payload.items];

        case Types.CLEAR_CART_SELECTED:
            return [];

        default:
            return state;
    }
};
