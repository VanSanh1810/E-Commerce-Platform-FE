import React, { useContext, useState, useRef, useEffect } from 'react';

// CONTEXT
import { ThemeContext } from '../context/Themes';
import { SidebarContext } from '../context/Sidebar';
import { TranslatorContext } from '../context/Translator';

// COMPONENTS
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';

// DATA
import orders from '../assets/data/orders.json';
import messages from '../assets/data/messages.json';
import languages from '../assets/data/languages.json';
import notifications from '../assets/data/notifications.json';
import { useSelector } from 'react-redux';
import axiosInstance from '../configs/axiosInstance';
import { logout } from '../store/reducers/authReducer';
import { useDispatch } from 'react-redux';
import { SocketIOContext } from '../context/SocketIOContext';
import { clearNotificationList, initNotificationsList, setNotificationList } from '../store/reducers/notificationReducer';
import { current } from '@reduxjs/toolkit';

export default function HeaderLayout() {
    const dispatch = useDispatch();
    const { socket } = useContext(SocketIOContext);

    const { theme, toggleTheme } = useContext(ThemeContext);
    const { sidebar, toggleSidebar } = useContext(SidebarContext);
    const { t, n, c, changeLanguage, currentLanguage } = useContext(TranslatorContext);

    const { adminToken } = useSelector((state) => state.persistedReducer.authReducer);
    const { notificationList, newNotifiCount } = useSelector((state) => state.persistedReducer.notificationReducer);

    const searchRef = useRef();

    const [scroll, setScroll] = useState('fixed');
    const [search, setSearch] = useState('');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 0) setScroll('sticky');
        else setScroll('fixed');
    });

    document.addEventListener('mousedown', (event) => {
        if (!searchRef.current?.contains(event.target)) {
            setSearch('');
        }
    });

    const handleLogoutClick = async () => {
        try {
            const result = await axiosInstance.post('/api/auth/logout');
            console.log(result.data);
            dispatch(logout(''));
            dispatch(clearNotificationList());
        } catch (e) {
            console.log(e);
        }
    };

    const [userData, setUserData] = useState();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const result = await axiosInstance.get(`/api/user/${0}`);
                setUserData(result.data.data);
            } catch (e) {
                console.error(e);
            }
        };
        fetchUserData();
    }, [adminToken]);

    //notifications

    useEffect(() => {
        socket.on('receive-notify', async (notifyData) => {
            console.log(notifyData);
            dispatch(setNotificationList({ ...notifyData }));
        });
        return () => socket.off('receive-notify');
    }, [socket, dispatch]);

    useEffect(() => {
        const fetchNotify = async () => {
            try {
                const response = await axiosInstance.get('/api/notify');
                dispatch(initNotificationsList([...response.data.listNotify]));
            } catch (e) {
                console.error(e);
            }
        };
        fetchNotify();
    }, [adminToken, dispatch]);

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
        <header className={`mc-header ${scroll}`}>
            <Link to="/" className="mc-logo-group">
                <img src="/images/logo.webp" alt="logo" />
                <span>hotash</span>
            </Link>
            <div className="mc-header-group">
                <div className="mc-header-left">
                    <button type="button" className="mc-header-icon search" onClick={() => setSearch('show')}>
                        <i className="material-icons">search</i>
                    </button>
                    <button type="button" className="mc-header-icon toggle" onClick={toggleSidebar}>
                        <i className="material-icons">{sidebar ? 'menu_open' : 'menu'}</i>
                    </button>
                    {/* <div className={`mc-header-search-group ${search}`}>
                        <form className="mc-header-search" ref={searchRef}>
                            <button type="button" className="material-icons">
                                search
                            </button>
                            <input type="search" placeholder={t('quick_finding') + '...'} />
                        </form>
                    </div> */}
                </div>

                <div className="mc-header-right">
                    <button type="button" className="mc-header-icon theme" onClick={toggleTheme}>
                        <i className="material-icons">{theme}</i>
                    </button>

                    {/*================================
                            MESSAGE PART START
                    ================================*/}
                    <Dropdown className="message">
                        <Dropdown.Toggle className="mc-dropdown-toggle mc-header-icon">
                            <i className="material-icons">email</i>
                            <sup className="primary">{n(23)}</sup>
                        </Dropdown.Toggle>
                        <Dropdown.Menu align="end" className="mc-dropdown-paper">
                            <div className="mc-header-dropdown-group">
                                <div className="mc-card-header">
                                    <h4 className="mc-card-title">
                                        {t('messages') + ' '}({n(23)})
                                    </h4>
                                    <Dropdown bsPrefix="mc-dropdown">
                                        <Dropdown.Toggle bsPrefix="mc-dropdown-toggle">
                                            <i className="material-icons">settings</i>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu align="end" className="mc-dropdown-paper">
                                            <button type="button" className="mc-dropdown-menu">
                                                <i className="material-icons">drafts</i>
                                                <span>{t('mark_all_as_read')}</span>
                                            </button>
                                            <button type="button" className="mc-dropdown-menu">
                                                <i className="material-icons">markunread</i>
                                                <span>{t('mark_all_as_unread')}</span>
                                            </button>
                                            <button type="button" className="mc-dropdown-menu">
                                                <i className="material-icons">delete</i>
                                                <span>{t('delete_all_message')}</span>
                                            </button>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>

                                <ul className="mc-header-dropdown-list thin-scrolling">
                                    {messages?.map((message, index) => (
                                        <li key={index} className={`mc-header-dropdown-item`}>
                                            <Link to="#" className="mc-header-dropdown-content">
                                                <div className="mc-header-dropdown-message-media">
                                                    <div className="mc-round-avatar xs online">
                                                        <img src={message?.user?.image} alt="avatar" />
                                                    </div>
                                                </div>

                                                <div className="mc-header-dropdown-meta">
                                                    <h4>
                                                        <cite>{message?.name}</cite>
                                                        <time>{message?.shortMoment}</time>
                                                    </h4>
                                                    <p>{message?.chat}</p>
                                                </div>
                                            </Link>

                                            {message?.badge && <sup>{n(message?.badge)}</sup>}

                                            <Dropdown bsPrefix="mc-dropdown">
                                                <Dropdown.Toggle bsPrefix="mc-dropdown-toggle">
                                                    <i className="material-icons">more_vert</i>
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu align="end" className="mc-dropdown-paper">
                                                    <button type="button" className="mc-dropdown-menu">
                                                        <i className="material-icons">account_circle</i>
                                                        <span>{t('view_profile')}</span>
                                                    </button>
                                                    <button type="button" className="mc-dropdown-menu">
                                                        <i className="material-icons">mark_chat_read</i>
                                                        <span>{t('mark_as_unread')}</span>
                                                    </button>
                                                    <button type="button" className="mc-dropdown-menu">
                                                        <i className="material-icons">delete</i>
                                                        <span>{t('delete_message')}</span>
                                                    </button>
                                                    <button type="button" className="mc-dropdown-menu">
                                                        <i className="material-icons">remove_circle</i>
                                                        <span>{t('block_message')}</span>
                                                    </button>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </li>
                                    ))}
                                </ul>

                                <Link to="#" className="mc-btn primary mc-header-dropdown-button">
                                    {t('view_all_messages')}
                                </Link>
                            </div>
                        </Dropdown.Menu>
                    </Dropdown>
                    {/*================================
                            MESSAGE PART END
                    ================================*/}

                    {/*================================
                          NOTIFICATION PART START
                    ================================*/}
                    <Dropdown className="notify">
                        <Dropdown.Toggle className="mc-dropdown-toggle mc-header-icon">
                            <i className="material-icons">notifications</i>
                            {newNotifiCount > 0 ? <sup className="primary">{n(newNotifiCount)}</sup> : null}
                        </Dropdown.Toggle>
                        <Dropdown.Menu align="end" className="mc-dropdown-paper">
                            <div className="mc-header-dropdown-group">
                                <div className="mc-card-header">
                                    <h4 className="mc-card-title">
                                        {t('notifications') + ' '}
                                        {newNotifiCount > 0 ? `(${n(newNotifiCount)})` : null}
                                    </h4>
                                    <Dropdown bsPrefix="mc-dropdown">
                                        <Dropdown.Toggle bsPrefix="mc-dropdown-toggle">
                                            <i className="material-icons">settings</i>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu align="end" className="mc-dropdown-paper">
                                            <button
                                                type="button"
                                                className="mc-dropdown-menu"
                                                onClick={() => markAtReadAction(null, true)}
                                            >
                                                <i className="material-icons">drafts</i>
                                                <span>{t('mark_all_as_read')}</span>
                                            </button>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>

                                <ul className="mc-header-dropdown-list thin-scrolling">
                                    {notificationList?.map((notification, index) => (
                                        <li
                                            key={index}
                                            className={`mc-header-dropdown-item ${!notification?.isSeen ? 'active' : ''}`}
                                        >
                                            <Link
                                                to={
                                                    notification?.target?.type
                                                        ? getNotifyRoute(notification.target.type, notification.target.id)
                                                        : '#'
                                                }
                                                className="mc-header-dropdown-content"
                                            >
                                                <div className="mc-header-dropdown-notify-media">
                                                    {/* <img src={notification?.notify?.image} alt="avatar" /> */}
                                                    <i className={`material-icons ${notification?.target?.icon?.color}`}>
                                                        {notification?.target?.icon?.name}
                                                    </i>
                                                    {/* <img src={notification?.notify?.image} alt="avatar" />
                                                    <i className={`material-icons ${notification?.notify?.variant}`}>
                                                        {notification?.notify?.icon}
                                                    </i> */}
                                                </div>
                                                <div className="mc-header-dropdown-meta">
                                                    <h4>
                                                        <span dangerouslySetInnerHTML={{ __html: notification?.title }} />
                                                    </h4>
                                                    <p>{calculateTimeDifference(notification?.createDate)}</p>
                                                </div>
                                            </Link>

                                            <Dropdown bsPrefix="mc-dropdown">
                                                <Dropdown.Toggle bsPrefix="mc-dropdown-toggle">
                                                    <i className="material-icons">more_vert</i>
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

                                <Link to="/notification" className="mc-btn primary mc-header-dropdown-button">
                                    {t('view_all_notifications')}
                                </Link>
                            </div>
                        </Dropdown.Menu>
                    </Dropdown>
                    {/*================================
                          NOTIFICATION PART END
                    ================================*/}

                    {/*================================
                            PROFILE PART START
                    ================================*/}
                    <Dropdown className="mc-header-user">
                        <Dropdown.Toggle className="mc-dropdown-toggle">
                            {/* <Link to='#' className='mc-round-avatar xs'>
                                <img src="images/avatar/01.webp" alt='avatar' />
                            </Link> */}
                            <div className="mc-duel-text xs">
                                <h3 className="mc-duel-text-title">{userData?.name}</h3>
                                {/* <p className="mc-duel-text-descrip">@mironcoder</p> */}
                            </div>
                        </Dropdown.Toggle>
                        <Dropdown.Menu align="end" className="mc-dropdown-paper">
                            <Link to="/my-account" className="mc-dropdown-menu">
                                <i className="material-icons">store</i>
                                <span>{t('my shop')}</span>
                            </Link>
                            {/* <Link to="/forgot-password" className="mc-dropdown-menu">
                                <i className="material-icons">privacy_tip</i>
                                <span>{t('reset_password')}</span>
                            </Link> */}
                            <Link to="#" className="mc-dropdown-menu" onClick={handleLogoutClick}>
                                <i className="material-icons">lock</i>
                                <span>{t('logout')}</span>
                            </Link>
                        </Dropdown.Menu>
                    </Dropdown>
                    {/*================================
                            PROFILE PART END
                    ================================*/}
                </div>
            </div>
        </header>
    );
}
