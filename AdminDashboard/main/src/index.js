import * as React from 'react';

// CSS & SCSS
import './assets/fonts/inter.css';
import './assets/fonts/material.css';
import './assets/fonts/icofont/icofont.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/sass/styles.scss';

// JS & COMPONENTS
import './i18n';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './context/Themes';
import { SidebarProvider } from './context/Sidebar';
import { LoaderProvider } from './context/Preloader';
import { TranslatorProvider } from './context/Translator';
import Routing from './routes/Routing';
import { Provider } from 'react-redux';
import { persistor, store } from './store/index';
import { PersistGate } from 'redux-persist/integration/react';
import App from './App';

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <ThemeProvider>
                    <LoaderProvider>
                        <TranslatorProvider>
                            <SidebarProvider>
                                <App />
                            </SidebarProvider>
                        </TranslatorProvider>
                    </LoaderProvider>
                </ThemeProvider>
            </PersistGate>
        </Provider>
    </React.StrictMode>,
);
