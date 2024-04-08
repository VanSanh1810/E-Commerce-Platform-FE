import { createSlice } from '@reduxjs/toolkit';

const AdToken = localStorage.getItem('adminToken');

const authReducer = createSlice({
    name: 'authReducer',
    initialState: {
        // adminToken: AdToken ? AdToken : 'null',
        adminToken: '',
        isVendor: true,
        shopId: '',
    },
    reducers: {
        setAdminToken: (state, action) => {
            state.adminToken = action.payload;
            localStorage.setItem('adminToken', action.payload);
        },
        setRole: (state, action) => {
            state.isVendor = action.payload === 'vendor' ? true : false;
            localStorage.setItem('adminToken', action.payload);
        },
        setShopId: (state, action) =>  {
            state.shopId = action.payload;
        },
        logout: (state, { payload }) => {
            localStorage.removeItem('adminToken');
            state.adminToken = null;
            state.shopId = null;
        },
    },
});
export const { setAdminToken, setRole, setShopId, logout } = authReducer.actions;
export default authReducer.reducer;
