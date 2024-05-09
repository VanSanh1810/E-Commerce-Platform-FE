import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { TranslatorContext } from '../../context/Translator';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, Dropdown, Modal } from 'react-bootstrap';
import { AnchorComponent, ButtonComponent } from '../../components/elements';
import LabelTextareaComponent from '../../components/fields/LabelTextareaComponent';
import PageLayout from '../../layouts/PageLayout';
import specifics from '../../assets/data/specifics.json';
import reviews from '../../assets/data/reviews.json';
import axiosInstance from '../../configs/axiosInstance';
import { useSelector } from 'react-redux';

export default function ProductViewPage() {
    const { productId } = useParams();
    const { shopId, isVendor } = useSelector((state) => state.persistedReducer.authReducer);

    const { t } = useContext(TranslatorContext);
    const [productVariantDetailTable, setProductVariantDetailTable] = useState([]);
    const [productStock, setProductStock] = useState();
    const [priceRange, setPriceRange] = useState();

    const a = [
        { icon: 'store', title: 'brand', text: 'ecstasy' },
        { icon: 'pix', title: 'category', text: "man's" },
        { icon: 'settings', title: 'tags', list: ['suite', 'party', 'dress', 'smart', 'man', 'styles'] },
        { icon: 'palette', title: 'color', list: ['red', 'blue', 'green', 'yellow', 'purple'] },
        { icon: 'summarize', title: 'size', list: ['sm', 'md', 'lg', 'xl', 'xxl'] },
        { icon: 'sell', title: 'price', price: { now: '$37.00', old: '$42.00' } },
        { icon: 'shopping_cart', title: 'stock', text: '(68) piece' },
        { icon: 'hotel_class', title: 'review', text: '(03) review' },
        { icon: 'verified', title: 'published', text: '02 feb 2020' },
    ];

    const [productData, setProductData] = useState();
    const [reviewData, setReviewData] = useState([]);
    const [reviewGroupData, setReviewGroupData] = useState([0, 0, 0, 0, 0]);

    const [imgViewModal, setImgViewModal] = useState(false);

    const descriptionRef = useRef();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const results = await axiosInstance.get(`/api/product/${productId}`);
                setProductData(results.data.data);
                console.log(results.data.data);
                // descriptionRef.current.innerHTML = results.data.data.description;
            } catch (err) {
                console.log(err);
            }
        };
        const fetchProductReview = async () => {
            try {
                const results = await axiosInstance.get(`/api/review/product/${productId}`);
                console.log(results.data);
                setReviewData(results.data);
                const reviews = [...results.data.reviews];
                const result1 = reviews.filter((review) => review.rating === 1);
                const result2 = reviews.filter((review) => review.rating === 2);
                const result3 = reviews.filter((review) => review.rating === 3);
                const result4 = reviews.filter((review) => review.rating === 4);
                const result5 = reviews.filter((review) => review.rating === 5);
                setReviewGroupData([result1.length, result2.length, result3.length, result4.length, result5.length]);
            } catch (err) {
                console.log(err);
            }
        };
        fetchProduct();

        fetchProductReview();
    }, [productId]);

    const initProductVariantDetailTable = useCallback((node, depth, routeMap) => {
        if (node.detail) {
            const detail = {
                routeMap: routeMap,
                detail: node.detail,
            };
            setProductVariantDetailTable((tb) => [...tb, detail]);
            return;
        } else {
            for (let i = 0; i < node.child.length; i++) {
                const newRouteMap = [...routeMap, node.child[i]._id];
                initProductVariantDetailTable(node.child[i], depth + 1, newRouteMap);
            }
            return;
        }
    }, []);

    useEffect(() => {
        const startInitProductVariantDetailTable = () => {
            for (let i = 0; i < productData.variantDetail.length; i++) {
                initProductVariantDetailTable(productData.variantDetail[i], 0, [productData.variantDetail[i]._id]);
            }
        };
        if (productData?.variantDetail) {
            setProductVariantDetailTable([]);
            startInitProductVariantDetailTable();
        }
        // console.log(productData.variantDetail);
    }, [productData, initProductVariantDetailTable]);

    useEffect(() => {
        if (productVariantDetailTable.length > 0) {
            let max = null;
            let min = null;
            let totalStock = 0;

            // Duyệt qua mỗi object trong danh sách và cộng giá trị quantity lại
            productVariantDetailTable.forEach((obj) => {
                totalStock += parseFloat(obj.detail.stock);
                if (max) {
                    if (parseFloat(obj.detail.disPrice) !== 0) {
                        max = parseFloat(obj.detail.disPrice) > max ? parseFloat(obj.detail.disPrice) : max;
                    } else {
                        max = parseFloat(obj.detail.price) > max ? parseFloat(obj.detail.price) : max;
                    }
                } else {
                    max = parseFloat(obj.detail.disPrice) !== 0 ? parseFloat(obj.detail.disPrice) : parseFloat(obj.detail.price);
                }
                if (min) {
                    if (parseFloat(obj.detail.disPrice) !== 0) {
                        min = parseFloat(obj.detail.disPrice) < min ? parseFloat(obj.detail.disPrice) : min;
                    } else {
                        min = parseFloat(obj.detail.price) < min ? parseFloat(obj.detail.price) : min;
                    }
                } else {
                    min = parseFloat(obj.detail.disPrice) !== 0 ? parseFloat(obj.detail.disPrice) : parseFloat(obj.detail.price);
                }
            });
            setPriceRange(min === max ? `${min}` : `${min} - $${max}`);
            setProductStock(totalStock);
        }
    }, [productVariantDetailTable]);

    const hiddenProductAdminAction = async (action) => {
        try {
            const response = await axiosInstance.post(`/api/product/disable/${productId}`, {
                isHidden: !!action,
            });
            console.log(response.data);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <PageLayout>
            <div className="mc-card mb-4">
                <div className="mc-breadcrumb">
                    <h3 className="mc-breadcrumb-title">{t('product_view')}</h3>
                    <ul className="mc-breadcrumb-list">
                        <li className="mc-breadcrumb-item">
                            <Link to="/" className="mc-breadcrumb-link">
                                {t('home')}
                            </Link>
                        </li>
                        <li className="mc-breadcrumb-item">
                            <Link to="/product" className="mc-breadcrumb-link">
                                {t('products')}
                            </Link>
                        </li>
                        <li className="mc-breadcrumb-item">{t('product_view')}</li>
                    </ul>
                </div>
            </div>
            {productData ? (
                <div className="mc-card p-lg-4">
                    <Row>
                        <Col xl={5}>
                            <h6 className="mc-divide-title mb-4">{t('product_gallery')}</h6>
                            <div className="mc-product-view-gallery">
                                {productData?.images?.map((image) => {
                                    return <img src={image.url} alt="product" />;
                                })}

                                {/* <img src="images/product/single/02.webp" alt="product" />
                            <img src="images/product/single/03.webp" alt="product" />
                            <img src="images/product/single/04.webp" alt="product" />
                            <img src="images/product/single/05.webp" alt="product" /> */}
                            </div>
                        </Col>
                        <Col xl={7}>
                            <h6 className="mc-divide-title mb-4">{t('product_details')}</h6>
                            <div className="mc-product-view-info-group">
                                <h2 className="mc-product-view-info-title">{productData.name}</h2>
                                <div className="mc-product-view-meta">
                                    <i className="material-icons">{a[1].icon}</i>
                                    <h5>{a[1].title}</h5>
                                    <span>:</span>
                                    <p>{productData.category.name}</p>
                                </div>
                                <div className="mc-product-view-meta">
                                    <i className="material-icons">{a[5].icon}</i>
                                    <h5>{a[5].title}</h5>
                                    <span>:</span>
                                    {productData.variantData ? (
                                        <p>
                                            {productData.discountPrice !== 0 ? productData.discountPrice : productData.price} ${' '}
                                            {productData.discountPrice === 0 ? null : <del>{productData.price} $</del>}
                                        </p>
                                    ) : (
                                        <p>{priceRange} $</p>
                                    )}
                                </div>
                                <div className="mc-product-view-meta">
                                    <i className="material-icons">{a[6].icon}</i>
                                    <h5>{a[6].title}</h5>
                                    <span>:</span>
                                    <p>{productData.stock}</p>
                                </div>
                                <div className="mc-product-view-meta">
                                    <i className="material-icons">{a[7].icon}</i>
                                    <h5>{a[7].title}</h5>
                                    <span>:</span>
                                    <p>({reviewData.total_reviews}) review</p>
                                </div>
                                <div className="mc-product-view-meta">
                                    <i className="material-icons">{a[8].icon}</i>
                                    <h5>{a[8].title}</h5>
                                    <span>:</span>
                                    <p>{new Date(parseInt(productData.modifyDate)).toLocaleDateString()}</p>
                                </div>
                                {productData.variantData?.map((varD) => {
                                    return (
                                        <div className="mc-product-view-meta">
                                            <i className="material-icons">{a[4].icon}</i>
                                            <h5>{varD.name}</h5>
                                            <span>:</span>
                                            <ul>
                                                {varD.data?.map((v) => {
                                                    return <li key={v._id}>{v.name}</li>;
                                                })}
                                            </ul>
                                        </div>
                                    );
                                })}
                                {!isVendor ? (
                                    <div className="custome-checkbox mt-4">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            name="isHome"
                                            id="HomeCheckbox"
                                            onChange={(e) => {
                                                hiddenProductAdminAction(e.target.checked);
                                            }}
                                            defaultChecked={productData?.status === 'disabled' ? true : false}
                                        />
                                        <label
                                            style={{ userSelect: 'none' }}
                                            className="form-check-label ms-2"
                                            htmlFor="HomeCheckbox"
                                        >
                                            <span>Hidden</span>
                                        </label>
                                    </div>
                                ) : null}
                            </div>
                        </Col>
                        <Col xl={12}>
                            <h6 className="mc-divide-title mt-5 mb-4">{t('product_description')}</h6>
                            <div className="mc-product-view-descrip">
                                <p ref={descriptionRef} dangerouslySetInnerHTML={{ __html: productData.description }}></p>
                            </div>
                        </Col>
                        <Col xl={12}>
                            <h6 className="mc-divide-title mt-5 mb-4">{t('rating_analytics')}</h6>
                            <div className="mc-review-analytics-group">
                                <div className="mc-review-analytics-graph-group">
                                    <ul className="mc-review-analytics-list">
                                        {/* 5 star */}
                                        <li className="mc-review-analytics-item">
                                            <span className="mc-review-analytics-count">{5}</span>
                                            <div className="mc-review-analytics-graph">
                                                <span
                                                    style={{
                                                        width:
                                                            (
                                                                (reviewGroupData[4] / reviewData?.reviews?.length) *
                                                                100
                                                            ).toString() + '%',
                                                    }}
                                                ></span>
                                            </div>
                                            <span className="mc-review-analytics-user">({reviewGroupData[4]})</span>
                                        </li>
                                        {/* 4 star */}
                                        <li className="mc-review-analytics-item">
                                            <span className="mc-review-analytics-count">{4}</span>
                                            <div className="mc-review-analytics-graph">
                                                <span
                                                    style={{
                                                        width:
                                                            (
                                                                (reviewGroupData[3] / reviewData?.reviews?.length) *
                                                                100
                                                            ).toString() + '%',
                                                    }}
                                                ></span>
                                            </div>
                                            <span className="mc-review-analytics-user">({reviewGroupData[3]})</span>
                                        </li>
                                        {/* 3 star */}
                                        <li className="mc-review-analytics-item">
                                            <span className="mc-review-analytics-count">{3}</span>
                                            <div className="mc-review-analytics-graph">
                                                <span
                                                    style={{
                                                        width:
                                                            (
                                                                (reviewGroupData[2] / reviewData?.reviews?.length) *
                                                                100
                                                            ).toString() + '%',
                                                    }}
                                                ></span>
                                            </div>
                                            <span className="mc-review-analytics-user">({reviewGroupData[2]})</span>
                                        </li>
                                        {/* 2 star */}
                                        <li className="mc-review-analytics-item">
                                            <span className="mc-review-analytics-count">{2}</span>
                                            <div className="mc-review-analytics-graph">
                                                <span
                                                    style={{
                                                        width:
                                                            (
                                                                (reviewGroupData[1] / reviewData?.reviews?.length) *
                                                                100
                                                            ).toString() + '%',
                                                    }}
                                                ></span>
                                            </div>
                                            <span className="mc-review-analytics-user">({reviewGroupData[1]})</span>
                                        </li>
                                        {/* 1 star */}
                                        <li className="mc-review-analytics-item">
                                            <span className="mc-review-analytics-count">{1}</span>
                                            <div className="mc-review-analytics-graph">
                                                <span
                                                    style={{
                                                        width:
                                                            (
                                                                (reviewGroupData[0] / reviewData?.reviews?.length) *
                                                                100
                                                            ).toString() + '%',
                                                    }}
                                                ></span>
                                            </div>
                                            <span className="mc-review-analytics-user">({reviewGroupData[0]})</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="mc-review-analytics-detail-group">
                                    <h3 className="mc-review-analytics-total">
                                        {t('total_review')} ({reviewData.total_reviews})
                                    </h3>
                                    <h4 className="mc-review-analytics-score">{productData.averageRating}</h4>
                                    <div className="mc-review-analytics-star">
                                        <i className={`material-icons ${productData.averageRating > 0 ? 'active' : ''}`}>
                                            {productData.averageRating >= 1 || productData.averageRating <= 0
                                                ? 'star'
                                                : 'star_half'}
                                        </i>
                                        <i className={`material-icons ${productData.averageRating > 1 ? 'active' : ''}`}>
                                            {productData.averageRating >= 2 || productData.averageRating <= 1
                                                ? 'star'
                                                : 'star_half'}
                                        </i>
                                        <i className={`material-icons ${productData.averageRating > 2 ? 'active' : ''}`}>
                                            {productData.averageRating >= 3 || productData.averageRating <= 2
                                                ? 'star'
                                                : 'star_half'}
                                        </i>
                                        <i className={`material-icons ${productData.averageRating > 3 ? 'active' : ''}`}>
                                            {productData.averageRating >= 4 || productData.averageRating <= 3
                                                ? 'star'
                                                : 'star_half'}
                                        </i>
                                        <i className={`material-icons ${productData.averageRating > 4 ? 'active' : ''}`}>
                                            {productData.averageRating >= 5 || productData.averageRating <= 4
                                                ? 'star'
                                                : 'star_half'}
                                        </i>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col xl={12}>
                            <h6 className="mc-divide-title mt-5 mb-4">Customer Reviews</h6>
                            <ul className="mc-review-list">
                                {reviewData?.reviews?.map((item, index) => (
                                    <li key={item._id} className="mc-review-item">
                                        <div className="mc-review-group row">
                                            <div className="mc-review-data">
                                                <div className="mc-review-head">
                                                    <div className="mc-review-user">
                                                        <div className="mc-round-avatar sm">
                                                            <img src={item.src} alt="avatar" />
                                                        </div>
                                                        <div className="mc-duel-text sm">
                                                            <h3 className="mc-duel-text-title">{item.name}</h3>
                                                            <p className="mc-duel-text-descrip">
                                                                {new Date(parseInt(item.createDate)).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        {item.admin && <span className="mc-review-admin">{item.admin}</span>}
                                                    </div>
                                                    {/* <div className="mc-review-reply">
                                                        <AnchorComponent
                                                            to={item.user}
                                                            icon={'reply'}
                                                            text={'reply'}
                                                            className="mc-btn primary"
                                                        />
                                                    </div> */}
                                                    <div className="mc-review-reply">
                                                        {item.variant.map((v) => {
                                                            return <p>{v.name}</p>;
                                                        })}
                                                    </div>
                                                </div>
                                                <div className="mc-review-analytics-star justify-content-start">
                                                    <i className={`material-icons ${item.rating > 0 ? 'active' : ''}`}>
                                                        {item.rating >= 1 || item.rating <= 0 ? 'star' : 'star_half'}
                                                    </i>
                                                    <i className={`material-icons ${item.rating > 1 ? 'active' : ''}`}>
                                                        {item.rating >= 2 || item.rating <= 1 ? 'star' : 'star_half'}
                                                    </i>
                                                    <i className={`material-icons ${item.rating > 2 ? 'active' : ''}`}>
                                                        {item.rating >= 3 || item.rating <= 2 ? 'star' : 'star_half'}
                                                    </i>
                                                    <i className={`material-icons ${item.rating > 3 ? 'active' : ''}`}>
                                                        {item.rating >= 4 || item.rating <= 3 ? 'star' : 'star_half'}
                                                    </i>
                                                    <i className={`material-icons ${item.rating > 4 ? 'active' : ''}`}>
                                                        {item.rating >= 5 || item.rating <= 4 ? 'star' : 'star_half'}
                                                    </i>
                                                </div>
                                                <p className="mc-review-describe">{item.comment}</p>
                                                <div>
                                                    {item.images.map((image, i) => {
                                                        return (
                                                            <img
                                                                style={{
                                                                    width: '80px',
                                                                    height: '80px',
                                                                    objectFit: 'cover',
                                                                    marginRight: '5px',
                                                                    cursor: 'pointer',
                                                                }}
                                                                src={image.url}
                                                                alt="img"
                                                                onClick={() => {
                                                                    setImgViewModal(image.url);
                                                                }}
                                                            />
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </Col>
                    </Row>
                </div>
            ) : null}
            <Modal size="lg" show={imgViewModal} onHide={() => setImgViewModal(false)} style={{ padding: '10px' }}>
                <div className="mc-alert-modal" style={{ width: '80vw' }}>
                    <i className="material-icons">image</i>
                    <Modal.Body>
                        <img src={imgViewModal} alt="img" />
                    </Modal.Body>
                    <Modal.Footer>
                        <ButtonComponent
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => {
                                setImgViewModal(false);
                            }}
                        >
                            {t('close')}
                        </ButtonComponent>
                    </Modal.Footer>
                </div>
            </Modal>
        </PageLayout>
    );
}
