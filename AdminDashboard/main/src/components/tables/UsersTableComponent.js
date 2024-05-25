import React, { useState, useEffect, useContext } from 'react';
import { TranslatorContext } from '../../context/Translator';
import { Modal, Form } from 'react-bootstrap';
import { ButtonComponent, AnchorComponent } from '../elements';
import axiosInstance from '../../configs/axiosInstance';
import { useSelector } from 'react-redux';

export default function UsersTableComponent({ thead, tbody, rowView, currentPage, setPages, userSearchText, _setReloadAction }) {
    const { t } = useContext(TranslatorContext);
    const { shopId, isVendor } = useSelector((state) => state.persistedReducer.authReducer);

    const [data, setData] = useState([]);
    const [userData, setUserData] = React.useState('');
    const [editModal, setEditModal] = React.useState(false);
    const [blockModal, setBlockModal] = React.useState(false);

    const [reloadAction, setReloadAction] = useState(false);

    const blockUserHandler = async ({ _id, status }) => {
        console.log(_id);
        console.log(status);
        try {
            const result = await axiosInstance.patch(`/api/user/${_id}`, {
                status: status === 'active' ? 'banned' : 'active',
            });
            console.log(result.data.data);
            setReloadAction(!reloadAction);
            _setReloadAction(!reloadAction)
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const result = await axiosInstance.get(
                    `/api/user?currentPage=${currentPage}&limit=${rowView}&searchText=${userSearchText || ''}`,
                );
                console.log(result.data.data);
                setData(result.data.data);
                setPages(result.data.pages);
            } catch (e) {
                console.error(e);
            }
        };
        fetchAllUsers();
    }, [reloadAction, currentPage, rowView, setPages, userSearchText]);

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
                        <th>role</th>
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
                            <td title={item.role}>
                                <div className="mc-table-icon role">
                                    {item.role === 'vendor' && <i className="material-icons yellow">store</i>}
                                    {item.role === 'user' && <i className="material-icons green">person</i>}
                                    {item.role === 'admin' && <i className="material-icons purple">settings</i>}
                                    <span>{item.role}</span>
                                </div>
                            </td>
                            <td title={item.email}>{item.email}</td>
                            <td title={item.status}>
                                {item.status === 'active' && <p className="mc-table-badge green">{item.status}</p>}
                                {item.status === 'pending' && <p className="mc-table-badge purple">{item.status}</p>}
                                {item.status === 'banned' && <p className="mc-table-badge red">{item.status}</p>}
                            </td>
                            <td title={item.createDate}>{Date(item.createDate)}</td>
                            <td>
                                <div className="mc-table-action">
                                    <AnchorComponent to={`/user/${item._id}`} title="View" className="material-icons view">
                                        visibility
                                    </AnchorComponent>
                                    <ButtonComponent
                                        title="Edit"
                                        className="material-icons edit"
                                        onClick={() => setBlockModal({ _id: item._id, status: item.status })}
                                    >
                                        edit
                                    </ButtonComponent>
                                    {/* <ButtonComponent
                                        title="Delete"
                                        className="material-icons block"
                                        onClick={() => setEditModal(true, setUserData(item))}
                                    >
                                        delete
                                    </ButtonComponent> */}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal show={editModal} onHide={() => setEditModal(false, setUserData(''))}>
                <div className="mc-user-modal">
                    <img src={userData.src} alt={userData?.alt} />
                    <p>Want to delete this user's account ?</p>
                    <h4>{userData?.name}</h4>
                    <p>{userData?.email}</p>
                    <Modal.Footer>
                        <ButtonComponent type="button" className="btn btn-secondary" onClick={() => setEditModal(false)}>
                            {t('close')}
                        </ButtonComponent>
                        <ButtonComponent type="button" className="btn btn-danger" onClick={() => setEditModal(false)}>
                            {t('delete')}
                        </ButtonComponent>
                    </Modal.Footer>
                </div>
            </Modal>

            <Modal show={blockModal} onHide={() => setBlockModal(false)}>
                <div className="mc-alert-modal">
                    <i className="material-icons">new_releases</i>
                    <h3>are your sure!</h3>
                    <p>Want to change this user's account status to {blockModal.status === 'active' ? 'banned' : 'active'}?</p>
                    <Modal.Footer>
                        <ButtonComponent type="button" className="btn btn-secondary" onClick={() => setBlockModal(false)}>
                            {t('close')}
                        </ButtonComponent>
                        <ButtonComponent
                            type="button"
                            className="btn btn-success"
                            onClick={() => {
                                blockUserHandler(blockModal);
                                setBlockModal(false);
                            }}
                        >
                            {t('change')}
                        </ButtonComponent>
                    </Modal.Footer>
                </div>
            </Modal>
        </div>
    );
}
