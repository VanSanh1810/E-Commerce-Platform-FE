import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Private from './Private';
import { ErrorPage } from '../pages/others';
import {
    AnalyticsPage,
    CRMPage,
    CategoryPage,
    EcommercePage,
    InvoiceDetailsPage,
    InvoiceListPage,
    MyAccountPage,
    NotificationPage,
    OrderListPage,
    ProductListPage,
    ProductUploadPage,
    ProductViewPage,
    UserListPage,
    UserProfilePage,
} from '../pages/main';
import Private2 from './Private2';
import { LoginPage, RegisterPage } from '../pages/auth';
import ShopListPage from '../pages/main/ShopListPage';
import ShopProfilePage from '../pages/main/ShopProfilePage';
import ReportListPage from '../pages/main/ReportListPage';

function Routing() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/register"
                        element={
                            <Private2>
                                <RegisterPage />
                            </Private2>
                        }
                    />

                    <Route
                        path="/login"
                        element={
                            <Private2>
                                <LoginPage />
                            </Private2>
                        }
                    />

                    <Route
                        path="user/:uid"
                        element={
                            <Private roleAllow={'admin'}>
                                <UserProfilePage />
                            </Private>
                        }
                    />
                    <Route
                        path="user"
                        element={
                            <Private roleAllow={'admin'}>
                                <UserListPage />
                            </Private>
                        }
                    />

                    <Route
                        path="shop/:uid"
                        element={
                            <Private roleAllow={'admin'}>
                                <ShopProfilePage />
                            </Private>
                        }
                    />
                    <Route
                        path="shop"
                        element={
                            <Private roleAllow={'admin'}>
                                <ShopListPage />
                            </Private>
                        }
                    />
                    <Route
                        path="my-account"
                        element={
                            <Private roleAllow={'vendor'}>
                                <MyAccountPage />
                            </Private>
                        }
                    />

                    <Route
                        path="product/:productId"
                        element={
                            <Private>
                                <ProductViewPage />
                            </Private>
                        }
                    />
                    <Route
                        path="product"
                        element={
                            <Private>
                                <ProductListPage />
                            </Private>
                        }
                    />

                    <Route
                        path="product-upload/:productId"
                        element={
                            <Private roleAllow={'vendor'}>
                                <ProductUploadPage />
                            </Private>
                        }
                    />

                    <Route
                        path="product-upload"
                        element={
                            <Private roleAllow={'vendor'}>
                                <ProductUploadPage />
                            </Private>
                        }
                    />

                    <Route
                        path="invoice"
                        element={
                            <Private roleAllow={'vendor'}>
                                <InvoiceListPage />
                            </Private>
                        }
                    />
                    <Route
                        path="order"
                        element={
                            <Private roleAllow={'vendor'}>
                                <OrderListPage />
                            </Private>
                        }
                    />
                    <Route
                        path="order/:orderId"
                        element={
                            <Private roleAllow={'vendor'}>
                                <InvoiceDetailsPage />
                            </Private>
                        }
                    />

                    <Route
                        path="notification"
                        element={
                            <Private>
                                <NotificationPage />
                            </Private>
                        }
                    />
                    <Route
                        path="category"
                        element={
                            <Private roleAllow={'admin'}>
                                <CategoryPage />
                            </Private>
                        }
                    />

                    <Route
                        path="report/:reportId"
                        element={
                            <Private roleAllow={'admin'}>
                                <CategoryPage />
                            </Private>
                        }
                    />
                    <Route
                        path="report"
                        element={
                            <Private roleAllow={'admin'}>
                                <ReportListPage />
                            </Private>
                        }
                    />

                    <Route
                        exact
                        path="/"
                        element={
                            <Private>
                                <EcommercePage />
                            </Private>
                        }
                    ></Route>

                    <Route path="*" element={<ErrorPage />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default Routing;
