import React, { useContext, useEffect, useState } from 'react';
import { TranslatorContext } from '../../context/Translator';
import { Link, useParams } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { AnchorComponent } from '../../components/elements';
import PageLayout from '../../layouts/PageLayout';
import data from '../../assets/data/invoiceDetails.json';
import axiosInstance from '../../configs/axiosInstance';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import AddressStaticData from '../../assets/data/static/dataprovince';
import html2pdf from 'html2pdf.js';

export default function InvoiceDetailsPage() {
    const { t } = useContext(TranslatorContext);
    const { orderId } = useParams();

    const [orderData, setOrderData] = useState({});
    const [qrData, seQrData] = useState('');

    function getBase64Image(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = function () {
                const canvas = document.createElement('canvas');
                canvas.width = this.width;
                canvas.height = this.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(this, 0, 0);
                const dataURL = canvas.toDataURL('image/png');
                resolve(dataURL);
            };
            img.onerror = reject;
            img.src = url;
        });
    }

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                const response = await axiosInstance.get(`/api/order/${orderId}`);
                const temp = { ...response.data.data };
                for (let i = 0; i < temp.items.length; i++) {
                    const base64 = await getBase64Image(temp.items[i].image);
                    temp.items[i].image = base64;
                }
                console.log(response.data.data);
                setOrderData({ ...temp });
                //
                var QRCode = require('qrcode');
                const url = await QRCode.toDataURL('I am a pony!');
                seQrData(url);
            } catch (err) {
                console.error(err);
            }
        };
        fetchOrderData();
    }, [orderId]);

    const [shopAd, setShopAd] = useState({});

    useEffect(() => {
        const fetchShopAddress = async () => {
            try {
                const response = await axiosInstance.get(`/api/address/shop/${0}`);
                console.log(response.data);
                setShopAd({ ...response.data.data.addresses.address });
            } catch (err) {
                console.error(err);
            }
        };
        fetchShopAddress();
    }, []);

    const printOrder = () => {
        const invoice = document.getElementById('element-to-print');
        html2pdf()
            .from(invoice)
            .save(orderId + '.pdf');
    };

    const setOrderStatus = () => {
        if (['None', 'Confirmed'].includes(orderData.onlPayStatus) && orderData.status !== 'Done') {
            // post to change order status
            return;
        }
    };

    const genQRCode = async () => {};

    return (
        <PageLayout>
            <Row>
                <Col xl={12}>
                    <div className="mc-card">
                        <div className="mc-breadcrumb">
                            <h3 className="mc-breadcrumb-title">{t('invoice_details')}</h3>
                            <ul className="mc-breadcrumb-list">
                                <li className="mc-breadcrumb-item">
                                    <Link to="#" className="mc-breadcrumb-link">
                                        {t('home')}
                                    </Link>
                                </li>
                                <li className="mc-breadcrumb-item">
                                    <Link to="/order" className="mc-breadcrumb-link">
                                        {t('order')}
                                    </Link>
                                </li>
                                <li className="mc-breadcrumb-item">{t('order details')}</li>
                            </ul>
                        </div>
                    </div>
                </Col>
                <Col xl={12}>
                    <div className="mc-card p-md-5">
                        <div id="element-to-print" className="mc-card p-md-5">
                            <div className="mc-invoice-head">
                                <img src={qrData} alt="logo" />
                                <h2>
                                    {t('invoice')} #{orderData?._id}
                                </h2>
                            </div>
                            <div className="mc-invoice-group" style={{ alignItems: 'start' }}>
                                <div className="mc-invoice-recieved">
                                    <h6>{t('From :')}</h6>
                                    <p>
                                        {orderData?.shop?.name}
                                        <br />
                                        {shopAd?.detail
                                            ? `${shopAd?.detail}, ${
                                                  AddressStaticData.treeDataProvince[shopAd?.province].district[shopAd?.district]
                                                      .ward[shopAd?.ward].label
                                              }, ${
                                                  AddressStaticData.treeDataProvince[shopAd?.province].district[shopAd?.district]
                                                      .label
                                              }, ${AddressStaticData.treeDataProvince[shopAd?.province].label}`
                                            : null}
                                        <br />
                                        {orderData?.shop?.email}
                                        <br />
                                    </p>
                                </div>
                                <div className="mc-invoice-shipment">
                                    <h6>
                                        To :{' '}
                                        {orderData?.address?.isHome ? '(Home)' : orderData?.address?.isWork ? '(Work)' : null}
                                    </h6>
                                    <p>
                                        {orderData?.name}
                                        <br />
                                        {orderData?.phoneNumber}
                                        <br />
                                        {orderData?.address?.district
                                            ? `${orderData?.address?.detail}, ${
                                                  AddressStaticData.treeDataProvince[orderData?.address?.province].district[
                                                      orderData?.address?.district
                                                  ].ward[orderData?.address?.ward].label
                                              }, ${
                                                  AddressStaticData.treeDataProvince[orderData?.address?.province].district[
                                                      orderData?.address?.district
                                                  ].label
                                              }, ${AddressStaticData.treeDataProvince[orderData?.address?.province].label}`
                                            : null}
                                        <br />
                                        {orderData?.email}
                                    </p>
                                </div>
                            </div>
                            <div className="mc-table-responsive">
                                <table className="mc-table">
                                    <thead className="mc-table-head">
                                        <tr>
                                            <th>Product</th>
                                            <th>Variant</th>
                                            <th>Price</th>
                                            <th>Quantity</th>
                                            <th>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="mc-table-body">
                                        {orderData?.items?.map((item, index) => {
                                            const snapshotObj = JSON.parse(item.idToSnapshot.productJson);
                                            const variantDataName = [];
                                            if (item.variant && item.variant.length > 0) {
                                                for (let i = 0; i < snapshotObj.variantData.length; i++) {
                                                    // console.log(snapshotObj.variantData[i].data);
                                                    variantDataName.push(
                                                        snapshotObj.variantData[i].data.find((v) => v._id === item.variant[i])
                                                            .name,
                                                    );
                                                }
                                            }
                                            return (
                                                <tr key={index}>
                                                    <td>
                                                        <div className="mc-table-product sm">
                                                            <img src={item.image} alt="img" />
                                                            <p>{item.name}</p>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {item.variant && item.variant.length > 0 ? variantDataName.join(',') : ''}
                                                    </td>
                                                    <td>{item.price}$</td>
                                                    <td>{item.quantity}</td>
                                                    <td>{item.price * item.quantity}$</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mc-invoice-list-group">
                                <ul className="mc-invoice-list">
                                    <li>
                                        <span className="title">Subtotal</span>
                                        <span className="clone">:</span>
                                        <span className={`digit`}>{orderData?.total}$</span>
                                    </li>
                                    <li>
                                        <span className="title">Shipping</span>
                                        <span className="clone">:</span>
                                        <span className={`digit`}>{orderData?.shippingCost}$</span>
                                    </li>
                                    <li>
                                        <span className="title">Status</span>
                                        <span className="clone">:</span>
                                        <span className={`status purple`}>{orderData?.status}</span>
                                    </li>
                                    {orderData?.onlPayStatus !== 'None' ? (
                                        <li>
                                            <span className="title">Payment</span>
                                            <span className="clone">:</span>
                                            <span className={`status purple`}>{orderData?.onlPayStatus}</span>
                                        </li>
                                    ) : null}
                                    <li>
                                        <span className="title">Total</span>
                                        <span className="clone">:</span>
                                        <span className={`digit`}>{orderData?.total + orderData?.shippingCost}$</span>
                                    </li>
                                </ul>
                            </div>
                            <p>Create at: {Date(orderData?.createAt)}</p>
                        </div>
                        {/* <p className="mc-invoice-note">
                            Thank you for ordering greeny. We offer a 7-day return policy on all products. If you have any
                            complain about this order, please call or email us. (VAT has been calculated as per GO
                            02/Mushak/2019). This is a sytem generated invoice and no signature or seal is required.
                        </p> */}
                        <div className="mc-invoice-btns">
                            <AnchorComponent
                                to="#"
                                icon="print"
                                text={t('print_this_reciept')}
                                className="btn btn-dark"
                                onClick={printOrder}
                            />
                            <AnchorComponent
                                to="#"
                                icon="update"
                                text={'Set status'}
                                className="btn btn-success"
                                onClick={setOrderStatus}
                            />
                        </div>
                    </div>
                </Col>
            </Row>
        </PageLayout>
    );
}
