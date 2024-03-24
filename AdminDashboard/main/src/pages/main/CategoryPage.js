import React, { useContext, useState } from 'react';
import PageLayout from '../../layouts/PageLayout';
import { TranslatorContext } from '../../context/Translator';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LabelFieldComponent } from '../../components/fields';
import { PaginationComponent } from '../../components';
import products from '../../assets/data/products.json';
import CategoryTableComponent from '../../components/tables/CategoryTableComponent';
import { ButtonComponent } from '../../components/elements';
import Modal from 'react-bootstrap/Modal';
import axiosInstance from '../../configs/axiosInstance';

export default function CategoryPage() {
    const { t, n } = useContext(TranslatorContext);

    const [createCateModal, setCreateCateModal] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);

    const [cateName, setCateName] = useState();

    const createCateHandler = async () => {
        try {
            const result = await axiosInstance.post('/api/category', {
                name: cateName,
            });
            // console.log(cateName);
            console.log(result);
            setCreateCateModal(false);
        } catch (err) {
            console.log(err);
        }
    };

    const onInputChangeHandler = (e) => {
        // console.log(e.target.value);
        setCateName(e.target.value);
    };
    return (
        <PageLayout>
            <Row>
                <Col xl={12}>
                    <div className="mc-card">
                        <div className="mc-breadcrumb">
                            <h3 className="mc-breadcrumb-title">{t('Category List')}</h3>
                            <ul className="mc-breadcrumb-list">
                                <li className="mc-breadcrumb-item">
                                    <Link to="#" className="mc-breadcrumb-link">
                                        {t('home')}
                                    </Link>
                                </li>
                                <li className="mc-breadcrumb-item">
                                    <Link to="#" className="mc-breadcrumb-link">
                                        {t('products')}
                                    </Link>
                                </li>
                                <li className="mc-breadcrumb-item">{t('category')}</li>
                            </ul>
                        </div>
                    </div>
                </Col>
                <Col xl={12}>
                    <div className="mc-card">
                        <Row>
                            <Col xs={12} sm={6} md={4} lg={3}>
                                <LabelFieldComponent
                                    label={t('show_by')}
                                    option={['12 row', '24 row', '36 row']}
                                    labelDir="label-col"
                                    fieldSize="w-100 h-md mb-4"
                                />
                            </Col>
                            <Col xs={12} sm={6} md={4} lg={3}>
                                <LabelFieldComponent
                                    label={t('rating_by')}
                                    option={['1 star', '2 star', '3 star', '4 star', '5 star']}
                                    labelDir="label-col"
                                    fieldSize="w-100 h-md mb-4"
                                />
                            </Col>
                            <Col xs={12} sm={6} md={4} lg={3}>
                                <LabelFieldComponent
                                    label={t('category_by')}
                                    option={['mans', 'womans', 'kids', 'accessory']}
                                    labelDir="label-col"
                                    fieldSize="w-100 h-md mb-4"
                                />
                            </Col>
                            <Col xs={12} sm={6} md={4} lg={3}>
                                <ButtonComponent
                                    className="mc-btn w-100 primary mt-4"
                                    text={t('create category')}
                                    icon="cloud_upload"
                                    onClick={() => setCreateCateModal(true)}
                                />
                            </Col>
                            <Col xl={12}>
                                <CategoryTableComponent thead={products.thead} tbody={products.tbody} setIsEmpty={setIsEmpty} />
                                {isEmpty ? null : <PaginationComponent />}
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
            <Modal show={createCateModal} onHide={() => setCreateCateModal(false)}>
                <div className="mc-alert-modal">
                    <i className="material-icons">new_releases</i>
                    <h3>Create Category</h3>
                    {/* <p>Want to delete this category?</p> */}
                    <Col xl={12}>
                        <LabelFieldComponent
                            type="text"
                            label={t('category name')}
                            fieldSize="mb-4 w-100 h-md"
                            onChange={onInputChangeHandler}
                        />
                    </Col>
                    <Modal.Footer>
                        <ButtonComponent type="button" className="btn btn-secondary" onClick={() => setCreateCateModal(false)}>
                            {t('close')}
                        </ButtonComponent>
                        <ButtonComponent type="button" className="btn btn-success" onClick={createCateHandler}>
                            {t('Create')}
                        </ButtonComponent>
                    </Modal.Footer>
                </div>
            </Modal>
        </PageLayout>
    );
}
