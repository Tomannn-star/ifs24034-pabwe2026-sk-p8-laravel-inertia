import '../css/app.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

const appName = import.meta.env.VITE_APP_NAME || 'BlogVerse Pro';

function initApp() {
    const el = document.getElementById('app');
    const scriptEl = document.querySelector('script[data-page="app"][type="application/json"]');
    let initialPage = undefined;

    if (scriptEl && scriptEl.textContent) {
        try {
            initialPage = JSON.parse(scriptEl.textContent);
        } catch (e) {
            console.error('Failed to parse script data-page', e);
        }
    } else if (el && el.dataset && el.dataset.page) {
        try {
            initialPage = JSON.parse(el.dataset.page);
        } catch (e) {
            console.error('Failed to parse dataset page', e);
        }
    }

    createInertiaApp({
        title: (title) => (title ? `${title} - ${appName}` : appName),
        page: initialPage,
        resolve: (name) =>
            resolvePageComponent(
                `./Pages/${name}.jsx`,
                import.meta.glob('./Pages/**/*.jsx'),
            ),
        setup({ el, App, props }) {
            const root = createRoot(el);
            root.render(<App {...props} />);
        },
        progress: {
            color: '#2563eb',
            showSpinner: true,
        },
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
