import React, { useContext, useEffect } from 'react';
import { TranslatorContext } from '../../context/Translator';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Dropdown } from 'react-bootstrap';
import { AnchorComponent, ButtonComponent } from '../../components/elements';
import { LabelFieldComponent, LabelTextareaComponent } from '../../components/fields';
import PageLayout from '../../layouts/PageLayout';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axiosInstance from '../../configs/axiosInstance';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setToastState, toastType } from '../../store/reducers/toastReducer';

export default function ProductUploadPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { t } = useContext(TranslatorContext);
    const { productId } = useParams();

    const [uploadFile, setUploadFile] = React.useState('image upload');
    const [refCateArr, setRefCateArr] = React.useState([]);
    const [selectionCateArr, setSelectionCateArr] = React.useState([]);

    const [cateName, setCateName] = React.useState('');

    const [reloadAction, setReloadAction] = React.useState(false);

    const createCateHandler = async () => {
        try {
            const result = await axiosInstance.post('/api/category', {
                name: cateName,
            });
            console.log(result);
            setReloadAction(!reloadAction);
        } catch (err) {
            console.log(err);
        }
    };

    // ** ===================  CREATE PRODUCT  ===================
    const [productTitle, setProductTitle] = React.useState('');
    const [productDesc, setProductDesc] = React.useState('');
    const [productCate, setProductCate] = React.useState('');
    const [productRePrice, setProductRePrice] = React.useState();
    const [productDisPrice, setProductDisPrice] = React.useState();
    // const [productTag, setProductTag] = React.useState('');
    const [productStock, setProductStock] = React.useState();
    const [productImages, setProductImages] = React.useState([]);

    const [productRemoveImages, setProductRemoveImages] = React.useState([]);

    const selectionCateHandler = (e) => {
        refCateArr.forEach((item, i) => {
            if (item.name.trim() === e.target.value) {
                setProductCate(item.id);
            }
        });
        // console.log(e.target.value);
    };

    const productImgChangeHandler = (e) => {
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
                setProductImages([...productImages, ...e.target.files]);
            } else {
                console.log('overSize');
            }
        }
    };

    const removeProductImgHandler = (index) => {
        const newArray = [...productImages];
        if (productId) {
            if (typeof newArray.at(index) !== 'object') {
                setProductRemoveImages([...productRemoveImages, newArray.at(index)]);
            }
        }
        // console.log(typeof newArray.at(index));
        newArray.splice(index, 1);
        setProductImages(newArray);
    };

    const createProductHanddler = async (e) => {
        const form = new FormData();
        form.append('name', productTitle);
        form.append('stock', productStock);
        form.append('price', productRePrice);
        form.append('discountPrice', productDisPrice);
        form.append('description', productDesc);
        form.append('categoryId', productCate);
        const arr = Object.values(productImages);

        arr.forEach((file) => {
            form.append('images', file);
        });

        try {
            const result = await axiosInstance.post('/api/product', form, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log(result);
        } catch (err) {
            console.error(err);
        }
    };

    const updateProductHanddler = async (e) => {
        const form = new FormData();
        form.append('name', productTitle);
        form.append('stock', productStock);
        form.append('price', productRePrice);
        form.append('discountPrice', productDisPrice);
        form.append('description', productDesc);
        form.append('categoryId', productCate);
        form.append('removeImg', productRemoveImages);
        const arr = Object.values(productImages);

        arr.forEach((file) => {
            if (typeof file === 'object') {
                form.append('images', file);
            }
        });

        try {
            const result = await axiosInstance.post('/api/product', form, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log(result);
            dispatch(setToastState({ Tstate: toastType.success, Tmessage: result.data.message }));
            setTimeout(() => {
                navigate('/product')
            }, 1500)
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const fetchCateData = async () => {
            try {
                const result = await axiosInstance.get('/api/category');
                ////////////////////////////////
                const refCateArray = result.data?.data?.map((cate) => {
                    return { name: cate.name, id: cate._id };
                });
                const selectionCateArray = result.data?.data?.map((cate) => {
                    return cate.name;
                });
                ////////////////////////////////
                setRefCateArr(refCateArray);
                setSelectionCateArr(selectionCateArray);
                setProductCate(refCateArray[0].id);
                // setCateData(result.data.data);
                // console.table(result.data.data);
            } catch (e) {
                console.log(e);
            }
        };

        const fetchProductData = async () => {
            try {
                const result = await axiosInstance.get(`/api/product/${productId}`);
                ////////////////////////////////
                setProductTitle(result.data.data.name);
                setProductDesc(result.data.data.description);
                setProductCate(result.data.data.category._id);
                setProductRePrice(result.data.data.price);
                setProductDisPrice(result.data.data.discountPrice);
                setProductStock(result.data.data.stock);
                setProductImages(
                    result.data.data.images.map((image) => {
                        return image.url;
                    }),
                );
                // console.log(result.data);
            } catch (e) {
                console.log(e);
            }
        };

        fetchCateData();

        if (productId) {
            //edit product
            fetchProductData();
        } else {
            //create product
        }
        // console.log(productId);
    }, [reloadAction, productId]);

    return (
        <PageLayout>
            <Row>
                <Col xl={12}>
                    <div className="mc-card mb-4">
                        <div className="mc-breadcrumb">
                            <h3 className="mc-breadcrumb-title">{t('product_upload')}</h3>
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
                                <li className="mc-breadcrumb-item">{t('product_upload')}</li>
                            </ul>
                        </div>
                    </div>
                </Col>
                <Col xl={7}>
                    <div className="mc-card">
                        <div className="mc-card-header">
                            <h4 className="mc-card-title">{t('basic_information')}</h4>
                            <Dropdown bsPrefix="mc-dropdown">
                                <Dropdown.Toggle bsPrefix="mc-dropdown-toggle">
                                    <i className="material-icons">more_horiz</i>
                                </Dropdown.Toggle>
                                <Dropdown.Menu align="end" className="mc-dropdown-paper">
                                    <button type="button" className="mc-dropdown-menu">
                                        <i className="material-icons">edit</i>
                                        <span>{t('edit')}</span>
                                    </button>
                                    <button type="button" className="mc-dropdown-menu">
                                        <i className="material-icons">delete</i>
                                        <span>{t('delete')}</span>
                                    </button>
                                    <button type="button" className="mc-dropdown-menu">
                                        <i className="material-icons">download</i>
                                        <span>{t('download')}</span>
                                    </button>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <Row>
                            <Col xl={12}>
                                <LabelFieldComponent
                                    type="text"
                                    label={t('title')}
                                    fieldSize="mb-4 w-100 h-md"
                                    onChange={(e) => setProductTitle(e.target.value)}
                                    defaultValue={productTitle}
                                />
                            </Col>
                            <Col xl={12}>
                                {/* <LabelTextareaComponent label={t('description')} fieldSize="mb-4 w-100 h-text-md" /> */}
                                <label className="mc-label-field-title mb-2">{t('description')}</label>
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={productDesc}
                                    // onReady={(editor) => {
                                    //     // You can store the "editor" and use when it is needed.
                                    //     console.log('Editor is ready to use!', editor);
                                    // }}
                                    onChange={(event, editor) => {
                                        // console.log(event);
                                        // console.log(editor.getData());
                                        setProductDesc(editor.getData());
                                    }}
                                />
                            </Col>
                            <Col xl={12} className="mt-3">
                                <LabelFieldComponent
                                    label={t('category')}
                                    option={[...selectionCateArr]}
                                    fieldSize="mb-4 w-100 h-md"
                                    onChange={selectionCateHandler}
                                    defaultSelection={''}
                                />
                            </Col>
                            {/* <Col xl={6}><LabelFieldComponent label={t('brand')} option={['richman', 'lubana', 'ecstasy']} fieldSize="mb-4 w-100 h-md" /></Col> */}
                            <Col xl={6}>
                                <LabelFieldComponent
                                    type="text"
                                    label={t('regular_price')}
                                    fieldSize="mb-4 w-100 h-md"
                                    onChange={(e) => setProductRePrice(e.target.value)}
                                    defaultValue={productRePrice}
                                />
                            </Col>
                            <Col xl={6}>
                                <LabelFieldComponent
                                    type="text"
                                    label={t('discount_price')}
                                    fieldSize="mb-4 w-100 h-md"
                                    onChange={(e) => setProductDisPrice(e.target.value)}
                                    defaultValue={productDisPrice}
                                />
                            </Col>
                            {/* <Col xl={6}><LabelFieldComponent type="text" label={t('shipping_fee')} fieldSize="mb-4 w-100 h-md" /></Col>
                            <Col xl={6}><LabelFieldComponent type="text" label={t('tax_rate')} fieldSize="mb-4 w-100 h-md" /></Col> */}
                            <Col xl={12}>
                                <LabelTextareaComponent label={t('tags')} fieldSize="w-100 h-text-md" />
                            </Col>
                        </Row>
                    </div>
                </Col>
                <Col xl={5}>
                    <div className="mc-card mb-4">
                        <div className="mc-card-header">
                            <h4 className="mc-card-title">{t('organization')}</h4>
                            <Dropdown bsPrefix="mc-dropdown">
                                <Dropdown.Toggle bsPrefix="mc-dropdown-toggle">
                                    <i className="material-icons">more_horiz</i>
                                </Dropdown.Toggle>
                                <Dropdown.Menu align="end" className="mc-dropdown-paper">
                                    <button type="button" className="mc-dropdown-menu">
                                        <i className="material-icons">edit</i>
                                        <span>{t('edit')}</span>
                                    </button>
                                    <button type="button" className="mc-dropdown-menu">
                                        <i className="material-icons">delete</i>
                                        <span>{t('delete')}</span>
                                    </button>
                                    <button type="button" className="mc-dropdown-menu">
                                        <i className="material-icons">download</i>
                                        <span>{t('download')}</span>
                                    </button>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <Row>
                            <Col xl={12}>
                                <div className="mc-product-upload-organize mb-4">
                                    <LabelFieldComponent
                                        type="text"
                                        label={t('add_category')}
                                        fieldSize="w-100 h-sm"
                                        onChange={(e) => {
                                            setCateName(e.target.value);
                                        }}
                                    />
                                    {cateName.trim() ? (
                                        <ButtonComponent className="mc-btn primary" onClick={createCateHandler}>
                                            {t('add')}
                                        </ButtonComponent>
                                    ) : null}
                                </div>
                                {/* <div className="mc-product-upload-organize mb-4">
                                    <LabelFieldComponent type="text" label={t('add_brand')} fieldSize="w-100 h-sm" />
                                    <ButtonComponent className="mc-btn primary">{t('add')}</ButtonComponent>
                                </div> */}
                                {/* <div className="mc-product-upload-organize mb-4">
                                    <LabelFieldComponent type="text" label={t('add_color')} fieldSize="w-100 h-sm" />
                                    <ButtonComponent className="mc-btn primary">{t('add')}</ButtonComponent>
                                </div>
                                <div className="mc-product-upload-organize">
                                    <LabelFieldComponent type="text" label={t('add_size')} fieldSize="w-100 h-sm" />
                                    <ButtonComponent className="mc-btn primary">{t('add')}</ButtonComponent>
                                </div> */}
                            </Col>
                        </Row>
                    </div>
                    <div className="mc-card">
                        <div className="mc-card-header">
                            <h4 className="mc-card-title">{t('specification')}</h4>
                            <Dropdown bsPrefix="mc-dropdown">
                                <Dropdown.Toggle bsPrefix="mc-dropdown-toggle">
                                    <i className="material-icons">more_horiz</i>
                                </Dropdown.Toggle>
                                <Dropdown.Menu align="end" className="mc-dropdown-paper">
                                    <button type="button" className="mc-dropdown-menu">
                                        <i className="material-icons">edit</i>
                                        <span>{t('edit')}</span>
                                    </button>
                                    <button type="button" className="mc-dropdown-menu">
                                        <i className="material-icons">delete</i>
                                        <span>{t('delete')}</span>
                                    </button>
                                    <button type="button" className="mc-dropdown-menu">
                                        <i className="material-icons">download</i>
                                        <span>{t('download')}</span>
                                    </button>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <Row>
                            {/* <Col xl={12}>
                                <LabelFieldComponent
                                    label={t('size')}
                                    option={['sm', 'md', 'lg', 'xl', 'xxl']}
                                    fieldSize="mb-4 w-100 h-multiple"
                                    multiple
                                />
                            </Col> */}
                            {/* <Col xl={6}><LabelFieldComponent label={t('color')} option={['red', 'green', 'blue', 'pink', 'black']} fieldSize="mb-4 w-100 h-multiple" multiple/></Col> */}
                            <Col xl={12}>
                                <LabelFieldComponent
                                    type="text"
                                    label={t('stock')}
                                    fieldSize="mb-4 w-100 h-md"
                                    onChange={(e) => setProductStock(e.target.value)}
                                    defaultValue={productStock}
                                />
                            </Col>
                            {/* <Col xl={6}><LabelFieldComponent type="text" label={t('weight')} fieldSize="mb-4 w-100 h-md" /></Col> */}
                        </Row>
                    </div>
                </Col>
                <Col xl={12}>
                    <div className="mc-card">
                        <div className="mc-card-header">
                            <h4 className="mc-card-title">{t('media_and_published')}</h4>
                            <Dropdown bsPrefix="mc-dropdown">
                                <Dropdown.Toggle bsPrefix="mc-dropdown-toggle">
                                    <i className="material-icons">more_horiz</i>
                                </Dropdown.Toggle>
                                <Dropdown.Menu align="end" className="mc-dropdown-paper">
                                    <button type="button" className="mc-dropdown-menu">
                                        <i className="material-icons">edit</i>
                                        <span>{t('edit')}</span>
                                    </button>
                                    <button type="button" className="mc-dropdown-menu">
                                        <i className="material-icons">delete</i>
                                        <span>{t('delete')}</span>
                                    </button>
                                    <button type="button" className="mc-dropdown-menu">
                                        <i className="material-icons">download</i>
                                        <span>{t('download')}</span>
                                    </button>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div className="mc-product-upload-media">
                            {productImages.map((img, index) => {
                                return (
                                    <div className="mc-product-upload-image" onClick={() => removeProductImgHandler(index)}>
                                        <img src={typeof img === 'object' ? URL.createObjectURL(img) : img} alt="product" />
                                    </div>
                                );
                            })}

                            {/* <div className="mc-product-upload-image">
                                <img src="images/product/single/02.webp" alt="product" />
                            </div>
                            <div className="mc-product-upload-image">
                                <img src="images/product/single/03.webp" alt="product" />
                            </div>
                            <div className="mc-product-upload-image">
                                <img src="images/product/single/04.webp" alt="product" />
                            </div> */}
                            <div className="mc-product-upload-file">
                                <input type="file" id="product" onChange={productImgChangeHandler} multiple />
                                <label htmlFor="product">
                                    <i className="material-icons">collections</i>
                                    <span>{uploadFile}</span>
                                </label>
                            </div>
                        </div>
                        <AnchorComponent
                            className="mc-btn w-100 primary mt-5"
                            text={t('publish_and_view')}
                            icon="cloud_upload"
                            to="#"
                            onClick={productId ? updateProductHanddler : createProductHanddler}
                        />
                    </div>
                </Col>
            </Row>
        </PageLayout>
    );
}
