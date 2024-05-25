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
import axiosInstance from '../../configs/axiosInstance';
import { debounce } from 'lodash';

export default function UserListPage() {
    const { t } = useContext(TranslatorContext);

    const [userStatData, setUserStatData] = useState();

    const [rowView, setRowView] = useState(6);
    const [pages, setPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [userSearchText, setUserSearchText] = useState('');

    const [reloadAction, setReloadAction] = useState(false);

    useEffect(() => {
        const fetchUData = async () => {
            try {
                const response = await axiosInstance.get('/api/stat/userAprBlk');
                setUserStatData(response.data);
            } catch (e) {
                console.error(e);
            }
        };
        fetchUData();
    }, [reloadAction]);

    return (
        <PageLayout>
            <Row>
                <Col xl={12}>
                    <div className="mc-card">
                        <div className="mc-breadcrumb">
                            <h3 className="mc-breadcrumb-title">{t('user_list')}</h3>
                            <ul className="mc-breadcrumb-list">
                                <li className="mc-breadcrumb-item">
                                    <Link to="#" className="mc-breadcrumb-link">
                                        {t('home')}
                                    </Link>
                                </li>
                                <li className="mc-breadcrumb-item">
                                    <Link to="#" className="mc-breadcrumb-link">
                                        {t('users')}
                                    </Link>
                                </li>
                                <li className="mc-breadcrumb-item">{t('user_list')}</li>
                            </ul>
                        </div>
                    </div>
                </Col>
                <Col xl={6}>
                    <FloatCardComponent
                        variant={'lg green'}
                        digit={userStatData?.aprUser}
                        title={'approved users'}
                        icon={'check_circle'}
                    />
                </Col>
                <Col xl={6}>
                    <FloatCardComponent
                        variant={'lg red'}
                        digit={userStatData?.blkUser}
                        title={'blocked users'}
                        icon={'remove_circle'}
                    />
                </Col>
                <Col xl={12}>
                    <div className="mc-card">
                        <div className="mc-card-header">
                            <h4 className="mc-card-title">{t('registered_users')}</h4>
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
                                    label={t('role_by')}
                                    option={["admin", "user","vendor"]}
                                    labelDir="label-col"
                                    fieldSize="mb-4 w-100 h-md"
                                />
                            </Col> */}
                            {/* <Col>
                                <LabelFieldComponent
                                    label={t('status_by')}
                                    option={['active', 'banned']}
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
                                            setUserSearchText(e.target.value);
                                            setCurrentPage(1);
                                        },
                                        [500],
                                    )}
                                />
                            </Col>
                        </Row>
                        <UsersTableComponent
                            thead={users.thead}
                            tbody={users.tbody}
                            rowView={rowView}
                            currentPage={currentPage}
                            setPages={setPages}
                            userSearchText={userSearchText}
                            _setReloadAction={setReloadAction}
                        />
                        {pages !== 0 ? (
                            <PaginationComponent
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                pages={pages}
                                rowShow={rowView}
                            />
                        ) : null}
                    </div>
                </Col>
            </Row>
        </PageLayout>
    );
}
