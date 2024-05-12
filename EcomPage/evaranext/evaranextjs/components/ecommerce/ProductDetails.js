import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { addToCart, decreaseQuantity, increaseQuantity } from '../../redux/action/cart';
import { addToCompare } from '../../redux/action/compareAction';
import { addToWishlist } from '../../redux/action/wishlistAction';
import ProductTab from '../elements/ProductTab';
import RelatedSlider from '../sliders/Related';
import ThumbSlider from '../sliders/Thumb';
import Modal from 'react-responsive-modal';
import axiosInstance from '../../config/axiosInstance';

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

    const [productReportModal, setProductReportModal] = useState();

    const handleCart = (product) => {
        addToCart(product, user);
        toast.success('Add to Cart !');
    };

    const arraysAreEqual = (arr1, arr2) => {
        // Kiểm tra xem độ dài của hai mảng có bằng nhau không

        if (!arr1 || !arr2) {
            if (!arr1 && !arr2) {
                return true;
            }
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
    const [productPrice, setProductPrice] = useState();
    const [producDistPrice, setProductDisPrice] = useState();
    const [productStock, setProductStock] = useState();
    const [priceRange, setPriceRange] = useState();

    const [productVariantDetailTable, setProductVariantDetailTable] = useState([]);

    useEffect(() => {
        const arr = product.variantData?.map((element) => {
            return null;
        });

        // setInCart(
        //     cartItems.some((cartItem) => {
        //         if (cartItem.product === product._id) {
        //             // check if product have the same id with product in cart
        //             if (!product.variantData) {
        //                 return true;
        //             } else {
        //                 return false;
        //             }
        //         } else {
        //             return false;
        //         }
        //     }),
        // );
        console.log(arr);
        setSelectedVariant(arr); // initialize selected variant. [] for product with no variants
        //and array of null values for product with variants (arr length size is product.variantData.length)
    }, []);

    useEffect(() => {
        if (selectedVariant?.every((varD) => varD !== null) && selectedVariant.length > 0) {
            const result = cartItems.some((cartItem) => {
                // check if product have the same id with product in cart
                if (cartItem.product === product._id) {
                    // check if product have the same variantData with product in cart
                    if (arraysAreEqual(cartItem.variant, selectedVariant)) {
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
            ////////////////////////////////
            if (productVariantDetailTable.length > 0) {
                productVariantDetailTable.forEach((obj) => {
                    if (arraysAreEqual(obj.routeMap, selectedVariant)) {
                        setProductPrice(obj.detail.price);
                        setProductDisPrice(obj.detail.disPrice);
                        setProductStock(obj.detail.stock);
                    }
                });
            }
        } else {
            // no select variants
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
                        max =
                            parseFloat(obj.detail.disPrice) !== 0
                                ? parseFloat(obj.detail.disPrice)
                                : parseFloat(obj.detail.price);
                    }
                    if (min) {
                        if (parseFloat(obj.detail.disPrice) !== 0) {
                            min = parseFloat(obj.detail.disPrice) < min ? parseFloat(obj.detail.disPrice) : min;
                        } else {
                            min = parseFloat(obj.detail.price) < min ? parseFloat(obj.detail.price) : min;
                        }
                    } else {
                        min =
                            parseFloat(obj.detail.disPrice) !== 0
                                ? parseFloat(obj.detail.disPrice)
                                : parseFloat(obj.detail.price);
                    }
                });
                setPriceRange(min === max ? `$${min}` : `$${min} - $${max}`);
                setProductStock(totalStock);
            }
        }
    }, [selectedVariant]);

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
            for (let i = 0; i < product.variantDetail.length; i++) {
                initProductVariantDetailTable(product.variantDetail[i], 0, [product.variantDetail[i]._id]);
            }
        };
        if (product.variantDetail) {
            setProductVariantDetailTable([]);
            startInitProductVariantDetailTable();
        }
        console.log(product.variantDetail);
    }, [product, initProductVariantDetailTable]);

    useEffect(() => {
        console.log(productVariantDetailTable);
    }, [productVariantDetailTable]);

    const reportProductActions = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/api/report', {
                reason: e.target.reportReason.value,
                target: productReportModal,
                type: 'Product',
            });
            console.log(response.data);
            setProductReportModal(false);
        } catch (err) {
            console.error(err);
        }
    };

    ////////////////////////////////
    const [voucherData, setVoucherData] = useState();

    useEffect(() => {
        const checkVoucher = async () => {
            try {
                const result = await axiosInstance.get(`api/banner/details/${product.category._id}`);
                console.log(result.data);
                setVoucherData(result.data.voucherData);
            } catch (e) {
                console.error(e);
            }
        };
        checkVoucher();
    }, [product]);

    const calculateVoucherPrice = (price) => {
        // console.log(typeof price);
        if (typeof price === 'number') {
            const discountAmount = (parseFloat(price) / 100) * parseFloat(voucherData.discount);
            if (discountAmount <= parseFloat(voucherData.maxValue)) {
                return parseFloat(price) - discountAmount;
            } else {
                return parseFloat(price) - parseFloat(voucherData.maxValue);
            }
        } else {
            if (typeof price === 'string') {
                const tempArray = price.split(' ');
                let min = tempArray[0];
                let max = tempArray[2];
                if (!max) {
                    max = min;
                }
                console.log('tempArray ', tempArray);
                console.log('min ', min);
                console.log('max ', max);
                min = min.slice(1).trim();
                max = max.slice(1).trim();
                console.log('voucher', voucherData);
                //
                let minStr;
                let maxStr;
                const discountAmountMin = (parseFloat(min.trim()) / 100) * parseFloat(voucherData.discount);
                if (discountAmountMin <= parseFloat(voucherData.maxValue)) {
                    minStr = parseFloat(min.trim()) - discountAmountMin;
                } else {
                    minStr = parseFloat(min.trim()) - parseFloat(voucherData.maxValue);
                }
                //
                const discountAmountMax = (parseFloat(max.trim()) / 100) * parseFloat(voucherData.discount);
                if (discountAmountMax <= parseFloat(voucherData.maxValue)) {
                    maxStr = parseFloat(max.trim()) - discountAmountMax;
                } else {
                    maxStr = parseFloat(max.trim()) - parseFloat(voucherData.maxValue);
                }
                if (maxStr === minStr) {
                    console.log(minStr);
                    return `$${minStr}`;
                }
                console.log(minStr, maxStr);
                return `$${minStr} - $${maxStr}`;
            }
        }
    };

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
                                                        <Link href={`/shop/${product.shop._id}`}>
                                                            <a> {product.shop.name}</a>
                                                        </Link>
                                                    </span>
                                                </div>
                                                <div className="product-rate-cover text-end">
                                                    <div className="product-rate d-inline-block">
                                                        <div
                                                            className="product-rating"
                                                            style={{
                                                                width: ((product.averageRating / 5) * 100).toString() + '%',
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <span className="font-small ml-5 text-muted">
                                                        ({product.totalReviews} reviews)
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="clearfix product-price-cover">
                                                {!product.variantData ? (
                                                    <div className="product-price primary-color float-left">
                                                        <ins>
                                                            <span className="text-brand">
                                                                $
                                                                {!voucherData?.discount
                                                                    ? product.discountPrice !== 0
                                                                        ? product.discountPrice
                                                                        : product.price
                                                                    : calculateVoucherPrice(
                                                                          parseFloat(
                                                                              product.discountPrice !== 0
                                                                                  ? product.discountPrice
                                                                                  : product.price,
                                                                          ),
                                                                          voucherData,
                                                                      )}
                                                            </span>
                                                        </ins>
                                                        {product.discountPrice !== 0 &&
                                                        product.price !== product.discountPrice ? (
                                                            <>
                                                                <ins>
                                                                    <span className="old-price font-md ml-15">
                                                                        ${product.price}
                                                                    </span>
                                                                </ins>
                                                                {/* <span className="save-price font-md color3 ml-15">
                                                                    {((product.price - product.discountPrice) / product.price) *
                                                                        100}
                                                                    % Off
                                                                </span> */}
                                                            </>
                                                        ) : null}
                                                    </div>
                                                ) : selectedVariant.every((varD) => varD !== null) ? (
                                                    <div className="product-price primary-color float-left">
                                                        <ins>
                                                            <span className="text-brand">
                                                                {!voucherData?.discount
                                                                    ? producDistPrice !== 0
                                                                        ? producDistPrice
                                                                        : productPrice
                                                                    : calculateVoucherPrice(
                                                                          parseFloat(
                                                                              producDistPrice !== 0
                                                                                  ? producDistPrice
                                                                                  : productPrice,
                                                                          ),
                                                                          voucherData,
                                                                      )}
                                                            </span>
                                                        </ins>
                                                        {producDistPrice !== 0 && productPrice !== producDistPrice ? (
                                                            <>
                                                                <ins>
                                                                    <span className="old-price font-md ml-15">
                                                                        ${productPrice}
                                                                    </span>
                                                                </ins>
                                                                {/* <span className="save-price  font-md color3 ml-15">
                                                                    {((productPrice - producDistPrice) / productPrice) * 100}% Off
                                                                </span> */}
                                                            </>
                                                        ) : null}
                                                    </div>
                                                ) : (
                                                    <div className="product-price primary-color float-left">
                                                        <ins>
                                                            <span className="text-brand">
                                                                {/* ${priceRange} */}
                                                                {!voucherData?.discount
                                                                    ? priceRange
                                                                    : calculateVoucherPrice(priceRange, voucherData)}
                                                            </span>
                                                        </ins>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="bt-1 border-color-1 mt-15 mb-15"></div>
                                            <div className="short-desc mb-30">
                                                <p>{product.desc}</p>
                                            </div>
                                            <div className="product_sort_info font-xs mb-30">
                                                <ul>
                                                    {/* <li className="mb-10">
                                                        <i className="fi-rs-crown mr-5"></i>1 Year AL Jazeera Brand Warranty
                                                    </li> */}
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
                                                        onClick={(e) => {
                                                            setQuantity(quantity > 1 ? quantity - 1 : 1);
                                                        }}
                                                        className="qty-down"
                                                    >
                                                        <i className="fi-rs-angle-small-down"></i>
                                                    </a>
                                                    <span className="qty-val">{quantity}</span>
                                                    <a
                                                        onClick={() => {
                                                            const stockLeft = product.variantData ? productStock : product.stock;
                                                            if (quantity + 1 <= stockLeft) {
                                                                setQuantity(quantity + 1);
                                                            }
                                                        }}
                                                        className="qty-up"
                                                    >
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
                                                                    if (productStock.stock <= 0) {
                                                                        toast.error('Product out of stock');
                                                                        return;
                                                                    }
                                                                    handleCart({
                                                                        product: product._id,
                                                                        variant:
                                                                            selectedVariant?.length > 0 ? selectedVariant : [],
                                                                        quantity: quantity || 1,
                                                                    });
                                                                } else {
                                                                    toast.error('Please select product variant');
                                                                }
                                                            } else {
                                                                if (product.stock <= 0) {
                                                                    toast.error('Product out of stock');
                                                                    return;
                                                                }
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
                                                </div>
                                            </div>
                                            <ul className="product-meta font-xs color-grey mt-50">
                                                {/* <li className="mb-5">
                                                    SKU:
                                                    <a href="#">FWM15VKT</a>
                                                </li> */}
                                                <li className="mb-5">
                                                    Tags:{' '}
                                                    {product.tag.split(',').map((tag) => {
                                                        return (
                                                            <a href="#" rel="tag" className="me-1">
                                                                {tag}
                                                            </a>
                                                        );
                                                    })}
                                                </li>
                                                <li>
                                                    Availability:
                                                    <span className="in-stock text-success ml-5">
                                                        {product.variantData ? productStock : product.stock} Items In Stock
                                                    </span>
                                                </li>
                                                <a
                                                    style={{ cursor: 'pointer', color: 'red' }}
                                                    onClick={() => {
                                                        setProductReportModal(product._id);
                                                    }}
                                                >
                                                    Product have issues ?
                                                </a>
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
                                                    <RelatedSlider productId={product._id} />
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
            <Modal
                open={productReportModal ? true : false}
                onClose={() => {
                    setProductReportModal(false);
                }}
            >
                <div style={{ width: '400px' }} className="row ps-3">
                    <p>REPORT {productReportModal}</p>
                    <div className="row w-100">
                        <form onSubmit={reportProductActions}>
                            <textarea name="reportReason" className="pb-3" rows={2} placeholder="Reason" />
                            <div className="w-100 col-md-12 d-flex justify-content-end align-items-end">
                                <button type="submit" style={{ backgroundColor: 'green' }} className="btn btn-success mt-2 me-2">
                                    Submit
                                </button>
                                <button
                                    style={{ backgroundColor: 'gray' }}
                                    className="btn btn-secondary mt-2"
                                    onClick={() => {
                                        setProductReportModal(false);
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
