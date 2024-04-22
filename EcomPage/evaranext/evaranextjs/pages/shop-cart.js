import { connect } from 'react-redux';
import Layout from '../components/layout/Layout';
import debounce from 'lodash.debounce';
import Link from 'next/link';
import { clearCart, closeCart, decreaseQuantity, deleteFromCart, increaseQuantity, openCart } from '../redux/action/cart';
import { useEffect } from 'react';
import axiosInstance from '../config/axiosInstance';
import { useState } from 'react';
import { Badge, Row, Col } from 'react-bootstrap';
import { useRef } from 'react';
import { useCallback } from 'react';
import cartSelected from '../redux/reducer/cartSelected';
import { clearCartSelected, setCartSelected } from '../redux/action/cartSelected';
import { toast } from 'react-toastify';

const CartItemData = ({ id, variant, quantity, children, selectedIndexWithPrice, setSelectedIndexWithPrice }) => {
    const [productData, setProductData] = useState({});
    const [productSelectedVariant, setProductSelectedVariant] = useState([]);
    const [productTreeDetail, setProductTreeDetail] = useState({});
    const [isProductExist, setIsProductExist] = useState(true);

    const inputCheckbox = useRef();

    useEffect(() => {
        const accessVariantDetail = (node, indexArr, depth) => {
            let isFound = false;
            if (depth === indexArr.length - 1) {
                //found node
                setProductTreeDetail({ ...node.detail });
                return true;
            } else {
                //not found
                for (const child of node.child) {
                    if (child._id === indexArr[depth + 1]) {
                        isFound = accessVariantDetail(child, indexArr, depth + 1);
                        break;
                    }
                }
                return isFound;
            }
        };
        const initSelectedVariant = async (variantData, selectedVariant) => {
            if (!variantData || !selectedVariant) {
                if ((!variantData || variantData.length === 0) && (!selectedVariant || selectedVariant.length === 0)) {
                    return;
                }
                setIsProductExist(false);
                return;
            }
            const result = variantData.map((v, index) => {
                const i = v.data.findIndex((vData) => vData._id === selectedVariant[index]);
                if (i !== -1) {
                    return v.data[i].name;
                } else {
                    setIsProductExist(false);
                }
            });
            setProductSelectedVariant([...result]);
        };
        const fetchProductData = async () => {
            try {
                const response = await axiosInstance.get(`/api/product/${id}`);
                // console.log(response);
                setProductData(response.data.data); // for name img
                //
                initSelectedVariant(response.data.data.variantData, variant); // for selected variant name if exists
                //
                if (variant.length > 0) {
                    for (const v of response.data.data.variantDetail) {
                        if (v._id === variant[0]) {
                            accessVariantDetail(v, variant, 0);
                            break;
                        }
                    }
                } else {
                    setProductTreeDetail({
                        price: response.data.data.price,
                        disPrice: response.data.data.discountPrice,
                        stock: response.data.data.stock,
                    });
                }
                // setPrice(response.data.data);
            } catch (err) {
                console.log(err);
                setIsProductExist(false);
            }
        };
        fetchProductData();
        // console.log(id);
        // console.log(variant);
    }, []);

    useEffect(() => {
        if (inputCheckbox) {
            const indexToRemove = selectedIndexWithPrice.findIndex((item) => item.proIndex === id + variant.join());
            if (indexToRemove !== -1) {
                const tempArr = [...selectedIndexWithPrice];
                tempArr.splice(indexToRemove, 1);
                setSelectedIndexWithPrice([
                    ...tempArr,
                    {
                        proIndex: id + variant.join(),
                        price:
                            (productTreeDetail?.disPrice
                                ? productTreeDetail?.disPrice === 0
                                    ? productTreeDetail?.price
                                    : productTreeDetail?.disPrice
                                : productTreeDetail?.price) * quantity,
                    },
                ]);
            }
        }
    }, [quantity]);
    return (
        <>
            {isProductExist ? (
                <>
                    <td>
                        {productTreeDetail.stock > 0 ? (
                            <input
                                ref={inputCheckbox}
                                id={id + variant.join()}
                                style={{ fontSize: '12px', height: 'unset' }}
                                type="checkbox"
                                onChange={(e) => {
                                    if (e.currentTarget.checked) {
                                        if (!selectedIndexWithPrice.find((element) => element.proIndex === id + variant.join())) {
                                            setSelectedIndexWithPrice([
                                                ...selectedIndexWithPrice,
                                                {
                                                    proIndex: id + variant.join(),
                                                    _id: id,
                                                    variant: variant,
                                                    quantity: quantity,
                                                    price:
                                                        (productTreeDetail?.disPrice
                                                            ? productTreeDetail?.disPrice === 0
                                                                ? productTreeDetail?.price
                                                                : productTreeDetail?.disPrice
                                                            : productTreeDetail?.price) * quantity,
                                                },
                                            ]);
                                        }
                                    } else {
                                        const indexToRemove = selectedIndexWithPrice.findIndex(
                                            (item) => item.proIndex === id + variant.join(),
                                        );
                                        if (indexToRemove !== -1) {
                                            const tempArr = [...selectedIndexWithPrice];
                                            tempArr.splice(indexToRemove, 1);
                                            setSelectedIndexWithPrice([...tempArr]);
                                        }
                                    }
                                }}
                                defaultChecked={selectedIndexWithPrice.find(
                                    (element) => element.proIndex === id + variant.join(),
                                )}
                            />
                        ) : (
                            <p>Out of stock</p>
                        )}
                    </td>
                    <td className="image product-thumbnail">
                        <img src={productData?.images ? productData?.images[0].url : null} />
                    </td>
                    <td className="price" data-title="name">
                        <span>{productData?.name}</span>
                    </td>
                    <td className="price" data-title="variant">
                        <span>
                            {productSelectedVariant?.length > 0
                                ? productSelectedVariant.map((v) => {
                                      return (
                                          <Badge bg="secondary" className="me-1">
                                              {v}
                                          </Badge>
                                      );
                                  })
                                : 'No variant'}
                        </span>
                    </td>
                    <td className="price" data-title="price">
                        <span>
                            {productTreeDetail?.disPrice
                                ? productTreeDetail?.disPrice === 0
                                    ? productTreeDetail?.price
                                    : productTreeDetail?.disPrice
                                : productTreeDetail?.price}
                            $
                        </span>
                    </td>
                    {children}
                    <td className="price" data-title="subPrice">
                        <span>
                            {(productTreeDetail?.disPrice
                                ? productTreeDetail?.disPrice === 0
                                    ? productTreeDetail?.price
                                    : productTreeDetail?.disPrice
                                : productTreeDetail?.price) * quantity}
                            $
                        </span>
                    </td>
                </>
            ) : (
                <td colSpan={6} className="price" data-title="Price">
                    <span>Product Not Available</span>
                </td>
            )}
        </>
    );
};

