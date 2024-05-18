import * as Types from '../constants/actionTypes';

export default (state = null, action) => {
    switch (action.type) {
        case Types.SELECTED_CONVERSATION:
            return action.payload;
        default:
            return state;
    }
};
