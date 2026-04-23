import React from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { NotificationProvider } from './Components/NotificationProvider';
import '../scss/app.scss';

createInertiaApp({
    title: (title) => title ? `${title} — SHOP HUB` : 'SHOP HUB',
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
        return pages[`./Pages/${name}.jsx`];
    },
    setup({ el, App, props }) {
        createRoot(el).render(
            <NotificationProvider>
                <App {...props} />
            </NotificationProvider>
        );
    },
    progress: {
        color: '#00F0FF',
        showSpinner: true,
    },
});
