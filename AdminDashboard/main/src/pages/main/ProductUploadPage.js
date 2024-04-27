import React, { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { TranslatorContext } from '../../context/Translator';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Dropdown, Modal } from 'react-bootstrap';
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
import { useSelector } from 'react-redux';
import ClassifyTableComponent from '../../components/tables/ClassifyTableComponent';

export default function ProductUploadPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { t } = useContext(TranslatorContext);
    const { productId } = useParams();

    const [uploadFile, setUploadFile] = React.useState('image upload');
    const [reloadAction, setReloadAction] = React.useState(false);

    //** ===================  CATEGORY PRODUCT  ===================
    const [cateModal, setCateModal] = useState(false);
    const [categoryTree, setCategoryTree] = useState([null]);
    const [cateData, setCateData] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    //** ===================  PRODUCT CLASSIFY  ===================
    const [classifyModal, setClassifyModal] = useState(false);
    const [classifyData, setClassifyData] = useState([]);
    const [selectionClassifyArr, setSelectionClassifyArr] = useState([]);
    const [refClassifyArr, setrefClassifyArr] = React.useState([]);
    const [reloadClassifyData, setReloadClassifyData] = useState(false);

    const [productClassify, setproductClassify] = useState(null);

    const [newClassifyName, setnewClassifyName] = useState('');

    const { shopId } = useSelector((state) => state.persistedReducer.authReducer);

    const addClassifyHandler = async (e) => {
        if (!newClassifyName.trim()) {
            return;
        }
        try {
            const result = await axiosInstance.post(`/api/classify`, {
                name: newClassifyName,
            });
            console.log(result);
            setReloadClassifyData(!reloadClassifyData);
            setnewClassifyName('');
            e.target.value = '';
        } catch (err) {
            console.error(err);
        }
    };

    const selectionClassifyHandler = (e) => {
        if (e.target.value === 'All') {
            setproductClassify(null);
        } else {
            refClassifyArr.forEach((item, i) => {
                if (item.name.trim() === e.target.value) {
                    setproductClassify(item.id);
                    console.log(item.id);
                }
            });
        }
    };

    // classify loading
    useEffect(() => {
        const fetchClassifyData = async () => {
            try {
                const result = await axiosInstance.get(`/api/classify/${shopId}`);
                setClassifyData(result.data.data);
                setSelectionClassifyArr(
                    result.data.data.map((data) => {
                        return data.name;
                    }),
                );
                setrefClassifyArr(
                    result.data.data.map((data) => {
                        return { id: data._id, name: data.name };
                    }),
                );
                console.log(result);
            } catch (err) {
                console.error(err);
            }
        };
        fetchClassifyData();
    }, [reloadClassifyData, shopId]);

    // ** ===================  UPDATE PRODUCT  ===================

    const updateProductHanddler = async (e) => {
        clearErr();
        console.log(variantData);
        console.log(variantDetail);
        if (variantData?.length > 0) {
            let result1 = true;
            for (let i of variantDetail) {
                result1 = validateVariantData(i);
                if (!result1) {
                    break;
                }
            }
            let result2 = true;
            for (let varD of variantData) {
                if (varD.name.trim() === '' || varD.data.some((child) => child.name.trim() === '')) {
                    result2 = false;
                    break;
                }
            }
            console.log(result1 && result2);
            console.log(variantDetail);
            console.log(variantData);
            if (result1 && result2 && validateData(true)) {
                const form = new FormData();
                form.append('name', productTitle);
                form.append('stock', 0);
                form.append('price', 0);
                form.append('discountPrice', 0);
                form.append('description', productDesc);
                form.append('tags', productTag);
                form.append('categoryId', selectedCategory);
                form.append('classifyId', productClassify);
                form.append('variantData', JSON.stringify(variantData));
                form.append('variantDetail', JSON.stringify(variantDetail));
                form.append('isDraft', isDraft);
                console.log(variantData);
                console.log(variantDetail);
                const arr = Object.values(productImages);
                let tempImgLeft = [];
                arr.forEach((file) => {
                    if (typeof file === 'string') {
                        tempImgLeft.push(file);
                    } else {
                        form.append('images', file);
                    }
                });
                form.append('imgLeft', JSON.stringify(tempImgLeft));

                try {
                    const result = await axiosInstance.post(`/api/product/${productId}`, form, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    });
                    console.log(result.data);
                    dispatch(setToastState({ Tstate: toastType.success, Tmessage: result.data.data.message }));
                    setTimeout(() => {
                        navigate('/product');
                    }, 1000);
                } catch (err) {
                    console.error(err);
                }
            } else {
                //variant empty
                dispatch(setToastState({ Tstate: toastType.success, Tmessage: 'variant is missing requirement data' }));
            }
        } else {
            if (!validateData(false)) {
                dispatch(setToastState({ Tstate: toastType.success, Tmessage: 'variant is missing requirement data' }));
                return;
            }
            const form = new FormData();
            form.append('name', productTitle);
            form.append('description', productDesc);
            form.append('classifyId', productClassify);
            form.append('categoryId', selectedCategory);
            form.append('price', productRePrice);
            form.append('discountPrice', productDisPrice);
            form.append('stock', productStock);
            form.append('tags', productTag);
            form.append('variantData', null);
            form.append('variantDetail', null);
            form.append('isDraft', isDraft);
            const arr = Object.values(productImages);
            let tempImgLeft = [];
            arr.forEach((file) => {
                if (typeof file === 'string') {
                    tempImgLeft.push(file);
                } else {
                    form.append('images', file);
                }
            });
            form.append('imgLeft', JSON.stringify(tempImgLeft));
            try {
                const result = await axiosInstance.post(`/api/product/${productId}`, form, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                console.log(result.data);
                dispatch(setToastState({ Tstate: toastType.success, Tmessage: result.data.data.message }));
                setTimeout(() => {
                    navigate('/product');
                }, 1000);
            } catch (err) {
                console.error(err);
            }
        }
    };

    // ** ===================  PRODUCT VARIANT   ===================
    const [variantData, setVariantData] = useState([]);
    const oldVariantDetail = useRef([]);
    const [variantDetail, setVariantDetail] = useState([]);
    const [tableToRender, setTableToRender] = useState();

    /* The above code is a JavaScript function named `accessVariantDetail` that is using the
    `useCallback` hook. This function is recursively searching for a specific node in a tree
    structure based on an array of indices (`indexArr`). Once the node is found, it updates a
    specific field (`field`) in the node's `detail` object with a given `value`. The function
    returns `true` if the node is found and the field is updated, otherwise it returns `false`. The
    function logs the updated value to the console. */
    const accessVariantDetail = useCallback((node, indexArr, depth, field, value) => {
        let isFound = false;
        if (depth === indexArr.length - 1) {
            //found node
            try {
                if (node.detail) {
                    // console.log(' ff:', indexArr);
                    if (field[0]) {
                        node.detail[field[0]] = parseFloat(value[0]);
                    }
                    if (field[1]) {
                        node.detail[field[1]] = parseFloat(value[1]);
                    }
                    if (field[2]) {
                        node.detail[field[2]] = parseFloat(value[2]);
                    }
                }
            } catch (e) {
                console.log(e, 'OK');
            }
            return true;
        } else {
            //not found
            if (node.child && node.child.length > 0) {
                for (const child of node.child) {
                    if (child._id === indexArr[depth + 1]) {
                        isFound = accessVariantDetail(child, indexArr, depth + 1, field, value);
                        break;
                    }
                }
            }
            return isFound;
        }
    }, []);

    const getVariantDetail = useCallback((node, indexArr, depth) => {
        if (depth === indexArr.length - 1) {
            //found node
            if (node.detail) {
                return node.detail;
            }
            return false;
        } else {
            //not found
            let isFound = false;
            if (node.child && node.child.length > 0) {
                for (const child of node.child) {
                    if (child._id === indexArr[depth + 1]) {
                        isFound = getVariantDetail(child, indexArr, depth + 1);
                        break;
                    }
                }
            }
            return isFound;
        }
    }, []);

    /**
     * The function `createVarianTable` asynchronously generates a table based on variant data and
     * allows users to input price, discount price, and stock for each variant.
     */
    const createVarianTable = useCallback(async () => {
        /* The code is creating an empty array called `variantChild` and then iterating over an
            array called `variantData`. For each element in `variantData`, it is pushing the
            length of the `data` property of that element into the `variantChild` array. */
        const variantChild = [];
        for (let i = 0; i < variantData.length; i++) {
            variantChild.push(variantData[i].data.length);
        }

        //combination of posible row
        const result = await variantChild.reduce((accumulator, currentValue) => accumulator * currentValue, 1);

        let rowSpanRequired = [];
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
            const locations = variantData.map((varData, j) => {
                return varData.data[
                    Math.floor(
                        i / rowSpanRequired[j] >= variantChild[j]
                            ? (i / rowSpanRequired[j]) % variantChild[j]
                            : i / rowSpanRequired[j],
                    )
                ]?._id;
            });

            let currentVariantDetailData = {
                price: null,
                disPrice: null,
                stock: null,
            };

            for (let j = 0; j < variantDetail.length; j++) {
                if (variantDetail[j]._id === locations[0]) {
                    const result = getVariantDetail(variantDetail[j], [...locations], 0);
                    if (result) {
                        currentVariantDetailData = { ...result };
                    }
                    break;
                }
            }
            const abc = (
                <tr key={locations}>
                    {variantData.map((varData, j) => {
                        if (i % rowSpanRequired[j] === 0) {
                            return (
                                <td
                                    key={
                                        varData.data[
                                            Math.floor(
                                                i / rowSpanRequired[j] >= variantChild[j]
                                                    ? (i / rowSpanRequired[j]) % variantChild[j]
                                                    : i / rowSpanRequired[j],
                                            )
                                        ]?._id
                                    }
                                    rowSpan={rowSpanRequired[j]}
                                >
                                    {
                                        varData.data[
                                            Math.floor(
                                                i / rowSpanRequired[j] >= variantChild[j]
                                                    ? (i / rowSpanRequired[j]) % variantChild[j]
                                                    : i / rowSpanRequired[j],
                                            )
                                        ]?.name
                                        // Math.floor(
                                        //     i / rowSpanRequired[j] >= variantChild[j]
                                        //         ? (i / rowSpanRequired[j]) % variantChild[j]
                                        //         : i / rowSpanRequired[j],
                                        // )
                                    }
                                </td>
                            );
                        } else {
                            return null;
                        }
                    })}
                    <td>
                        <input
                            key={`input-price-${locations.join(' ')}`}
                            type="number"
                            inputMode="none"
                            placeholder="price"
                            onBlur={(e) => {
                                ////////////////////////////////////////////////////////////////////////
                                let flag = false;
                                let tempDetail = JSON.stringify([...variantDetail]);
                                tempDetail = JSON.parse(tempDetail);
                                for (const v of tempDetail) {
                                    if (v._id === locations[0]) {
                                        accessVariantDetail(v, [...locations], 0, ['price'], [e.currentTarget.value]);
                                        break;
                                    }
                                }
                                console.log('temp :', tempDetail);
                                oldVariantDetail.current = [...tempDetail];
                                setVariantDetail([...tempDetail]);
                            }}
                            defaultValue={currentVariantDetailData.price}
                        />
                    </td>
                    <td>
                        <input
                            key={`input-disPrice-${locations.join(' ')}`}
                            inputMode="none"
                            placeholder="discount price"
                            type="number"
                            onBlur={(e) => {
                                ////////////////////////////////////////////////////////////////////////
                                let flag = false;
                                let tempDetail = JSON.stringify([...variantDetail]);
                                tempDetail = JSON.parse(tempDetail);
                                for (const v of tempDetail) {
                                    if (v._id === locations[0]) {
                                        accessVariantDetail(v, [...locations], 0, ['disPrice'], [e.currentTarget.value]);
                                        break;
                                    }
                                }
                                oldVariantDetail.current = [...tempDetail];
                                setVariantDetail([...tempDetail]);
                            }}
                            defaultValue={currentVariantDetailData.disPrice}
                        />
                    </td>
                    <td>
                        <input
                            key={`input-stock-${locations.join(' ')}`}
                            inputMode="none"
                            placeholder="stock"
                            type="number"
                            onBlur={(e) => {
                                // console.log(data);
                                ////////////////////////////////////////////////////////////////////////
                                let flag = false;
                                let tempDetail = JSON.stringify([...variantDetail]);
                                tempDetail = JSON.parse(tempDetail);
                                for (const v of tempDetail) {
                                    if (v._id === locations[0]) {
                                        accessVariantDetail(v, [...locations], 0, ['stock'], [e.currentTarget.value]);
                                        break;
                                    }
                                }
                                oldVariantDetail.current = [...tempDetail];
                                setVariantDetail([...tempDetail]);
                            }}
                            defaultValue={currentVariantDetailData.stock}
                        />
                    </td>
                </tr>
            );
            tableRender.push(abc);
        }
        setTableToRender(tableRender);
        return null;
    }, [accessVariantDetail, variantData, getVariantDetail, variantDetail, oldVariantDetail]);

    /**
     * The function `createVariantDetail` generates a nested array structure based on the
     * `variantData` array.
     */
    const createVariantDetail = useCallback(async () => {
        if (variantData && variantData.length > 0) {
            console.log('Creating variant');
            const arraysAreEqual = (arr1, arr2) => {
                if (!arr1 || !arr2) {
                    if (!arr1 && !arr2) {
                        return true;
                    }
                    return false;
                }
                if (arr1.length !== arr2.length) {
                    return false;
                }
                for (let i = 0; i < arr1.length; i++) {
                    if (arr1[i] !== arr2[i]) {
                        return false;
                    }
                }
                return true;
            };

            let variantHolders = [];
            /// generate New VariantDetail temporary
            for (var i = variantData.length - 1; i >= 0; i--) {
                let newArr = [];
                if (i === variantData.length - 1) {
                    newArr = variantData[i].data.map((vari, index) => {
                        return {
                            _id: vari._id,
                            detail: {
                                stock: null,
                                price: null,
                                disPrice: null,
                            },
                        };
                    });
                    variantHolders = [...newArr];
                } else {
                    let temp = [...variantHolders];
                    newArr = variantData[i].data.map((vari, index) => {
                        return {
                            _id: vari._id,
                            child: [...temp],
                        };
                    });
                    variantHolders = newArr;
                }
            }

            variantHolders = JSON.stringify([...variantHolders]);
            variantHolders = JSON.parse(variantHolders);

            /// update the temporary with previous variantDetail
            if (oldVariantDetail.current && oldVariantDetail.current.length > 0) {
                console.log('oldVariantDetail : ', oldVariantDetail.current);
                let tableMap = [];
                const initProductVariantDetailTable = (node, depth, routeMap) => {
                    if (node.detail) {
                        const detail = {
                            routeMap: routeMap,
                            detail: node.detail,
                        };
                        tableMap = [...tableMap, { ...detail }];
                        return;
                    } else {
                        for (let i = 0; i < node.child.length; i++) {
                            const newRouteMap = [...routeMap, node.child[i]._id];
                            initProductVariantDetailTable(node.child[i], depth + 1, newRouteMap);
                        }
                        return;
                    }
                };
                for (let i = 0; i < oldVariantDetail.current.length; i++) {
                    initProductVariantDetailTable(oldVariantDetail.current[i], 0, [oldVariantDetail.current[i]._id]);
                }
                console.log('Table map :', tableMap);
                //iterate through the elements in the temporary detail tree
                const iterateDetalTree = (node, depth, routeMap) => {
                    if (node.detail) {
                        for (let j = 0; j < tableMap.length; j++) {
                            if (arraysAreEqual([...tableMap[j].routeMap], [...routeMap])) {
                                console.log('route match : ', tableMap[j].routeMap, ' ===', routeMap);
                                console.log('Value :');
                                console.log(node.detail);
                                console.log(tableMap[j].detail);
                                node.detail = tableMap[j].detail;
                                break;
                            }
                        }
                        return;
                    } else {
                        for (let i = 0; i < node.child.length; i++) {
                            const newRouteMap = [...routeMap, node.child[i]._id];
                            iterateDetalTree(node.child[i], depth + 1, [...newRouteMap]);
                        }
                        return;
                    }
                };
                for (let j = 0; j < variantHolders.length; j++) {
                    iterateDetalTree(variantHolders[j], 0, [variantHolders[j]._id]);
                }
            }
            console.log('Set detail :', variantHolders);
            const stringifyObj = JSON.stringify(variantHolders);
            setVariantDetail([...JSON.parse(stringifyObj)]);
            oldVariantDetail.current = [...JSON.parse(stringifyObj)];
        }
        return null;
    }, [variantData, oldVariantDetail]);

    useEffect(() => {
        if (variantData?.length > 0) {
            createVariantDetail();
        }
    }, [variantData, createVariantDetail]);

    useEffect(() => {
        if (variantDetail?.length > 0) {
            createVarianTable();
        }
    }, [variantDetail, createVarianTable]);

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

        const fetchProductData = async () => {
            try {
                const result = await axiosInstance.get(`/api/product/${productId}`);
                ////////////////////////////////
                console.log(result.data);
                setProductTitle(result.data.data.name);

                setProductDesc(result.data.data.description);

                // setProductCate(result.data.data.category._id);
                setSelectedCategory(result.data.data.category._id);

                setProductRePrice(result.data.data.price);

                setProductDisPrice(result.data.data.discountPrice);

                setProductStock(result.data.data.stock);

                setproductClassify(result.data.data.classify?._id);

                setProductTag(result.data.data.tag);

                console.log(result.data);
                setProductImages(
                    result.data.data.images.map((image) => {
                        return image.url;
                    }),
                );

                setVariantData(result.data.data.variantData);
                setVariantDetail(result.data.data.variantDetail);
                oldVariantDetail.current = result.data.data.variantDetail;
            } catch (e) {
                console.log(e);
            }
        };

        if (productId) {
            //edit product
            fetchProductData();
        } else {
            //create product
        }
        // console.log(productId);
    }, [productId]);

    // ** ===================  CREATE PRODUCT  ===================
    const [productTitle, setProductTitle] = React.useState('');
    const [productDesc, setProductDesc] = React.useState('');
    const [productCate, setProductCate] = React.useState('');
    const [productRePrice, setProductRePrice] = React.useState();
    const [productDisPrice, setProductDisPrice] = React.useState();
    const [productTag, setProductTag] = React.useState('');
    const [isDraft, setIsDraft] = React.useState(false);
    const [productStock, setProductStock] = React.useState();
    const [productImages, setProductImages] = React.useState([]);

    const [productRemoveImages, setProductRemoveImages] = React.useState([]);

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
        clearErr();
        // console.log(variantData);
        // console.log(variantDetail);
        // return;
        if (variantData.length > 0) {
            let result1 = true;
            for (let i of variantDetail) {
                result1 = validateVariantData(i);
                if (!result1) {
                    break;
                }
            }
            let result2 = true;
            for (let varD of variantData) {
                if (varD.name.trim() === '' || varD.data.some((child) => child.name.trim() === '')) {
                    result2 = false;
                    break;
                }
            }
            console.log(result1 && result2);
            console.log(variantDetail);
            console.log(variantData);
            if (result1 && result2 && validateData(true)) {
                const form = new FormData();
                form.append('name', productTitle);
                form.append('stock', 0);
                form.append('price', 0);
                form.append('discountPrice', 0);
                form.append('description', productDesc);
                form.append('tags', productTag);
                form.append('categoryId', selectedCategory);
                form.append('classifyId', productClassify);
                form.append('variantData', JSON.stringify(variantData));
                form.append('variantDetail', JSON.stringify(variantDetail));
                form.append('isDraft', isDraft);
                console.log(variantData);
                console.log(variantDetail);
                const arr = Object.values(productImages);

                arr.forEach((file) => {
                    form.append('images', file);
                });
                console.log(form);

                try {
                    const result = await axiosInstance.post('/api/product', form, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    });
                    console.log(result);
                    dispatch(setToastState({ Tstate: toastType.success, Tmessage: 'Product created' }));
                    setTimeout(() => {
                        navigate('/product');
                    }, 1000);
                } catch (err) {
                    console.error(err);
                    dispatch(setToastState({ Tstate: toastType.error, Tmessage: err }));
                }
            } else {
                //variant empty
                validateData(true);
                dispatch(setToastState({ Tstate: toastType.success, Tmessage: 'Please provide all variant detail' }));
            }
        } else {
            if (!validateData(false)) {
                return;
            }
            const form = new FormData();
            form.append('name', productTitle);
            form.append('description', productDesc);
            form.append('classifyId', productClassify);
            form.append('categoryId', selectedCategory);
            form.append('price', productRePrice);
            form.append('discountPrice', productDisPrice);
            form.append('stock', productStock);
            form.append('tags', productTag);
            form.append('variantData', null);
            form.append('variantDetail', null);
            form.append('isDraft', isDraft);
            const arr = Object.values(productImages);
            arr.forEach((file) => {
                form.append('images', file);
            });
            console.log();
            try {
                const result = await axiosInstance.post('/api/product', form, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                console.log(result);
                dispatch(setToastState({ Tstate: toastType.success, Tmessage: 'Product created' }));
                setTimeout(() => {
                    navigate('/product');
                }, 1000);
            } catch (err) {
                console.error(err);
                dispatch(setToastState({ Tstate: toastType.error, Tmessage: 'err' }));
            }
        }
    };

    //** ===================  FIELD ERROR  ===================
    const [titleErr, setTitleErr] = useState(null);
    const [desErr, setDesErr] = useState(null);
    const [classifyErr, setClassifyErr] = useState(null);
    const [cateErr, setCateErr] = useState(null);
    const [tagErr, setTagErr] = useState(null);
    const [priceErr, setPriceErr] = useState(null);
    const [disPriceErr, setDisPriceErr] = useState(null);
    const [stockErr, setStockErr] = useState(null);
    const [imgErr, setImgErr] = useState(null);

    const clearErr = () => {
        setTitleErr(null);
        setDesErr(null);
        setClassifyErr(null);
        setCateErr(null);
        setTagErr(null);
        setPriceErr(null);
        setDisPriceErr(null);
        setStockErr(null);
        setImgErr(null);
    };

    const validateData = (haveVariant) => {
        let result = true;
        if (!productTitle) {
            setTitleErr('Please provide a product title');
            result = false;
        }
        if (!productDesc) {
            setDesErr('Please provide a product description');
            result = false;
        }
        if (!selectedCategory) {
            setCateErr('Please select category');
            result = false;
        }
        if (!productTag) {
            setTagErr('Please provide tag');
            result = false;
        }
        if (productImages?.length === 0) {
            setImgErr('Please provide images');
            result = false;
        }
        if (!haveVariant) {
            if (!productRePrice) {
                setPriceErr('Please provide price');
                result = false;
            }
            if (!productDisPrice) {
                setDisPriceErr('Please provide discount price');
                result = false;
            }
            if (!productStock) {
                setStockErr('Please provide product stock');
                result = false;
            }
        }
        return result;
    };

    return (
        <>
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
                                        onChange={(e) => {
                                            setProductTitle(e.target.value);
                                            console.log(e.target.value);
                                        }}
                                        defaultValue={productTitle}
                                        err={titleErr}
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
                                    <Row>
                                        <Col xl={9}>
                                            <LabelFieldComponent
                                                label={t('Classify')}
                                                option={[...selectionClassifyArr, 'All']}
                                                fieldSize="mb-1 w-100 h-md"
                                                onChange={selectionClassifyHandler}
                                                defaultSelection={
                                                    !productId
                                                        ? 'All'
                                                        : refClassifyArr.find((item, i) => item.id === productClassify)?.name
                                                }
                                                err={classifyErr}
                                            />
                                        </Col>
                                        <Col xl={3}>
                                            <AnchorComponent
                                                className="mc-btn w-100 primary mt-4"
                                                text={t('manage')}
                                                icon="settings"
                                                to="#"
                                                onClick={() => {
                                                    setClassifyModal(true);
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xl={12} className="mt-3">
                                    <LabelFieldComponent
                                        style={{ cursor: 'pointer' }}
                                        type={'text'}
                                        label={t('Category')}
                                        fieldSize="mb-4 w-100 h-md"
                                        err={cateErr}
                                        readOnly={true}
                                        onClick={() => {
                                            setCateModal(true);
                                        }}
                                        value={cateData?.find((obj) => obj._id === selectedCategory)?.name}
                                    />
                                </Col>
                                <Col xl={12}>
                                    <LabelTextareaComponent
                                        label={t('tags')}
                                        fieldSize="w-100 h-text-md"
                                        placeholder={'use coma (,) to separate each word'}
                                        onChange={(e) => setProductTag(e.target.value)}
                                        err={tagErr}
                                        defaultValue={productTag}
                                    />
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
                                {variantData?.length === 0 || !variantData ? (
                                    <>
                                        <Col xl={6}>
                                            <LabelFieldComponent
                                                type="number"
                                                label={t('regular_price')}
                                                fieldSize="mb-4 w-100 h-md"
                                                onChange={(e) => setProductRePrice(e.target.value)}
                                                defaultValue={productRePrice}
                                                err={priceErr}
                                            />
                                        </Col>
                                        <Col xl={6}>
                                            <LabelFieldComponent
                                                type="number"
                                                label={t('discount_price')}
                                                fieldSize="mb-4 w-100 h-md"
                                                onChange={(e) => setProductDisPrice(e.target.value)}
                                                defaultValue={productDisPrice}
                                                err={disPriceErr}
                                            />
                                        </Col>
                                        <Col xl={12}>
                                            <LabelFieldComponent
                                                type="number"
                                                label={t('stock')}
                                                fieldSize="mb-4 w-100 h-md"
                                                onChange={(e) => setProductStock(e.target.value)}
                                                defaultValue={productStock}
                                                err={stockErr}
                                            />
                                        </Col>
                                    </>
                                ) : null}

                                <Col xl={12}>
                                    {variantData?.map((variant, index) => {
                                        return (
                                            <div className="mc-card" style={{ backgroundColor: '#e8e8e8' }} key={variant._id}>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                    }}
                                                >
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
                                                            } else {
                                                                //empty value
                                                                childElements[0].style.borderBottom = '1px solid red';
                                                            }
                                                        }}
                                                        autoFocus
                                                        placeholder="The box cannot be left blank"
                                                        defaultValue={productId ? variant.name : null}
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
                                                                        key={varD._id}
                                                                        style={{
                                                                            display: 'flex',
                                                                            justifyContent: 'space-between',
                                                                            alignItems: 'center',
                                                                            width: '100%',
                                                                        }}
                                                                    >
                                                                        <input
                                                                            style={{
                                                                                padding: '3px 3px 3px 5px',
                                                                                width: '100%',
                                                                                borderBottom: '1px solid black',
                                                                            }}
                                                                            onBlur={(e) => {
                                                                                const rootNode = e.currentTarget.parentNode;
                                                                                const childElements =
                                                                                    rootNode.querySelectorAll('*');
                                                                                if (e.currentTarget.value.trim().length > 0) {
                                                                                    const arr = [...variantData];
                                                                                    arr[index].data[i].name =
                                                                                        e.currentTarget.value.trim();
                                                                                    setVariantData([...arr]);
                                                                                } else {
                                                                                    //empty value
                                                                                    childElements[0].style.borderBottom =
                                                                                        '1px solid red';
                                                                                }
                                                                            }}
                                                                            autoFocus
                                                                            placeholder="The box cannot be left blank"
                                                                            defaultValue={productId ? varD.name : null}
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
                                        {variantData?.length > 0 ? (
                                            <>
                                                <thead>
                                                    <tr>
                                                        {variantData.map((varData, index) => {
                                                            return <th>{varData.name ? varData.name : `Variant ${index}`}</th>;
                                                        })}
                                                        <th>Price</th>
                                                        <th>Discount Price</th>
                                                        <th>Stock</th>
                                                    </tr>
                                                </thead>
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
                                <div className="mc-product-upload-file" style={imgErr ? { border: '1px dashed red' } : null}>
                                    <input type="file" id="product" onChange={productImgChangeHandler} multiple />
                                    <label htmlFor="product">
                                        <i className="material-icons">collections</i>
                                        <span>{uploadFile}</span>
                                    </label>
                                </div>
                            </div>
                            <div className="custome-checkbox mt-4">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="isHome"
                                    id="HomeCheckbox"
                                    onChange={(e) => {
                                        setIsDraft(e.target.checked);
                                    }}
                                    defaultChecked={isDraft}
                                />
                                <label style={{ userSelect: 'none' }} className="form-check-label ms-2" htmlFor="HomeCheckbox">
                                    <span>Draft</span>
                                </label>
                            </div>
                            <AnchorComponent
                                className="mc-btn w-100 primary mt-5"
                                text={t('Save')}
                                icon="cloud_upload"
                                to="#"
                                onClick={productId ? updateProductHanddler : createProductHanddler}
                            />
                        </div>
                    </Col>
                </Row>
            </PageLayout>
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
            <Modal size="lg" show={classifyModal} onHide={() => setClassifyModal(false)} style={{ padding: '10px' }}>
                <div className="mc-alert-modal" style={{ width: '80vw' }}>
                    <i className="material-icons">account_tree</i>
                    <h3>Manage Classify</h3>
                    {/* <p>Chose category for your product</p> */}
                    <Modal.Body>
                        <Row>
                            <Col xl={12}>
                                <Row>
                                    <Col xl={9}>
                                        <LabelFieldComponent
                                            type="text"
                                            label={t('new classify')}
                                            fieldSize="mb-4 w-100 h-md"
                                            onChange={(e) => {
                                                setnewClassifyName(e.target.value);
                                            }}
                                            defaultValue={newClassifyName}
                                        />
                                    </Col>
                                    <Col xl={3}>
                                        <AnchorComponent
                                            className="mc-btn w-100 primary mt-4"
                                            text={t('add classify')}
                                            icon="add"
                                            to="#"
                                            onClick={addClassifyHandler}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                            <Col xl={12}>
                                <ClassifyTableComponent reload={reloadClassifyData} setReload={setReloadClassifyData} />
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <ButtonComponent
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => {
                                setClassifyModal(false);
                            }}
                        >
                            {t('close')}
                        </ButtonComponent>
                        <ButtonComponent
                            type="button"
                            className="btn btn-success"
                            onClick={() => {
                                setClassifyModal(false);
                            }}
                        >
                            {t('Save')}
                        </ButtonComponent>
                    </Modal.Footer>
                </div>
            </Modal>
        </>
    );
}
