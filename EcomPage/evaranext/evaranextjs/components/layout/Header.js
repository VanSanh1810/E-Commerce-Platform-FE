import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Search from '../ecommerce/Search';
import axiosInstance from '../../config/axiosInstance';

const Header = ({ totalCartItems, totalCompareItems, toggleClick, totalWishlistItems, headerStyle, user }) => {
    const [isToggled, setToggled] = useState(false);
    const [scroll, setScroll] = useState(0);

    useEffect(() => {
        document.addEventListener('scroll', () => {
            const scrollCheck = window.scrollY >= 100;
            if (scrollCheck !== scroll) {
                setScroll(scrollCheck);
            }
        });
        const fetchCategory = async () => {
            try {
                const results = await axiosInstance.get('/api/category');
                console.log(results);
            } catch (err) {
                console.error(err);
            }
        };
        // fetchCategory();
    }, []);

    const handleToggle = () => setToggled(!isToggled);

    return (
        <>
            <header className={`header-area ${headerStyle} header-height-2`}>
                <div className="header-top header-top-ptb-1 d-none d-lg-block">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-xl-3 col-lg-4">
                                <div className="header-info">
                                    <ul>
                                        <li>
                                            <i className="fi-rs-smartphone"></i>
                                            <Link href="/#">
                                                <a>0838464006</a>
                                            </Link>
                                        </li>
                                        {/* <li>
                                            <i className="fi-rs-marker"></i>
                                            <Link href="/page-contact">
                                                <a>Our location</a>
                                            </Link>
                                        </li> */}
                                    </ul>
                                </div>
                            </div>
                            {/* <div className="col-xl-6 col-lg-4">
                                <div className="text-center">
                                    <div id="news-flash" className="d-inline-block">
                                        <ul>
                                            <li>
                                                Get great devices up to 50% off
                                                <Link href="/products/shop-grid-right">
                                                    <a> View details</a>
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div> */}
                            <div className="col-xl-9 col-lg-8">
                                <div className="header-info header-info-right">
                                    <ul>
                                        <li>
                                            <i className="fi-rs-vendor"></i>
                                            {user ? (
                                                <a href="http://localhost:3006" target="_blank">
                                                    Vendor Page
                                                </a>
                                            ) : null}
                                        </li>
                                        <li>
                                            <i className="fi-rs-user"></i>
                                            {user ? (
                                                <Link href="/page-account">
                                                    <a>Profile</a>
                                                </Link>
                                            ) : (
                                                <Link href="/page-login-register">
                                                    <a>Log In / Sign Up</a>
                                                </Link>
                                            )}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="header-middle header-middle-ptb-1 d-none d-lg-block">
                    <div className="container">
                        <div className="header-wrap">
                            <div className="logo logo-width-1 me-2">
                                <Link href="/">
                                    <a>
                                        <img
                                            src="/assets/imgs/theme/1.png"
                                            style={{ height: '70px', width: '225px', objectFit: 'cover', marginRight: '0px' }}
                                            alt="logo"
                                        />
                                    </a>
                                </Link>
                            </div>
                            <div className="header-right ms-2">
                                <div className="search-style-2">
                                    <Search />
                                </div>
                                <div className="header-action-right">
                                    <div className="header-action-2">
                                        {/* <div className="header-action-icon-2">
                                            <Link href="/shop-compare">
                                                <a>
                                                    <img
                                                        className="svgInject"
                                                        alt="Evara"
                                                        src="/assets/imgs/theme/icons/icon-compare.svg"
                                                    />
                                                    <span className="pro-count blue">{totalCompareItems}</span>
                                                </a>
                                            </Link>
                                        </div>
                                        <div className="header-action-icon-2">
                                            <Link href="/shop-wishlist">
                                                <a>
                                                    <img
                                                        className="svgInject"
                                                        alt="Evara"
                                                        src="/assets/imgs/theme/icons/icon-heart.svg"
                                                    />
                                                    <span className="pro-count blue">{totalWishlistItems}</span>
                                                </a>
                                            </Link>
                                        </div> */}
                                        <div className="header-action-icon-2">
                                            <Link href="/shop-cart">
                                                <a className="mini-cart-icon">
                                                    <img alt="Evara" src="/assets/imgs/theme/icons/icon-cart.svg" />
                                                    <span className="pro-count blue">{totalCartItems}</span>
                                                </a>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className={
                        scroll
                            ? 'header-bottom header-bottom-bg-color sticky-bar stick'
                            : 'header-bottom header-bottom-bg-color sticky-bar'
                    }
                >
                    <div className="container">
                        <div className="header-wrap header-space-between position-relative">
                            <div className="logo logo-width-1 d-block d-lg-none">
                                <Link href="/">
                                    <a>
                                        <img
                                            src="/assets/imgs/theme/1.png"
                                            style={{ height: '100px', width: '200px', objectFit: 'cover' }}
                                            alt="logo"
                                        />
                                    </a>
                                </Link>
                            </div>
                            <div className="header-nav d-none d-lg-flex">
                                <div className="main-menu main-menu-padding-1 main-menu-lh-2 d-none d-lg-block">
                                    <nav>
                                        <ul>
                                            <li>
                                                <Link href="/">
                                                    <a className="active">Home</a>
                                                </Link>
                                            </li>
                                            {/* <li>
                                                <Link href="/page-about">
                                                    <a>About</a>
                                                </Link>
                                            </li> */}
                                            <li>
                                                <Link href="/products/shop-grid-right">
                                                    <a>
                                                        Products
                                                        {/* <i className="fi-rs-angle-down"></i> */}
                                                    </a>
                                                </Link>
                                                {/* <ul className="sub-menu">
                                                    <li>
                                                        <Link href="/products/shop-grid-right">
                                                            <a>Shop Grid – Right Sidebar</a>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href="/products/">
                                                            <a>Shop Grid – Left Sidebar</a>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href="/products/shop-list-right">
                                                            <a>Shop List – Right Sidebar</a>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href="/products/shop-list-left">
                                                            <a>Shop List – Left Sidebar</a>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href="/products/shop-fullwidth">
                                                            <a>Shop - Wide</a>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href="/products/shop-filter">
                                                            <a>Shop - Filter</a>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href="/shop-wishlist">
                                                            <a>Shop – Wishlist</a>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href="/shop-cart">
                                                            <a>Shop – Cart</a>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href="/shop-checkout">
                                                            <a>Shop – Checkout</a>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href="/shop-compare">
                                                            <a>Shop – Compare</a>
                                                        </Link>
                                                    </li>
                                                </ul> */}
                                            </li>
                                            <li>
                                                <Link href={'/tracking-order-page'}>Tracking my order</Link>
                                            </li>
                                            {/* <li className="position-static">
                                                <Link href="/#">
                                                    <a>
                                                        Mega menu
                                                        <i className="fi-rs-angle-down"></i>
                                                    </a>
                                                </Link>
                                                <ul className="mega-menu">
                                                    <li className="sub-mega-menu sub-mega-menu-width-22">
                                                        <Link href="/#">
                                                            <a className="menu-title">Women's Fashion</a>
                                                        </Link>
                                                        <ul>
                                                            <li>
                                                                <Link href="/products/shop-grid-right">
                                                                    <a>Dresses</a>
                                                                </Link>
                                                            </li>
                                                            <li>
                                                                <Link href="/products/shop-grid-right">
                                                                    <a>Blouses & Shirts</a>
                                                                </Link>
                                                            </li>
                                                            <li>
                                                                <Link href="/products/shop-grid-right">
                                                                    <a>Hoodies & Sweatshirts</a>
                                                                </Link>
                                                            </li>
                                                            <li>
                                                                <Link href="/products/shop-grid-right">
                                                                    <a>Wedding Dresses</a>
                                                                </Link>
                                                            </li>
                                                            <li>
                                                                <Link href="/products/shop-grid-right">
                                                                    <a>Prom Dresses</a>
                                                                </Link>
                                                            </li>
                                                            <li>
                                                                <Link href="/products/shop-grid-right">
                                                                    <a>Cosplay Costumes</a>
                                                                </Link>
                                                            </li>
                                                        </ul>
                                                    </li>
                                                    <li className="sub-mega-menu sub-mega-menu-width-22">
                                                        <Link href="/#">
                                                            <a className="menu-title">Men's Fashion</a>
                                                        </Link>
                                                        <ul>
                                                            <li>
                                                                <Link href="/products/shop-grid-right">
                                                                    <a>Jackets</a>
                                                                </Link>
                                                            </li>
                                                            <li>
                                                                <Link href="/products/shop-grid-right">
                                                                    <a>Casual Faux Leather</a>
                                                                </Link>
                                                            </li>
                                                            <li>
                                                                <Link href="/products/shop-grid-right">
                                                                    <a>Genuine Leather</a>
                                                                </Link>
                                                            </li>
                                                            <li>
                                                                <Link href="/products/shop-grid-right">
                                                                    <a>Casual Pants</a>
                                                                </Link>
                                                            </li>
                                                            <li>
                                                                <Link href="/products/shop-grid-right">
                                                                    <a>Sweatpants</a>
                                                                </Link>
                                                            </li>
                                                            <li>
                                                                <Link href="/products/shop-grid-right">
                                                                    <a>Harem Pants</a>
                                                                </Link>
                                                            </li>
                                                        </ul>
                                                    </li>
                                                    <li className="sub-mega-menu sub-mega-menu-width-22">
                                                        <Link href="/#">
                                                            <a className="menu-title">Technology</a>
                                                        </Link>
                                                        <ul>
                                                            <li>
                                                                <Link href="/products/shop-grid-right">
                                                                    <a>Gaming Laptops</a>
                                                                </Link>
                                                            </li>
                                                            <li>
                                                                <Link href="/products/shop-grid-right">
                                                                    <a>Ultraslim Laptops</a>
                                                                </Link>
                                                            </li>
                                                            <li>
                                                                <Link href="/products/shop-grid-right">
                                                                    <a>Tablets</a>
                                                                </Link>
                                                            </li>
                                                            <li>
                                                                <Link href="/products/shop-grid-right">
                                                                    <a>Laptop Accessories</a>
                                                                </Link>
                                                            </li>
                                                            <li>
                                                                <Link href="/products/shop-grid-right">
                                                                    <a>Tablet Accessories</a>
                                                                </Link>
                                                            </li>
                                                        </ul>
                                                    </li>
                                                    <li className="sub-mega-menu sub-mega-menu-width-34">
                                                        <div className="menu-banner-wrap">
                                                            <Link href="/products/shop-grid-right">
                                                                <a>
                                                                    <img src="/assets/imgs/banner/menu-banner.jpg" alt="Evara" />
                                                                </a>
                                                            </Link>
                                                            <div className="menu-banner-content">
                                                                <h4>Hot deals</h4>
                                                                <h3>
                                                                    Don't miss
                                                                    <br />
                                                                    Trending
                                                                </h3>
                                                                <div className="menu-banner-price">
                                                                    <span className="new-price text-success">Save to 50%</span>
                                                                </div>
                                                                <div className="menu-banner-btn">
                                                                    <Link href="/products/shop-grid-right">
                                                                        <a>Shop now</a>
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                            <div className="menu-banner-discount">
                                                                <h3>
                                                                    <span>35%</span>
                                                                    off
                                                                </h3>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </li>
                                            <li>
                                                <Link href="/#">
                                                    <a>
                                                        Pages
                                                        <i className="fi-rs-angle-down"></i>
                                                    </a>
                                                </Link>
                                                <ul className="sub-menu">
                                                    <li>
                                                        <Link href="/page-about">
                                                            <a>About Us</a>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href="/page-contact">
                                                            <a>Contact</a>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href="/page-account">
                                                            <a>My Account</a>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href="/page-login-register">
                                                            <a>login/register</a>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href="/page-purchase-guide">
                                                            <a>Purchase Guide</a>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href="/page-privacy-policy">
                                                            <a>Privacy Policy</a>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href="/page-terms">
                                                            <a>Terms of Service</a>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href="/page-404">
                                                            <a>404 Page</a>
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </li>
                                            <li>
                                                <Link href="/page-contact">
                                                    <a>Contact</a>
                                                </Link>
                                            </li> */}
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                            <div className="hotline d-none d-lg-block">
                                <p>
                                    <i className="fi-rs-headset"></i>
                                    <span>Hotline</span> 1900 - 888
                                </p>
                            </div>
                            {/* <p className="mobile-promotion">
                                Happy
                                <span className="text-brand">Mother's Day</span>. Big Sale Up to 40%
                            </p> */}
                            <div className="header-action-right d-block d-lg-none">
                                <div className="header-action-2">
                                    <div className="header-action-icon-2">
                                        <Link href="/shop-cart">
                                            <a className="mini-cart-icon">
                                                <img alt="Evara" src="/assets/imgs/theme/icons/icon-cart.svg" />
                                                <span className="pro-count white">{totalCartItems}</span>
                                            </a>
                                        </Link>
                                        <div className="cart-dropdown-wrap cart-dropdown-hm2">
                                            <ul>
                                                <li>
                                                    <div className="shopping-cart-img">
                                                        <Link href="/products/shop-grid-right">
                                                            <a>
                                                                <img alt="Evara" src="/assets/imgs/shop/thumbnail-3.jpg" />
                                                            </a>
                                                        </Link>
                                                    </div>
                                                    <div className="shopping-cart-title">
                                                        <h4>
                                                            <Link href="/products/shop-grid-right">
                                                                <a>Plain Striola Shirts</a>
                                                            </Link>
                                                        </h4>
                                                        <h3>
                                                            <span>1 × </span>
                                                            $800.00
                                                        </h3>
                                                    </div>
                                                    <div className="shopping-cart-delete">
                                                        <Link href="/#">
                                                            <a>
                                                                <i className="fi-rs-cross-small"></i>
                                                            </a>
                                                        </Link>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="shopping-cart-img">
                                                        <Link href="/products/shop-grid-right">
                                                            <a>
                                                                <img alt="Evara" src="/assets/imgs/shop/thumbnail-4.jpg" />
                                                            </a>
                                                        </Link>
                                                    </div>
                                                    <div className="shopping-cart-title">
                                                        <h4>
                                                            <Link href="/products/shop-grid-right">
                                                                <a>Macbook Pro 2022</a>
                                                            </Link>
                                                        </h4>
                                                        <h3>
                                                            <span>1 × </span>
                                                            $3500.00
                                                        </h3>
                                                    </div>
                                                    <div className="shopping-cart-delete">
                                                        <Link href="/#">
                                                            <a>
                                                                <i className="fi-rs-cross-small"></i>
                                                            </a>
                                                        </Link>
                                                    </div>
                                                </li>
                                            </ul>
                                            <div className="shopping-cart-footer">
                                                <div className="shopping-cart-total">
                                                    <h4>
                                                        Total
                                                        <span>$383.00</span>
                                                    </h4>
                                                </div>
                                                <div className="shopping-cart-button">
                                                    <Link href="/shop-cart">
                                                        <a>View cart</a>
                                                    </Link>
                                                    <Link href="/shop-checkout">
                                                        <a>Checkout</a>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="header-action-icon-2 d-block d-lg-none">
                                        <div className="burger-icon burger-icon-white" onClick={toggleClick}>
                                            <span className="burger-icon-top"></span>
                                            <span className="burger-icon-mid"></span>
                                            <span className="burger-icon-bottom"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};

const mapStateToProps = (state) => ({
    totalCartItems: state.cart.length,
    totalCompareItems: state.compare.items.length,
    totalWishlistItems: state.wishlist.items.length,
    user: state.user,
});

export default connect(mapStateToProps, null)(Header);
