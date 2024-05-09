import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import BrandFilter from '../../components/ecommerce/BrandFilter';
import CategoryProduct from '../../components/ecommerce/CategoryProduct';
import CompareModal from '../../components/ecommerce/CompareModal';
import Pagination from '../../components/ecommerce/Pagination';
import PriceRangeSlider from '../../components/ecommerce/PriceRangeSlider';
import QuickView from '../../components/ecommerce/QuickView';
import ShowSelect from '../../components/ecommerce/ShowSelect';
import SingleProduct from '../../components/ecommerce/SingleProduct';
import SizeFilter from '../../components/ecommerce/SizeFilter';
import SortSelect from '../../components/ecommerce/SortSelect';
import WishlistModal from '../../components/ecommerce/WishlistModal';
import Layout from '../../components/layout/Layout';
import { fetchProduct } from '../../redux/action/product';
import Link from 'next/link';
import axiosInstance from '../../config/axiosInstance';

const Products = ({}) => {
    // console.log(products);
    const [totalProducts, setTotalProducts] = useState(0);
    const [products, setProducts] = useState([]);

    const [pagination, setPagination] = useState([]);
    const [limit, setLimit] = useState(12);
    const [pages, setPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const [selectedClassify, setSelectedClassify] = useState(null);
    const [sortType, setSortType] = useState('');
    const [sortPrice, setSortPrice] = useState('lowToHigh');

    let Router = useRouter();
    let searchTerm = Router.query.search;
    let cate = Router.query.category;
    //     showLimit = 12,
    //     showPagination = 4;

    // let [pagination, setPagination] = useState([]);
    // let [limit, setLimit] = useState(showLimit);
    // let [pages, setPages] = useState(Math.ceil(products.items.length / limit));
    // let [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        // fetchProduct(searchTerm, '/static/product.json', productFilters);
        // cratePagination();
        console.log(searchTerm);
        const fetchProducts = async () => {
            console.log(currentPage, limit, selectedClassify, sortType, sortPrice);
            try {
                const result = await axiosInstance.get(
                    `/api/product?currentPage=${currentPage}&limit=${limit}&classify=${
                        selectedClassify ? selectedClassify : ''
                    }&sortType=${sortType}&sortPrice=${sortPrice}&searchText=${searchTerm ? searchTerm : ''}&category=${
                        cate ? cate : ''
                    }`,
                );
                setProducts(result.data.data);
                cratePagination(result.data.pages);
                // console.log(currentPage, limit, selectedClassify, sortType, sortPrice);
                console.log(result.data.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchProducts();
    }, [currentPage, limit, selectedClassify, sortType, sortPrice, searchTerm, cate]);

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
    return (
        <>
            <Layout parent="Home" sub="Shop" subChild="Grid">
                <section className="mt-50 mb-50">
                    <div className="container">
                        <div className="row flex-row-reverse">
                            <div className="col-lg-3 primary-sidebar sticky-sidebar">
                                <div className="widget-category mb-30">
                                    <h5 className="section-title style-1 mb-30 wow fadeIn animated">Category</h5>
                                    <CategoryProduct />
                                </div>

                                <div className="sidebar-widget price_range range mb-30">
                                    <div className="widget-header position-relative mb-20 pb-10">
                                        <h5 className="widget-title mb-10">Filter</h5>
                                        <div className="bt-1 border-color-1"></div>
                                    </div>
                                    {/* 
                                    <div className="price-filter">
                                        <div className="price-filter-inner">
                                            <br />
                                            <PriceRangeSlider />
                                            <br />
                                        </div>
                                    </div> */}

                                    <div className="list-group">
                                        <div className="list-group-item mb-10 mt-10">
                                            <label className="fw-900">Color</label>
                                            <BrandFilter />
                                            <label className="fw-900 mt-15">Item Condition</label>
                                            <SizeFilter />
                                        </div>
                                    </div>
                                    <br />
                                </div>

                                <div className="sidebar-widget product-sidebar  mb-30 p-30 bg-grey border-radius-10">
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
                                </div>
                                <div className="banner-img wow fadeIn mb-45 animated d-lg-block d-none">
                                    <img src="/assets/imgs/banner/banner-11.jpg" alt="" />
                                    <div className="banner-text">
                                        <span>Women Zone</span>
                                        <h4>
                                            Save 17% on <br />
                                            Office Dress
                                        </h4>
                                        <Link href="/products">
                                            <a>
                                                Shop Now
                                                <i className="fi-rs-arrow-right"></i>
                                            </a>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-9">
                                <div className="shop-product-fillter">
                                    <div className="totall-product">
                                        <p>
                                            We found
                                            <strong className="text-brand">{products?.length}</strong>
                                            items for you!
                                        </p>
                                    </div>
                                    <div className="sort-by-product-area">
                                        <div className="sort-by-cover mr-10">
                                            <ShowSelect selectChange={selectChange} showLimit={12} />
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
                                                    <select
                                                        onChange={(e) => {
                                                            setSortPrice(e.target.value);
                                                            setCurrentPage(1);
                                                        }}
                                                    >
                                                        <option value="lowToHigh">Low To High</option>
                                                        <option value="highToLow">High To Low</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="row product-grid-3"
                                    style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}
                                >
                                    {products?.length === 0 && <h3>No Products Found </h3>}
                                    {products?.map((item, i) => (
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
                <WishlistModal />
                {/* <CompareModal /> */}
                <QuickView />
            </Layout>
        </>
    );
};

const mapStateToProps = (state) => ({
    products: state.products,
    productFilters: state.productFilters,
});

const mapDidpatchToProps = {
    fetchProduct,
};

export default connect(mapStateToProps, mapDidpatchToProps)(Products);
