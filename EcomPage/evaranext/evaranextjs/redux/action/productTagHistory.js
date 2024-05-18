import axiosInstance from '../../config/axiosInstance';
import * as Types from '../constants/actionTypes';
import storage from '../../util/localStorage';

// login
export const addTagHistory = (name, score) => async (dispatch) => {
    try {
        dispatch({
            type: Types.ADD_TAG_HISTORY,
            payload: { name, score },
        });
    } catch (error) {
        console.log(error);
    }
};
