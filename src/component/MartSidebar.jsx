import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getAssetUrl, getSignedInUserType, loadStoreSettings } from '../services/martBillingApi';

const links = [
    { to: '/', label: 'Dashboard', icon: 'ri-dashboard-line', end: true, allowedTypes: ['super admin', 'admin'] },
    { to: '/invoice-create', label: 'Billing', icon: 'ri-shopping-cart-2-line', allowedTypes: ['super admin', 'admin', 'staff'] },
    { to: '/invoice-list', label: 'All invoices', icon: 'ri-receipt-line', allowedTypes: ['super admin', 'admin', 'staff'] },
    { to: '/barcode-generation', label: 'Barcode generation', icon: 'ri-barcode-line', allowedTypes: ['super admin', 'admin', 'staff'] },
    { to: '/categories', label: 'Categories', icon: 'ri-price-tag-3-line', allowedTypes: ['super admin', 'admin'] },
    { to: '/items', label: 'Items', icon: 'ri-shopping-basket-2-line', allowedTypes: ['super admin', 'admin'] },
    { to: '/store-settings', label: 'Store settings', icon: 'ri-settings-3-line', allowedTypes: ['super admin', 'admin'] },
    { to: '/customers', label: 'Customers', icon: 'ri-group-line', allowedTypes: ['super admin', 'admin', 'staff'] },
    { to: '/customer-balances', label: 'Customer balances', icon: 'ri-wallet-3-line', allowedTypes: ['super admin', 'admin', 'staff'] },
    { to: '/users', label: 'Users', icon: 'ri-user-settings-line', allowedTypes: ['super admin'] },
];

export default function MartSidebar({ open, onClose }) {
    const { pathname } = useLocation();
    const userType = getSignedInUserType();
    const [storeSettings, setStoreSettings] = React.useState({ mart_name: 'Mart Billing', logo_path: null });
    const [settingsError, setSettingsError] = React.useState('');

    React.useEffect(() => {
        let active = true;
        const refreshSettings = () => loadStoreSettings()
            .then((settings) => {
                if (active) {
                    setStoreSettings(settings);
                    setSettingsError('');
                }
            })
            .catch((error) => {
                if (active) setSettingsError(error.message || 'Unable to load store identity.');
            });
        const onSettingsUpdated = (event) => setStoreSettings(event.detail);
        refreshSettings();
        window.addEventListener('mart:store-settings-updated', onSettingsUpdated);
        return () => {
            active = false;
            window.removeEventListener('mart:store-settings-updated', onSettingsUpdated);
        };
    }, []);

    return (
        <>
            {open && <button className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={onClose} type="button" aria-label="Close navigation" />}
            <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-black/5 bg-white transition-transform dark:border-white/10 dark:bg-gray lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
                <Link className="flex h-16 min-w-0 items-center gap-3 border-b border-black/5 px-5 dark:border-white/10" to="/" onClick={onClose}>
                    {storeSettings.logo_path
                        ? <img alt="" className="h-9 w-9 shrink-0 rounded-lg object-contain" src={getAssetUrl(storeSettings.logo_path)} />
                        : <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-white"><i className="ri-store-2-line text-xl" /></span>}
                    <span className="truncate text-sm font-bold text-black dark:text-white">{storeSettings.mart_name}</span>
                </Link>
                <nav aria-label="Main navigation" className="flex-1 space-y-1 overflow-y-auto p-4">
                    <p className="mb-3 px-3 pt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-black/35 dark:text-white/35">Store</p>
                    {links.filter((link) => link.allowedTypes.includes(userType)).map((link) => {
                        const active = link.end ? pathname === '/' : pathname === link.to || pathname.startsWith(`${link.to}/`);
                        return (
                            <Link
                                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${active ? 'bg-primary text-white' : 'text-black/65 hover:bg-primary/5 hover:text-primary dark:text-white/65 dark:hover:bg-white/5'}`}
                                key={link.to}
                                onClick={onClose}
                                to={link.to}
                            >
                                <i className={`${link.icon} text-lg`} />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>
                <div className="border-t border-black/5 p-4 text-xs text-black/40 dark:border-white/10 dark:text-white/40">
                    {settingsError || 'Sales, customers & inventory'}
                </div>
            </aside>
        </>
    );
}
