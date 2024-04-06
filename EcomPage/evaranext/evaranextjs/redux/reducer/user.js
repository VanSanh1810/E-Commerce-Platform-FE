import * as Types from '../constants/actionTypes';
import storage from '../../util/localStorage';

export default (state = null, action) => {
    switch (action.type) {
        case Types.USER_LOGIN:
            localStorage.setItem('dokani_user', action.payload.userToken);
            return action.payload.userToken;

        case Types.USER_LOGOUT:
            localStorage.removeItem('dokani_user', null);
            return null;

        default:
            return state;
    }
};
