import Layout from '../components/layout/Layout';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axiosInstance from '../config/axiosInstance';
import { connect, useDispatch } from 'react-redux';
import { userLogin, userLogout } from '../redux/action/user';
import { toast } from 'react-toastify';
import { Badge, Row, Col } from 'react-bootstrap';
import { Modal } from 'react-responsive-modal';
import AddressStaticData from '../public/static/dataprovince';
import { useRouter } from 'next/router';

function Account({ userLogout, isLoggedIn }) {
    let router = useRouter();
    let _orderId = router.query.orderId;

    const [activeIndex, setActiveIndex] = useState(2);
    const [reloadAction, setReloadAction] = useState(false);

    //****************ADDRESS TAB ******************/
    const [addressModal, setAddressModal] = useState(false);
    const [delAddressModal, setDelAddressModal] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState([null, null, null]);

    const [currentDistrict, setCurrentDistrict] = useState([]);
    const [currentWard, setCurrentWard] = useState([]);

    const [allUserAddresses, setAllUserAddresses] = useState([]);

    const setSelectAd = (code, location) => {
        let arr = [...selectedAddress];
        let i = location + 1;
        while (i < arr.length) {
            arr[i] = null;
            i = i + 1;
        }
        arr[location] = code;
        // console.log(arr);
        setSelectedAddress([...arr]);
        // console.log(AddressStaticData.dataProvince);
        // console.log(AddressStaticData.treeDataProvince);
    };

    const isAllAddressSelected = () => {
        if (selectedAddress[0] !== null && selectedAddress[1] !== null && selectedAddress[2] !== null) {
            return true;
        } else {
            return false;
        }
    };

    const addNewAddressHandler = async (e) => {
        function isValidVietnamesePhoneNumber(phoneNumber) {
            const regex = /^(?:\+84|84|0)?(3[2-9]|5[6|8|9]|7[0|6|7|8|9]|8[1-9]|9[0-9])\d{7}$/;
            return regex.test(phoneNumber);
        }
        //
        e.preventDefault();
        if (!isAllAddressSelected(selectedAddress) || !isValidVietnamesePhoneNumber(e.target.phone.value)) {
            toast.error('Invalid address');
            return;
        }
        try {
            const response = await axiosInstance.post('/api/address', {
                name: e.target.name.value,
                phone: e.target.phone.value,
                addressData: {
                    province: selectedAddress[0],
                    district: selectedAddress[1],
                    ward: selectedAddress[2],
                    detail: e.target.adDetail.value,
                },
                isHome: e.target.isHome.checked,
                isWork: e.target.isWork.checked,
            });
            console.log(response);
            setReloadAction(!reloadAction);
        } catch (err) {
            console.error(err);
        } finally {
            setAddressModal(false);
        }
    };

    const updateAddressHandler = async (e) => {
        function isValidVietnamesePhoneNumber(phoneNumber) {
            const regex = /^(?:\+84|84|0)?(3[2-9]|5[6|8|9]|7[0|6|7|8|9]|8[1-9]|9[0-9])\d{7}$/;
            return regex.test(phoneNumber);
        }
        //
        e.preventDefault();
        if (!isAllAddressSelected(selectedAddress) || !isValidVietnamesePhoneNumber(e.target.phone.value)) {
            toast.error('Invalid address');
            return;
        }
        if (
            addressModal.name === e.target.name.value &&
            addressModal.phone === e.target.phone.value &&
            addressModal.detail === e.target.adDetail.value &&
            addressModal.isWork === e.target.isWork.checked &&
            addressModal.isHome === e.target.isHome.checked &&
            addressModal.address[0] === selectedAddress[0] &&
            addressModal.address[1] === selectedAddress[1] &&
            addressModal.address[2] === selectedAddress[2]
        ) {
            // nothing changed
            return;
        }
        try {
            const response = await axiosInstance.patch(`/api/address/${addressModal._id}`, {
                name: e.target.name.value,
                phone: e.target.phone.value,
                address: {
                    province: selectedAddress[0],
                    district: selectedAddress[1],
                    ward: selectedAddress[2],
                    detail: e.target.adDetail.value,
                },
                isHome: e.target.isHome.checked,
                isWork: e.target.isWork.checked,
            });
            console.log(response);
            setReloadAction(!reloadAction);
        } catch (err) {
            console.error(err);
        } finally {
            setAddressModal(false);
        }
    };

    const deleteAddressHandler = async (e) => {
        try {
            const response = await axiosInstance.delete(`/api/address/${delAddressModal}`);
            console.log(response);
            setDelAddressModal(false);
            setReloadAction(!reloadAction);
        } catch (err) {
            console.error(err);
        }
    };

    //****************ACOUNT DETAIL TAB ******************/
    const [userName, setUserName] = useState();
    const [userEmail, setUserEmail] = useState();
    const [userStatus, setUserStatus] = useState('active');

    const [userData, setUserData] = useState();
    const [btnLoading, setBtnLoading] = useState(false);

    const [waiting, setWaiting] = useState(false);

    const updateAccountDetailHandler = async (e) => {
        e.preventDefault();
        if (userName === userData.name) {
            return;
        }
        console.log(e.target.dname.value);
        // console.log(e.target.email.value);
        if (!e.target.dname.value.trim() && e.target.dname.value.trim() === userName) {
            toast.info('No data changed !');
        } else {
            try {
                const result = await axiosInstance.patch('/api/user/0', {
                    name: e.target.dname.value,
                    // email: e.target.email.value,
                    b: 1322,
                });
                console.log(result.data);
                toast.success('Account details changed !');
                setReloadAction(!reloadAction);
            } catch (e) {
                console.log(e);
            }
        }
    };

    const handleOnClick = (index) => {
        setActiveIndex(index); // remove the curly braces
    };

    const handleLogoutClick = async () => {
        try {
            const result = await axiosInstance.post('/api/auth/logout');
            console.log(result.data);
            userLogout();
        } catch (e) {
            console.log(e);
        }
    };

    const changePasswordHandler = async (e) => {
        e.preventDefault();
        if (e.target.password.value?.trim() === '') {
            toast.error('Current password must not be empty');
            return;
        }
        if (e.target.npassword.value?.trim() === '') {
            toast.error('New password must not be empty');
            return;
        }
        if (e.target.npassword.value?.trim() === e.target.cpassword.value?.trim()) {
            try {
                const result = await axiosInstance.patch('/api/user/updateUserPassword', {
                    oldPassword: e.target.password.value?.trim(),
                    newPassword: e.target.npassword.value?.trim(),
                });
                console.log(result.data);
            } catch (e) {
                console.log(e);
            }
        } else {
            toast.error('New password and comfirm password must be the same !');
        }
    };

    const verifyEmailAction = async () => {
        if (btnLoading) return;
        try {
            if (new Date().getTime() - userData.modifyDate < 60000) {
                toast.success('Wait 60 seconds before sending email again');
                return;
            }
            setBtnLoading(true);
            const response = await axiosInstance.post('/api/user/verifyEmail');
            toast.success(response.data.data.message);
            setReloadAction(!reloadAction);
            setWaiting(true);
        } catch (e) {
            console.log(e);
        } finally {
            setBtnLoading(false);
        }
    };

    //****************ORDER TAB ******************/

    const [userOrders, setUserOrders] = useState([]);
    const [orderViewModal, setOrderViewModal] = useState();
    const [orderReviewModal, setOrderReviewModal] = useState();

    const [shopAd, setShopAd] = useState();

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState();

    useEffect(() => {
        console.log(isLoggedIn);
        const tabAction = async () => {
            switch (activeIndex) {
                case 2: //orders
                    // toast.success('2');
                    try {
                        const response = await axiosInstance.get(
                            `/api/order?target=userPage&currentPage=${currentPage}&limit=${5}`,
                        );
                        console.log(response.data.orders);
                        setUserOrders([...response.data.orders]);
                        setTotalPages(Math.ceil(response.data.pages / 5));
                        // _orderId
                        if (_orderId) {
                            const index = [...response.data.orders].findIndex((od) => od._id === _orderId);
                            if (index !== -1) {
                                setOrderViewModal([...response.data.orders][index]);
                            }
                        }
                    } catch (err) {
                        console.error(err);
                    }
                    break;
                case 3: // track orders
                    toast.success('3');
                    break;
                case 4: //my address
                    try {
                        const result = await axiosInstance.get('/api/address/0');
                        console.log(result.data);
                        setAllUserAddresses([...result.data.data.addressList]);
                    } catch (e) {
                        console.log(e);
                    }
                    break;
                case 5: //account details
                    try {
                        const result = await axiosInstance.get('/api/user/0');
                        console.log(result.data);
                        setUserName(result.data.data.name);
                        setUserEmail(result.data.data.email);
                        setUserStatus(result.data.data.status);
                        setUserData({ ...result.data.data });
                    } catch (e) {
                        console.log(e);
                    }
                    break;
                case 6: //change password
                    break;
                default:
                    break;
            }
        };
        tabAction();
    }, [activeIndex, reloadAction, currentPage, _orderId]);

    const orderActionState = () => {
        // COD - Pending
        // COD - Delivered
        // COD - Done
        // VNPAY: pending - Pending
        // VNPAY: success - Pending
    };

    const confirmOrderHaveReceived = async () => {
        try {
            if (orderViewModal.status === 'Delivered') {
                //change order status
                try {
                    const response = await axiosInstance.post(`/api/order/${orderViewModal._id}`, {
                        status: 'Done',
                    });
                    console.log(response.data);
                    setOrderViewModal(false);
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
            if (orderViewModal.status === 'Pending') {
                //change order status
                try {
                    const response = await axiosInstance.post(`/api/order/${orderViewModal._id}`, {
                        status: 'Cancel',
                    });
                    console.log(response.data);
                    setOrderViewModal(false);
                    setReloadAction(!reloadAction);
                } catch (e) {
                    console.error(e);
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const fetchShopAddress = async () => {
            try {
                const response = await axiosInstance.get(`/api/address/shop/${orderViewModal.shop._id}`);
                console.log(response.data);
                setShopAd({ ...response.data.data.addresses.address });
            } catch (err) {
                console.error(err);
            }
        };
        if (orderViewModal) {
            fetchShopAddress();
        }
    }, [orderViewModal]);

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

    const fixTotalCost = (_shipCost, _total) => {
        const temp = _shipCost + _total;
        return temp.toFixed(2);
    };

    return (
        <>
            <Layout parent="Home" sub="Pages" subChild="Account">
                <section className="pt-150 pb-150">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-10 m-auto">
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="dashboard-menu">
                                            <ul className="nav flex-column" role="tablist">
                                                {/* <li className="nav-item" onClick={() => handleOnClick(1)}>
                                                    <a className={activeIndex === 1 ? 'nav-link active' : 'nav-link'}>
                                                        <i className="fi-rs-settings-sliders mr-10"></i>
                                                        Dashboard
                                                    </a>
                                                </li> */}
                                                <li className="nav-item" onClick={() => handleOnClick(2)}>
                                                    <a className={activeIndex === 2 ? 'nav-link active' : 'nav-link'}>
                                                        <i className="fi-rs-shopping-bag mr-10"></i>
                                                        Orders
                                                    </a>
                                                </li>
                                                {/* <li className="nav-item" onClick={() => handleOnClick(3)}>
                                                    <a className={activeIndex === 3 ? 'nav-link active' : 'nav-link'}>
                                                        <i className="fi-rs-shopping-cart-check mr-10"></i>
                                                        Track Your Order
                                                    </a>
                                                </li> */}
                                                <li className="nav-item" onClick={() => handleOnClick(4)}>
                                                    <a className={activeIndex === 4 ? 'nav-link active' : 'nav-link'}>
                                                        <i className="fi-rs-marker mr-10"></i>
                                                        My Address
                                                    </a>
                                                </li>
                                                <li className="nav-item" onClick={() => handleOnClick(5)}>
                                                    <a className={activeIndex === 5 ? 'nav-link active' : 'nav-link'}>
                                                        <i className="fi-rs-user mr-10"></i>
                                                        Account details
                                                    </a>
                                                </li>
                                                <li className="nav-item" onClick={() => handleOnClick(6)}>
                                                    <a className={activeIndex === 6 ? 'nav-link active' : 'nav-link'}>
                                                        <i className="fi-rs-lock mr-10"></i>
                                                        Change Password
                                                    </a>
                                                </li>
                                                <li className="nav-item">
                                                    <Link href="/page-login-register">
                                                        <a className="nav-link" onClick={handleLogoutClick}>
                                                            <i className="fi-rs-sign-out mr-10"></i>
                                                            Logout
                                                        </a>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="col-md-8">
                                        <div className="tab-content dashboard-content">
                                            <div
                                                className={activeIndex === 1 ? 'tab-pane fade show active' : 'tab-pane fade'}
                                                id="dashboard"
                                                role="tabpanel"
                                                aria-labelledby="dashboard-tab"
                                            >
                                                <div className="card">
                                                    <div className="card-header">
                                                        <h5 className="mb-0">Hello Rosie!</h5>
                                                    </div>
                                                    <div className="card-body">
                                                        <p>
                                                            From your account dashboard. you can easily check &amp; view your
                                                            <a href="#">recent orders</a>, manage your
                                                            <a href="#">shipping and billing addresses</a>
                                                            and
                                                            <a href="#">edit your password and account details.</a>
                                                        </p>
                                                        <p>
                                                            And you can easily access to your vendor page{' '}
                                                            <a href="http://localhost:3006" target="_blank">
                                                                here
                                                            </a>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className={activeIndex === 2 ? 'tab-pane fade show active' : 'tab-pane fade'}
                                                id="orders"
                                                role="tabpanel"
                                                aria-labelledby="orders-tab"
                                            >
                                                <div className="card">
                                                    <div
                                                        className="card-header"
                                                        style={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                        }}
                                                    >
                                                        <h5 className="mb-0">Your Orders</h5>
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <button
                                                                style={{
                                                                    border: 'none',
                                                                    lineHeight: '1px',
                                                                    background: 'none',
                                                                    fontSize: '20px',
                                                                    visibility: currentPage <= 1 ? 'hidden' : 'visible',
                                                                }}
                                                                onClick={() => {
                                                                    if (currentPage > 1) {
                                                                        setCurrentPage(currentPage - 1);
                                                                    }
                                                                }}
                                                            >
                                                                <i className="fi-rs-angle-double-small-left"></i>
                                                            </button>
                                                            {currentPage}
                                                            <button
                                                                style={{
                                                                    border: 'none',
                                                                    lineHeight: '1px',
                                                                    background: 'none',
                                                                    fontSize: '20px',
                                                                    visibility: currentPage >= totalPages ? 'hidden' : 'visible',
                                                                }}
                                                                onClick={() => {
                                                                    if (currentPage < totalPages) {
                                                                        setCurrentPage(currentPage + 1);
                                                                    }
                                                                }}
                                                            >
                                                                <i className="fi-rs-angle-double-small-right"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="card-body">
                                                        <div className="table-responsive">
                                                            <table className="table">
                                                                <thead>
                                                                    <tr>
                                                                        <th>Order</th>
                                                                        <th>Date</th>
                                                                        <th>Status</th>
                                                                        <th>Total</th>
                                                                        <th>Actions</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {userOrders?.map((items) => (
                                                                        <tr key={items._id}>
                                                                            <td>
                                                                                <div>
                                                                                    <p style={{ fontWeight: '700' }}>
                                                                                        #{items.code}
                                                                                    </p>
                                                                                    <div
                                                                                        style={{
                                                                                            display: 'flex',
                                                                                            justifyContent: 'flex-start',
                                                                                            alignItems: 'center',
                                                                                            borderTop: '1px dashed #dddddd',
                                                                                        }}
                                                                                        className="mt-2 pt-2"
                                                                                    >
                                                                                        <img
                                                                                            style={{
                                                                                                width: '50px',
                                                                                                height: '50px',
                                                                                                marginRight: '3px',
                                                                                            }}
                                                                                            src={items.items[0].image}
                                                                                        />
                                                                                        <p
                                                                                            style={{
                                                                                                maxWidth: '120px',
                                                                                                whiteSpace: 'nowrap',
                                                                                                overflow: 'hidden',
                                                                                                textOverflow: 'ellipsis',
                                                                                                lineClamp: 1,
                                                                                                marginRight: '10px',
                                                                                                fontSize: '14px',
                                                                                            }}
                                                                                        >
                                                                                            {items.items[0].name}
                                                                                        </p>
                                                                                        <p
                                                                                            style={{
                                                                                                flexGrow: 1,
                                                                                                color: '#a0a0a0',
                                                                                            }}
                                                                                        >
                                                                                            x{items.items[0].quantity}
                                                                                        </p>
                                                                                        <p style={{ color: '#088178' }}>
                                                                                            ${items.items[0].price}
                                                                                        </p>
                                                                                    </div>
                                                                                    {items.items.length !== 1 ? (
                                                                                        <p
                                                                                            style={{
                                                                                                color: '#b0b0b0',
                                                                                                fontSize: '12px',
                                                                                            }}
                                                                                        >
                                                                                            {`and ${
                                                                                                items.items.length - 1
                                                                                            } more items`}
                                                                                        </p>
                                                                                    ) : null}
                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                {new Date(
                                                                                    parseInt(items.createDate),
                                                                                ).toLocaleDateString()}
                                                                            </td>
                                                                            <td>
                                                                                <span
                                                                                    className={`status `}
                                                                                    style={{
                                                                                        color:
                                                                                            items.status === 'Pending'
                                                                                                ? '#252525'
                                                                                                : items.status === 'Fail' ||
                                                                                                  items.status === 'Cancel'
                                                                                                ? '#ff1616'
                                                                                                : items.status === 'Confirmed'
                                                                                                ? '#0007e1'
                                                                                                : items.status === 'Shipped'
                                                                                                ? '#dd7500'
                                                                                                : items.status === 'Delivered'
                                                                                                ? '#e300ff'
                                                                                                : '#00b900',
                                                                                    }}
                                                                                >
                                                                                    {items.status}
                                                                                </span>
                                                                            </td>
                                                                            <td>
                                                                                ${items.total.toFixed(2)} for {items.totalItem}{' '}
                                                                                item
                                                                            </td>
                                                                            <td>
                                                                                <button
                                                                                    className="btn btn-small d-block"
                                                                                    onClick={() => {
                                                                                        setOrderViewModal({ ...items });
                                                                                    }}
                                                                                >
                                                                                    View
                                                                                </button>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className={activeIndex === 3 ? 'tab-pane fade show active' : 'tab-pane fade'}
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
                                                            To track your order please enter your OrderID in the box below and
                                                            press "Track" button. This was given to you on your receipt and in the
                                                            confirmation email you should have received.
                                                        </p>
                                                        <div className="row">
                                                            <div className="col-lg-8">
                                                                <form
                                                                    className="contact-form-style mt-30 mb-50"
                                                                    action="#"
                                                                    method="post"
                                                                >
                                                                    <div className="input-style mb-20">
                                                                        <label>Order ID</label>
                                                                        <input
                                                                            name="order-id"
                                                                            placeholder="Found in your order confirmation email"
                                                                            type="text"
                                                                            className="square"
                                                                        />
                                                                    </div>
                                                                    <div className="input-style mb-20">
                                                                        <label>Billing email</label>
                                                                        <input
                                                                            name="billing-email"
                                                                            placeholder="Email you used during checkout"
                                                                            type="email"
                                                                            className="square"
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
                                            <div
                                                className={activeIndex === 4 ? 'tab-pane fade show active' : 'tab-pane fade'}
                                                id="address"
                                                role="tabpanel"
                                                aria-labelledby="address-tab"
                                            >
                                                <button
                                                    className="btn btn-primary mb-2"
                                                    onClick={() => {
                                                        setAddressModal(true);
                                                        setSelectedAddress([...[null, null, null]]);
                                                    }}
                                                >
                                                    add
                                                </button>
                                                <div className="row">
                                                    {allUserAddresses.map((addressData) => {
                                                        const province =
                                                            AddressStaticData.treeDataProvince[addressData.address.province];
                                                        const district =
                                                            AddressStaticData.treeDataProvince[addressData.address.province]
                                                                .district[addressData.address.district];
                                                        const ward =
                                                            AddressStaticData.treeDataProvince[addressData.address.province]
                                                                .district[addressData.address.district].ward[
                                                                addressData.address.ward
                                                            ];
                                                        return (
                                                            <div className="col-lg-12">
                                                                <div className="card mb-3 mb-lg-0">
                                                                    <div className="card-header">
                                                                        <h5 className="mb-0">{addressData.name}</h5>
                                                                    </div>
                                                                    <div className="card-body">
                                                                        <address>
                                                                            {addressData.address.detail}
                                                                            <br />
                                                                            {addressData.phone}
                                                                            <br />
                                                                            {ward.label}
                                                                            <br />
                                                                            {district.label}
                                                                            <br />
                                                                            {province.label}
                                                                        </address>
                                                                        {!addressData.isHome && !addressData.isWork ? null : (
                                                                            <Badge
                                                                                bg={addressData.isHome ? 'success' : 'primary'}
                                                                            >
                                                                                {addressData.isHome ? 'Home' : 'Work'}
                                                                            </Badge>
                                                                        )}
                                                                        <br />
                                                                        <a
                                                                            href="#"
                                                                            className="btn-small"
                                                                            onClick={() => {
                                                                                setCurrentDistrict(
                                                                                    AddressStaticData.treeDataProvince[
                                                                                        addressData.address.province
                                                                                    ].district,
                                                                                );
                                                                                setCurrentWard(
                                                                                    AddressStaticData.treeDataProvince[
                                                                                        addressData.address.province
                                                                                    ].district[addressData.address.district].ward,
                                                                                );
                                                                                setSelectedAddress([
                                                                                    province.value,
                                                                                    district.value,
                                                                                    ward.value,
                                                                                ]);
                                                                                setAddressModal({
                                                                                    _id: addressData._id,
                                                                                    phone: addressData.phone,
                                                                                    address: [
                                                                                        addressData.address.province,
                                                                                        addressData.address.district,
                                                                                        addressData.address.ward,
                                                                                    ],
                                                                                    name: addressData.name,
                                                                                    detail: addressData.address.detail,
                                                                                    isWork: addressData.isWork,
                                                                                    isHome: addressData.isHome,
                                                                                });
                                                                            }}
                                                                        >
                                                                            Edit
                                                                        </a>
                                                                        {'   '}|{'   '}
                                                                        <a
                                                                            style={{ color: 'red' }}
                                                                            href="#"
                                                                            className="btn-small"
                                                                            onClick={() => {
                                                                                setDelAddressModal(addressData._id);
                                                                            }}
                                                                        >
                                                                            Delete
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                            <div
                                                className={activeIndex === 5 ? 'tab-pane fade show active' : 'tab-pane fade'}
                                                id="account-detail"
                                                role="tabpanel"
                                                aria-labelledby="account-detail-tab"
                                            >
                                                <div className="card">
                                                    <div className="card-header">
                                                        <h5>Account Details</h5>
                                                    </div>
                                                    <div className="card-body">
                                                        <form method="post" name="enq" onSubmit={updateAccountDetailHandler}>
                                                            <div className="row">
                                                                <div className="form-group col-md-12">
                                                                    <label>
                                                                        Display Name
                                                                        <span className="required">*</span>
                                                                    </label>
                                                                    <input
                                                                        required=""
                                                                        className="form-control square"
                                                                        name="dname"
                                                                        type="text"
                                                                        defaultValue={userName}
                                                                    />
                                                                </div>
                                                                <div className="form-group col-md-12">
                                                                    <label>
                                                                        Email: {userEmail}{' '}
                                                                        {/* <span className="required">*</span> */}
                                                                    </label>
                                                                    {userData?.isVerified ? (
                                                                        <Badge className="ms-2" bg={'success'}>
                                                                            Verified
                                                                        </Badge>
                                                                    ) : (
                                                                        <button
                                                                            key={`btn-load-${btnLoading}-${waiting}`}
                                                                            className="btn btn-small btn-primary"
                                                                            onClick={waiting ? () => {} : verifyEmailAction}
                                                                        >
                                                                            {waiting ? (
                                                                                <SmallTimer
                                                                                    key={waiting}
                                                                                    setWaiting={setWaiting}
                                                                                    endDateTime={new Date().getTime() + 60000}
                                                                                />
                                                                            ) : btnLoading ? (
                                                                                'Processing...'
                                                                            ) : (
                                                                                'Verify now'
                                                                            )}
                                                                        </button>
                                                                    )}

                                                                    {/* <p
                                                                        required=""
                                                                        className="form-control square"
                                                                        name="email"
                                                                        type="email"
                                                                        defaultValue={userEmail}
                                                                    ></p> */}
                                                                </div>
                                                                <div className="form-group col-md-12">
                                                                    <label>
                                                                        Status :{' '}
                                                                        <Badge
                                                                            bg={userStatus === 'active' ? 'success' : 'danger'}
                                                                        >
                                                                            {userStatus}
                                                                        </Badge>
                                                                    </label>
                                                                </div>
                                                                <div className="col-md-12">
                                                                    <button
                                                                        type="submit"
                                                                        className="btn btn-fill-out submit"
                                                                        name="submit"
                                                                        value="Submit"
                                                                    >
                                                                        Save
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className={activeIndex === 6 ? 'tab-pane fade show active' : 'tab-pane fade'}
                                                id="account-detail"
                                                role="tabpanel"
                                                aria-labelledby="account-detail-tab"
                                            >
                                                <div className="card">
                                                    <div className="card-header">
                                                        <h5>Change Password</h5>
                                                    </div>
                                                    <div className="card-body">
                                                        <form method="post" name="enq" onSubmit={changePasswordHandler}>
                                                            <div className="row">
                                                                <div className="form-group col-md-12">
                                                                    <label>
                                                                        Current Password
                                                                        <span className="required">*</span>
                                                                    </label>
                                                                    <input
                                                                        required=""
                                                                        className="form-control square"
                                                                        name="password"
                                                                        type="password"
                                                                    />
                                                                </div>
                                                                <div className="form-group col-md-12">
                                                                    <label>
                                                                        New Password
                                                                        <span className="required">*</span>
                                                                    </label>
                                                                    <input
                                                                        required=""
                                                                        className="form-control square"
                                                                        name="npassword"
                                                                        type="password"
                                                                    />
                                                                </div>
                                                                <div className="form-group col-md-12">
                                                                    <label>
                                                                        Confirm Password
                                                                        <span className="required">*</span>
                                                                    </label>
                                                                    <input
                                                                        required=""
                                                                        className="form-control square"
                                                                        name="cpassword"
                                                                        type="password"
                                                                    />
                                                                </div>
                                                                <div className="col-md-12">
                                                                    <button
                                                                        type="submit"
                                                                        className="btn btn-fill-out submit"
                                                                        name="submit"
                                                                        value="Submit"
                                                                    >
                                                                        Change
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* address create modal */}
                <Modal
                    open={addressModal ? true : false}
                    onClose={() => {
                        setSelectedAddress([...[null, null, null]]);
                        setCurrentDistrict([]);
                        setCurrentWard([]);
                        setAddressModal(false);
                    }}
                >
                    <p className="pb-3">Add new address</p>
                    <div style={{ width: '400px' }} className="row">
                        <form onSubmit={addressModal._id ? updateAddressHandler : addNewAddressHandler}>
                            <div className="form-group col-md-12">
                                <label>
                                    Name
                                    <span className="required">*</span>
                                </label>
                                <input
                                    required
                                    className="form-control square"
                                    name="name"
                                    type="text"
                                    defaultValue={addressModal?.name}
                                />
                                <label>
                                    Phone
                                    <span className="required">*</span>
                                </label>
                                <input
                                    required
                                    className="form-control square"
                                    name="phone"
                                    type="text"
                                    defaultValue={addressModal?.phone}
                                />
                                <label className="pt-2">
                                    Province
                                    <span className="required">*</span>
                                </label>
                                <select
                                    className="form-control select-active"
                                    onChange={async (e) => {
                                        try {
                                            const data = JSON.parse(e.target.value);
                                            setSelectAd(data.value, 0);
                                            setCurrentDistrict(data.district);
                                        } catch (e) {
                                            console.error(e);
                                        }
                                    }}
                                >
                                    <option value="">Select an option...</option>
                                    {Object.keys(AddressStaticData.treeDataProvince)?.map((key) => {
                                        return (
                                            <option
                                                selected={selectedAddress[0] === AddressStaticData.treeDataProvince[key].value}
                                                value={JSON.stringify(AddressStaticData.treeDataProvince[key])}
                                            >
                                                {AddressStaticData.treeDataProvince[key].label}
                                            </option>
                                        );
                                    })}
                                </select>

                                {selectedAddress[0] ? (
                                    <>
                                        <label className="pt-2">
                                            District
                                            <span className="required">*</span>
                                        </label>
                                        <select
                                            key={selectedAddress[0]}
                                            className="form-control select-active"
                                            onChange={async (e) => {
                                                try {
                                                    const data = JSON.parse(e.target.value);
                                                    setSelectAd(data.value, 1);
                                                    setCurrentWard(data.ward);
                                                } catch (e) {
                                                    console.error(e);
                                                }
                                            }}
                                        >
                                            <option value="">Select an option...</option>
                                            {Object.keys(currentDistrict).map((key) => {
                                                return (
                                                    <option
                                                        selected={selectedAddress[1] === currentDistrict[key].value}
                                                        value={JSON.stringify(currentDistrict[key])}
                                                    >
                                                        {currentDistrict[key].label}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </>
                                ) : null}

                                {selectedAddress[1] > 0 ? (
                                    <>
                                        <label className="pt-2">
                                            Ward
                                            <span className="required">*</span>
                                        </label>
                                        <select
                                            key={selectedAddress[1]}
                                            className="form-control select-active"
                                            onChange={async (e) => {
                                                try {
                                                    const data = JSON.parse(e.target.value);
                                                    setSelectAd(data.value, 2);
                                                } catch (e) {
                                                    console.error(e);
                                                }
                                            }}
                                        >
                                            <option value="">Select an option...</option>
                                            {Object.keys(currentWard)?.map((key) => {
                                                return (
                                                    <option
                                                        selected={selectedAddress[2] === currentWard[key].value}
                                                        value={JSON.stringify(currentWard[key])}
                                                    >
                                                        {currentWard[key].label}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </>
                                ) : null}
                                <label>
                                    Detail
                                    <span className="required mt-2">*</span>
                                </label>
                                <textarea
                                    required
                                    className="form-control square"
                                    name="adDetail"
                                    type="text"
                                    value={addressModal?.detail}
                                />
                                <div className="custome-checkbox mt-2">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        name="isHome"
                                        id="HomeCheckbox"
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                console.log();
                                                const otherCheckbox = document.getElementById('WorkCheckbox');
                                                otherCheckbox.checked = !e.target.checked;
                                            }
                                        }}
                                        defaultChecked={addressModal?.isHome}
                                    />
                                    <label style={{ userSelect: 'none' }} className="form-check-label" htmlFor="HomeCheckbox">
                                        <span>Home</span>
                                    </label>
                                </div>
                                <div className="custome-checkbox">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        name="isWork"
                                        id="WorkCheckbox"
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                console.log();
                                                const otherCheckbox = document.getElementById('HomeCheckbox');
                                                otherCheckbox.checked = !e.target.checked;
                                            }
                                        }}
                                        defaultChecked={addressModal?.isWork}
                                    />
                                    <label style={{ userSelect: 'none' }} className="form-check-label" htmlFor="WorkCheckbox">
                                        <span>Work</span>
                                    </label>
                                </div>
                                <button type="submit" className="btn btn-primary mt-2">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </Modal>
                {/* address delete modal */}
                <Modal
                    open={delAddressModal ? true : false}
                    onClose={() => {
                        setDelAddressModal(false);
                    }}
                >
                    <p className="pb-3">Delete address</p>
                    <div style={{ width: '400px' }} className="row">
                        <div className="row w-100">
                            <p className="pb-3">Are you sure you want to delete this address. This action cant be undo.</p>
                            <div className="w-100 col-md-12 d-flex justify-content-end align-items-end">
                                <button
                                    style={{ backgroundColor: '#ff3d3d' }}
                                    className="btn btn-danger mt-2 mx-3"
                                    onClick={deleteAddressHandler}
                                >
                                    Delete
                                </button>
                                <button
                                    style={{ backgroundColor: 'gray' }}
                                    className="btn btn-secondary mt-2"
                                    onClick={() => {
                                        setDelAddressModal(false);
                                    }}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>
                {/* order view modal */}
                <Modal
                    open={orderViewModal ? true : false}
                    onClose={() => {
                        setOrderViewModal(false);
                    }}
                    style={{ width: '80vw' }}
                >
                    <p className="pb-3">Order detail</p>
                    <div className="row">
                        <div className="row w-100">
                            <div id="element-to-print" className="mc-card p-md-5">
                                <div className="mc-invoice-head">
                                    {/* <img src="images/logo.webp" alt="logo" /> */}
                                    <h2>
                                        {'invoice'} #{orderViewModal?._id}
                                    </h2>
                                </div>
                                <div className="mc-invoice-group" style={{ alignItems: 'start' }}>
                                    <div className="mc-invoice-recieved">
                                        <h6>{'From :'}</h6>
                                        <p>
                                            {orderViewModal?.shop?.name}
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
                                            {orderViewModal?.shop?.email}
                                            <br />
                                        </p>
                                    </div>
                                    <div className="mc-invoice-shipment">
                                        <h6>
                                            To :{' '}
                                            {orderViewModal?.address?.isHome
                                                ? '(Home)'
                                                : orderViewModal?.address?.isWork
                                                ? '(Work)'
                                                : null}
                                        </h6>
                                        <p>
                                            {orderViewModal?.name}
                                            <br />
                                            {orderViewModal?.phoneNumber}
                                            <br />
                                            {orderViewModal?.address?.district
                                                ? `${orderViewModal?.address?.detail}, ${
                                                      AddressStaticData.treeDataProvince[orderViewModal?.address?.province]
                                                          .district[orderViewModal?.address?.district].ward[
                                                          orderViewModal?.address?.ward
                                                      ].label
                                                  }, ${
                                                      AddressStaticData.treeDataProvince[orderViewModal?.address?.province]
                                                          .district[orderViewModal?.address?.district].label
                                                  }, ${
                                                      AddressStaticData.treeDataProvince[orderViewModal?.address?.province].label
                                                  }`
                                                : null}
                                            <br />
                                            {orderViewModal?.email}
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
                                            {orderViewModal?.items?.map((item, index) => {
                                                const snapshotObj = JSON.parse(item.idToSnapshot.productJson);
                                                const variantDataName = [];
                                                if (item.variant && item.variant.length > 0) {
                                                    for (let i = 0; i < snapshotObj.variantData.length; i++) {
                                                        // console.log(snapshotObj.variantData[i].data);
                                                        variantDataName.push(
                                                            snapshotObj.variantData[i].data.find((v) => v._id === item.variant[i])
                                                                .name,
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
                                            <span className={`digit`}>{orderViewModal?.total}$</span>
                                        </li>
                                        <li>
                                            <span className="title">Shipping</span>
                                            <span className="clone">:</span>
                                            <span className={`digit`}>{orderViewModal?.shippingCost}$</span>
                                        </li>
                                        <li>
                                            <span className="title">Status</span>
                                            <span className="clone me-1">:</span>
                                            <span
                                                className={`status ${
                                                    orderViewModal?.status === 'Pending'
                                                        ? 'yellow'
                                                        : orderViewModal?.status === 'Fail'
                                                        ? 'red'
                                                        : orderViewModal?.status === 'Confirmed'
                                                        ? 'blue'
                                                        : orderViewModal?.status === 'Shipped'
                                                        ? 'orange'
                                                        : orderViewModal?.status === 'Delivered'
                                                        ? 'purple'
                                                        : 'green'
                                                }`}
                                            >
                                                {orderViewModal?.status}
                                            </span>
                                        </li>
                                        {orderViewModal?.onlPayStatus !== 'None' ? (
                                            <li>
                                                <span className="title">Payment</span>
                                                <span className="clone me-1">:</span>
                                                <span
                                                    className={`status ${
                                                        orderViewModal?.onlPayStatus === 'Pending' ? 'yellow' : 'green'
                                                    }`}
                                                >
                                                    {orderViewModal?.onlPayStatus}
                                                </span>
                                            </li>
                                        ) : null}
                                        <li>
                                            <span className="title">Total</span>
                                            <span className="clone">:</span>
                                            <span className={`digit`}>
                                                {fixTotalCost(orderViewModal?.shippingCost, orderViewModal?.total)} $
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                                <p>Create at: {new Date(parseInt(orderViewModal?.createDate)).toLocaleDateString()}</p>
                            </div>
                            <div className="w-100 col-md-12 d-flex justify-content-end align-items-end">
                                {(orderViewModal?.onlPayStatus === 'Pending' || orderViewModal?.onlPayStatus === 'Fail') &&
                                orderViewModal.status === 'Pending' ? (
                                    <button
                                        onClick={() => {
                                            window.location.href = orderViewModal.paymentUrl;
                                            setOrderViewModal(false);
                                        }}
                                        style={{ backgroundColor: '#4067f5' }}
                                        className="btn mt-2 mx-3"
                                    >
                                        Checkout
                                    </button>
                                ) : null}
                                {orderViewModal?.status === 'Delivered' ? (
                                    <button
                                        onClick={confirmOrderHaveReceived}
                                        style={{ backgroundColor: '#39fa5d' }}
                                        className="btn mt-2 mx-3"
                                    >
                                        I have received this order
                                    </button>
                                ) : null}
                                {orderViewModal?.status === 'Done' ? (
                                    <button
                                        onClick={() => {
                                            setOrderReviewModal({ _id: orderViewModal._id, items: [...orderViewModal.items] });
                                        }}
                                        style={{ backgroundColor: '#39fa5d' }}
                                        className="btn mt-2 mx-3"
                                    >
                                        Review
                                    </button>
                                ) : null}
                                {orderViewModal?.status === 'Pending' && orderViewModal?.onlPayStatus !== 'Confirmed' ? (
                                    <button
                                        onClick={() => {
                                            cancelOrderAction(orderViewModal._id);
                                        }}
                                        style={{ backgroundColor: '#f5372a' }}
                                        className="btn mt-2 mx-3"
                                    >
                                        Cancel order
                                    </button>
                                ) : null}
                                <button style={{ backgroundColor: 'gray' }} className="btn mt-2 mx-3" onClick={printOrder}>
                                    Print
                                </button>
                                <button
                                    style={{ backgroundColor: 'gray' }}
                                    className="btn btn-secondary mt-2"
                                    onClick={() => {
                                        setOrderViewModal(false);
                                    }}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>
                {/* order review modal */}
                <Modal
                    open={orderReviewModal?._id && orderReviewModal?.items?.length > 0 ? true : false}
                    onClose={() => {
                        setOrderReviewModal({ _id: null, items: [] });
                        setOrderViewModal(false);
                    }}
                >
                    <p className="pb-3">Review</p>
                    <div className="row">
                        <div className="row">
                            <div className="col-md-12">
                                {orderReviewModal?.items?.map((item, index) => {
                                    const snapshotObj = JSON.parse(item.idToSnapshot.productJson);
                                    const variantDataName = [];
                                    if (item.variant && item.variant.length > 0) {
                                        for (let i = 0; i < snapshotObj.variantData.length; i++) {
                                            // console.log(snapshotObj.variantData[i].data);
                                            variantDataName.push(
                                                snapshotObj.variantData[i].data.find((v) => v._id === item.variant[i]).name,
                                            );
                                        }
                                    }
                                    return (
                                        <div className="card p-3">
                                            <div className="mc-table-product sm">
                                                <img src={item.image} alt="img" />
                                                <p>
                                                    {item.name}{' '}
                                                    <Badge>
                                                        {item.variant && item.variant.length > 0 ? variantDataName.join(',') : ''}
                                                    </Badge>
                                                </p>
                                            </div>
                                            <div>
                                                <StarReview
                                                    setReloadAction={setReloadAction}
                                                    reviewId={item.review}
                                                    itemId={snapshotObj._id}
                                                    itemVariant={item.variant}
                                                    itemVariantName={
                                                        item.variant && item.variant.length > 0 ? variantDataName : []
                                                    }
                                                    orderId={orderReviewModal._id}
                                                    productIndex={index}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="w-100 col-md-12 d-flex justify-content-end align-items-end">
                                <button
                                    style={{ backgroundColor: 'gray' }}
                                    className="btn btn-secondary mt-2"
                                    onClick={() => {
                                        setOrderReviewModal({ _id: null, items: [] });
                                    }}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>
            </Layout>
        </>
    );
}

export async function getServerSideProps(context) {
    // Thực hiện kiểm tra điều kiện, ví dụ: xác định xem người dùng đã đăng nhập hay chưa
    const isLoggedIn = true; // Đây là ví dụ, bạn cần thay đổi logic này theo ứng dụng của bạn
    // console.log(context);
    return {
        props: { isLoggedIn },
    };
}

const mapStateToProps = (state) => ({
    user: state.user,
});

const mapDispatchToProps = {
    userLogout,
};

export default connect(mapStateToProps, mapDispatchToProps)(Account);

const StarReview = ({ reviewId, itemId, itemVariant, itemVariantName, orderId, productIndex, setReloadAction }) => {
    const dispatch = useDispatch();
    const [imgArray, setImgArray] = useState([]);
    const [reviewState, setReviewState] = useState(0); //  0 : no review, 1 : already reviewed, 2 : update review

    const [reviewData, setReviewData] = useState();
    useEffect(() => {
        const fetchReview = async (rid) => {
            try {
                const response = await axiosInstance.get(`/api/review/${rid}`);
                setReviewData(response.data.review);
            } catch (err) {
                console.error(err);
            }
        };
        if (reviewId) {
            //fetchReview
            console.log(reviewId);
            fetchReview(reviewId);
            setReviewState(2);
        }
    }, [reviewId]);

    const handleAddImg = (e) => {
        setImgArray([...imgArray, ...e.target.files]);
    };
    const removeImage = (index) => {
        const newArr = [...imgArray];
        newArr.splice(index, 1);
        setImgArray([...newArr]);
    };

    const publishReview = async (e) => {
        e.preventDefault();
        //setup form
        if (parseInt(e.target.rate.value) <= 0) {
            toast.error('Please provide a valid rating');
            return;
        }
        const form = new FormData();
        form.append('rating', parseInt(e.target.rate.value));
        form.append('orderId', orderId);
        form.append('productId', itemId);
        form.append('productIndex', productIndex);
        form.append('comment', e.target.cmt.value);
        if (itemVariant && itemVariant.length > 0) {
            const tempArr = [];
            for (let i = 0; i < itemVariant.length; i++) {
                tempArr.push({ _id: itemVariant[i], name: itemVariantName[i] });
            }
            form.append('variant', JSON.stringify(tempArr));
        } else {
            form.append('variant', null);
        }
        const arr = Object.values(imgArray);

        arr.forEach((file) => {
            form.append('images', file);
        });
        //

        try {
            const result = await axiosInstance.post('/api/review', form, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log(result);
            toast.success('Review published successfully !');
            setReviewState(1);
            setReloadAction((st) => !st);
        } catch (err) {
            console.error(err);
        }
    };

    const updateReview = async (e) => {
        e.preventDefault();

        if (parseInt(reviewData.createDate) - new Date().getTime() > 1000 * 60 * 60 * 24 * 30) {
            toast.error('You can only edit within 30 days of review !');
            return;
        }
        //setup form
        if (parseInt(e.target.rate.value) <= 0) {
            toast.error('Please provide a valid rating');
            return;
        }
        const form = new FormData();
        form.append('rating', parseInt(e.target.rate.value));
        form.append('orderId', orderId);
        form.append('productId', itemId);
        form.append('productIndex', productIndex);
        form.append('comment', e.target.cmt.value);
        //
        const arr = Object.values(imgArray);
        let tempImgLeft = [];
        arr.forEach((file) => {
            if (typeof file === 'string') {
                tempImgLeft.push(file);
            } else {
                form.append('images', file);
            }
        });
        form.append('imgLeft', JSON.stringify(tempImgLeft));

        try {
            const result = await axiosInstance.put(`/api/review/${reviewId}`, form, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log(result);
            toast.success('Review updated successfully !');
            setReviewState(1);
            setReloadAction((st) => !st);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <form onSubmit={reviewId ? updateReview : publishReview}>
            <div className="rate">
                <input
                    key={reviewData?.rating}
                    type="radio"
                    id={`star5-${itemId}-${itemVariant}`}
                    name="rate"
                    value="5"
                    defaultChecked={reviewData?.rating === 5}
                />
                <label for={`star5-${itemId}-${itemVariant}`} title="text">
                    5 stars
                </label>
                <input
                    key={reviewData?.rating}
                    type="radio"
                    id={`star4-${itemId}-${itemVariant}`}
                    name="rate"
                    value="4"
                    defaultChecked={reviewData?.rating === 4}
                />
                <label for={`star4-${itemId}-${itemVariant}`} title="text">
                    4 stars
                </label>
                <input
                    key={reviewData?.rating}
                    type="radio"
                    id={`star3-${itemId}-${itemVariant}`}
                    name="rate"
                    value="3"
                    defaultChecked={reviewData?.rating === 3}
                />
                <label for={`star3-${itemId}-${itemVariant}`} title="text">
                    3 stars
                </label>
                <input
                    key={reviewData?.rating}
                    type="radio"
                    id={`star2-${itemId}-${itemVariant}`}
                    name="rate"
                    value="2"
                    defaultChecked={reviewData?.rating === 2}
                />
                <label for={`star2-${itemId}-${itemVariant}`} title="text">
                    2 stars
                </label>
                <input
                    key={reviewData?.rating}
                    type="radio"
                    id={`star1-${itemId}-${itemVariant}`}
                    name="rate"
                    value="1"
                    defaultChecked={reviewData?.rating === 1}
                />
                <label for={`star1-${itemId}-${itemVariant}`} title="text">
                    1 star
                </label>
            </div>
            <textarea name="cmt" rows="1" placeholder="Comments" defaultValue={reviewData?.comment}></textarea>
            <div className="d-flex flex-row justify-content-start align-items-center">
                {imgArray?.map((img, index) => {
                    return (
                        <img
                            className="custom-cursor"
                            style={{ width: '60px', height: '60px', objectFit: 'cover', paddingRight: '10px' }}
                            src={typeof img === 'object' ? URL.createObjectURL(img) : img}
                            onClick={() => {
                                removeImage(index);
                            }}
                        />
                    );
                })}
                <input hidden={true} type="file" id="review_img" multiple={true} onChange={handleAddImg} />
                <label htmlFor="review_img">
                    <i style={{ cursor: 'pointer' }} className="fi-rs-add mr-10"></i>
                </label>
            </div>
            <div className="d-flex flex-row justify-content-end align-items-center">
                {reviewState !== 1 ? <button type="submit">{reviewId ? 'Update' : 'Publish'}</button> : null}
            </div>
        </form>
    );
};

const SmallTimer = ({ endDateTime, setWaiting }) => {
    const [time, setTime] = useState(new Date().toLocaleTimeString());

    const getPartsofTimeDuration = (duration) => {
        const seconds = Math.floor(duration / 1000);

        return seconds;
    };

    useEffect(() => {
        if (!endDateTime || endDateTime - new Date().getTime() <= 1) {
            setWaiting(false);
            return;
        }
        const timeout = setTimeout(() => {
            const date = new Date();
            setTime(date.toLocaleTimeString());
        }, 1000);
        return () => {
            clearTimeout(timeout);
        };
    }, [time]);

    const now = Date.now(); // Number of milliseconds from begining of time

    const future = new Date(endDateTime); // The day we leave for Japan

    const timeDif = future.getTime() - now;
    const timeParts = getPartsofTimeDuration(timeDif);

    return <span>Avalable in {timeParts}s</span>;
};
