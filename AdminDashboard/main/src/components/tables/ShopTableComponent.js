import React, { useState, useEffect, useContext } from 'react';
import { TranslatorContext } from '../../context/Translator';
import { Modal, Form } from 'react-bootstrap';
import { ButtonComponent, AnchorComponent } from '../elements';
import axiosInstance from '../../configs/axiosInstance';

export default function ShopTableComponent({ thead, tbody, rowView, currentPage, setPages, shopSearchText, _setReloadAction }) {
    const { t } = useContext(TranslatorContext);

    const [data, setData] = useState([]);
    const [userData, setUserData] = React.useState('');
    const [editModal, setEditModal] = React.useState(false);

    const [reloadAction, setReloadAction] = useState(false);

    const [selectedStatus, setSelectedStatus] = useState('');

    const changeShopStatusHandler = async (_id) => {
        if (selectedStatus) {
            try {
                const result = await axiosInstance.patch(`/api/shop/${_id}?status=${selectedStatus}`);
                console.log(result.data.data);
                setReloadAction(!reloadAction);
                _setReloadAction(!reloadAction);
            } catch (e) {
                console.error(e);
            }
        }
        setEditModal(false);
        setSelectedStatus('');
    };

    useEffect(() => {
        const fetchAllShops = async () => {
            try {
                const result = await axiosInstance.get(
                    `/api/shop?&currentPage=${currentPage}&limit=${rowView}&searchText=${shopSearchText || ''}`,
                );
                console.log(result.data);
                setData(result.data.data.shops);
                setPages(result.data.pages);
            } catch (e) {
                console.error(e);
            }
        };
        fetchAllShops();
    }, [reloadAction, rowView, currentPage, setPages, shopSearchText]);

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
                        <th>name</th>
                        <th>owner</th>
                        <th>email</th>
                        <th>status</th>
                        <th>created</th>
                        <th>action</th>
                    </tr>
                </thead>
                <tbody className="mc-table-body even">
                    {data?.map((item, index) => (
                        <tr key={index}>
                            <td title="id">
                                <div className="mc-table-check">
                                    <p>#{item._id}</p>
                                </div>
                            </td>
                            <td title={item.name}>
                                <div className="mc-table-profile">
                                    {/* <img src={item.src} alt={item.alt} /> */}
                                    <p>{item.name}</p>
                                </div>
                            </td>
                            <td title={item.vendor.name}>
                                <div className="mc-table-profile">
                                    {/* <img src={item.src} alt={item.alt} /> */}
                                    <a href={`/user/${item.vendor._id}`}>{item.vendor.name}</a>
                                </div>
                            </td>
                            {/* <td title={item.role}>
                                <div className="mc-table-icon role">
                                    {item.role === 'vendor' && <i className="material-icons yellow">store</i>}
                                    {item.role === 'user' && <i className="material-icons green">person</i>}
                                    {item.role === 'admin' && <i className="material-icons purple">settings</i>}
                                    <span>{item.role}</span>
                                </div>
                            </td> */}
                            <td title={item.email}>{item.email}</td>
                            <td title={item.status}>
                                {item.status === 'active' && <p className="mc-table-badge green">{item.status}</p>}
                                {item.status === 'pending' && <p className="mc-table-badge yellow">{item.status}</p>}
                                {item.status === 'stop' && <p className="mc-table-badge purple">{item.status}</p>}
                                {item.status === 'banned' && <p className="mc-table-badge red">{item.status}</p>}
                            </td>
                            <td title={item.createDate}>{Date(item.createDate)}</td>
                            <td>
                                <div className="mc-table-action">
                                    {item.status !== 'pending' ? (
                                        <AnchorComponent to={`/shop/${item._id}`} title="View" className="material-icons view">
                                            visibility
                                        </AnchorComponent>
                                    ) : null}
                                    <ButtonComponent
                                        title="Edit"
                                        className="material-icons edit"
                                        onClick={() => setEditModal(true, setUserData(item))}
                                    >
                                        edit
                                    </ButtonComponent>
                                    {/* <ButtonComponent
                                        title="Delete"
                                        className="material-icons block"
                                        onClick={() => setBlockModal({ _id: item._id, status: item.status })}
                                    >
                                        block
                                    </ButtonComponent> */}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal show={editModal} onHide={() => setEditModal(false, setUserData(''))}>
                <div className="mc-user-modal">
                    <img src={userData.avatar?.url} alt={userData?.alt} />
                    <h4>{userData?.name}</h4>
                    <p>{userData?.email}</p>
                    {/* <Form.Group className="form-group inline mb-4">
                        <Form.Label>{t('role')}</Form.Label>
                        <Form.Select>
                            <option value="admin">{t('admin')}</option>
                            <option value="user">{t('user')}</option>
                            <option value="vendor">{t('vendor')}</option>
                        </Form.Select>
                    </Form.Group> */}
                    <Form.Group className="form-group inline">
                        <Form.Label>{t('status')}</Form.Label>
                        <Form.Select
                            onChange={(e) => {
                                // console.log(e.target.value);
                                setSelectedStatus(e.target.value);
                            }}
                        >
                            <option value="active" selected={userData.status === 'active'}>
                                {t('active')}
                            </option>
                            <option value="banned" selected={userData.status === 'banned'}>
                                {t('banned')}
                            </option>
                        </Form.Select>
                    </Form.Group>
                    <Modal.Footer>
                        <ButtonComponent type="button" className="btn btn-secondary" onClick={() => setEditModal(false)}>
                            {t('close_popup')}
                        </ButtonComponent>
                        <ButtonComponent
                            type="button"
                            className="btn btn-success"
                            onClick={() => {
                                changeShopStatusHandler(userData._id);
                            }}
                        >
                            {t('save_changes')}
                        </ButtonComponent>
                    </Modal.Footer>
                </div>
            </Modal>
        </div>
    );
}
