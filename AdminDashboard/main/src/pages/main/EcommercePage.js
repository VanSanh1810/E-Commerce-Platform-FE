import React, { useContext, useEffect, useState } from 'react';
import { TranslatorContext } from '../../context/Translator';
import { Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import {
    EcommerceCardComponent,
    SalesCardComponent,
    ProductsCardComponent,
    RevenueCardComponent,
    ClientsCardComponent,
    ActivityCardComponent,
    OrdersCardComponent,
} from '../../components/cards';
import PageLayout from '../../layouts/PageLayout';
import { useSelector } from 'react-redux';
import axiosInstance from '../../configs/axiosInstance';

export default function EcommercePage() {
    const { t, n } = useContext(TranslatorContext);

    const { shopId, isVendor } = useSelector((state) => state.persistedReducer.authReducer);

    const dateGapByType = (date1, date2, type) => {
        switch (type) {
            case 'day':
                return Math.abs(date1.getTime() - date2.getTime());
            case 'month':
                const formattedDate1 = `${date1.getFullYear()}-${date1.getMonth() + 1}`;
                const formattedDate2 = `${date2.getFullYear()}-${date2.getMonth() + 1}`;
                return Math.abs(formattedDate1.getTime() - formattedDate2.getTime());
            case 'year':
                return Math.abs(date1.getFullYear() - date2.getFullYear());
            default:
                return;
        }
    };

    // product stat
    const [productStatType, setProductStatType] = useState('day');
    const [productStatData, setProductStatData] = useState({});

    useEffect(() => {
        const fetchAnalysticProductData = async () => {
            try {
                const response = await axiosInstance.get(`/api/stat/product?type=${productStatType}`);
                console.log(response.data);
                const temp = { ...response.data };
                // temp.product
                const now = new Date();
                let trend;
                let minGap;
                let currentTotal = 0; // total product added in the current day
                let preTotal = 0; // total product added in the most recent day
                for (let i = 0; i < temp.product.length; i++) {
                    const d = new Date(temp.product[i].dateT);
                    if (dateGapByType(d, now, productStatType) === 0) {
                        currentTotal = temp.product[i].count;
                    } else {
                        if (minGap) {
                            if (dateGapByType(d, now, productStatType) < minGap) {
                                minGap = dateGapByType(d, now, productStatType);
                                preTotal = temp.product[i].count;
                            }
                        } else {
                            minGap = dateGapByType(d, now, productStatType);
                            preTotal = temp.product[i].count;
                        }
                    }
                }
                // console.log(currentTotal);
                // console.log(preTotal);
                if (temp.total - currentTotal === 0) {
                    trend = 100;
                } else {
                    trend = (currentTotal / (temp.total - currentTotal)) * 100;
                }
                setProductStatData({ total: temp.total, trend: trend });
            } catch (err) {
                console.error(err);
            }
        };
        fetchAnalysticProductData();
    }, [isVendor, shopId, productStatType]);

    // user stat
    const [userStatType, setUserStatType] = useState('day');
    const [userStatData, setUserStatData] = useState({});

    useEffect(() => {
        const fetchAnalysticUserData = async () => {
            try {
                const response = await axiosInstance.get(`/api/stat/user?type=${userStatType}`);
                console.log(response.data);
                const temp = { ...response.data };
                // temp.user
                const now = new Date();
                let trend;
                let minGap;
                let currentTotal = 0; // total user added in the current day
                let preTotal = 0; // total user added in the most recent day
                for (let i = 0; i < temp.user.length; i++) {
                    const d = new Date(temp.user[i].dateT);

                    if (dateGapByType(d, now, userStatType) === 0) {
                        currentTotal = temp.user[i].count;
                    } else {
                        if (minGap) {
                            if (dateGapByType(d, now, userStatType) < minGap) {
                                minGap = dateGapByType(d, now, userStatType);
                                preTotal = temp.user[i].count;
                            }
                        } else {
                            minGap = dateGapByType(d, now, userStatType);
                            preTotal = temp.user[i].count;
                        }
                    }
                }
                // console.log(currentTotal);
                // console.log(preTotal);
                if (temp.total - currentTotal === 0) {
                    trend = 100;
                } else {
                    trend = (currentTotal / (temp.total - currentTotal)) * 100;
                }
                setUserStatData({ total: temp.total, trend: trend });
            } catch (err) {
                console.error(err);
            }
        };
        fetchAnalysticUserData();
    }, [isVendor, shopId, userStatType]);

    // order stat
    const [orderStatType, setOrderStatType] = useState('day');
    const [orderStatData, setOrderStatData] = useState({});

    useEffect(() => {
        const fetchAnalysticOrderData = async () => {
            try {
                const response = await axiosInstance.get(`/api/stat/order?type=${orderStatType}`);
                console.log(response.data);
                const temp = { ...response.data };
                // temp.user
                const now = new Date();
                let trend;
                let minGap;
                let currentTotal = 0; // total order added in the current day
                let preTotal = 0; // total order added in the most recent day
                for (let i = 0; i < temp.order.length; i++) {
                    const d = new Date(temp.order[i].dateT);

                    if (dateGapByType(d, now, orderStatType) === 0) {
                        currentTotal = temp.order[i].count;
                    } else {
                        if (minGap) {
                            if (dateGapByType(d, now, orderStatType) < minGap) {
                                minGap = dateGapByType(d, now, orderStatType);
                                preTotal = temp.order[i].count;
                            }
                        } else {
                            minGap = dateGapByType(d, now, orderStatType);
                            preTotal = temp.order[i].count;
                        }
                    }
                }
                // console.log(currentTotal);
                // console.log(preTotal);
                if (temp.total - currentTotal === 0) {
                    trend = 100;
                } else {
                    trend = (currentTotal / (temp.total - currentTotal)) * 100;
                }
                setOrderStatData({ total: temp.total, trend: trend });
            } catch (err) {
                console.error(err);
            }
        };
        fetchAnalysticOrderData();
    }, [isVendor, shopId, orderStatType]);

    // review stat
    const [reviewStatType, setReviewStatType] = useState('day');
    const [reviewStatData, setReviewStatData] = useState({});

    useEffect(() => {
        const fetchAnalysticReviewData = async () => {
            try {
                const response = await axiosInstance.get(`/api/stat/review?type=${reviewStatType}`);
                console.log(response.data);
                const temp = { ...response.data };
                // temp.user
                const now = new Date();
                let trend;
                let minGap;
                let currentTotal = 0; // total review added in the current day
                let preTotal = 0; // total review added in the most recent day
                for (let i = 0; i < temp.review.length; i++) {
                    const d = new Date(temp.review[i].dateT);

                    if (dateGapByType(d, now, reviewStatType) === 0) {
                        currentTotal = temp.review[i].count;
                    } else {
                        if (minGap) {
                            if (dateGapByType(d, now, reviewStatType) < minGap) {
                                minGap = dateGapByType(d, now, reviewStatType);
                                preTotal = temp.review[i].count;
                            }
                        } else {
                            minGap = dateGapByType(d, now, reviewStatType);
                            preTotal = temp.review[i].count;
                        }
                    }
                }
                // console.log(currentTotal);
                // console.log(preTotal);
                if (temp.total - currentTotal === 0) {
                    trend = 100;
                } else {
                    trend = (currentTotal / (temp.total - currentTotal)) * 100;
                }
                setReviewStatData({ total: temp.total, trend: trend });
            } catch (err) {
                console.error(err);
            }
        };
        fetchAnalysticReviewData();
    }, [isVendor, shopId, reviewStatType]);

    return (
        <PageLayout>
            <Row>
                <Col xl={12}>
                    <div className="mc-card">
                        <div className="mc-breadcrumb">
                            <h3 className="mc-breadcrumb-title">{t('ecommerce')}</h3>
                            <ul className="mc-breadcrumb-list">
                                <li className="mc-breadcrumb-item">
                                    <Link to="#" className="mc-breadcrumb-link">
                                        {t('home')}
                                    </Link>
                                </li>
                                <li className="mc-breadcrumb-item">
                                    <Link to="#" className="mc-breadcrumb-link">
                                        {t('dashboard')}
                                    </Link>
                                </li>
                                <li className="mc-breadcrumb-item">{t('ecommerce')}</li>
                            </ul>
                        </div>
                    </div>
                </Col>
                {isVendor ? (
                    <Col xs={12} xl={12}>
                        {' '}
                        <SalesCardComponent />{' '}
                    </Col>
                ) : null}
                <Col xs={12} xl={12}>
                    <Row xs={1} sm={2}>
                        {!isVendor ? (
                            <Col>
                                <EcommerceCardComponent
                                    icon={'account_circle'}
                                    trend={userStatData.trend > 0 ? 'trending_up' : 'trending_down'}
                                    title={t('total_users')}
                                    variant={'green'}
                                    number={n(userStatData.total)}
                                    percent={userStatData.trend}
                                    statType={userStatType}
                                    setStatType={setUserStatType}
                                />
                            </Col>
                        ) : null}
                        {isVendor ? (
                            <Col>
                                <EcommerceCardComponent
                                    icon={'shopping_cart'}
                                    trend={orderStatData.trend > 0 ? 'trending_up' : 'trending_down'}
                                    title={t('total_orders')}
                                    variant={'purple'}
                                    number={n(orderStatData.total)}
                                    percent={orderStatData.trend}
                                    statType={orderStatType}
                                    setStatType={setOrderStatType}
                                />
                            </Col>
                        ) : null}
                        <Col>
                            <EcommerceCardComponent
                                icon={'shopping_bag'}
                                trend={productStatData.trend > 0 ? 'trending_up' : 'trending_down'}
                                title={t('total_products')}
                                variant={'blue'}
                                number={n(productStatData.total)}
                                percent={productStatData.trend}
                                statType={productStatType}
                                setStatType={setProductStatType}
                            />
                        </Col>
                        {isVendor ? (
                            <Col>
                                <EcommerceCardComponent
                                    icon={'hotel_class'}
                                    trend={reviewStatData.trend > 0 ? 'trending_up' : 'trending_down'}
                                    title={t('total_reviews')}
                                    variant={'yellow'}
                                    number={n(reviewStatData.total)}
                                    percent={reviewStatData.trend}
                                    statType={reviewStatType}
                                    setStatType={setReviewStatType}
                                />
                            </Col>
                        ) : null}
                    </Row>
                </Col>
                <Col xl={12}>
                    {' '}
                    <ProductsCardComponent />{' '}
                </Col>
                <Col xl={8}>
                    {' '}
                    <RevenueCardComponent />{' '}
                </Col>
                <Col xl={4}>
                    {' '}
                    <OrdersCardComponent />{' '}
                </Col>
                <Col xl={6}>
                    {' '}
                    <ClientsCardComponent />{' '}
                </Col>
                <Col xl={6}>
                    {' '}
                    <ActivityCardComponent />{' '}
                </Col>
            </Row>
        </PageLayout>
    );
}
