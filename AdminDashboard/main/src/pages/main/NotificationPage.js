import React, { useContext } from 'react';
import { TranslatorContext } from '../../context/Translator';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { AnchorComponent, ButtonComponent } from '../../components/elements';
import PageLayout from '../../layouts/PageLayout';
import notifications from '../../assets/data/notifications.json';
import { useSelector } from 'react-redux';
import axiosInstance from '../../configs/axiosInstance';
import { useDispatch } from 'react-redux';
import { initNotificationsList } from '../../store/reducers/notificationReducer';

export default function NotificationPage() {
    const dispatch = useDispatch();

    const { notificationList, newNotifiCount } = useSelector((state) => state.persistedReducer.notificationReducer);

    const { t } = useContext(TranslatorContext);

    const calculateTimeDifference = (referenceTimestamp) => {
        // Lấy thời điểm hiện tại
        const currentTime = new Date().getTime();

        // Chênh lệch thời gian giữa thời điểm hiện tại và thời điểm mốc
        const timeDiff = currentTime - referenceTimestamp;

        // Chuyển đổi thời gian chênh lệch thành phút
        const minutesDiff = Math.floor(timeDiff / (60 * 1000));

        if (minutesDiff <= 5) {
            return `Just now`;
        } else if (minutesDiff < 60) {
            return `${minutesDiff} minutes ago`;
        } else if (minutesDiff < 24 * 60) {
            const hoursDiff = Math.floor(minutesDiff / 60);
            return `${hoursDiff} hours ago`;
        } else {
            // Format lại thời gian mốc thành ngày/giờ/phút
            const referenceDate = new Date(referenceTimestamp);
            const formattedDate = referenceDate.toLocaleString();

            return `${formattedDate}`;
        }
    };

    const getNotifyRoute = (type, id) => {
        switch (type) {
            case 'Review':
                return `/product/${1}`;
            case 'Order':
                return `/order/${id}`;
            case 'Report':
                return `/report/${id}`;
            case 'Product':
                return `/product/${id}`;
            default:
                return '#';
        }
    };

    const markAtReadAction = async (_id, readedAction) => {
        // alert(_id);
        try {
            const response = await axiosInstance.post('/api/notify', {
                listNotify: _id ? [_id] : null,
                readedAction: readedAction,
            });
            dispatch(initNotificationsList([...response.data.newListNotify]));
        } catch (e) {
            console.error(e);
        }
    };
    const deleteNotifyAction = async (_id) => {
        try {
            const response = await axiosInstance.delete(`/api/notify/${_id}`);
            dispatch(initNotificationsList([...response.data.newListNotify]));
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <PageLayout>
            <div className="mc-card">
                <div className="mc-breadcrumb">
                    <h3 className="mc-breadcrumb-title">{t('notifications')}</h3>
                    <ul className="mc-breadcrumb-list">
                        <li className="mc-breadcrumb-item">
                            <Link to="#" className="mc-breadcrumb-link">
                                {t('home')}
                            </Link>
                        </li>
                        <li className="mc-breadcrumb-item">{t('notifications')}</li>
                    </ul>
                </div>
            </div>
            <div className="mc-card">
                <div className="mc-card-header">
                    <h4 className="mc-card-title">{t('all_notification')}</h4>
                    <Dropdown bsPrefix="mc-dropdown">
                        <Dropdown.Toggle bsPrefix="mc-dropdown-toggle">
                            <i className="material-icons">settings</i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu align="end" className="mc-dropdown-paper">
                            <button type="button" className="mc-dropdown-menu" onClick={() => markAtReadAction(null, true)}>
                                <i className="material-icons">drafts</i>
                                <span>{t('mark_all_as_read')}</span>
                            </button>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <ul className="mc-notify-list">
                    {notificationList.map((notification, index) => (
                        <li className={`mc-notify-item ${!notification?.isSeen ? 'active' : ''} pt-3 rounded`} key={index}>
                            <Link
                                className="mc-notify-content"
                                to={
                                    notification?.target?.type
                                        ? getNotifyRoute(notification.target.type, notification.target.id)
                                        : '#'
                                }
                            >
                                <div className="mc-notify-media">
                                    {/* <img src={ notification.notify.image } alt="alter" /> */}
                                    <i className={`material-icons ${notification?.target?.icon?.color}`}>
                                        {notification?.target?.icon?.name}
                                    </i>
                                </div>
                                <div className="mc-notify-meta">
                                    <span dangerouslySetInnerHTML={{ __html: notification?.title }} />
                                    <small>{calculateTimeDifference(notification?.createDate)}</small>
                                </div>
                            </Link>
                            <Dropdown bsPrefix="mc-dropdown">
                                <Dropdown.Toggle bsPrefix="mc-dropdown-toggle">
                                    <i className="material-icons">more_horiz</i>
                                </Dropdown.Toggle>
                                <Dropdown.Menu align="end" className="mc-dropdown-paper">
                                    <button
                                        type="button"
                                        className="mc-dropdown-menu"
                                        onClick={() => markAtReadAction(notification._id, true)}
                                    >
                                        <i className="material-icons">mark_chat_read</i>
                                        <span>{t('mark as read')}</span>
                                    </button>
                                    <button
                                        type="button"
                                        className="mc-dropdown-menu"
                                        onClick={() => markAtReadAction(notification._id, false)}
                                    >
                                        <i className="material-icons">mark_chat_unread</i>
                                        <span>{t('mark_as_unread')}</span>
                                    </button>
                                    <button
                                        type="button"
                                        className="mc-dropdown-menu"
                                        onClick={() => deleteNotifyAction(notification._id)}
                                    >
                                        <i className="material-icons">delete</i>
                                        <span>{t('delete_notification')}</span>
                                    </button>
                                </Dropdown.Menu>
                            </Dropdown>
                        </li>
                    ))}
                </ul>
            </div>
        </PageLayout>
    );
}
