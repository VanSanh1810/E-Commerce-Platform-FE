import React, { useState, useEffect, useContext } from 'react';
import { TranslatorContext } from '../../context/Translator';
import Modal from 'react-bootstrap/Modal';
import { ButtonComponent } from '../elements';
import { LabelFieldComponent } from '../fields';
import { Col } from 'react-bootstrap';
import axiosInstance from '../../configs/axiosInstance';

export default function CategoryTableComponent({ thead, tbody, setIsEmpty }) {
    const { t } = useContext(TranslatorContext);

    const [alertModal, setAlertModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [data, setData] = useState([]);

    const [reloadAction, setReloadAction] = useState(false);

    const [editData, setEditData] = useState('');

    const editCateHandler = async () => {
        try {
            const result = await axiosInstance.patch(`/api/category/${editModal?.id}`, {
                name: editData.trim(),
            });
            console.log(result);
            setReloadAction(!reloadAction);
        } catch (e) {
            console.log(e);
        }
        setEditModal(false);
    };

    const deleteCateHandler = async () => {
        try {
            const result = await axiosInstance.delete(`/api/category/${alertModal}`);
            console.log(result);

            setReloadAction(!reloadAction);
        } catch (e) {
            console.log(e);
        }
        setAlertModal(false);
    };

    useEffect(() => {
        const fetchCateData = async () => {
            try {
                const result = await axiosInstance.get('/api/category');
                setData(result.data.data);
                console.log(result.data);
            } catch (e) {
                console.log(e);
            }
        };
        fetchCateData();
    }, [reloadAction]);

    useEffect(() => {
        if (data.length === 0) {
            setIsEmpty(true);
        } else {
            setIsEmpty(true);
        }
    }, [data, setIsEmpty]);

    const handleCheckbox = (event) => {
        const { name, checked } = event.target;

        if (name === 'allCheck') {
            const checkData = data?.map((item) => {
                return { ...item, isChecked: checked };
            });
            setData(checkData);
        } else {
            const checkData = data?.map((item) => (item.name === name ? { ...item, isChecked: checked } : item));
            setData(checkData);
        }
    };

    return (
        <div className="mc-table-responsive">
            <table className="mc-table product">
                <thead className="mc-table-head primary">
                    <tr>
                        <th>
                            <div className="mc-table-check">
                                {/* <input 
                                    type="checkbox" 
                                    name="allCheck"
                                    checked={ data?.filter((item)=> item.isChecked !== true).length < 1 } 
                                    onChange={ handleCheckbox } 
                                /> */}
                                <p>uid</p>
                            </div>
                        </th>
                        <th>{t('Category Name')}</th>
                        <th>{t('Created')}</th>
                        <th>{t('Total product')}</th>
                        <th>{t('Action')}</th>
                        {/* {thead.map((item, index) => (
                            
                        ))} */}
                    </tr>
                </thead>
                <tbody className="mc-table-body even">
                    {data?.map((item, index) => (
                        <tr key={index}>
                            <td title={index + 1}>
                                <div className="mc-table-check">
                                    {/* <input 
                                        type="checkbox" 
                                        name={'check' + index} 
                                        checked={ item?.isChecked || false }
                                        onChange={ handleCheckbox } 
                                    /> */}
                                    <p>{item._id}</p>
                                </div>
                            </td>
                            <td>
                                <div className="mc-table-product md">
                                    <div className="mc-table-group">
                                        <h6>{item.name}</h6>
                                    </div>
                                </div>
                            </td>
                            <td>{item.createDate}</td>
                            <td>{item.products.length}</td>
                            <td>
                                <div className="mc-table-action">
                                    {/* <AnchorComponent to="/product-view" title="View" className="material-icons view">{ item.action.view }</AnchorComponent> */}
                                    {/* <AnchorComponent to="/product-upload" title="Edit" className="material-icons edit">{ item.action.edit }</AnchorComponent> */}
                                    <ButtonComponent
                                        type="button"
                                        title="Edit"
                                        className="material-icons edit"
                                        onClick={() => {
                                            setEditData(item.name);
                                            setEditModal({ id: item._id, name: item.name });
                                        }}
                                    >
                                        edit
                                    </ButtonComponent>
                                    <ButtonComponent
                                        type="button"
                                        title="Delete"
                                        className="material-icons delete"
                                        onClick={() => setAlertModal(item._id)}
                                    >
                                        delete
                                    </ButtonComponent>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal show={alertModal ? true : false} onHide={() => setAlertModal(false)}>
                <div className="mc-alert-modal">
                    <i className="material-icons">new_releases</i>
                    <h3>are your sure!</h3>
                    <p>Want to delete this category?</p>
                    <Modal.Footer>
                        <ButtonComponent type="button" className="btn btn-secondary" onClick={() => setAlertModal(false)}>
                            {t('close')}
                        </ButtonComponent>
                        <ButtonComponent type="button" className="btn btn-danger" onClick={deleteCateHandler}>
                            {t('delete')}
                        </ButtonComponent>
                    </Modal.Footer>
                </div>
            </Modal>

            <Modal show={editModal ? true : false} onHide={() => setEditModal(false)}>
                <div className="mc-alert-modal">
                    <i className="material-icons">new_releases</i>
                    <h3>Edit Category</h3>
                    {/* <p>Want to delete this category?</p> */}
                    <Col xl={12}>
                        <LabelFieldComponent
                            type="text"
                            label={t('category name')}
                            fieldSize="mb-4 w-100 h-md"
                            defaultValue={editModal.name}
                            onChange={(e) => {
                                setEditData(e.target.value);
                            }}
                        />
                    </Col>
                    <Modal.Footer>
                        <ButtonComponent type="button" className="btn btn-secondary" onClick={() => setEditModal(false)}>
                            {t('close')}
                        </ButtonComponent>
                        {editModal.name?.trim() !== editData?.trim() ? (
                            <ButtonComponent type="button" className="btn btn-success" onClick={editCateHandler}>
                                {t('Save')}
                            </ButtonComponent>
                        ) : null}
                    </Modal.Footer>
                </div>
            </Modal>
        </div>
    );
}
