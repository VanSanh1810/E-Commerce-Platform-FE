import React, { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import * as Types from '../../redux/constants/actionTypes';
import storage from '../../util/localStorage';
import { authenticateUser } from '../../redux/action/user';

const saveStoredItems = (storedItems) => (dispatch) => {
    dispatch({
        type: Types.INIT_LOCALSTORAGE,
        payload: { ...storedItems },
    });
};

const StorageWrapper = (props) => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(authenticateUser());

        // const cart = storage.get('dokani_cart') || [];


        // const wishlist = storage.get('dokani_wishlist') || [];
        // const compare = storage.get('dokani_compare') || [];

        // props.saveStoredItems({ cart, wishlist, compare });
    }, []);

    return <>{props.children}</>;
};

export default connect(null, { saveStoredItems })(StorageWrapper);
