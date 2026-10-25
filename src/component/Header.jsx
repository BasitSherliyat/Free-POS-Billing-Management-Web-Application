import React, { useState, useEffect, useRef } from 'react'
import { useTheme } from '../context/ThemeContext'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'

const Header = ({ openSidebar, handleOpenSidebar }) => {
    const { t, i18n } = useTranslation();
    const { theme, setTheme, navbarType } = useTheme();
    const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
    const [activeNotificationTab, setActiveNotificationTab] = useState('notifications');
    const [isFullscreen, setIsFullscreen] = useState(false);

    const languageDropdownRef = useRef(null);
    const searchDropdownRef = useRef(null);
    const profileDropdownRef = useRef(null);
    const notificationDropdownRef = useRef(null);
    const cartDropdownRef = useRef(null);
    const appsDropdownRef = useRef(null);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((err) => {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        const handleClickOutside = (event) => {
            if (openDropdownIndex !== null) {
                const refs = [null, languageDropdownRef, searchDropdownRef, notificationDropdownRef, profileDropdownRef];
                const currentRef = refs[openDropdownIndex];
                if (currentRef && currentRef.current && !currentRef.current.contains(event.target)) {
                    setOpenDropdownIndex(null);
                }
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openDropdownIndex]);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setOpenDropdownIndex(null);
    };

    const handleOpenDropdown = (index) => {
        setOpenDropdownIndex(openDropdownIndex === index ? null : index);
    }

    return (
        <>
            <div id="navbar"
                className={`py-4 px-6 bg-white dark:bg-gray flex items-center shadow-md shadow-black/5 left-0 rtl:left-auto rtl:right-0 z-30 ${navbarType === 'hidden' ? 'hidden' : navbarType === 'sticky' ? 'sticky top-0' : 'relative'}`}>
                <button type="button" className="text-lg text-black-600 sidebar-toggle" onClick={handleOpenSidebar}>
                    <i className="ri-menu-line dark:text-white/80"></i>
                </button>
                <form action="" className="search-bar mx-3 sm:flex hidden">
                    <div className="relative w-full">
                        <input type="text"
                            className="py-2 pr-4 pl-10 rtl:pl-4 rtl:pr-10 bg-black/5 dark:text-white/70 dark:bg-black/40 w-full outline-none border border-black/10 dark:border-white/10 rounded-md text-sm focus:border-primary transition-all"
                            placeholder={t('nav.search', 'Search...')} />
                        <i
                            className="ri-search-line absolute top-1/2 left-4 rtl:left-auto rtl:right-4 -translate-y-1/2 dark:text-white/30 text-black/30"></i>
                    </div>
                </form>
                <ul className="ml-auto rtl:mr-auto rtl:ml-0 flex items-center">
                    <li className="mr-1 rtl:ml-1 rtl:mr-0">
                        <button type="button" id="dark-mode-toggle"
                            className="w-8 h-8 rounded flex items-center justify-center dark:text-white/80 hover:bg-black/10 dark:hover:bg-dark/60 hover:text-black dark:hover:text-white/40">
                            <i className="ri-sun-fill hidden dark:flex" onClick={() => setTheme(theme === "light" ? "dark" : "light")}></i>
                            <i className="ri-moon-fill flex dark:hidden text-black" onClick={() => setTheme(theme === "light" ? "dark" : "light")}></i>
                        </button>
                    </li>
                    <li className="mr-1 rtl:ml-1 rtl:mr-0">
                        <div className="md:flex hidden">
                            <button data-toggle="fullscreen" type="button"
                                onClick={toggleFullscreen}
                                className="nav-link p-2 rounded dark:text-white/80 hover:bg-black/10 dark:hover:bg-dark/60 hover:text-black dark:hover:text-white/40">
                                <span className="sr-only" data-i18n="nav.fullscreen">{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Mode'}</span>
                                <span className="flex items-center justify-center">
                                    <i className={isFullscreen ? "ri-fullscreen-exit-line" : "ri-fullscreen-line"}></i>
                                </span>
                            </button>
                        </div>
                    </li>

                    {/* <!-- Language Switcher Dropdown --> */}
                    <li className="mr-1 rtl:ml-1 rtl:mr-0 dropdown" ref={languageDropdownRef}>
                        <button type="button" id="lang-dropdown-btn"
                            onClick={() => handleOpenDropdown(1)}
                            className="dropdown-toggle flex items-center gap-1 px-2 h-8 rounded dark:text-white/80 hover:bg-black/10 dark:hover:bg-dark/60 hover:text-black dark:hover:text-white/40 text-sm font-medium">
                            <span className="lang-flag text-base leading-none">
                                <img src={`/images/flags/${i18n.language === 'en' ? 'us' : i18n.language === 'nl' ? 'dutch' : i18n.language === 'it' ? 'ita' : i18n.language === 'hi' ? 'ind' : i18n.language === 'ar' ? 'arabic.jpg' : i18n.language === 'fr' ? 'france' : i18n.language === 'de' ? 'ger' : i18n.language === 'ja' ? 'japanese' : i18n.language === 'ru' ? 'russia' : i18n.language === 'zh' ? 'china' : 'spain'}.png`.replace('.png.jpg', '.jpg').replace('.png.png', '.png')} alt={i18n.language} className="w-5 h-5 object-cover rounded-sm" />
                            </span>
                            <span className="lang-code text-[11px] font-semibold text-black dark:text-white/70 uppercase">{i18n.language}</span>
                            <i className="ri-arrow-down-s-line text-xs opacity-60"></i>
                        </button>
                        <div
                            className={`dropdown-menu shadow-xl shadow-black/5 z-30 rounded-lg bg-white dark:bg-black border border-black/10 dark:border-white/10 w-48 py-2 absolute right-0 top-full mt-2 ${openDropdownIndex === 1 ? "block" : "hidden"}`}
                        >
                            <div className="px-3 py-1.5 text-[11px] font-semibold text-black/40 dark:text-white/40 uppercase tracking-wider"
                                data-i18n="nav.language">Language</div>

                            <SimpleBar style={{ maxHeight: '288px' }}>
                                <Link to="#" onClick={() => changeLanguage('en')}
                                    className="flex items-center gap-2.5 px-3 py-2 text-[13px] text-black dark:text-white/70 hover:bg-primary/10 hover:text-primary transition-colors rounded mx-1">
                                    <img src="/images/flags/us.png" alt="English"
                                        className="w-5 h-5 object-cover rounded-sm" />
                                    <span>English</span>
                                </Link>
                                <Link to="#" onClick={() => changeLanguage('nl')}
                                    className="flex items-center gap-2.5 px-3 py-2 text-[13px] text-black dark:text-white/70 hover:bg-primary/10 hover:text-primary transition-colors rounded mx-1">
                                    <img src="/images/flags/dutch.png" alt="Dutch"
                                        className="w-5 h-5 object-cover rounded-sm" />
                                    <span>Dutch</span>
                                </Link>
                                <Link to="#" onClick={() => changeLanguage('it')}
                                    className="flex items-center gap-2.5 px-3 py-2 text-[13px] text-black dark:text-white/70 hover:bg-primary/10 hover:text-primary transition-colors rounded mx-1">
                                    <img src="/images/flags/ita.png" alt="Italian"
                                        className="w-5 h-5 object-cover rounded-sm" />
                                    <span>Italian</span>
                                </Link>
                                <Link to="#" onClick={() => changeLanguage('hi')}
                                    className="flex items-center gap-2.5 px-3 py-2 text-[13px] text-black dark:text-white/70 hover:bg-primary/10 hover:text-primary transition-colors rounded mx-1">
                                    <img src="/images/flags/ind.png" alt="Hindi"
                                        className="w-5 h-5 object-cover rounded-sm" />
                                    <span>Hindi</span>
                                </Link>
                                <Link to="#" onClick={() => changeLanguage('ar')}
                                    className="flex items-center gap-2.5 px-3 py-2 text-[13px] text-black dark:text-white/70 hover:bg-primary/10 hover:text-primary transition-colors rounded mx-1">
                                    <img src="/images/flags/arabic.jpg" alt="Arabic"
                                        className="w-5 h-5 object-cover rounded-sm" />
                                    <span>Arabic</span>
                                </Link>
                                <Link to="#" onClick={() => changeLanguage('fr')}
                                    className="flex items-center gap-2.5 px-3 py-2 text-[13px] text-black dark:text-white/70 hover:bg-primary/10 hover:text-primary transition-colors rounded mx-1">
                                    <img src="/images/flags/france.png" alt="French"
                                        className="w-5 h-5 object-cover rounded-sm" />
                                    <span>French</span>
                                </Link>
                                <Link to="#" onClick={() => changeLanguage('de')}
                                    className="flex items-center gap-2.5 px-3 py-2 text-[13px] text-black dark:text-white/70 hover:bg-primary/10 hover:text-primary transition-colors rounded mx-1">
                                    <img src="/images/flags/ger.png" alt="German"
                                        className="w-5 h-5 object-cover rounded-sm" />
                                    <span>German</span>
                                </Link>
                                <Link to="#" onClick={() => changeLanguage('ja')}
                                    className="flex items-center gap-2.5 px-3 py-2 text-[13px] text-black dark:text-white/70 hover:bg-primary/10 hover:text-primary transition-colors rounded mx-1">
                                    <img src="/images/flags/japanese.png" alt="Japanese"
                                        className="w-5 h-5 object-cover rounded-sm" />
                                    <span>Japanese</span>
                                </Link>
                                <Link to="#" onClick={() => changeLanguage('ru')}
                                    className="flex items-center gap-2.5 px-3 py-2 text-[13px] text-black dark:text-white/70 hover:bg-primary/10 hover:text-primary transition-colors rounded mx-1">
                                    <img src="/images/flags/russia.png" alt="Russian"
                                        className="w-5 h-5 object-cover rounded-sm" />
                                    <span>Russian</span>
                                </Link>
                                <Link to="#" onClick={() => changeLanguage('zh')}
                                    className="flex items-center gap-2.5 px-3 py-2 text-[13px] text-black dark:text-white/70 hover:bg-primary/10 hover:text-primary transition-colors rounded mx-1">
                                    <img src="/images/flags/china.png" alt="Chinese"
                                        className="w-5 h-5 object-cover rounded-sm" />
                                    <span>Chinese</span>
                                </Link>
                                <Link to="#" onClick={() => changeLanguage('es')}
                                    className="flex items-center gap-2.5 px-3 py-2 text-[13px] text-black dark:text-white/70 hover:bg-primary/10 hover:text-primary transition-colors rounded mx-1">
                                    <img src="/images/flags/spain.png" alt="Spanish"
                                        className="w-5 h-5 object-cover rounded-sm" />
                                    <span>Spanish</span>
                                </Link>
                            </SimpleBar>
                        </div>

                    </li>

                    <li className="mr-1 rtl:ml-1 rtl:mr-0 dropdown" ref={searchDropdownRef}>
                        <button type="button"
                            onClick={() => handleOpenDropdown(2)}
                            className="dropdown-toggle text-blue-800 w-8 h-8 rounded flex items-center justify-center dark:text-white/80 hover:bg-black/10 dark:hover:bg-dark/60 hover:text-black dark:hover:text-white/40">
                            <i className="ri-search-line"></i>
                        </button>
                        <div
                            className={`dropdown-menu shadow-md shadow-black/5 z-30 max-w-xs w-full bg-white dark:bg-black dark:border-black/10 rounded-md border border-black/10 absolute right-0 top-full mt-2 ${openDropdownIndex === 2 ? "block" : "hidden"}`}
                        >
                            <form action="" className="p-4 border-b border-b-black/10">
                                <div className="relative w-full">
                                    <input type="text"
                                        className="py-2 pr-4 pl-10 rtl:pl-4 rtl:pr-10 bg-black/5 dark:text-white/70 dark:bg-black/40 w-full outline-none border border-black/10 dark:border-white/10 rounded-md text-sm focus:border-primary transition-all"
                                        data-i18n-placeholder="nav.search" placeholder="Search..." />
                                    <i
                                        className="ri-search-line absolute top-1/2 left-4 rtl:left-auto rtl:right-4 -translate-y-1/2 text-black/30 dark:text-white"></i>
                                </div>
                            </form>
                            <div className="mt-3 mb-2">
                                <div className="text-[13px] font-medium text-black/40 dark:text-white/80 ml-4 rtl:mr-4 rtl:ml-0 mb-2"
                                    data-i18n="nav.recently">Recently</div>
                                <SimpleBar style={{ maxHeight: '256px' }}>
                                    <ul>
                                        <li>
                                            <Link to="#"
                                                className="py-2 px-4 flex items-center dark:hover:bg-white/40 hover:bg-primary/20 group">
                                                <img src="/images/user/user-13.jpg" alt=""
                                                    className="w-8 h-8 rounded block object-cover align-middle" />
                                                <div className="ml-2 rtl:mr-2 rtl:ml-0">
                                                    <div
                                                        className="text-[13px] text-black dark:text-white/80 font-medium truncate group-hover:text-primary dark:group-hover:text-primary">
                                                        Create landing page</div>
                                                    <div
                                                        className="text-[11px] text-black dark:text-white/80 group-hover:text-primary">
                                                        $345</div>
                                                </div>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="#"
                                                className="py-2 px-4 flex items-center dark:hover:bg-white/40 hover:bg-primary/20 group">
                                                <img src="/images/user/user-12.jpg" alt=""
                                                    className="w-8 h-8 rounded block object-cover align-middle" />
                                                <div className="ml-2 rtl:mr-2 rtl:ml-0">
                                                    <div
                                                        className="text-[13px] text-black dark:text-white/80 font-medium truncate group-hover:text-primary dark:group-hover:text-primary">
                                                        Create landing page</div>
                                                    <div
                                                        className="text-[11px] text-black dark:text-white/80 group-hover:text-primary">
                                                        $345</div>
                                                </div>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="#"
                                                className="py-2 px-4 flex items-center dark:hover:bg-white/40 hover:bg-primary/20 group">
                                                <img src="/images/user/user-11.jpg" alt=""
                                                    className="w-8 h-8 rounded block object-cover align-middle" />
                                                <div className="ml-2 rtl:mr-2 rtl:ml-0">
                                                    <div
                                                        className="text-[13px] text-black dark:text-white/80 font-medium truncate group-hover:text-primary dark:group-hover:text-primary">
                                                        Create landing page</div>
                                                    <div
                                                        className="text-[11px] text-black dark:text-white/80 group-hover:text-primary">
                                                        $345</div>
                                                </div>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="#"
                                                className="py-2 px-4 flex items-center dark:hover:bg-white/40 hover:bg-primary/20 group">
                                                <img src="/images/user/user-10.jpg" alt=""
                                                    className="w-8 h-8 rounded block object-cover align-middle" />
                                                <div className="ml-2 rtl:mr-2 rtl:ml-0">
                                                    <div
                                                        className="text-[13px] text-black dark:text-white/80 font-medium truncate group-hover:text-primary dark:group-hover:text-primary">
                                                        Create landing page</div>
                                                    <div
                                                        className="text-[11px] text-black dark:text-white/80 group-hover:text-primary">
                                                        $345</div>
                                                </div>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="#"
                                                className="py-2 px-4 flex items-center dark:hover:bg-white/40 hover:bg-primary/20 group">
                                                <img src="/images/user/user-9.jpg" alt=""
                                                    className="w-8 h-8 rounded block object-cover align-middle" />
                                                <div className="ml-2 rtl:mr-2 rtl:ml-0">
                                                    <div
                                                        className="text-[13px] text-black dark:text-white/80 font-medium truncate group-hover:text-primary dark:group-hover:text-primary">
                                                        Create landing page</div>
                                                    <div
                                                        className="text-[11px] text-black dark:text-white/80 group-hover:text-primary">
                                                        $345</div>
                                                </div>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="#"
                                                className="py-2 px-4 flex items-center dark:hover:bg-white/40 hover:bg-primary/20 group">
                                                <img src="/images/user/user-8.jpg" alt=""
                                                    className="w-8 h-8 rounded block object-cover align-middle" />
                                                <div className="ml-2 rtl:mr-2 rtl:ml-0">
                                                    <div
                                                        className="text-[13px] text-black dark:text-white/80 font-medium truncate group-hover:text-primary dark:group-hover:text-primary">
                                                        Create landing page</div>
                                                    <div
                                                        className="text-[11px] text-black dark:text-white/80 group-hover:text-primary">
                                                        $345</div>
                                                </div>
                                            </Link>
                                        </li>
                                    </ul>
                                </SimpleBar>
                            </div>
                        </div>
                    </li>
                    <li className="dropdown" ref={notificationDropdownRef}>
                        <button type="button"
                            onClick={() => handleOpenDropdown(3)}
                            className="dropdown-toggle text-blue-800 w-8 h-8 rounded flex items-center justify-center dark:text-white/80 hover:bg-black/10 dark:hover:bg-dark/60 hover:text-black dark:hover:text-white/40">
                            <i className="ri-notification-3-line"></i>
                        </button>
                        <div
                            className={`dropdown-menu shadow-md shadow-black/5 z-30 max-w-xs w-full bg-white dark:bg-black dark:border-black rounded-md border border-black/10 absolute right-0 top-full mt-2 ${openDropdownIndex === 3 ? "block" : "hidden"}`}
                        >
                            <div className="flex items-center px-4 pt-4 border-b border-b-black/10 notification-tab">
                                <button type="button"
                                    onClick={(e) => { e.stopPropagation(); setActiveNotificationTab('notifications'); }}
                                    className={`text-dark/40 font-medium text-[13px] hover:text-black dark:hover:text-white dark:text-white/60 border-b-2 mr-4 rtl:ml-4 rtl:mr-0 pb-1 ${activeNotificationTab === 'notifications' ? 'border-primary text-black dark:text-white active' : 'border-b-transparent'}`}
                                    data-i18n="nav.notifications">Notifications</button>
                                <button type="button"
                                    onClick={(e) => { e.stopPropagation(); setActiveNotificationTab('messages'); }}
                                    className={`text-dark/40 font-medium text-[13px] hover:text-black dark:hover:text-white dark:text-white/60 border-b-2 mr-4 rtl:ml-4 rtl:mr-0 pb-1 ${activeNotificationTab === 'messages' ? 'border-primary text-black dark:text-white active' : 'border-b-transparent'}`}
                                    data-i18n="nav.messages">Messages</button>
                            </div>
                            <div className="my-2 relative">
                                <SimpleBar style={{ maxHeight: '256px' }} className={`${activeNotificationTab === 'notifications' ? '' : 'hidden'}`}>
                                    <ul data-tab-for="notification" data-page="notifications">
                                        <li>
                                            <Link to="#"
                                                className="py-2 px-4 flex items-center dark:hover:bg-white/40 hover:bg-primary/20 group">
                                                <img src="/images/user/user-10.jpg" alt=""
                                                    className="w-8 h-8 rounded block object-cover align-middle" />
                                                <div className="ml-2 rtl:mr-2 rtl:ml-0">
                                                    <div className="text-[13px] text-black dark:text-white/80 font-medium truncate group-hover:text-primary dark:group-hover:text-primary"
                                                        data-i18n="nav.new_order">New order</div>
                                                    <div className="text-[11px] text-black dark:text-white/80 group-hover:text-primary"
                                                        data-i18n="nav.from_user">from a user</div>
                                                </div>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="#"
                                                className="py-2 px-4 flex items-center dark:hover:bg-white/40 hover:bg-primary/20 group">
                                                <img src="/images/user/user-12.jpg" alt=""
                                                    className="w-8 h-8 rounded block object-cover align-middle" />
                                                <div className="ml-2 rtl:mr-2 rtl:ml-0">
                                                    <div className="text-[13px] text-black dark:text-white/80 font-medium truncate group-hover:text-primary dark:group-hover:text-primary"
                                                        data-i18n="nav.new_order">New order</div>
                                                    <div className="text-[11px] text-black dark:text-white/80 group-hover:text-primary"
                                                        data-i18n="nav.from_user">from a user</div>
                                                </div>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="#"
                                                className="py-2 px-4 flex items-center dark:hover:bg-white/40 hover:bg-primary/20 group">
                                                <img src="/images/user/user-11.jpg" alt=""
                                                    className="w-8 h-8 rounded block object-cover align-middle" />
                                                <div className="ml-2 rtl:mr-2 rtl:ml-0">
                                                    <div className="text-[13px] text-black dark:text-white/80 font-medium truncate group-hover:text-primary dark:group-hover:text-primary"
                                                        data-i18n="nav.new_order">New order</div>
                                                    <div className="text-[11px] text-black dark:text-white/80 group-hover:text-primary"
                                                        data-i18n="nav.from_user">from a user</div>
                                                </div>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="#"
                                                className="py-2 px-4 flex items-center dark:hover:bg-white/40 hover:bg-primary/20 group">
                                                <img src="/images/user/user-13.jpg" alt=""
                                                    className="w-8 h-8 rounded block object-cover align-middle" />
                                                <div className="ml-2 rtl:mr-2 rtl:ml-0">
                                                    <div className="text-[13px] text-black dark:text-white/80 font-medium truncate group-hover:text-primary dark:group-hover:text-primary"
                                                        data-i18n="nav.new_order">New order</div>
                                                    <div className="text-[11px] text-black dark:text-white/80 group-hover:text-primary"
                                                        data-i18n="nav.from_user">from a user</div>
                                                </div>
                                            </Link>
                                        </li>
                                    </ul>
                                </SimpleBar>
                                <SimpleBar style={{ maxHeight: '256px' }} className={`${activeNotificationTab === 'messages' ? '' : 'hidden'}`}>
                                    <ul data-tab-for="notification" data-page="messages">
                                        <li>
                                            <Link to="#"
                                                className="py-2 px-4 flex items-center dark:hover:bg-white/40 hover:bg-primary/20  group">
                                                <img src="/images/user/user-10.jpg" alt=""
                                                    className="w-8 h-8 rounded block object-cover align-middle" />
                                                <div className="ml-2 rtl:mr-2 rtl:ml-0">
                                                    <div
                                                        className="text-[13px] text-black  dark:text-white/80 font-medium truncate group-hover:text-primary dark:group-hover:text-primary">
                                                        John Doe</div>
                                                    <div className="text-[11px] text-black  dark:text-white/80 group-hover:text-primary"
                                                        data-i18n="nav.hello">Hello there!</div>
                                                </div>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="#"
                                                className="py-2 px-4 flex items-center dark:hover:bg-white/40 hover:bg-primary/20  group">
                                                <img src="/images/user/user-9.jpg" alt=""
                                                    className="w-8 h-8 rounded block object-cover align-middle" />
                                                <div className="ml-2 rtl:mr-2 rtl:ml-0">
                                                    <div
                                                        className="text-[13px] text-black  dark:text-white/80 font-medium truncate group-hover:text-primary dark:group-hover:text-primary">
                                                        John Doe</div>
                                                    <div className="text-[11px] text-black  dark:text-white/80 group-hover:text-primary"
                                                        data-i18n="nav.hello">Hello there!</div>
                                                </div>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="#"
                                                className="py-2 px-4 flex items-center dark:hover:bg-white/40 hover:bg-primary/20  group">
                                                <img src="/images/user/user-8.jpg" alt=""
                                                    className="w-8 h-8 rounded block object-cover align-middle" />
                                                <div className="ml-2 rtl:mr-2 rtl:ml-0">
                                                    <div
                                                        className="text-[13px] text-black  dark:text-white/80 font-medium truncate group-hover:text-primary dark:group-hover:text-primary">
                                                        John Doe</div>
                                                    <div className="text-[11px] text-black  dark:text-white/80 group-hover:text-primary"
                                                        data-i18n="nav.hello">Hello there!</div>
                                                </div>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="#"
                                                className="py-2 px-4 flex items-center dark:hover:bg-white/40 hover:bg-primary/20  group">
                                                <img src="/images/user/user-7.jpg" alt=""
                                                    className="w-8 h-8 rounded block object-cover align-middle" />
                                                <div className="ml-2 rtl:mr-2 rtl:ml-0">
                                                    <div
                                                        className="text-[13px] text-black  dark:text-white/80 font-medium truncate group-hover:text-primary dark:group-hover:text-primary">
                                                        John Doe</div>
                                                    <div className="text-[11px] text-black  dark:text-white/80 group-hover:text-primary"
                                                        data-i18n="nav.hello">Hello there!</div>
                                                </div>
                                            </Link>
                                        </li>
                                    </ul>
                                </SimpleBar>
                            </div>
                        </div>
                    </li>
                    <li className="dropdown ml-3 rtl:mr-3 rtl:ml-0" ref={profileDropdownRef}>
                        <button type="button" className="dropdown-toggle flex items-center gap-2" onClick={() => handleOpenDropdown(4)}>
                            <img src="/images/user/user-7.jpg" alt=""
                                className="w-8 h-8 rounded-full block object-cover align-middle" />
                            <div className="md:block hidden dropdown-profile">
                                <p className="font-semibold mb-0 leading-none text-black dark:text-white/80 text-[0.813rem]">
                                    David Hyson</p>
                                <span
                                    className="opacity-[0.7] font-normal text-black-600 dark:text-white/60 block text-[0.6875rem]">Web
                                    Developer</span>
                            </div>
                        </button>
                        <div
                            className={`dropdown-menu shadow-xl shadow-black/5 z-30 rounded-lg bg-white dark:bg-black border border-black/10 dark:border-white/10 w-full max-w-[200px] p-2 absolute right-0 top-full mt-2 ${openDropdownIndex === 4 ? "block" : "hidden"}`}
                        >
                            <div className="p-2 border-b border-black/5 dark:border-white/5 mb-1">
                                <p className="font-semibold text-sm text-black dark:text-white mb-0.5">David Hyson</p>
                                <p className="text-xs text-black/50 dark:text-white/50 truncate">david.hyson@example.com</p>
                            </div>
                            <ul className="py-1">
                                <li>
                                    <Link to="/profile"
                                        className="flex items-center text-[13px] py-2 px-2 rounded hover:bg-primary/5 hover:text-primary dark:hover:text-primary transition-colors text-black dark:text-white/70">
                                        <i className="ri-user-line text-base mr-2"></i>
                                        <span data-i18n="nav.profile">Profile</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/settings"
                                        className="flex items-center text-[13px] py-2 px-2 rounded hover:bg-primary/5 hover:text-primary dark:hover:text-primary transition-colors text-black dark:text-white/70">
                                        <i className="ri-settings-4-line text-base mr-2"></i>
                                        <span data-i18n="nav.settings">Settings</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#"
                                        className="flex items-center text-[13px] py-2 px-2 rounded hover:bg-primary/5 hover:text-primary dark:hover:text-primary transition-colors text-black dark:text-white/70">
                                        <i className="ri-price-tag-3-line text-base mr-2"></i>
                                        <span data-i18n="nav.billing">Billing</span>
                                    </Link>
                                </li>
                            </ul>
                            <div className="border-t border-black/5 dark:border-white/5 pt-1 mt-1">
                                <Link to="/signin"
                                    className="flex items-center text-[13px] py-2 px-2 rounded hover:bg-danger/10 hover:text-danger text-black dark:text-white/70">
                                    <i className="ri-logout-box-r-line text-base mr-2"></i>
                                    <span data-i18n="nav.logout">Logout</span>
                                </Link>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>

            <div
                className="horizontal-menu hidden border-b border-black/10 dark:border-white/10 bg-white dark:bg-black relative z-20">
                <div className="container-fluid px-6">
                    <nav>
                        <ul className="flex flex-wrap items-center justify-center">
                            {/* <!-- Dashboard --> */}
                            <li className="group relative">
                                <Link to="#"
                                    className="flex items-center py-3 px-4 text-sm font-medium text-black dark:text-white/70 hover:text-primary dark:hover:text-primary transition-colors gap-1">
                                    <i className="ri-home-2-line text-lg"></i>
                                    <span>Dashboard</span>
                                    <i className="ri-arrow-down-s-line ml-1 transition-transform group-hover:rotate-180"></i>
                                </Link>
                                <div
                                    className="absolute top-full left-0 w-56 bg-white dark:bg-gray shadow-lg rounded-b-lg border border-black/10 dark:border-white/10 hidden group-hover:block z-50">
                                    <ul className="py-2">
                                        <li><Link to="/ "
                                            className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Main</Link>
                                        </li>
                                        <li><Link to="/academy-dashboard"
                                            className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Academy</Link>
                                        </li>
                                        <li><Link to="/banking-dashboard"
                                            className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Banking</Link>
                                        </li>
                                        <li><Link to="/booking-dashboard"
                                            className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Booking</Link>
                                        </li>
                                        <li><Link to="/crm-dashboard"
                                            className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">CRM</Link>
                                        </li>
                                        <li><Link to="/erp-dashboard"
                                            className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Erp</Link>
                                        </li>
                                        <li><Link to="/event-dashboard"
                                            className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Event</Link>
                                        </li>
                                        <li><Link to="/finance-dashboard"
                                            className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Finance</Link>
                                        </li>
                                        <li><Link to="/helpdesk-dashboard"
                                            className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Helpdesk</Link>
                                        </li>
                                        <li><Link to="/hospital-dashboard"
                                            className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Hospital</Link>
                                        </li>
                                        <li><Link to="/hrms-dashboard"
                                            className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Hrms</Link>
                                        </li>
                                        <li><Link to="/library-dashboard"
                                            className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Library</Link>
                                        </li>
                                        <li><Link to="/lms-dashboard"
                                            className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Lms</Link>
                                        </li>
                                        <li><Link to="/logistics-dashboard"
                                            className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Logistics</Link>
                                        </li>
                                        <li><Link to="/podcast-dashboard"
                                            className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Podcast</Link>
                                        </li>
                                        <li><Link to="/realestate-dashboard"
                                            className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Real
                                            Estate</Link></li>
                                    </ul>
                                </div>
                            </li>

                            {/* <!-- Apps --> */}
                            <li className="group relative">
                                <Link to="#"
                                    className="flex items-center py-3 px-4 text-sm font-medium text-black dark:text-white/70 hover:text-primary dark:hover:text-primary transition-colors gap-1">
                                    <i className="ri-apps-2-line text-lg"></i>
                                    <span>Apps</span>
                                    <i className="ri-arrow-down-s-line ml-1 transition-transform group-hover:rotate-180"></i>
                                </Link>
                                <div
                                    className="absolute top-full left-0 w-56 bg-white dark:bg-gray shadow-lg rounded-b-lg border border-black/10 dark:border-white/10 hidden group-hover:block z-50">
                                    <ul className="py-2">
                                        <li><Link to="/chat"
                                            className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Chat</Link>
                                        </li>
                                        <li><Link to="/calendar"
                                            className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Calendar</Link>
                                        </li>
                                        <li><Link to="/todo-list"
                                            className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Todo
                                            List</Link>
                                        </li>
                                        <li><Link to="/email"
                                            className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Email</Link>
                                        </li>
                                        <li><Link to="/email-read"
                                            className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Email
                                            Read</Link>
                                        </li>
                                        <li className="relative group/sub">
                                            <Link to="#"
                                                className="flex items-center justify-between py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">
                                                Ecommerce <i className="ri-arrow-right-s-line"></i>
                                            </Link>
                                            <div
                                                className="absolute top-0 left-full w-48 bg-white dark:bg-gray shadow-lg rounded-lg border border-black/10 dark:border-white/10 hidden group-hover/sub:block">
                                                <ul className="py-2">
                                                    <li><Link to="/product-grid"
                                                        className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Product
                                                        Grid</Link>
                                                    </li>
                                                    <li><Link to="/product-list"
                                                        className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Product
                                                        List</Link>
                                                    </li>
                                                    <li><Link to="/product-details"
                                                        className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Products
                                                        Details</Link>
                                                    </li>
                                                    <li><Link to="/product-create"
                                                        className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Create
                                                        Product</Link>
                                                    </li>
                                                    <li><Link to="/cart"
                                                        className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Cart</Link>
                                                    </li>
                                                    <li><Link to="/checkout"
                                                        className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Checkout</Link>
                                                    </li>
                                                    <li><Link to="/wishlist"
                                                        className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Wishlist</Link>
                                                    </li>
                                                    <li><Link to="/order"
                                                        className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Orders</Link>
                                                    </li>
                                                    <li><Link to="/order-details"
                                                        className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Order
                                                        Details</Link>
                                                    </li>
                                                    <li><Link to="/track-order"
                                                        className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Track
                                                        Orders</Link>
                                                    </li>
                                                    <li><Link to="/returns-refunds"
                                                        className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Return
                                                        & Refunds</Link>
                                                    </li>
                                                    <li><Link to="/coupons"
                                                        className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Coupons</Link>
                                                    </li>
                                                    <li><Link to="/customer-reviews"
                                                        className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Customer
                                                        Reviews</Link>
                                                    </li>
                                                    <li><Link to="/discount-campaings"
                                                        className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Discount
                                                        Campaings</Link>
                                                    </li>
                                                    <li><Link to="/email-marketing"
                                                        className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Email
                                                        Marketing</Link>
                                                    </li>
                                                    <li><Link to="/stock-alerts"
                                                        className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Stock
                                                        Alerts</Link>
                                                    </li>
                                                    <li><Link to="/courier-intergration"
                                                        className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Courier
                                                        Integration</Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        </li>
                                        <li className="relative group/sub">
                                            <Link to="#"
                                                className="flex items-center justify-between py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">
                                                Banking <i className="ri-arrow-right-s-line"></i>
                                            </Link>
                                            <div
                                                className="absolute top-0 left-full w-48 bg-white dark:bg-gray shadow-lg rounded-lg border border-black/10 dark:border-white/10 hidden group-hover/sub:block">
                                                <ul className="py-2">
                                                    <li><Link to="/bank-accounts" className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Bank Accounts</Link></li>
                                                    <li><Link to="/transfers" className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Transfers</Link></li>
                                                    <li><Link to="/deposits" className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Deposits</Link></li>
                                                    <li><Link to="/withdrawals" className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Withdrawals</Link></li>
                                                    <li><Link to="/loans" className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Loans</Link></li>
                                                    <li><Link to="/bank-cards" className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Cards</Link></li>
                                                    <li><Link to="/bank-statements" className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Statements</Link></li>
                                                    <li><Link to="/wire-transfers" className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Wire Transfers</Link></li>
                                                    <li><Link to="/banking-settings" className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Settings</Link></li>
                                                </ul>
                                            </div>
                                        </li>
                                        <li className="relative group/sub">
                                            <Link to="#"
                                                className="flex items-center justify-between py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">
                                                CRM <i className="ri-arrow-right-s-line"></i>
                                            </Link>
                                            <div
                                                className="absolute top-0 left-full w-48 bg-white dark:bg-gray shadow-lg rounded-lg border border-black/10 dark:border-white/10 hidden group-hover/sub:block">
                                                <ul className="py-2">
                                                    <li><Link to="/contacts" className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Contacts</Link></li>
                                                    <li><Link to="/leads" className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Leads</Link></li>
                                                    <li><Link to="/opportunities" className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Opportunities</Link></li>
                                                    <li><Link to="/deals" className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Deals</Link></li>
                                                    <li><Link to="/customers" className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Customers</Link></li>
                                                    <li><Link to="/activities" className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Activities</Link></li>
                                                    <li><Link to="/crm-reports" className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Reports</Link></li>
                                                    <li><Link to="/pipeline" className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Pipeline</Link></li>
                                                    <li><Link to="/crm-settings" className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Settings</Link></li>
                                                </ul>
                                            </div>
                                        </li>
                                        <li className="relative group/sub">
                                            <Link to="#"
                                                className="flex items-center justify-between py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">
                                                HRMS <i className="ri-arrow-right-s-line"></i>
                                            </Link>
                                            <div
                                                className="absolute top-0 left-full w-48 bg-white dark:bg-gray shadow-lg rounded-lg border border-black/10 dark:border-white/10 hidden group-hover/sub:block">
                                                <ul className="py-2">
                                                    <li><Link to="/employees" className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Employees</Link></li>
                                                    <li><Link to="/attendance" className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Attendance</Link></li>
                                                    <li><Link to="/leave-management" className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Leave Management</Link></li>
                                                    <li><Link to="/hrms-payroll" className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Payroll</Link></li>
                                                    <li><Link to="/recruitment" className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Recruitment</Link></li>
                                                    <li><Link to="/performance" className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Performance</Link></li>
                                                    <li><Link to="/training" className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Training</Link></li>
                                                    <li><Link to="/departments" className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Departments</Link></li>
                                                    <li><Link to="/hrms-settings" className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Settings</Link></li>
                                                </ul>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </li>

                            {/* <!-- UI Elements --> */}
                            <li className="group relative">
                                <Link to="#"
                                    className="flex items-center py-3 px-4 text-sm font-medium text-black dark:text-white/70 hover:text-primary dark:hover:text-primary transition-colors gap-1">
                                    <i className="ri-pantone-line text-lg"></i>
                                    <span>UI Elements</span>
                                    <i className="ri-arrow-down-s-line ml-1 transition-transform group-hover:rotate-180"></i>
                                </Link>
                                <div
                                    className="absolute top-full left-0 w-56 bg-white dark:bg-gray shadow-lg rounded-b-lg border border-black/10 dark:border-white/10 hidden group-hover:block z-50">
                                    <ul className="py-2">
                                        <li><Link to="/alert"
                                            className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Alerts</Link>
                                        </li>
                                        <li><Link to="/buttons"
                                            className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Buttons</Link>
                                        </li>
                                        <li><Link to="/cards"
                                            className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Cards</Link>
                                        </li>
                                        <li className="relative group/sub">
                                            <Link to="#"
                                                className="flex items-center justify-between py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">
                                                Forms <i className="ri-arrow-right-s-line"></i>
                                            </Link>
                                            <div
                                                className="absolute top-0 left-full w-48 bg-white dark:bg-gray shadow-lg rounded-lg border border-black/10 dark:border-white/10 hidden group-hover/sub:block">
                                                <ul className="py-2">
                                                    <li><Link to="/basic-form"
                                                        className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Basic
                                                        Elements</Link></li>
                                                    <li><Link to="/validation"
                                                        className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Validation</Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        </li>
                                        <li className="relative group/sub">
                                            <Link to="#"
                                                className="flex items-center justify-between py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">
                                                Tables <i className="ri-arrow-right-s-line"></i>
                                            </Link>
                                            <div
                                                className="absolute top-0 left-full w-48 bg-white dark:bg-gray shadow-lg rounded-lg border border-black/10 dark:border-white/10 hidden group-hover/sub:block">
                                                <ul className="py-2">
                                                    <li><Link to="/basic-table"
                                                        className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Basic
                                                        Tables</Link></li>
                                                    <li><Link to="/data-table"
                                                        className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Data
                                                        Tables</Link></li>
                                                </ul>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </li>

                            {/* <!-- Pages --> */}
                            <li className="group relative">
                                <Link to="#"
                                    className="flex items-center py-3 px-4 text-sm font-medium text-black dark:text-white/70 hover:text-primary dark:hover:text-primary transition-colors gap-1">
                                    <i className="ri-pages-line text-lg"></i>
                                    <span>Pages</span>
                                    <i className="ri-arrow-down-s-line ml-1 transition-transform group-hover:rotate-180"></i>
                                </Link>
                                <div
                                    className="absolute top-full left-0 w-56 bg-white dark:bg-gray shadow-lg rounded-b-lg border border-black/10 dark:border-white/10 hidden group-hover:block z-50">
                                    <ul className="py-2">
                                        <li><Link to="/profile"
                                            className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Profile</Link>
                                        </li>
                                        <li className="relative group/sub">
                                            <Link to="#"
                                                className="flex items-center justify-between py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">
                                                Authentication <i className="ri-arrow-right-s-line"></i>
                                            </Link>
                                            <div
                                                className="absolute top-0 left-full w-48 bg-white dark:bg-gray shadow-lg rounded-lg border border-black/10 dark:border-white/10 hidden group-hover/sub:block">
                                                <ul className="py-2">
                                                    <li><Link to="/signin"
                                                        className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Sign
                                                        In</Link></li>
                                                    <li><Link to="/signup"
                                                        className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Sign
                                                        Up</Link></li>
                                                </ul>
                                            </div>
                                        </li>
                                        <li><Link to="/404"
                                            className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">404
                                            Error</Link></li>
                                    </ul>
                                </div>
                            </li>

                            {/* <!-- Maps (Newly added links) --> */}
                            <li className="group relative">
                                <Link to="#"
                                    className="flex items-center py-3 px-4 text-sm font-medium text-black dark:text-white/70 hover:text-primary dark:hover:text-primary transition-colors gap-1">
                                    <i className="ri-map-pin-line text-lg"></i>
                                    <span>Maps</span>
                                    <i className="ri-arrow-down-s-line ml-1 transition-transform group-hover:rotate-180"></i>
                                </Link>
                                <div
                                    className="absolute top-full left-0 w-56 bg-white dark:bg-gray shadow-lg rounded-b-lg border border-black/10 dark:border-white/10 hidden group-hover:block z-50">
                                    <ul className="py-2">
                                        <li><Link to="/google-maps"
                                            className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Google
                                            Maps</Link></li>
                                        <li><Link to="/vector-maps"
                                            className="block py-2 px-4 text-sm text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary">Vector
                                            Maps</Link></li>
                                    </ul>
                                </div>
                            </li>

                        </ul>
                    </nav>
                </div>
            </div>
        </>

    )
}

export default Header
