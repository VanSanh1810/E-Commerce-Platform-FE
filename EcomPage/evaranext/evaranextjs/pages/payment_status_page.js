import { useRouter } from 'next/router';
import Layout from '../components/layout/Layout';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { connect, useSelector } from 'react-redux';
import axiosInstance from '../config/axiosInstance';

const Test = () => {
    const { user } = useSelector((state) => state);
    let router = useRouter();
    let responseCode = router.query.vnp_ResponseCode;
    let txnRef = router.query.vnp_TxnRef;

    const [paymentNotify, setPaymentNotify] = useState();
    const [orderData, setOrderData] = useState([]);

    useEffect(() => {
        const getTransactionOrders = async () => {
            try {
                const result = await axiosInstance.get(`/api/transaction/${decodeURIComponent(txnRef)}`);
                setOrderData([...result.data.data.orders]);
            } catch (e) {
                console.log(e);
            }
        };
        // console.log(user);
        if (responseCode == '00') {
            // toast.success('Payment successful !');
            setPaymentNotify('Payment successful !');
            getTransactionOrders();
        } else {
            // toast.error('Payment fail !');
            setPaymentNotify('Payment fail !');
            getTransactionOrders();
        }
    }, [responseCode]);

    const viewOrder = async (data) => {
        if (user) {
            router.push(`/page-account?orderId=${data._id}`);
        } else {
            router.push(`/tracking-order-page?code=${data.code}&email=${data.email}&phone=${data.phone}`);
        }
    };

    return (
        <>
            <Layout>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '40px',
                    }}
                >
                    <h2 style={{ marginBottom: '20px' }}>{paymentNotify}</h2>
                    {orderData?.map((item, index) => {
                        return (
                            <>
                                <div
                                    key={item.orderId}
                                    style={{
                                        margin: '10px',
                                        display: 'flex',
                                        width: '45%',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '10px',
                                        border: '1px solid #000',
                                    }}
                                >
                                    <h5>Code : {item.code}</h5>
                                    <h5>Total: {item.price.toFixed(2)}$</h5>
                                    <button
                                        className="btn btn-small d-block"
                                        onClick={() => {
                                            if (user) {
                                                viewOrder({ _id: item.orderId });
                                            } else {
                                                viewOrder({ code: item.code, email: item.email, phone: item.phone });
                                            }
                                        }}
                                    >
                                        View
                                    </button>
                                </div>
                            </>
                        );
                    })}
                    <Link href="/">
                        <a style={{ marginTop: '40px' }} className="btn btn-default submit-auto-width font-xs hover-up">
                            Back To Home Page
                        </a>
                    </Link>
                </div>
            </Layout>
        </>
    );
};

export default Test;

// const mapStateToProps = (state) => ({
//     user: state.user,
// });

// export default connect(mapStateToProps, null)(Test);
