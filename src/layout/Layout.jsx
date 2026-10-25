import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import MartHeader from '../component/MartHeader'
import MartSidebar from '../component/MartSidebar'

const Layout = () => {
    const [openSidebar, setOpenSidebar] = useState(false);
    const { pathname } = useLocation();
    const isBillingPage = pathname === '/invoice-create';

    return (
        <div className="min-h-screen bg-[#f7f8fa] dark:bg-black lg:flex">
            {!isBillingPage && <MartSidebar open={openSidebar} onClose={() => setOpenSidebar(false)} />}
            <main className="min-w-0 flex-1">
                <MartHeader onMenuClick={isBillingPage ? undefined : () => setOpenSidebar(true)} />
                <div className="min-h-[calc(100vh-4rem)]">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}

export default Layout
