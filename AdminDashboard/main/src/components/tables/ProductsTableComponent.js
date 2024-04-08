import React, { useState, useEffect, useContext } from 'react';
import { TranslatorContext } from '../../context/Translator';
import Modal from 'react-bootstrap/Modal';
import { AnchorComponent, ButtonComponent } from '../elements';
import axiosInstance from '../../configs/axiosInstance';
import { useSelector } from 'react-redux';

export default function ProductsTableComponent({ thead, tbody }) {
    const { t } = useContext(TranslatorContext);
    const { shopId } = useSelector((state) => state.persistedReducer.authReducer);

    const [alertModal, setAlertModal] = useState(false);
    const [data, setData] = useState([]);

    // useEffect(()=> { setData(tbody) }, [tbody]);

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const results = await axiosInstance.get('/api/product/');
                console.log(results);
                const listProducts = [...results.data.data];
                if (shopId) {
                    const shopProduct = listProducts.filter((product) => product.shop._id === shopId);
                    setData(shopProduct);
                } else {
                    setData(listProducts);
                }
                // setData(listProducts);
            } catch (err) {
                console.log(err);
            }
        };
        fetchAllProducts();
    }, [shopId]);

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
                        <tr key={index}>
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
                            <td>{item.category.name}</td>
                            <td>
                                <div className="mc-table-price">
                                    <del>{item.price}$</del>
                                    <p>{item.discountPrice}$</p>
                                </div>
                            </td>
                            <td>{item.stock}</td>
                            <td>
                                <div className="mc-table-rating">
                                    <i className="material-icons">star</i>
                                    <h3>{item.averageRating}</h3>
                                    <p>({item.totalReviews})</p>
                                </div>
                            </td>
                            <td>{item.ordersCount}</td>
                            <td>{item.sales ? 0 : 0}</td>
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
                                    <ButtonComponent
                                        type="button"
                                        title="Delete"
                                        className="material-icons delete"
                                        onClick={() => setAlertModal(true)}
                                    >
                                        {'delete'}
                                    </ButtonComponent>
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
                        <ButtonComponent type="button" className="btn btn-danger" onClick={() => setAlertModal(false)}>
                            {t('delete')}
                        </ButtonComponent>
                    </Modal.Footer>
                </div>
            </Modal>
        </div>
    );
}
