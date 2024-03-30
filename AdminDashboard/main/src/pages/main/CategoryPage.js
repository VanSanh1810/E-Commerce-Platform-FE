import React, { useContext, useEffect, useState } from 'react';
import PageLayout from '../../layouts/PageLayout';
import { TranslatorContext } from '../../context/Translator';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LabelFieldComponent } from '../../components/fields';
import { ButtonComponent } from '../../components/elements';
import Modal from 'react-bootstrap/Modal';
import axiosInstance from '../../configs/axiosInstance';

export default function CategoryPage() {
    const { t, n } = useContext(TranslatorContext);

    const [createCateModal, setCreateCateModal] = useState(false);
    const [deleteCateModal, setDeleteCateModal] = useState(false);
    const [reloadAction, setReloadAction] = useState(false);

    const [cateName, setCateName] = useState();

    const deleteCateHandler = async () => {
        try {
            const result = await axiosInstance.delete(`/api/category/${selectedCategory}`);
            // console.log(cateName);
            console.log(result);
            setCreateCateModal(false);
        } catch (err) {
            console.log(err);
        }
        setCateName('');
        setDeleteCateModal(false);
        setReloadAction(!reloadAction);
    };

    const createCateHandler = async (root, isCreate) => {
        if (isCreate) {
            try {
                const result = await axiosInstance.post('/api/category', {
                    name: cateName,
                    root: root,
                });
                // console.log(cateName);
                console.log(result);
                setCreateCateModal(false);
            } catch (err) {
                console.log(err);
            }
        } else {
            try {
                const result = await axiosInstance.patch(`/api/category/${selectedCategory}`, {
                    name: cateName,
                });
                // console.log(cateName);
                console.log(result);
                setCreateCateModal(false);
            } catch (err) {
                console.log(err);
            }
            // console.log(cateName);
        }
        setCateName('');
        setCreateCateModal(false);
        setReloadAction(!reloadAction);
    };

    const [selectedCategory, setSelectedCategory] = useState();
    const [categoryTree, setCategoryTree] = useState([null]);
    const [demoData, setDemoData] = useState([]);

    const onInputChangeHandler = (e) => {
        setCateName(e.target.value);
    };
    useEffect(() => {
        const fetchCate = async () => {
            try {
                const result = await axiosInstance.get('/api/category');
                // console.log(result);
                setDemoData([...result.data.data]);
            } catch (err) {
                console.log(err);
            }
        };
        fetchCate();
    }, [reloadAction]);
    return (
        <PageLayout>
            <Row>
                <Col xl={12}>
                    <div className="mc-card">
                        <div className="mc-breadcrumb">
                            <h3 className="mc-breadcrumb-title">{t('Category Manager')}</h3>
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
                            <Col xl={12}>
                                <Row>
                                    <Col xl={6}>
                                        <LabelFieldComponent type="text" label={t('Category name')} fieldSize="mb-4 w-100 h-md" />
                                    </Col>
                                    <Col xl={2}>
                                        <ButtonComponent
                                            className="mc-btn w-100 primary mt-4"
                                            text={t('search')}
                                            icon="search"
                                            onClick={() => setCreateCateModal(true)}
                                        />
                                    </Col>
                                    {selectedCategory ? (
                                        <>
                                            <Col xl={2}>
                                                <ButtonComponent
                                                    className="mc-btn w-100 bg-danger mt-4"
                                                    text={t('Delete')}
                                                    icon="delete"
                                                    onClick={() => setDeleteCateModal(true)}
                                                />
                                            </Col>
                                            <Col xl={2}>
                                                <ButtonComponent
                                                    className="mc-btn w-100 bg-success mt-4"
                                                    text={t('Update')}
                                                    icon="update"
                                                    onClick={() => {
                                                        setCreateCateModal({ root: null, isCreate: false });
                                                        function checkId(data) {
                                                            return data._id === selectedCategory;
                                                        }
                                                        setCateName(demoData.find(checkId).name);
                                                    }}
                                                />
                                            </Col>
                                        </>
                                    ) : null}
                                </Row>
                                <Row>
                                    <Col>
                                        <div className="container px-3 py-1">
                                            <div style={{ overflowX: 'scroll' }} className="d-flex flex-row pb-2">
                                                {categoryTree.map((category, index) => {
                                                    return (
                                                        <div className="cate-container">
                                                            <ul>
                                                                {demoData.map((data) => {
                                                                    if (data.root?._id === category || data.root === category) {
                                                                        return (
                                                                            <li
                                                                                className={
                                                                                    categoryTree.includes(data._id)
                                                                                        ? 'selected cate-item'
                                                                                        : 'cate-item'
                                                                                }
                                                                                onClick={() => {
                                                                                    setSelectedCategory(data._id);
                                                                                    if (categoryTree[index + 1]) {
                                                                                        var tempArr = [...categoryTree];
                                                                                        tempArr.splice(index + 1);
                                                                                        tempArr.push(data._id);
                                                                                        setCategoryTree(tempArr);
                                                                                    } else {
                                                                                        setCategoryTree([
                                                                                            ...categoryTree,
                                                                                            data._id,
                                                                                        ]);
                                                                                    }
                                                                                }}
                                                                            >
                                                                                {data.name}
                                                                                {data.child?.length > 0 ? (
                                                                                    <i className="material-icons">
                                                                                        keyboard_arrow_right
                                                                                    </i>
                                                                                ) : null}
                                                                            </li>
                                                                        );
                                                                    }
                                                                    return null;
                                                                })}
                                                                <button
                                                                    style={{ color: 'green' }}
                                                                    onClick={() => {
                                                                        setCreateCateModal({ root: category, isCreate: true });
                                                                    }}
                                                                >
                                                                    Add cate
                                                                </button>
                                                            </ul>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
            <Modal show={createCateModal} onHide={() => setCreateCateModal(false)}>
                <div className="mc-alert-modal">
                    <i className="material-icons">new_releases</i>
                    <h3>{createCateModal.isCreate ? 'Create Category' : 'Update Category'}</h3>
                    {/* <p>Want to delete this category?</p> */}
                    <Col xl={12}>
                        <LabelFieldComponent
                            type="text"
                            label={t('category name')}
                            fieldSize="mb-4 w-100 h-md"
                            onChange={onInputChangeHandler}
                            defautvalue={cateName}
                        />
                    </Col>
                    <Modal.Footer>
                        <ButtonComponent
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => {
                                setCreateCateModal(false);
                                setCateName('');
                            }}
                        >
                            {t('close')}
                        </ButtonComponent>
                        <ButtonComponent
                            type="button"
                            className="btn btn-success"
                            onClick={() => createCateHandler(createCateModal.root)}
                        >
                            {createCateModal.isCreate ? t('Create') : t('Update')}
                        </ButtonComponent>
                    </Modal.Footer>
                </div>
            </Modal>
            <Modal show={deleteCateModal} onHide={() => setDeleteCateModal(false)}>
                <div className="mc-alert-modal">
                    <i className="material-icons">new_releases</i>
                    <h3>Delete Category</h3>
                    <p>Want to delete this category?</p>
                    <Modal.Footer>
                        <ButtonComponent
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => {
                                setDeleteCateModal(false);
                            }}
                        >
                            {t('close')}
                        </ButtonComponent>
                        <ButtonComponent type="button" className="btn btn-danger" onClick={deleteCateHandler}>
                            {t('Delete')}
                        </ButtonComponent>
                    </Modal.Footer>
                </div>
            </Modal>
        </PageLayout>
    );
}
