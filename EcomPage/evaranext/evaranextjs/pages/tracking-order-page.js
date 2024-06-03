import { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import { Badge, Row, Col } from 'react-bootstrap';
import axiosInstance from '../config/axiosInstance';
import AddressStaticData from '../public/static/dataprovince';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

function TrackOrder() {
    let Router = useRouter();
    let code = Router.query.code;
    let email = Router.query.email;
    let phone = Router.query.phone;

    const [currentOrder, setCurrentOrder] = useState();
    const [shopAd, setShopAd] = useState();
    const [reloadAction, setReloadAction] = useState(false);

    useEffect(() => {}, []);
    //
    const trackOrder = async (e) => {
        e.preventDefault();
        // console.log(e.target.order_code.value);
        // console.log(e.target.billing_email.value);
        // console.log(e.target.phone_number.value);
        function isValidVietnamesePhoneNumber(phoneNumber) {
            const regex = /^(?:\+84|84|0)?(3[2-9]|5[6|8|9]|7[0|6|7|8|9]|8[1-9]|9[0-9])\d{7}$/;
            return regex.test(phoneNumber);
        }
        if (!isValidVietnamesePhoneNumber(e.target.phone_number.value)) {
            toast.error('Invalid phone number');
            return;
        }
        try {
            const result = await axiosInstance.post('/api/order/tracking', {
                code: e.target.order_code.value,
                email: e.target.billing_email.value,
                phone: e.target.phone_number.value,
            });
            const response = await axiosInstance.get(`/api/address/shop/${result.data.order.shop._id}`);
            // console.log(response.data);
            setShopAd({ ...response.data.data.addresses.address });
            setCurrentOrder({ ...result.data.order });
        } catch (e) {
            console.error(e);
            toast.info(e.response.data.message);
        }
    };

    const confirmOrderHaveReceived = async () => {
        try {
            if (currentOrder.status === 'Delivered') {
                //change order status
                try {
                    const response = await axiosInstance.post(`/api/order/${currentOrder._id}`, {
                        status: 'Done',
                    });
                    console.log(response.data);
                    setReloadAction(!reloadAction);
                } catch (e) {
                    console.error(e);
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    const cancelOrderAction = async (oId) => {
        try {
            if (currentOrder.status === 'Pending') {
                //change order status
                try {
                    const response = await axiosInstance.post(`/api/order/${currentOrder._id}`, {
                        status: 'Cancel',
                    });
                    console.log(response.data);
                    setReloadAction(!reloadAction);
                } catch (e) {
                    console.error(e);
                }
            }
        } catch (err) {
            console.error(err);
        }
    };
    ////////////////////////////////
    const printOrder = async () => {
        const html2pdf = require('html2pdf.js');
        const invoice = document.getElementById('element-to-print');
        const clone = invoice.cloneNode(true);
        const imgElements = clone.querySelectorAll('img');
        for (let i = 0; i < imgElements.length; i++) {
            imgElements[i].src = await getBase64Image(imgElements[i].src);
        }
        html2pdf().from(clone).save();
    };

    function getBase64Image(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = function () {
                const canvas = document.createElement('canvas');
                canvas.width = this.width;
                canvas.height = this.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(this, 0, 0);
                const dataURL = canvas.toDataURL('image/png');
                resolve(dataURL);
            };
            img.onerror = reject;
            img.src = url;
        });
    }
    ////////////////////////////////

    return (
        <>
            <Layout parent="Home" sub="Pages" subChild="Tracking order">
                <Row>
                    <Col xl={12}>
                        <div
                            className="tab-pane fade show active m-4"
                            id="track-orders"
                            role="tabpanel"
                            aria-labelledby="track-orders-tab"
                        >
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="mb-0">Orders tracking</h5>
                                </div>
                                <div className="card-body contact-from-area">
                                    <p>
                                        To track your order please enter your OrderID in the box below and press "Track" button.
                                        This was given to you on your receipt and in the confirmation email you should have
                                        received.
                                    </p>
                                    <div className="row">
                                        <div className="col-lg-8">
                                            <form
                                                className="contact-form-style mt-30 mb-50"
                                                action="#"
                                                method="post"
                                                onSubmit={trackOrder}
                                            >
                                                <div className="input-style mb-20">
                                                    <label>Order Code</label>
                                                    <input
                                                        name="order_code"
                                                        placeholder="Found in your order confirmation email"
                                                        type="text"
                                                        className="square"
                                                        defaultValue={code}
                                                    />
                                                </div>
                                                <div className="input-style mb-20">
                                                    <label>Billing email</label>
                                                    <input
                                                        name="billing_email"
                                                        placeholder="Email you used during checkout"
                                                        type="email"
                                                        className="square"
                                                        defaultValue={email}
                                                    />
                                                </div>
                                                <div className="input-style mb-20">
                                                    <label>Phone number</label>
                                                    <input
                                                        name="phone_number"
                                                        placeholder="Number you used during checkout"
                                                        type="text"
                                                        className="square"
                                                        defaultValue={phone}
                                                    />
                                                </div>
                                                <button className="submit submit-auto-width" type="submit">
                                                    Track
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                    {currentOrder ? (
                        <Col xl={12}>
                            <div className="row m-4 p-4" style={{ border: '1px solid black' }} key={currentOrder.status}>
                                <div className="row w-100">
                                    <div id="element-to-print" className="mc-card p-md-5">
                                        <div className="mc-invoice-head">
                                            {/* <img src="images/logo.webp" alt="logo" /> */}
                                            <h2>
                                                {'invoice'} #{currentOrder?._id}
                                            </h2>
                                        </div>
                                        <div className="mc-invoice-group" style={{ alignItems: 'start' }}>
                                            <div className="mc-invoice-recieved">
                                                <h6>{'From :'}</h6>
                                                <p>
                                                    {currentOrder?.shop?.name}
                                                    <br />
                                                    {shopAd?.detail
                                                        ? `${shopAd?.detail}, ${
                                                              AddressStaticData.treeDataProvince[shopAd?.province].district[
                                                                  shopAd?.district
                                                              ].ward[shopAd?.ward].label
                                                          }, ${
                                                              AddressStaticData.treeDataProvince[shopAd?.province].district[
                                                                  shopAd?.district
                                                              ].label
                                                          }, ${AddressStaticData.treeDataProvince[shopAd?.province].label}`
                                                        : null}
                                                    <br />
                                                    {currentOrder?.shop?.email}
                                                    <br />
                                                </p>
                                            </div>
                                            <div className="mc-invoice-shipment">
                                                <h6>
                                                    To :{' '}
                                                    {currentOrder?.address?.isHome
                                                        ? '(Home)'
                                                        : currentOrder?.address?.isWork
                                                        ? '(Work)'
                                                        : null}
                                                </h6>
                                                <p>
                                                    {currentOrder?.name}
                                                    <br />
                                                    {currentOrder?.phoneNumber}
                                                    <br />
                                                    {currentOrder?.address?.district
                                                        ? `${currentOrder?.address?.detail}, ${
                                                              AddressStaticData.treeDataProvince[currentOrder?.address?.province]
                                                                  .district[currentOrder?.address?.district].ward[
                                                                  currentOrder?.address?.ward
                                                              ].label
                                                          }, ${
                                                              AddressStaticData.treeDataProvince[currentOrder?.address?.province]
                                                                  .district[currentOrder?.address?.district].label
                                                          }, ${
                                                              AddressStaticData.treeDataProvince[currentOrder?.address?.province]
                                                                  .label
                                                          }`
                                                        : null}
                                                    <br />
                                                    {currentOrder?.email}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mc-table-responsive">
                                            <table className="mc-table">
                                                <thead className="mc-table-head">
                                                    <tr>
                                                        <th>Product</th>
                                                        <th>Variant</th>
                                                        <th>Price</th>
                                                        <th>Quantity</th>
                                                        <th>Amount</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="mc-table-body">
                                                    {currentOrder?.items?.map((item, index) => {
                                                        const snapshotObj = JSON.parse(item.idToSnapshot.productJson);
                                                        const variantDataName = [];
                                                        if (item.variant && item.variant.length > 0) {
                                                            for (let i = 0; i < snapshotObj.variantData.length; i++) {
                                                                // console.log(snapshotObj.variantData[i].data);
                                                                variantDataName.push(
                                                                    snapshotObj.variantData[i].data.find(
                                                                        (v) => v._id === item.variant[i],
                                                                    ).name,
                                                                );
                                                            }
                                                        }
                                                        return (
                                                            <tr key={index}>
                                                                <td>
                                                                    <div className="mc-table-product sm">
                                                                        <img src={item.image} alt="img" />
                                                                        <p style={{ maxWidth: '10vw' }}>{item.name}</p>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    {item.variant && item.variant.length > 0
                                                                        ? variantDataName.join(',')
                                                                        : ''}
                                                                </td>
                                                                <td>{item.price}$</td>
                                                                <td>{item.quantity}</td>
                                                                <td>{item.price * item.quantity}$</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="mc-invoice-list-group">
                                            <ul className="mc-invoice-list">
                                                <li>
                                                    <span className="title">Subtotal</span>
                                                    <span className="clone">:</span>
                                                    <span className={`digit`}>{currentOrder?.total}$</span>
                                                </li>
                                                <li>
                                                    <span className="title">Shipping</span>
                                                    <span className="clone">:</span>
                                                    <span className={`digit`}>{currentOrder?.shippingCost}$</span>
                                                </li>
                                                <li>
                                                    <span className="title">Status</span>
                                                    <span className="clone me-1">:</span>
                                                    <span
                                                        className={`status ${
                                                            currentOrder?.status === 'Pending'
                                                                ? 'yellow'
                                                                : currentOrder?.status === 'Fail'
                                                                ? 'red'
                                                                : currentOrder?.status === 'Confirmed'
                                                                ? 'blue'
                                                                : currentOrder?.status === 'Shipped'
                                                                ? 'orange'
                                                                : currentOrder?.status === 'Delivered'
                                                                ? 'purple'
                                                                : 'green'
                                                        }`}
                                                    >
                                                        {currentOrder?.status}
                                                    </span>
                                                </li>
                                                {currentOrder?.onlPayStatus !== 'None' ? (
                                                    <li>
                                                        <span className="title">Payment</span>
                                                        <span className="clone me-1">:</span>
                                                        <span
                                                            className={`status ${
                                                                currentOrder?.onlPayStatus === 'Pending' ? 'yellow' : 'green'
                                                            }`}
                                                        >
                                                            {currentOrder?.onlPayStatus}
                                                        </span>
                                                    </li>
                                                ) : null}
                                                <li>
                                                    <span className="title">Total</span>
                                                    <span className="clone">:</span>
                                                    <span className={`digit`}>
                                                        {currentOrder?.total + currentOrder?.shippingCost}$
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                        <p>Create at: {new Date(parseInt(currentOrder?.createDate)).toLocaleDateString()}</p>
                                    </div>
                                    <div className="w-100 col-md-12 d-flex justify-content-end align-items-end">
                                        {(currentOrder?.onlPayStatus === 'Pending' || currentOrder?.onlPayStatus === 'Fail') &&
                                        currentOrder.status === 'Pending' ? (
                                            <button
                                                onClick={() => {
                                                    window.location.href = currentOrder.paymentUrl;
                                                }}
                                                style={{ backgroundColor: '#4067f5' }}
                                                className="btn mt-2 mx-3"
                                            >
                                                Checkout
                                            </button>
                                        ) : null}
                                        {currentOrder?.status === 'Delivered' ? (
                                            <button
                                                onClick={confirmOrderHaveReceived}
                                                style={{ backgroundColor: '#39fa5d' }}
                                                className="btn mt-2 mx-3"
                                            >
                                                I have received this order
                                            </button>
                                        ) : null}
                                        {/* {currentOrder?.status === 'Done' ? (
                                            <button
                                                onClick={() => {
                                                    setOrderReviewModal({
                                                        _id: orderViewModal._id,
                                                        items: [...orderViewModal.items],
                                                    });
                                                }}
                                                style={{ backgroundColor: '#39fa5d' }}
                                                className="btn mt-2 mx-3"
                                            >
                                                Review
                                            </button>
                                        ) : null} */}
                                        {currentOrder?.status === 'Pending' ? (
                                            <button
                                                onClick={() => {
                                                    cancelOrderAction(currentOrder._id);
                                                }}
                                                style={{ backgroundColor: '#f5372a' }}
                                                className="btn mt-2 mx-3"
                                            >
                                                Cancel order
                                            </button>
                                        ) : null}
                                        <button
                                            style={{ backgroundColor: 'gray' }}
                                            className="btn mt-2 mx-3"
                                            onClick={printOrder}
                                        >
                                            Print
                                        </button>
                                        {/* <button
                                            style={{ backgroundColor: 'gray' }}
                                            className="btn btn-secondary mt-2"
                                            onClick={() => {
                                                setOrderViewModal(false);
                                            }}
                                        >
                                            Close
                                        </button> */}
                                    </div>
                                </div>
                            </div>
                        </Col>
                    ) : null}
                </Row>
            </Layout>
        </>
    );
}

export default TrackOrder;
