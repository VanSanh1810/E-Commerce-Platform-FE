import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { addToCart } from '../../redux/action/cart';
import { addToCompare } from '../../redux/action/compareAction';
import { openQuickView } from '../../redux/action/quickViewAction';
import { addToWishlist } from '../../redux/action/wishlistAction';
import Loader from './../elements/Loader';
import axiosInstance from '../../config/axiosInstance';

const SingleProduct = ({ product, addToCart, addToCompare, addToWishlist, openQuickView, user }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [productVariantDetailTable, setProductVariantDetailTable] = useState([]);
    const [productPrice, setProductPrice] = useState();
    const [productDiscount, setProductDiscount] = useState();

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);
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
        } else {
            const temp = ((parseFloat(product.price) - parseFloat(product.discountPrice)) / parseFloat(product.price)) * 100;
            setProductDiscount(Math.round(temp));
        }
    }, [product, initProductVariantDetailTable]);

    useEffect(() => {
        const getShowPrice = () => {
            let max = null;
            let min = null;
            let totalStock = 0;

            // Duyệt qua mỗi object trong danh sách và cộng giá trị quantity lại
            productVariantDetailTable.forEach((obj) => {
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
            setProductPrice(min === max ? `$${min}` : `$${min} - $${max}`);
        };
        // console.log(productVariantDetailTable);
        // console.log(product.name);
        if (productVariantDetailTable.length > 0) {
            getShowPrice();
        }
    }, [productVariantDetailTable]);

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

    const handleCart = (product) => {
        if (!product.variantData) {
            addToCart({ product: product._id, variant: [], quantity: 1 }, user);
            toast.success('Add to Cart !');
        } else {
            router.push(`/products/${product._id}`);
        }
    };

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
            {!loading ? (
                <>
                    <div className="product-cart-wrap mb-30 d-flex flex-column">
                        <div className="product-img-action-wrap">
                            <div className="product-img product-img-zoom">
                                <Link href="/products/[slug]" as={`/products/${product._id}`}>
                                    <a>
                                        <img
                                            className="default-img"
                                            src={product.images[0]?.url}
                                            style={{ height: '18vw', width: '18vw', objectFit: 'contain' }}
                                            alt=""
                                        />
                                        {/* {product.images[1]?.url ? (
                                            <img className="hover-img" src={product.images[1]?.url} alt="" />
                                        ) : null} */}
                                    </a>
                                </Link>
                            </div>
                            <div className="product-action-1">
                                <a
                                    aria-label="Quick view"
                                    className="action-btn hover-up"
                                    data-bs-toggle="modal"
                                    onClick={(e) => openQuickView(product)}
                                >
                                    <i className="fi-rs-eye"></i>
                                </a>
                            </div>
                            <div className="product-badges product-badges-position product-badges-mrg">
                                {voucherData?.discount ? <span className="hot">Event: {voucherData?.discount}%</span> : null}
                                {/* {product.created ? <span className="new">New</span> : null}
                                {product.totalSell > 100 ? <span className="best">Best Sell</span> : null} */}
                                {productDiscount ? <span className="sale">Sale {productDiscount}%</span> : null}
                                {/* {product.discount.percentage >= 5 ? (
                                    <span className="hot">{product.discount.percentage}%</span>
                                ) : null} */}
                            </div>
                        </div>
                        <div className="product-content-wrap">
                            <h2>
                                <Link href="/products/[slug]" as={`/products/${product._id}`}>
                                    <a
                                        style={{
                                            display: '-webkit-box',
                                            WebkitLineClamp: '1',
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}
                                    >
                                        {product.name}
                                    </a>
                                </Link>
                            </h2>
                            {/* <div className="rating-result" title="90%">
                                <span>
                                    <span>{product.averageRating}</span>
                                </span>
                            </div> */}
                            <div className="product-rate d-inline-block">
                                <div
                                    className="product-rating"
                                    style={{
                                        width: ((product.averageRating / 5) * 100).toString() + '%',
                                    }}
                                ></div>
                            </div>
                            <div className="product-price">
                                {!product.variantData ? (
                                    <>
                                        <span>
                                            $
                                            {!voucherData?.discount
                                                ? product.discountPrice !== 0
                                                    ? product.discountPrice
                                                    : product.price
                                                : calculateVoucherPrice(
                                                      parseFloat(
                                                          product.discountPrice !== 0 ? product.discountPrice : product.price,
                                                      ),
                                                      voucherData,
                                                  )}
                                        </span>
                                        {/* <span>${product.discountPrice !== 0 ? product.discountPrice : product.price}</span> */}
                                        {product.discountPrice !== 0 && product.price !== product.discountPrice ? (
                                            <span className="old-price">
                                                {product.discountPrice ? `$ ${product.price}` : null}
                                            </span>
                                        ) : null}
                                    </>
                                ) : (
                                    <span>
                                        {!voucherData?.discount ? productPrice : calculateVoucherPrice(productPrice, voucherData)}
                                    </span>
                                )}
                            </div>
                            <div className="product-action-1 show">
                                <a aria-label="Add To Cart" className="action-btn hover-up" onClick={(e) => handleCart(product)}>
                                    <i className="fi-rs-shopping-bag-add"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <Loader />
            )}
        </>
    );
};

const mapDispatchToProps = {
    addToCart,
    addToCompare,
    addToWishlist,
    openQuickView,
};

const mapStateToProps = (state) => ({
    user: state.user,
});

export default connect(mapStateToProps, mapDispatchToProps)(SingleProduct);
