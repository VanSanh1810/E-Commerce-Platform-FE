import { createSlice } from '@reduxjs/toolkit';

const notifyReducer = createSlice({
    name: 'notificationReducer',
    initialState: {
        // adminToken: AdToken ? AdToken : 'null',
        notificationList: [],
        newNotifiCount: 0,
        //message
        reloadListener: false,
        newMessCount: 0,
    },
    reducers: {
        setReload: (state, action) => {
            state.reloadListener = !state.reloadListener;
        },
        setNewMessCount: (state, action) => {
            state.newMessCount = action.payload;
        },
        initNotificationsList: (state, action) => {
            state.notificationList = [...action.payload];
            state.newNotifiCount = [...action.payload].reduce((acc, curr) => (!curr.isSeen ? acc + 1 : acc), 0);
        },
        setNotificationList: (state, action) => {
            state.notificationList = [{ ...action.payload }, ...state.notificationList];
            state.newNotifiCount = state.newNotifiCount + 1;
        },
        changeNotifiCount: (state, action) => {
            state.newNotifiCount = state.newNotifiCount + action.payload;
        },
        clearNotificationList: (state, action) => {
            state.notificationList = [];
            state.newNotifiCount = 0;
        },
    },
});
export const { setNotificationList, clearNotificationList, initNotificationsList, setReload, setNewMessCount } =
    notifyReducer.actions;
export default notifyReducer.reducer;
