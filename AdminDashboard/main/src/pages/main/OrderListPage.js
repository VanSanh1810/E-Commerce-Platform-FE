import React, { useContext, useEffect, useState } from 'react';
import { TranslatorContext } from '../../context/Translator';
import { Link } from 'react-router-dom';
import { Row, Col, Dropdown } from 'react-bootstrap';
import { FloatCardComponent } from '../../components/cards';
import { PaginationComponent } from '../../components';
import OrdersTableComponent from '../../components/tables/OrdersTableComponent';
import LabelFieldComponent from '../../components/fields/LabelFieldComponent';
import PageLayout from '../../layouts/PageLayout';
import orders from '../../assets/data/orderTable.json';
import axiosInstance from '../../configs/axiosInstance';
import { debounce } from 'lodash';

export default function OrderListPage() {
    const { t, n } = useContext(TranslatorContext);

    const [orderStatData, setOrderStatData] = useState([]);

    const [rowView, setRowView] = useState(6);
    const [pages, setPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [orderSearchText, setOrderSearchText] = useState('');
    const [orderSearchDate, setOrderSearchDate] = useState();
    const [orderSearchStatus, setOrderSearchStatus] = useState('');

    useEffect(() => {
        const fetchOrderStat = async () => {
            try {
                const response = await axiosInstance.get('/api/stat/orderTypeCount');
                console.log(response.data);
                const floats = [
                    { title: 'pending orders', digit: response.data.pendingOrder, icon: 'pending', variant: 'lg purple' },
                    { title: 'shipped orders', digit: response.data.shippedOrder, icon: 'local_shipping', variant: 'lg blue' },
                    { title: 'recieved orders', digit: response.data.recievedOrder, icon: 'shopping_bag', variant: 'lg green' },
                    { title: 'cancelled orders', digit: response.data.cancelOrder, icon: 'remove_circle', variant: 'lg red' },
                ];

                setOrderStatData([...floats]);
            } catch (e) {
                console.error(e);
            }
        };
        fetchOrderStat();
    }, []);

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
                {orderStatData?.map((float, index) => (
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
                                    option={['6 row', '12 row', '24 row']}
                                    labelDir="label-col"
                                    fieldSize="mb-4 w-100 h-md"
                                    onChange={(e) => {
                                        // console.log(e.target.value);
                                        let a = e.target.value;
                                        const temp = a.split(' ');
                                        setRowView(parseInt(temp[0]));
                                        setCurrentPage(1);
                                    }}
                                />
                            </Col>
                            <Col>
                                <LabelFieldComponent
                                    label={t('status_by')}
                                    option={['all', 'Pending', 'Fail', 'Confirmed', 'Shipped', 'Delivered', 'Done', 'Cancel']}
                                    labelDir="label-col"
                                    fieldSize="mb-4 w-100 h-md"
                                    onChange={(e) => {
                                        if (e.target.value === 'all') {
                                            setOrderSearchStatus('');
                                            return;
                                        }
                                        setOrderSearchStatus(e.target.value);
                                    }}
                                />
                            </Col>
                            <Col>
                                <LabelFieldComponent
                                    type="date"
                                    label={t('issued_by')}
                                    labelDir="label-col"
                                    fieldSize="mb-4 w-100 h-md"
                                    onChange={(e) => {
                                        console.log(e.target.value);
                                        const temp = new Date(e.target.value).getTime();
                                        console.log(temp);
                                        console.log(temp || '');
                                        setOrderSearchDate(temp || '');
                                    }}
                                />
                            </Col>
                            <Col>
                                <LabelFieldComponent
                                    type="search"
                                    label={t('search_by')}
                                    labelDir="label-col"
                                    fieldSize="mb-4 w-100 h-md"
                                    placeholder="code / name / email"
                                    onChange={debounce(
                                        (e) => {
                                            // console.log(e.target.value);
                                            setOrderSearchText(e.target.value);
                                            setCurrentPage(1);
                                        },
                                        [500],
                                    )}
                                />
                            </Col>
                        </Row>
                        <OrdersTableComponent
                            orderId={1}
                            thead={orders.thead}
                            tbody={orders.tbody}
                            rowView={rowView}
                            currentPage={currentPage}
                            setPages={setPages}
                            orderSearchText={orderSearchText}
                            date={orderSearchDate}
                            orderSearchStatus={orderSearchStatus}
                        />
                        <PaginationComponent
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            pages={pages}
                            rowShow={rowView}
                        />
                    </div>
                </Col>
            </Row>
        </PageLayout>
    );
}
