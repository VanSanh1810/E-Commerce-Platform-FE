import React, { useContext, useEffect, useState } from 'react';
import { TranslatorContext } from '../../context/Translator';
import { SalesChartComponent } from '../charts';
import { Dropdown } from 'react-bootstrap';
import axiosInstance from '../../configs/axiosInstance';

export default function SalesCardComponent() {
    const { t } = useContext(TranslatorContext);

    const [salesType, setSalesType] = useState('day');
    const [salesData, setSalesData] = useState([]);
    const [preSale, setPreSale] = useState(0);
    const [curSale, setCurSale] = useState(0);

    useEffect(() => {
        const fetchSalesData = async () => {
            try {
                const response = await axiosInstance.get(`/api/stat/sale?type=${salesType}`);
                console.log(response.data);
                let totalTemp = 0;
                switch (salesType) {
                    case 'day':
                        setSalesData(
                            response.data.saleData.map((item) => {
                                totalTemp += item.sale;
                                return { week: item.week, sale: item.sale };
                            }),
                        );
                        break;
                    case 'month':
                        setSalesData(
                            response.data.saleData.map((item) => {
                                totalTemp += item.sale;
                                return { week: item.week, sale: item.sale };
                            }),
                        );
                        break;
                    case 'year':
                        const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                        const temp = response.data.saleData.map((item) => {
                            totalTemp += item.sale;
                            return { week: month[parseInt(item.week)], sale: item.sale };
                        });
                        console.log(temp);
                        setSalesData([...temp]);
                        break;
                    default:
                        break;
                }
                setCurSale(totalTemp);
                setPreSale(response.data.preSale);
            } catch (e) {
                console.error(e);
            }
        };
        fetchSalesData();
    }, [salesType]);

    return (
        <div className="mc-sales-card">
            <div className="mc-sales-card-group">
                <div className="mc-card-header">
                    <h4 className="mc-card-title">{t('total_sales')}</h4>
                    <Dropdown bsPrefix="mc-dropdown">
                        <Dropdown.Toggle bsPrefix="mc-dropdown-toggle">
                            <i className="material-icons">more_horiz</i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu align="end" className="mc-dropdown-paper">
                            <button
                                type="button"
                                className="mc-dropdown-menu"
                                onClick={() => {
                                    setSalesType('day');
                                }}
                            >
                                <i className="material-icons">history</i>
                                <span>{t('last_day')}</span>
                            </button>
                            <button
                                type="button"
                                className="mc-dropdown-menu"
                                onClick={() => {
                                    setSalesType('month');
                                }}
                            >
                                <i className="material-icons">history</i>
                                <span>{t('last_month')}</span>
                            </button>
                            <button
                                type="button"
                                className="mc-dropdown-menu"
                                onClick={() => {
                                    setSalesType('year');
                                }}
                            >
                                <i className="material-icons">history</i>
                                <span>{t('last_year')}</span>
                            </button>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <div className={`mc-sales-card-amount ${curSale - preSale > 0 ? 'trending_up green' : 'trending_down red'}`}>
                    <h3>${curSale}</h3>
                    <p>
                        {preSale === 0 ? 100 : (Math.abs(curSale - preSale) / preSale) * 100}%
                        <i className="material-icons">{curSale - preSale > 0 ? 'trending_up' : 'trending_down'}</i>
                    </p>
                </div>
                <p className="mc-sales-card-compare">
                    ${preSale} in {t(`last ${salesType}`)}
                </p>
            </div>
            <SalesChartComponent data={salesData} />
        </div>
    );
}
