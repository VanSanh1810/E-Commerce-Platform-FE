import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { TranslatorContext } from "../../context/Translator";
import { Row, Col } from "react-bootstrap";
import { CRMCardComponent, DealsCardComponent, ClientsCardComponent, ActivityCardComponent } from "../../components/cards";
import PageLayout from "../../layouts/PageLayout";
import crms from "../../assets/data/crms.json";

export default function CRMPage() {

    const { t } = useContext(TranslatorContext);

    return (
        <PageLayout>
            <Row>
                <Col xl={12}>
                    <div className="mc-card">
                        <div className='mc-breadcrumb'>
                            <h3 className="mc-breadcrumb-title">{t('crm')}</h3>
                            <ul className="mc-breadcrumb-list">
                                <li className="mc-breadcrumb-item"><Link to='#' className="mc-breadcrumb-link">{t('home')}</Link></li>
                                <li className="mc-breadcrumb-item"><Link to='#' className="mc-breadcrumb-link">{t('dashboard')}</Link></li>
                                <li className="mc-breadcrumb-item">{t('crm')}</li>
                            </ul>
                        </div>
                    </div>
                </Col>
                {crms.map((crm, index) => (
                    <Col xl={6} key={ index }>
                        <CRMCardComponent 
                            variant={ crm.variant }
                            content={ crm.content }
                            status={ crm.status }
                            dataKey={ crm.dataKey }
                            dataSet={ crm.dataSet }
                        />
                    </Col>
                ))}
                <Col xl={12}> <DealsCardComponent /> </Col>
                <Col xl={6}> <ClientsCardComponent /> </Col>
                <Col xl={6}> <ActivityCardComponent /> </Col>
            </Row>
        </PageLayout>
    )
}