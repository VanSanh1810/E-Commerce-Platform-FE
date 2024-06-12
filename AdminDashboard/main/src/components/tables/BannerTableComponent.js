import React, { useState, useEffect, useContext } from 'react';
import { TranslatorContext } from '../../context/Translator';
import { Modal, Form, Col, Row } from 'react-bootstrap';
import { ButtonComponent, AnchorComponent } from '../elements';
import axiosInstance from '../../configs/axiosInstance';
import { LabelFieldComponent } from '../fields';
import { setToastState, toastType } from '../../store/reducers/toastReducer';
import { useDispatch } from 'react-redux';

export default function BannerTableComponent({
    rowView,
    currentPage,
    setPages,
    shopSearchText,
    currentStatusSearch,
    _setRealoadAction,
}) {
    const { t } = useContext(TranslatorContext);
    const dispatch = useDispatch();

    const [data, setData] = useState([]);

    //
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
    //

    const [updateBannerModal, setUpdateBannerModal] = useState(false);
    const [bannerImg, setBannerImg] = useState(null);
    const [bannerObject, setBannerObject] = useState({});

    const [reloadAction, setReloadAction] = useState(false);

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
                setBannerImg(e.target.files[0]);
            } else {
                console.log('overSize');
            }
        }
    };

    const updateNewBannerAction = async () => {
        const validateData = (data) => {
            if (!data) {
                return false;
            }
            if (!data.title || !data.discount || !data.maxValue || !data.endDay || !data.startDay || !data.desc) {
                return false;
            }
            if (!bannerImg || !selectedCategory) {
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
            if (typeof bannerImg === 'object') {
                form.append('images', bannerImg);
            }
            try {
                const result = await axiosInstance.post(`/api/banner/${bannerObject._id}`, form, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                console.log(result);
                dispatch(setToastState({ Tstate: toastType.success, Tmessage: 'Banner created' }));
                setBannerObject({});
                setSelectedCategory(null);
                setUpdateBannerModal(false);
                setBannerImg(null);
                setReloadAction(!reloadAction);
                _setRealoadAction(!reloadAction);
            } catch (err) {
                console.error(err);
                // dispatch(setToastState({ Tstate: toastType.error, Tmessage: err }));
            }
        } else {
            ////////////////////////////////
            console.log('Invalid');
        }
    };

    const [deleteModal, setDeleteModal] = useState(false);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const result = await axiosInstance.get(
                    `/api/banner?&currentPage=${currentPage}&limit=${rowView}&searchStatus=${currentStatusSearch || ''}`,
                );
                console.log(result.data);
                setData(result.data.data);
                setPages(result.data.pages);
            } catch (e) {
                console.error(e);
            }
        };
        fetchBanners();
    }, [reloadAction, rowView, currentPage, setPages, currentStatusSearch]);
    // const chào = 123;

    const dateFormatter = (_time) => {
        const t = new Date(_time);

        const day = t.getDate(); // Lấy ngày trong tháng (1-31)
        const month = t.getMonth() + 1; // Lấy tháng (0-11), cần cộng thêm 1
        const year = t.getFullYear(); // Lấy năm

        return `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
    };

    const deleteBannerAction = async () => {
        try {
            const result = await axiosInstance.delete(`/api/banner/${deleteModal}`);
            console.log(result);
            setReloadAction(!reloadAction);
            _setRealoadAction(!reloadAction);
            setDeleteModal(false);
            dispatch(setToastState({ Tstate: toastType.success, Tmessage: 'Banner deleted' }));
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="mc-table-responsive">
            <table className="mc-table">
                <thead className="mc-table-head primary">
                    <tr>
                        <th>
                            <div className="mc-table-check">
                                <p>id</p>
                            </div>
                        </th>
                        <th>title</th>
                        <th>category</th>
                        <th>discount</th>
                        <th>status</th>
                        <th>created</th>
                        <th>end day</th>
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
                            <td title={item.title}>
                                <div className="mc-table-profile">
                                    {/* <img src={item.src} alt={item.alt} /> */}
                                    <p>{item.title}</p>
                                </div>
                            </td>
                            <td title={item.category.name}>
                                <div className="mc-table-profile">
                                    {/* <img src={item.src} alt={item.alt} /> */}
                                    <a href={`/user/${item.category._id}`}>{item.category.name}</a>
                                </div>
                            </td>
                            <td title={item.discount}>
                                {item.discount}% - Max: {item.maxValue}$
                            </td>
                            <td title={'status'}>
                                {new Date().getTime() >= item.startDate && new Date().getTime() <= item.endDate ? (
                                    <p className="mc-table-badge green">Active</p>
                                ) : null}
                                {new Date().getTime() < item.startDate ? <p className="mc-table-badge yellow">Pending</p> : null}
                                {new Date().getTime() > item.endDate ? <p className="mc-table-badge purple">Ended</p> : null}
                            </td>
                            <td title={item.startDate}>{new Date(item.startDate).toLocaleDateString()}</td>
                            <td title={item.endDate}>{new Date(item.endDate).toLocaleDateString()}</td>
                            <td>
                                <div className="mc-table-action">
                                    {/* <AnchorComponent to={`/shop/${item._id}`} title="View" className="material-icons view">
                                        visibility
                                    </AnchorComponent> */}
                                    <ButtonComponent
                                        title="Edit"
                                        className="material-icons edit"
                                        onClick={() => {
                                            setBannerObject({
                                                _id: item._id,
                                                title: item.title,
                                                desc: item.description,
                                                discount: item.discount,
                                                maxValue: item.maxValue,
                                                startDay: item.startDate,
                                                endDay: item.endDate,
                                            });
                                            setSelectedCategory(item.category._id);
                                            setBannerImg(item.image.url);
                                            setUpdateBannerModal(true);
                                        }}
                                    >
                                        edit
                                    </ButtonComponent>
                                    <ButtonComponent
                                        title="Delete"
                                        className="material-icons block"
                                        onClick={() => setDeleteModal(item._id)}
                                    >
                                        delete
                                    </ButtonComponent>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

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
            {/* update modal */}
            <Modal
                show={updateBannerModal}
                onHide={() => {
                    setUpdateBannerModal(false);
                    setSelectedCategory(false);
                    setBannerImg(null);
                    setBannerObject({ ...{} });
                }}
            >
                <div className="mc-user-modal">
                    <Modal.Header>
                        <h4 className="mt-3">Update banner</h4>
                    </Modal.Header>
                    <Row>
                        <LabelFieldComponent
                            key={updateBannerModal._id}
                            type="text"
                            label={t('title')}
                            fieldSize="mb-4 w-100 h-md"
                            onChange={(e) => setBannerObject({ ...bannerObject, title: e.target.value })}
                            defaultValue={bannerObject?.title}
                            // err={stockErr}
                        />
                        <Col>
                            <LabelFieldComponent
                                key={updateBannerModal._id}
                                type="number"
                                label={t('discount')}
                                fieldSize="mb-4 w-100 h-md"
                                onChange={(e) => setBannerObject({ ...bannerObject, discount: e.target.value })}
                                defaultValue={bannerObject?.discount}
                                // err={stockErr}
                            />
                        </Col>
                        <Col>
                            <LabelFieldComponent
                                key={updateBannerModal._id}
                                type="number"
                                label={t('max value')}
                                fieldSize="mb-4 w-100 h-md"
                                onChange={(e) => setBannerObject({ ...bannerObject, maxValue: e.target.value })}
                                defaultValue={bannerObject?.maxValue}
                                // err={stockErr}
                            />
                        </Col>
                        <LabelFieldComponent
                            key={updateBannerModal._id}
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
                            key={updateBannerModal._id}
                            type="text"
                            label={t('description')}
                            fieldSize="mb-4 w-100 h-md"
                            onChange={(e) => {
                                setBannerObject({ ...bannerObject, desc: e.target.value });
                            }}
                            defaultValue={bannerObject?.desc}
                        />
                        <Col>
                            <LabelFieldComponent
                                key={updateBannerModal._id}
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
                                defaultValue={dateFormatter(bannerObject?.startDay)}
                            />
                        </Col>
                        <Col>
                            <LabelFieldComponent
                                key={updateBannerModal._id}
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
                                defaultValue={dateFormatter(bannerObject?.endDay)}
                            />
                        </Col>
                        <Col xl={12}>
                            <div className="mc-card">
                                <div className="mc-product-upload-media">
                                    <div className="mc-product-upload-file">
                                        {bannerImg ? (
                                            <div
                                                className="mc-product-upload-image mt-4"
                                                onClick={() => {
                                                    setBannerImg(null);
                                                }}
                                            >
                                                <img
                                                    src={
                                                        bannerImg && typeof bannerImg === 'object'
                                                            ? URL.createObjectURL(bannerImg)
                                                            : bannerImg
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
                                setUpdateBannerModal(false);
                                setBannerImg(null);
                                setSelectedCategory(null);
                                setBannerObject({ ...{} });
                            }}
                        >
                            {t('close')}
                        </ButtonComponent>
                        <ButtonComponent type="button" className="btn btn-success" onClick={updateNewBannerAction}>
                            {t('update')}
                        </ButtonComponent>
                    </Modal.Footer>
                </div>
            </Modal>
            {/* delete modal */}
            <Modal show={deleteModal} onHide={() => setDeleteModal(false)}>
                <div className="mc-alert-modal">
                    <i className="material-icons">new_releases</i>
                    <h3>are your sure!</h3>
                    <p>Want to delete this banner?</p>
                    <Modal.Footer>
                        <ButtonComponent type="button" className="btn btn-secondary" onClick={() => setDeleteModal(false)}>
                            {t('close')}
                        </ButtonComponent>
                        <ButtonComponent type="button" className="btn btn-danger" onClick={deleteBannerAction}>
                            {t('delete')}
                        </ButtonComponent>
                    </Modal.Footer>
                </div>
            </Modal>
        </div>
    );
}
