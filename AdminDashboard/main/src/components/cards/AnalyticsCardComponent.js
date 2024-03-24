import React, { useContext } from "react";
import { TranslatorContext } from "../../context/Translator";
import { AnalyticsChartComponent } from "../charts";
import { Dropdown } from "react-bootstrap";

export default function AnalyticsCardComponent({ digit, label, variant, dataSet, dataKey }) {

    const { t } = useContext(TranslatorContext)
    
    return (
        <div className={`mc-analytics-card ${ variant.name }`}>
            <div className="mc-analytics-card-group">
                <div className="mc-analytics-card-content">
                    <h3>{ digit }</h3>
                    <p>{ label }</p>
                </div>
                <Dropdown bsPrefix="mc-dropdown">
                    <Dropdown.Toggle bsPrefix="mc-dropdown-toggle">
                        <i className='material-icons'>more_vert</i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu align="end" className="mc-dropdown-paper">
                        <button type='button' className='mc-dropdown-menu'><i className='material-icons'>edit</i><span>{t('edit')}</span></button>
                        <button type='button' className='mc-dropdown-menu'><i className='material-icons'>delete</i><span>{t('delete')}</span></button>
                        <button type='button' className='mc-dropdown-menu'><i className='material-icons'>download</i><span>{t('download')}</span></button>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <AnalyticsChartComponent 
                dataSet={ dataSet } 
                dataKey={ dataKey }
                variant={ variant.color }
            />
        </div>
    )
}