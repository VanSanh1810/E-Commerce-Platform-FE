import 'react-perfect-scrollbar/dist/css/styles.css';
import { Provider, useDispatch } from 'react-redux';
import 'react-responsive-modal/styles.css';
import store from '../redux/store';
import StorageWrapper from '../components/ecommerce/storage-wrapper';
import '../public/assets/css/main.css';
import '../public/assets/css/_orderDetail.css';
import '../components/layout/ModalWindow/modalChat.css';
import React, { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

// Swiper Slider
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Preloader from './../components/elements/Preloader';
import storage from '../util/localStorage';
import axiosInstance from '../config/axiosInstance';
import * as Types from '../redux/constants/actionTypes';
import { SocketIOProvider } from '../contexts/SocketIOContext';

const MyApp = ({ Component, pageProps }) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // setLoading(true);
        // setTimeout(() => {
        //     setLoading(false);
        // }, 2000);
        // if (typeof window !== 'undefined') {
        //     window.WOW = require('wowjs');
        // }
        // new WOW.WOW().init();
        console.log('ready');
    }, []);
    return (
        <Provider store={store}>
            <StorageWrapper>
                <SocketIOProvider>
                    <div>
                        <ToastContainer />
                        <Component {...pageProps} />
                    </div>
                    {/* {!loading ? (
                        <div>
                            
                        </div>
                    ) : (
                        <Preloader />
                    )} */}
                </SocketIOProvider>
            </StorageWrapper>
        </Provider>
    );
};

export default MyApp;
