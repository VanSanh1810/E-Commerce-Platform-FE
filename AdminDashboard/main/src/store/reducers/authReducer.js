import { createSlice } from '@reduxjs/toolkit';

const AdToken = localStorage.getItem('adminToken');

const authReducer = createSlice({
    name: 'authReducer',
    initialState: {
        // adminToken: AdToken ? AdToken : 'null',
        adminToken: '',
        userId: '',
        isVendor: true,
        shopId: '',
    },
    reducers: {
        setUserId: (state, action) => {
            state.userId = action.payload;
            localStorage.setItem('userId', action.payload);
        },
        setAdminToken: (state, action) => {
            state.adminToken = action.payload;
            localStorage.setItem('adminToken', action.payload);
        },
        setRole: (state, action) => {
            state.isVendor = action.payload === 'vendor' ? true : false;
            localStorage.setItem('_role', action.payload);
        },
        setShopId: (state, action) => {
            state.shopId = action.payload;
        },
        logout: (state, { payload }) => {
            localStorage.removeItem('userId');
            localStorage.removeItem('adminToken');
            localStorage.removeItem('_role');
            state.adminToken = null;
            state.shopId = null;
            state.userId = null;
        },
    },
});
export const { setAdminToken, setRole, setShopId, setUserId, logout } = authReducer.actions;
export default authReducer.reducer;
