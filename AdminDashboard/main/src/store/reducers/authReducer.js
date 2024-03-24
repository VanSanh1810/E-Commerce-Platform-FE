import { createSlice } from '@reduxjs/toolkit';

const AdToken = localStorage.getItem('adminToken');

const authReducer = createSlice({
    name: 'authReducer',
    initialState: {
        // adminToken: AdToken ? AdToken : 'null',
        adminToken: '',
    },
    reducers: {
        setAdminToken: (state, action) => {
            state.adminToken = action.payload;
            localStorage.setItem('adminToken', action.payload);
        },
        logout: (state, { payload }) => {
            localStorage.removeItem('adminToken');
            state.adminToken = null;
        },
    },
});
export const { setAdminToken, logout } = authReducer.actions;
export default authReducer.reducer;
