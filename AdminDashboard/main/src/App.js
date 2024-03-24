import React, { useEffect } from 'react';
import Routing from './routes/Routing';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';
import { toastType } from './store/reducers/toastReducer';

function App() {
    const { toastState } = useSelector((state) => state.persistedReducer.toastReducer);
    // const { adminToken } = useSelector((state) => state.persistedReducer.authReducer);

    useEffect(() => {
        const notify = () => {
            switch (toastState.Tstate) {
                case toastType.info:
                    toast.info(toastState.Tmessage, {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'light',
                    });
                    break;
                case toastType.success:
                    toast.success(toastState.Tmessage, {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'light',
                    });
                    break;
                case toastType.warning:
                    toast.warn(toastState.Tmessage, {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'light',
                    });
                    break;
                case toastType.error:
                    toast.error(toastState.Tmessage, {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'light',
                    });
                    break;
                case toastType.default:
                    toast(toastState.Tmessage, {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'light',
                    });
                    break;
                default:
                    break;
            }
        };
        notify();
    }, [toastState]);
    return (
        <div>
            <Routing />
            <ToastContainer />
        </div>
    );
}

export default App;
