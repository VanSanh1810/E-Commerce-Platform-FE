import axiosInstance from '../../config/axiosInstance';
import * as Types from '../constants/actionTypes';
import storage from '../../util/localStorage';

// login
export const userLogin = (loginData) => async (dispatch) => {
    try {
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

export const authenticateUser = () => {
    return async (dispatch) => {
        try {
            const storedToken = localStorage.getItem('dokani_user');
            if (storedToken) {
                console.log('Stored token', storedToken);
                const response = await axiosInstance.post('/api/auth/validate', {
                    token: storedToken,
                });
                if (response.status === 200) {
                    console.log(response.data);
                    const serverCart = await response.data.data.cart.items;
                    console.log(serverCart);
                    dispatch({ type: Types.USER_LOGIN, payload: { userToken: storedToken } }); // Cập nhật token vào Redux state
                    dispatch({
                        type: Types.INIT_LOCALSTORAGE,
                        payload: { cart: serverCart ? [...serverCart] : [], wishlist: [], compare: [] },
                    }); // Cập nhật token vào Redux state
                } else {
                    localStorage.removeItem('dokani_user');
                    dispatch({
                        type: Types.USER_LOGOUT,
                        payload: null,
                    }); // Xử lý trường hợp xác thực thất bại
                    const cart = localStorage.getItem('dokani_cart') || [];
                    dispatch({
                        type: Types.INIT_LOCALSTORAGE,
                        payload: { cart, wishlist: [], compare: [] },
                    });
                }
            } else {
                dispatch({
                    type: Types.USER_LOGOUT,
                    payload: null,
                }); // Trường hợp không có token trong localStorage
                const cart = storage.get('dokani_cart') || [];
                dispatch({
                    type: Types.INIT_LOCALSTORAGE,
                    payload: { cart, wishlist: [], compare: [] },
                });
            }
        } catch (error) {
            console.error('Error authenticating user:', error);
            dispatch({
                type: Types.USER_LOGOUT,
                payload: null,
            }); // Xử lý lỗi nếu có
        }
    };
};
