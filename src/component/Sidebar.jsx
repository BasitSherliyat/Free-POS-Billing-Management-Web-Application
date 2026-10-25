import React, { useEffect, useState } from 'react'
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

const Sidebar = ({ openSidebar, handleCloseSidebar }) => {
    const { t } = useTranslation();
    const { sidebarBg, sidebarTheme, primaryColor } = useTheme();
    const location = useLocation();


    // Helper to check if any path in an array is active

    const dashboardPaths = [
        '/', '/ai-dashboard', '/academy-dashboard', '/banking-dashboard', '/booking-dashboard',
        '/crm-dashboard', '/crypto-dashboard', '/erp-dashboard', '/event-dashboard', '/finance-dashboard',
        '/helpdesk-dashboard', '/hospital-dashboard', '/hrms-dashboard', '/library-dashboard',
        '/lms-dashboard', '/logistics-dashboard', '/podcast-dashboard', '/realestate-dashboard'
    ];
    const appsPaths = ['/chat', '/calendar', '/todo-list', '/email', '/email-read', '/product-grid', '/product-list', '/product-details', '/product-create', '/cart', '/checkout', '/wishlist', '/order', '/order-details', '/track-order', '/returns-refunds', '/coupons', '/customer-reviews', '/discount-campaigns', '/email-marketing', '/stock-alerts', '/courier-integration', '/courses-list', '/course-details', '/instructors', '/students', '/categories', '/assignments', '/certificates', '/accounts', '/transactions', '/finance-invoices', '/expenses', '/revenue', '/budgets', '/financial-reports', '/tax-management', '/payroll', '/bank-accounts', '/transfers', '/deposits', '/withdrawals', '/loans', '/bank-cards', '/bank-statements', '/wire-transfers', '/banking-settings', '/contacts', '/leads', '/opportunities', '/deals', '/customers', '/activities', '/crm-reports', '/pipeline', '/crm-settings', '/employees', '/attendance', '/leave-management', '/hrms-payroll', '/recruitment', '/performance', '/training', '/departments', '/hrms-settings', '/shipments', '/inventory', '/warehouses', '/fleet', '/assets', '/logistics-orders', '/tracking', '/suppliers', '/route', '/logistics-settings', '/properties', '/listings', '/agents', '/realestate-clients', '/transactions', '/viewings', '/contracts', '/realestate-reports', '/realestate-settings', '/erp-finance', '/procurement', '/manufacturing', '/erp-sales', '/erp-inventory', '/erp-hr', '/erp-reports', '/erp-settings', '/lms-courses', '/lms-students', '/lms-instructors', '/lms-assignments', '/lms-quizzes', '/lms-grades', '/lms-certificates', '/lms-calendar', '/lms-settings', '/podcast-episodes', '/podcast-shows', '/podcast-hosts', '/podcast-analytics', '/podcast-subscribers', '/podcast-settings', '/helpdesk-tickets', '/helpdesk-agents', '/helpdesk-knowledge-base', '/helpdesk-reports', '/helpdesk-customers', '/helpdesk-categories', '/helpdesk-live-chat', '/helpdesk-faqs', '/helpdesk-settings', '/booking-bookings', '/booking-calendar', '/booking-services', '/booking-customers', '/booking-resources', '/booking-availability', '/booking-payments', '/booking-reports', '/booking-settings', '/hospital-patients', '/hospital-doctors', '/hospital-appointments', '/hospital-departments', '/hospital-rooms', '/hospital-pharmacy', '/hospital-lab-tests', '/hospital-billing', '/hospital-settings', '/event-events', '/event-calendar', '/event-attendees', '/event-venues', '/event-tickets', '/event-speakers', '/event-sponsors', '/event-schedule', '/event-settings', '/library-books', '/library-members', '/library-circulation', '/library-catalog', '/library-reservations', '/library-fines', '/library-reports', '/library-inventory', '/library-settings', '/all-projects', '/create-project', '/project-details', '/project-roadmap', '/team', '/client', '/time-tracking', '/timesheets', '/bug-tracking', '/change-request', '/goal', '/ai-assistant', '/job-list', '/job-grid', '/job-details', '/company', '/company-profile', '/candidates', '/candidate-profile', '/applications', '/interviews', '/ai-job-matching', '/job-alerts', '/all-coins', '/token-listing', '/add-new-token', '/token-details', '/spot-trading', '/wallet-overview', '/deposit', '/withdraw', '/nft-marketplace', '/nft-minting', '/auctions', '/kyc-request', '/airdrops', '/dao-tools', '/invoice-list', '/invoice-details', '/invoice-create', '/seller-details', '/sellers', '/customer-details', '/customers'];
    const basicUiPaths = ['/accordion', '/alert', '/avatar', '/badges', '/blockquote', '/buttons', '/card', '/carousel', '/collapse', '/datepicker', '/dropdown', '/file-upload', '/legend', '/list-group', '/lists', '/modal', '/offcanvas', '/pagination', '/progress', '/ratings', '/ribbons', '/skeleton', '/spinners', '/icons', '/tabs', '/toasts', '/tooltips', '/typography', '/video'];
    const advancedUiPaths = ['/effect-3d', '/animation', '/bookmark', '/blockui', '/chatbot', '/counter-up', '/drag-drop', '/highlight', '/mask', '/scrollspy', '/sweetalert2', '/swap', '/timeline', '/tour', '/tree', '/watermark'];
    const formsPaths = ['/advance-form', '/basic-form', '/checkbox', '/clipboard', '/color-picker', '/editors', '/ekyc', '/form-wizard', '/radio', '/select', '/switch', '/textarea', '/touchspin', '/range-slider', '/validation'];
    const tablesPaths = ['/basic-table', '/data-table', '/advanced-table'];
    const chartsPaths = ['/apex-charts', '/chartjs', '/echarts'];
    const authPaths = ['/signin', '/signup', '/forgot-password', '/create-password', '/twostep-verification', '/lockscreen', '/Error-404', '/Error-403', '/Error-500'];
    const pagesPaths = ['/about', '/settings', '/manage-services', '/pricing', '/faq', '/roles-permissions', '/blank', '/profile', '/news-grid', '/comingsoon', '/team', '/blog-grid', '/blog-list', '/blog-details'];
    const iconsPaths = ['/fontawesome-icons', '/remix-icons'];
    const mapsPaths = ['/google-maps', '/vector-maps'];
    const ecommercePaths = ['/ecommerce/dashboard', '/ecommerce/products', '/ecommerce/product-details', '/ecommerce/cart', '/ecommerce/checkout', '/ecommerce/orders', '/ecommerce/customers', '/ecommerce/invoices', '/ecommerce/reviews'];
    const crmPaths = ['/crm/dashboard', '/crm/contacts', '/crm/leads', '/crm/opportunities', '/crm/deals', '/crm/customers', '/crm/activities', '/crm/reports', '/crm/pipeline', '/crm/settings'];
    const hrmsPaths = ['/hrms/dashboard', '/hrms/employees', '/hrms/attendance', '/hrms/leave-management', '/hrms/payroll', '/hrms/recruitment', '/hrms/performance', '/hrms/training', '/hrms/departments', '/hrms/settings'];
    const logisticsPaths = ['/logistics/dashboard', '/logistics/shipments', '/logistics/inventory', '/logistics/warehouses', '/logistics/fleet', '/logistics/assets', '/logistics/orders', '/logistics/tracking', '/logistics/suppliers', '/logistics/route', '/logistics/settings'];
    const realEstatePaths = ['/realestate/dashboard', '/realestate/properties', '/realestate/listings', '/realestate/agents', '/realestate/clients', '/realestate/transactions', '/realestate/viewings', '/realestate/contracts', '/realestate/reports', '/realestate/settings'];
    const erpPaths = ['/erp/dashboard', '/erp/finance', '/erp/procurement', '/erp/manufacturing', '/erp/sales', '/erp/inventory', '/erp/hr', '/erp/reports', '/erp/settings'];
    const lmsPaths = ['/lms/dashboard', '/lms/courses', '/lms/students', '/lms/instructors', '/lms/assignments', '/lms/quizzes', '/lms/grades', '/lms/certificates', '/lms/calendar', '/lms/settings'];
    const podcastPaths = ['/podcast/dashboard', '/podcast/episodes', '/podcast/shows', '/podcast/hosts', '/podcast/analytics', '/podcast/subscribers', '/podcast/settings'];
    const helpdeskPaths = ['/helpdesk/dashboard', '/helpdesk/tickets', '/helpdesk/agents', '/helpdesk/knowledge-base', '/helpdesk/reports', '/helpdesk/customers', '/helpdesk/categories', '/helpdesk/live-chat', '/helpdesk/faqs', '/helpdesk/settings'];
    const bookingPaths = ['/booking/dashboard', '/booking/bookings', '/booking/calendar', '/booking/services', '/booking/customers', '/booking/resources', '/booking/availability', '/booking/payments', '/booking/reports', '/booking/settings'];
    const hospitalPaths = ['/hospital/dashboard', '/hospital/patients', '/hospital/doctors', '/hospital/appointments', '/hospital/departments', '/hospital/rooms', '/hospital/pharmacy', '/hospital/lab-tests', '/hospital/billing', '/hospital/settings'];
    const eventPaths = ['/event/dashboard', '/event/events', '/event/calendar', '/event/attendees', '/event/venues', '/event/tickets', '/event/speakers', '/event/sponsors', '/event/schedule', '/event/settings'];
    const libraryPaths = ['/library/dashboard', '/library/books', '/library/members', '/library/circulation', '/library/catalog', '/library/reservations', '/library/fines', '/library/reports', '/library/inventory', '/library/settings'];
    const projectPaths = ['/project/dashboard', '/project/all-projects', '/project/create-project', '/project/project-details', '/project/project-roadmap', '/project/team', '/project/client', '/project/time-tracking', '/project/timesheets', '/project/bug-tracking', '/project/change-request', '/project/goal'];
    const aiPaths = ['/ai/dashboard', '/ai/ai-assistant', '/ai/job-list', '/ai/job-grid', '/ai/job-details', '/ai/company', '/ai/company-profile', '/ai/candidates', '/ai/candidate-profile', '/ai/applications', '/ai/interviews', '/ai/ai-job-matching', '/ai/job-alerts'];
    const cryptoPaths = ['/crypto/dashboard', '/crypto/all-coins', '/crypto/token-listing', '/crypto/add-new-token', '/crypto/token-details', '/crypto/spot-trading', '/crypto/wallet-overview', '/crypto/deposit', '/crypto/withdraw', '/crypto/nft-marketplace', '/crypto/nft-minting', '/crypto/auctions', '/crypto/kyc-request', '/crypto/airdrops', '/crypto/dao-tools'];
    const invoicePaths = ['/invoice/dashboard', '/invoice/invoice-list', '/invoice/invoice-details', '/invoice/invoice-create', '/invoice/seller-details', '/invoice/sellers', '/invoice/customer-details', '/invoice/customers'];
    const jobPortalPaths = ['/job-portal/dashboard', '/job-portal/all-jobs', '/job-portal/job-details', '/job-portal/job-application', '/job-portal/company-profile', '/job-portal/candidates', '/job-portal/interview', '/job-portal/settings'];

    const isActive = (path) => {
        const normalizedPath = path.startsWith('/') ? path : `/${path}`;
        const normalizedLocation = location.pathname;
        if (normalizedPath === '/') return normalizedLocation === '/';
        return normalizedLocation === normalizedPath || normalizedLocation.startsWith(`${normalizedPath}/`);
    };

    const [openDropdowns, setOpenDropdowns] = useState({});

    // Define dropdown hierarchy
    const topLevelIndices = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 34];
    const subToParentMap = {
        12: 2, 13: 2, 14: 2, 15: 2, 16: 2, 17: 2, 18: 2, 19: 2, 20: 2,
        21: 2, 22: 2, 23: 2, 24: 2, 25: 2, 26: 2, 27: 2, 28: 2, 29: 2,
        30: 2, 31: 2, 32: 2, 33: 9, 35: 34
    };

    const handleOpenDropdown = (index) => {
        setOpenDropdowns((prev) => {
            const isTopLevel = topLevelIndices.includes(index);
            const parentId = subToParentMap[index];

            const newState = {};

            if (isTopLevel) {
                // Toggling a top-level dropdown: close everything else
                if (!prev[index]) {
                    newState[index] = true;
                }
            } else {
                // Toggling a sub-level dropdown: keep parent open, close other subs
                if (parentId) {
                    newState[parentId] = true;
                }
                if (!prev[index]) {
                    newState[index] = true;
                }
            }
            return newState;
        });
    };

    useEffect(() => {
        const newState = {};
        const configs = [
            { id: 1, paths: dashboardPaths },
            { id: 2, paths: appsPaths },
            { id: 3, paths: basicUiPaths },
            { id: 4, paths: advancedUiPaths },
            { id: 5, paths: formsPaths },
            { id: 6, paths: tablesPaths },
            { id: 7, paths: chartsPaths },
            { id: 8, paths: authPaths },
            { id: 9, paths: pagesPaths },
            { id: 10, paths: iconsPaths },
            { id: 11, paths: mapsPaths },
            // Sub-dropdowns
            {
                id: 12, paths: [
                    '/product-grid',
                    '/product-list',
                    '/product-details',
                    '/product-create',
                    '/cart',
                    '/checkout',
                    '/wishlist',
                    '/order',
                    '/order-details',
                    '/track-order',
                    '/returns-refunds',
                    '/coupons',
                    '/customer-reviews',
                    '/discount-campaigns',
                    '/email-marketing',
                    '/stock-alerts',
                    '/courier-integration'
                ]
            },
            { id: 16, paths: crmPaths },
            { id: 17, paths: hrmsPaths },
            { id: 18, paths: logisticsPaths },
            { id: 19, paths: realEstatePaths },
            { id: 20, paths: erpPaths },
            { id: 21, paths: lmsPaths },
            { id: 22, paths: podcastPaths },
            { id: 23, paths: helpdeskPaths },
            { id: 24, paths: bookingPaths },
            { id: 25, paths: hospitalPaths },
            { id: 26, paths: eventPaths },
            { id: 27, paths: libraryPaths },
            { id: 28, paths: projectPaths },
            { id: 48, paths: aiPaths },
            { id: 30, paths: cryptoPaths },
            { id: 31, paths: invoicePaths },
            { id: 29, paths: jobPortalPaths },
            { id: 13, paths: ['/courses-list', '/course-details', '/instructors', '/students', '/categories', '/assignments', '/certificates'] },
            { id: 14, paths: ['/accounts', '/transactions', '/finance-invoices', '/expenses', '/revenue', '/budgets', '/financial-reports', '/tax-management', '/payroll'] },
            { id: 15, paths: ['/bank-accounts', '/transfers', '/deposits', '/withdrawals', '/loans', '/bank-cards', '/bank-statements', '/wire-transfers', '/banking-settings'] },
            { id: 33, paths: ['/blog-grid', '/blog-list', '/blog-details'] }
        ];

        configs.forEach(config => {
            if (config.paths && config.paths.some(path => isActive(path))) {
                newState[config.id] = true;
                const parentId = subToParentMap[config.id];
                if (parentId) newState[parentId] = true;
            }
        });

        setOpenDropdowns(newState);
    }, [location.pathname]);

    return (
        <div>
            <div
                className={openSidebar ? "fixed left-0 rtl:left-auto rtl:right-0 top-0 w-64 h-full shadow-md bg-white dark:bg-gray z-50 sidebar-menu transition-transform flex flex-col overflow-hidden -translate-x-full" : "fixed left-0 rtl:left-auto rtl:right-0 top-0 w-64 h-full shadow-md bg-white dark:bg-gray z-50 sidebar-menu transition-transform flex flex-col overflow-hidden"}>
                {/* <!-- Sidebar Background Image --> */}
                <div id="sidebar-bg"
                    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-300"
                    style={{
                        backgroundImage: sidebarBg && sidebarBg !== 'none' ? `url(${sidebarBg})` : 'none',
                        opacity: sidebarBg && sidebarBg !== 'none' ? 0.3 : 0
                    }}>
                </div>
                {/* <!-- Overlay for readability --> */}
                <div id="sidebar-overlay"
                    className="sidebar-overlay absolute inset-0 z-[1] bg-white/60 dark:bg-gray/80 transition-opacity duration-300"
                    style={{ opacity: sidebarBg && sidebarBg !== 'none' ? 1 : (sidebarTheme === 'brand' ? 0.9 : 0) }}>
                </div>
                {/* <!-- Fixed Logo Header - matches navbar height --> */}
                <div
                    className="h-[4.55rem] py-2 px-4 shrink-0 border-b border-b-black/10 dark:border-b-white/10 flex items-center relative z-10">
                    <Link to="#" className="flex items-center">
                        <img src="/images/favicon.png" alt="" className="w-8 h-8 rounded object-cover" />
                        <span className="text-lg font-bold text-dark dark:text-white/80 ml-3 rtl:mr-3 rtl:ml-0">Turbine</span>
                    </Link>
                </div>
                {/* <!-- Scrollable Menu --> */}
                <SimpleBar className="flex-1 p-4 relative z-10" style={{ maxHeight: "calc(100vh - 64px)" }}>
                    {/* <!-- Sidebar User Profile --> */}
                    <div id="sidebar-user-profile"
                        className="flex items-center gap-2 pb-3 border-b border-black/10 dark:border-white/10">
                        <div className="relative inline-block">
                            <img src="/images/user/user-10.jpg" alt="User Avatar"
                                className="w-16 h-16 rounded-full object-cover mb-2 border-2 border-primary p-0.5" />
                            <span
                                className="absolute bottom-2 right-0 w-3 h-3 bg-success border-2 border-white dark:border-gray rounded-full"></span>
                        </div>
                        <div>
                            <h6 className="text-sm font-semibold text-black dark:text-white">
                                {t('sidebar.user_name', 'Admin')}
                            </h6>
                            <p className="text-xs text-black dark:text-white/50">{t('sidebar.user_role', 'Administrator')}</p>
                        </div>
                    </div>

                    <ul className="mt-2">
                        <span className="text-sm text-black font-semibold dark:text-white/50 my-5">{t('sidebar.menu', 'Menu')}</span>
                        <li className={`mb-1 group ${openDropdowns[1] ? "selected" : ""}`}>
                            <Link to="#"
                                onClick={() => handleOpenDropdown(1)}
                                className="flex items-center py-2 px-4 text-black dark:text-white hover:bg-primary dark:hover:bg-primary hover:text-white rounded-md group-[.active]:bg-white group-[.active]:text-white group-[.selected]:bg-primary dark:group-[.selected]:bg-primary group-[.selected]:text-white sidebar-dropdown-toggle">
                                <i className="ri-home-2-line mr-3 rtl:ml-3 rtl:mr-0 text-lg"></i>
                                <span className="text-sm">{t('sidebar.dashboards', 'Dashboards')}</span>
                                <i
                                    className="ri-arrow-right-s-line ml-auto rtl:mr-auto rtl:ml-0 rtl:rotate-180 group-[.selected]:rotate-90"></i>
                            </Link>
                            <ul className={`pl-7 rtl:pr-7 rtl:pl-0 mt-2 ${openDropdowns[1] ? "" : "hidden"}`} style={openDropdowns[1] ? { maxHeight: "none" } : { maxHeight: "0px" }}>
                                <li className={`mb-4 group ${isActive('/') ? 'active' : ''}`}>
                                    <Link to="/"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.main', 'Main')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/ai-dashboard') ? 'active' : ''}`}>
                                    <Link to="/ai-dashboard"
                                        className="text-black dark:text-white/80 text-sm flex items-center hover:text-black/70 dark:hover:text-white/60 before:contents-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.ai_dashboard', 'AI Dashboard')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/academy-dashboard') ? 'active' : ''}`}>
                                    <Link to="/academy-dashboard"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.academy', 'Academy')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/banking-dashboard') ? 'active' : ''}`}>
                                    <Link to="/banking-dashboard"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.banking', 'Banking')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/booking-dashboard') ? 'active' : ''}`}>
                                    <Link to="/booking-dashboard"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.booking', 'Booking')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/crm-dashboard') ? 'active' : ''}`}>
                                    <Link to="crm-dashboard"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.crm', 'CRM')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/crypto-dashboard') ? 'active' : ''}`}>
                                    <Link to="crypto-dashboard"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.crypto', 'Crypto')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/erp-dashboard') ? 'active' : ''}`}>
                                    <Link to="erp-dashboard"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.erp', 'ERP')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/event-dashboard') ? 'active' : ''}`}>
                                    <Link to="event-dashboard"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.event', 'Event')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/finance-dashboard') ? 'active' : ''}`}>
                                    <Link to="finance-dashboard"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.finance', 'Finance')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/helpdesk-dashboard') ? 'active' : ''}`}>
                                    <Link to="helpdesk-dashboard"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.helpdesk', 'Help Desk')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/hospital-dashboard') ? 'active' : ''}`}>
                                    <Link to="hospital-dashboard"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.hospital', 'Hospital')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/hrms-dashboard') ? 'active' : ''}`}>
                                    <Link to="hrms-dashboard"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.hrms', 'HRMS')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/library-dashboard') ? 'active' : ''}`}>
                                    <Link to="library-dashboard"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.library', 'Library')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/lms-dashboard') ? 'active' : ''}`}>
                                    <Link to="lms-dashboard"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.lms', 'LMS')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/logistics-dashboard') ? 'active' : ''}`}>
                                    <Link to="logistics-dashboard"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.logistics', 'Logistics')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/podcast-dashboard') ? 'active' : ''}`}>
                                    <Link to="podcast-dashboard"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.podcast', 'Podcast')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/realestate-dashboard') ? 'active' : ''}`}>
                                    <Link to="realestate-dashboard"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.realestate', 'Real Estate')}</Link>
                                </li>
                            </ul>

                        </li>
                        <span className="text-sm text-black font-semibold dark:text-white/50 my-5">{t('sidebar.widgets', 'Widgets')}</span>
                        <li className={`mb-1 group ${openDropdowns[2] ? "selected" : ""}`}>
                            <Link to="#"
                                onClick={() => handleOpenDropdown(2)}
                                className="flex items-center py-2 px-4 text-black dark:text-white hover:bg-primary dark:hover:bg-primary hover:text-white rounded-md group-[.active]:bg-white group-[.active]:text-white group-[.selected]:bg-primary dark:group-[.selected]:bg-primary group-[.selected]:text-white sidebar-dropdown-toggle">
                                <i className="ri-flashlight-line mr-3 rtl:ml-3 rtl:mr-0 text-lg"></i>
                                <span className="text-sm">{t('sidebar.apps', 'Apps')}</span>
                                <i
                                    className="ri-arrow-right-s-line ml-auto rtl:mr-auto rtl:ml-0 rtl:rotate-180 group-[.selected]:rotate-90"></i>
                            </Link>
                            <ul className={`pl-7 rtl:pr-7 rtl:pl-0 mt-2 ${openDropdowns[2] ? "" : "hidden"}`} style={openDropdowns[2] ? { maxHeight: "none" } : { maxHeight: "0px" }}>
                                <li className={`mb-4 group ${isActive('/chat') ? 'active' : ''}`}>
                                    <Link to="chat"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.chat', 'Chat')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/calendar') ? 'active' : ''}`}>
                                    <Link to="calendar"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.calendar', 'Calendar')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/todo-list') ? 'active' : ''}`}>
                                    <Link to="todo-list"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.todo_list', 'Todo List')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/email') || isActive('/email-read') ? 'active' : ''}`}>
                                    <Link to="email"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.email', 'Email')}</Link>
                                </li>
                                <li className={`mb-1 group ${openDropdowns[12] ? "selected" : ""}`}>
                                    <Link to="#"
                                        onClick={() => handleOpenDropdown(12)}
                                        className="text-black dark:text-white/80 text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 before:mr-3 rtl:before:ml-3 rtl:before:mr-0 sidebar-dropdown-toggle">
                                        <span>{t('sidebar.ecommerce', 'Ecommerce')}</span>
                                        <i
                                            className="ri-arrow-right-s-line ml-auto rtl:mr-auto rtl:ml-0 rtl:rotate-180 group-[.selected]:rotate-90"></i>
                                    </Link>
                                    <ul className={`pl-9 rtl:pr-9 rtl:pl-0 mt-2 mb-2 ${openDropdowns[12] ? "" : "hidden"}`} style={openDropdowns[12] ? { maxHeight: "none" } : { maxHeight: "0px" }}>
                                        {/* <!-- Products Section --> */}
                                        <li className={`mb-2 group ${isActive('/product-grid') ? 'active' : ''}`}>
                                            <Link to="product-grid"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.product_grid', 'Product Grid')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/product-list') ? 'active' : ''}`}>
                                            <Link to="product-list"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.product_list', 'Product List')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/product-details') ? 'active' : ''}`}>
                                            <Link to="product-details"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.product_details', 'Product Details')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/product-create') ? 'active' : ''}`}>
                                            <Link to="product-create"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.product_create', 'Create Product')}</Link>
                                        </li>
                                        {/* <!-- Shopping Section --> */}
                                        <li className={`mb-2 group ${isActive('/cart') ? 'active' : ''}`}>
                                            <Link to="cart"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.cart', 'Shopping Cart')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/checkout') ? 'active' : ''}`}>
                                            <Link to="checkout"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.checkout', 'Checkout')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/wishlist') ? 'active' : ''}`}>
                                            <Link to="wishlist"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.wishlist', 'Wishlist')}</Link>
                                        </li>
                                        {/* <!-- Orders Section --> */}
                                        <li className={`mb-2 group ${isActive('/order') ? 'active' : ''}`}>
                                            <Link to="order"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.orders', 'Orders')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/order-details') ? 'active' : ''}`}>
                                            <Link to="order-details"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.order_details', 'Order Details')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/track-order') ? 'active' : ''}`}>
                                            <Link to="track-order"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.track_order', 'Track Order')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/returns-refunds') ? 'active' : ''}`}>
                                            <Link to="returns-refunds"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.returns', 'Returns & Refunds')}</Link>
                                        </li>
                                        {/* <!-- Marketing Section --> */}
                                        <li className={`mb-2 group ${isActive('/coupons') ? 'active' : ''}`}>
                                            <Link to="coupons"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.coupons', 'Coupons')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/customer-reviews') ? 'active' : ''}`}>
                                            <Link to="customer-reviews"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.reviews', 'Customer Reviews')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/discount-campaigns') ? 'active' : ''}`}>
                                            <Link to="discount-campaigns"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.campaigns', 'Discount Campaigns')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/email-marketing') ? 'active' : ''}`}>
                                            <Link to="email-marketing"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.email_marketing', 'Email Marketing')}</Link>
                                        </li>
                                        {/* <!-- Inventory & Shipping --> */}
                                        <li className={`mb-2 group ${isActive('/stock-alerts') ? 'active' : ''}`}>
                                            <Link to="stock-alerts"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.stock_alerts', 'Stock Alerts')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/courier-integration') ? 'active' : ''}`}>
                                            <Link to="courier-integration"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.courier', 'Courier Integration')}</Link>
                                        </li>
                                    </ul>
                                </li>
                                <li className={`mb-1 group ${openDropdowns[13] ? "selected" : ""}`}>
                                    <Link to="#"
                                        onClick={() => handleOpenDropdown(13)}
                                        className="text-black dark:text-white/80 text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 before:mr-3 rtl:before:ml-3 rtl:before:mr-0 sidebar-dropdown-toggle">
                                        <span>{t('sidebar.academy', 'Academy')}</span>
                                        <i
                                            className="ri-arrow-right-s-line ml-auto rtl:mr-auto rtl:ml-0 rtl:rotate-180 group-[.selected]:rotate-90"></i>
                                    </Link>
                                    <ul className={`pl-9 rtl:pr-9 rtl:pl-0 mt-2 mb-2 ${openDropdowns[13] ? "" : "hidden"}`} style={openDropdowns[13] ? { maxHeight: "none" } : { maxHeight: "0px" }}>
                                        <li className={`mb-2 group ${isActive('/courses-list') ? 'active' : ''}`}>
                                            <Link to="courses-list"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.courses_list', 'Courses List')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/course-details') ? 'active' : ''}`}>
                                            <Link to="course-details"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.course_details', 'Course Details')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/instructors') ? 'active' : ''}`}>
                                            <Link to="instructors"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.instructors', 'Instructors')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/students') ? 'active' : ''}`}>
                                            <Link to="students"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.students', 'Students')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/categories') ? 'active' : ''}`}>
                                            <Link to="categories"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.categories', 'Categories')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/assignments') ? 'active' : ''}`}>
                                            <Link to="assignments"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.assignments', 'Assignments')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/certificates') ? 'active' : ''}`}>
                                            <Link to="certificates"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.certificates', 'Certificates')}</Link>
                                        </li>
                                    </ul>
                                </li>
                                <li className={`mb-1 group ${openDropdowns[14] ? "selected" : ""}`}>
                                    <Link to="#"
                                        onClick={() => handleOpenDropdown(14)}
                                        className="text-black dark:text-white/80 text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 before:mr-3 rtl:before:ml-3 rtl:before:mr-0 sidebar-dropdown-toggle">
                                        <span>{t('sidebar.finance_apps', 'Finance')}</span>
                                        <i
                                            className="ri-arrow-right-s-line ml-auto rtl:mr-auto rtl:ml-0 rtl:rotate-180 group-[.selected]:rotate-90"></i>
                                    </Link>
                                    <ul className={`pl-9 rtl:pr-9 rtl:pl-0 mt-2 mb-2 ${openDropdowns[14] ? "" : "hidden"}`} style={openDropdowns[14] ? { maxHeight: "none" } : { maxHeight: "0px" }}>
                                        <li className={`mb-2 group ${isActive('/accounts') ? 'active' : ''}`}>
                                            <Link to="accounts"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.accounts', 'Accounts')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/transactions') ? 'active' : ''}`}>
                                            <Link to="transactions"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.transactions', 'Transactions')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/finance-invoices') ? 'active' : ''}`}>
                                            <Link to="finance-invoices"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.invoices', 'Invoices')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/expenses') ? 'active' : ''}`}>
                                            <Link to="expenses"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.expenses', 'Expenses')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/revenue') ? 'active' : ''}`}>
                                            <Link to="revenue"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.revenue', 'Revenue')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/budgets') ? 'active' : ''}`}>
                                            <Link to="budgets"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.budgets', 'Budgets')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/financial-reports') ? 'active' : ''}`}>
                                            <Link to="financial-reports"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.reports', 'Financial Reports')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/tax-management') ? 'active' : ''}`}>
                                            <Link to="tax-management"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.tax', 'Tax Management')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/payroll') ? 'active' : ''}`}>
                                            <Link to="payroll"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.finance_payroll', 'Payroll')}</Link>
                                        </li>
                                    </ul>
                                </li>
                                <li className={`mb-1 group ${openDropdowns[15] ? "selected" : ""}`}>
                                    <Link to="#"
                                        onClick={() => handleOpenDropdown(15)}
                                        className="text-black dark:text-white/80 text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 before:mr-3 rtl:before:ml-3 rtl:before:mr-0 sidebar-dropdown-toggle">
                                        <span>{t('sidebar.banking', 'Banking')}</span>
                                        <i
                                            className="ri-arrow-right-s-line ml-auto rtl:mr-auto rtl:ml-0 rtl:rotate-180 group-[.selected]:rotate-90"></i>
                                    </Link>
                                    <ul className={`pl-9 rtl:pr-9 rtl:pl-0 mt-2 mb-2 ${openDropdowns[15] ? "" : "hidden"}`} style={openDropdowns[15] ? { maxHeight: "none" } : { maxHeight: "0px" }}>

                                        <li className={`mb-2 group ${isActive('/bank-accounts') ? 'active' : ''}`}>
                                            <Link to="bank-accounts"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.bank_accounts', 'Bank Accounts')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/transfers') ? 'active' : ''}`}>
                                            <Link to="transfers"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.transfers', 'Transfers')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/deposits') ? 'active' : ''}`}>
                                            <Link to="deposits"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.deposits', 'Deposits')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/withdrawals') ? 'active' : ''}`}>
                                            <Link to="withdrawals"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.withdrawals', 'Withdrawals')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/loans') ? 'active' : ''}`}>
                                            <Link to="loans"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.loans', 'Loans')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/bank-cards') ? 'active' : ''}`}>
                                            <Link to="bank-cards"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.cards', 'Cards')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/bank-statements') ? 'active' : ''}`}>
                                            <Link to="bank-statements"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.statements', 'Statements')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/wire-transfers') ? 'active' : ''}`}>
                                            <Link to="wire-transfers"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.wire_transfers', 'Wire Transfers')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/banking-settings') ? 'active' : ''}`}>
                                            <Link to="banking-settings"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.bank_settings', 'Settings')}</Link>
                                        </li>
                                    </ul>
                                </li>
                                <li className={`mb-1 group ${openDropdowns[16] ? "selected" : ""}`}>
                                    <Link to="#"
                                        onClick={() => handleOpenDropdown(16)}
                                        className="text-black dark:text-white/80 text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 before:mr-3 rtl:before:ml-3 rtl:before:mr-0 sidebar-dropdown-toggle">
                                        <span>{t('sidebar.crm_apps', 'CRM')}</span>
                                        <i
                                            className="ri-arrow-right-s-line ml-auto rtl:mr-auto rtl:ml-0 rtl:rotate-180 group-[.selected]:rotate-90"></i>
                                    </Link>
                                    <ul className={`pl-9 rtl:pr-9 rtl:pl-0 mt-2 mb-2 ${openDropdowns[16] ? "" : "hidden"}`} style={openDropdowns[16] ? { maxHeight: "none" } : { maxHeight: "0px" }}>

                                        <li className={`mb-2 group ${isActive('/contacts') ? 'active' : ''}`}>
                                            <Link to="contacts"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.contacts', 'Contacts')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/leads') ? 'active' : ''}`}>
                                            <Link to="leads"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.leads', 'Leads')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/opportunities') ? 'active' : ''}`}>
                                            <Link to="opportunities"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.opportunities', 'Opportunities')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/deals') ? 'active' : ''}`}>
                                            <Link to="deals"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.deals', 'Deals')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/customers') ? 'active' : ''}`}>
                                            <Link to="customers"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.customers', 'Customers')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/activities') ? 'active' : ''}`}>
                                            <Link to="activities"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.activities', 'Activities')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/crm-reports') ? 'active' : ''}`}>
                                            <Link to="crm-reports"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.crm_reports', 'Reports')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/pipeline') ? 'active' : ''}`}>
                                            <Link to="pipeline"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.pipeline', 'Pipeline')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/crm-settings') ? 'active' : ''}`}>
                                            <Link to="crm-settings"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.crm_settings', 'Settings')}</Link>
                                        </li>
                                    </ul>
                                </li>
                                <li className={`mb-1 group ${openDropdowns[17] ? "selected" : ""}`}>
                                    <Link to="#"
                                        onClick={() => handleOpenDropdown(17)}
                                        className="text-black dark:text-white/80 text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 before:mr-3 rtl:before:ml-3 rtl:before:mr-0 sidebar-dropdown-toggle">
                                        <span>{t('sidebar.hrms_apps', 'HRMS')}</span>
                                        <i
                                            className="ri-arrow-right-s-line ml-auto rtl:mr-auto rtl:ml-0 rtl:rotate-180 group-[.selected]:rotate-90"></i>
                                    </Link>
                                    <ul className={`pl-9 rtl:pr-9 rtl:pl-0 mt-2 mb-2 ${openDropdowns[17] ? "" : "hidden"}`} style={openDropdowns[17] ? { maxHeight: "none" } : { maxHeight: "0px" }}>

                                        <li className={`mb-2 group ${isActive('/employees') ? 'active' : ''}`}>
                                            <Link to="employees"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.employees', 'Employees')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/attendance') ? 'active' : ''}`}>
                                            <Link to="attendance"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.attendance', 'Attendance')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/leave-management') ? 'active' : ''}`}>
                                            <Link to="leave-management"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.leave', 'Leave Management')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/hrms-payroll') ? 'active' : ''}`}>
                                            <Link to="hrms-payroll"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.hrms_payroll', 'Payroll')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/recruitment') ? 'active' : ''}`}>
                                            <Link to="recruitment"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.recruitment', 'Recruitment')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/performance') ? 'active' : ''}`}>
                                            <Link to="performance"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.performance', 'Performance')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/training') ? 'active' : ''}`}>
                                            <Link to="training"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.training', 'Training')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/departments') ? 'active' : ''}`}>
                                            <Link to="departments"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.departments', 'Departments')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/hrms-settings') ? 'active' : ''}`}>
                                            <Link to="hrms-settings"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.hrms_settings', 'Settings')}</Link>
                                        </li>
                                    </ul>
                                </li>
                                <li className={`mb-1 group ${openDropdowns[18] ? "selected" : ""}`}>
                                    <Link to="#"
                                        onClick={() => handleOpenDropdown(18)}
                                        className="text-black dark:text-white/80 text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 before:mr-3 rtl:before:ml-3 rtl:before:mr-0 sidebar-dropdown-toggle">
                                        <span>{t('sidebar.logistics_apps', 'Logistics')}</span>
                                        <i
                                            className="ri-arrow-right-s-line ml-auto rtl:mr-auto rtl:ml-0 rtl:rotate-180 group-[.selected]:rotate-90"></i>
                                    </Link>
                                    <ul className={`pl-9 rtl:pr-9 rtl:pl-0 mt-2 mb-2 ${openDropdowns[18] ? "" : "hidden"}`} style={openDropdowns[18] ? { maxHeight: "none" } : { maxHeight: "0px" }}>

                                        <li className={`mb-2 group ${isActive('/shipments') ? 'active' : ''}`}>
                                            <Link to="shipments"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.shipments', 'Shipments')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/inventory') ? 'active' : ''}`}>
                                            <Link to="inventory"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.inventory', 'Inventory')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/warehouses') ? 'active' : ''}`}>
                                            <Link to="warehouses"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.warehouses', 'Warehouses')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/fleet') ? 'active' : ''}`}>
                                            <Link to="fleet"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.fleet', 'Fleet')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/assets') ? 'active' : ''}`}>
                                            <Link to="assets"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.assets', 'Assets')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/logistics-orders') ? 'active' : ''}`}>
                                            <Link to="logistics-orders"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.logistics_orders', 'Orders')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/tracking') ? 'active' : ''}`}>
                                            <Link to="tracking"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.tracking', 'Tracking')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/suppliers') ? 'active' : ''}`}>
                                            <Link to="suppliers"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.suppliers', 'Suppliers')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/route') ? 'active' : ''}`}>
                                            <Link to="route"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.routes', 'Routes')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/logistics-settings') ? 'active' : ''}`}>
                                            <Link to="logistics-settings"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.logistics_settings', 'Settings')}</Link>
                                        </li>
                                    </ul>
                                </li>
                                <li className={`mb-1 group ${openDropdowns[19] ? "selected" : ""}`}>
                                    <Link to="#"
                                        onClick={() => handleOpenDropdown(19)}
                                        className="text-black dark:text-white/80 text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 before:mr-3 rtl:before:ml-3 rtl:before:mr-0 sidebar-dropdown-toggle">
                                        <span>{t('sidebar.realestate_apps', 'Real Estate')}</span>
                                        <i
                                            className="ri-arrow-right-s-line ml-auto rtl:mr-auto rtl:ml-0 rtl:rotate-180 group-[.selected]:rotate-90"></i>
                                    </Link>
                                    <ul className={`pl-9 rtl:pr-9 rtl:pl-0 mt-2 mb-2 ${openDropdowns[19] ? "" : "hidden"}`} style={openDropdowns[19] ? { maxHeight: "none" } : { maxHeight: "0px" }}>

                                        <li className={`mb-2 group ${isActive('/properties') ? 'active' : ''}`}>
                                            <Link to="properties"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.properties', 'Properties')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/listings') ? 'active' : ''}`}>
                                            <Link to="listings"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.listings', 'Listings')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/agents') ? 'active' : ''}`}>
                                            <Link to="agents"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.agents', 'Agents')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/realestate-clients') ? 'active' : ''}`}>
                                            <Link to="realestate-clients"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.clients', 'Clients')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/transactions') ? 'active' : ''}`}>
                                            <Link to="transactions"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.transactions', 'Transactions')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/viewings') ? 'active' : ''}`}>
                                            <Link to="viewings"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.viewings', 'Viewings')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/contracts') ? 'active' : ''}`}>
                                            <Link to="contracts"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.contracts', 'Contracts')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/realestate-reports') ? 'active' : ''}`}>
                                            <Link to="realestate-reports"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.re_reports', 'Reports')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/realestate-settings') ? 'active' : ''}`}>
                                            <Link to="realestate-settings"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.re_settings', 'Settings')}</Link>
                                        </li>
                                    </ul>
                                </li>
                                <li className={`mb-1 group ${openDropdowns[20] ? "selected" : ""}`}>
                                    <Link to="#"
                                        onClick={() => handleOpenDropdown(20)}
                                        className="text-black dark:text-white/80 text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 before:mr-3 rtl:before:ml-3 rtl:before:mr-0 sidebar-dropdown-toggle">
                                        <span>{t('sidebar.erp', 'ERP')}</span>
                                        <i
                                            className="ri-arrow-right-s-line ml-auto rtl:mr-auto rtl:ml-0 rtl:rotate-180 group-[.selected]:rotate-90"></i>
                                    </Link>
                                    <ul className={`pl-9 rtl:pr-9 rtl:pl-0 mt-2 mb-2 ${openDropdowns[20] ? "" : "hidden"}`} style={openDropdowns[20] ? { maxHeight: "none" } : { maxHeight: "0px" }}>

                                        <li className={`mb-2 group ${isActive('/erp-finance') ? 'active' : ''}`}>
                                            <Link to="erp-finance"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.erp_finance', 'Finance')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/procurement') ? 'active' : ''}`}>
                                            <Link to="procurement"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.procurement', 'Procurement')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/manufacturing') ? 'active' : ''}`}>
                                            <Link to="manufacturing"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.manufacturing', 'Manufacturing')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/erp-sales') ? 'active' : ''}`}>
                                            <Link to="erp-sales"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.erp_sales', 'Sales')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/erp-inventory') ? 'active' : ''}`}>
                                            <Link to="erp-inventory"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.erp_inventory', 'Inventory')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/erp-hr') ? 'active' : ''}`}>
                                            <Link to="erp-hr"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.erp_hr', 'HR')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/assets') ? 'active' : ''}`}>
                                            <Link to="assets"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.assets', 'Assets')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/erp-reports') ? 'active' : ''}`}>
                                            <Link to="erp-reports"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.erp_reports', 'Reports')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/erp-settings') ? 'active' : ''}`}>
                                            <Link to="erp-settings"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.erp_settings', 'Settings')}</Link>
                                        </li>
                                    </ul>
                                </li>
                                <li className={`mb-1 group ${openDropdowns[21] ? "selected" : ""}`}>
                                    <Link to="#"
                                        onClick={() => handleOpenDropdown(21)}
                                        className="text-black dark:text-white/80 text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 before:mr-3 rtl:before:ml-3 rtl:before:mr-0 sidebar-dropdown-toggle">
                                        <span>{t('sidebar.lms', 'LMS')}</span>
                                        <i
                                            className="ri-arrow-right-s-line ml-auto rtl:mr-auto rtl:ml-0 rtl:rotate-180 group-[.selected]:rotate-90"></i>
                                    </Link>
                                    <ul className={`pl-9 rtl:pr-9 rtl:pl-0 mt-2 mb-2 ${openDropdowns[21] ? "" : "hidden"}`} style={openDropdowns[21] ? { maxHeight: "none" } : { maxHeight: "0px" }}>

                                        <li className={`mb-2 group ${isActive('/lms-courses') ? 'active' : ''}`}>
                                            <Link to="lms-courses"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.lms_courses', 'Courses')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/lms-students') ? 'active' : ''}`}>
                                            <Link to="lms-students"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.lms_students', 'Students')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/lms-instructors') ? 'active' : ''}`}>
                                            <Link to="lms-instructors"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.lms_instructors', 'Instructors')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/lms-assignments') ? 'active' : ''}`}>
                                            <Link to="lms-assignments"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.lms_assignments', 'Assignments')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/lms-quizzes') ? 'active' : ''}`}>
                                            <Link to="lms-quizzes"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.lms_quizzes', 'Quizzes')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/lms-grades') ? 'active' : ''}`}>
                                            <Link to="lms-grades"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.lms_grades', 'Grades')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/lms-certificates') ? 'active' : ''}`}>
                                            <Link to="lms-certificates"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.lms_certificates', 'Certificates')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/lms-calendar') ? 'active' : ''}`}>
                                            <Link to="lms-calendar"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.lms_calendar', 'Calendar')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/lms-settings') ? 'active' : ''}`}>
                                            <Link to="lms-settings"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.lms_settings', 'Settings')}</Link>
                                        </li>
                                    </ul>
                                </li>
                                <li className={`mb-1 group ${openDropdowns[22] ? "selected" : ""}`}>
                                    <Link to="#"
                                        onClick={() => handleOpenDropdown(22)}
                                        className="text-black dark:text-white/80 text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 before:mr-3 rtl:before:ml-3 rtl:before:mr-0 sidebar-dropdown-toggle">
                                        <span>{t('sidebar.podcast', 'Podcast')}</span>
                                        <i
                                            className="ri-arrow-right-s-line ml-auto rtl:mr-auto rtl:ml-0 rtl:rotate-180 group-[.selected]:rotate-90"></i>
                                    </Link>
                                    <ul className={`pl-9 rtl:pr-9 rtl:pl-0 mt-2 mb-2 ${openDropdowns[22] ? "" : "hidden"}`} style={openDropdowns[22] ? { maxHeight: "none" } : { maxHeight: "0px" }}>

                                        <li className={`mb-2 group ${isActive('/podcast-episodes') ? 'active' : ''}`}>
                                            <Link to="podcast-episodes"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.podcast_episodes', 'Episodes')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/podcast-shows') ? 'active' : ''}`}>
                                            <Link to="podcast-shows"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.podcast_shows', 'Shows')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/podcast-hosts') ? 'active' : ''}`}>
                                            <Link to="podcast-hosts"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.podcast_hosts', 'Hosts')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/podcast-analytics') ? 'active' : ''}`}>
                                            <Link to="podcast-analytics"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.podcast_analytics', 'Analytics')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/podcast-subscribers') ? 'active' : ''}`}>
                                            <Link to="podcast-subscribers"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.podcast_subscribers', 'Subscribers')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/podcast-settings') ? 'active' : ''}`}>
                                            <Link to="podcast-settings"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.podcast_settings', 'Settings')}</Link>
                                        </li>
                                    </ul>
                                </li>
                                <li className={`mb-1 group ${openDropdowns[23] ? "selected" : ""}`}>
                                    <Link to="#"
                                        onClick={() => handleOpenDropdown(23)}
                                        className="text-black dark:text-white/80 text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 before:mr-3 rtl:before:ml-3 rtl:before:mr-0 sidebar-dropdown-toggle">
                                        <span>{t('sidebar.helpdesk', 'Help Desk')}</span>
                                        <i
                                            className="ri-arrow-right-s-line ml-auto rtl:mr-auto rtl:ml-0 rtl:rotate-180 group-[.selected]:rotate-90"></i>
                                    </Link>
                                    <ul className={`pl-9 rtl:pr-9 rtl:pl-0 mt-2 mb-2 ${openDropdowns[23] ? "" : "hidden"}`} style={openDropdowns[23] ? { maxHeight: "none" } : { maxHeight: "0px" }}>

                                        <li className={`mb-2 group ${isActive('/helpdesk-tickets') ? 'active' : ''}`}>
                                            <Link to="helpdesk-tickets"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.tickets', 'Tickets')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/helpdesk-agents') ? 'active' : ''}`}>
                                            <Link to="helpdesk-agents"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.agents', 'Agents')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/helpdesk-knowledge-base') ? 'active' : ''}`}>
                                            <Link to="helpdesk-knowledge-base"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.kb', 'Knowledge Base')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/helpdesk-reports') ? 'active' : ''}`}>
                                            <Link to="helpdesk-reports"
                                                className="text-black dark:text-white/70 text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 some-class before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.helpdesk_reports', 'Reports')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/helpdesk-customers') ? 'active' : ''}`}>
                                            <Link to="helpdesk-customers"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.customers', 'Customers')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/helpdesk-categories') ? 'active' : ''}`}>
                                            <Link to="helpdesk-categories"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.categories', 'Categories')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/helpdesk-live-chat') ? 'active' : ''}`}>
                                            <Link to="helpdesk-live-chat"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.chat', 'Live Chat')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/helpdesk-faqs') ? 'active' : ''}`}>
                                            <Link to="helpdesk-faqs"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.faqs', 'FAQs')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/helpdesk-settings') ? 'active' : ''}`}>
                                            <Link to="helpdesk-settings"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.helpdesk_settings', 'Settings')}</Link>
                                        </li>
                                    </ul>
                                </li>
                                <li className={`mb-1 group ${openDropdowns[24] ? "selected" : ""}`}>
                                    <Link to="#"
                                        onClick={() => handleOpenDropdown(24)}
                                        className="text-black dark:text-white/80 text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 before:mr-3 rtl:before:ml-3 rtl:before:mr-0 sidebar-dropdown-toggle">
                                        <span>{t('sidebar.booking_system', 'Booking System')}</span>
                                        <i
                                            className="ri-arrow-right-s-line ml-auto rtl:mr-auto rtl:ml-0 rtl:rotate-180 group-[.selected]:rotate-90"></i>
                                    </Link>
                                    <ul className={`pl-9 rtl:pr-9 rtl:pl-0 mt-2 mb-2 ${openDropdowns[24] ? "" : "hidden"}`} style={openDropdowns[24] ? { maxHeight: "none" } : { maxHeight: "0px" }}>

                                        <li className={`mb-2 group ${isActive('/booking-bookings') ? 'active' : ''}`}>
                                            <Link to="booking-bookings"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.bookings', 'Bookings')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/booking-calendar') ? 'active' : ''}`}>
                                            <Link to="booking-calendar"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.booking_calendar', 'Calendar')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/booking-services') ? 'active' : ''}`}>
                                            <Link to="booking-services"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.services', 'Services')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/booking-customers') ? 'active' : ''}`}>
                                            <Link to="booking-customers"
                                                className="text-black dark:text-white/70 text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 some-class before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.booking_customers', 'Customers')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/booking-resources') ? 'active' : ''}`}>
                                            <Link to="booking-resources"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.resources', 'Resources')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/booking-availability') ? 'active' : ''}`}>
                                            <Link to="booking-availability"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.availability', 'Availability')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/booking-payments') ? 'active' : ''}`}>
                                            <Link to="booking-payments"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.payments', 'Payments')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/booking-reports') ? 'active' : ''}`}>
                                            <Link to="booking-reports"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.booking_reports', 'Reports')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/booking-settings') ? 'active' : ''}`}>
                                            <Link to="booking-settings"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.booking_settings', 'Settings')}</Link>
                                        </li>
                                    </ul>
                                </li>
                                <li className={`mb-1 group ${openDropdowns[25] ? "selected" : ""}`}>
                                    <Link to="#"
                                        onClick={() => handleOpenDropdown(25)}
                                        className="text-black dark:text-white/80 text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 before:mr-3 rtl:before:ml-3 rtl:before:mr-0 sidebar-dropdown-toggle">
                                        <span>{t('sidebar.hospital', 'Hospital')}</span>
                                        <i
                                            className="ri-arrow-right-s-line ml-auto rtl:mr-auto rtl:ml-0 rtl:rotate-180 group-[.selected]:rotate-90"></i>
                                    </Link>
                                    <ul className={`pl-9 rtl:pr-9 rtl:pl-0 mt-2 mb-2 ${openDropdowns[25] ? "" : "hidden"}`} style={openDropdowns[25] ? { maxHeight: "none" } : { maxHeight: "0px" }}>

                                        <li className={`mb-2 group ${isActive('/hospital-patients') ? 'active' : ''}`}>
                                            <Link to="hospital-patients"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.patients', 'Patients')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/hospital-doctors') ? 'active' : ''}`}>
                                            <Link to="hospital-doctors"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.doctors', 'Doctors')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/hospital-appointments') ? 'active' : ''}`}>
                                            <Link to="hospital-appointments"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.appointments', 'Appointments')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/hospital-departments') ? 'active' : ''}`}>
                                            <Link to="hospital-departments"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.departments', 'Departments')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/hospital-rooms') ? 'active' : ''}`}>
                                            <Link to="hospital-rooms"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.rooms', 'Rooms')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/hospital-pharmacy') ? 'active' : ''}`}>
                                            <Link to="hospital-pharmacy"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.pharmacy', 'Pharmacy')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/hospital-lab-tests') ? 'active' : ''}`}>
                                            <Link to="hospital-lab-tests"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.lab_tests', 'Lab Tests')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/hospital-billing') ? 'active' : ''}`}>
                                            <Link to="hospital-billing"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.billing', 'Hospital Billing')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/hospital-settings') ? 'active' : ''}`}>
                                            <Link to="hospital-settings"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.hospital_settings', 'Settings')}</Link>
                                        </li>
                                    </ul>
                                </li>
                                <li className={`mb-1 group ${openDropdowns[26] ? "selected" : ""}`}>
                                    <Link to="#"
                                        onClick={() => handleOpenDropdown(26)}
                                        className="text-black dark:text-white/80 text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 before:mr-3 rtl:before:ml-3 rtl:before:mr-0 sidebar-dropdown-toggle">
                                        <span>{t('sidebar.event', 'Event')}</span>
                                        <i
                                            className="ri-arrow-right-s-line ml-auto rtl:mr-auto rtl:ml-0 rtl:rotate-180 group-[.selected]:rotate-90"></i>
                                    </Link>
                                    <ul className={`pl-9 rtl:pr-9 rtl:pl-0 mt-2 mb-2 ${openDropdowns[26] ? "" : "hidden"}`} style={openDropdowns[26] ? { maxHeight: "none" } : { maxHeight: "0px" }}>

                                        <li className={`mb-2 group ${isActive('/event-events') ? 'active' : ''}`}>
                                            <Link to="event-events"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.event_events', 'Events')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/event-calendar') ? 'active' : ''}`}>
                                            <Link to="event-calendar"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.event_calendar', 'Calendar')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/event-attendees') ? 'active' : ''}`}>
                                            <Link to="event-attendees"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.attendees', 'Attendees')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/event-venues') ? 'active' : ''}`}>
                                            <Link to="event-venues"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.venues', 'Venues')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/event-tickets') ? 'active' : ''}`}>
                                            <Link to="event-tickets"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.event_tickets', 'Tickets')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/event-speakers') ? 'active' : ''}`}>
                                            <Link to="event-speakers"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.speakers', 'Speakers')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/event-sponsors') ? 'active' : ''}`}>
                                            <Link to="event-sponsors"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.sponsors', 'Sponsors')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/event-schedule') ? 'active' : ''}`}>
                                            <Link to="event-schedule"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.schedule', 'Schedule')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/event-settings') ? 'active' : ''}`}>
                                            <Link to="event-settings"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.event_settings', 'Settings')}</Link>
                                        </li>
                                    </ul>
                                </li>
                                <li className={`mb-1 group ${openDropdowns[27] ? "selected" : ""}`}>
                                    <Link to="#"
                                        onClick={() => handleOpenDropdown(27)}
                                        className="text-black dark:text-white/80 text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 before:mr-3 rtl:before:ml-3 rtl:before:mr-0 sidebar-dropdown-toggle">
                                        <span>{t('sidebar.library', 'Library')}</span>
                                        <i
                                            className="ri-arrow-right-s-line ml-auto rtl:mr-auto rtl:ml-0 rtl:rotate-180 group-[.selected]:rotate-90"></i>
                                    </Link>
                                    <ul className={`pl-9 rtl:pr-9 rtl:pl-0 mt-2 mb-2 ${openDropdowns[27] ? "" : "hidden"}`} style={openDropdowns[27] ? { maxHeight: "none" } : { maxHeight: "0px" }}>

                                        <li className={`mb-2 group ${isActive('/library-books') ? 'active' : ''}`}>
                                            <Link to="library-books"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.books', 'Books')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/library-members') ? 'active' : ''}`}>
                                            <Link to="library-members"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.members', 'Members')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/library-circulation') ? 'active' : ''}`}>
                                            <Link to="library-circulation"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.circulation', 'Circulation')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/library-catalog') ? 'active' : ''}`}>
                                            <Link to="library-catalog"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.catalog', 'Catalog')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/library-reservations') ? 'active' : ''}`}>
                                            <Link to="library-reservations"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.reservations', 'Reservations')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/library-fines') ? 'active' : ''}`}>
                                            <Link to="library-fines"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.fine_management', 'Fine Management')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/library-reports') ? 'active' : ''}`}>
                                            <Link to="library-reports"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.library_reports', 'Reports')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/library-inventory') ? 'active' : ''}`}>
                                            <Link to="library-inventory"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.library_inventory', 'Inventory')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/library-settings') ? 'active' : ''}`}>
                                            <Link to="library-settings"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.library_settings', 'Settings')}</Link>
                                        </li>
                                    </ul>
                                </li>
                                <li className={`mb-1 group ${openDropdowns[28] ? "selected" : ""}`}>
                                    <Link to="#"
                                        onClick={() => handleOpenDropdown(28)}
                                        className="text-black dark:text-white/80 text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 before:mr-3 rtl:before:ml-3 rtl:before:mr-0 sidebar-dropdown-toggle">
                                        <span>{t('sidebar.project_management', 'Project Management')}</span>
                                        <i
                                            className="ri-arrow-right-s-line ml-auto rtl:mr-auto rtl:ml-0 rtl:rotate-180 group-[.selected]:rotate-90"></i>
                                    </Link>
                                    <ul className={`pl-9 rtl:pr-9 rtl:pl-0 mt-2 mb-2 ${openDropdowns[28] ? "" : "hidden"}`} style={openDropdowns[28] ? { maxHeight: "none" } : { maxHeight: "0px" }}>
                                        <li className={`mb-2 group ${isActive('/all-projects') ? 'active' : ''}`}>
                                            <Link to="all-projects"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.all_projects', 'All Projects')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/create-project') ? 'active' : ''}`}>
                                            <Link to="create-project"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.create_project', 'Create Project')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/project-details') ? 'active' : ''}`}>
                                            <Link to="project-details"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.project_details', 'Project Details')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/project-roadmap') ? 'active' : ''}`}>
                                            <Link to="project-roadmap"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.project_roadmap', 'Project Roadmap')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/team') ? 'active' : ''}`}>
                                            <Link to="team"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.team', 'Team')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/client') ? 'active' : ''}`}>
                                            <Link to="client"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.client', 'Client')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/time-tracking') ? 'active' : ''}`}>
                                            <Link to="time-tracking"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.time_tracking', 'Time Tracking')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/timesheets') ? 'active' : ''}`}>
                                            <Link to="timesheets"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.timesheets', 'Timesheets')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/bug-tracking') ? 'active' : ''}`}>
                                            <Link to="bug-tracking"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.bug_tracking', 'Bug Tracking')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/change-request') ? 'active' : ''}`}>
                                            <Link to="change-request"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.change_request', 'Change Request')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/goal') ? 'active' : ''}`}>
                                            <Link to="goal"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.goal', 'Goal')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/ai-assistant') ? 'active' : ''}`}>
                                            <Link to="ai-assistant"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.ai_assistant', 'AI Assistant')}</Link>
                                        </li>
                                    </ul>
                                </li>
                                <li className={`mb-1 group ${openDropdowns[29] ? "selected" : ""}`}>
                                    <Link to="#"
                                        onClick={() => handleOpenDropdown(29)}
                                        className="text-black dark:text-white/80 text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 before:mr-3 rtl:before:ml-3 rtl:before:mr-0 sidebar-dropdown-toggle">
                                        <span>{t('sidebar.job_portal', 'Job Portal')}</span>
                                        <i
                                            className="ri-arrow-right-s-line ml-auto rtl:mr-auto rtl:ml-0 rtl:rotate-180 group-[.selected]:rotate-90"></i>
                                    </Link>
                                    <ul className={`pl-9 rtl:pr-9 rtl:pl-0 mt-2 mb-2 ${openDropdowns[29] ? "" : "hidden"}`} style={openDropdowns[29] ? { maxHeight: "none" } : { maxHeight: "0px" }}>
                                        <li className={`mb-2 group ${isActive('/job-list') ? 'active' : ''}`}>
                                            <Link to="job-list"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.job_list', 'Job List')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/job-grid') ? 'active' : ''}`}>
                                            <Link to="job-grid"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.job_grid', 'Job Grid')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/job-details') ? 'active' : ''}`}>
                                            <Link to="job-details"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.job_details', 'Job Details')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/company') ? 'active' : ''}`}>
                                            <Link to="company"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.companies', 'Companies')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/company-profile') ? 'active' : ''}`}>
                                            <Link to="company-profile"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.company_profile', 'Company Profile')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/candidates') ? 'active' : ''}`}>
                                            <Link to="candidates"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.candidates', 'Candidates')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/candidate-profile') ? 'active' : ''}`}>
                                            <Link to="candidate-profile"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.candidate_profile', 'Candidate Profile')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/applications') ? 'active' : ''}`}>
                                            <Link to="applications"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.applications', 'Applications')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/interviews') ? 'active' : ''}`}>
                                            <Link to="interviews"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.interviews', 'Interviews')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/ai-job-matching') ? 'active' : ''}`}>
                                            <Link to="/ai-job-matching"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.ai_job_matching', 'AI Job Matching')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/job-alerts') ? 'active' : ''}`}>
                                            <Link to="job-alerts"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.job_alerts', 'Job Alerts')}</Link>
                                        </li>
                                    </ul>
                                </li>
                                <li className={`mb-1 group ${openDropdowns[30] ? "selected" : ""}`}>
                                    <Link to="#"
                                        onClick={() => handleOpenDropdown(30)}
                                        className="text-black dark:text-white/80 text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 before:mr-3 rtl:before:ml-3 rtl:before:mr-0 sidebar-dropdown-toggle">
                                        <span>{t('sidebar.crypto', 'Crypto')}</span>
                                        <i
                                            className="ri-arrow-right-s-line ml-auto rtl:mr-auto rtl:ml-0 rtl:rotate-180 group-[.selected]:rotate-90"></i>
                                    </Link>
                                    <ul className={`pl-9 rtl:pr-9 rtl:pl-0 mt-2 mb-2 ${openDropdowns[30] ? "" : "hidden"}`} style={openDropdowns[30] ? { maxHeight: "none" } : { maxHeight: "0px" }}>
                                        <li className={`mb-2 group ${isActive('/all-coins') ? 'active' : ''}`}>
                                            <Link to="all-coins"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.all_coins', 'All Coins')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/token-listing') ? 'active' : ''}`}>
                                            <Link to="token-listing"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.token_listing', 'Token Listing')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/add-new-token') ? 'active' : ''}`}>
                                            <Link to="add-new-token"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.add_token', 'Add New Token')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/token-details') ? 'active' : ''}`}>
                                            <Link to="token-details"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.token_details', 'Token Details')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/spot-trading') ? 'active' : ''}`}>
                                            <Link to="spot-trading"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.spot_trading', 'Spot Trading')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/wallet-overview') ? 'active' : ''}`}>
                                            <Link to="wallet-overview"
                                                className="text-black dark:text-white/70 text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 some-class before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.wallet_overview', 'Wallet Overview')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/deposit') ? 'active' : ''}`}>
                                            <Link to="deposit"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.deposit', 'Deposit')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/withdraw') ? 'active' : ''}`}>
                                            <Link to="withdraw"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.withdraw', 'Withdraw')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/nft-marketplace') ? 'active' : ''}`}>
                                            <Link to="nft-marketplace"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.nft_marketplace', 'NFT Marketplace')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/nft-minting') ? 'active' : ''}`}>
                                            <Link to="nft-minting"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.nft_minting', 'NFT Minting')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/auctions') ? 'active' : ''}`}>
                                            <Link to="auctions"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.auctions', 'Auctions')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/kyc-request') ? 'active' : ''}`}>
                                            <Link to="kyc-request"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.kyc_request', 'KYC Request')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/airdrops') ? 'active' : ''}`}>
                                            <Link to="airdrops"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.airdrops', 'Airdrops')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/dao-tools') ? 'active' : ''}`}>
                                            <Link to="dao-tools"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.dao_tools', 'DAO Tools')}</Link>
                                        </li>
                                    </ul>
                                </li>
                                <li className={`mb-1 group ${openDropdowns[31] ? "selected" : ""}`}>
                                    <Link to="#"
                                        onClick={() => handleOpenDropdown(31)}
                                        className="text-black dark:text-white/80 text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 before:mr-3 rtl:before:ml-3 rtl:before:mr-0 sidebar-dropdown-toggle">
                                        <span>{t('sidebar.invoice', 'Invoice')}</span>
                                        <i
                                            className="ri-arrow-right-s-line ml-auto rtl:mr-auto rtl:ml-0 rtl:rotate-180 group-[.selected]:rotate-90"></i>
                                    </Link>
                                    <ul className={`pl-9 rtl:pr-9 rtl:pl-0 mt-2 mb-2 ${openDropdowns[31] ? "" : "hidden"}`} style={openDropdowns[31] ? { maxHeight: "none" } : { maxHeight: "0px" }}>
                                        <li className={`mb-2 group ${isActive('/invoice-list') ? 'active' : ''}`}>
                                            <Link to="invoice-list"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.invoice_list', 'Invoice List')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/invoice-details') ? 'active' : ''}`}>
                                            <Link to="invoice-details"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.invoice_details', 'Invoice Details')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/invoice-create') ? 'active' : ''}`}>
                                            <Link to="invoice-create"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.create_invoice', 'Create Invoice')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/items') ? 'active' : ''}`}>
                                            <Link to="items"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.items', 'Items')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/categories') ? 'active' : ''}`}>
                                            <Link to="categories"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.categories', 'Categories')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/transactions') ? 'active' : ''}`}>
                                            <Link to="transactions"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.transactions', 'Transactions')}</Link>
                                        </li>
                                    </ul>
                                </li>
                                <li className={`mb-1 group ${openDropdowns[32] ? "selected" : ""}`}>
                                    <Link to="#"
                                        onClick={() => handleOpenDropdown(32)}
                                        className="text-black dark:text-white/80 text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 before:mr-3 rtl:before:ml-3 rtl:before:mr-0 sidebar-dropdown-toggle">
                                        <span>{t('sidebar.user_management', 'User Management')}</span>
                                        <i
                                            className="ri-arrow-right-s-line ml-auto rtl:mr-auto rtl:ml-0 rtl:rotate-180 group-[.selected]:rotate-90"></i>
                                    </Link>
                                    <ul className={`pl-9 rtl:pr-9 rtl:pl-0 mt-2 mb-2 ${openDropdowns[32] ? "" : "hidden"}`} style={openDropdowns[32] ? { maxHeight: "none" } : { maxHeight: "0px" }}>
                                        <li className={`mb-2 group ${isActive('/customers') ? 'active' : ''}`}>
                                            <Link to="customers"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.customers', 'Customers')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/users') ? 'active' : ''}`}>
                                            <Link to="users"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.users', 'Users')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/customer-details') ? 'active' : ''}`}>
                                            <Link to="customer-details"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.customer_details', 'Customer Details')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/sellers') ? 'active' : ''}`}>
                                            <Link to="sellers"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.sellers', 'Sellers')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/seller-details') ? 'active' : ''}`}>
                                            <Link to="seller-details"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.seller_details', 'Seller Details')}</Link>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                        <span className="text-sm text-black font-semibold dark:text-white/50 my-5">{t('sidebar.ui_elements', 'Ui Elements')}</span>
                        <li className={`mb-1 group ${openDropdowns[3] ? "selected" : ""}`}>
                            <Link to="#"
                                onClick={() => handleOpenDropdown(3)}
                                className="flex items-center py-2 px-4 text-black dark:text-white hover:bg-primary dark:hover:bg-primary hover:text-white rounded-md group-[.active]:bg-white group-[.active]:text-white group-[.selected]:bg-primary dark:group-[.selected]:bg-primary group-[.selected]:text-white sidebar-dropdown-toggle">
                                <i className="ri-quill-pen-line mr-3 rtl:ml-3 rtl:mr-0 text-lg"></i>
                                <span className="text-sm">{t('sidebar.basic_ui', 'Basic Ui')}</span>
                                <i
                                    className="ri-arrow-right-s-line ml-auto rtl:mr-auto rtl:ml-0 rtl:rotate-180 group-[.selected]:rotate-90"></i>
                            </Link>
                            <ul className={`pl-7 rtl:pr-7 rtl:pl-0 mt-2 ${openDropdowns[3] ? "" : "hidden"}`} style={openDropdowns[3] ? { maxHeight: "none" } : { maxHeight: "0px" }}>
                                <li className={`mb-4 group ${isActive('/accordion') ? 'active' : ''}`}>
                                    <Link to="accordion"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.accordions', 'Accordions')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/alert') ? 'active' : ''}`}>
                                    <Link to="alert"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.alert', 'Alert')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/avatar') ? 'active' : ''}`}>
                                    <Link to="avatar"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.avatar', 'Avatar')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/badges') ? 'active' : ''}`}>
                                    <Link to="badges"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.badges', 'Badges')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/blockquote') ? 'active' : ''}`}>
                                    <Link to="blockquote"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.blockquote', 'Blockquote')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/buttons') ? 'active' : ''}`}>
                                    <Link to="buttons"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.buttons', 'Buttons')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/card') ? 'active' : ''}`}>
                                    <Link to="card"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.cards', 'Cards')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/carousel') ? 'active' : ''}`}>
                                    <Link to="carousel"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.carousel', 'Carousel')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/collapse') ? 'active' : ''}`}>
                                    <Link to="collapse"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.collapse', 'Collapse')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/datepicker') ? 'active' : ''}`}>
                                    <Link to="datepicker"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.datepicker', 'Datepicker')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/dropdown') ? 'active' : ''}`}>
                                    <Link to="dropdown"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.dropdowns', 'Dropdowns')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/file-upload') ? 'active' : ''}`}>
                                    <Link to="file-upload"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.file_upload', 'File Upload')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/legend') ? 'active' : ''}`}>
                                    <Link to="legend"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.legend', 'Legend')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/list-group') ? 'active' : ''}`}>
                                    <Link to="list-group"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.list_group', 'List Group')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/lists') ? 'active' : ''}`}>
                                    <Link to="lists"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.lists', 'Lists')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/modal') ? 'active' : ''}`}>
                                    <Link to="modal"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.modal', 'Modal')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/offcanvas') ? 'active' : ''}`}>
                                    <Link to="offcanvas"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.offcanvas', 'Offcanvas')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/pagination') ? 'active' : ''}`}>
                                    <Link to="pagination"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.pagination', 'Pagination')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/progress') ? 'active' : ''}`}>
                                    <Link to="progress"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.progress', 'Progress')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/ratings') ? 'active' : ''}`}>
                                    <Link to="ratings"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.ratings', 'Ratings')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/ribbons') ? 'active' : ''}`}>
                                    <Link to="ribbons"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.ribbons', 'Ribbons')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/skeleton') ? 'active' : ''}`}>
                                    <Link to="skeleton"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.skeleton', 'Skeleton')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/spinners') ? 'active' : ''}`}>
                                    <Link to="spinners"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.spinners', 'Spinners')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/icons') ? 'active' : ''}`}>
                                    <Link to="icons"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.styled_icons', 'Styled Icons')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/tabs') ? 'active' : ''}`}>
                                    <Link to="tabs"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.tabs', 'Tabs')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/toasts') ? 'active' : ''}`}>
                                    <Link to="toasts"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.toasts', 'Toasts')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/tooltips') ? 'active' : ''}`}>
                                    <Link to="tooltips"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.tooltips', 'Tooltips')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/typography') ? 'active' : ''}`}>
                                    <Link to="typography"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.typography', 'Typography')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/video') ? 'active' : ''}`}>
                                    <Link to="video"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.video', 'Video')}</Link>
                                </li>

                            </ul>
                        </li>
                        <li className={`mb-1 group ${openDropdowns[4] ? "selected" : ""}`}>
                            <Link to="#"
                                onClick={() => handleOpenDropdown(4)}
                                className="flex items-center py-2 px-4 text-black dark:text-white hover:bg-primary dark:hover:bg-primary hover:text-white rounded-md group-[.active]:bg-white group-[.active]:text-white group-[.selected]:bg-primary dark:group-[.selected]:bg-primary group-[.selected]:text-white sidebar-dropdown-toggle">
                                <i className="ri-magic-line mr-3 rtl:ml-3 rtl:mr-0 text-lg"></i>
                                <span className="text-sm">{t('sidebar.advanced_ui', 'Advanced UI')}</span>
                                <i
                                    className="ri-arrow-right-s-line ml-auto rtl:mr-auto rtl:ml-0 rtl:rotate-180 group-[.selected]:rotate-90"></i>
                            </Link>
                            <ul className={`pl-7 rtl:pr-7 rtl:pl-0 mt-2 ${openDropdowns[4] ? "" : "hidden"}`} style={openDropdowns[4] ? { maxHeight: "none" } : { maxHeight: "0px" }}>
                                <li className={`mb-4 group ${isActive('/effect-3d') ? 'active' : ''}`}>
                                    <Link to="effect-3d"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.3d_effect', '3D Effect')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/animation') ? 'active' : ''}`}>
                                    <Link to="animation"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.animation', 'Animation')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/bookmark') ? 'active' : ''}`}>
                                    <Link to="bookmark"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.bookmark', 'Bookmark')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/blockui') ? 'active' : ''}`}>
                                    <Link to="blockui"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.block_ui', 'Block UI')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/chatbot') ? 'active' : ''}`}>
                                    <Link to="chatbot"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.chatbot', 'Chatbot')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/counter-up') ? 'active' : ''}`}>
                                    <Link to="counter-up"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.counter_up', 'Counter Up')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/drag-drop') ? 'active' : ''}`}>
                                    <Link to="drag-drop"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.drag_drop', 'Drag & Drop')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/highlight') ? 'active' : ''}`}>
                                    <Link to="highlight"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.highlight', 'Highlight')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/mask') ? 'active' : ''}`}>
                                    <Link to="mask"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.mask', 'Mask')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/scrollspy') ? 'active' : ''}`}>
                                    <Link to="scrollspy"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.scrollspy', 'Scrollspy')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/sweetalert2') ? 'active' : ''}`}>
                                    <Link to="sweetalert2"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.sweetalert2', 'SweetAlert2')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/swap') ? 'active' : ''}`}>
                                    <Link to="swap"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.swap', 'Swap')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/timeline') ? 'active' : ''}`}>
                                    <Link to="timeline"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.timeline', 'Timeline')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/tour') ? 'active' : ''}`}>
                                    <Link to="tour"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.tour', 'Tour')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/tree') ? 'active' : ''}`}>
                                    <Link to="tree"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.tree', 'Tree')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/watermark') ? 'active' : ''}`}>
                                    <Link to="watermark"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.watermark', 'Watermark')}</Link>
                                </li>



                            </ul>
                        </li>
                        <li className={`mb-1 group ${openDropdowns[5] ? "selected" : ""}`}>
                            <Link to="#"
                                onClick={() => handleOpenDropdown(5)}
                                className="flex items-center py-2 px-4 text-black dark:text-white hover:bg-primary dark:hover:bg-primary hover:text-white rounded-md group-[.active]:bg-white group-[.active]:text-white group-[.selected]:bg-primary dark:group-[.selected]:bg-primary group-[.selected]:text-white sidebar-dropdown-toggle">
                                <i className="ri-survey-line mr-3 rtl:ml-3 rtl:mr-0 text-lg"></i>
                                <span className="text-sm">{t('sidebar.form', 'Form')}</span>
                                <i
                                    className="ri-arrow-right-s-line ml-auto rtl:mr-auto rtl:ml-0 rtl:rotate-180 group-[.selected]:rotate-90"></i>
                            </Link>
                            <ul className={`pl-7 rtl:pr-7 rtl:pl-0 mt-2 ${openDropdowns[5] ? "" : "hidden"}`} style={openDropdowns[5] ? { maxHeight: "none" } : { maxHeight: "0px" }}>
                                <li className={`mb-4 group ${isActive('/advance-form') ? 'active' : ''}`}>
                                    <Link to="advance-form"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.advance_form', 'Advance Form')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/basic-form') ? 'active' : ''}`}>
                                    <Link to="basic-form"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.basic_form', 'Basic Form')}</Link>
                                </li>

                                <li className={`mb-4 group ${isActive('/checkbox') ? 'active' : ''}`}>
                                    <Link to="checkbox"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.checkbox', 'Checkbox')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/clipboard') ? 'active' : ''}`}>
                                    <Link to="clipboard"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.clipboard', 'Clipboard')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/color-picker') ? 'active' : ''}`}>
                                    <Link to="color-picker"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.color_picker', 'Color Picker')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/editors') ? 'active' : ''}`}>
                                    <Link to="editors"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.editors', 'Editors')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/ekyc') ? 'active' : ''}`}>
                                    <Link to="ekyc"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.ekyc', 'eKYC Verification')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/form-wizard') ? 'active' : ''}`}>
                                    <Link to="form-wizard"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.form_wizard', 'Form Wizard')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/radio') ? 'active' : ''}`}>
                                    <Link to="radio"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.radio', 'Radio')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/select') ? 'active' : ''}`}>
                                    <Link to="select"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.select', 'Select')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/switch') ? 'active' : ''}`}>
                                    <Link to="switch"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.switch', 'Switch')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/textarea') ? 'active' : ''}`}>
                                    <Link to="textarea"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.textarea', 'Textarea')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/touchspin') ? 'active' : ''}`}>
                                    <Link to="touchspin"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.touchspin', 'Touchspin')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/range-slider') ? 'active' : ''}`}>
                                    <Link to="range-slider"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.range_slider', 'Range Slider')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/validation') ? 'active' : ''}`}>
                                    <Link to="validation"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.validation', 'Validation')}</Link>
                                </li>
                            </ul>
                        </li>
                        <li className={`mb-1 group ${openDropdowns[6] ? "selected" : ""}`}>
                            <Link to="#"
                                onClick={() => handleOpenDropdown(6)}
                                className="flex items-center py-2 px-4 text-black dark:text-white hover:bg-primary dark:hover:bg-primary hover:text-white rounded-md group-[.active]:bg-white group-[.active]:text-white group-[.selected]:bg-primary dark:group-[.selected]:bg-primary group-[.selected]:text-white sidebar-dropdown-toggle">
                                <i className="ri-table-line mr-3 rtl:ml-3 rtl:mr-0 text-lg"></i>
                                <span className="text-sm">{t('sidebar.table', 'Table')}</span>
                                <i
                                    className="ri-arrow-right-s-line ml-auto rtl:mr-auto rtl:ml-0 rtl:rotate-180 group-[.selected]:rotate-90"></i>
                            </Link>
                            <ul className={`pl-7 rtl:pr-7 rtl:pl-0 mt-2 ${openDropdowns[6] ? "" : "hidden"}`} style={openDropdowns[6] ? { maxHeight: "none" } : { maxHeight: "0px" }}>
                                <li className={`mb-4 group ${isActive('/basic-table') ? 'active' : ''}`}>
                                    <Link to="basic-table"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.basic_table', 'Basic Table')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/data-table') ? 'active' : ''}`}>
                                    <Link to="data-table"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.data_table', 'Data Table')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/advanced-table') ? 'active' : ''}`}>
                                    <Link to="advanced-table"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.advanced_table', 'Advanced Table')}</Link>
                                </li>
                            </ul>
                        </li>
                        <li className={`mb-1 group ${openDropdowns[7] ? "selected" : ""}`}>
                            <Link to="#"
                                onClick={() => handleOpenDropdown(7)}
                                className="flex items-center py-2 px-4 text-black dark:text-white hover:bg-primary dark:hover:bg-primary hover:text-white rounded-md group-[.active]:bg-white group-[.active]:text-white group-[.selected]:bg-primary dark:group-[.selected]:bg-primary group-[.selected]:text-white sidebar-dropdown-toggle">
                                <i className="ri-line-chart-fill mr-3 rtl:ml-3 rtl:mr-0 text-lg"></i>
                                <span className="text-sm">{t('sidebar.chart', 'Charts')}</span>
                                <i
                                    className="ri-arrow-right-s-line ml-auto rtl:mr-auto rtl:ml-0 rtl:rotate-180 group-[.selected]:rotate-90"></i>
                            </Link>
                            <ul className={`pl-7 rtl:pr-7 rtl:pl-0 mt-2 ${openDropdowns[7] ? "" : "hidden"}`} style={openDropdowns[7] ? { maxHeight: "none" } : { maxHeight: "0px" }}>
                                <li className={`mb-4 group ${isActive('/apex-charts') ? 'active' : ''}`}>
                                    <Link to="apex-charts"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.apex_charts', 'ApexCharts')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/chartjs') ? 'active' : ''}`}>
                                    <Link to="chartjs"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.chartjs', 'Chart.js')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/echarts') ? 'active' : ''}`}>
                                    <Link to="echarts"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.echarts', 'ECharts')}</Link>
                                </li>
                            </ul>
                        </li>

                        <li className="side-title">
                            <span className="text-sm text-black font-semibold dark:text-white/50 my-5">{t('sidebar.pages_section', 'Pages')}</span>
                        </li>
                        <li className={`mb-1 group ${openDropdowns[8] ? "selected" : ""}`}>
                            <Link to="#"
                                onClick={() => handleOpenDropdown(8)}
                                className="flex items-center py-2 px-4 text-black dark:text-white hover:bg-primary dark:hover:bg-primary hover:text-white rounded-md group-[.active]:bg-white group-[.active]:text-white group-[.selected]:bg-primary dark:group-[.selected]:bg-primary group-[.selected]:text-white sidebar-dropdown-toggle">
                                <i className="ri-shield-user-line mr-3 rtl:ml-3 rtl:mr-0 text-lg"></i>
                                <span className="text-sm">{t('sidebar.auth_error', 'Auth and Error')}</span>
                                <i
                                    className="ri-arrow-right-s-line ml-auto rtl:mr-auto rtl:ml-0 rtl:rotate-180 group-[.selected]:rotate-90"></i>
                            </Link>
                            <ul className={`pl-7 rtl:pr-7 rtl:pl-0 mt-2 ${openDropdowns[8] ? "" : "hidden"}`} style={openDropdowns[8] ? { maxHeight: "none" } : { maxHeight: "0px" }}>
                                <li className={`mb-4 group ${isActive('/signin') ? 'active' : ''}`}>
                                    <Link to="signin"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.sign_in', 'Sign in')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/signup') ? 'active' : ''}`}>
                                    <Link to="signup"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.sign_up', 'Sign Up')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/forgot-password') ? 'active' : ''}`}>
                                    <Link to="forgot-password"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.forgot_password', 'Forgot Password')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/create-password') ? 'active' : ''}`}>
                                    <Link to="create-password"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.create_password', 'Create Password')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/twostep-verification') ? 'active' : ''}`}>
                                    <Link to="twostep-verification"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.two_step', 'Two Step Verification')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/lockscreen') ? 'active' : ''}`}>
                                    <Link to="/lockscreen"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.lock_screen', 'Lock Screen')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/Error-404') ? 'active' : ''}`}>
                                    <Link to="Error-404"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.error_404', '404')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/Error-403') ? 'active' : ''}`}>
                                    <Link to="Error-403"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.error_403', '403')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/Error-500') ? 'active' : ''}`}>
                                    <Link to="Error-500"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.error_500', '500')}</Link>
                                </li>
                            </ul>
                        </li>
                        <li className={`mb-1 group ${openDropdowns[9] ? "selected" : ""}`}>
                            <Link to="#"
                                onClick={() => handleOpenDropdown(9)}
                                className="flex items-center py-2 px-4 text-black dark:text-white hover:bg-primary dark:hover:bg-primary hover:text-white rounded-md group-[.active]:bg-white group-[.active]:text-white group-[.selected]:bg-primary dark:group-[.selected]:bg-primary group-[.selected]:text-white sidebar-dropdown-toggle">
                                <i className="ri-pages-line mr-3 rtl:ml-3 rtl:mr-0 text-lg"></i>
                                <span className="text-sm">{t('sidebar.pages_section', 'Pages')}</span>
                                <i
                                    className="ri-arrow-right-s-line ml-auto rtl:mr-auto rtl:ml-0 rtl:rotate-180 group-[.selected]:rotate-90"></i>
                            </Link>
                            <ul className={`pl-7 rtl:pr-7 rtl:pl-0 mt-2 ${openDropdowns[9] ? "" : "hidden"}`} style={openDropdowns[9] ? { maxHeight: "none" } : { maxHeight: "0px" }}>
                                <li className={`mb-4 group ${isActive('/about') ? 'active' : ''}`}>
                                    <Link to="about"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.about', 'About')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/settings') ? 'active' : ''}`}>
                                    <Link to="settings"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.settings_page', 'Settings')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/manage-services') ? 'active' : ''}`}>
                                    <Link to="manage-services"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.manage_services', 'Manage Services')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/pricing') ? 'active' : ''}`}>
                                    <Link to="pricing"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.pricing', 'Pricing')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/faq') ? 'active' : ''}`}>
                                    <Link to="faq"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.faq', 'FAQ')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/roles-permissions') ? 'active' : ''}`}>
                                    <Link to="roles-permissions"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.roles_permissions', 'Roles & Permissions')}</Link>
                                </li>
                                <li className={`mb-1 group ${openDropdowns[33] ? "selected" : ""}`}>
                                    <Link to="#"
                                        onClick={() => handleOpenDropdown(33)}
                                        className="text-black dark:text-white/80 text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 before:mr-3 rtl:before:ml-3 rtl:before:mr-0 sidebar-dropdown-toggle">
                                        <span>{t('sidebar.blog', 'Blog')}</span>
                                        <i
                                            className="ri-arrow-right-s-line ml-auto rtl:mr-auto rtl:ml-0 rtl:rotate-180 group-[.selected]:rotate-90"></i>
                                    </Link>
                                    <ul className={`pl-9 rtl:pr-9 rtl:pl-0 mt-2 mb-2 ${openDropdowns[33] ? "" : "hidden"}`} style={openDropdowns[33] ? { maxHeight: "none" } : { maxHeight: "0px" }}>
                                        <li className={`mb-2 group ${isActive('/blog-grid') ? 'active' : ''}`}>
                                            <Link to="blog-grid"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.blog_grid', 'Grid View')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/blog-list') ? 'active' : ''}`}>
                                            <Link to="blog-list"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.blog_list', 'List View')}</Link>
                                        </li>
                                        <li className={`mb-2 group ${isActive('/blog-details') ? 'active' : ''}`}>
                                            <Link to="blog-details"
                                                className="text-black dark:text-white/70 group-[.active]:text-primary text-xs flex items-center hover:text-primary dark:hover:text-primary transition-colors py-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/40 dark:before:bg-white/40 group-[.active]:before:bg-primary before:mr-2.5 rtl:before:ml-2.5 rtl:before:mr-0">
                                                {t('sidebar.blog_details', 'Details')}</Link>
                                        </li>
                                    </ul>
                                </li>
                                <li className={`mb-4 group ${isActive('/blank') ? 'active' : ''}`}>
                                    <Link to="blank"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.blank_page', 'Blank Page')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/profile') ? 'active' : ''}`}>
                                    <Link to="profile"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.profile', 'Profile')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/news-grid') ? 'active' : ''}`}>
                                    <Link to="news-grid"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.news_grid', 'News Grid')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/comingsoon') ? 'active' : ''}`}>
                                    <Link to="comingsoon"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.coming_soon', 'Coming Soon')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/team') ? 'active' : ''}`}>
                                    <Link to="team"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.team', 'Team')}</Link>
                                </li>
                            </ul>
                        </li>
                        <li className={`mb-1 group ${openDropdowns[10] ? "selected" : ""}`}>
                            <Link to="#"
                                onClick={() => handleOpenDropdown(10)}
                                className="flex items-center py-2 px-4 text-black dark:text-white hover:bg-primary dark:hover:bg-primary hover:text-white rounded-md group-[.active]:bg-white group-[.active]:text-white group-[.selected]:bg-primary dark:group-[.selected]:bg-primary group-[.selected]:text-white sidebar-dropdown-toggle">
                                <i className="ri-remixicon-line mr-3 rtl:ml-3 rtl:mr-0 text-lg"></i>
                                <span className="text-sm">{t('sidebar.icon', 'Icon')}</span>
                                <i
                                    className="ri-arrow-right-s-line ml-auto rtl:mr-auto rtl:ml-0 rtl:rotate-180 group-[.selected]:rotate-90"></i>
                            </Link>
                            <ul className={`pl-7 rtl:pr-7 rtl:pl-0 mt-2 ${openDropdowns[10] ? "" : "hidden"}`} style={openDropdowns[10] ? { maxHeight: "none" } : { maxHeight: "0px" }}>
                                <li className={`mb-4 group ${isActive('/fontawesome-icons') ? 'active' : ''}`}>
                                    <Link to="fontawesome-icons"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.font_awesome', 'Font Awesome')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/remix-icons') ? 'active' : ''}`}>
                                    <Link to="remix-icons"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.remix_icon', 'Remix Icon')}</Link>
                                </li>

                            </ul>
                        </li>
                        <li className={`mb-1 group ${openDropdowns[11] ? "selected" : ""}`}>                            <Link to="#"
                            onClick={() => handleOpenDropdown(11)}
                            className="flex items-center py-2 px-4 text-black dark:text-white hover:bg-primary dark:hover:bg-primary hover:text-white rounded-md group-[.active]:bg-white group-[.active]:text-white group-[.selected]:bg-primary dark:group-[.selected]:bg-primary group-[.selected]:text-white sidebar-dropdown-toggle">
                            <i className="ri-map-pin-line mr-3 rtl:ml-3 rtl:mr-0 text-lg"></i>
                            <span className="text-sm">{t('sidebar.map', 'Maps')}</span>
                            <i
                                className="ri-arrow-right-s-line ml-auto rtl:mr-auto rtl:ml-0 rtl:rotate-180 group-[.selected]:rotate-90"></i>
                        </Link>
                            <ul className={`pl-7 rtl:pr-7 rtl:pl-0 mt-2 ${openDropdowns[11] ? "" : "hidden"}`} style={openDropdowns[11] ? { maxHeight: "none" } : { maxHeight: "0px" }}>
                                <li className={`mb-4 group ${isActive('/google-maps') ? 'active' : ''}`}>
                                    <Link to="google-maps"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.google_maps', 'Google Maps')}</Link>
                                </li>
                                <li className={`mb-4 group ${isActive('/vector-maps') ? 'active' : ''}`}>
                                    <Link to="vector-maps"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.vector_maps', 'Vector Maps')}</Link>
                                </li>
                            </ul>
                        </li>
                        <li className={`mb-1 group ${openDropdowns[34] ? "selected" : ""}`}>
                            <Link to="javascript:void(0)"
                                onClick={() => handleOpenDropdown(34)}
                                className="flex items-center py-2 px-4 text-black dark:text-white hover:bg-primary dark:hover:bg-primary hover:text-white rounded-md group-[.active]:bg-white group-[.active]:text-white group-[.selected]:bg-primary dark:group-[.selected]:bg-primary group-[.selected]:text-white sidebar-dropdown-toggle">
                                <i className="ri-share-line mr-3 rtl:ml-3 rtl:mr-0 text-lg"></i>
                                <span className="text-sm">{t('sidebar.multi_level', 'Multi Level')}</span>
                                <i
                                    className="ri-arrow-right-s-line ml-auto rtl:mr-auto rtl:ml-0 rtl:rotate-180 group-[.selected]:rotate-90"></i>
                            </Link>
                            <ul className={`pl-7 rtl:pr-7 rtl:pl-0 mt-2 ${openDropdowns[34] ? "" : "hidden"}`} style={openDropdowns[34] ? { maxHeight: "none" } : { maxHeight: "0px" }}>
                                <li className="mb-4">
                                    <Link to="javascript:void(0)"
                                        className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                        {t('sidebar.level_1_1', 'Level 1.1')}</Link>
                                </li>
                                <li className={`mb-4 group ${openDropdowns[35] ? "selected" : ""}`}>
                                    <Link to="javascript:void(0)"
                                        onClick={() => handleOpenDropdown(35)}
                                        className="text-black dark:text-white/80 text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 before:mr-3 rtl:before:ml-3 rtl:before:mr-0 sidebar-dropdown-toggle">
                                        {t('sidebar.level_1_2', 'Level 1.2')}
                                        <i
                                            className="ri-arrow-right-s-line ml-auto rtl:mr-auto rtl:ml-0 rtl:rotate-180 group-[.selected]:rotate-90"></i>
                                    </Link>
                                    <ul className={`pl-7 rtl:pr-7 rtl:pl-0 mt-2 ${openDropdowns[35] ? "" : "hidden"}`} style={openDropdowns[35] ? { maxHeight: "none" } : { maxHeight: "0px" }}>
                                        <li className="mb-4">
                                            <Link to="javascript:void(0)"
                                                className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                                {t('sidebar.level_2_1', 'Level 2.1')}</Link>
                                        </li>
                                        <li className="mb-4">
                                            <Link to="javascript:void(0)"
                                                className="text-black dark:text-white/80 group-[.active]:text-primary text-sm flex items-center hover:text-black dark:hover:text-white/60 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-black/70 group-[.active]:before:bg-primary before:mr-3 rtl:before:ml-3 rtl:before:mr-0">
                                                {t('sidebar.level_2_2', 'Level 2.2')}</Link>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                    </ul >
                </SimpleBar >
            </div >
            {/* Sidebar Backdrop Overlay */}
            {!openSidebar && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
                    onClick={handleCloseSidebar}
                ></div>
            )}
        </div >
    )
}

export default Sidebar;
