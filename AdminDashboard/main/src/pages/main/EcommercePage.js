import React, { useContext } from "react";
import { TranslatorContext } from "../../context/Translator";
import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import { EcommerceCardComponent, SalesCardComponent, ProductsCardComponent, RevenueCardComponent, ClientsCardComponent, ActivityCardComponent, OrdersCardComponent } from "../../components/cards";
import PageLayout from "../../layouts/PageLayout";
import heros from "../../assets/data/heros.json";


export default function EcommercePage() {

    const { t, n } = useContext(TranslatorContext);

    return (
        <PageLayout>
            <Row>
                <Col xl={12}>
                    <div className="mc-card">
                        <div className='mc-breadcrumb'>
                            <h3 className="mc-breadcrumb-title">{t('ecommerce')}</h3>
                            <ul className="mc-breadcrumb-list">
                                <li className="mc-breadcrumb-item"><Link to='#' className="mc-breadcrumb-link">{t('home')}</Link></li>
                                <li className="mc-breadcrumb-item"><Link to='#' className="mc-breadcrumb-link">{t('dashboard')}</Link></li>
                                <li className="mc-breadcrumb-item">{t('ecommerce')}</li>
                            </ul>
                        </div>
                    </div>
                </Col>
                <Col xs={12} xl={8}>
                    <Row xs={1} sm={2}>
                        {heros.map((hero, index) => (
                            <Col key={index}>
                                <EcommerceCardComponent
                                    icon={hero.icon}
                                    trend={hero.trend}
                                    title={t(hero.title)}
                                    variant={hero.variant}
                                    number={n(hero.number)}
                                    percent={hero.percent} 
                                />
                            </Col>
                        ))}
                    </Row>
                </Col>
                <Col xs={12} xl={4}> <SalesCardComponent /> </Col>
                <Col xl={12}> <ProductsCardComponent /> </Col>
                <Col xl={8}> <RevenueCardComponent /> </Col>
                <Col xl={4}> <OrdersCardComponent /> </Col>
                <Col xl={6}> <ClientsCardComponent /> </Col>
                <Col xl={6}> <ActivityCardComponent /> </Col>
            </Row>
        </PageLayout>
    );
}
