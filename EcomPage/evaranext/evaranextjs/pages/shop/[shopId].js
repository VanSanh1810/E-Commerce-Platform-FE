import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import { useEffect, useState } from 'react';
import SizeFilter from '../../components/ecommerce/SizeFilter';
import BrandFilter from '../../components/ecommerce/BrandFilter';
import CategoryProduct from '../../components/ecommerce/CategoryProduct';
import PriceRangeSlider from '../../components/ecommerce/PriceRangeSlider';
import ShowSelect from '../../components/ecommerce/ShowSelect';
import SortSelect from '../../components/ecommerce/SortSelect';
import SingleProduct from '../../components/ecommerce/SingleProduct';
import { fetchProduct } from '../../redux/action/product';
import { connect } from 'react-redux';
import Link from 'next/link';
import QuickView from '../../components/ecommerce/QuickView';
import Pagination from '../../components/ecommerce/Pagination';
import axiosInstance from '../../config/axiosInstance';
import AddressStaticData from '../../public/static/dataprovince';
import { setSelectedConversation } from '../../redux/action/conversation';

function Test({ products, productFilters, fetchProduct, user, setSelectedConversation }) {
    const router = useRouter();
    const {
        query: { shopId },
    } = router;
    // let Router = useRouter(),
    //     searchTerm = Router.query.search,
    //     showLimit = 10,
    //     showPagination = 4;

    const [shopData, setShopData] = useState();
    const [shopProduct, setShopProduct] = useState([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalFolower, setTotalFolower] = useState(0);
    const [averageShopReview, setAverageShopReview] = useState(0);
    const [adName, setAdName] = useState();

    let [pagination, setPagination] = useState([]);
    let [limit, setLimit] = useState(12);
    let [pages, setPages] = useState(Math.ceil(totalProducts / limit));
    let [currentPage, setCurrentPage] = useState(1);

    const [selectedClassify, setSelectedClassify] = useState(null);
    const [sortType, setSortType] = useState('');
    const [sortPrice, setSortPrice] = useState('lowToHigh');

    const [isFollow, setIsFollow] = useState(false);

    const selectClassifyHandler = (value) => {
        setCurrentPage(1);
        setSelectedClassify(value);
    };

    // useEffect(() => {
    //     fetchProduct(searchTerm, '/static/product.json', productFilters);
    //     cratePagination();
    // }, [productFilters, limit, pages, products.items.length]);

    useEffect(() => {
        const fetchShopData = async () => {
            try {
                const result = await axiosInstance.get(`/api/shop/${shopId}`);
                console.log(result.data);
                setShopData(result.data.data.shop);
                setTotalProducts(result.data.data.totalProduct);
                setAverageShopReview(result.data.data.averageShopReview);
                setTotalFolower(result.data.data.totalFollowers);
                setIsFollow(result.data.isFollow ? true : false);
                const addressData = result.data.data.shop.addresses;
                const province = AddressStaticData.treeDataProvince[addressData.address.province].label;
                const district =
                    AddressStaticData.treeDataProvince[addressData.address.province].district[addressData.address.district].label;
                const ward =
                    AddressStaticData.treeDataProvince[addressData.address.province].district[addressData.address.district].ward[
                        addressData.address.ward
                    ].label;
                setAdName({
                    province: province,
                    district: district,
                    ward: ward,
                });
            } catch (err) {
                console.log(err);
            }
        };
        fetchShopData();
    }, [shopId]);

    useEffect(() => {
        const fetchShopProducts = async () => {
            try {
                const result = await axiosInstance.get(
                    `/api/product?shopId=${shopId}&currentPage=${currentPage}&limit=${limit}&classify=${
                        selectedClassify ? selectedClassify : ''
                    }&sortType=${sortType}&sortPrice=${sortPrice}`,
                );
                setShopProduct(result.data.data);
                setPages(Math.ceil(result.data.pages / limit));

                cratePagination(result.data.pages);

                console.log(currentPage, limit, selectedClassify, sortType, sortPrice);
                console.log(result.data.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchShopProducts();
    }, [shopId, currentPage, limit, selectedClassify, sortType, sortPrice]);

    const cratePagination = (_pages) => {
        // set pagination
        let arr = new Array(Math.ceil(_pages / limit)).fill().map((_, idx) => idx + 1);

        setPagination(arr);
        setPages(Math.ceil(_pages / limit));
    };

    // const startIndex = currentPage * limit - limit;
    // const endIndex = startIndex + limit;
    // const getPaginatedProducts = products.items.slice(startIndex, endIndex);

    let start = Math.floor((currentPage - 1) / 4) * 4;
    let end = start + 4;
    const getPaginationGroup = pagination.slice(start, end);

    const next = () => {
        setCurrentPage((page) => page + 1);
    };

    const prev = () => {
        setCurrentPage((page) => page - 1);
    };

    const handleActive = (item) => {
        setCurrentPage(item);
    };

    const selectChange = (e) => {
        setLimit(Number(e.target.value));
        setCurrentPage(1);
    };

    const followShopAction = async () => {
        // shopId
        try {
            const response = await axiosInstance.put(`/api/shop/follow/${shopId}`);
            // if (isFollow) {
            // } else {
            // }
            setIsFollow(!isFollow);
        } catch (e) {
            console.error(e);
        }
    };

    const chatToShopAction = async () => {
        try {
            const response = await axiosInstance.post(`/api/conversation`, {
                targetId: shopId,
                _role: 'vendor',
            });
            console.log(response.data.conversationId);
            setSelectedConversation(response.data.conversationId);
            // if (isFollow) {
            // } else {
            // }
        } catch (e) {
            console.error(e);
        }
    };

    function timeDifference(startDate, endDate) {
        const millisecondsPerSecond = 1000;
        const millisecondsPerMinute = millisecondsPerSecond * 60;
        const millisecondsPerHour = millisecondsPerMinute * 60;
        const millisecondsPerDay = millisecondsPerHour * 24;
        const millisecondsPerMonth = millisecondsPerDay * 30; // Gần đúng, không chính xác vì các tháng có thể có số ngày khác nhau
        const millisecondsPerYear = millisecondsPerDay * 365; // Gần đúng, không chính xác vì mỗi năm có thể có 365 hoặc 366 ngày

        const timeDifference = Math.abs(startDate - endDate);

        if (timeDifference < millisecondsPerMonth) {
            return 'Less than a month';
        } else if (timeDifference < millisecondsPerYear) {
            const monthsDifference = Math.floor(timeDifference / millisecondsPerMonth);
            return `${monthsDifference} month${monthsDifference > 1 ? 's' : ''}`;
        } else {
            const yearsDifference = Math.floor(timeDifference / millisecondsPerYear);
            return `${yearsDifference} year${yearsDifference > 1 ? 's' : ''}`;
        }
    }

    return (
        <>
            <Layout parent="Home" sub="Shop" subChild={shopData?.name}>
                <section className="mt-50 mb-50">
                    <div className="container px-4 py-3 col" style={{ border: '1px solid #d1d1d1', borderRadius: '10px' }}>
                        <div className="row">
                            <div className="col-lg-3 flex">
                                <div className="d-flex flex-row justify-content-start align-items-center flex-grow-1 mb-2">
                                    <img
                                        src={shopData?.avatar.url}
                                        style={{ width: '70px', height: '70px', padding: '0px', borderRadius: '50%' }}
                                        className="me-2"
                                    />
                                    <p className="flex-grow-1">{shopData?.name}</p>
                                </div>
                                <div className="d-flex flex-row justify-content-start align-items-center">
                                    {user ? (
                                        <>
                                            <button className="btn flex-fill" onClick={followShopAction}>
                                                {isFollow ? 'unfollow' : 'follow'}
                                            </button>
                                            <button
                                                style={{ marginLeft: '10px' }}
                                                className="btn flex-fill"
                                                onClick={chatToShopAction}
                                            >
                                                chat
                                            </button>
                                        </>
                                    ) : null}
                                </div>
                            </div>
                            <div className="col-lg-9 ps-4" style={{ borderLeft: '1px solid #d1d1d1' }}>
                                <div className="container">
                                    <div className="row">
                                        <div className="col-sm">
                                            <div className="row gap-4">
                                                <span>Total product : {totalProducts}</span>
                                                <span>Create : {timeDifference(new Date(), shopData?.createDate)}</span>
                                            </div>
                                        </div>
                                        <div className="col-sm">
                                            <div className="row gap-4">
                                                <span>Rating : {averageShopReview}</span>
                                                <span>Follower: {totalFolower}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="mt-50 mb-50">
                    <div className="container">
                        <div className="row flex-row-reverse">
                            <div className="col-lg-3 primary-sidebar sticky-sidebar">
                                <div className="widget-category mb-30">
                                    <h5 className="section-title style-1 mb-30 wow fadeIn animated">Classify</h5>
                                    <ul className="categories">
                                        <li onClick={() => selectClassifyHandler(null)}>
                                            <a>All</a>
                                        </li>
                                        {shopData?.classify.map((classi, index) => {
                                            return (
                                                <li key={index} onClick={() => selectClassifyHandler(classi._id)}>
                                                    <a>{classi.name}</a>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>

                                {/* <div className="sidebar-widget price_range range mb-30">
                                    <div className="widget-header position-relative mb-20 pb-10">
                                        <h5 className="widget-title mb-10">Filter</h5>
                                        <div className="bt-1 border-color-1"></div>
                                    </div>

                                    <div className="price-filter">
                                        <div className="price-filter-inner">
                                            <br />
                                            <PriceRangeSlider updateProductPriceRange={updateProductPriceFilters} />
                                            <br />
                                        </div>
                                    </div>
                                </div> */}

                                {/* <div className="sidebar-widget product-sidebar  mb-30 p-30 bg-grey border-radius-10">
                                    <div className="widget-header position-relative mb-20 pb-10">
                                        <h5 className="widget-title mb-10">New products</h5>
                                        <div className="bt-1 border-color-1"></div>
                                    </div>
                                    <div className="single-post clearfix">
                                        <div className="image">
                                            <img src="/assets/imgs/shop/thumbnail-3.jpg" alt="#" />
                                        </div>
                                        <div className="content pt-10">
                                            <h5>
                                                <a>Chen Cardigan</a>
                                            </h5>
                                            <p className="price mb-0 mt-5">$99.50</p>
                                            <div className="product-rate">
                                                <div className="product-rating" style={{ width: '90%' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="single-post clearfix">
                                        <div className="image">
                                            <img src="/assets/imgs/shop/thumbnail-4.jpg" alt="#" />
                                        </div>
                                        <div className="content pt-10">
                                            <h6>
                                                <a>Chen Sweater</a>
                                            </h6>
                                            <p className="price mb-0 mt-5">$89.50</p>
                                            <div className="product-rate">
                                                <div className="product-rating" style={{ width: '80%' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="single-post clearfix">
                                        <div className="image">
                                            <img src="/assets/imgs/shop/thumbnail-5.jpg" alt="#" />
                                        </div>
                                        <div className="content pt-10">
                                            <h6>
                                                <a>Colorful Jacket</a>
                                            </h6>
                                            <p className="price mb-0 mt-5">$25</p>
                                            <div className="product-rate">
                                                <div className="product-rating" style={{ width: '60%' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                            <div className="col-lg-9">
                                <div className="shop-product-fillter">
                                    <div className="totall-product">
                                        <p>
                                            We found
                                            <strong className="text-brand">{shopProduct?.length}</strong>
                                            items for you!
                                        </p>
                                    </div>
                                    <div className="sort-by-product-area">
                                        <div className="sort-by-cover mr-10">
                                            <ShowSelect selectChange={selectChange} showLimit={limit} />
                                        </div>
                                        <div className="sort-by-cover">
                                            <div className="sort-by-product-wrap">
                                                <div className="sort-by">
                                                    <span>
                                                        <i className="fi-rs-apps-sort"></i>
                                                        Type:
                                                    </span>
                                                </div>
                                                <div className="sort-by-dropdown-wrap custom-select">
                                                    <select onChange={(e) => setSortType(e.target.value)}>
                                                        <option value="">Defaults</option>
                                                        <option value="featured">Featured</option>
                                                        <option value="trending">Trending</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="sort-by-cover ms-2">
                                            <div className="sort-by-product-wrap">
                                                <div className="sort-by">
                                                    <span>
                                                        <i className="fi-rs-apps-sort"></i>
                                                        Sort by:
                                                    </span>
                                                </div>
                                                <div className="sort-by-dropdown-wrap custom-select">
                                                    <select onChange={(e) => setSortPrice(e.target.value)}>
                                                        <option value="lowToHigh">Low To High</option>
                                                        <option value="highToLow">High To Low</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row product-grid-3">
                                    {shopProduct.length === 0 && <h3>No Products Found </h3>}
                                    {shopProduct.map((item, i) => (
                                        <div key={item._id} className="col-lg-4 col-md-4 col-12 col-sm-6">
                                            <SingleProduct product={item} />
                                        </div>
                                    ))}
                                </div>
                                <div className="pagination-area mt-15 mb-sm-5 mb-lg-0">
                                    <nav aria-label="Page navigation example">
                                        <Pagination
                                            getPaginationGroup={getPaginationGroup}
                                            currentPage={currentPage}
                                            pages={pages}
                                            next={next}
                                            prev={prev}
                                            handleActive={handleActive}
                                        />
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <QuickView />
            </Layout>
        </>
    );
}

const mapStateToProps = (state) => ({
    products: state.products,
    productFilters: state.productFilters,
    user: state.user,
});

const mapDidpatchToProps = {
    fetchProduct,
    setSelectedConversation,
};

export default connect(mapStateToProps, mapDidpatchToProps)(Test);
