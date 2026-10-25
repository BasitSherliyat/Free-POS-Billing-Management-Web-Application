import React from 'react';
import MartBilling from './pages/mart-billing.jsx';
import MartCategories from './pages/mart-categories.jsx';
import MartCustomers from './pages/mart-customers.jsx';
import MartCustomerBalances from './pages/mart-customer-balances.jsx';
import MartItems from './pages/mart-items.jsx';
import MartUsers from './pages/mart-users.jsx';
import MartBarcode from './pages/mart-barcode.jsx';
import MartStoreSettings from './pages/mart-store-settings.jsx';

const routes = [
    { path: 'barcode-generation', allowedTypes: ['super admin', 'admin', 'staff'], Element: <MartBarcode /> },
    { path: 'categories', allowedTypes: ['super admin', 'admin'], Element: <MartCategories /> },
    { path: 'customers', allowedTypes: ['super admin', 'admin', 'staff'], Element: <MartCustomers /> },
    { path: 'customer-balances', allowedTypes: ['super admin', 'admin', 'staff'], Element: <MartCustomerBalances /> },
    { path: 'invoice-create', allowedTypes: ['super admin', 'admin', 'staff'], Element: <MartBilling /> },
    { path: 'invoice-list', allowedTypes: ['super admin', 'admin', 'staff'], Element: <MartBilling /> },
    { path: 'items', allowedTypes: ['super admin', 'admin'], Element: <MartItems /> },
    { path: 'store-settings', allowedTypes: ['super admin', 'admin'], Element: <MartStoreSettings /> },
    { path: 'users', allowedTypes: ['super admin'], Element: <MartUsers /> },
];

export default routes;
