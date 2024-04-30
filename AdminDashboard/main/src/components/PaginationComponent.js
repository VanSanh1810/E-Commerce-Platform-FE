import React, { useContext, useEffect, useState } from 'react';
import { TranslatorContext } from '../context/Translator';
import { sassNull } from 'sass';

export default function PaginationComponent({ currentPage, setCurrentPage, pages, rowShow }) {
    const { t, n, currentLanguage } = useContext(TranslatorContext);
    const [pageViewable, setPageViewable] = useState(4);
    const [arrViewAble, setArrViewAble] = useState([]);
    useEffect(() => {
        const array = [];
        for (
            let i = currentPage - Math.ceil(pageViewable / 2);
            i <= currentPage - Math.ceil(pageViewable / 2) + pageViewable;
            i++
        ) {
            array.push(i);
        }
        setArrViewAble([...array]);
    }, [currentPage, pageViewable]);
    return (
        <div className="mc-paginate">
            <p className="mc-paginate-title">
                {t('showing ')}
                <b> {rowShow} </b>
                {t('of')}
                <b> {pages} </b>
                {t('results')}
            </p>
            <ul className="mc-paginate-list">
                <li className="mc-paginate-item">
                    {currentLanguage?.dir === 'ltr' ? (
                        <i
                            className="material-icons"
                            onClick={() => {
                                if (currentPage - 1 > 0) {
                                    setCurrentPage(currentPage - 1);
                                }
                            }}
                        >
                            chevron_left
                        </i>
                    ) : (
                        <i className="material-icons">chevron_right</i>
                    )}
                </li>
                <li
                    className={`mc-paginate-item ${currentPage === 1 ? 'active' : ''}`}
                    onClick={() => {
                        setCurrentPage(1);
                    }}
                >
                    {n(1)}
                </li>
                {parseInt(arrViewAble[0]) > 2 ? <li>...</li> : null}
                {arrViewAble?.map((item, index) => {
                    if (parseInt(item) > 1 && parseInt(item) < Math.ceil(pages / rowShow)) {
                        return (
                            <li
                                key={index}
                                className={`mc-paginate-item ${currentPage === item ? 'active' : ''}`}
                                onClick={() => {
                                    setCurrentPage(parseInt(item));
                                }}
                            >
                                {n(parseInt(item))}
                            </li>
                        );
                    }
                    return null;
                })}
                {/* <li className="mc-paginate-item">{n(2)}</li>
                <li className="mc-paginate-item">{n(3)}</li> */}
                {parseInt(arrViewAble[pageViewable - 1]) < Math.ceil(pages / rowShow) - 1 ? <li>...</li> : null}
                <li
                    className={`mc-paginate-item ${currentPage === Math.ceil(pages / rowShow) ? 'active' : ''}`}
                    onClick={() => {
                        setCurrentPage(Math.ceil(pages / rowShow));
                    }}
                >
                    {n(Math.ceil(pages / rowShow))}
                </li>
                <li className="mc-paginate-item">
                    {currentLanguage?.dir === 'ltr' ? (
                        <i
                            className="material-icons"
                            onClick={() => {
                                if (currentPage + 1 <= Math.ceil(pages / rowShow)) {
                                    setCurrentPage(currentPage + 1);
                                }
                            }}
                        >
                            chevron_right
                        </i>
                    ) : (
                        <i className="material-icons">chevron_left</i>
                    )}
                </li>
            </ul>
        </div>
    );
}
