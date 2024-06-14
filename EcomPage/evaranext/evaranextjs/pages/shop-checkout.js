import { connect } from 'react-redux';
import Layout from '../components/layout/Layout';
import {
    clearCart,
    closeCart,
    decreaseQuantity,
    deleteFromCart,
    deleteMultipleFromCart,
    increaseQuantity,
    openCart,
} from '../redux/action/cart';
import { clearCartSelected, setCartSelected } from '../redux/action/cartSelected';
import { useEffect } from 'react';
import { useState } from 'react';
import axiosInstance from '../config/axiosInstance';
import { Badge, Row, Col } from 'react-bootstrap';
import AddressStaticData from '../public/static/dataprovince';
import { debounce, isObject, unset } from 'lodash';
import { toast } from 'react-toastify';
import { redirect } from 'next/dist/server/api-utils';
import { useRouter } from 'next/router';

const ShopCheckoutItems = ({ id, variant, quantity, setShopOrderCheckoutDataList, shopOrderCheckoutDataList, shopId }) => {
    const [productData, setProductData] = useState({});
    const [productSelectedVariant, setProductSelectedVariant] = useState([]);
    const [productTreeDetail, setProductTreeDetail] = useState({});
    const [isProductExist, setIsProductExist] = useState(true);

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
        const fetchProdutData = async () => {
            try {
                const response = await axiosInstance.get(`/api/product/${id}`);
                // console.log(response);
                setProductData(response.data.data); // for name img
                const result = await axiosInstance.get(`api/banner/details/${response.data.data.category._id}`);
                console.log(result.data);
                setVoucherData(result.data.voucherData);
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
        fetchProdutData();
    }, []);

    useEffect(() => {
        if (productTreeDetail.price && productTreeDetail.disPrice) {
            let shopOrderCheckoutDataListClone = [...shopOrderCheckoutDataList];
            shopOrderCheckoutDataListClone[
                shopOrderCheckoutDataListClone.findIndex((i) => i.shopId === shopId)
            ].totalProductPrice += !voucherData?.discount
                ? (productTreeDetail?.disPrice
                      ? productTreeDetail?.disPrice === 0
                          ? productTreeDetail?.price
                          : productTreeDetail?.disPrice
                      : productTreeDetail?.price) * quantity
                : calculateVoucherPrice(
                      parseFloat(
                          (productTreeDetail?.disPrice
                              ? productTreeDetail?.disPrice === 0
                                  ? productTreeDetail?.price
                                  : productTreeDetail?.disPrice
                              : productTreeDetail?.price) * quantity,
                      ),
                  );
            setShopOrderCheckoutDataList([...shopOrderCheckoutDataListClone]);
        }
    }, [productTreeDetail, voucherData]);
    ////////////////////////////////
    const [voucherData, setVoucherData] = useState();

    // useEffect(() => {
    //     const checkVoucher = async () => {
    //         try {
    //             const result = await axiosInstance.get(`api/banner/details/${productData.category._id}`);
    //             console.log(result.data);
    //             setVoucherData(result.data.voucherData);
    //         } catch (e) {
    //             console.error(e);
    //         }
    //     };
    //     if (productData?.category?._id) {
    //         checkVoucher();
    //     }
    // }, [productData]);

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
            {isProductExist ? (
                <tr>
                    <td className="image product-thumbnail">
                        <img src={productData?.images ? productData?.images[0].url : null} />
                    </td>
                    <td className="price" data-title="name">
                        <span>{productData?.name}</span>
                    </td>
                    <td colSpan={2}>
                        <span className="product-qty">
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
                    <td>
                        <span className="product-qty">
                            {!voucherData?.discount
                                ? productTreeDetail?.disPrice
                                    ? productTreeDetail?.disPrice === 0
                                        ? productTreeDetail?.price
                                        : productTreeDetail?.disPrice
                                    : productTreeDetail?.price
                                : calculateVoucherPrice(
                                      parseFloat(
                                          productTreeDetail?.disPrice
                                              ? productTreeDetail?.disPrice === 0
                                                  ? productTreeDetail?.price
                                                  : productTreeDetail?.disPrice
                                              : productTreeDetail?.price,
                                      ),
                                  )}
                            $
                        </span>
                    </td>
                    <td>x{quantity}</td>
                    <td className="price" data-title="subPrice">
                        <span>
                            {!voucherData?.discount
                                ? (productTreeDetail?.disPrice
                                      ? productTreeDetail?.disPrice === 0
                                          ? productTreeDetail?.price
                                          : productTreeDetail?.disPrice
                                      : productTreeDetail?.price) * quantity
                                : calculateVoucherPrice(
                                      parseFloat(
                                          (productTreeDetail?.disPrice
                                              ? productTreeDetail?.disPrice === 0
                                                  ? productTreeDetail?.price
                                                  : productTreeDetail?.disPrice
                                              : productTreeDetail?.price) * quantity,
                                      ),
                                  )}
                            $
                        </span>
                    </td>
                </tr>
            ) : null}
        </>
    );
};

