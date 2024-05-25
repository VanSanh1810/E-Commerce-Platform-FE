import React, { useContext, useEffect, useState } from 'react';
import { TranslatorContext } from '../../context/Translator';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, Dropdown } from 'react-bootstrap';
import { AnchorComponent } from '../../components/elements';
import { FloatCardComponent, ActivityCardComponent } from '../../components/cards';
import PageLayout from '../../layouts/PageLayout';
import axiosInstance from '../../configs/axiosInstance';
import AddressStaticData from '../../assets/data/static/dataprovince';
import { PaginationComponent } from '../../components';
import { ProductsTableComponent } from '../../components/tables';
import { LabelFieldComponent } from '../../components/fields';
import { debounce } from 'lodash';
import products from '../../assets/data/products.json';

export default function ShopProfilePage() {
    const { t } = useContext(TranslatorContext);
    const { uid } = useParams();

    const [shopData, setShopData] = useState();
    const [shopStat, setShopStat] = useState({});
    const [adName, setAdName] = useState({});
    //
    const [rowView, setRowView] = useState(6);
    const [sortPrice, setSortPrice] = useState('lowToHigh');
    const [pages, setPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [productSearchText, setProductSearchText] = useState('');

    useEffect(() => {
        console.log(uid);
        const fetchShopData = async () => {
            try {
                const result = await axiosInstance.get(`/api/shop/${uid}`);
                console.log(result.data);
                setShopData(result.data.data.shop);
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
    }, [uid]);

    useEffect(() => {
        console.log(uid);
        const fetchShopStat = async () => {
            try {
                const result = await axiosInstance.get(`/api/stat/shopStat/${uid}`);
                setShopStat(result.data);
                console.log(result.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchShopStat();
    }, [uid]);

    const floats = [
        { title: 'total_orders', digit: shopStat?.totalOrder, icon: 'shopping_cart', variant: 'sm purple' },
        { title: 'total_reviews', digit: shopStat?.totalOrder, icon: 'hotel_class', variant: 'sm yellow' },
        { title: 'total_products', digit: shopStat?.totalProduct, icon: 'shopping_bag', variant: 'sm green' },
    ];
    return (
        <PageLayout>
            <Row>
                <Col xl={12}>
                    <div className="mc-card">
                        <div className="mc-breadcrumb">
                            <h3 className="mc-breadcrumb-title">{t('shop profile')}</h3>
                            <ul className="mc-breadcrumb-list">
                                <li className="mc-breadcrumb-item">
                                    <Link to="/" className="mc-breadcrumb-link">
                                        {t('home')}
                                    </Link>
                                </li>
                                <li className="mc-breadcrumb-item">
                                    <Link to="/shop" className="mc-breadcrumb-link">
                                        {t('shop')}
                                    </Link>
                                </li>
                                <li className="mc-breadcrumb-item">{t('shop profile')}</li>
                            </ul>
                        </div>
                    </div>
                </Col>
                <Col xl={12}>
                    <Row>
                        <Col md={6} lg={6}>
                            <FloatCardComponent
                                variant={'sm purple'}
                                digit={shopStat?.totalOrder}
                                title={'total_orders'}
                                icon={'shopping_cart'}
                            />
                        </Col>
                        <Col md={6} lg={6}>
                            <FloatCardComponent
                                variant={'sm green'}
                                digit={shopStat?.totalProduct}
                                title={'total_products'}
                                icon={'shopping_bag'}
                            />
                        </Col>
                    </Row>
                </Col>
                <Col xl={12}>
                    <div className="mc-card">
                        <div className="mc-card-header">
                            <h4 className="mc-card-title">{t('user information')}</h4>
                            <Dropdown bsPrefix="mc-dropdown">
                                <Dropdown.Toggle bsPrefix="mc-dropdown-toggle">
                                    <i className="material-icons">more_horiz</i>
                                </Dropdown.Toggle>
                                <Dropdown.Menu align="end" className="mc-dropdown-paper">
                                    <button type="button" className="mc-dropdown-menu">
                                        <i className="material-icons">edit</i>
                                        <span>{t('edit')}</span>
                                    </button>
                                    <button type="button" className="mc-dropdown-menu">
                                        <i className="material-icons">delete</i>
                                        <span>{t('delete')}</span>
                                    </button>
                                    <button type="button" className="mc-dropdown-menu">
                                        <i className="material-icons">download</i>
                                        <span>{t('download')}</span>
                                    </button>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div className="mc-user-group">
                            <div className="mc-user-profile">
                                <div className="mc-round-avatar md">
                                    <img src={shopData?.avatar?.url} alt="avatar" />
                                </div>
                                <div className="mc-duel-text md">
                                    <h3 className="mc-duel-text-title">{shopData?.name}</h3>
                                    {/* <p className="mc-duel-text-descrip">@mironcoder</p> */}
                                </div>
                            </div>
                            <div className="mb-4">
                                <h6 className="mc-divide-title mb-4">{t('communication')}</h6>
                                <ul className="mc-user-metalist">
                                    {/* <li>
                                        <i className="material-icons">phone_in_talk</i>
                                        <span>+91 987-654-3210</span>
                                    </li> */}
                                    <li>
                                        <i className="material-icons">mail</i>
                                        <span>{shopData?.email}</span>
                                    </li>
                                    <li>
                                        <i className="material-icons">map</i>
                                        <span>{shopData?.addresses?.address?.detail}</span>
                                        <span>{adName?.ward ? adName?.ward : null}</span>
                                        <span>{adName?.district ? adName?.district : null}</span>
                                        <span>{adName?.province ? adName?.province : null}</span>
                                    </li>
                                    <li>
                                        <i className="material-icons">person</i>
                                        <a
                                            style={{ color: '#331cff', textDecoration: 'undeline' }}
                                            href={`/user/${shopData?.vendor._id}`}
                                        >
                                            {shopData?.vendor.name}
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            {/* <div className="mb-4">
                                <h6 className="mc-divide-title mb-3">{t('biography')}</h6>
                                <p className="mc-user-bio mb-4">
                                    It has survived not only five centuries, but also the leap into electronic typesetting,
                                    remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset
                                    sheets
                                </p>
                            </div>
                            <div>
                                <h6 className="mc-divide-title mb-3">{t('elsewhere')}</h6>
                                <nav className="mc-user-social">
                                    <AnchorComponent to="#" className="facebook">
                                        <i className="icofont-facebook"></i>
                                        <span>facebook</span>
                                    </AnchorComponent>
                                    <AnchorComponent to="#" className="twitter">
                                        <i className="icofont-twitter"></i>
                                        <span>twitter</span>
                                    </AnchorComponent>
                                    <AnchorComponent to="#" className="linkedin">
                                        <i className="icofont-linkedin"></i>
                                        <span>linkedin</span>
                                    </AnchorComponent>
                                    <AnchorComponent to="#" className="whatsapp">
                                        <i className="icofont-whatsapp"></i>
                                        <span>whatsapp</span>
                                    </AnchorComponent>
                                    <AnchorComponent to="#" className="youtube">
                                        <i className="icofont-youtube-play"></i>
                                        <span>youtube</span>
                                    </AnchorComponent>
                                </nav>
                            </div> */}
                        </div>
                    </div>
                </Col>
                <Col xl={12}>
                    <div className="mc-card">
                        <Row>
                            <Col xs={12} sm={6} md={4} lg={4}>
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
                            <Col xs={12} sm={6} md={4} lg={4}>
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
                            <Col xs={12} sm={6} md={4} lg={4}>
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
                                    _shopId={uid ? uid : ''}
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
        </PageLayout>
    );
}
