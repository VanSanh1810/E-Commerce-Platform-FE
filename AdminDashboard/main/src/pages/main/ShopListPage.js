import React, { useContext, useEffect, useState } from 'react';
import { TranslatorContext } from '../../context/Translator';
import { Link } from 'react-router-dom';
import { Row, Col, Dropdown } from 'react-bootstrap';
import { FloatCardComponent } from '../../components/cards';
import { PaginationComponent } from '../../components';
import LabelFieldComponent from '../../components/fields/LabelFieldComponent';
import UsersTableComponent from '../../components/tables/UsersTableComponent';
import PageLayout from '../../layouts/PageLayout';
import users from '../../assets/data/users.json';
import ShopTableComponent from '../../components/tables/ShopTableComponent';
import { debounce } from 'lodash';
import axiosInstance from '../../configs/axiosInstance';

export default function ShopListPage() {
    const [rowView, setRowView] = useState(6);
    const [pages, setPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [shopSearchText, setShopSearchText] = useState('');

    const { t } = useContext(TranslatorContext);

    const [shopStat, setShopStat] = useState({});
    const [reloadAction, setReloadAction] = useState(false);

    useEffect(() => {
        const fetchShopStat = async () => {
            try {
                const response = await axiosInstance.get('/api/stat/shopStat');
                console.log(response.data);
                setShopStat(response.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchShopStat();
    }, [reloadAction]);

    return (
        <PageLayout>
            <Row>
                <Col xl={12}>
                    <div className="mc-card">
                        <div className="mc-breadcrumb">
                            <h3 className="mc-breadcrumb-title">{t('Shop list')}</h3>
                            <ul className="mc-breadcrumb-list">
                                <li className="mc-breadcrumb-item">
                                    <Link to="#" className="mc-breadcrumb-link">
                                        {t('home')}
                                    </Link>
                                </li>
                                <li className="mc-breadcrumb-item">
                                    <Link to="#" className="mc-breadcrumb-link">
                                        {t('shops')}
                                    </Link>
                                </li>
                                <li className="mc-breadcrumb-item">{t('shop list')}</li>
                            </ul>
                        </div>
                    </div>
                </Col>
                <Col xl={3}>
                    <FloatCardComponent
                        variant={'lg green'}
                        digit={shopStat?.activeShop}
                        title={'approved shop'}
                        icon={'check_circle'}
                    />
                </Col>
                <Col xl={3}>
                    <FloatCardComponent
                        variant={'lg red'}
                        digit={shopStat?.bannedShop}
                        title={'banned shops'}
                        icon={'remove_circle'}
                    />
                </Col>
                <Col xl={3}>
                    <FloatCardComponent
                        variant={'lg purple'}
                        digit={shopStat?.stopShop}
                        title={'stop shops'}
                        icon={'pause_circle'}
                    />
                </Col>
                <Col xl={3}>
                    <FloatCardComponent
                        variant={'lg yellow'}
                        digit={shopStat?.pendingShop}
                        title={'pending shops'}
                        icon={'pending'}
                    />
                </Col>
                <Col xl={12}>
                    <div className="mc-card">
                        <div className="mc-card-header">
                            <h4 className="mc-card-title">{t('registered shops')}</h4>
                            {/* <Dropdown bsPrefix="mc-dropdown">
                                <Dropdown.Toggle bsPrefix="mc-dropdown-toggle">
                                    <i className='material-icons'>more_horiz</i>
                                </Dropdown.Toggle>
                                <Dropdown.Menu align="end" className="mc-dropdown-paper">
                                    <button type='button' className='mc-dropdown-menu'><i className='material-icons'>edit</i><span>{t('edit')}</span></button>
                                    <button type='button' className='mc-dropdown-menu'><i className='material-icons'>delete</i><span>{t('delete')}</span></button>
                                    <button type='button' className='mc-dropdown-menu'><i className='material-icons'>download</i><span>{t('download')}</span></button>
                                </Dropdown.Menu>
                            </Dropdown> */}
                        </div>
                        <Row xs={1} sm={2} xl={2}>
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
                            {/* <Col>
                                <LabelFieldComponent
                                    label={t('status_by')}
                                    option={['approved', 'pending', 'blocked']}
                                    labelDir="label-col"
                                    fieldSize="mb-4 w-100 h-md"
                                />
                            </Col> */}
                            <Col>
                                <LabelFieldComponent
                                    type="search"
                                    label={t('search_by')}
                                    placeholder={t('id') + ' / ' + t('name') + ' / ' + t('email') + ' / ' + t('number')}
                                    labelDir="label-col"
                                    fieldSize="mb-4 w-100 h-md"
                                    onChange={debounce(
                                        (e) => {
                                            // console.log(e.target.value);
                                            setShopSearchText(e.target.value);
                                            setCurrentPage(1);
                                        },
                                        [500],
                                    )}
                                />
                            </Col>
                        </Row>
                        <ShopTableComponent
                            thead={users.thead}
                            tbody={users.tbody}
                            rowView={rowView}
                            currentPage={currentPage}
                            setPages={setPages}
                            shopSearchText={shopSearchText}
                            _setReloadAction={setReloadAction}
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
