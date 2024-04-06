import Link from 'next/link';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { addToCart, decreaseQuantity, increaseQuantity } from '../../redux/action/cart';
import { addToCompare } from '../../redux/action/compareAction';
import { addToWishlist } from '../../redux/action/wishlistAction';
import ProductTab from '../elements/ProductTab';
import RelatedSlider from '../sliders/Related';
import ThumbSlider from '../sliders/Thumb';

const ProductDetails = ({
    product,
    cartItems,
    addToCompare,
    addToCart,
    addToWishlist,
    increaseQuantity,
    decreaseQuantity,
    quickView,
    user,
}) => {
    const [quantity, setQuantity] = useState(1);

    const handleCart = (product) => {
        addToCart(product, user);
        toast.success('Add to Cart !');
    };

    const arraysAreEqual = (arr1, arr2) => {
        // Kiểm tra xem độ dài của hai mảng có bằng nhau không

        if (!arr1 || !arr2) {
            return false;
        }
        if (arr1.length !== arr2.length) {
            return false;
        }

        // Kiểm tra từng phần tử của mảng
        for (let i = 0; i < arr1.length; i++) {
            // So sánh từng phần tử của hai mảng
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }

        // Nếu đã kiểm tra hết tất cả các phần tử và không tìm thấy sự khác biệt, hai mảng giống nhau
        return true;
    };

    const [selectedVariant, setSelectedVariant] = useState([]);
    const [inCart, setInCart] = useState(false);

    useEffect(() => {
        const arr = product.variantData?.map((element) => {
            return null;
        });
        setInCart(
            cartItems.some((cartItem) => {
                if (cartItem._id === product._id) {
                    // check if product have the same id with product in cart
                    if (!product.variantData) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }),
        );
        console.log(cartItems);
        setSelectedVariant(arr);
    }, []);

    useEffect(() => {
        if (selectedVariant?.every((varD) => varD !== null) && selectedVariant.length > 0) {
            const result = cartItems.some((cartItem) => {
                // check if product have the same id with product in cart
                if (cartItem._id === product._id) {
                    // check if product have the same variantData with product in cart
                    if (arraysAreEqual(cartItem.variantData, selectedVariant)) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            });
            console.log(result);
            setInCart(result);
        }
    }, [selectedVariant]);

    useEffect(() => {
        console.log(inCart);
        console.log(user);
    }, [inCart]);

    return (
        <>
            <section className="mt-50 mb-50">
                <div className="container">
                    <div className="row flex-row-reverse">
                        <div className="col-lg-12">
                            <div className="product-detail accordion-detail">
                                <div className="row mb-50">
                                    <div className="col-md-6 col-sm-12 col-xs-12">
                                        <div className="detail-gallery">
                                            <span className="zoom-icon">
                                                <i className="fi-rs-search"></i>
                                            </span>

                                            <div className="product-image-slider">
                                                <ThumbSlider product={product} />
                                            </div>
                                        </div>

                                        <div className="social-icons single-share">
                                            <ul className="text-grey-5 d-inline-block">
                                                <li>
                                                    <strong className="mr-10">Share this:</strong>
                                                </li>
                                                <li className="social-facebook">
                                                    <a href="#">
                                                        <img src="/assets/imgs/theme/icons/icon-facebook.svg" alt="" />
                                                    </a>
                                                </li>
                                                <li className="social-twitter">
                                                    <a href="#">
                                                        <img src="/assets/imgs/theme/icons/icon-twitter.svg" alt="" />
                                                    </a>
                                                </li>
                                                <li className="social-instagram">
                                                    <a href="#">
                                                        <img src="/assets/imgs/theme/icons/icon-instagram.svg" alt="" />
                                                    </a>
                                                </li>
                                                <li className="social-linkedin">
                                                    <a href="#">
                                                        <img src="/assets/imgs/theme/icons/icon-pinterest.svg" alt="" />
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-sm-12 col-xs-12">
                                        <div className="detail-info">
                                            <h2 className="title-detail">{product.name}</h2>
                                            <div className="product-detail-rating">
                                                <div className="pro-details-brand">
                                                    <span>
                                                        Shop:
                                                        <Link href="/products">
                                                            <a>{product.shop.name}</a>
                                                        </Link>
                                                    </span>
                                                </div>
                                                <div className="product-rate-cover text-end">
                                                    <div className="product-rate d-inline-block">
                                                        <div
                                                            className="product-rating"
                                                            style={{
                                                                width: '90%',
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <span className="font-small ml-5 text-muted">(25 reviews)</span>
                                                </div>
                                            </div>
                                            <div className="clearfix product-price-cover">
                                                <div className="product-price primary-color float-left">
                                                    <ins>
                                                        <span className="text-brand">${product.discountPrice}</span>
                                                    </ins>
                                                    <ins>
                                                        <span className="old-price font-md ml-15">${product.price}</span>
                                                    </ins>
                                                    <span className="save-price  font-md color3 ml-15">
                                                        {((product.price - product.discountPrice) / product.price) * 100}% Off
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="bt-1 border-color-1 mt-15 mb-15"></div>
                                            <div className="short-desc mb-30">
                                                <p>{product.desc}</p>
                                            </div>
                                            <div className="product_sort_info font-xs mb-30">
                                                <ul>
                                                    <li className="mb-10">
                                                        <i className="fi-rs-crown mr-5"></i>1 Year AL Jazeera Brand Warranty
                                                    </li>
                                                    <li className="mb-10">
                                                        <i className="fi-rs-refresh mr-5"></i>
                                                        30 Day Return Policy
                                                    </li>
                                                    <li>
                                                        <i className="fi-rs-credit-card mr-5"></i>
                                                        Cash on Delivery available
                                                    </li>
                                                </ul>
                                            </div>
                                            {product.variantData?.map((varD, i) => {
                                                return (
                                                    <div className="attr-detail attr-size mb-2">
                                                        <strong className="mr-10">{varD.name}:</strong>
                                                        <ul className="list-filter size-filter font-small">
                                                            {varD.data?.map((v, j) => {
                                                                return (
                                                                    <li
                                                                        className={
                                                                            selectedVariant.includes(v._id) ? 'active' : ''
                                                                        }
                                                                        onClick={() => {
                                                                            let arr = [...selectedVariant];
                                                                            arr[i] = v._id;
                                                                            setSelectedVariant([...arr]);
                                                                        }}
                                                                    >
                                                                        <a>{v.name}</a>
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    </div>
                                                );
                                            })}

                                            <div className="bt-1 border-color-1 mt-30 mb-30"></div>
                                            <div className="detail-extralink">
                                                <div className="detail-qty border radius">
                                                    <a
                                                        onClick={(e) => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                                                        className="qty-down"
                                                    >
                                                        <i className="fi-rs-angle-small-down"></i>
                                                    </a>
                                                    <span className="qty-val">{quantity}</span>
                                                    <a onClick={() => setQuantity(quantity + 1)} className="qty-up">
                                                        <i className="fi-rs-angle-small-up"></i>
                                                    </a>
                                                </div>
                                                <div className="product-extra-link2">
                                                    <button
                                                        onClick={(e) => {
                                                            if (product.variantData?.length > 0) {
                                                                // have variant data
                                                                if (selectedVariant.every((varD) => varD !== null)) {
                                                                    // have selected variant
                                                                    handleCart({
                                                                        product: product._id,
                                                                        variant:
                                                                            selectedVariant?.length > 0 ? selectedVariant : [],
                                                                        quantity: quantity || 1,
                                                                    });
                                                                } else {
                                                                    toast.error('Please select all variant');
                                                                }
                                                            } else {
                                                                handleCart({
                                                                    product: product._id,
                                                                    variant: selectedVariant?.length > 0 ? selectedVariant : [],
                                                                    quantity: quantity || 1,
                                                                });
                                                            }
                                                        }}
                                                        className="button button-add-to-cart"
                                                    >
                                                        Add to cart
                                                    </button>
                                                    {/* <a
                                                        aria-label="Add To Wishlist"
                                                        className="action-btn hover-up"
                                                        onClick={(e) => handleWishlist(product)}
                                                    >
                                                        <i className="fi-rs-heart"></i>
                                                    </a>
                                                    <a
                                                        aria-label="Compare"
                                                        className="action-btn hover-up"
                                                        onClick={(e) => handleCompare(product)}
                                                    >
                                                        <i className="fi-rs-shuffle"></i>
                                                    </a> */}
                                                </div>
                                            </div>
                                            <ul className="product-meta font-xs color-grey mt-50">
                                                {/* <li className="mb-5">
                                                    SKU:
                                                    <a href="#">FWM15VKT</a>
                                                </li> */}
                                                <li className="mb-5">
                                                    Tags:
                                                    <a href="#" rel="tag" className="me-1">
                                                        Cloth,
                                                    </a>
                                                </li>
                                                <li>
                                                    Availability:
                                                    <span className="in-stock text-success ml-5">
                                                        {product.stock} Items In Stock
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {quickView ? null : (
                                    <>
                                        <ProductTab product={product} />
                                        <div className="row mt-60">
                                            <div className="col-12">
                                                <h3 className="section-title style-1 mb-30">Related products</h3>
                                            </div>
                                            <div className="col-12">
                                                <div className="row related-products position-relative">
                                                    <RelatedSlider />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="banner-img banner-big wow fadeIn f-none animated mt-50">
                                            <img className="border-radius-10" src="/assets/imgs/banner/banner-4.png" alt="" />
                                            <div className="banner-text">
                                                <h4 className="mb-15 mt-40">Repair Services</h4>
                                                <h2 className="fw-600 mb-20">
                                                    We're an Apple <br />
                                                    Authorised Service Provider
                                                </h2>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

const mapStateToProps = (state) => ({
    cartItems: state.cart,
    user: state.user,
});

const mapDispatchToProps = {
    addToCompare,
    addToWishlist,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails);
