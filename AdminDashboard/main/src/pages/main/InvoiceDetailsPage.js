import React, { useContext } from "react";
import { TranslatorContext } from "../../context/Translator";
import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import { AnchorComponent } from "../../components/elements";
import PageLayout from "../../layouts/PageLayout";
import data from "../../assets/data/invoiceDetails.json";

export default function InvoiceDetailsPage() {

    const { t } = useContext(TranslatorContext);

    return (
        <PageLayout>
            <Row>
                <Col xl={12}>
                    <div className="mc-card">
                        <div className='mc-breadcrumb'>
                            <h3 className="mc-breadcrumb-title">{t('invoice_details')}</h3>
                            <ul className="mc-breadcrumb-list">
                                <li className="mc-breadcrumb-item"><Link to='#' className="mc-breadcrumb-link">{t('home')}</Link></li>
                                <li className="mc-breadcrumb-item"><Link to='#' className="mc-breadcrumb-link">{t('invoices')}</Link></li>
                                <li className="mc-breadcrumb-item">{t('invoice_details')}</li>
                            </ul>
                        </div>
                    </div>
                </Col>
                <Col xl={12}>
                    <div className="mc-card p-md-5">
                        <div className="mc-invoice-head">
                            <img src="images/logo.webp" alt="logo" />
                            <h2>{t('invoice')} #985466</h2>
                        </div>
                        <div className="mc-invoice-group">
                            <div className="mc-invoice-recieved">
                                <h6>{t('order_recieved')}</h6>
                                <p>Office 25/B, Road 30, West jalkuri, Fatullah, Narayanganj 1265. +8801838288389, support@miron.com</p>
                            </div>
                            <div className="mc-invoice-shipment">
                                <h6>shipment_details</h6>
                                <p>House 17/A, Road 09, West jalkuri, Fatullah, Narayanganj 1265. +8801838288389, support@miron.com</p>
                            </div>
                        </div>
                        <div className="mc-table-responsive">
                            <table className="mc-table">
                                <thead className="mc-table-head">
                                    <tr>
                                        {data?.table.thead.map((item, index) => (
                                            <th key={ index }>{ item }</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="mc-table-body">
                                    {data?.table.tbody.map((item, index) => (
                                        <tr key={ index }>
                                            <td>{ item.id }</td>
                                            <td>
                                                <div className="mc-table-product sm">
                                                    <img src={ item.src } alt={ item.alt } />
                                                    <p>{ item.name }</p>
                                                </div>
                                            </td>
                                            <td>{ item.price }</td>
                                            <td>{ item.discount }</td>
                                            <td>{ item.quantity }</td>
                                            <td>{ item.amount }</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mc-invoice-list-group">
                            <ul className="mc-invoice-list">
                                {data?.list.map((item, index) => (
                                    <li key={ index }>
                                        <span className="title">{ item.title }</span>
                                        <span className="clone">:</span>
                                        { item.digit && <span className={`digit ${ item.addClass ? item.addClass : "" }`}>{ item.digit }</span> }
                                        { item.status && <span className={`status ${ item.variant ? item.variant : "" }`}>{ item.status }</span> }
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <p className="mc-invoice-note">Thank you for ordering greeny. We offer a 7-day return policy on all products. If you have any complain about this order, please call or email us. (VAT has been calculated as per GO 02/Mushak/2019). This is a sytem generated invoice and no signature or seal is required.</p>
                        <div className="mc-invoice-btns">
                            <AnchorComponent 
                                to="#"
                                icon="print"
                                text={t('print_this_reciept')}
                                className="btn btn-dark"
                            /> 
                            <AnchorComponent 
                                to="#"
                                icon="download"
                                text={t('download_as_pdf')}
                                className="btn btn-success"
                            /> 
                        </div>
                    </div>
                </Col>
            </Row>
        </PageLayout>
    )
}