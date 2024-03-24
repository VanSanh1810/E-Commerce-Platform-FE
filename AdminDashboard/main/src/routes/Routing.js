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
                            <Private>
                                <UserProfilePage />
                            </Private>
                        }
                    />
                    <Route
                        path="user"
                        element={
                            <Private>
                                <UserListPage />
                            </Private>
                        }
                    />
                    <Route
                        path="my-account"
                        element={
                            <Private>
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
                            <Private>
                                <ProductUploadPage />
                            </Private>
                        }
                    />

                    <Route
                        path="product-upload"
                        element={
                            <Private>
                                <ProductUploadPage />
                            </Private>
                        }
                    />

                    <Route
                        path="invoice/:invoiceId"
                        element={
                            <Private>
                                <InvoiceDetailsPage />
                            </Private>
                        }
                    />
                    <Route
                        path="invoice"
                        element={
                            <Private>
                                <InvoiceListPage />
                            </Private>
                        }
                    />
                    <Route
                        path="order"
                        element={
                            <Private>
                                <OrderListPage />
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
                            <Private>
                                <CategoryPage />
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
