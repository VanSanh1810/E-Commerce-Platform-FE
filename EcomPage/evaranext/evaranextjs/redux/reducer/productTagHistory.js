import * as Types from '../constants/actionTypes';
import storage from '../../util/localStorage';

export default (state = [], action) => {
    switch (action.type) {
        case Types.INIT_TAG_HISTORY:
            localStorage.setItem('dokani_tag_history', JSON.stringify([...action.payload]));
            return [...action.payload];
        case Types.ADD_TAG_HISTORY:
            const temp = [...state];
            const index = temp.findIndex((item) => item.name === action.payload.name);
            if (index !== -1) {
                temp[index].score += parseInt(action.payload.score);
            } else {
                temp.push({ name: action.payload.name, score: parseInt(action.payload.score) });
            }
            //
            localStorage.setItem('dokani_tag_history', JSON.stringify([...temp]));
            return [...temp];
        case Types.CLEAR_TAG_HISTORY:
            localStorage.removeItem('dokani_tag_history', JSON.stringify([]));
            return [];
        default:
            return state;
    }
};
