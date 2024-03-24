import * as Types from '../constants/actionTypes';

export default (state = null, action) => {
    switch (action.type) {
        case Types.USER_LOGIN:
            return {
                ...action.payload.userToken,
            };

        case Types.USER_LOGOUT:
            return null;

        default:
            return state;
    }
};
