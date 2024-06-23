import React, { useContext, useEffect, useState } from 'react';
import { TranslatorContext } from '../../context/Translator';
import { Link } from 'react-router-dom';
import { Row, Col, Modal } from 'react-bootstrap';
import { FloatCardComponent } from '../../components/cards';
import ProductsTableComponent from '../../components/tables/ProductsTableComponent';
import LabelFieldComponent from '../../components/fields/LabelFieldComponent';
import { PaginationComponent } from '../../components';
import PageLayout from '../../layouts/PageLayout';
import products from '../../assets/data/products.json';
import axiosInstance from '../../configs/axiosInstance';
import { debounce } from 'lodash';
import { ButtonComponent } from '../../components/elements';

export default function ProductListPage() {
    const { t, n } = useContext(TranslatorContext);

    const [rowView, setRowView] = useState(6);
    const [sortPrice, setSortPrice] = useState('lowToHigh');
    const [pages, setPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState('null');
    const [productSearchText, setProductSearchText] = useState('');

    const [cateData, setCateData] = useState([]);
    const [cateModal, setCateModal] = useState(false);
    const [categoryTree, setCategoryTree] = useState([null]);

    const [totalProduct, setTotalProduct] = useState(0);
    const [totalCate, setTotalCate] = useState(0);
    const [avgStar, setAvgStar] = useState(0);

    useEffect(() => {
        const fetchTotalProduct = async () => {
            const response = await axiosInstance.get('/api/stat/totalProduct');
            setTotalProduct(response.data.total);
        };
        fetchTotalProduct();
    }, []);

    useEffect(() => {
        const fetchTotalCate = async () => {
            const response = await axiosInstance.get('/api/stat/totalCate');
            setTotalCate(response.data.total);
        };
        fetchTotalCate();
        ////////////////////////////////
        const fetchCate = async () => {
            try {
                const result = await axiosInstance.get('/api/category');
                // console.log(result);
                setCateData([...result.data.data]);
            } catch (err) {
                console.log(err);
            }
        };
        fetchCate();
    }, []);

    useEffect(() => {
        const fetchAvgStar = async () => {
            const response = await axiosInstance.get('/api/stat/avgStar');
            setAvgStar(response.data.avg);
        };
        fetchAvgStar();
    }, []);

    return (
        <PageLayout>
            <Row>
                <Col xl={12}>
                    <div className="mc-card">
                        <div className="mc-breadcrumb">
                            <h3 className="mc-breadcrumb-title">{t('product_list')}</h3>
                            <ul className="mc-breadcrumb-list">
                                <li className="mc-breadcrumb-item">
                                    <Link to="/" className="mc-breadcrumb-link">
                                        {t('home')}
                                    </Link>
                                </li>
                                <li className="mc-breadcrumb-item">{t('products')}</li>
                                <li className="mc-breadcrumb-item">{t('product_list')}</li>
                            </ul>
                        </div>
                    </div>
                </Col>
                <Col sm={6} lg={4}>
                    <FloatCardComponent
                        variant={'lg blue'}
                        digit={n(totalProduct)}
                        title={t('Total Product')}
                        icon={'shopping_bag'}
                    />
                </Col>
                <Col sm={6} lg={4}>
                    <FloatCardComponent
                        variant={'lg green'}
                        digit={n(totalCate)}
                        title={t('Total categories')}
                        icon={'widgets'}
                    />
                </Col>
                <Col sm={6} lg={4}>
                    <FloatCardComponent variant={'lg yellow'} digit={n(avgStar)} title={t('Average Start')} icon={'star'} />
                </Col>

                <Col xl={12}>
                    <div className="mc-card">
                        <Row>
                            <Col xs={12} sm={6} md={3} lg={3}>
                                <LabelFieldComponent
                                    label={t('show_by')}
                                    option={['6 row', '12 row', '24 row']}
                                    labelDir="label-col"
                                    fieldSize="w-100 h-md mb-4"
                                    onChange={(e) => {
                                        // console.log(e.target.value);
                                        let a = e.target.value;
                                        const temp = a.split(' ');
                                        setRowView(parseInt(temp[0]));
                                        setCurrentPage(1);
                                    }}
                                />
                            </Col>
                            {/* <Col xs={12} sm={6} md={3} lg={3}>
                                <LabelFieldComponent
                                    label={t('rating_by')}
                                    option={['1 star', '2 star', '3 star', '4 star', '5 star']}
                                    labelDir="label-col"
                                    fieldSize="w-100 h-md mb-4"
                                />
                            </Col> */}
                            <Col xs={12} sm={6} md={3} lg={3}>
                                <label className="mc-label-field-title">{'Sort price'}</label>
                                <select
                                    style={{ backgroundImage: 'url(/images/dropdown.svg)' }}
                                    className={`mc-label-field-select w-100 h-md mb-4`}
                                    onChange={(e) => {
                                        // console.log(e.target.value);
                                        setSortPrice(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                >
                                    <option selected={true} value={'lowToHigh'}>
                                        Low To High
                                    </option>
                                    <option value={'highToLow'}>High To Low</option>
                                </select>
                            </Col>
                            <Col xs={12} sm={6} md={3} lg={3}>
                                <LabelFieldComponent
                                    style={{ cursor: 'pointer' }}
                                    type={'text'}
                                    label={t('Category')}
                                    fieldSize="mb-4 w-100 h-md"
                                    readOnly={true}
                                    onClick={() => {
                                        setCateModal(true);
                                    }}
                                    value={cateData?.find((obj) => obj._id === selectedCategory)?.name}
                                />
                            </Col>
                            <Col xs={12} sm={6} md={3} lg={3}>
                                <LabelFieldComponent
                                    type="search"
                                    label={t('search_by')}
                                    placeholder={t('id') + ' / ' + t('name')}
                                    labelDir="label-col"
                                    fieldSize="mb-4 w-100 h-md"
                                    onChange={debounce(
                                        (e) => {
                                            // console.log(e.target.value);
                                            setProductSearchText(e.target.value);
                                            setCurrentPage(1);
                                        },
                                        [500],
                                    )}
                                />
                            </Col>
                            <Col xl={12}>
                                <ProductsTableComponent
                                    thead={products.thead}
                                    tbody={products.tbody}
                                    sortPrice={sortPrice}
                                    rowView={rowView}
                                    currentPage={currentPage}
                                    setPages={setPages}
                                    productSearchText={productSearchText}
                                    selectedCategory={selectedCategory}
                                />
                                <PaginationComponent
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                    pages={pages}
                                    rowShow={rowView}
                                />
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
            <Modal size="lg" show={cateModal} onHide={() => setCateModal(false)} style={{ padding: '10px' }}>
                <div className="mc-alert-modal" style={{ width: '80vw' }}>
                    <i className="material-icons">account_tree</i>
                    <h3>Select Category</h3>
                    <p>Chose category for your product</p>
                    <Modal.Body>
                        <Col>
                            <div className="container px-3 py-1">
                                <div style={{ overflowX: 'scroll' }} className="d-flex flex-row pb-2">
                                    {categoryTree.map((category, index) => {
                                        return (
                                            <div className="cate-container">
                                                <ul>
                                                    {cateData.map((data) => {
                                                        if (data.root?._id === category || data.root === category) {
                                                            return (
                                                                <li
                                                                    className={
                                                                        selectedCategory === data._id
                                                                            ? 'selected cate-item'
                                                                            : 'cate-item'
                                                                    }
                                                                    onClick={() => {
                                                                        setSelectedCategory(data._id);
                                                                        if (categoryTree[index + 1]) {
                                                                            var tempArr = [...categoryTree];
                                                                            tempArr.splice(index + 1);
                                                                            tempArr.push(data._id);
                                                                            setCategoryTree(tempArr);
                                                                        } else {
                                                                            setCategoryTree([...categoryTree, data._id]);
                                                                        }
                                                                    }}
                                                                >
                                                                    {data.name}
                                                                    {data.child?.length > 0 ? (
                                                                        <i className="material-icons">keyboard_arrow_right</i>
                                                                    ) : null}
                                                                </li>
                                                            );
                                                        }
                                                        return null;
                                                    })}
                                                </ul>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </Col>
                    </Modal.Body>
                    <Modal.Footer>
                        <ButtonComponent
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => {
                                setCateModal(false);
                            }}
                        >
                            {t('close')}
                        </ButtonComponent>
                        <ButtonComponent
                            type="button"
                            className="btn btn-success"
                            onClick={() => {
                                setCateModal(false);
                            }}
                        >
                            {t('Select')}
                        </ButtonComponent>
                        <ButtonComponent
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                                setCategoryTree([null]);
                                setSelectedCategory(null);
                                setCateModal(false);
                            }}
                        >
                            {t('Clear')}
                        </ButtonComponent>
                    </Modal.Footer>
                </div>
            </Modal>
        </PageLayout>
    );
}
