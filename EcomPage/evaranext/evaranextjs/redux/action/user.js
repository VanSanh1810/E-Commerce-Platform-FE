import axios from 'axios';
import * as Types from '../constants/actionTypes';

// login
export const userLogin = (loginData) => async (dispatch) => {
    try {
        // const { data } = await axios.post(url, filters);

        dispatch({
            type: Types.USER_LOGIN,
            payload: { userToken: loginData },
        });
    } catch (error) {
        console.log(error);
    }
};

// logout
export const userLogout = () => async (dispatch) => {
    dispatch({
        type: Types.USER_LOGOUT,
        payload: null,
    });
};
