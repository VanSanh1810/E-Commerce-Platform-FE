import React, { useContext, useState } from 'react';
import { TranslatorContext } from '../../context/Translator';
import { LabelFieldComponent } from '../fields';
import { Row, Col, Dropdown } from 'react-bootstrap';
import PaginationComponent from '../PaginationComponent';
import ProductsTableComponent from '../tables/ProductsTableComponent';
import products from '../../assets/data/products.json';
import { debounce } from 'lodash';

export default function ProductsCardComponent() {
    const { t } = useContext(TranslatorContext);

    const [rowView, setRowView] = useState(6);
    const [sortPrice, setSortPrice] = useState('lowToHigFh');
    const [pages, setPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [productSearchText, setProductSearchText] = useState('');

    return (
        <div className="mc-card">
            <div className="mc-card-header">
                <h4 className="mc-card-title">{t('best_selling_products')}</h4>
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
            <Row xs={1} sm={2} xl={4}>
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
            />
            {pages !== 0 ? (
                <PaginationComponent currentPage={currentPage} setCurrentPage={setCurrentPage} pages={pages} rowShow={rowView} />
            ) : null}
        </div>
    );
}
