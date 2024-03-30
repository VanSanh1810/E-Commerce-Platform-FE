import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
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
import { v4 as uuidv4 } from 'uuid';

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

    const validateVariantData = (node) => {
        if (node.child) {
            let result = true;
            for (let child of node.child) {
                result = validateVariantData(child);
                if (!result) {
                    break;
                }
            }
            return result;
        } else {
            if (node.detail.stock !== null && node.detail.price !== null && node.detail.disPrice !== null) {
                return true;
            } else {
                return false;
            }
        }
    };

    const createProductHanddler = async (e) => {
        let result = true;
        for (let i of variantDetail.current) {
            result = validateVariantData(i);
            if (!result) {
                break;
            }
        }
        console.log(result);
        console.log(variantDetail.current);
        // const form = new FormData();
        // form.append('name', productTitle);
        // form.append('stock', productStock);
        // form.append('price', productRePrice);
        // form.append('discountPrice', productDisPrice);
        // form.append('description', productDesc);
        // form.append('categoryId', productCate);
        // const arr = Object.values(productImages);

        // arr.forEach((file) => {
        //     form.append('images', file);
        // });

        // try {
        //     const result = await axiosInstance.post('/api/product', form, {
        //         headers: { 'Content-Type': 'multipart/form-data' },
        //     });
        //     console.log(result);
        // } catch (err) {
        //     console.error(err);
        // }
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
                navigate('/product');
            }, 1500);
        } catch (err) {
            console.error(err);
        }
    };

    // ** ===================  PRODUCT VARIANT   ===================
    const [variantData, setVariantData] = useState([]);
    // const [variantDetail, setVariantDetail] = useState({});
    const variantDetail = useRef([]);

    const [tableToRender, setTableToRender] = useState();

    const accessVariantDetail = useCallback((node, indexArr, depth, field, value) => {
        let isFound = false;
        if (depth === indexArr.length - 1) {
            //found node
            node.detail[field] = value;
            console.log(value);
            return true;
        } else {
            //not found
            for (const child of node.child) {
                if (child._id === indexArr[depth + 1]) {
                    isFound = accessVariantDetail(child, indexArr, depth + 1, field, value);
                    break;
                }
            }
            return isFound;
        }
    }, []);

    useEffect(() => {
        const createVariantDetail = () => {
            let variantHolders = [];
            for (var i = variantData.length - 1; i >= 0; i = i - 1) {
                if (i === variantData.length - 1) {
                    const newArr = variantData[i].data.map((vari, index) => {
                        return {
                            _id: vari._id,
                            detail: {
                                stock: null,
                                price: null,
                                disPrice: null,
                            },
                        };
                    });
                    variantHolders = newArr;
                } else {
                    let temp = [...variantHolders];
                    const newArr = variantData[i].data.map((vari, index) => {
                        return {
                            _id: vari._id,
                            child: temp,
                        };
                    });
                    variantHolders = newArr;
                }
            }
            variantDetail.current = [...variantHolders];
            // setVariantDetail([...variantHolders]);
            console.log(variantHolders);
            console.log(variantData);
        };
        const createVarianTable = async () => {
            setTableToRender(null);
            variantData.map(async (vari, index) => {
                if (index !== 0) {
                    return null;
                }
                const variantChild = [];
                for (let i = 0; i < variantData.length; i++) {
                    variantChild.push(variantData[i].data.length);
                }

                const result = await variantChild.reduce((accumulator, currentValue) => accumulator * currentValue, 1);

                var rowSpanRequired = [];
                for (let i = 0; i < variantChild.length; i++) {
                    let product = 1;
                    if (i < variantChild.length - 1) {
                        for (let j = i + 1; j < variantChild.length; j++) {
                            product *= variantChild[j];
                        }
                    }
                    rowSpanRequired.push(product);
                }
                const tableRender = [];
                for (let i = 0; i < result; i++) {
                    const abc = (
                        <tr key={i}>
                            {variantData.map((varData, j) => {
                                if (i % rowSpanRequired[j] === 0) {
                                    return (
                                        <td rowSpan={rowSpanRequired[j]}>
                                            {
                                                varData.data[
                                                    i / rowSpanRequired[j] >= variantChild[j]
                                                        ? (i / rowSpanRequired[j]) % variantChild[j]
                                                        : i / rowSpanRequired[j]
                                                ]?.name
                                            }
                                        </td>
                                    );
                                } else {
                                    return null;
                                }
                            })}

                            <td>
                                <input
                                    // key={`input-price-${i}`}
                                    defaultValue={variantData.length - variantData.length}
                                    placeholder="price"
                                    onBlur={(e) => {
                                        const data = variantData.map((varData, j) => {
                                            return varData.data[
                                                i / rowSpanRequired[j] >= variantChild[j]
                                                    ? (i / rowSpanRequired[j]) % variantChild[j]
                                                    : i / rowSpanRequired[j]
                                            ]._id;
                                        });
                                        console.log(data);
                                        ////////////////////////////////////////////////////////////////////////
                                        let flag = false;
                                        for (const v of variantDetail.current) {
                                            if (v._id === data[0]) {
                                                flag = accessVariantDetail(v, data, 0, 'price', e.currentTarget.value);
                                                break;
                                            }
                                        }
                                    }}
                                />
                            </td>
                            <td>
                                <input
                                    // key={`input-disPrice-${i}`}
                                    defaultValue={variantData.length - variantData.length}
                                    placeholder="discount price"
                                    type="number"
                                    onBlur={(e) => {
                                        const data = variantData.map((varData, j) => {
                                            return varData.data[
                                                i / rowSpanRequired[j] >= variantChild[j]
                                                    ? (i / rowSpanRequired[j]) % variantChild[j]
                                                    : i / rowSpanRequired[j]
                                            ]._id;
                                        });
                                        console.log(data);
                                        ////////////////////////////////////////////////////////////////////////
                                        let flag = false;
                                        for (const v of variantDetail.current) {
                                            if (v._id === data[0]) {
                                                flag = accessVariantDetail(v, data, 0, 'disPrice', e.currentTarget.value);
                                                break;
                                            }
                                        }
                                    }}
                                />
                            </td>
                            <td>
                                <input
                                    // key={`input-stock-${i}`}
                                    defaultValue={variantData.length - variantData.length}
                                    placeholder="stock"
                                    type="number"
                                    onBlur={(e) => {
                                        const data = variantData.map((varData, j) => {
                                            return varData.data[
                                                i / rowSpanRequired[j] >= variantChild[j]
                                                    ? (i / rowSpanRequired[j]) % variantChild[j]
                                                    : i / rowSpanRequired[j]
                                            ]._id;
                                        });
                                        console.log(data);
                                        ////////////////////////////////////////////////////////////////////////
                                        let flag = false;
                                        for (const v of variantDetail.current) {
                                            if (v._id === data[0]) {
                                                flag = accessVariantDetail(v, data, 0, 'stock', e.currentTarget.value);
                                                break;
                                            }
                                        }
                                    }}
                                />
                            </td>
                        </tr>
                    );
                    await tableRender.push(abc);
                }
                setTableToRender(tableRender);
                return null;
            });
        };
        createVarianTable();
        createVariantDetail();
    }, [variantData, accessVariantDetail]);

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
                <Col xl={12}>
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
                                    onChange={(event, editor) => {
                                        // console.log(event);
                                        // console.log(editor.getData());
                                        setProductDesc(editor.getData());
                                    }}
                                />
                            </Col>
                            <Col xl={12} className="mt-3">
                                <LabelFieldComponent
                                    label={t('Classify')}
                                    option={[...selectionCateArr]}
                                    fieldSize="mb-1 w-100 h-md"
                                    onChange={selectionCateHandler}
                                    defaultSelection={''}
                                />
                            </Col>
                            <Col xl={12} className="mt-3">
                                <LabelFieldComponent
                                    label={t('Category')}
                                    option={[...selectionCateArr]}
                                    fieldSize="mb-4 w-100 h-md"
                                    onChange={selectionCateHandler}
                                    defaultSelection={''}
                                />
                            </Col>
                            {/* <Col xl={6}><LabelFieldComponent label={t('brand')} option={['richman', 'lubana', 'ecstasy']} fieldSize="mb-4 w-100 h-md" /></Col> */}

                            {/* <Col xl={6}><LabelFieldComponent type="text" label={t('shipping_fee')} fieldSize="mb-4 w-100 h-md" /></Col>
                            <Col xl={6}><LabelFieldComponent type="text" label={t('tax_rate')} fieldSize="mb-4 w-100 h-md" /></Col> */}
                            <Col xl={12}>
                                <LabelTextareaComponent label={t('tags')} fieldSize="w-100 h-text-md" />
                            </Col>
                        </Row>
                    </div>
                </Col>
                <Col xl={12}>
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
                            {variantData.length === 0 ? (
                                <>
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
                                    <Col xl={12}>
                                        <LabelFieldComponent
                                            type="text"
                                            label={t('stock')}
                                            fieldSize="mb-4 w-100 h-md"
                                            onChange={(e) => setProductStock(e.target.value)}
                                            defaultValue={productStock}
                                        />
                                    </Col>
                                </>
                            ) : null}

                            <Col xl={12}>
                                {variantData.map((variant, index) => {
                                    return (
                                        <div className="mc-card" style={{ backgroundColor: '#e8e8e8' }} key={variant._id}>
                                            <div
                                                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                            >
                                                <p
                                                    style={{ display: 'none', cursor: 'default', minWidth: '50%' }}
                                                    onClick={(e) => {
                                                        const rootNode = e.currentTarget.parentNode;
                                                        var childElements = rootNode.querySelectorAll('*');
                                                        childElements[1].style.display = 'unset';
                                                        childElements[1].value = variant.name;
                                                        childElements[1].focus();
                                                        childElements[0].style.display = 'none';
                                                    }}
                                                >
                                                    {variant.name}
                                                </p>
                                                <input
                                                    style={{
                                                        padding: '3px 3px 3px 5px',
                                                        width: '100%',
                                                        borderBottom: '1px solid black',
                                                    }}
                                                    onBlur={(e) => {
                                                        const rootNode = e.currentTarget.parentNode;
                                                        const childElements = rootNode.querySelectorAll('*');
                                                        if (e.currentTarget.value.trim().length > 0) {
                                                            const arr = [...variantData];
                                                            arr[index].name = e.currentTarget.value.trim();
                                                            setVariantData([...arr]);
                                                            ////////////////////////////////
                                                            childElements[0].style.display = 'unset';
                                                            childElements[1].style.display = 'none';
                                                            childElements[1].style.border = 'none';
                                                            childElements[1].style.color = 'unset';
                                                        } else {
                                                            //empty value
                                                            childElements[1].style.borderBottom = '1px solid red';
                                                            // childElements[0].style.display = 'unset';
                                                            // childElements[1].style.display = 'none';
                                                        }
                                                    }}
                                                    autoFocus
                                                    placeholder="The box cannot be left blank"
                                                ></input>
                                                <i
                                                    style={{ cursor: 'pointer' }}
                                                    className="material-icons"
                                                    onClick={() => {
                                                        const arr = [...variantData];
                                                        arr.splice(index, 1);
                                                        setVariantData(arr);
                                                    }}
                                                >
                                                    close
                                                </i>
                                            </div>
                                            <hr />
                                            <div>
                                                <ButtonComponent
                                                    type="button"
                                                    title="Delete"
                                                    className="material-icons add"
                                                    onClick={() => {
                                                        const arr = [...variantData];
                                                        arr[index].data.push({
                                                            _id: uuidv4(),
                                                            name: '',
                                                        });
                                                        setVariantData([...arr]);
                                                    }}
                                                >
                                                    {'add'}
                                                </ButtonComponent>
                                                <Row>
                                                    {variant.data.map((varD, i) => {
                                                        return (
                                                            <Col xl={3}>
                                                                <div
                                                                    style={{
                                                                        display: 'flex',
                                                                        justifyContent: 'space-between',
                                                                        alignItems: 'center',
                                                                        width: '100%',
                                                                    }}
                                                                >
                                                                    <p
                                                                        style={{
                                                                            display: 'none',
                                                                            cursor: 'default',
                                                                            width: '100%',
                                                                        }}
                                                                        onClick={(e) => {
                                                                            const rootNode = e.currentTarget.parentNode;
                                                                            var childElements = rootNode.querySelectorAll('*');
                                                                            childElements[1].style.display = 'unset';
                                                                            childElements[1].value = varD.name;
                                                                            childElements[1].focus();
                                                                            childElements[0].style.display = 'none';
                                                                        }}
                                                                    >
                                                                        {varD.name}
                                                                    </p>
                                                                    <input
                                                                        style={{
                                                                            padding: '3px 3px 3px 5px',
                                                                            width: '100%',
                                                                            borderBottom: '1px solid black',
                                                                        }}
                                                                        onBlur={(e) => {
                                                                            const rootNode = e.currentTarget.parentNode;
                                                                            const childElements = rootNode.querySelectorAll('*');
                                                                            if (e.currentTarget.value.trim().length > 0) {
                                                                                const arr = [...variantData];
                                                                                arr[index].data[i].name =
                                                                                    e.currentTarget.value.trim();
                                                                                setVariantData([...arr]);
                                                                                ////////////////////////////////
                                                                                childElements[0].style.display = 'unset';
                                                                                childElements[1].style.display = 'none';
                                                                                childElements[1].style.border = 'none';
                                                                                childElements[1].style.color = 'unset';
                                                                            } else {
                                                                                //empty value
                                                                                childElements[1].style.borderBottom =
                                                                                    '1px solid red';
                                                                            }
                                                                        }}
                                                                        autoFocus
                                                                        placeholder="The box cannot be left blank"
                                                                    ></input>
                                                                    <i
                                                                        style={{ cursor: 'pointer' }}
                                                                        className="material-icons"
                                                                        onClick={() => {
                                                                            const arr = [...variantData];
                                                                            if (arr[index].data.length > 1) {
                                                                                arr[index].data.splice(i, 1);
                                                                                setVariantData(arr);
                                                                            }
                                                                        }}
                                                                    >
                                                                        close
                                                                    </i>
                                                                </div>
                                                            </Col>
                                                        );
                                                    })}
                                                </Row>
                                            </div>
                                        </div>
                                    );
                                })}
                            </Col>
                            <Col xl={12}>
                                <ButtonComponent
                                    className="mc-btn w-100 primary"
                                    text={t('Add variant')}
                                    icon="add"
                                    onClick={() => {
                                        setVariantData([
                                            ...variantData,
                                            { _id: uuidv4(), name: '', data: [{ _id: uuidv4(), name: '' }] },
                                        ]);
                                    }}
                                />
                            </Col>
                            <Col xl={12}>
                                <table className="variant-detail-table">
                                    {variantData.length > 0 ? (
                                        <>
                                            <tr>
                                                {variantData.map((varData, index) => {
                                                    return <th>{varData.name ? varData.name : `Variant ${index}`}</th>;
                                                })}
                                                <th>Price</th>
                                                <th>Discount Price</th>
                                                <th>Stock</th>
                                            </tr>
                                            <tbody>{tableToRender}</tbody>
                                        </>
                                    ) : null}
                                </table>
                            </Col>
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
