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
import ReportTableComponent from '../../components/tables/ReportTableComponent';

export default function ReportListPage() {
    const [rowView, setRowView] = useState(6);
    const [pages, setPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [reportType, setReportType] = useState('');

    const [realoadActions, setRealoadActions] = useState(false);

    const { t } = useContext(TranslatorContext);

    const [reportStat, setReportStat] = useState({});

    useEffect(() => {
        const fetchReportStat = async () => {
            try {
                const response = await axiosInstance.get('/api/stat/reportStat');
                console.log(response.data);
                setReportStat(response.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchReportStat();
    }, [realoadActions]);

    return (
        <PageLayout>
            <Row>
                <Col xl={12}>
                    <div className="mc-card">
                        <div className="mc-breadcrumb">
                            <h3 className="mc-breadcrumb-title">{t('Report list')}</h3>
                            <ul className="mc-breadcrumb-list">
                                <li className="mc-breadcrumb-item">
                                    <Link to="#" className="mc-breadcrumb-link">
                                        {t('home')}
                                    </Link>
                                </li>
                                {/* <li className="mc-breadcrumb-item">
                                    <Link to="#" className="mc-breadcrumb-link">
                                        {t('Reports')}
                                    </Link>
                                </li> */}
                                <li className="mc-breadcrumb-item">{t('Reports')}</li>
                            </ul>
                        </div>
                    </div>
                </Col>
                <Col xl={6}>
                    <FloatCardComponent
                        variant={'lg green'}
                        digit={reportStat?.doneReport}
                        title={'approved reports'}
                        icon={'check_circle'}
                    />
                </Col>
                <Col xl={6}>
                    <FloatCardComponent
                        variant={'lg yellow'}
                        digit={reportStat?.pendingReport}
                        title={'pending reports'}
                        icon={'pending'}
                    />
                </Col>
                <Col xl={12}>
                    <div className="mc-card">
                        <div className="mc-card-header">
                            <h4 className="mc-card-title">{t('Reports')}</h4>
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
                            <Col>
                                <LabelFieldComponent
                                    label={t('status_by')}
                                    option={['all', 'pending', 'done']}
                                    labelDir="label-col"
                                    fieldSize="mb-4 w-100 h-md"
                                    onChange={(e) => {
                                        // console.log(e.target.value);
                                        setReportType(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                            </Col>
                        </Row>
                        <ReportTableComponent
                            thead={users.thead}
                            tbody={users.tbody}
                            rowView={rowView}
                            currentPage={currentPage}
                            setPages={setPages}
                            reportType={reportType}
                            _setReloadAction={setRealoadActions}
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
