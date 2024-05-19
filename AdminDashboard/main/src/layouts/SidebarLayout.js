import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { TranslatorContext } from '../context/Translator';
import { SidebarContext } from '../context/Sidebar';
import sidenavs from '../assets/data/sidenavs.json';
import { useDispatch } from 'react-redux';
import { logout } from '../store/reducers/authReducer';
import axiosInstance from '../configs/axiosInstance';
import { clearNotificationList } from '../store/reducers/notificationReducer';
import { useSelector } from 'react-redux';

export default function SidebarLayout() {
    const dispatch = useDispatch();

    const { t, n, currentLanguage } = useContext(TranslatorContext);
    const { sidebar } = useContext(SidebarContext);
    const { newNotifiCount, newMessCount } = useSelector((state) => state.persistedReducer.notificationReducer);
    const { isVendor } = useSelector((state) => state.persistedReducer.authReducer);

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

    const handleDropdown = (event) => {
        const buttonElement = event.currentTarget;
        const itemElement = buttonElement.parentElement;
        const isActive = itemElement.classList.contains('active');
        const allItems = document.querySelectorAll('.mc-sidebar-menu-item');
        const allDropdowns = document.querySelectorAll('.mc-sidebar-dropdown-list');
        const dropdownElement = itemElement.querySelector('.mc-sidebar-dropdown-list');

        if (isActive) {
            itemElement.classList.remove('active');
            dropdownElement.style.height = '0px';
        } else {
            allItems.forEach((item) => item.classList.remove('active'));
            allDropdowns.forEach((dropdown) => (dropdown.style.height = '0px'));

            itemElement.classList.add('active');
            dropdownElement.style.height = dropdownElement.scrollHeight + 'px';
        }
    };

    return (
        <aside as="aside" className={`mc-sidebar thin-scrolling ${sidebar && 'active'}`}>
            <menu className="mc-sidebar-menu">
                <h5 className="mc-sidebar-menu-title">{'navigation'}</h5>
                <ul className="mc-sidebar-menu-list">
                    {/* dashboard */}
                    <li className="mc-sidebar-menu-item">
                        <button type="button" className="mc-sidebar-menu-btn" onClick={handleDropdown}>
                            <i className="material-icons">{'dashboard'}</i>
                            <span>{'dashboard'}</span>
                            {/* <sup className={'red square'}>{'hot'}</sup> */}
                            <small className="material-icons right">{'chevron_right'}</small>
                        </button>
                        <ul className="mc-sidebar-dropdown-list">
                            <li className="mc-sidebar-dropdown-item">
                                <Link to={'/'} className="mc-sidebar-dropdown-link">
                                    {'ecommerce'}
                                </Link>
                            </li>
                        </ul>
                    </li>
                    {/* user */}
                    {!isVendor ? (
                        <li className="mc-sidebar-menu-item">
                            <button type="button" className="mc-sidebar-menu-btn" onClick={handleDropdown}>
                                <i className="material-icons">{'account_circle'}</i>
                                <span>{'users'}</span>
                                {/* <sup className={'red square'}>{'hot'}</sup> */}
                                <small className="material-icons right">{'chevron_right'}</small>
                            </button>
                            <ul className="mc-sidebar-dropdown-list">
                                <li className="mc-sidebar-dropdown-item">
                                    <Link to={'/user'} className="mc-sidebar-dropdown-link">
                                        {'user list'}
                                    </Link>
                                </li>
                            </ul>
                        </li>
                    ) : null}
                    {/* product */}
                    <li className="mc-sidebar-menu-item">
                        <button type="button" className="mc-sidebar-menu-btn" onClick={handleDropdown}>
                            <i className="material-icons">{'pix'}</i>
                            <span>{'products'}</span>
                            {/* <sup className={'purple square'}>{'new'}</sup> */}
                            <small className="material-icons right">{'chevron_right'}</small>
                        </button>
                        <ul className="mc-sidebar-dropdown-list">
                            <li className="mc-sidebar-dropdown-item">
                                <Link to={'/product'} className="mc-sidebar-dropdown-link">
                                    {'product list'}
                                </Link>
                            </li>
                            <li className="mc-sidebar-dropdown-item">
                                {isVendor ? (
                                    <Link to={'/product-upload'} className="mc-sidebar-dropdown-link">
                                        {'product upload'}
                                    </Link>
                                ) : null}
                            </li>
                            <li className="mc-sidebar-dropdown-item">
                                {!isVendor ? (
                                    <Link to={'/category'} className="mc-sidebar-dropdown-link">
                                        {'category'}
                                    </Link>
                                ) : null}
                            </li>
                            <li className="mc-sidebar-dropdown-item">
                                {!isVendor ? (
                                    <Link to={'/shipCost'} className="mc-sidebar-dropdown-link">
                                        {'Ship cost'}
                                    </Link>
                                ) : null}
                            </li>
                        </ul>
                    </li>
                    {/* shop */}
                    {!isVendor ? (
                        <li className="mc-sidebar-menu-item">
                            <Link to={'/shop'} className="mc-sidebar-menu-btn">
                                <i className="material-icons">{'store'}</i>
                                <span>{'shops'}</span>
                            </Link>
                        </li>
                    ) : null}

                    {/* invoice */}
                    {/* <li className="mc-sidebar-menu-item">
                        <button type="button" className="mc-sidebar-menu-btn" onClick={handleDropdown}>
                            <i className="material-icons">{'article'}</i>
                            <span>{'invoices'}</span>
                            <small className="material-icons right">{'chevron_right'}</small>
                        </button>
                        <ul className="mc-sidebar-dropdown-list">
                            <li className="mc-sidebar-dropdown-item">
                                <Link to={'/invoice'} className="mc-sidebar-dropdown-link">
                                    {'invoice_list'}
                                </Link>
                            </li>
                        </ul>
                    </li> */}
                    {/* order */}
                    {isVendor ? (
                        <li className="mc-sidebar-menu-item">
                            <Link to={'/order'} className="mc-sidebar-menu-btn">
                                <i className="material-icons">{'shopping_cart'}</i>
                                <span>{'orders'}</span>
                                {/* <sup className={'primary square'}>{5}</sup> */}
                            </Link>
                        </li>
                    ) : null}
                    {/* report */}
                    {!isVendor ? (
                        <li className="mc-sidebar-menu-item">
                            <Link to={'/report'} className="mc-sidebar-menu-btn">
                                <i className="material-icons">{'warning'}</i>
                                <span>{'Reports'}</span>
                                {/* <sup className={'primary square'}>{5}</sup> */}
                            </Link>
                        </li>
                    ) : null}
                    {/* banner */}
                    {!isVendor ? (
                        <li className="mc-sidebar-menu-item">
                            <Link to={'/banner'} className="mc-sidebar-menu-btn">
                                <i className="material-icons">{'percent'}</i>
                                <span>{'Banner'}</span>
                                {/* <sup className={'primary square'}>{9}</sup> */}
                            </Link>
                        </li>
                    ) : null}
                    {/* notify */}
                    <li className="mc-sidebar-menu-item">
                        <Link to={'/notification'} className="mc-sidebar-menu-btn">
                            <i className="material-icons">{'notifications'}</i>
                            <span>{'notifications'}</span>
                            {newNotifiCount > 0 ? <sup className={'primary square'}>{newNotifiCount}</sup> : null}
                        </Link>
                    </li>
                    {/* message */}
                    <li className="mc-sidebar-menu-item">
                        <Link to={'/message'} className="mc-sidebar-menu-btn">
                            <i className="material-icons">{'chat_bubble'}</i>
                            <span>{'Message'}</span>
                            {newMessCount > 0 ? <sup className={'primary square'}>{newMessCount}</sup> : null}
                        </Link>
                    </li>
                </ul>
            </menu>

            {/* //////////////////////////////////////////////////////////////// */}
            {/* {sidenavs?.map((sidenav, sidenavIndex) => (
                <menu key={sidenavIndex} className="mc-sidebar-menu">
                    <h5 className="mc-sidebar-menu-title">{t(sidenav.title)}</h5>
                    <ul className="mc-sidebar-menu-list">
                        {sidenav.menus.map((menu, menuIndex) => (
                            <li key={menuIndex} className="mc-sidebar-menu-item">
                                {menu.submenus ? (
                                    <>
                                        <button type="button" className="mc-sidebar-menu-btn" onClick={handleDropdown}>
                                            <i className="material-icons">{menu.icon}</i>
                                            <span>{t(menu.text)}</span>
                                            {menu.badge?.text && <sup className={menu.badge.variant}>{t(menu.badge.text)}</sup>}
                                            {menu.badge?.count && <sup className={menu.badge.variant}>{n(menu.badge.count)}</sup>}
                                            {currentLanguage?.dir === 'ltr' ? (
                                                <small className="material-icons right">chevron_right</small>
                                            ) : (
                                                <small className="material-icons left">chevron_left</small>
                                            )}
                                        </button>

                                        <ul className="mc-sidebar-dropdown-list">
                                            {menu.submenus.map((submenu, submenusIndex) => (
                                                <li key={submenusIndex} className="mc-sidebar-dropdown-item">
                                                    <Link to={submenu.path} className="mc-sidebar-dropdown-link">
                                                        {t(submenu.text)}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                ) : (
                                    <Link to={menu.path} className="mc-sidebar-menu-btn">
                                        <i className="material-icons">{menu.icon}</i>
                                        <span>{t(menu.text)}</span>
                                        {menu.badge?.count && <sup className={menu.badge.variant}>{n(menu.badge.count)}</sup>}
                                        {menu.badge?.text && <sup className={menu.badge.variant}>{t(menu.badge.text)}</sup>}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </menu>
            ))} */}

            <div className="mc-sidebar-logout text-center">
                <button className="mc-btn primary sm" onClick={handleLogoutClick}>
                    <i className="material-icons">lock</i>
                    <span>{t('logout')}</span>
                </button>
            </div>
        </aside>
    );
}