const CartCheckout = ({
    openCart,
    cartItems,
    activeCart,
    closeCart,
    increaseQuantity,
    decreaseQuantity,
    deleteFromCart,
    deleteMultipleFromCart,
    clearCart,
    cartSelected,
    setCartSelected,
    clearCartSelected,
    user,
}) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [sortedCartItems, setSortedCartItems] = useState([]);

    const [shopOrderCheckoutDataList, setShopOrderCheckoutDataList] = useState([]);

    const [useAddressState, setUseAddressState] = useState(user ? true : false); // true : use user address , false: use new address
    const [selectedShippingAddress, setSelectedShippingAddress] = useState();
    const [selectedAddress, setSelectedAddress] = useState([null, null, null]);

    const [paymentMethod, setPaymentMethod] = useState(true); //true: COD, false: VNPAY

    const [currentDistrict, setCurrentDistrict] = useState([]);
    const [currentWard, setCurrentWard] = useState([]);

    const [allUserAddresses, setAllUserAddresses] = useState([]);

    const setSelectAd = (code, location) => {
        let arr = [...selectedAddress];
        let i = location + 1;
        while (i < arr.length) {
            arr[i] = null;
            i = i + 1;
        }
        arr[location] = code;
        // console.log(arr);
        setSelectedAddress([...arr]);
    };

    useEffect(() => {
        setSelectedShippingAddress({});
    }, [useAddressState]);

    useEffect(() => {
        const initCartItemSortByShop = async () => {
            let resultArray = [];
            let shopOrderCheckoutDataListTemp = [];
            if (cartSelected && cartSelected.length > 0) {
                for (let i = 0; i < cartSelected.length; i++) {
                    try {
                        const response = await axiosInstance.get(`/api/product/${cartSelected[i].product}`);
                        const productShop = response.data.data.shop._id;
                        const productShopName = response.data.data.shop.name;
                        const index = await resultArray.findIndex((element) => element.shop._id === productShop);
                        if (index !== -1) {
                            // found
                            resultArray[index].items.push({ ...cartSelected[i] });
                        } else {
                            resultArray.push({
                                shop: { _id: productShop, name: productShopName },
                                items: [{ ...cartSelected[i] }],
                                note: '',
                            });
                            shopOrderCheckoutDataListTemp.push({ shopId: productShop, shippingFee: 0, totalProductPrice: 0 });
                        }
                    } catch (e) {
                        console.error(e);
                    }
                }
            }
            setShopOrderCheckoutDataList([...shopOrderCheckoutDataListTemp]);
            setSortedCartItems([...resultArray]);
        };
        initCartItemSortByShop();
    }, [cartSelected]);

    useEffect(() => {
        const fetchUserAddress = async () => {
            try {
                const result = await axiosInstance.get('/api/address/0');
                console.log(result.data);
                setAllUserAddresses([...result.data.data.addressList]);
                if ([...result.data.data.addressList].length > 0) {
                    setSelectedShippingAddress(result.data.data.addressList[0]._id);
                }
            } catch (e) {
                console.log(e);
            }
        };
        fetchUserAddress();
    }, [user]);

    const removeItemFromCartAfterPlacedOrder = (_items_) => {
        let products = [];
        let variants = [];
        for (let i = 0; i < _items_.length; i++) {
            const shopItems = [..._items_[i].items];
            for (let j = 0; j < shopItems.length; j++) {
                products.push(shopItems[j].product);
                variants.push(shopItems[j].variant);
            }
        }
        deleteMultipleFromCart(products, variants, user);
    };

    const placeOrder = async () => {
        if (useAddressState) {
            // user address
            if (!isObject(selectedShippingAddress)) {
                try {
                    setIsLoading(true);
                    const response = await axiosInstance.post('/api/order/placeOrder', {
                        address: { type: useAddressState, data: selectedShippingAddress },
                        itemData: [...sortedCartItems],
                        paymentMethod: paymentMethod,
                    });
                    console.log(response.data.url);
                    //
                    removeItemFromCartAfterPlacedOrder([...sortedCartItems]);
                    //
                    if (!paymentMethod) {
                        window.location.href = response.data.url;
                    } else {
                        router.push('/page-account');
                    }
                    toast.success('Order placed !');
                } catch (e) {
                    console.log(e);
                    return;
                } finally {
                    setIsLoading(false);
                }
            } else {
                toast.error('Please select a shipping address');
            }
        } else {
            //new address
            const validateNewAddress = (newAddress) => {
                function isValidVietnamesePhoneNumber(phoneNumber) {
                    const regex = /^(?:\+84|84|0)?(3[2-9]|5[6|8|9]|7[0|6|7|8|9]|8[1-9]|9[0-9])\d{7}$/;
                    return regex.test(phoneNumber);
                }
                function isValidGmail(email) {
                    // Biểu thức chính quy kiểm tra định dạng địa chỉ Gmail
                    const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
                    return regex.test(email);
                }
                //
                if (
                    !newAddress.name ||
                    !newAddress.province ||
                    !newAddress.district ||
                    !newAddress.ward ||
                    !newAddress.detail ||
                    !newAddress.phone ||
                    !newAddress.email
                ) {
                    return false;
                }
                if (!isValidVietnamesePhoneNumber(newAddress.phone)) {
                    return false;
                }
                if (!isValidGmail(newAddress.email)) {
                    return false;
                }
                return true;
            };
            if (isObject(selectedShippingAddress) && validateNewAddress(selectedShippingAddress)) {
                try {
                    setIsLoading(true);
                    const response = await axiosInstance.post('/api/order/placeOrder', {
                        address: { type: useAddressState, data: selectedShippingAddress },
                        itemData: [...sortedCartItems],
                        paymentMethod: paymentMethod,
                    });
                    console.log(response.data.url);
                    //
                    removeItemFromCartAfterPlacedOrder([...sortedCartItems]);
                    //
                    if (!paymentMethod) {
                        window.location.href = response.data.url;
                    } else {
                        router.push('/page-account');
                    }
                    toast.success('Order placed !');
                } catch (e) {
                    console.log(e);
                    return;
                } finally {
                    setIsLoading(false);
                }
            } else {
                toast.error('Please provide shipping address');
            }

            console.log(selectedShippingAddress);
            console.log(isObject(selectedShippingAddress));
        }
    };

    const getCurrentDate = () => {
        const currentTime = new Date();

        // Tạo các hàm tiện ích để thêm số 0 vào phía trước nếu cần
        const padZero = (number) => (number < 10 ? '0' + number : number);

        // Lấy các thành phần của ngày tháng
        const year = currentTime.getFullYear();
        const month = padZero(currentTime.getMonth() + 1); // Tháng bắt đầu từ 0
        const day = padZero(currentTime.getDate());
        const hours = padZero(currentTime.getHours());
        const minutes = padZero(currentTime.getMinutes());
        const seconds = padZero(currentTime.getSeconds());

        // Tạo chuỗi theo định dạng yyyyMMddHHmmss
        const formattedDateTime = `${year}${month}${day}${hours}${minutes}${seconds}`;
        return formattedDateTime;
    };

    return (
        <>
            <Layout parent="Home" sub="Shop" subChild="Checkout">
                <section className="mt-50 mb-50">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="mb-25">
                                    <h4>Billing Details</h4>
                                    {user ? (
                                        <div className="custome-checkbox mt-2">
                                            <input
                                                key={useAddressState}
                                                className="form-check-input"
                                                type="checkbox"
                                                name="isNew"
                                                id="TypeAddressCheckbox"
                                                onChange={(e) => {
                                                    setUseAddressState(!useAddressState);
                                                }}
                                                defaultChecked={!useAddressState}
                                            />
                                            <label
                                                style={{ userSelect: 'none' }}
                                                className="form-check-label"
                                                htmlFor="TypeAddressCheckbox"
                                            >
                                                <span>Use new address</span>
                                            </label>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                            {useAddressState ? (
                                <>
                                    <div
                                        className="mb-3"
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'flex-start',
                                            flexDirection: 'row',
                                            overflowX: 'scroll',
                                        }}
                                    >
                                        {allUserAddresses.map((addressData) => {
                                            const province = AddressStaticData.treeDataProvince[addressData.address.province];
                                            const district =
                                                AddressStaticData.treeDataProvince[addressData.address.province].district[
                                                    addressData.address.district
                                                ];
                                            const ward =
                                                AddressStaticData.treeDataProvince[addressData.address.province].district[
                                                    addressData.address.district
                                                ].ward[addressData.address.ward];
                                            return (
                                                <div key={addressData._id} className="col-lg-3 mx-3">
                                                    <div className="card mb-3 mb-lg-0">
                                                        <div
                                                            style={{ justifyContent: 'space-between', padding: '5px 20px' }}
                                                            className="card-header d-flex flex-row align-items-center"
                                                        >
                                                            <h5 className="mb-0">{addressData.name}</h5>
                                                            <input
                                                                id={`radio-${addressData._id}`}
                                                                style={{ width: 'unset', border: 'none' }}
                                                                type="radio"
                                                                onChange={(e) => {
                                                                    setSelectedShippingAddress(addressData._id);
                                                                    allUserAddresses.forEach((a) => {
                                                                        const radioButton = document.getElementById(
                                                                            `radio-${a._id}`,
                                                                        );
                                                                        if (a._id !== addressData._id) {
                                                                            radioButton.checked = false;
                                                                        }
                                                                    });
                                                                }}
                                                                defaultChecked={addressData._id === selectedShippingAddress}
                                                            />
                                                        </div>
                                                        <div className="card-body">
                                                            <address>
                                                                {addressData.phone}
                                                                <br />
                                                                {addressData.address.detail}
                                                                <br />
                                                                {ward.label}
                                                                <br />
                                                                {district.label}
                                                                <br />
                                                                {province.label}
                                                            </address>
                                                            {!addressData.isHome && !addressData.isWork ? null : (
                                                                <Badge bg={addressData.isHome ? 'success' : 'primary'}>
                                                                    {addressData.isHome ? 'Home' : 'Work'}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            ) : (
                                <form method="post" className="mb-3">
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            required=""
                                            name="name"
                                            placeholder="Name *"
                                            onChange={(e) => {
                                                const name = e.target.value;
                                                const temp = { ...selectedShippingAddress };
                                                temp.name = name;
                                                setSelectedShippingAddress({ ...temp });
                                            }}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <select
                                            className="form-control select-active"
                                            type="text"
                                            name="billing_address"
                                            required=""
                                            placeholder="Province *"
                                            onChange={async (e) => {
                                                try {
                                                    const data = JSON.parse(e.target.value);
                                                    setSelectAd(data.value, 0);
                                                    setCurrentDistrict(data.district);
                                                    //
                                                    const province = data.value;
                                                    const temp = { ...selectedShippingAddress };
                                                    temp.province = province;
                                                    setSelectedShippingAddress({ ...temp });
                                                } catch (e) {
                                                    console.error(e);
                                                }
                                            }}
                                        >
                                            <option value="">Select province...</option>
                                            {Object.keys(AddressStaticData.treeDataProvince)?.map((key) => {
                                                return (
                                                    <option
                                                        selected={
                                                            selectedAddress[0] === AddressStaticData.treeDataProvince[key].value
                                                        }
                                                        value={JSON.stringify(AddressStaticData.treeDataProvince[key])}
                                                    >
                                                        {AddressStaticData.treeDataProvince[key].label}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                    {selectedAddress[0] ? (
                                        <div className="form-group">
                                            <select
                                                className="form-control select-active"
                                                type="text"
                                                name="billing_address2"
                                                required=""
                                                placeholder="District *"
                                                onChange={async (e) => {
                                                    try {
                                                        const data = JSON.parse(e.target.value);
                                                        setSelectAd(data.value, 1);
                                                        setCurrentWard(data.ward);
                                                        //
                                                        const district = data.value;
                                                        const temp = { ...selectedShippingAddress };
                                                        temp.district = district;
                                                        setSelectedShippingAddress({ ...temp });
                                                    } catch (e) {
                                                        console.error(e);
                                                    }
                                                }}
                                            >
                                                <option value="">Select district...</option>
                                                {Object.keys(currentDistrict).map((key) => {
                                                    return (
                                                        <option
                                                            selected={selectedAddress[1] === currentDistrict[key].value}
                                                            value={JSON.stringify(currentDistrict[key])}
                                                        >
                                                            {currentDistrict[key].label}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        </div>
                                    ) : null}
                                    {selectedAddress[1] ? (
                                        <div className="form-group">
                                            <select
                                                className="form-control select-active"
                                                type="text"
                                                name="billing_address2"
                                                required=""
                                                placeholder="Ward *"
                                                onChange={async (e) => {
                                                    try {
                                                        const data = JSON.parse(e.target.value);
                                                        setSelectAd(data.value, 2);
                                                        //
                                                        const ward = data.value;
                                                        const temp = { ...selectedShippingAddress };
                                                        temp.ward = ward;
                                                        setSelectedShippingAddress({ ...temp });
                                                    } catch (e) {
                                                        console.error(e);
                                                    }
                                                }}
                                            >
                                                <option value="">Select ward...</option>
                                                {Object.keys(currentWard)?.map((key) => {
                                                    return (
                                                        <option
                                                            selected={selectedAddress[2] === currentWard[key].value}
                                                            value={JSON.stringify(currentWard[key])}
                                                        >
                                                            {currentWard[key].label}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        </div>
                                    ) : null}
                                    <div className="form-group">
                                        <input
                                            required=""
                                            type="text"
                                            name="city"
                                            placeholder="Address detail *"
                                            onChange={(e) => {
                                                const detail = e.target.value;
                                                const temp = { ...selectedShippingAddress };
                                                temp.detail = detail;
                                                setSelectedShippingAddress({ ...temp });
                                            }}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <input
                                            required=""
                                            type="text"
                                            name="phone"
                                            placeholder="Phone *"
                                            onChange={(e) => {
                                                const phone = e.target.value;
                                                const temp = { ...selectedShippingAddress };
                                                temp.phone = phone;
                                                setSelectedShippingAddress({ ...temp });
                                            }}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <input
                                            required=""
                                            type="text"
                                            name="email"
                                            placeholder="Email address *"
                                            onChange={(e) => {
                                                const email = e.target.value;
                                                const temp = { ...selectedShippingAddress };
                                                temp.email = email;
                                                setSelectedShippingAddress({ ...temp });
                                            }}
                                        />
                                    </div>
                                    <div className="custome-checkbox mt-2">
                                        <input
                                            key={selectedShippingAddress?.isHome}
                                            className="form-check-input"
                                            type="checkbox"
                                            name="isHome"
                                            id="HomeCheckbox"
                                            defaultChecked={selectedShippingAddress?.isHome}
                                            onChange={(e) => {
                                                const detail = e.target.checked;
                                                const temp = { ...selectedShippingAddress };
                                                temp.isHome = detail;
                                                if (detail === true) {
                                                    temp.isWork = false;
                                                }
                                                setSelectedShippingAddress({ ...temp });
                                            }}
                                        />
                                        <label style={{ userSelect: 'none' }} className="form-check-label" htmlFor="HomeCheckbox">
                                            <span>Home</span>
                                        </label>
                                    </div>
                                    <div className="custome-checkbox mt-2">
                                        <input
                                            key={selectedShippingAddress?.isWork}
                                            className="form-check-input"
                                            type="checkbox"
                                            name="isWork"
                                            id="WorkCheckbox"
                                            defaultChecked={selectedShippingAddress?.isWork}
                                            onChange={(e) => {
                                                const detail = e.target.checked;
                                                const temp = { ...selectedShippingAddress };
                                                temp.isWork = detail;
                                                if (detail === true) {
                                                    temp.isHome = false;
                                                }
                                                setSelectedShippingAddress({ ...temp });
                                            }}
                                        />
                                        <label style={{ userSelect: 'none' }} className="form-check-label" htmlFor="WorkCheckbox">
                                            <span>Work</span>
                                        </label>
                                    </div>
                                </form>
                            )}
                            {sortedCartItems.map((shop, index) => {
                                return (
                                    <div className="col-md-12">
                                        <div className="order_review">
                                            <div className="mb-20">
                                                <h4>{shop.shop.name}</h4>
                                            </div>
                                            <div className="table-responsive order_table text-center">
                                                <table className={shop.items.length > 0 ? 'table' : 'd-none'}>
                                                    <thead>
                                                        <tr>
                                                            <th colSpan="2">Product</th>
                                                            <th colSpan="2">Variant</th>
                                                            <th>Price</th>
                                                            <th>Quantity</th>
                                                            <th>Total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {shop.items.map((item, i) => (
                                                            <ShopCheckoutItems
                                                                setShopOrderCheckoutDataList={setShopOrderCheckoutDataList}
                                                                shopOrderCheckoutDataList={shopOrderCheckoutDataList}
                                                                shopId={shop.shop._id}
                                                                id={item.product}
                                                                variant={item.variant}
                                                                quantity={item.quantity}
                                                            />
                                                        ))}
                                                        <tr>
                                                            <th colSpan="6">SubTotal</th>
                                                            <td className="product-subtotal">
                                                                $
                                                                {
                                                                    shopOrderCheckoutDataList[
                                                                        shopOrderCheckoutDataList.findIndex(
                                                                            (item) => item.shopId === shop.shop._id,
                                                                        )
                                                                    ].totalProductPrice
                                                                }
                                                            </td>
                                                        </tr>
                                                        <ShippingCostComponent
                                                            key={`${useAddressState}-${index}-${shop.shop._id}`}
                                                            total={
                                                                shopOrderCheckoutDataList[
                                                                    shopOrderCheckoutDataList.findIndex(
                                                                        (item) => item.shopId === shop.shop._id,
                                                                    )
                                                                ].totalProductPrice
                                                            }
                                                            shopId={shop.shop._id}
                                                            userAddress={selectedShippingAddress}
                                                            addressState={useAddressState}
                                                        />
                                                        {/* <tr>
                                                            <th colSpan="6">Shipping</th>
                                                            <td>
                                                                <em>
                                                                    {
                                                                        shopOrderCheckoutDataList[
                                                                            shopOrderCheckoutDataList.findIndex(
                                                                                (item) => item.shopId === shop.shop._id,
                                                                            )
                                                                        ].shippingFee
                                                                    }
                                                                </em>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th colSpan="6">Total</th>
                                                            <td className="product-subtotal">
                                                                <span className="font-xl text-brand fw-900">
                                                                    $
                                                                    {shopOrderCheckoutDataList[
                                                                        shopOrderCheckoutDataList.findIndex(
                                                                            (item) => item.shopId === shop.shop._id,
                                                                        )
                                                                    ].totalProductPrice +
                                                                        shopOrderCheckoutDataList[
                                                                            shopOrderCheckoutDataList.findIndex(
                                                                                (item) => item.shopId === shop.shop._id,
                                                                            )
                                                                        ].shippingFee}
                                                                </span>
                                                            </td>
                                                        </tr> */}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="mb-20">
                                                <h5>Additional information</h5>
                                            </div>
                                            <div className="form-group mb-30">
                                                <textarea
                                                    rows="5"
                                                    placeholder="Order notes"
                                                    onChange={debounce(
                                                        (e) => {
                                                            // console.log(e.target.value);
                                                            const temp = [...sortedCartItems];
                                                            const index = temp.findIndex(
                                                                (item) => item.shop._id === shop.shop._id,
                                                            );
                                                            if (index !== -1) {
                                                                temp[index].note = e.target.value ?? '';
                                                                setSortedCartItems([...temp]);
                                                            }
                                                        },
                                                        [500],
                                                    )}
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="order_review mt-15">
                                    <div className="payment_method">
                                        <div className="mb-25">
                                            <h5>Payment</h5>
                                        </div>
                                        <div className="payment_option">
                                            <div className="custome-radio">
                                                <input
                                                    className="form-check-input"
                                                    required=""
                                                    type="radio"
                                                    name="payment_option"
                                                    id="exampleRadios4"
                                                    defaultChecked={paymentMethod}
                                                    onChange={(e) => {
                                                        setPaymentMethod(true);
                                                    }}
                                                />
                                                <label
                                                    className="form-check-label"
                                                    htmlFor="exampleRadios4"
                                                    data-bs-toggle="collapse"
                                                    data-target="#checkPayment"
                                                    aria-controls="checkPayment"
                                                >
                                                    Cash On Delivery
                                                </label>
                                                <div className="form-group collapse in" id="checkPayment">
                                                    <p className="text-muted mt-5">
                                                        Please send your cheque to Store Name, Store Street, Store Town, Store
                                                        State / County, Store Postcode.{' '}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="custome-radio">
                                                <input
                                                    className="form-check-input"
                                                    required=""
                                                    type="radio"
                                                    name="payment_option"
                                                    id="exampleRadios5"
                                                    defaultChecked={!paymentMethod}
                                                    onChange={(e) => {
                                                        setPaymentMethod(false);
                                                    }}
                                                />
                                                <label
                                                    className="form-check-label"
                                                    htmlFor="exampleRadios5"
                                                    data-bs-toggle="collapse"
                                                    data-target="#paypal"
                                                    aria-controls="paypal"
                                                >
                                                    VNPAY
                                                </label>
                                                <div className="form-group collapse in" id="paypal">
                                                    <p className="text-muted mt-5">
                                                        Pay via PayPal; you can pay with your credit card if you don't have a
                                                        PayPal account.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="btn btn-fill-out btn-block mt-30" onClick={isLoading ? null : placeOrder}>
                                        {isLoading ? 'Processing...' : 'Place Order'}
                                    </button>
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
    cartSelected: state.cartSelected,
    user: state.user,
});

const mapDispatchToProps = {
    closeCart,
    increaseQuantity,
    decreaseQuantity,
    deleteFromCart,
    deleteMultipleFromCart,
    openCart,
    clearCart,
    setCartSelected,
    clearCartSelected,
};

export default connect(mapStateToProps, mapDispatchToProps)(CartCheckout);

const ShippingCostComponent = ({ shopId, userAddress, total, addressState }) => {
    const [shipCost, setShipCost] = useState();
    useEffect(() => {
        const calculateShipCost = async () => {
            try {
                const response = await axiosInstance.post('/api/shipCost/calculateShipCost', {
                    shopId: shopId,
                    addressState: addressState,
                    userAddress: userAddress,
                });
                setShipCost(response.data.shipCost);
            } catch (err) {
                console.error(err);
            }
        };
        if ((userAddress.province && !addressState) || (addressState && userAddress)) {
            setShipCost();
            calculateShipCost();
        }
    }, [shopId, userAddress, addressState]);
    //
    const fixTotalCost = (_shipCost, _total) => {
        const temp = _shipCost + _total;
        return temp.toFixed(2);
    };

    return (
        <>
            <tr>
                <th colSpan="6">Shipping</th>
                <td>
                    <em>{shipCost ? `$${shipCost}` : 'Please select your address'}</em>
                </td>
            </tr>
            <tr>
                <th colSpan="6">Total</th>
                <td className="product-subtotal">
                    <span className="font-xl text-brand fw-900">${shipCost ? fixTotalCost(shipCost, total) : total}</span>
                </td>
            </tr>
        </>
    );
};
