import React, { useContext, useEffect, useState } from 'react';
import { TranslatorContext } from '../../context/Translator';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, Dropdown } from 'react-bootstrap';
import { AnchorComponent } from '../../components/elements';
import { FloatCardComponent, ActivityCardComponent } from '../../components/cards';
import PageLayout from '../../layouts/PageLayout';
import axiosInstance from '../../configs/axiosInstance';

export default function UserProfilePage() {
    const { t } = useContext(TranslatorContext);
    const { uid } = useParams();

    const floats = [
        { title: 'total_orders', digit: 5789, icon: 'shopping_cart', variant: 'sm purple' },
        { title: 'total_reviews', digit: 2373, icon: 'hotel_class', variant: 'sm yellow' },
        { title: 'total_products', digit: 7893, icon: 'shopping_bag', variant: 'sm green' },
    ];

    const [userData, setUserData] = useState();
    const [userStat, setUserStat] = useState({});

    useEffect(() => {
        console.log(uid);
        const fetchUserData = async () => {
            try {
                const result = await axiosInstance.get(`/api/user/${uid}`);
                console.log(result.data);
                setUserData(result.data.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchUserData();
    }, [uid]);

    useEffect(() => {
        console.log(uid);
        const fetchUserStat = async () => {
            try {
                const result = await axiosInstance.get(`/api/stat/user/${uid}`);
                console.log(result.data);
                setUserStat(result.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchUserStat();
    }, [uid]);
    return (
        <PageLayout>
            <Row>
                <Col xl={12}>
                    <div className="mc-card">
                        <div className="mc-breadcrumb">
                            <h3 className="mc-breadcrumb-title">{t('user_profile')}</h3>
                            <ul className="mc-breadcrumb-list">
                                <li className="mc-breadcrumb-item">
                                    <Link to="/" className="mc-breadcrumb-link">
                                        {t('home')}
                                    </Link>
                                </li>
                                <li className="mc-breadcrumb-item">
                                    <Link to="/user" className="mc-breadcrumb-link">
                                        {t('users')}
                                    </Link>
                                </li>
                                <li className="mc-breadcrumb-item">{t('user_profile')}</li>
                            </ul>
                        </div>
                    </div>
                </Col>
                <Col xl={12}>
                    <Row>
                        <Col md={6} lg={6}>
                            <FloatCardComponent
                                variant={'sm purple'}
                                digit={userStat?.totalOrder}
                                title={'total_orders'}
                                icon={'shopping_cart'}
                            />
                        </Col>
                        <Col md={6} lg={6}>
                            <FloatCardComponent
                                variant={'sm yellow'}
                                digit={userStat?.totalReview}
                                title={'total_reviews'}
                                icon={'hotel_class'}
                            />
                        </Col>
                        {/* <Col xl={12}>
                            <ActivityCardComponent />
                        </Col> */}
                    </Row>
                </Col>
                <Col xl={12}>
                    <div className="mc-card">
                        <div className="mc-card-header">
                            <h4 className="mc-card-title">{t('user information')}</h4>
                            <Dropdown bsPrefix="mc-dropdown">
                                <Dropdown.Toggle bsPrefix="mc-dropdown-toggle">
                                    <i className="material-icons">more_horiz</i>
                                </Dropdown.Toggle>
                                <Dropdown.Menu align="end" className="mc-dropdown-paper">
                                    <button type="button" className="mc-dropdown-menu">
                                        <i className="material-icons">edit</i>
                                        <span>{t('edit')}</span>
                                    </button>
                                    <button type="button" className="mc-dropdown-menu">
                                        <i className="material-icons">delete</i>
                                        <span>{t('delete')}</span>
                                    </button>
                                    <button type="button" className="mc-dropdown-menu">
                                        <i className="material-icons">download</i>
                                        <span>{t('download')}</span>
                                    </button>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div className="mc-user-group">
                            <div className="mc-user-profile">
                                <div className="mc-duel-text md">
                                    <h3 className="mc-duel-text-title">{userData?.name}</h3>
                                    {/* <p className="mc-duel-text-descrip">@mironcoder</p> */}
                                </div>
                            </div>
                            <div className="mb-4">
                                <h6 className="mc-divide-title mb-4">{t('communication')}</h6>
                                <ul className="mc-user-metalist">
                                    {/* <li>
                                        <i className="material-icons">phone_in_talk</i>
                                        <span>+91 987-654-3210</span>
                                    </li> */}
                                    <li>
                                        <i className="material-icons">feed</i>
                                        <span>{userData?.email}</span>
                                    </li>
                                    {userData?.shop?._id ? (
                                        <li>
                                            <i className="material-icons">person</i>
                                            <AnchorComponent to={`/shop/${userData?.shop?._id}`}>
                                                {userData?.shop.name}
                                            </AnchorComponent>
                                        </li>
                                    ) : null}
                                    {/* <li>
                                        <i className="material-icons">public</i>
                                        <span>examplehotash.com</span>
                                    </li>
                                    <li>
                                        <i className="material-icons">map</i>
                                        <span>1Hd- 50, 010 Avenue, NY 90001 United States</span>
                                    </li> */}
                                </ul>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </PageLayout>
    );
}
