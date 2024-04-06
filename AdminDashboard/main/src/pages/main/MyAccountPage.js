import React, { useContext } from 'react';
import { TranslatorContext } from '../../context/Translator';
import { Link } from 'react-router-dom';
import { Row, Col, Tab, Tabs, Form } from 'react-bootstrap';
import { LegendFieldComponent, LegendTextareaComponent, IconFieldComponent } from '../../components/fields';
import { ButtonComponent } from '../../components/elements';
import { FileUploadComponent } from '../../components';
import PageLayout from '../../layouts/PageLayout';

export default function MyAccountPage() {
    const { t } = useContext(TranslatorContext);

    return (
        <PageLayout>
            <Row>
                <Col xl={12}>
                    <div className="mc-card">
                        <div className="mc-breadcrumb">
                            <h3 className="mc-breadcrumb-title">{t('my shop')}</h3>
                            <ul className="mc-breadcrumb-list">
                                <li className="mc-breadcrumb-item">
                                    <Link to="/" className="mc-breadcrumb-link">
                                        {t('home')}
                                    </Link>
                                </li>
                                <li className="mc-breadcrumb-item">{t('my shop')}</li>
                            </ul>
                        </div>
                    </div>
                </Col>
                <Col xl={12}>
                    <div className="mc-card">
                        <Tabs defaultActiveKey="profile" id="mc" className="mc-tabs">
                            <Tab eventKey="profile" title={t('edit_profile')} className="mc-tabpane profile">
                                <div className="mc-tab-card">
                                    <h6 className="mc-tab-card-title">{t('Shop Information')}</h6>
                                    <Row>
                                        <Col xl={4}>
                                            <div className="mc-user-avatar-upload">
                                                <div className="mc-user-avatar">
                                                    <img src="/images/avatar/01.webp" alt="avatar" />
                                                </div>
                                                <FileUploadComponent icon="cloud_upload" text={t('upload')} />
                                            </div>
                                        </Col>
                                        <Col xl={8}>
                                            <Row>
                                                <Col xl={12}>
                                                    <LegendFieldComponent
                                                        type="text"
                                                        title={t('Name')}
                                                        value="miron mahmud"
                                                        className="mb-4"
                                                    />
                                                </Col>
                                                <Col xl={12}>
                                                    <LegendFieldComponent
                                                        type="email"
                                                        title={t('Email')}
                                                        value="miron mahmud"
                                                        className="mb-4"
                                                    />
                                                </Col>
                                                <Col xl={12}>
                                                    <LegendTextareaComponent
                                                        title={t('Information')}
                                                        longText="I consider myself as a creative, professional and a flexible person. I can adapt with any kind of brief and design style"
                                                    />
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </div>
                                <div className="mc-tab-card">
                                    <h6 className="mc-tab-card-title">{t('Shop Address')}</h6>
                                    <Row>
                                        {/* <Col xl={4}><LegendFieldComponent className="mb-4" type="text" title={t('unique_id')} value="#783404edft97e3445" /></Col>
                                        <Col xl={4}><LegendFieldComponent className="mb-4" title={t('role')} option={["member", "admin", "vendor", "founder"]} /></Col>
                                        <Col xl={4}><LegendFieldComponent className="mb-4" title={t('status')} option={["approved", "pending", "blocked"]} /></Col> */}
                                        <Col xl={4}>
                                            <LegendFieldComponent
                                                className="mb-4"
                                                type="text"
                                                title={t('province')}
                                                value="demo@example.com"
                                            />
                                        </Col>
                                        <Col xl={4}>
                                            <LegendFieldComponent
                                                className="mb-4"
                                                type="text"
                                                title={t('district')}
                                                value="+8801838288389"
                                            />
                                        </Col>
                                        <Col xl={4}>
                                            <LegendFieldComponent
                                                className="mb-4"
                                                type="text"
                                                title={t('ward')}
                                                value="https://mironmahmud.com/"
                                            />
                                        </Col>
                                        <Col xl={12}>
                                            <LegendTextareaComponent
                                                title={t('address detail')}
                                                longText="3379  Monroe Avenue, Fort Myers, Florida(33912)"
                                            />
                                        </Col>
                                    </Row>
                                </div>
                                {/* <div className="mc-tab-card">
                                    <h6 className="mc-tab-card-title">{t('social_inFormation')}</h6>
                                    <Row xs={1} md={2}>
                                        <Col><LegendFieldComponent className="mb-4" type="url" title="facebook" value="https://example.com/"/></Col>
                                        <Col><LegendFieldComponent className="mb-4" type="url" title="twitter" value="https://example.com/"/></Col>
                                        <Col><LegendFieldComponent className="mb-4" type="url" title="linkedin" value="https://example.com/"/></Col>
                                        <Col><LegendFieldComponent className="mb-4" type="url" title="instagram" value="https://example.com/"/></Col>
                                        <Col><LegendFieldComponent className="mb-4" type="url" title="youtube" value="https://example.com/"/></Col>
                                        <Col><LegendFieldComponent className="mb-4" type="url" title="pinterest" value="https://example.com/"/></Col>
                                    </Row>
                                </div> */}
                                <ButtonComponent className="mc-btn primary" icon="verified" text={t('save_changes')} />
                            </Tab>
                            <Tab eventKey="password" title={t('change_password')} className="mc-tabpane password">
                                <div className="mc-tab-card">
                                    <h6 className="mc-tab-card-title">{t('generate_password')}</h6>
                                    <Row>
                                        <Col xs={12} md={12}>
                                            <IconFieldComponent
                                                icon="lock"
                                                type="password"
                                                placeholder={t('current_password')}
                                                classes="w-100 h-lg mb-4"
                                                passwordVisible
                                            />
                                        </Col>
                                        <Col xs={12} md={6}>
                                            <IconFieldComponent
                                                icon="add_moderator"
                                                type="password"
                                                placeholder={t('new_password')}
                                                classes="w-100 h-lg mb-4"
                                                passwordVisible
                                            />
                                        </Col>
                                        <Col xs={12} md={6}>
                                            <IconFieldComponent
                                                icon="verified_user"
                                                type="password"
                                                placeholder={t('confirm_password')}
                                                classes="w-100 h-lg mb-4"
                                                passwordVisible
                                            />
                                        </Col>
                                    </Row>
                                </div>
                                <ButtonComponent className="mc-btn primary" icon="verified" text={t('save_changes')} />
                            </Tab>
                            {/* <Tab eventKey="settings" title={t('other_settings')} className="mc-tabpane settings">
                                <Row xs={1} md={2}>
                                    <Col>
                                        <div className="mc-tab-card">
                                            <h6 className="mc-tab-card-title">{t('activity_email_settings')}</h6>
                                            <Form.Check type="switch" id="switch1" label="Someone adds you as a connection" />
                                            <Form.Check type="switch" id="switch2" label="you're sent a direct message" defaultChecked/>
                                            <Form.Check type="switch" id="switch3" label="New membership approval" defaultChecked/>
                                            <Form.Check type="switch" id="switch4" label="Send Copy To Personal Email" defaultChecked/>
                                            <Form.Check type="switch" id="switch5" label="Tips on getting more out of PCT-themes" />
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className="mc-tab-card">
                                            <h6 className="mc-tab-card-title">{t('product_email_settings')}</h6>
                                            <Form.Check type="checkbox" id="check1" label="Someone adds you as a connection" defaultChecked/>
                                            <Form.Check type="checkbox" id="check2" label="you're sent a direct message" defaultChecked/>
                                            <Form.Check type="checkbox" id="check3" label="New membership approval" defaultChecked/>
                                            <Form.Check type="checkbox" id="check4" label="Send Copy To Personal Email" />
                                            <Form.Check type="checkbox" id="check5" label="Tips on getting more out of PCT-themes" />
                                        </div>
                                    </Col>
                                </Row>
                                <ButtonComponent className="mc-btn primary" icon="verified" text={t('update_changes')} />
                            </Tab> */}
                        </Tabs>
                    </div>
                </Col>
            </Row>
        </PageLayout>
    );
}
