import React, { useContext } from 'react';
import { TranslatorContext } from '../../context/Translator';
import { Link } from 'react-router-dom';
import { Row, Col, Dropdown } from 'react-bootstrap';
import { FloatCardComponent } from '../../components/cards';
import { PaginationComponent } from '../../components';
import LabelFieldComponent from '../../components/fields/LabelFieldComponent';
import UsersTableComponent from '../../components/tables/UsersTableComponent';
import PageLayout from '../../layouts/PageLayout';
import users from '../../assets/data/users.json';

export default function UserListPage() {
    const floats = [
        { title: 'approved users', digit: '605', icon: 'check_circle', variant: 'lg green' },
        { title: 'blocked users', digit: '249', icon: 'remove_circle', variant: 'lg red' },
    ];

    const { t } = useContext(TranslatorContext);

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
                {floats.map((float, index) => (
                    <Col xl={6} key={index}>
                        <FloatCardComponent variant={float.variant} digit={float.digit} title={float.title} icon={float.icon} />
                    </Col>
                ))}
                <Col xl={12}>
                    <div className="mc-card">
                        <div className="mc-card-header">
                            <h4 className="mc-card-title">{t('registered_users')}</h4>
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
                        <Row xs={1} sm={3} xl={3}>
                            <Col>
                                <LabelFieldComponent
                                    label={t('show_by')}
                                    option={['12 row', '24 row', '36 row']}
                                    labelDir="label-col"
                                    fieldSize="mb-4 w-100 h-md"
                                />
                            </Col>
                            {/* <Col>
                                <LabelFieldComponent
                                    label={t('role_by')}
                                    option={["admin", "member", "client", "manager", "vendor"]}
                                    labelDir="label-col"
                                    fieldSize="mb-4 w-100 h-md"
                                />
                            </Col> */}
                            <Col>
                                <LabelFieldComponent
                                    label={t('status_by')}
                                    option={['approved', 'pending', 'blocked']}
                                    labelDir="label-col"
                                    fieldSize="mb-4 w-100 h-md"
                                />
                            </Col>
                            <Col>
                                <LabelFieldComponent
                                    type="search"
                                    label={t('search_by')}
                                    placeholder={t('id') + ' / ' + t('name') + ' / ' + t('email') + ' / ' + t('number')}
                                    labelDir="label-col"
                                    fieldSize="mb-4 w-100 h-md"
                                />
                            </Col>
                        </Row>
                        <UsersTableComponent thead={users.thead} tbody={users.tbody} />
                        <PaginationComponent />
                    </div>
                </Col>
            </Row>
        </PageLayout>
    );
}
