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

    const [productStatType, setProductStatType] = useState('day');
    const [productStatData, setProductStatData] = useState({});

    useEffect(() => {
        const fetchAnalysticData = async () => {
            try {
                const response = await axiosInstance.get(`/api/stat/product?type=${productStatType}`);
                console.log(response.data);
                const temp = { ...response.data };
                // temp.product
                setProductStatData({total: temp.total});
            } catch (err) {
                console.error(err);
            }
        };
        fetchAnalysticData();
    }, [isVendor, shopId, productStatType]);

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
                <Col xs={12} xl={12}>
                    {' '}
                    <SalesCardComponent />{' '}
                </Col>
                <Col xs={12} xl={12}>
                    <Row xs={1} sm={2}>
                        <Col>
                            <EcommerceCardComponent
                                icon={'account_circle'}
                                trend={'trending_up'}
                                title={t('total_users')}
                                variant={'green'}
                                number={n(277)}
                                percent={95}
                            />
                        </Col>
                        <Col>
                            <EcommerceCardComponent
                                icon={'shopping_cart'}
                                trend={'trending_down'}
                                title={t('total_orders')}
                                variant={'purple'}
                                number={n(338)}
                                percent={30}
                            />
                        </Col>
                        <Col>
                            <EcommerceCardComponent
                                icon={'shopping_bag'}
                                trend={'trending_down'}
                                title={t('total_products')}
                                variant={'blue'}
                                number={n(productStatData.total)}
                                percent={25}
                                statType={productStatType}
                                setStatType={setProductStatType}
                            />
                        </Col>
                        <Col>
                            <EcommerceCardComponent
                                icon={'hotel_class'}
                                trend={'trending_up'}
                                title={t('total_reviews')}
                                variant={'yellow'}
                                number={n(166)}
                                percent={45}
                            />
                        </Col>
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
