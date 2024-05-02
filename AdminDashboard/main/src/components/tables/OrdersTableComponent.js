import React, { useState, useEffect, useContext } from 'react';
import { TranslatorContext } from '../../context/Translator';
import Modal from 'react-bootstrap/Modal';
import { ButtonComponent, AnchorComponent } from '../elements';
import axiosInstance from '../../configs/axiosInstance';

export default function OrderTableComponent({ thead, tbody, rowView, currentPage, setPages, orderSearchText, date }) {
    const [alertModal, setAlertModal] = React.useState(false);
    const [data, setData] = useState([]);

    const { t } = useContext(TranslatorContext);

    useEffect(() => {
        const fetchOrdersData = async () => {
            try {
                const response = await axiosInstance.get(
                    `/api/order?target=adminPage&currentPage=${currentPage}&limit=${rowView}&searchText=${
                        orderSearchText || ''
                    }&date=${date}`,
                );
                console.log(response.data);
                setData([...response.data.orders]);
                setPages(response.data.pages);
            } catch (err) {
                console.error(err);
            }
        };
        fetchOrdersData();
    }, [rowView, currentPage, setPages, orderSearchText, date]);

    const orderSatusView = (status) => {
        switch (status) {
            case 'Pending':
                return 'yellow';
            case 'Fail':
                return 'red';
            case 'Confirmed':
                return 'blue';
            case 'Shipped':
                return 'orange';
            case 'Delivered':
                return 'purple';
            case 'Done':
                return 'green';
            default:
                return 'yellow';
        }
    };

    return (
        <div className="mc-table-responsive">
            <table className="mc-table">
                <thead className="mc-table-head primary">
                    <tr>
                        <th>
                            <div className="mc-table-check">
                                <p>uid</p>
                            </div>
                        </th>
                        {thead.map((item, index) => (
                            <th key={index}>{item}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="mc-table-body even">
                    {data?.map((item, index) => (
                        <tr key={index}>
                            <td>
                                <div className="mc-table-check">
                                    <p>{item._id}</p>
                                </div>
                            </td>
                            <td>
                                <div className="mc-table-profile">
                                    <p>{item.name}</p>
                                </div>
                            </td>
                            <td>{item.totalItem} items</td>
                            <td>{item.total}$</td>
                            <td>{item.onlPayStatus !== 'None' ? 'VNPAY' : 'COD'}</td>
                            <td>
                                <p className={`mc-table-badge ${orderSatusView(item.status)}`}>{item.status}</p>
                            </td>
                            <td>{new Date(parseInt(item.createDate)).toLocaleDateString()}</td>
                            <td>
                                <div className="mc-table-action">
                                    <AnchorComponent title="View" to={`/order/${item._id}`} className="material-icons view">
                                        visibility
                                    </AnchorComponent>
                                    <AnchorComponent title="Download" href="#" className="material-icons download" download>
                                        download
                                    </AnchorComponent>
                                    {/* <ButtonComponent
                                        title="Delete"
                                        className="material-icons delete"
                                        onClick={() => setAlertModal(true)}
                                    >
                                        delete
                                    </ButtonComponent> */}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Modal show={alertModal} onHide={() => setAlertModal(false)}>
                <div className="mc-alert-modal">
                    <i className="material-icons">new_releases</i>
                    <h3>are your sure!</h3>
                    <p>Want to delete this order?</p>
                    <Modal.Footer>
                        <ButtonComponent type="button" className="btn btn-secondary" onClick={() => setAlertModal(false)}>
                            {t('close')}
                        </ButtonComponent>
                        <ButtonComponent type="button" className="btn btn-danger" onClick={() => setAlertModal(false)}>
                            {t('delete')}
                        </ButtonComponent>
                    </Modal.Footer>
                </div>
            </Modal>
        </div>
    );
}
