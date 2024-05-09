import * as Types from '../constants/actionTypes';
import storage from '../../util/localStorage';

export default (state = null, action) => {
    switch (action.type) {
        case Types.USER_LOGIN:
            localStorage.setItem('dokani_userId', action.payload.userId);
            return action.payload.userId;

        case Types.USER_LOGOUT:
            localStorage.removeItem('dokani_userId', null);
            return null;

        default:
            return state;
    }
};