const Cart = ({
    openCart,
    cartItems,
    activeCart,
    closeCart,
    increaseQuantity,
    decreaseQuantity,
    deleteFromCart,
    clearCart,
    user,
    cartSelected,
    setCartSelected,
    clearCartSelected,
}) => {
    const [selectedIndexWithPrice, setSelectedIndexWithPrice] = useState([]);
    const [totalSelectedProductPrice, settotalSelectedProductPrice] = useState(0);

    const [sortedCartItems, setSortedCartItems] = useState([]);

    const isAllInShop = (shopId) => {
        if (sortedCartItems.length > 0) {
            const index = sortedCartItems.findIndex((x) => x.shop._id === shopId);
            if (index === -1) {
                return false;
            }
            for (let i = 0; i < sortedCartItems[index].items.length; i++) {
                // console.log(sortedCartItems[index].items[i].product + sortedCartItems[index].items[i].variant.join());
                const inputDom = document.getElementById(
                    sortedCartItems[index].items[i].product + sortedCartItems[index].items[i].variant.join(),
                );
                if (!inputDom?.checked) {
                    return false;
                }
            }
            return true;
        }
    };

    useEffect(() => {
        let totalPrice = 0;
        selectedIndexWithPrice.forEach((item, index) => {
            totalPrice += item.price;
        });
        settotalSelectedProductPrice(totalPrice);
    }, [selectedIndexWithPrice, cartItems]);

    useEffect(() => {
        // clearCartSelected();
        let tempArray = [];
        for (let i = 0; i < selectedIndexWithPrice.length; i++) {
            tempArray.push({
                product: selectedIndexWithPrice[i]._id,
                variant: selectedIndexWithPrice[i].variant,
                quantity: selectedIndexWithPrice[i].quantity,
            });
        }
        console.log(tempArray);
        setCartSelected([...tempArray]);
    }, [selectedIndexWithPrice]);

    useEffect(() => {
        console.log(cartSelected);
    }, [cartSelected]);

    useEffect(() => {
        const initCartItemSortByShop = async () => {
            let resultArray = [];
            if (cartItems && cartItems.length > 0) {
                for (let i = 0; i < cartItems.length; i++) {
                    try {
                        const response = await axiosInstance.get(`/api/product/${cartItems[i].product}`);
                        const productShop = response.data.data.shop._id;
                        const productShopName = response.data.data.shop.name;
                        const index = await resultArray.findIndex((element) => element.shop._id === productShop);
                        if (index !== -1) {
                            // found
                            resultArray[index].items.push({ ...cartItems[i] });
                        } else {
                            resultArray.push({ shop: { _id: productShop, name: productShopName }, items: [{ ...cartItems[i] }] });
                        }
                    } catch (e) {
                        console.error(e);
                    }
                }
            }
            setSortedCartItems([...resultArray]);
        };
        initCartItemSortByShop();
    }, [cartItems]);

    return (
        <>
            <Layout parent="Home" sub="User" subChild="Cart">
                <section className="mt-50 mb-50">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="table-responsive">
                                    {cartItems.length <= 0 && 'No Products'}
                                    <table
                                        className={cartItems.length > 0 ? 'table shopping-summery text-center clean' : 'd-none'}
                                    >
                                        <thead>
                                            <tr className="main-heading">
                                                <th scope="col">
                                                    <input
                                                        key={selectedIndexWithPrice}
                                                        style={{ fontSize: '12px', height: 'unset' }}
                                                        type="checkbox"
                                                        onChange={(e) => {
                                                            cartItems.forEach(async (item) => {
                                                                const domCheckBoxNode = await document.getElementById(
                                                                    item.product + item.variant.join(),
                                                                );
                                                                if (domCheckBoxNode.checked !== e.target.checked) {
                                                                    await domCheckBoxNode.click();
                                                                }
                                                            });
                                                        }}
                                                        defaultChecked={
                                                            selectedIndexWithPrice.length === cartItems.length ? true : false
                                                        }
                                                    />{' '}
                                                    Select All
                                                </th>
                                                <th scope="col">Image</th>
                                                <th scope="col">Name</th>
                                                <th scope="col">Variant</th>
                                                <th scope="col">Price</th>
                                                <th scope="col">Quantity</th>
                                                <th scope="col">Subtotal</th>
                                                <th scope="col">Remove</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sortedCartItems.map((shop, index) => {
                                                return (
                                                    <>
                                                        <tr style={null} key={selectedIndexWithPrice}>
                                                            <td>
                                                                <input
                                                                    style={{ fontSize: '12px', height: 'unset' }}
                                                                    type="checkbox"
                                                                    onChange={(e) => {
                                                                        shop.items.forEach(async (item) => {
                                                                            const domCheckBoxNode = await document.getElementById(
                                                                                item.product + item.variant.join(),
                                                                            );
                                                                            if (domCheckBoxNode.checked !== e.target.checked) {
                                                                                await domCheckBoxNode.click();
                                                                            }
                                                                        });
                                                                    }}
                                                                    defaultChecked={
                                                                        selectedIndexWithPrice.length > 0
                                                                            ? isAllInShop(shop.shop._id)
                                                                            : isAllInShop(shop.shop._id)
                                                                    }
                                                                />
                                                            </td>
                                                            <td colSpan={7} style={{ textAlign: 'start' }}>
                                                                <a href={`/shop/${shop.shop._id}`}>{shop.shop.name}</a>
                                                            </td>
                                                        </tr>
                                                        {shop.items?.map((item, i) => (
                                                            <tr key={item.product}>
                                                                <CartItemData
                                                                    id={item.product}
                                                                    variant={item.variant}
                                                                    quantity={item.quantity ? item.quantity : 0}
                                                                    selectedIndexWithPrice={selectedIndexWithPrice}
                                                                    setSelectedIndexWithPrice={setSelectedIndexWithPrice}
                                                                >
                                                                    <td className="price" data-title="Price">
                                                                        <input
                                                                            key={`quantity-${item.product}`}
                                                                            type="number"
                                                                            defaultValue={item.quantity ? item.quantity : 0}
                                                                            onChange={debounce((e) => {
                                                                                if (e.target.value) {
                                                                                    const gap = e.target.value - item.quantity;
                                                                                    console.log(gap);
                                                                                    if (gap > 0) {
                                                                                        // increase quantity
                                                                                        increaseQuantity(
                                                                                            item.product,
                                                                                            item.variant,
                                                                                            gap,
                                                                                            user,
                                                                                        );
                                                                                    }
                                                                                    if (gap < 0) {
                                                                                        // decrease quantity
                                                                                        decreaseQuantity(
                                                                                            item.product,
                                                                                            item.variant,
                                                                                            gap,
                                                                                            user,
                                                                                        );
                                                                                    } else {
                                                                                        //no change
                                                                                    }
                                                                                }
                                                                            }, 200)}
                                                                        />
                                                                    </td>
                                                                </CartItemData>
                                                                <td className="action" data-title="Remove">
                                                                    <a
                                                                        onClick={(e) =>
                                                                            deleteFromCart(item.product, item.variant, user)
                                                                        }
                                                                        className="text-muted"
                                                                    >
                                                                        <i className="fi-rs-trash"></i>
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </>
                                                );
                                            })}
                                            <tr>
                                                <td colSpan="8" className="text-end">
                                                    {cartItems.length > 0 && (
                                                        <a onClick={() => clearCart(user)} className="text-muted">
                                                            <i className="fi-rs-cross-small"></i>
                                                            Clear Cart
                                                        </a>
                                                    )}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="cart-action text-end">
                                    <a className="btn " href="/">
                                        <i className="fi-rs-shopping-bag mr-10"></i>
                                        Continue Shopping
                                    </a>
                                </div>
                                <div className="divider center_icon mt-50 mb-50">
                                    <i className="fi-rs-fingerprint"></i>
                                </div>
                                <div className="row mb-50">
                                    {/* <div className="col-lg-6 col-md-12">
                                        <div className="mb-30 mt-50">
                                            <div className="heading_s1 mb-3">
                                                <h4>Apply Coupon</h4>
                                            </div>
                                            <div className="total-amount">
                                                <div className="left">
                                                    <div className="coupon">
                                                        <form action="#" target="_blank">
                                                            <div className="form-row row justify-content-center">
                                                                <div className="form-group col-lg-6">
                                                                    <input
                                                                        className="font-medium"
                                                                        name="Coupon"
                                                                        placeholder="Enter Your Coupon"
                                                                    />
                                                                </div>
                                                                <div className="form-group col-lg-6">
                                                                    <button className="btn  btn-sm">
                                                                        <i className="fi-rs-label mr-10"></i>
                                                                        Apply
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}
                                    <div className="col-lg-12 col-md-12">
                                        <div className="border p-md-4 p-30 border-radius cart-totals">
                                            <div className="heading_s1 mb-3">
                                                <h4>Cart Totals</h4>
                                            </div>
                                            <div className="table-responsive">
                                                <table className="table">
                                                    <tbody>
                                                        {/* <tr>
                                                            <td className="cart_total_label">Cart Subtotal</td>
                                                            <td className="cart_total_amount">
                                                                <span className="font-lg fw-900 text-brand">
                                                                    $ {totalSelectedProductPrice}
                                                                </span>
                                                            </td>
                                                        </tr> */}
                                                        {/* <tr>
                                                            <td className="cart_total_label">Shipping</td>
                                                            <td className="cart_total_amount">
                                                                <i className="ti-gift mr-5"></i>
                                                                Free Shipping
                                                            </td>
                                                        </tr> */}
                                                        <tr>
                                                            <td className="cart_total_label">Total</td>
                                                            <td className="cart_total_amount">
                                                                <strong>
                                                                    <span className="font-xl fw-900 text-brand">
                                                                        ${totalSelectedProductPrice}
                                                                    </span>
                                                                </strong>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <Link href="/shop-checkout">
                                                <a
                                                    href="/shop-checkout"
                                                    className="btn"
                                                    onClick={(e) => {
                                                        if (cartSelected?.length === 0) {
                                                            e.preventDefault();
                                                            toast.error('Please select products to process checkout');
                                                        }
                                                    }}
                                                >
                                                    <i className="fi-rs-box-alt mr-10"></i>
                                                    Proceed To CheckOut
                                                </a>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </Layout>
        </>
    );
};

const mapStateToProps = (state) => ({
    cartItems: state.cart,
    activeCart: state.counter,
    user: state.user,
    cartSelected: state.cartSelected,
});

const mapDispatchToProps = {
    closeCart,
    increaseQuantity,
    decreaseQuantity,
    deleteFromCart,
    openCart,
    clearCart,
    setCartSelected,
    clearCartSelected,
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
