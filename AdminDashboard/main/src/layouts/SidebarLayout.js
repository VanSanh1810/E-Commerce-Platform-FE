import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { TranslatorContext } from '../context/Translator';
import { SidebarContext } from '../context/Sidebar';
import sidenavs from '../assets/data/sidenavs.json';
import { useDispatch } from 'react-redux';
import { logout } from '../store/reducers/authReducer';
import axiosInstance from '../configs/axiosInstance';

export default function SidebarLayout() {
    const dispatch = useDispatch();

    const { t, n, currentLanguage } = useContext(TranslatorContext);
    const { sidebar } = useContext(SidebarContext);

    const handleLogoutClick = async () => {
        try {
            const result = await axiosInstance.post('/api/auth/logout');
            console.log(result.data);
            dispatch(logout(''));
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
            {sidenavs?.map((sidenav, sidenavIndex) => (
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
            ))}

            <div className="mc-sidebar-logout text-center">
                <button className="mc-btn primary sm" onClick={handleLogoutClick}>
                    <i className="material-icons">lock</i>
                    <span>{t('logout')}</span>
                </button>
            </div>
        </aside>
    );
}
