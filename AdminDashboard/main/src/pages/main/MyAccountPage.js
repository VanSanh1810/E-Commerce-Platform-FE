import React, { useContext, useEffect, useState } from 'react';
import { TranslatorContext } from '../../context/Translator';
import { Link } from 'react-router-dom';
import { Row, Col, Tab, Tabs, Form } from 'react-bootstrap';
import { LegendFieldComponent, LegendTextareaComponent, IconFieldComponent } from '../../components/fields';
import { ButtonComponent } from '../../components/elements';
import { FileUploadComponent } from '../../components';
import PageLayout from '../../layouts/PageLayout';
import { useSelector } from 'react-redux';
import axiosInstance from '../../configs/axiosInstance';
import AddressStaticData from '../../assets/data/static/dataprovince';

export default function MyAccountPage() {
    const { t } = useContext(TranslatorContext);
    const { shopId } = useSelector((state) => state.persistedReducer.authReducer);
    //****************SHOP DATA CHANGES ******************/
    const [shopName, setShopName] = useState('');
    const [shopEmail, setShopEmail] = useState('');
    const [shopDes, setShopDes] = useState('');
    const [shopAdDetail, setShopAdDetail] = useState('');

    const saveShopChanges = async () => {
        if (isAllAddressSelected() && shopAdDetail) {
            try {
                const response = await axiosInstance.patch(`/api/shop`, {
                    name: shopName,
                    email: shopEmail,
                    description: shopDes,
                    addressData: {
                        province: selectedAddress[0],
                        district: selectedAddress[0],
                        ward: selectedAddress[0],
                        detail: shopAdDetail,
                    },
                });
                console.log(response);
            } catch (e) {
                console.error(e);
            }
        } else {
            console.log('No change');
        }
    };

    //****************ADDRESS ******************/
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
    ////////////////////////////////
    const [shopData, setShopData] = useState();
    useEffect(() => {
        const fetchShopData = async () => {
            try {
                const response = await axiosInstance.get(`/api/shop/${shopId}`);
                setShopData(response.data.data.shop);
                console.log(response.data.data.shop);
                const currentAddress = response.data.data.shop.addresses;
                if (currentAddress) {
                    setSelectedAddress([
                        currentAddress.address.province,
                        currentAddress.address.district,
                        currentAddress.address.ward,
                    ]);
                    setShopAdDetail(currentAddress.address.detail);
                    setCurrentDistrict(AddressStaticData.treeDataProvince[currentAddress.address.province].district);
                    setCurrentWard(
                        AddressStaticData.treeDataProvince[currentAddress.address.province].district[
                            currentAddress.address.district
                        ].ward,
                    );
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchShopData();
    }, [shopId]);

    return (
        <PageLayout>
            <Row>
                <Col xl={12}>
                    <div className="mc-card">
                        <div className="mc-breadcrumb">
                            <h3 className="mc-breadcrumb-title">{t('my shop')}</h3>
                            <ul className="mc-breadcrumb-list">
                                <li className="mc-breadcrumb-item">
                                    <Link to="/" className="mc-breadcrumb-link">
                                        {t('home')}
                                    </Link>
                                </li>
                                <li className="mc-breadcrumb-item">{t('my shop')}</li>
                            </ul>
                        </div>
                    </div>
                </Col>
                <Col xl={12}>
                    <div className="mc-card">
                        <Tabs defaultActiveKey="profile" id="mc" className="mc-tabs">
                            <Tab eventKey="profile" title={t('edit_profile')} className="mc-tabpane profile">
                                <div className="mc-tab-card">
                                    <h6 className="mc-tab-card-title">{t('Shop Information')}</h6>
                                    <Row>
                                        <Col xl={4}>
                                            <div className="mc-user-avatar-upload">
                                                <div className="mc-user-avatar">
                                                    <img
                                                        src={shopData?.avatar ? shopData?.avatar : '/images/avatar/01.webp'}
                                                        alt="avatar"
                                                    />
                                                </div>
                                                <FileUploadComponent icon="cloud_upload" text={t('upload')} />
                                            </div>
                                        </Col>
                                        <Col xl={8}>
                                            <Row>
                                                <Col xl={12}>
                                                    <LegendFieldComponent
                                                        type="text"
                                                        title={t('Name')}
                                                        value={shopData?.name}
                                                        className="mb-4"
                                                        onChange={(e) => {
                                                            setShopName(e.target.value);
                                                        }}
                                                    />
                                                </Col>
                                                <Col xl={12}>
                                                    <LegendFieldComponent
                                                        type="email"
                                                        title={t('Email')}
                                                        value={shopData?.email}
                                                        className="mb-4"
                                                        onChange={(e) => {
                                                            setShopEmail(e.target.value);
                                                        }}
                                                    />
                                                </Col>
                                                <Col xl={12}>
                                                    <LegendTextareaComponent
                                                        title={t('Description')}
                                                        longText={shopData?.description}
                                                        onChange={(e) => {
                                                            setShopDes(e.target.value);
                                                        }}
                                                    />
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </div>
                                <div className="mc-tab-card">
                                    <h6 className="mc-tab-card-title">{t('Shop Address')}</h6>
                                    <Row>
                                        <Col xl={4}>
                                            <fieldset className={`mc-fieldset ${'mb-4'}`}>
                                                <legend>{'province'}</legend>
                                                <select
                                                    style={{ outline: 'none' }}
                                                    className={`${'w-100 h-md'}`}
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
                                                    <option>{'Select Option'}</option>
                                                    {Object.keys(AddressStaticData.treeDataProvince)?.map((key) => {
                                                        return (
                                                            <option
                                                                selected={
                                                                    selectedAddress[0] ===
                                                                    AddressStaticData.treeDataProvince[key].value
                                                                }
                                                                value={JSON.stringify(AddressStaticData.treeDataProvince[key])}
                                                            >
                                                                {AddressStaticData.treeDataProvince[key].label}
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                            </fieldset>
                                        </Col>
                                        <Col xl={4}>
                                            <fieldset className={`mc-fieldset ${'mb-4'}`}>
                                                <legend>{'district'}</legend>
                                                <select
                                                    style={{ outline: 'none' }}
                                                    className={`${'w-100 h-md'}`}
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
                                                    <option>{'Select Option'}</option>
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
                                            </fieldset>
                                        </Col>
                                        <Col xl={4}>
                                            <fieldset className={`mc-fieldset ${'mb-4'}`}>
                                                <legend>{'district'}</legend>
                                                <select
                                                    style={{ outline: 'none' }}
                                                    className={`${'w-100 h-md'}`}
                                                    onChange={async (e) => {
                                                        try {
                                                            const data = JSON.parse(e.target.value);
                                                            setSelectAd(data.value, 2);
                                                        } catch (e) {
                                                            console.error(e);
                                                        }
                                                    }}
                                                >
                                                    <option>{'Select Option'}</option>
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
                                            </fieldset>
                                        </Col>
                                        <Col xl={12}>
                                            <LegendTextareaComponent
                                                title={t('address detail')}
                                                longText={shopData?.addresses?.detail}
                                                onChange={(e) => {
                                                    setShopAdDetail(e.target.value);
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                                <ButtonComponent
                                    className="mc-btn primary"
                                    icon="verified"
                                    text={t('save_changes')}
                                    onClick={saveShopChanges}
                                />
                            </Tab>
                        </Tabs>
                    </div>
                </Col>
            </Row>
        </PageLayout>
    );
}
