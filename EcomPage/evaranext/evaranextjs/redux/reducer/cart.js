import storage from '../../util/localStorage';
import { deleteProduct, findProductIndexById, arraysAreEqual } from '../../util/util';
import * as Types from '../constants/actionTypes';

export default (state = [], action) => {
    let index = null;

    switch (action.type) {
        case Types.INIT_LOCALSTORAGE:
            return [...action.payload.cart];

        case Types.ADD_TO_CART:
            index = state.findIndex(
                (product) =>
                    product.product === action.payload.product.product &&
                    arraysAreEqual(product.variant, action.payload.product.variant),
            );

            if (index !== -1) {
                state[index].quantity += action.payload.product.quantity ? action.payload.product.quantity : 1;
                storage.set('dokani_cart', [...state]);

                return [...state];
            } else {
                if (!action.payload.product.quantity) {
                    action.payload.product.quantity = 1;
                }
                storage.set('dokani_cart', [...state, action.payload.product]);

                return [...state, action.payload.product];
            }

        case Types.DELETE_FROM_CART:
            const newCartItems = state.filter(
                (item) =>
                    item.product !== action.payload.productId || !arraysAreEqual(item.variant, action.payload.productVariant),
            );
            //  deleteProduct(state, action.payload.productId);
            storage.set('dokani_cart', newCartItems);

            return [...newCartItems];

        case Types.INCREASE_QUANTITY:
            index = state.findIndex(
                (product) =>
                    product.product === action.payload.productId && arraysAreEqual(product.variant, action.payload.variant),
            );
            // index = findProductIndexById(state, action.payload.productId);
            if (index === -1) return state;

            state[index].quantity += action.payload.gap ? action.payload.gap : 0;
            storage.set('dokani_cart', [...state]);

            return [...state];

        case Types.DECREASE_QUANTITY:
            index = state.findIndex(
                (product) =>
                    product.product === action.payload.productId && arraysAreEqual(product.variant, action.payload.variant),
            );
            // index = findProductIndexById(state, action.payload.productId);
            if (index === -1) return state;

            const quantity = state[index].quantity + (action.payload.gap ? action.payload.gap : 0);
            console.log(quantity);
            if (quantity >= 1) {
                state[index].quantity = quantity;
            } else {
                state[index].quantity = 1;
            }
            storage.set('dokani_cart', [...state]);

            return [...state];

        case Types.CLEAR_CART:
            storage.set('dokani_cart', []);
            return [];

        default:
            return state;
    }
};
