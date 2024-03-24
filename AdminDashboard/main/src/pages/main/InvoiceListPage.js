import React, { useContext } from "react";
import { TranslatorContext } from "../../context/Translator";
import { Link } from "react-router-dom";
import { Row, Col, Dropdown } from "react-bootstrap";
import { FloatCardComponent } from "../../components/cards";
import { PaginationComponent } from "../../components";
import LabelFieldComponent from "../../components/fields/LabelFieldComponent";
import InvoiceTableComponent from "../../components/tables/InvoiceTableComponent";
import PageLayout from "../../layouts/PageLayout";
import invoices from "../../assets/data/invoices.json"

export default function InvoiceListPage() {

    const { t, c, n } = useContext(TranslatorContext);

    const floats2 = [
        { "title": "pending_orders", "digit": 547, "icon": "pending", "variant": "lg purple" }, 
        { "title": "shipped_orders", "digit": 398, "icon": "local_shipping", "variant": "lg blue" },
        { "title": "recieved_orders", "digit": 605, "icon": "shopping_bag", "variant": "lg green" },
        { "title": "cancelled_orders", "digit": 249, "icon": "remove_circle", "variant": "lg red" }
    ]

    const floats = [
        { "title": "recieved_amount", "digit": 78593, "icon": "account_balance", "variant": "lg green" },
        { "title": "drafts_amount", "digit": 24950, "icon": "drafts", "variant": "lg blue" },
        { "title": "pending_amount", "digit": 53617, "icon": "pending", "variant": "lg purple" } 
    ]

    return (
        <PageLayout>
            <Row>
                <Col xl={12}>
                    <div className="mc-card">
                        <div className='mc-breadcrumb'>
                            <h3 className="mc-breadcrumb-title">{t('invoice_list')}</h3>
                            <ul className="mc-breadcrumb-list">
                                <li className="mc-breadcrumb-item"><Link to='#' className="mc-breadcrumb-link">{t('home')}</Link></li>
                                <li className="mc-breadcrumb-item"><Link to='#' className="mc-breadcrumb-link">{t('invoices')}</Link></li>
                                <li className="mc-breadcrumb-item">{t('invoice_list')}</li>
                            </ul>
                        </div>
                    </div>
                </Col>
                {floats.map((float, index) => (
                    <Col key={ index } md={6} lg={4}>
                        <FloatCardComponent 
                            variant={ float.variant }
                            digit={c(float.digit)}
                            title={t(float.title)}
                            icon={ float.icon }
                        />
                    </Col>
                ))}
                {floats2.map((float, index) => (
                    <Col key={ index } xl={3}>
                        <FloatCardComponent 
                            variant={ float.variant }
                            digit={n(float.digit)}
                            title={t(float.title)}
                            icon={ float.icon }
                        />
                    </Col>
                ))}
                <Col xl={12}>
                    <div className="mc-card">
                        <div className="mc-card-header">
                            <h4 className="mc-card-title">{t('shopping_invoices')}</h4>
                            <Dropdown bsPrefix="mc-dropdown">
                                <Dropdown.Toggle bsPrefix="mc-dropdown-toggle">
                                    <i className='material-icons'>more_horiz</i>
                                </Dropdown.Toggle>
                                <Dropdown.Menu align="end" className="mc-dropdown-paper">
                                    <button type='button' className='mc-dropdown-menu'><i className='material-icons'>edit</i><span>{t('edit')}</span></button>
                                    <button type='button' className='mc-dropdown-menu'><i className='material-icons'>delete</i><span>{t('delete')}</span></button>
                                    <button type='button' className='mc-dropdown-menu'><i className='material-icons'>download</i><span>{t('download')}</span></button>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <Row xs={1} sm={2} lg={4}>
                            <Col>
                                <LabelFieldComponent 
                                    label={t('show_by')}
                                    option={["12 row", "24 row", "36 row"]}
                                    labelDir="label-col"
                                    fieldSize="mb-4 w-100 h-md"
                                /> 
                            </Col>
                            <Col>
                                <LabelFieldComponent 
                                    label={t('status_by')}
                                    option={["recieved", "drafts", "pending"]}
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
                                    placeholder={t('id') + ' / ' + t('name') + ' / ' + t('email')}
                                /> 
                            </Col>
                        </Row>
                        <InvoiceTableComponent 
                            thead={ invoices.thead } 
                            tbody={ invoices.tbody } 
                        />
                        <PaginationComponent />
                    </div>
                </Col>
            </Row>
        </PageLayout>
    )
}