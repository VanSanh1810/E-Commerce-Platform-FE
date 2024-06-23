import React, { useState, useEffect, useContext } from 'react';
import { TranslatorContext } from '../../context/Translator';
import Modal from 'react-bootstrap/Modal';
import { AnchorComponent, ButtonComponent } from '../elements';
import axiosInstance from '../../configs/axiosInstance';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setToastState, toastType } from '../../store/reducers/toastReducer';

export default function ProductsTableComponent({
    thead,
    tbody,
    sortPrice,
    rowView,
    currentPage,
    setPages,
    productSearchText,
    selectedCategory,
    _shopId,
}) {
    const { t } = useContext(TranslatorContext);
    const dispatch = useDispatch();

    const { shopId, isVendor } = useSelector((state) => state.persistedReducer.authReducer);
    const [alertModal, setAlertModal] = useState(false);
    const [data, setData] = useState([]);

    // useEffect(()=> { setData(tbody) }, [tbody]);

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const pathString = isVendor
                    ? `/api/product?shopId=${shopId}&sortPrice=${sortPrice}&currentPage=${currentPage}&limit=${rowView}&searchText=${
                          productSearchText || ''
                      }&category=${selectedCategory ? selectedCategory : ''}`
                    : `/api/product/?sortPrice=${sortPrice}&currentPage=${currentPage}&limit=${rowView}&searchText=${
                          productSearchText || ''
                      }&shopId=${_shopId ? _shopId : ''}&category=${selectedCategory ? selectedCategory : ''}`;
                const results = await axiosInstance.get(pathString);
                console.log(results);
                const listProducts = [...results.data.data];
                setPages(results.data.pages);
                // if (shopId) {
                //     const shopProduct = listProducts.filter((product) => product.shop._id === shopId);
                //     setData(shopProduct);
                // } else {
                //     setData(listProducts);
                // }
                setData(listProducts);
            } catch (err) {
                console.log(err);
            }
        };
        fetchAllProducts();
    }, [shopId, isVendor, sortPrice, rowView, currentPage, setPages, productSearchText, _shopId, selectedCategory]);

    const priceRange = (routePath) => {
        let min;
        let max;
        routePath.forEach((element) => {
            if (min) {
                let temp =
                    parseFloat(element.detail.disPrice) && parseFloat(element.detail.disPrice) > 0
                        ? parseFloat(element.detail.disPrice)
                        : parseFloat(element.detail.price);
                min = temp < min ? temp : min;
            } else {
                min =
                    parseFloat(element.detail.disPrice) && parseFloat(element.detail.disPrice) > 0
                        ? parseFloat(element.detail.disPrice)
                        : parseFloat(element.detail.price);
            }
            //
            if (max) {
                let temp =
                    parseFloat(element.detail.disPrice) && parseFloat(element.detail.disPrice) > 0
                        ? parseFloat(element.detail.disPrice)
                        : parseFloat(element.detail.price);
                max = temp > max ? temp : max;
            } else {
                max =
                    parseFloat(element.detail.disPrice) && parseFloat(element.detail.disPrice) > 0
                        ? parseFloat(element.detail.disPrice)
                        : parseFloat(element.detail.price);
            }
        });
        return min === max ? min : `${min} - ${max}`;
    };

    const totalStock = (routePath) => {
        const sum = routePath.reduce((accumulator, currentValue) => accumulator + parseFloat(currentValue.detail.stock), 0);
        return sum;
    };

    const productSatusView = (status) => {
        switch (status) {
            case 'draft':
                return 'yellow';
            case 'active':
                return 'green';
            case 'disabled':
                return 'red';
            default:
                return 'yellow';
        }
    };

    const deleteProductAction = async (id) => {
        try {
            const response = await axiosInstance.delete(`/api/product/${id}`);
            console.log(response.data);
            dispatch(dispatch(setToastState({ Tstate: toastType.success, Tmessage: 'product deleted' })));
            setAlertModal(false);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="mc-table-responsive">
            <table className="mc-table product">
                <thead className="mc-table-head primary">
                    <tr>
                        <th>
                            <div className="mc-table-check">
                                <p>uid</p>
                            </div>
                        </th>
                        {thead.map((item, index) => (
                            <th key={index}>{t(item)}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="mc-table-body even">
                    {data?.map((item, index) => (
                        <tr key={item._id}>
                            <td title={index + 1}>
                                <div className="mc-table-check">
                                    <p>#{item.id}</p>
                                </div>
                            </td>
                            <td>
                                <div className="mc-table-product md">
                                    <img src={item.images[0].url} alt="product" />
                                    <div className="mc-table-group">
                                        <h6>{item.name}</h6>
                                        {/* <p>{item.description}</p> */}
                                    </div>
                                </div>
                            </td>
                            <td>{item.category?.name}</td>
                            <td>
                                {item.variantData && item.variantData.length > 0 ? (
                                    <div className="mc-table-price">
                                        <p>{priceRange(item.routePath)}$</p>
                                    </div>
                                ) : (
                                    <div className="mc-table-price">
                                        {!item.discountPrice || parseFloat(item.discountPrice) === 0 ? (
                                            <p>{item.price}$</p>
                                        ) : parseFloat(item.price) === parseFloat(item.discountPrice) ? (
                                            <p>{item.price}$</p>
                                        ) : (
                                            <>
                                                <del>{item.price}$</del>
                                                <p>{item.discountPrice}$</p>
                                            </>
                                        )}
                                    </div>
                                )}
                            </td>
                            <td>{item.variantData && item.variantData.length > 0 ? totalStock(item.routePath) : item.stock}</td>
                            <td>
                                <div className="mc-table-rating">
                                    <i className="material-icons">star</i>
                                    <h3>{item.averageRating}</h3>
                                    <p>({item.totalReviews})</p>
                                </div>
                            </td>
                            <td>{item.ordersCount}</td>
                            <td>
                                <p className={`mc-table-badge ${productSatusView(item.status)}`}>{item.status}</p>
                            </td>
                            <td>
                                <div className="mc-table-action">
                                    <AnchorComponent to={`/product/${item.id}`} title="View" className="material-icons view">
                                        {'visibility'}
                                    </AnchorComponent>
                                    <AnchorComponent
                                        to={`/product-upload/${item.id}`}
                                        title="Edit"
                                        className="material-icons edit"
                                    >
                                        {'edit'}
                                    </AnchorComponent>
                                    {isVendor ? (
                                        <ButtonComponent
                                            type="button"
                                            title="Delete"
                                            className="material-icons delete"
                                            onClick={() => setAlertModal(item.id)}
                                        >
                                            {'delete'}
                                        </ButtonComponent>
                                    ) : null}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal show={alertModal} onHide={() => setAlertModal(false)}>
                <div className="mc-alert-modal">
                    <i className="material-icons">new_releases</i>
                    <h3>are your sure!</h3>
                    <p>Want to delete this product?</p>
                    <Modal.Footer>
                        <ButtonComponent type="button" className="btn btn-secondary" onClick={() => setAlertModal(false)}>
                            {t('close')}
                        </ButtonComponent>
                        <ButtonComponent type="button" className="btn btn-danger" onClick={() => deleteProductAction(alertModal)}>
                            {t('delete')}
                        </ButtonComponent>
                    </Modal.Footer>
                </div>
            </Modal>
        </div>
    );
}
