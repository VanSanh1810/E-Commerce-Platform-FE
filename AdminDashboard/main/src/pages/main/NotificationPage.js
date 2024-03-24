import React, { useContext } from "react";
import { TranslatorContext } from "../../context/Translator";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { AnchorComponent, ButtonComponent } from "../../components/elements";
import PageLayout from "../../layouts/PageLayout";
import notifications from "../../assets/data/notifications.json";

export default function NotificationPage() {

    const { t } = useContext(TranslatorContext);

    return (
        <PageLayout>
            <div className="mc-card">
                <div className='mc-breadcrumb'>
                    <h3 className="mc-breadcrumb-title">{t('notifications')}</h3>
                    <ul className="mc-breadcrumb-list">
                        <li className="mc-breadcrumb-item"><Link to='#' className="mc-breadcrumb-link">{t('home')}</Link></li>
                        <li className="mc-breadcrumb-item">{t('notifications')}</li>
                    </ul>
                </div>
            </div>
            <div className="mc-card">
                <div className="mc-card-header">
                    <h4 className="mc-card-title">{t('all_notification')}</h4>
                    <Dropdown bsPrefix="mc-dropdown">
                        <Dropdown.Toggle bsPrefix="mc-dropdown-toggle">
                            <i className='material-icons'>more_horiz</i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu align="end" className="mc-dropdown-paper">
                            <button type='button' className='mc-dropdown-menu'><i className='material-icons'>delete</i><span>{t('delete_all')}</span></button>
                            <button type='button' className='mc-dropdown-menu'><i className='material-icons'>drafts</i><span>{t('mark_as_all_read')}</span></button>
                            <button type='button' className='mc-dropdown-menu'><i className='material-icons'>mark_as_unread</i><span>{t('mark_as_all_unread')}</span></button>
                            <button type='button' className='mc-dropdown-menu'><i className='material-icons'>near_me</i><span>{t('recent_notification')}</span></button>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <ul className="mc-notify-list">
                    {notifications.map((notification, index) => (
                        <li className="mc-notify-item" key={ index }>
                            <AnchorComponent className="mc-notify-content" to={ notification.path }>
                                <div className="mc-notify-media">
                                    <img src={ notification.notify.image } alt="alter" />
                                    <i className={`material-icons ${ notification.type }`}>{ notification.notify.icon }</i>
                                </div>
                                <div className="mc-notify-meta">
                                    <span dangerouslySetInnerHTML={{ __html: notification.note}} />
                                    <small>about few minutes ago!</small>
                                </div>
                            </AnchorComponent>
                            <ButtonComponent className="mc-notify-close">
                                <i className="material-icons">close</i>
                            </ButtonComponent>
                        </li>
                    ))}
                </ul>
            </div>
        </PageLayout>
    )
}