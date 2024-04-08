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

const SingleProduct = ({ product, addToCart, addToCompare, addToWishlist, openQuickView, user }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [productVariantDetailTable, setProductVariantDetailTable] = useState([]);
    const [productPrice, setProductPrice] = useState();

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 2000);
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
            setProductPrice(min === max ? `${min}` : `${min} - $${max}`);
        };
        // console.log(productVariantDetailTable);
        // console.log(product.name);
        if (productVariantDetailTable.length > 0) {
            getShowPrice();
        }
    }, [productVariantDetailTable]);

    const handleCart = (product) => {
        if (!product.variantData) {
            addToCart({ product: product._id, variant: [], quantity: 1 }, user);
            toast.success('Add to Cart !');
        } else {
            router.push(`/products/${product._id}`);
        }
    };

    const handleCompare = (product) => {
        addToCompare(product);
        toast.success('Add to Compare !');
    };

    const handleWishlist = (product) => {
        addToWishlist(product);
        toast.success('Add to Wishlist !');
    };
    return (
        <>
            {!loading ? (
                <>
                    <div className="product-cart-wrap mb-30">
                        <div className="product-img-action-wrap">
                            <div className="product-img product-img-zoom">
                                <Link href="/products/[slug]" as={`/products/${product._id}`}>
                                    <a>
                                        <img className="default-img" src={product.images[0]?.url} alt="" />
                                        {/* <img
                                    className="hover-img"
                                    src={product.images[1]?.img}
                                    alt=""
                                /> */}
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
                                {/* <a
                                    aria-label="Add To Wishlist"
                                    className="action-btn hover-up"
                                    onClick={(e) => handleWishlist(product)}
                                >
                                    <i className="fi-rs-heart"></i>
                                </a>
                                <a aria-label="Compare" className="action-btn hover-up" onClick={(e) => handleCompare(product)}>
                                    <i className="fi-rs-shuffle"></i>
                                </a> */}
                            </div>

                            <div className="product-badges product-badges-position product-badges-mrg">
                                {/* {product.trending ? <span className="hot">Hot</span>:null } */}
                                {/* {product.created ? <span className="new">New</span>:null }
                        {product.totalSell > 100 ? <span className="best">Best Sell</span>:null }
                        {product.discount.isActive ? <span className="sale">Sale</span>:null } */}
                                {/* {product.discount.percentage >= 5 ? <span className="hot">{product.discount.percentage}%</span>:null } */}
                            </div>
                        </div>
                        <div className="product-content-wrap">
                            {/* <div className="product-category">
                                <Link href="/products">
                                    <a>{product.brand}</a>
                                </Link>
                            </div> */}
                            <h2>
                                <Link href="/products/[slug]" as={`/products/${product._id}`}>
                                    <a>{product.name}</a>
                                </Link>
                            </h2>
                            <div className="rating-result" title="90%">
                                <span>
                                    <span>{product.ratingScore}%</span>
                                </span>
                            </div>
                            <div className="product-price">
                                {!product.variantData ? (
                                    <>
                                        <span>${product.discountPrice !== 0 ? product.discountPrice : product.price} </span>
                                        {product.discountPrice !== 0 && product.price !== product.discountPrice ? (
                                            <span className="old-price">
                                                {product.discountPrice ? `$ ${product.price}` : null}
                                            </span>
                                        ) : null}
                                    </>
                                ) : (
                                    <span>${productPrice} </span>
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
