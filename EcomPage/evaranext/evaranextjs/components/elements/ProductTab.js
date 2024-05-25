import React, { useEffect, useState } from 'react';
import axiosInstance from '../../config/axiosInstance';
import { Modal } from 'react-responsive-modal';

const ProductTab = ({ product }) => {
    const [activeIndex, setActiveIndex] = useState(1);
    const [productReviews, setProductReviews] = useState([]);

    const [starPercents, setStarPercents] = useState([0, 0, 0, 0, 0]);
    const [imageModal, setImageModal] = useState();

    const [reviewReportModal, setReviewReportModal] = useState(false);

    const handleOnClick = (index) => {
        setActiveIndex(index);
    };

    const reportReviewActions = async (e) => {
        e.preventDefault();
        console.log(e.target.reportReason.value);
        try {
            const response = await axiosInstance.post('/api/report', {
                reason: e.target.reportReason.value,
                target: reviewReportModal,
                type: 'Review',
            });
            console.log(response.data);
            setReviewReportModal(false);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const fetchProductReviews = async () => {
            try {
                const response = await axiosInstance.get(`/api/review/product/${product._id}`);
                console.log(response.data);
                setProductReviews([...response.data.reviews]);
                //
                const reviews = [...response.data.reviews];
                const result1 = reviews.filter((review) => {
                    return review.rating === 1;
                });
                const result2 = reviews.filter((review) => {
                    return review.rating === 2;
                });
                const result3 = reviews.filter((review) => {
                    return review.rating === 3;
                });
                const result4 = reviews.filter((review) => {
                    return review.rating === 4;
                });
                const result5 = reviews.filter((review) => {
                    return review.rating === 5;
                });
                console.log(result1, result2, result3, result4, result5);
                setStarPercents([
                    result1.length / response.data.total_reviews,
                    result2.length / response.data.total_reviews,
                    result3.length / response.data.total_reviews,
                    result4.length / response.data.total_reviews,
                    result5.length / response.data.total_reviews,
                ]);
            } catch (e) {
                console.error(e);
            }
        };
        fetchProductReviews();
    }, [product._id]);

    return (
        <>
            <div className="tab-style3">
                <ul className="nav nav-tabs text-uppercase">
                    <li className="nav-item">
                        <a
                            className={activeIndex === 1 ? 'nav-link active' : 'nav-link'}
                            id="Description-tab"
                            data-bs-toggle="tab"
                            onClick={() => handleOnClick(1)}
                        >
                            Description
                        </a>
                    </li>
                    <li className="nav-item">
                        <a
                            className={activeIndex === 3 ? 'nav-link active' : 'nav-link'}
                            id="Reviews-tab"
                            data-bs-toggle="tab"
                            onClick={() => handleOnClick(3)}
                        >
                            Reviews ({product.totalReviews})
                        </a>
                    </li>
                </ul>
                <div className="tab-content shop_info_tab entry-main-content">
                    <div className={activeIndex === 1 ? 'tab-pane fade show active' : 'tab-pane fade'} id="Description">
                        <div className="" dangerouslySetInnerHTML={{ __html: product.description }}></div>
                    </div>
                    <div className={activeIndex === 3 ? 'tab-pane fade show active' : 'tab-pane fade'} id="Reviews">
                        <div className="comments-area">
                            <div className="row">
                                <div className="col-lg-8">
                                    <h4 className="mb-30">Customer reviews</h4>
                                    <div className="comment-list">
                                        {productReviews.map((review) => {
                                            return (
                                                <div className="single-comment justify-content-between d-flex">
                                                    <div className="user justify-content-between d-flex">
                                                        <div className="thumb text-center">
                                                            {/* <img src="/assets/imgs/page/avatar-6.jpg" alt="" /> */}
                                                            <h6>
                                                                <p>{review.name}</p>
                                                            </h6>
                                                            {/* <p className="font-xxs">Since 2012</p> */}
                                                        </div>
                                                        <div className="desc">
                                                            <div className="product-rate d-inline-block">
                                                                <div
                                                                    className="product-rating"
                                                                    style={{
                                                                        width: ((review.rating / 5) * 100).toString() + '%',
                                                                    }}
                                                                ></div>
                                                            </div>
                                                            <p>{review.comment}</p>
                                                            <div className="d-flex flex-row justify-content-start align-items-center">
                                                                {review.images.map((image, i) => {
                                                                    return (
                                                                        <img
                                                                            style={{
                                                                                width: '60px',
                                                                                height: '60px',
                                                                                objectFit: 'cover',
                                                                            }}
                                                                            src={image.url}
                                                                            alt="img"
                                                                            onClick={() => {
                                                                                setImageModal(image.url);
                                                                            }}
                                                                        />
                                                                    );
                                                                })}
                                                            </div>
                                                            <div className="d-flex justify-content-between">
                                                                <div className="d-flex align-items-center">
                                                                    <p className="font-xs mr-30">
                                                                        {new Date(parseInt(review.createDate)).toDateString()}
                                                                    </p>
                                                                    {/* <a href="#" className="text-brand btn-reply">
                                                                        Reply
                                                                        <i className="fi-rs-arrow-right"></i>
                                                                    </a> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <a
                                                        onClick={() => {
                                                            setReviewReportModal(review._id);
                                                        }}
                                                    >
                                                        Report !
                                                    </a>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    <h4 className="mb-30">Customer reviews</h4>
                                    <div className="d-flex mb-30">
                                        <div className="product-rate d-inline-block mr-15">
                                            <div
                                                className="product-rating"
                                                style={{
                                                    width: ((product.averageRating / 5) * 100).toString() + '%',
                                                }}
                                            ></div>
                                        </div>
                                        <h6>{product.averageRating} out of 5</h6>
                                    </div>
                                    <div className="progress">
                                        <span>5 star</span>
                                        <div
                                            className="progress-bar"
                                            role="progressbar"
                                            style={{
                                                width: (starPercents[4] * 100).toString() + '%',
                                            }}
                                            aria-valuenow="50"
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        >
                                            {(starPercents[4] * 100).toFixed(2).toString() + '%'}
                                        </div>
                                    </div>
                                    <div className="progress">
                                        <span>4 star</span>
                                        <div
                                            className="progress-bar"
                                            role="progressbar"
                                            style={{
                                                width: (starPercents[3] * 100).toString() + '%',
                                            }}
                                            aria-valuenow="25"
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        >
                                            {(starPercents[3] * 100).toFixed(2).toString() + '%'}
                                        </div>
                                    </div>
                                    <div className="progress">
                                        <span>3 star</span>
                                        <div
                                            className="progress-bar"
                                            role="progressbar"
                                            style={{
                                                width: (starPercents[2] * 100).toString() + '%',
                                            }}
                                            aria-valuenow="45"
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        >
                                            {(starPercents[2] * 100).toFixed(2).toString() + '%'}
                                        </div>
                                    </div>
                                    <div className="progress">
                                        <span>2 star</span>
                                        <div
                                            className="progress-bar"
                                            role="progressbar"
                                            style={{
                                                width: (starPercents[1] * 100).toString() + '%',
                                            }}
                                            aria-valuenow="65"
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        >
                                            {(starPercents[1] * 100).toFixed(2).toString() + '%'}
                                        </div>
                                    </div>
                                    <div className="progress mb-30">
                                        <span>1 star</span>
                                        <div
                                            className="progress-bar"
                                            role="progressbar"
                                            style={{
                                                width: (starPercents[0] * 100).toString() + '%',
                                            }}
                                            aria-valuenow="85"
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        >
                                            {(starPercents[0] * 100).toFixed(2).toString() + '%'}
                                        </div>
                                    </div>
                                    {/* <a href="#" className="font-xs text-muted">
                                        How are ratings calculated?
                                    </a> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                open={imageModal ? true : false}
                onClose={() => {
                    setImageModal(false);
                }}
            >
                <div style={{ width: '400px' }} className="row ps-3">
                    <div className="row w-100">
                        <img className="pb-3" src={imageModal} alt="img" />
                        <div className="w-100 col-md-12 d-flex justify-content-end align-items-end">
                            <button
                                style={{ backgroundColor: 'gray' }}
                                className="btn btn-secondary mt-2"
                                onClick={() => {
                                    setImageModal(false);
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal
                open={reviewReportModal ? true : false}
                onClose={() => {
                    setReviewReportModal(false);
                }}
            >
                <div style={{ width: '400px' }} className="row ps-3">
                    <p>REPORT {reviewReportModal}</p>
                    <div className="row w-100">
                        <form onSubmit={reportReviewActions}>
                            <textarea name="reportReason" className="pb-3" rows={2} placeholder="Reason" />
                            <div className="w-100 col-md-12 d-flex justify-content-end align-items-end">
                                <button type="submit" style={{ backgroundColor: 'green' }} className="btn btn-success mt-2 me-2">
                                    Submit
                                </button>
                                <button
                                    style={{ backgroundColor: 'gray' }}
                                    className="btn btn-secondary mt-2"
                                    onClick={() => {
                                        setReviewReportModal(false);
                                    }}
                                >
                                    Close
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ProductTab;
