import React, { useState } from 'react'
import { useTheme } from '../context/ThemeContext'

const Setting = () => {

    const {
        theme, setTheme,
        dir, setDir,
        layout, setLayout,
        primaryColor, setPrimaryColor,
        navbarType, setNavbarType,
        footerType, setFooterType,
        cardStyle, setCardStyle,
        layoutRounded, setLayoutRounded,
        sidebarTheme, setSidebarTheme,
        headerTheme, setHeaderTheme,
        sidebarBg, setSidebarBg
    } = useTheme();

    const [openSetting, setOpenSetting] = useState(false);

    const handleOpenSetting = () => {
        setOpenSetting(!openSetting);
    }

    const handleSidebarBgUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSidebarBg(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            {/* Direct React-driven style injection for instant synchronization of Setting component details */}
            <style dangerouslySetInnerHTML={{
                __html: `
                #settings-toggle {
                    background-color: rgb(${primaryColor}) !important;
                    box-shadow: 0 10px 15px -3px rgba(${primaryColor}, 0.5), 0 4px 6px -4px rgba(${primaryColor}, 0.5) !important;
                }
                #settings-toggle:hover {
                    background-color: rgba(${primaryColor}, 0.9) !important;
                }
                #settings-offcanvas .bg-primary\\/5 {
                    background-color: rgba(${primaryColor}, 0.05) !important;
                }
                #settings-offcanvas .dark\\:bg-primary\\/10 {
                    background-color: rgba(${primaryColor}, 0.1) !important;
                }
                #settings-offcanvas .ri-settings-3-fill.text-primary {
                    color: rgba(${primaryColor}) !important;
                }
                .theme-color-btn.ring-black\\/40, .theme-color-btn.dark\\:ring-white\\/40 {
                    --tw-ring-color: rgba(${primaryColor}, 0.4) !important;
                }
                .theme-mode-btn.border-primary, .theme-dir-btn.border-primary, .theme-layout-btn.border-primary {
                    border-color: rgba(${primaryColor}) !important;
                    background-color: rgba(${primaryColor}, 0.05) !important;
                }
                .theme-mode-btn.border-primary i, .theme-dir-btn.border-primary i, .theme-layout-btn.border-primary i {
                    color: rgba(${primaryColor}) !important;
                }
            ` }} />
            {/* <!-- Settings Toggle Button --> */}
            <div className="fixed bottom-5 right-5 z-[100]">
                <button type="button" id="settings-toggle" onClick={handleOpenSetting}
                    className="size-12 rounded-full bg-primary text-white shadow-lg shadow-primary/50 flex items-center justify-center hover:bg-primary/90 transition-all hover:scale-110">
                    <i className="ri-settings-3-line text-2xl animate-spin-slow"></i>
                </button>
            </div>

            {/* <!-- Settings Offcanvas --> */}
            <div id="settings-offcanvas"
                className={openSetting ? "fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray shadow-2xl z-[105] transform translate-x-0 transition-transform duration-300 ease-in-out border-l border-black/5 dark:border-white/5" : "fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray shadow-2xl z-[105] transform translate-x-full transition-transform duration-300 ease-in-out border-l border-black/5 dark:border-white/5"}>
                <div className="h-full flex flex-col">
                    {/* <!-- Header --> */}
                    <div
                        className="p-4 border-b border-black/10 dark:border-white/10 flex items-center justify-between bg-primary/5 dark:bg-primary/10">
                        <h5 className="font-semibold text-lg text-black dark:text-white flex items-center gap-2">
                            <i className="ri-settings-3-fill text-primary"></i> Theme Settings
                        </h5>
                        <button type="button" id="settings-close"
                            onClick={() => setOpenSetting(!openSetting)}
                            className="size-8 rounded-full bg-black/5 dark:bg-white/10 dark:text-white/50  flex items-center justify-center hover:bg-danger hover:text-white transition-colors">
                            <i className="ri-close-line"></i>
                        </button>
                    </div>

                    {/* <!-- Body --> */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
                        {/* <!-- Theme Mode --> */}
                        <div>
                            <h6 className="text-sm font-semibold text-black dark:text-white/70 mb-3 uppercase tracking-wider">
                                Mode
                            </h6>
                            <div className="grid grid-cols-3 gap-2">
                                <button type="button"
                                    onClick={() => setTheme("light")}
                                    className={`theme-mode-btn p-3 rounded-lg border border-black/10 dark:border-white/10 hover:border-primary dark:hover:border-primary hover:bg-primary/5 transition-all text-center group ${theme === 'light' ? 'border-primary bg-primary/5' : ''}`}
                                    data-theme="light">
                                    <i
                                        className={`ri-sun-line text-xl mb-1 block group-hover:text-primary transition-colors ${theme === 'light' ? 'text-primary' : 'dark:text-white/60'}`}></i>
                                    <span className="text-xs font-medium text-black/60 dark:text-white/60">Light</span>
                                </button>
                                <button type="button"
                                    onClick={() => setTheme("dark")}
                                    className={`theme-mode-btn p-3 rounded-lg border border-black/10 dark:border-white/10 hover:border-primary dark:hover:border-primary hover:bg-primary/5 transition-all text-center group ${theme === 'dark' ? 'border-primary bg-primary/5' : ''}`}
                                    data-theme="dark">
                                    <i
                                        className={`ri-moon-line text-xl mb-1 block group-hover:text-primary transition-colors ${theme === 'dark' ? 'text-primary' : 'dark:text-white/60'}`}></i>
                                    <span className="text-xs font-medium text-black/60 dark:text-white/60">Dark</span>
                                </button>
                                <button type="button"
                                    onClick={() => setTheme("system")}
                                    className={`theme-mode-btn p-3 rounded-lg border border-black/10 dark:border-white/10 hover:border-primary dark:hover:border-primary hover:bg-primary/5 transition-all text-center group ${theme === 'system' ? 'border-primary bg-primary/5' : ''}`}
                                    data-theme="system">
                                    <i
                                        className={`ri-computer-line text-xl mb-1 block group-hover:text-primary transition-colors ${theme === 'system' ? 'text-primary' : 'dark:text-white/60'}`}></i>
                                    <span className="text-xs font-medium text-black/60 dark:text-white/60">System</span>
                                </button>
                            </div>
                        </div>

                        {/* <!-- Direction --> */}
                        <div>
                            <h6 className="text-sm font-semibold text-black dark:text-white/70 my-3 uppercase tracking-wider">
                                Direction</h6>
                            <div className="grid grid-cols-2 gap-2">
                                <button type="button"
                                    onClick={() => setDir("ltr")}
                                    className={`theme-dir-btn p-3 rounded-lg border border-black/10 dark:border-white/10 hover:border-primary dark:hover:border-primary hover:bg-primary/5 transition-all text-center group ${dir === 'ltr' ? 'border-primary bg-primary/5' : ''}`}
                                    data-dir="ltr">
                                    <i
                                        className={`ri-align-left text-xl mb-1 block group-hover:text-primary transition-colors ${dir === 'ltr' ? 'text-primary' : 'dark:text-white/60'}`}></i>
                                    <span className="text-xs font-medium text-black/60 dark:text-white/60">LTR</span>
                                </button>
                                <button type="button"
                                    onClick={() => setDir("rtl")}
                                    className={`theme-dir-btn p-3 rounded-lg border border-black/10 dark:border-white/10 hover:border-primary dark:hover:border-primary hover:bg-primary/5 transition-all text-center group ${dir === 'rtl' ? 'border-primary bg-primary/5' : ''}`}
                                    data-dir="rtl">
                                    <i
                                        className={`ri-align-right text-xl mb-1 block group-hover:text-primary transition-colors ${dir === 'rtl' ? 'text-primary' : 'dark:text-white/60'}`}></i>
                                    <span className="text-xs font-medium text-black/60 dark:text-white/60">RTL</span>
                                </button>
                            </div>
                        </div>

                        {/* <!-- Layout --> */}
                        <div>
                            <h6 className="text-sm font-semibold text-black dark:text-white/70 my-3 uppercase tracking-wider">
                                Layout</h6>
                            <div className="grid grid-cols-3 gap-2">
                                <button type="button" onClick={() => setLayout('vertical')}
                                    className={`theme-layout-btn p-3 rounded-lg border border-black/10 dark:border-white/10 hover:border-primary dark:hover:border-primary hover:bg-primary/5 transition-all text-center group ${layout === 'vertical' ? 'border-primary bg-primary/5' : ''}`}
                                    data-layout="vertical">
                                    <i
                                        className={`ri-layout-left-line text-xl mb-1 block group-hover:text-primary transition-colors ${layout === 'vertical' ? 'text-primary' : 'dark:text-white/60'}`}></i>
                                    <span className="text-xs font-medium text-black/60 dark:text-white/60">Vertical</span>
                                </button>
                                <button type="button" onClick={() => setLayout('horizontal')}
                                    className={`theme-layout-btn p-3 rounded-lg border border-black/10 dark:border-white/10 hover:border-primary dark:hover:border-primary hover:bg-primary/5 transition-all text-center group ${layout === 'horizontal' ? 'border-primary bg-primary/5' : ''}`}
                                    data-layout="horizontal">
                                    <i
                                        className={`ri-layout-top-line text-xl mb-1 block group-hover:text-primary transition-colors ${layout === 'horizontal' ? 'text-primary' : 'dark:text-white/60'}`}></i>
                                    <span className="text-xs font-medium text-black/60 dark:text-white/60">Horizontal</span>
                                </button>
                                <button type="button" onClick={() => setLayout('mini')}
                                    className={`theme-layout-btn p-3 rounded-lg border border-black/10 dark:border-white/10 hover:border-primary dark:hover:border-primary hover:bg-primary/5 transition-all text-center group ${layout === 'mini' ? 'border-primary bg-primary/5' : ''}`}
                                    data-layout="mini">
                                    <i
                                        className={`ri-layout-left-2-line text-xl mb-1 block group-hover:text-primary transition-colors ${layout === 'mini' ? 'text-primary' : 'dark:text-white/60'}`}></i>
                                    <span className="text-xs font-medium text-black/60 dark:text-white/60">Mini</span>
                                </button>
                            </div>
                        </div>

                        {/* <!-- Primary Color --> */}
                        <div className="mb-5">
                            <h6 className="text-sm font-semibold text-black dark:text-white/70 my-3 uppercase tracking-wider">
                                Primary Color</h6>
                            <div className="flex flex-wrap gap-2">
                                <button type="button" onClick={() => setPrimaryColor('132 90 223')}
                                    className={`w-8 h-8 rounded-full bg-[#845adf] ring-2 ring-transparent ring-offset-white dark:ring-offset-gray hover:ring-offset-2 hover:ring-black/20 dark:hover:ring-white/20 transition-all theme-color-btn ${primaryColor === '132 90 223' ? 'ring-offset-2 ring-black/40 dark:ring-white/40 border-2 border-white' : ''}`}
                                    data-color="132 90 223"></button>
                                <button type="button" onClick={() => setPrimaryColor('13 110 253')}
                                    className={`w-8 h-8 rounded-full bg-[#0d6efd] ring-2 ring-transparent ring-offset-white dark:ring-offset-gray hover:ring-offset-2 hover:ring-black/20 dark:hover:ring-white/20 transition-all theme-color-btn ${primaryColor === '13 110 253' ? 'ring-offset-2 ring-black/40 dark:ring-white/40 border-2 border-white' : ''}`}
                                    data-color="13 110 253"></button>
                                <button type="button" onClick={() => setPrimaryColor('25 135 84')}
                                    className={`w-8 h-8 rounded-full bg-[#198754] ring-2 ring-transparent ring-offset-white dark:ring-offset-gray hover:ring-offset-2 hover:ring-black/20 dark:hover:ring-white/20 transition-all theme-color-btn ${primaryColor === '25 135 84' ? 'ring-offset-2 ring-black/40 dark:ring-white/40 border-2 border-white' : ''}`}
                                    data-color="25 135 84"></button>
                                <button type="button" onClick={() => setPrimaryColor('253 126 20')}
                                    className={`w-8 h-8 rounded-full bg-[#fd7e14] ring-2 ring-transparent ring-offset-white dark:ring-offset-gray hover:ring-offset-2 hover:ring-black/20 dark:hover:ring-white/20 transition-all theme-color-btn ${primaryColor === '253 126 20' ? 'ring-offset-2 ring-black/40 dark:ring-white/40 border-2 border-white' : ''}`}
                                    data-color="253 126 20"></button>
                                <button type="button" onClick={() => setPrimaryColor('220 53 69')}
                                    className={`w-8 h-8 rounded-full bg-[#dc3545] ring-2 ring-transparent ring-offset-white dark:ring-offset-gray hover:ring-offset-2 hover:ring-black/20 dark:hover:ring-white/20 transition-all theme-color-btn ${primaryColor === '220 53 69' ? 'ring-offset-2 ring-black/40 dark:ring-white/40 border-2 border-white' : ''}`}
                                    data-color="220 53 69"></button>
                            </div>
                        </div>

                        {/* <!-- Layout Rounded --> */}
                        <div className="mb-5">
                            <h6 className="text-sm font-semibold text-black dark:text-white/70 my-3 uppercase tracking-wider">
                                Layout Rounded</h6>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { label: 'None', value: '0px' },
                                    { label: 'Small', value: '0.25rem' },
                                    { label: 'Default', value: '0.375rem' },
                                    { label: 'Large', value: '0.75rem' },
                                    { label: 'Extra', value: '1.5rem' }
                                ].map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => setLayoutRounded(option.value)}
                                        className={`px-3 py-1.5 rounded-lg border transition-all text-xs font-medium ${layoutRounded === option.value ? 'border-primary bg-primary/5 text-primary' : 'border-black/10 dark:border-white/10 hover:border-primary dark:text-white/60 hover:bg-primary/5 text-black/60'}`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* <!-- Navbar Type --> */}
                        <div className="mb-5">
                            <h6 className="text-sm font-semibold text-black dark:text-white/70 my-3 uppercase tracking-wider">
                                Navbar Type</h6>
                            <div className="flex flex-wrap gap-2">
                                {['sticky', 'static', 'hidden'].map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setNavbarType(type)}
                                        className={`px-3 py-1.5 rounded-lg border transition-all text-xs font-medium capitalize ${navbarType === type ? 'border-primary bg-primary/5 text-primary' : 'border-black/10 dark:border-white/10 hover:border-primary dark:text-white/60 hover:bg-primary/5 text-black/60'}`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* <!-- Footer Type --> */}
                        <div className="mb-5">
                            <h6 className="text-sm font-semibold text-black dark:text-white/70 my-3 uppercase tracking-wider">
                                Footer Type</h6>
                            <div className="flex flex-wrap gap-2">
                                {['sticky', 'static', 'hidden'].map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setFooterType(type)}
                                        className={`px-3 py-1.5 rounded-lg border transition-all text-xs font-medium capitalize ${footerType === type ? 'border-primary bg-primary/5 text-primary' : 'border-black/10 dark:border-white/10 hover:border-primary dark:text-white/60 hover:bg-primary/5 text-black/60'}`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* <!-- Card Style --> */}
                        <div className="mb-5">
                            <h6 className="text-sm font-semibold text-black dark:text-white/70 my-3 uppercase tracking-wider">
                                Card Style</h6>
                            <div className="flex flex-wrap gap-2">
                                {['shadow', 'border'].map((style) => (
                                    <button
                                        key={style}
                                        type="button"
                                        onClick={() => setCardStyle(style)}
                                        className={`px-3 py-1.5 rounded-lg border transition-all text-xs font-medium capitalize ${cardStyle === style ? 'border-primary bg-primary/5 text-primary' : 'border-black/10 dark:border-white/10 hover:border-primary dark:text-white/60 hover:bg-primary/5 text-black/60'}`}
                                    >
                                        {style}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* <!-- Sidebar Settings --> */}
                        <div className="mb-5">
                            <h6 className="text-sm font-semibold text-black dark:text-white/70 my-3 uppercase tracking-wider">
                                Sidebar Settings</h6>

                            <p className="text-xs text-black/50 dark:text-white/50 mb-2 font-medium">Theme</p>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {['default', 'brand'].map((t) => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => setSidebarTheme(t)}
                                        className={`px-3 py-1.5 rounded-lg border transition-all text-xs font-medium capitalize ${sidebarTheme === t ? 'border-primary bg-primary/5 text-primary' : 'border-black/10 dark:border-white/10 hover:border-primary dark:text-white/60 hover:bg-primary/5 text-black/60'}`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* <!-- Header Settings --> */}
                        <div className="mb-5">
                            <h6 className="text-sm font-semibold text-black dark:text-white/70 my-3 uppercase tracking-wider">
                                Header Settings</h6>

                            <p className="text-xs text-black/50 dark:text-white/50 mb-2 font-medium">Theme</p>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {['default', 'brand'].map((t) => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => setHeaderTheme(t)}
                                        className={`px-3 py-1.5 rounded-lg border transition-all text-xs font-medium capitalize ${headerTheme === t ? 'border-primary bg-primary/5 text-primary' : 'border-black/10 dark:border-white/10 hover:border-primary dark:text-white/60 hover:bg-primary/5 text-black/60'}`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* <!-- Sidebar Background --> */}
                        <div className="mb-5">
                            <h6 className="text-sm font-semibold text-black dark:text-white/70 my-3 uppercase tracking-wider">
                                Sidebar Background</h6>
                            <div className="grid grid-cols-4 gap-2 mb-3">
                                {[1, 2, 3, 4].map((num) => {
                                    const bgPath = `/images/sidebar-bg/${num}.jpg`;
                                    return (
                                        <button key={num} type="button"
                                            onClick={() => setSidebarBg(bgPath)}
                                            className={`aspect-square rounded-lg bg-cover bg-center border-2 transition-all ${sidebarBg === bgPath ? 'border-primary ring-2 ring-primary/20' : 'border-black/10 dark:border-white/10 hover:border-primary'}`}
                                            style={{ backgroundImage: `url(${bgPath})` }}></button>
                                    );
                                })}
                            </div>
                            <div className="flex gap-2">
                                <label className="flex-1 cursor-pointer">
                                    <input type="file" id="sidebar-bg-upload" className="hidden" accept="image/*" onChange={handleSidebarBgUpload} />
                                    <span
                                        className="block w-full py-2 px-3 rounded-lg border border-dashed border-primary/50 text-primary hover:bg-primary/5 text-center text-xs font-medium transition-all">
                                        <i className="ri-upload-cloud-line mr-1"></i> Upload
                                    </span>
                                </label>
                                <button type="button" onClick={() => setSidebarBg('none')}
                                    className="px-4 py-2 rounded-lg border border-danger/30 text-danger hover:bg-danger/5 text-xs font-medium transition-all">
                                    <i className="ri-delete-bin-line mr-1"></i> Remove
                                </button>
                            </div>
                        </div>

                        {/* <!-- Reset Settings --> */}
                        <div className="pt-4 border-t border-black/10 dark:border-white/10">
                            <button type="button"
                                onClick={() => {
                                    localStorage.clear();
                                    window.location.reload();
                                }}
                                className="w-full py-2.5 rounded-lg bg-danger/10 text-danger hover:bg-danger hover:text-white transition-all text-sm font-semibold flex items-center justify-center gap-2">
                                <i className="ri-refresh-line"></i> Reset All Settings
                            </button>
                        </div>

                        {/* <!-- Divider --> */}
                        <div className="pt-4">
                            <p className="text-xs text-info flex items-start gap-2 italic">
                                <i className="ri-information-line text-lg mt-px"></i>
                                Settings are automatically saved to your browser's local storage.
                            </p>
                        </div>
                    </div>
                </div>

                {/* <!-- Footer --> */}
                <div className="p-4 border-t border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-center">
                    <p className="text-xs text-black/50 dark:text-white/50">&copy; 2025 Turbine UI</p>
                </div>
            </div>

            {/* <!-- Overlay --> */}
            <div id="settings-overlay" onClick={() => setOpenSetting(!openSetting)} className={openSetting ? "fixed inset-0 bg-black/50 z-[104] backdrop-blur-xs transition-opacity" : "hidden"}>
            </div>
        </div>
    )
}

export default Setting
