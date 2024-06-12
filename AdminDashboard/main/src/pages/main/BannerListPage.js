import React, { useContext, useEffect, useState } from 'react';
import { TranslatorContext } from '../../context/Translator';
import { Link } from 'react-router-dom';
import { Row, Col, Dropdown, Modal } from 'react-bootstrap';
import { FloatCardComponent } from '../../components/cards';
import { PaginationComponent } from '../../components';
import LabelFieldComponent from '../../components/fields/LabelFieldComponent';
import UsersTableComponent from '../../components/tables/UsersTableComponent';
import PageLayout from '../../layouts/PageLayout';
import users from '../../assets/data/users.json';
import ShopTableComponent from '../../components/tables/ShopTableComponent';
import { debounce } from 'lodash';
import axiosInstance from '../../configs/axiosInstance';
import BannerTableComponent from '../../components/tables/BannerTableComponent';
import { ButtonComponent } from '../../components/elements';
import { useDispatch } from 'react-redux';
import { setToastState, toastType } from '../../store/reducers/toastReducer';

export default function BannerListPage() {
    const dispatch = useDispatch();

    const [reloadAction, setRealoadAction] = useState(false);

    const [rowView, setRowView] = useState(6);
    const [pages, setPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [shopSearchText, setShopSearchText] = useState('');
    const [currentStatusSearch, setCurrentStatusSearch] = useState('All');

    ////////////////////////////////
    const [cateModal, setCateModal] = useState(false);
    const [categoryTree, setCategoryTree] = useState([null]);
    const [cateData, setCateData] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        const fetchCate = async () => {
            try {
                const result = await axiosInstance.get('/api/category');
                // console.log(result);
                setCateData([...result.data.data]);
            } catch (err) {
                console.log(err);
            }
        };
        fetchCate();
    }, []);

    const { t } = useContext(TranslatorContext);

    const [bannerStat, setBannerStat] = useState({});

    const [createBannerModal, setCreateBannerModal] = useState(false);
    const [newBannerImg, setNewBannerImg] = useState(null);
    const [bannerObject, setBannerObject] = useState({});

    useEffect(() => {
        const fetchBannerStat = async () => {
            try {
                const response = await axiosInstance.get('/api/stat/bannerStat');
                console.log(response.data);
                setBannerStat(response.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchBannerStat();
    }, [reloadAction]);

    const bannerImgChangeHandler = (e) => {
        console.log(e.target.files);
        if (e.target.files.length !== 0) {
            let overSize = false;
            for (let i = 0; i < e.target.files.length; i++) {
                const file = e.target.files[i];
                const fileSize = file.size;
                if (fileSize > 25 * 1024 * 1024) {
                    overSize = true;
                    break;
                }
            }
            if (!overSize) {
                setNewBannerImg(e.target.files[0]);
            } else {
                console.log('overSize');
            }
        }
    };

    const createNewBannerAction = async () => {
        const validateData = (data) => {
            if (!data) {
                return false;
            }
            if (!data.title || !data.discount || !data.maxValue || !data.endDay || !data.startDay || !data.desc) {
                return false;
            }
            if (!newBannerImg || !selectedCategory) {
                return false;
            }
            if (data.endDay <= data.startDay) {
                return false;
            }
            return true;
        };

        console.log(bannerObject);
        if (validateData(bannerObject)) {
            const form = new FormData();
            form.append('title', bannerObject.title);
            form.append('discount', bannerObject.discount);
            form.append('maxValue', bannerObject.maxValue);
            form.append('desc', bannerObject.desc);
            form.append('startDate', bannerObject.startDay);
            form.append('endDate', bannerObject.endDay);
            form.append('category', selectedCategory);
            form.append('images', newBannerImg);
            try {
                const result = await axiosInstance.post('/api/banner', form, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                console.log(result);
                dispatch(setToastState({ Tstate: toastType.success, Tmessage: 'Banner created' }));
                setBannerObject({});
                setSelectedCategory(null);
                setCreateBannerModal(false);
                setNewBannerImg(null);
                setRealoadAction(!reloadAction);
            } catch (err) {
                console.error(err);
                // dispatch(setToastState({ Tstate: toastType.error, Tmessage: err }));
            }
        } else {
            ////////////////////////////////
            console.log('Invalid');
        }
    };

    return (
        <PageLayout>
            <Row>
                <Col xl={12}>
                    <div className="mc-card">
                        <div className="mc-breadcrumb">
                            <h3 className="mc-breadcrumb-title">{t('Banner and Discount')}</h3>
                            <ul className="mc-breadcrumb-list">
                                <li className="mc-breadcrumb-item">
                                    <Link to="#" className="mc-breadcrumb-link">
                                        {t('home')}
                                    </Link>
                                </li>
                                <li className="mc-breadcrumb-item">{t('banner add discount')}</li>
                            </ul>
                        </div>
                    </div>
                </Col>
                <Col xl={4}>
                    <FloatCardComponent
                        variant={'lg green'}
                        digit={bannerStat?.activeBanner}
                        title={'Active banner'}
                        icon={'check_circle'}
                    />
                </Col>
                <Col xl={4}>
                    <FloatCardComponent
                        variant={'lg red'}
                        digit={bannerStat?.stopBanner}
                        title={'Out of date'}
                        icon={'remove_circle'}
                    />
                </Col>
                <Col xl={4}>
                    <FloatCardComponent
                        variant={'lg yellow'}
                        digit={bannerStat?.pendingBanner}
                        title={'Pending banner'}
                        icon={'pending'}
                    />
                </Col>
                <Col xl={12}>
                    <div className="mc-card">
                        <div className="mc-card-header">
                            <h4 className="mc-card-title">{t('registered shops')}</h4>
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
                        <Row>
                            {/* <Col>
                                <LabelFieldComponent
                                    label={t('show_by')}
                                    option={['6 row', '12 row', '24 row']}
                                    labelDir="label-col"
                                    fieldSize="mb-4 w-100 h-md"
                                    onChange={(e) => {
                                        // console.log(e.target.value);
                                        let a = e.target.value;
                                        const temp = a.split(' ');
                                        setRowView(parseInt(temp[0]));
                                        setCurrentPage(1);
                                    }}
                                />
                            </Col> */}
                            <Col xl={5}>
                                <LabelFieldComponent
                                    label={t('status')}
                                    option={['All', 'Active', 'End', 'Pending']}
                                    labelDir="label-col"
                                    fieldSize="mb-4 w-100 h-md"
                                    onChange={(e) => {
                                        // console.log(e.target.value);
                                        setCurrentStatusSearch(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                            </Col>
                            <Col xl={5}>
                                <LabelFieldComponent
                                    type="search"
                                    label={t('search_by')}
                                    placeholder={t('id') + ' / ' + t('name') + ' / ' + t('email') + ' / ' + t('number')}
                                    labelDir="label-col"
                                    fieldSize="mb-4 w-100 h-md"
                                    onChange={debounce(
                                        (e) => {
                                            // console.log(e.target.value);
                                            setShopSearchText(e.target.value);
                                            setCurrentPage(1);
                                        },
                                        [500],
                                    )}
                                />
                            </Col>
                            <Col xl={2} className="mt-4">
                                <ButtonComponent
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => {
                                        setCreateBannerModal(true);
                                    }}
                                >
                                    {t('CREATE')}
                                </ButtonComponent>
                            </Col>
                        </Row>
                        <BannerTableComponent
                            thead={users.thead}
                            tbody={users.tbody}
                            rowView={rowView}
                            currentPage={currentPage}
                            setPages={setPages}
                            shopSearchText={shopSearchText}
                            currentStatusSearch={currentStatusSearch}
                            _setRealoadAction={setRealoadAction}
                        />
                        <PaginationComponent
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            pages={pages}
                            rowShow={rowView}
                        />
                    </div>
                </Col>
            </Row>
            <Modal
                show={createBannerModal}
                onHide={() => {
                    setCreateBannerModal(false);
                    setSelectedCategory(null);
                    setNewBannerImg(null);
                    setBannerObject({ ...{} });
                }}
            >
                <div className="mc-user-modal">
                    <Modal.Header>
                        <h4 className="mt-3">Create banner</h4>
                    </Modal.Header>

                    <Row>
                        <LabelFieldComponent
                            type="text"
                            label={t('title')}
                            fieldSize="mb-4 w-100 h-md"
                            onChange={(e) => setBannerObject({ ...bannerObject, title: e.target.value })}
                            // defaultValue={productStock}
                            // err={stockErr}
                        />
                        <Col>
                            <LabelFieldComponent
                                type="number"
                                label={t('discount')}
                                fieldSize="mb-4 w-100 h-md"
                                onChange={(e) => setBannerObject({ ...bannerObject, discount: e.target.value })}
                                // defaultValue={productStock}
                                // err={stockErr}
                            />
                        </Col>
                        <Col>
                            <LabelFieldComponent
                                type="number"
                                label={t('max value')}
                                fieldSize="mb-4 w-100 h-md"
                                onChange={(e) => setBannerObject({ ...bannerObject, maxValue: e.target.value })}
                                // defaultValue={productStock}
                                // err={stockErr}
                            />
                        </Col>
                        <LabelFieldComponent
                            style={{ cursor: 'pointer' }}
                            type={'text'}
                            label={t('Category')}
                            fieldSize="mb-4 w-100 h-md"
                            readOnly={true}
                            onClick={() => {
                                setCateModal(true);
                            }}
                            value={cateData?.find((obj) => obj._id === selectedCategory)?.name}
                        />
                        <LabelFieldComponent
                            type="text"
                            label={t('description')}
                            fieldSize="mb-4 w-100 h-md"
                            onChange={(e) => {
                                setBannerObject({ ...bannerObject, desc: e.target.value });
                            }}
                            // err={stockErr}
                        />
                        <Col>
                            <LabelFieldComponent
                                type="date"
                                label={t('START')}
                                labelDir="label-col"
                                fieldSize="mb-4 w-100 h-md"
                                onChange={(e) => {
                                    console.log(e.target.value);
                                    const temp = new Date(e.target.value).getTime();
                                    console.log(temp);
                                    // console.log(temp || '');
                                    // setOrderSearchDate(temp || '');
                                    setBannerObject({ ...bannerObject, startDay: temp });
                                }}
                            />
                        </Col>
                        <Col>
                            <LabelFieldComponent
                                type="date"
                                label={t('END')}
                                labelDir="label-col"
                                fieldSize="mb-4 w-100 h-md"
                                onChange={(e) => {
                                    console.log(e.target.value);
                                    const temp = new Date(e.target.value).getTime();
                                    console.log(temp);
                                    setBannerObject({ ...bannerObject, endDay: temp });
                                    // console.log(temp || '');
                                    // setOrderSearchDate(temp || '');
                                }}
                            />
                        </Col>
                        <Col xl={12}>
                            <div className="mc-card">
                                <div className="mc-product-upload-media">
                                    <div className="mc-product-upload-file">
                                        {newBannerImg ? (
                                            <div
                                                className="mc-product-upload-image mt-4"
                                                onClick={() => {
                                                    setNewBannerImg(null);
                                                }}
                                            >
                                                <img
                                                    src={
                                                        newBannerImg && typeof newBannerImg === 'object'
                                                            ? URL.createObjectURL(newBannerImg)
                                                            : newBannerImg
                                                    }
                                                    alt="product"
                                                    style={{ objectFit: 'contain' }}
                                                />
                                            </div>
                                        ) : (
                                            <>
                                                <input type="file" id="product" onChange={bannerImgChangeHandler} />
                                                <label htmlFor="product">
                                                    <i className="material-icons">collections</i>
                                                    {/* <span>{uploadFile}</span> */}
                                                </label>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Modal.Footer>
                        <ButtonComponent
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => {
                                setCreateBannerModal(false);
                                setNewBannerImg(null);
                                setSelectedCategory(null);
                                setBannerObject({ ...{} });
                            }}
                        >
                            {t('close')}
                        </ButtonComponent>
                        <ButtonComponent type="button" className="btn btn-success" onClick={createNewBannerAction}>
                            {t('create')}
                        </ButtonComponent>
                    </Modal.Footer>
                </div>
            </Modal>
            {/* cate modal */}
            <Modal size="lg" show={cateModal} onHide={() => setCateModal(false)} style={{ padding: '10px' }}>
                <div className="mc-alert-modal" style={{ width: '80vw' }}>
                    <i className="material-icons">account_tree</i>
                    <h3>Select Category</h3>
                    <p>Chose category for your product</p>
                    <Modal.Body>
                        <Col>
                            <div className="container px-3 py-1">
                                <div style={{ overflowX: 'scroll' }} className="d-flex flex-row pb-2">
                                    {categoryTree.map((category, index) => {
                                        return (
                                            <div className="cate-container">
                                                <ul>
                                                    {cateData.map((data) => {
                                                        if (data.root?._id === category || data.root === category) {
                                                            return (
                                                                <li
                                                                    className={
                                                                        selectedCategory === data._id
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
                                                                            setCategoryTree([...categoryTree, data._id]);
                                                                        }
                                                                    }}
                                                                >
                                                                    {data.name}
                                                                    {data.child?.length > 0 ? (
                                                                        <i className="material-icons">keyboard_arrow_right</i>
                                                                    ) : null}
                                                                </li>
                                                            );
                                                        }
                                                        return null;
                                                    })}
                                                </ul>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </Col>
                    </Modal.Body>
                    <Modal.Footer>
                        <ButtonComponent
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => {
                                setCateModal(false);
                            }}
                        >
                            {t('close')}
                        </ButtonComponent>
                        <ButtonComponent
                            type="button"
                            className="btn btn-success"
                            onClick={() => {
                                setCateModal(false);
                            }}
                        >
                            {t('Update')}
                        </ButtonComponent>
                    </Modal.Footer>
                </div>
            </Modal>
        </PageLayout>
    );
}
