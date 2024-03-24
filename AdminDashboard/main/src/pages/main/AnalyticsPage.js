import React, { useContext } from "react";
import PageLayout from "../../layouts/PageLayout";
import { Row, Col, Dropdown } from "react-bootstrap";
import { TranslatorContext } from "../../context/Translator"
import { Link } from "react-router-dom";
import { TrafficsTableComponent, PagesTableComponent } from "../../components/tables";
import { AnalyticsCardComponent, DevicesCardComponent, CountriesCardComponent } from "../../components/cards";

import analytics from "../../assets/data/analytics.json";
import traffics from "../../assets/data/traffics.json";
import pages from "../../assets/data/pages.json";

export default function AnalyticsPage() {

    const { t } = useContext(TranslatorContext);

    return (
        <PageLayout>
            <Row>
                <Col xl={12}>
                    <div className="mc-card">
                        <div className='mc-breadcrumb'>
                            <h3 className="mc-breadcrumb-title">{t('analytics')}</h3>
                            <ul className="mc-breadcrumb-list">
                                <li className="mc-breadcrumb-item"><Link to='#' className="mc-breadcrumb-link">{t('home')}</Link></li>
                                <li className="mc-breadcrumb-item"><Link to='#' className="mc-breadcrumb-link">{t('dashboard')}</Link></li>
                                <li className="mc-breadcrumb-item">{t('analytics')}</li>
                            </ul>
                        </div>
                    </div>
                </Col>
                {analytics?.map((analyze, index) => (
                    <Col xl={3} key={ index }>
                        <AnalyticsCardComponent
                            digit={ analyze.digit }
                            label={ analyze.label }
                            dataSet={ analyze.dataSet }
                            dataKey={ analyze.dataKey }
                            variant={ analyze.variant }
                        />
                    </Col>
                ))}
                <Col xl={7}> <DevicesCardComponent /> </Col>
                <Col xs={12} xl={5}> <CountriesCardComponent /> </Col>
                <Col xl={5}>
                    <div className="mc-card">
                        <div className="mc-card-header">
                            <h4 className="mc-card-title">{t('page_views')}</h4>
                            <Dropdown bsPrefix="mc-dropdown">
                                <Dropdown.Toggle bsPrefix="mc-dropdown-toggle">
                                    <i className='material-icons'>more_horiz</i>
                                </Dropdown.Toggle>
                                <Dropdown.Menu align="end" className="mc-dropdown-paper">
                                    <button type='button' className='mc-dropdown-menu'><i className='material-icons'>edit</i><span>{t('edit')}</span></button>
                                    <button type='button' className='mc-dropdown-menu'><i className='material-icons'>delete</i><span>{t('delete')}</span></button>
                                    <button type='button' className='mc-dropdown-menu'><i className='material-icons'>download</i><span>{t('download')}</span></button>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <PagesTableComponent 
                            thead={pages.thead}
                            tbody={pages.tbody}
                        />
                    </div>
                </Col>
                <Col xs={12} xl={7}>
                    <div className="mc-card">
                        <div className="mc-card-header">
                            <h4 className="mc-card-title">{t('traffic_sources')}</h4>
                            <Dropdown bsPrefix="mc-dropdown">
                                <Dropdown.Toggle bsPrefix="mc-dropdown-toggle">
                                    <i className='material-icons'>more_horiz</i>
                                </Dropdown.Toggle>
                                <Dropdown.Menu align="end" className="mc-dropdown-paper">
                                    <button type='button' className='mc-dropdown-menu'><i className='material-icons'>edit</i><span>{t('edit')}</span></button>
                                    <button type='button' className='mc-dropdown-menu'><i className='material-icons'>delete</i><span>{t('delete')}</span></button>
                                    <button type='button' className='mc-dropdown-menu'><i className='material-icons'>download</i><span>{t('download')}</span></button>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <TrafficsTableComponent 
                            thead={traffics.thead} 
                            tbody={traffics.tbody }
                        />
                    </div>
                </Col>
            </Row>
        </PageLayout>
    )
}