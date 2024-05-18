import { combineReducers } from 'redux';
import products from './product';
import cart from './cart';
import wishlist from './wishlist';
import quickView from './quickView';
import compare from './compare';
import productFilters from './productFilters';
import user from './user';
import cartSelected from './cartSelected';
import userId from './userId';
import conversation from './conversation';
import productTagHistory from './productTagHistory';

const rootReducer = combineReducers({
    products,
    cart,
    wishlist,
    quickView,
    compare,
    productFilters,
    user,
    cartSelected,
    userId,
    conversation,
    productTagHistory,
});

export default rootReducer;
