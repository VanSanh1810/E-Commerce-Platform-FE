import React, { useContext, useEffect, useState } from 'react';
import { TranslatorContext } from '../../context/Translator';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, Dropdown } from 'react-bootstrap';
import { AnchorComponent } from '../../components/elements';
import { FloatCardComponent, ActivityCardComponent } from '../../components/cards';
import PageLayout from '../../layouts/PageLayout';
import axiosInstance from '../../configs/axiosInstance';

export default function ShopProfilePage() {
    const { t } = useContext(TranslatorContext);
    const { uid } = useParams();

    const floats = [
        { title: 'total_orders', digit: 5789, icon: 'shopping_cart', variant: 'sm purple' },
        { title: 'total_reviews', digit: 2373, icon: 'hotel_class', variant: 'sm yellow' },
        { title: 'total_products', digit: 7893, icon: 'shopping_bag', variant: 'sm green' },
    ];

    const [userData, setUserData] = useState();

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
                <Col xl={5}>
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
                                {/* <div className="mc-round-avatar md">
                                    <img
                                        src="http://localhost:4000/uploads/dw-burnett-pcoty22-8260-1671143390.jpg"
                                        alt="avatar"
                                    />
                                </div> */}
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
                            {/* <div className="mb-4">
                                <h6 className="mc-divide-title mb-3">{t('biography')}</h6>
                                <p className="mc-user-bio mb-4">
                                    It has survived not only five centuries, but also the leap into electronic typesetting,
                                    remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset
                                    sheets
                                </p>
                            </div>
                            <div>
                                <h6 className="mc-divide-title mb-3">{t('elsewhere')}</h6>
                                <nav className="mc-user-social">
                                    <AnchorComponent to="#" className="facebook">
                                        <i className="icofont-facebook"></i>
                                        <span>facebook</span>
                                    </AnchorComponent>
                                    <AnchorComponent to="#" className="twitter">
                                        <i className="icofont-twitter"></i>
                                        <span>twitter</span>
                                    </AnchorComponent>
                                    <AnchorComponent to="#" className="linkedin">
                                        <i className="icofont-linkedin"></i>
                                        <span>linkedin</span>
                                    </AnchorComponent>
                                    <AnchorComponent to="#" className="whatsapp">
                                        <i className="icofont-whatsapp"></i>
                                        <span>whatsapp</span>
                                    </AnchorComponent>
                                    <AnchorComponent to="#" className="youtube">
                                        <i className="icofont-youtube-play"></i>
                                        <span>youtube</span>
                                    </AnchorComponent>
                                </nav>
                            </div> */}
                        </div>
                    </div>
                </Col>
                <Col xl={7}>
                    <Row>
                        {floats.map((float, index) => (
                            <Col md={4} lg={4} key={index}>
                                <FloatCardComponent
                                    variant={float.variant}
                                    digit={float.digit}
                                    title={float.title}
                                    icon={float.icon}
                                />
                            </Col>
                        ))}
                        <Col xl={12}>
                            <ActivityCardComponent />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </PageLayout>
    );
}
