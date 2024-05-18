import * as Types from '../constants/actionTypes';
import storage from '../../util/localStorage';
import axiosInstance from '../../config/axiosInstance';

export const addToCart = (product, user) => async (dispatch) => {
    try {
        if (user) {
            await axiosInstance.post('/api/cart/', {
                product: product.product,
                variant: product.variant,
                quantity: product.quantity,
            });
        } else {
            const result = await axiosInstance.get(`/api/product/${product.product}`);
            const pTagList = result.data.data.tag.split(',').map((tag) => tag.trim());
            const pushHistoryTag = async () => {
                for (let i = 0; i < pTagList.length; i++) {
                    dispatch({
                        type: Types.ADD_TAG_HISTORY,
                        payload: { name: pTagList[i], score: 10 },
                    });
                }
            };
            pushHistoryTag();
        }
        dispatch({
            type: Types.ADD_TO_CART,
            payload: { product },
        });
    } catch (err) {
        console.error(err);
    }
};

export const deleteFromCart = (productId, productVariant, user) => async (dispatch) => {
    try {
        if (user) {
            await axiosInstance.put('/api/cart/', {
                product: productId,
                variant: productVariant,
            });
        } else {
            const result = await axiosInstance.get(`/api/product/${productId}`);
            const pTagList = result.data.data.tag.split(',').map((tag) => tag.trim());
            const pushHistoryTag = async () => {
                for (let i = 0; i < pTagList.length; i++) {
                    dispatch({
                        type: Types.ADD_TAG_HISTORY,
                        payload: { name: pTagList[i], score: -10 },
                    });
                }
            };
            pushHistoryTag();
        }
        dispatch({
            type: Types.DELETE_FROM_CART,
            payload: { productId, productVariant },
        });
    } catch (err) {
        console.error(err);
    }
};

export const increaseQuantity = (productId, variant, gap, user) => async (dispatch) => {
    try {
        if (user) {
            await axiosInstance.patch('/api/cart/', {
                product: productId,
                variant: variant,
                gap: gap,
            });
        }
        dispatch({
            type: Types.INCREASE_QUANTITY,
            payload: { productId, variant, gap },
        });
    } catch (err) {
        console.error(err);
    }
};

export const decreaseQuantity = (productId, variant, gap, user) => async (dispatch) => {
    try {
        if (user) {
            await axiosInstance.patch('/api/cart/', {
                product: productId,
                variant: variant,
                gap: gap,
            });
        }
        dispatch({
            type: Types.DECREASE_QUANTITY,
            payload: { productId, variant, gap },
        });
    } catch (err) {
        console.error(err);
    }
};

export const openCart = () => (dispatch) => {
    dispatch({
        type: Types.OPEN_CART,
    });
};

export const clearCart = (user) => async (dispatch) => {
    try {
        if (user) {
            await axiosInstance.delete('/api/cart/');
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
