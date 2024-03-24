import React, { useContext, useEffect, useRef, useState } from 'react';
import { TranslatorContext } from '../../context/Translator';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, Dropdown } from 'react-bootstrap';
import { AnchorComponent, ButtonComponent } from '../../components/elements';
import LabelTextareaComponent from '../../components/fields/LabelTextareaComponent';
import PageLayout from '../../layouts/PageLayout';
import specifics from '../../assets/data/specifics.json';
import reviews from '../../assets/data/reviews.json';
import axiosInstance from '../../configs/axiosInstance';

export default function ProductViewPage() {
    const { productId } = useParams();

    const { t } = useContext(TranslatorContext);

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

    const ratings = [
        { count: '5 star', graph: '90%', user: '22' },
        { count: '4 star', graph: '75%', user: '06' },
        { count: '3 star', graph: '30%', user: '05' },
        { count: '2 star', graph: '15%', user: '03' },
        { count: '1 star', graph: '5%', user: '02' },
    ];

    const [productData, setProductData] = useState();
    const [reviewData, setReviewData] = useState();

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
                setReviewData(results.data)
            } catch (err) {
                console.log(err);
            }
        };
        fetchProduct();

        fetchProductReview();
    }, [productId]);

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
                                    <p>
                                        {productData.discountPrice} $ <del>{productData.price} $</del>
                                    </p>
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
                                {/* <div className="mc-product-view-meta">
                                <i className="material-icons">{a[8].icon}</i>
                                <h5>{a[8].title}</h5>
                                <span>:</span>
                                <p>{productData.modifyDate}</p>
                                {specific.text && <p>{specific.text}</p>}
                                {specific.price && (
                                    <p>
                                        {specific.price.now} <del>{specific.price.old}</del>
                                    </p>
                                )}
                                {specific.list && (
                                    <ul>
                                        {specific.list.map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                )}
                            </div> */}
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
                                        {ratings.map((rating, index) => (
                                            <li key={index} className="mc-review-analytics-item">
                                                <span className="mc-review-analytics-count">{rating.count}</span>
                                                <div className="mc-review-analytics-graph">
                                                    <span style={{ width: rating.graph }}></span>
                                                </div>
                                                <span className="mc-review-analytics-user">({rating.user})</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="mc-review-analytics-detail-group">
                                    <h3 className="mc-review-analytics-total">{t('total_review')} (38)</h3>
                                    <h4 className="mc-review-analytics-score">4.9</h4>
                                    <div className="mc-review-analytics-star">
                                        <i className="material-icons active">star</i>
                                        <i className="material-icons active">star</i>
                                        <i className="material-icons active">star</i>
                                        <i className="material-icons active">star</i>
                                        <i className="material-icons active">star_half</i>
                                    </div>
                                    <p className="mc-review-analytics-text">your average rating star</p>
                                </div>
                            </div>
                        </Col>
                        <Col xl={12}>
                            <h6 className="mc-divide-title mt-5 mb-4">Customer Reviews</h6>
                            <ul className="mc-review-list">
                                {reviews?.map((item, index) => (
                                    <li key={index} className="mc-review-item">
                                        <div className="mc-review-group">
                                            <div className="mc-review-data">
                                                <div className="mc-review-head">
                                                    <div className="mc-review-user">
                                                        <div className="mc-round-avatar sm">
                                                            <img src={item.src} alt="avatar" />
                                                        </div>
                                                        <div className="mc-duel-text sm">
                                                            <h3 className="mc-duel-text-title">{item.name}</h3>
                                                            <p className="mc-duel-text-descrip">{item.date}</p>
                                                        </div>
                                                        {item.admin && <span className="mc-review-admin">{item.admin}</span>}
                                                    </div>
                                                    <div className="mc-review-reply">
                                                        <AnchorComponent
                                                            to={item.button.path}
                                                            icon={item.button.icon}
                                                            text={item.button.text}
                                                            className="mc-btn primary"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mc-review-star">
                                                    {item.star.map((item, index) => (
                                                        <i key={index} className="material-icons">
                                                            {item}
                                                        </i>
                                                    ))}
                                                </div>
                                                <p className="mc-review-describe">{item.text}</p>
                                            </div>
                                            <div className="mc-review-dots">
                                                <Dropdown bsPrefix="mc-dropdown">
                                                    <Dropdown.Toggle bsPrefix="mc-dropdown-toggle">
                                                        <i className="material-icons">more_vert</i>
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu align="end" className="mc-dropdown-paper">
                                                        {/* <button type="button" className="mc-dropdown-menu">
                                                            <i className="material-icons">edit</i>
                                                            <span>{t('edit')}</span>
                                                        </button> */}
                                                        <button type="button" className="mc-dropdown-menu">
                                                            <i className="material-icons">gpp_bad</i>
                                                            <span>{t('block')}</span>
                                                        </button>
                                                        {/* <button type="button" className="mc-dropdown-menu">
                                                            <i className="material-icons">report</i>
                                                            <span>{t('report')}</span>
                                                        </button> */}
                                                        <button type="button" className="mc-dropdown-menu">
                                                            <i className="material-icons">delete</i>
                                                            <span>{t('delete')}</span>
                                                        </button>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </div>
                                        </div>
                                        {/* {item.reply && (
                                            <ul>
                                                {item.reply.map((item, index) => (
                                                    <li key={index}>
                                                        <div className="mc-review-group">
                                                            <div className="mc-review-data">
                                                                <div className="mc-review-head">
                                                                    <div className="mc-review-user">
                                                                        <div className="mc-round-avatar sm">
                                                                            <img src={item.src} alt="avatar" />
                                                                        </div>
                                                                        <div className="mc-duel-text sm">
                                                                            <h3 className="mc-duel-text-title">{item.name}</h3>
                                                                            <p className="mc-duel-text-descrip">{item.date}</p>
                                                                        </div>
                                                                        {item.admin && (
                                                                            <span className="mc-review-admin">
                                                                                {t(item.admin)}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <div className="mc-review-reply">
                                                                        <AnchorComponent
                                                                            to={item.button.path}
                                                                            icon={item.button.icon}
                                                                            text={t(item.button.text)}
                                                                            className="mc-btn primary"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                {item.star && (
                                                                    <div className="mc-review-star">
                                                                        {item.star.map((item, index) => (
                                                                            <i key={index} className="material-icons">
                                                                                {item}
                                                                            </i>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                                <p className="mc-review-describe">{item.text}</p>
                                                            </div>
                                                            <div className="mc-review-dots">
                                                                <Dropdown bsPrefix="mc-dropdown">
                                                                    <Dropdown.Toggle bsPrefix="mc-dropdown-toggle">
                                                                        <i className="material-icons">more_vert</i>
                                                                    </Dropdown.Toggle>
                                                                    <Dropdown.Menu align="end" className="mc-dropdown-paper">
                                                                        <button type="button" className="mc-dropdown-menu">
                                                                            <i className="material-icons">edit</i>
                                                                            <span>{t('edit')}</span>
                                                                        </button>
                                                                        <button type="button" className="mc-dropdown-menu">
                                                                            <i className="material-icons">gpp_bad</i>
                                                                            <span>{t('block')}</span>
                                                                        </button>
                                                                        <button type="button" className="mc-dropdown-menu">
                                                                            <i className="material-icons">report</i>
                                                                            <span>{t('report')}</span>
                                                                        </button>
                                                                        <button type="button" className="mc-dropdown-menu">
                                                                            <i className="material-icons">delete</i>
                                                                            <span>{t('delete')}</span>
                                                                        </button>
                                                                    </Dropdown.Menu>
                                                                </Dropdown>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )} */}
                                    </li>
                                ))}
                            </ul>
                        </Col>
                        {/* <Col xl={12}>
                            <h6 className="mc-divide-title mt-3 mb-4">{t('review_reply_form')}</h6>
                            <LabelTextareaComponent placeholder={t('write_here')} fieldSize="w-100 h-text-xl" />
                            <ButtonComponent className="mc-btn mc-review-form-btn primary">
                                {t('drop_your_replies')}
                            </ButtonComponent>
                        </Col> */}
                    </Row>
                </div>
            ) : null}
        </PageLayout>
    );
}
