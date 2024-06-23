import React, { useContext, useEffect, useState } from 'react';
import { TranslatorContext } from '../../context/Translator';
import { LabelFieldComponent } from '../fields';
import { Row, Col, Dropdown, Modal } from 'react-bootstrap';
import PaginationComponent from '../PaginationComponent';
import ProductsTableComponent from '../tables/ProductsTableComponent';
import products from '../../assets/data/products.json';
import { debounce } from 'lodash';
import { ButtonComponent } from '../elements';
import axiosInstance from '../../configs/axiosInstance';

export default function ProductsCardComponent() {
    const { t } = useContext(TranslatorContext);

    const [rowView, setRowView] = useState(6);
    const [sortPrice, setSortPrice] = useState('lowToHigFh');
    const [pages, setPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [productSearchText, setProductSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const [cateData, setCateData] = useState([]);
    const [cateModal, setCateModal] = useState(false);
    const [categoryTree, setCategoryTree] = useState([null]);

    useEffect(() => {
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

    return (
        <div className="mc-card">
            <div className="mc-card-header">
                <h4 className="mc-card-title">{t('products')}</h4>
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
            <Row xs={1} sm={4} xl={4}>
                <Col>
                    <LabelFieldComponent
                        label={t('show_by')}
                        option={['6 row', '12 row', '24 row']}
                        labelDir="label-col"
                        fieldSize="mb-4 w-100 h-md"
                        onChange={(e) => {
                            // console.log(e.target.value);
                            let a = e.target.value;
                            const temp = a.split(' ');
                            setRowView(parseInt(temp[0]));
                            setCurrentPage(1);
                        }}
                    />
                </Col>
                <Col>
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
                <Col>
                    <LabelFieldComponent
                        key={selectedCategory}
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
                <Col>
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
            </Row>
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
            {pages !== 0 ? (
                <PaginationComponent currentPage={currentPage} setCurrentPage={setCurrentPage} pages={pages} rowShow={rowView} />
            ) : null}
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
        </div>
    );
}
