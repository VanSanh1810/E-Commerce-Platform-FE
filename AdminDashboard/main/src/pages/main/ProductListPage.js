import React, { useContext } from 'react';
import { TranslatorContext } from '../../context/Translator';
import { Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { FloatCardComponent } from '../../components/cards';
import ProductsTableComponent from '../../components/tables/ProductsTableComponent';
import LabelFieldComponent from '../../components/fields/LabelFieldComponent';
import { PaginationComponent } from '../../components';
import PageLayout from '../../layouts/PageLayout';
import products from '../../assets/data/products.json';

export default function ProductListPage() {
    const { t, n } = useContext(TranslatorContext);

    const floats = [
        { title: 'Total Product', digit: 547, icon: 'shopping_bag', variant: 'lg blue' },
        { title: 'Total categories', digit: 605, icon: 'widgets', variant: 'lg green' },
        { title: 'Average Start', digit: 249, icon: 'star', variant: 'lg yellow' },
    ];

    return (
        <PageLayout>
            <Row>
                <Col xl={12}>
                    <div className="mc-card">
                        <div className="mc-breadcrumb">
                            <h3 className="mc-breadcrumb-title">{t('product_list')}</h3>
                            <ul className="mc-breadcrumb-list">
                                <li className="mc-breadcrumb-item">
                                    <Link to="/" className="mc-breadcrumb-link">
                                        {t('home')}
                                    </Link>
                                </li>
                                <li className="mc-breadcrumb-item">{t('products')}</li>
                                <li className="mc-breadcrumb-item">{t('product_list')}</li>
                            </ul>
                        </div>
                    </div>
                </Col>
                {floats.map((float, index) => (
                    <Col key={index} sm={6} lg={4}>
                        <FloatCardComponent
                            variant={float.variant}
                            digit={n(float.digit)}
                            title={t(float.title)}
                            icon={float.icon}
                        />
                    </Col>
                ))}
                <Col xl={12}>
                    <div className="mc-card">
                        <Row>
                            <Col xs={12} sm={6} md={4} lg={4}>
                                <LabelFieldComponent
                                    label={t('show_by')}
                                    option={['12 row', '24 row', '36 row']}
                                    labelDir="label-col"
                                    fieldSize="w-100 h-md mb-4"
                                />
                            </Col>
                            <Col xs={12} sm={6} md={4} lg={4}>
                                <LabelFieldComponent
                                    label={t('rating_by')}
                                    option={['1 star', '2 star', '3 star', '4 star', '5 star']}
                                    labelDir="label-col"
                                    fieldSize="w-100 h-md mb-4"
                                />
                            </Col>
                            <Col xs={12} sm={6} md={4} lg={4}>
                                <LabelFieldComponent
                                    label={t('category_by')}
                                    option={['mans', 'womans', 'kids', 'accessory']}
                                    labelDir="label-col"
                                    fieldSize="w-100 h-md mb-4"
                                />
                            </Col>
                            <Col xl={12}>
                                <ProductsTableComponent thead={products.thead} tbody={products.tbody} />
                                <PaginationComponent />
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        </PageLayout>
    );
}
