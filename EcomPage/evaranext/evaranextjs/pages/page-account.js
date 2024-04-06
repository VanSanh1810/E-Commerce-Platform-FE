import Layout from '../components/layout/Layout';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axiosInstance from '../config/axiosInstance';
import { connect } from 'react-redux';
import { userLogin, userLogout } from '../redux/action/user';
import { toast } from 'react-toastify';
import { Badge, Row, Col } from 'react-bootstrap';
import { Modal } from 'react-responsive-modal';
import AddressStaticData from '../public/static/dataprovince';

function Account({ userLogout, isLoggedIn }) {
    const [activeIndex, setActiveIndex] = useState(1);

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
        e.preventDefault();
        if (!isAllAddressSelected(selectedAddress)) {
            toast.error('Please select a province, district and ward');
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
        } catch (err) {
            console.error(err);
        }
    };

    const updateAddressHandler = async (e) => {
        e.preventDefault();
        if (!isAllAddressSelected(selectedAddress)) {
            toast.error('Please select a province, district and ward');
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
        } catch (err) {
            console.error(err);
        }
    };

    const deleteAddressHandler = async (e) => {
        try {
            const response = await axiosInstance.delete(`/api/address/${delAddressModal}`);
            console.log(response);
            setDelAddressModal(false);
        } catch (err) {
            console.error(err);
        }
    };

    //****************ACOUNT DETAIL TAB ******************/
    const [userName, setUserName] = useState();
    const [userEmail, setUserEmail] = useState();
    const [userStatus, setUserStatus] = useState('active');

    const updateAccountDetailHandler = async (e) => {
        e.preventDefault();
        console.log(e.target.dname.value);
        console.log(e.target.email.value);
        if (e.target.dname.value.trim() === userName && e.target.email.value.trim() === userEmail) {
            toast.info('No data changed !');
        } else {
            try {
                const result = await axiosInstance.patch('/api/user/0', {
                    name: e.target.dname.value,
                    email: e.target.email.value,
                    b: 1322,
                });
                console.log(result.data);
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

    useEffect(() => {
        console.log(isLoggedIn);
        const tabAction = async () => {
            switch (activeIndex) {
                case 2: //orders
                    toast.success('2');
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
                    } catch (e) {
                        console.log(e);
                    }
                    break;
                case 6: //change password
                    break;
                default:
            }
        };
        tabAction();
    }, [activeIndex]);

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
                                                <li className="nav-item" onClick={() => handleOnClick(1)}>
                                                    <a className={activeIndex === 1 ? 'nav-link active' : 'nav-link'}>
                                                        <i className="fi-rs-settings-sliders mr-10"></i>
                                                        Dashboard
                                                    </a>
                                                </li>
                                                <li className="nav-item" onClick={() => handleOnClick(2)}>
                                                    <a className={activeIndex === 2 ? 'nav-link active' : 'nav-link'}>
                                                        <i className="fi-rs-shopping-bag mr-10"></i>
                                                        Orders
                                                    </a>
                                                </li>
                                                <li className="nav-item" onClick={() => handleOnClick(3)}>
                                                    <a className={activeIndex === 3 ? 'nav-link active' : 'nav-link'}>
                                                        <i className="fi-rs-shopping-cart-check mr-10"></i>
                                                        Track Your Order
                                                    </a>
                                                </li>
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
                                                    <div className="card-header">
                                                        <h5 className="mb-0">Your Orders</h5>
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
                                                                    <tr>
                                                                        <td>#1357</td>
                                                                        <td>March 45, 2020</td>
                                                                        <td>Processing</td>
                                                                        <td>$125.00 for 2 item</td>
                                                                        <td>
                                                                            <a href="#" className="btn-small d-block">
                                                                                View
                                                                            </a>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>#2468</td>
                                                                        <td>June 29, 2020</td>
                                                                        <td>Completed</td>
                                                                        <td>$364.00 for 5 item</td>
                                                                        <td>
                                                                            <a href="#" className="btn-small d-block">
                                                                                View
                                                                            </a>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>#2366</td>
                                                                        <td>August 02, 2020</td>
                                                                        <td>Completed</td>
                                                                        <td>$280.00 for 3 item</td>
                                                                        <td>
                                                                            <a href="#" className="btn-small d-block">
                                                                                View
                                                                            </a>
                                                                        </td>
                                                                    </tr>
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
                                                                        Email Address
                                                                        <span className="required">*</span>
                                                                    </label>
                                                                    <input
                                                                        required=""
                                                                        className="form-control square"
                                                                        name="email"
                                                                        type="email"
                                                                        defaultValue={userEmail}
                                                                    />
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
