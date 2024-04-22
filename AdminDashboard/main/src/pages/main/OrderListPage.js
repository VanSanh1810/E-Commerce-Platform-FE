import React, { useContext, useEffect } from 'react';
import { TranslatorContext } from '../../context/Translator';
import { Link } from 'react-router-dom';
import { Row, Col, Dropdown } from 'react-bootstrap';
import { FloatCardComponent } from '../../components/cards';
import { PaginationComponent } from '../../components';
import OrdersTableComponent from '../../components/tables/OrdersTableComponent';
import LabelFieldComponent from '../../components/fields/LabelFieldComponent';
import PageLayout from '../../layouts/PageLayout';
import orders from '../../assets/data/orderTable.json';

export default function OrderListPage() {
    const { t, n } = useContext(TranslatorContext);

    const floats = [
        { title: 'pending_orders', digit: 547, icon: 'pending', variant: 'lg purple' },
        { title: 'shipped_orders', digit: 398, icon: 'local_shipping', variant: 'lg blue' },
        { title: 'recieved_orders', digit: 605, icon: 'shopping_bag', variant: 'lg green' },
        { title: 'cancelled_orders', digit: 249, icon: 'remove_circle', variant: 'lg red' },
    ];

    return (
        <PageLayout>
            <Row>
                <Col xl={12}>
                    <div className="mc-card">
                        <div className="mc-breadcrumb">
                            <h3 className="mc-breadcrumb-title">{t('order_list')}</h3>
                            <ul className="mc-breadcrumb-list">
                                <li className="mc-breadcrumb-item">
                                    <Link to="#" className="mc-breadcrumb-link">
                                        {t('home')}
                                    </Link>
                                </li>
                                <li className="mc-breadcrumb-item">
                                    <Link to="#" className="mc-breadcrumb-link">
                                        {t('orders')}
                                    </Link>
                                </li>
                                <li className="mc-breadcrumb-item">{t('order_list')}</li>
                            </ul>
                        </div>
                    </div>
                </Col>
                {floats.map((float, index) => (
                    <Col key={index} xl={3}>
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
                        <div className="mc-card-header">
                            <h4 className="mc-card-title">{t('order_information')}</h4>
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
                        <Row xs={1} sm={4}>
                            <Col>
                                <LabelFieldComponent
                                    label={t('show_by')}
                                    option={['12 row', '24 row', '36 row']}
                                    labelDir="label-col"
                                    fieldSize="mb-4 w-100 h-md"
                                />
                            </Col>
                            <Col>
                                <LabelFieldComponent
                                    label={t('status_by')}
                                    option={['pending', 'shipped', 'recieved', 'cancelled']}
                                    labelDir="label-col"
                                    fieldSize="mb-4 w-100 h-md"
                                />
                            </Col>
                            <Col>
                                <LabelFieldComponent
                                    type="date"
                                    label={t('issued_by')}
                                    labelDir="label-col"
                                    fieldSize="mb-4 w-100 h-md"
                                />
                            </Col>
                            <Col>
                                <LabelFieldComponent
                                    type="search"
                                    label={t('search_by')}
                                    labelDir="label-col"
                                    fieldSize="mb-4 w-100 h-md"
                                    placeholder="id / name / email"
                                />
                            </Col>
                        </Row>
                        <OrdersTableComponent orderId={1} thead={orders.thead} tbody={orders.tbody} />
                        <PaginationComponent />
                    </div>
                </Col>
            </Row>
        </PageLayout>
    );
}
