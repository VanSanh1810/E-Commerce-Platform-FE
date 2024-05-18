import axiosInstance from '../../config/axiosInstance';
import * as Types from '../constants/actionTypes';
import storage from '../../util/localStorage';

// set selected conversation
export const setSelectedConversation = (conversationId) => async (dispatch) => {
    console.log(conversationId);
    dispatch({
        type: Types.SELECTED_CONVERSATION,
        payload: conversationId,
    });
};
