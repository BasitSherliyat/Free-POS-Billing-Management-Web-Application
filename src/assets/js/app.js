// Apply saved direction immediately (before DOMContentLoaded) so isRTL() is correct during sidebar init
(function () {
    var savedDir = localStorage.getItem('turbine-dir') || 'ltr';
    document.documentElement.setAttribute('dir', savedDir);
})();

// start: Sidebar
document.addEventListener('DOMContentLoaded', function () {
    const sidebarToggle = document.querySelector('.sidebar-toggle')
    // The backdrop overlay is the LAST .sidebar-overlay element (not the inner image overlay)
    const sidebarOverlayEls = document.querySelectorAll('.sidebar-overlay')
    const sidebarOverlay = sidebarOverlayEls[sidebarOverlayEls.length - 1]
    const sidebarMenu = document.querySelector('.sidebar-menu')
    const main = document.querySelector('.page-wrapper') || document.querySelector('.main')

    function isMobile() {
        return window.innerWidth < 768;
    }

    function isRTL() {
        return document.documentElement.dir === 'rtl';
    }

    function isSidebarOpen() {
        // Sidebar is open when it has neither hide class
        return !sidebarMenu.classList.contains('-translate-x-full') &&
            !sidebarMenu.classList.contains('translate-x-full');
    }

    function openSidebar() {
        // Remove both possible hidden-state classes (handles LTR and RTL)
        sidebarMenu.classList.remove('-translate-x-full', 'translate-x-full');
        if (isMobile() && sidebarOverlay) sidebarOverlay.classList.remove('hidden');
        if (main) {
            main.classList.remove('active');
            if (!isMobile()) {
                // Restore desktop layout: undo the full-width override
                main.style.width = '';
                main.style.marginLeft = '';
                main.style.marginRight = '';
            }
        }
    }

    function closeSidebar() {
        // Clear both then apply the correct hide direction
        sidebarMenu.classList.remove('-translate-x-full', 'translate-x-full');
        if (isRTL()) {
            sidebarMenu.classList.add('translate-x-full');
        } else {
            sidebarMenu.classList.add('-translate-x-full');
        }
        if (sidebarOverlay) sidebarOverlay.classList.add('hidden');
        if (main) {
            main.classList.add('active');
            if (!isMobile()) {
                // Force full width on desktop via inline style (overrides Tailwind responsive classes)
                main.style.width = '100%';
                main.style.marginLeft = '0';
                main.style.marginRight = '0';
            }
        }
    }

    if (sidebarToggle && sidebarMenu) {
        sidebarToggle.addEventListener('click', function (e) {
            e.preventDefault()
            if (isSidebarOpen()) {
                closeSidebar();
            } else {
                openSidebar();
            }
        })

        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', function (e) {
                e.preventDefault()
                closeSidebar();
            })
        }
    }

    // Handle resize: on desktop always show sidebar; on mobile always hide sidebar
    window.addEventListener('resize', function () {
        const layout = document.documentElement.getAttribute('data-layout') || 'vertical';
        // Skip sidebar state management for mini/horizontal layouts (handled by CSS)
        if (layout === 'mini' || layout === 'horizontal') return;

        if (isMobile()) {
            // Switched to mobile: always force sidebar hidden, hide overlay, clear inline styles
            if (sidebarMenu) {
                sidebarMenu.classList.remove('-translate-x-full', 'translate-x-full');
                if (isRTL()) {
                    sidebarMenu.classList.add('translate-x-full');
                } else {
                    sidebarMenu.classList.add('-translate-x-full');
                }
            }
            if (sidebarOverlay) sidebarOverlay.classList.add('hidden');
            if (main) {
                main.classList.remove('active');
                main.style.width = '';
                main.style.marginLeft = '';
                main.style.marginRight = '';
            }
        } else {
            // Switched to desktop: always show sidebar, hide overlay, restore layout
            if (sidebarMenu) {
                // Remove both possible hidden classes to show sidebar
                sidebarMenu.classList.remove('-translate-x-full', 'translate-x-full');
            }
            if (sidebarOverlay) sidebarOverlay.classList.add('hidden');
            if (main) {
                main.classList.remove('active');
                main.style.width = '';
                main.style.marginLeft = '';
                main.style.marginRight = '';
            }
        }
    });

    // Initialize sidebar state on page load based on screen size
    if (sidebarMenu) {
        const layout = document.documentElement.getAttribute('data-layout') || 'vertical';
        if (layout !== 'mini' && layout !== 'horizontal') {
            if (!isMobile()) {
                // Desktop: show sidebar — remove both possible hidden-state classes
                sidebarMenu.classList.remove('-translate-x-full', 'translate-x-full');
                if (sidebarOverlay) sidebarOverlay.classList.add('hidden');
                if (main) main.classList.remove('active');
            } else {
                // Mobile RTL: ensure correct hide class is applied
                if (isRTL()) {
                    sidebarMenu.classList.remove('-translate-x-full');
                    sidebarMenu.classList.add('translate-x-full');
                }
                // Mobile LTR: -translate-x-full is already in HTML, no change needed
            }
        }
    }

    document.querySelectorAll('.sidebar-dropdown-toggle').forEach(function (item) {
        item.addEventListener('click', function (e) {
            e.preventDefault()
            const parent = item.closest('.group')
            const menu = parent.querySelector('ul')

            if (parent.classList.contains('selected')) {
                // Close
                menu.style.maxHeight = menu.scrollHeight + 'px'
                setTimeout(() => {
                    menu.style.maxHeight = '0px'
                    parent.classList.remove('selected')
                }, 10)
                setTimeout(() => {
                    menu.classList.add('hidden')
                }, 310)
            } else {
                // Close only SIBLING dropdowns at the same level (not parent or nested ones)
                const parentUl = parent.parentElement
                parentUl.querySelectorAll(':scope > .group.selected').forEach(function (openGroup) {
                    if (openGroup !== parent) {
                        const openMenu = openGroup.querySelector('ul')
                        if (openMenu) {
                            openMenu.style.maxHeight = '0px'
                            openGroup.classList.remove('selected')
                            setTimeout(() => {
                                openMenu.classList.add('hidden')
                            }, 310)
                        }
                    }
                })

                // Open this one
                parent.classList.add('selected')
                menu.classList.remove('hidden')
                menu.style.maxHeight = '0px'
                setTimeout(() => {
                    menu.style.maxHeight = menu.scrollHeight + 'px'
                }, 10)

                // Remove fixed maxHeight after transition to allow for dynamic content
                setTimeout(() => {
                    if (parent.classList.contains('selected')) {
                        menu.style.maxHeight = 'none'
                    }
                }, 310) // Matches CSS transition duration
            }
        })
    })

    // Auto-open sidebar dropdown for active page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    if (sidebarMenu) {
        const allLinks = sidebarMenu.querySelectorAll('a[href]');

        allLinks.forEach(function (link) {
            const linkHref = link.getAttribute('href');

            // Check if this link matches the current page
            if (linkHref && linkHref === currentPage) {

                // Style the active link - add primary color
                link.classList.add('text-primary', 'font-semibold', '!dark:text-primary');

                // Add active class to parent li
                const parentLi = link.closest('li');
                if (parentLi) {
                    parentLi.classList.add('active');
                }

                // Find all parent groups (handles nested dropdowns)
                let currentElement = link;
                const parentGroups = [];

                // Traverse up to find all parent .group elements
                while (currentElement) {
                    currentElement = currentElement.parentElement;
                    if (currentElement && currentElement.classList && currentElement.classList.contains('group')) {
                        parentGroups.push(currentElement);
                    }
                    // Stop at sidebar-menu
                    if (currentElement && currentElement.classList && currentElement.classList.contains('sidebar-menu')) {
                        break;
                    }
                }


                // Open all parent groups (from innermost to outermost)
                parentGroups.forEach(function (parentGroup) {
                    parentGroup.classList.add('selected');
                    const menu = parentGroup.querySelector(':scope > ul');
                    if (menu) {
                        menu.classList.remove('hidden');
                        menu.style.maxHeight = 'none'; // Open immediately on load
                    }
                });

                // Scroll active link into view inside the simplebar container
                // Use a short delay so the dropdowns have fully expanded before measuring
                setTimeout(function () {
                    // Simplebar creates a .simplebar-content-wrapper that is the actual scrollable element
                    const simplebarWrapper = sidebarMenu.querySelector('.simplebar-content-wrapper');
                    if (simplebarWrapper) {
                        const linkRect = link.getBoundingClientRect();
                        const wrapperRect = simplebarWrapper.getBoundingClientRect();
                        // Calculate the offset of the active link relative to the scrollable container
                        const linkOffsetTop = link.offsetTop;
                        // Position active link at ~25% from the top of the visible sidebar area
                        const targetScroll = linkOffsetTop - (simplebarWrapper.clientHeight * 0.25);
                        simplebarWrapper.scrollTo({
                            top: Math.max(0, targetScroll),
                            behavior: 'smooth'
                        });
                    } else {
                        // Fallback: native scrollIntoView with block nearest
                        link.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 50);
            }
        });
    }
});
// end: Sidebar

// dark mode
// dark mode
document.addEventListener('DOMContentLoaded', function () {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function () {
            const htmlTag = document.documentElement;
            if (htmlTag.classList.contains('dark')) {
                htmlTag.classList.remove('dark');
                htmlTag.classList.add('light');
                localStorage.setItem('turbine-theme', 'light');
            } else {
                htmlTag.classList.remove('light');
                htmlTag.classList.add('dark');
                localStorage.setItem('turbine-theme', 'dark');
            }
        });
    }
});

// fullscreenButton 
document.addEventListener("DOMContentLoaded", function () {
    const fullscreenButton = document.querySelector('[data-toggle="fullscreen"]');

    if (fullscreenButton) {
        fullscreenButton.addEventListener("click", function () {
            toggleFullScreen();
        });
    }

    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error("Error attempting to enable full-screen mode: ${err.message}");
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }
});



// start: Popper
const popperInstance = {}
document.querySelectorAll('.dropdown').forEach(function (item, index) {
    const popperId = 'popper-' + index
    const toggle = item.querySelector('.dropdown-toggle')
    const menu = item.querySelector('.dropdown-menu')
    menu.dataset.popperId = popperId
    popperInstance[popperId] = Popper.createPopper(toggle, menu, {
        modifiers: [
            {
                name: 'offset',
                options: {
                    offset: [0, 8],
                },
            },
            {
                name: 'preventOverflow',
                options: {
                    padding: 24,
                },
            },
        ],
        placement: 'bottom-end'
    });
})

document.addEventListener('click', function (e) {
    const toggle = e.target.closest('.dropdown-toggle')
    const menu = e.target.closest('.dropdown-menu')
    if (toggle) {
        const menuEl = toggle.closest('.dropdown').querySelector('.dropdown-menu')
        const popperId = menuEl.dataset.popperId
        if (menuEl.classList.contains('hidden')) {
            hideDropdown()
            menuEl.classList.remove('hidden')
            showPopper(popperId)
        } else {
            menuEl.classList.add('hidden')
            hidePopper(popperId)
        }
    } else if (!menu) {
        hideDropdown()
    }
})

function hideDropdown() {
    document.querySelectorAll('.dropdown-menu').forEach(function (item) {
        item.classList.add('hidden')
    })
}
function showPopper(popperId) {
    popperInstance[popperId].setOptions(function (options) {
        return {
            ...options,
            modifiers: [
                ...options.modifiers,
                { name: 'eventListeners', enabled: true },
            ],
        }
    });
    popperInstance[popperId].update();
}
function hidePopper(popperId) {
    popperInstance[popperId].setOptions(function (options) {
        return {
            ...options,
            modifiers: [
                ...options.modifiers,
                { name: 'eventListeners', enabled: false },
            ],
        }
    });
}
// end: Popper
// Initialize Preline overlays with backdrop
document.addEventListener('DOMContentLoaded', function () {
    // Reinitialize Preline after DOM is ready
    if (window.HSOverlay) {
        window.HSOverlay.autoInit();
    }
});

// start: Tab
document.querySelectorAll('[data-tab]').forEach(function (item) {
    item.addEventListener('click', function (e) {
        e.preventDefault()
        const tab = item.dataset.tab
        const page = item.dataset.tabPage
        const target = document.querySelector('[data-tab-for="' + tab + '"][data-page="' + page + '"]')
        document.querySelectorAll('[data-tab="' + tab + '"]').forEach(function (i) {
            i.classList.remove('active')
        })
        document.querySelectorAll('[data-tab-for="' + tab + '"]').forEach(function (i) {
            i.classList.add('hidden')
        })
        item.classList.add('active')
        target.classList.remove('hidden')
    })
})
// end: Tab


// start: Settings Offcanvas
document.addEventListener('DOMContentLoaded', function () {
    const settingsToggle = document.getElementById('settings-toggle');
    const settingsClose = document.getElementById('settings-close');
    const settingsOffcanvas = document.getElementById('settings-offcanvas');
    const settingsOverlay = document.getElementById('settings-overlay');

    if (settingsToggle) {
        settingsToggle.addEventListener('click', function () {
            if (settingsOffcanvas && settingsOverlay) {
                settingsOffcanvas.classList.remove('translate-x-full');
                settingsOverlay.classList.remove('hidden');
                setTimeout(() => settingsOverlay.classList.remove('opacity-0'), 10);
            }
        });
    }

    if (settingsClose && settingsOffcanvas && settingsOverlay) {
        function closeSettings() {
            settingsOffcanvas.classList.add('translate-x-full');
            settingsOverlay.classList.add('opacity-0');
            setTimeout(() => settingsOverlay.classList.add('hidden'), 300);
        }

        settingsClose.addEventListener('click', closeSettings);
        settingsOverlay.addEventListener('click', closeSettings);
    }


    // Theme Settings Logic
    const html = document.documentElement;

    // 1. Theme Mode
    const themeBtns = document.querySelectorAll('.theme-mode-btn');

    function setTheme(theme) {
        if (theme === 'dark') {
            html.classList.add('dark');
            html.classList.remove('light');
        } else if (theme === 'light') {
            html.classList.remove('dark');
            html.classList.add('light');
        } else { // system
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                html.classList.add('dark');
                html.classList.remove('light');
            } else {
                html.classList.remove('dark');
                html.classList.add('light');
            }
        }

        // Update buttons
        themeBtns.forEach(btn => {
            if (btn.dataset.theme === theme) {
                btn.classList.add('active-theme');
            } else {
                btn.classList.remove('active-theme');
            }
        });

        localStorage.setItem('turbine-theme', theme);
    }

    // Initialize theme
    const savedTheme = localStorage.getItem('turbine-theme') || 'system';
    setTheme(savedTheme);

    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => setTheme(btn.dataset.theme));
    });

    // 2. Direction
    const dirBtns = document.querySelectorAll('.theme-dir-btn');

    function setDir(dir) {
        html.setAttribute('dir', dir);

        // Update buttons
        dirBtns.forEach(btn => {
            if (btn.dataset.dir === dir) {
                btn.classList.add('active-dir');
            } else {
                btn.classList.remove('active-dir');
            }
        });

        localStorage.setItem('turbine-dir', dir);

        // Re-sync sidebar transform classes after direction change
        const sidebarMenuEl = document.querySelector('.sidebar-menu');
        const mainEl = document.querySelector('.page-wrapper') || document.querySelector('.main');
        if (sidebarMenuEl) {
            const layout = document.documentElement.getAttribute('data-layout') || 'vertical';
            if (layout !== 'mini' && layout !== 'horizontal') {
                const mobile = window.innerWidth < 768;
                // Remove both possible hidden-state classes first
                sidebarMenuEl.classList.remove('-translate-x-full', 'translate-x-full');
                if (mobile) {
                    // On mobile, sidebar should be hidden
                    if (dir === 'rtl') {
                        sidebarMenuEl.classList.add('translate-x-full');
                    } else {
                        sidebarMenuEl.classList.add('-translate-x-full');
                    }
                    if (mainEl) {
                        mainEl.classList.remove('active');
                        mainEl.style.width = '';
                        mainEl.style.marginLeft = '';
                        mainEl.style.marginRight = '';
                    }
                } else {
                    // On desktop, sidebar should be visible (no translate class)
                    if (mainEl) {
                        mainEl.classList.remove('active');
                        mainEl.style.width = '';
                        mainEl.style.marginLeft = '';
                        mainEl.style.marginRight = '';
                    }
                }
            }
        }
    }

    // Initialize direction
    const savedDir = localStorage.getItem('turbine-dir') || 'ltr';
    setDir(savedDir);

    dirBtns.forEach(btn => {
        btn.addEventListener('click', () => setDir(btn.dataset.dir));
    });



    // Layout Logic
    const layoutBtns = document.querySelectorAll('.theme-layout-btn');

    function setLayout(layout) {
        html.setAttribute('data-layout', layout);
        localStorage.setItem('turbine-layout', layout);

        // Update active state
        layoutBtns.forEach(btn => {
            if (btn.dataset.layout === layout) {
                btn.classList.add('active-layout');
            } else {
                btn.classList.remove('active-layout');
            }
        });
    }

    // Init Layout
    const savedLayout = localStorage.getItem('turbine-layout') || 'vertical';
    setLayout(savedLayout);

    layoutBtns.forEach(btn => {
        btn.addEventListener('click', () => setLayout(btn.dataset.layout));
    });



    // Primary Color Logic
    const colorBtns = document.querySelectorAll('.theme-color-btn');

    function setPrimaryColor(color) {
        document.documentElement.style.setProperty('--color-primary-rgb', color);
        localStorage.setItem('turbine-primary-color', color);

        // Update active state
        colorBtns.forEach(btn => {
            if (btn.dataset.color === color) {
                btn.classList.add('ring-2', 'ring-offset-2', 'ring-primary');
            } else {
                btn.classList.remove('ring-2', 'ring-offset-2', 'ring-primary');
            }
        });

        // Dispatch a custom event so charts can react to color changes
        document.dispatchEvent(new CustomEvent('primaryColorChanged', {
            detail: { color: color }
        }));
    }

    // Init Primary Color
    const savedColor = localStorage.getItem('turbine-primary-color') || '132 90 223';
    setPrimaryColor(savedColor);

    // Event Listeners for Color Buttons
    colorBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const color = this.dataset.color;
            setPrimaryColor(color);
        });
    });

    // Card Rounded Logic
    const radiusBtns = document.querySelectorAll('.theme-radius-btn');

    function setRadius(radius) {
        document.documentElement.style.setProperty('--border-radius', radius);
        localStorage.setItem('turbine-card-radius', radius);

        // Update active state
        radiusBtns.forEach(btn => {
            if (btn.dataset.radius === radius) {
                btn.classList.add('active-radius');
            } else {
                btn.classList.remove('active-radius');
            }
        });
    }

    // Init Card Rounded
    const savedRadius = localStorage.getItem('turbine-card-radius') || '0.375rem';
    setRadius(savedRadius);

    // Event Listeners for Radius Buttons
    radiusBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const radius = this.dataset.radius;
            setRadius(radius);
        });
    });

    // Navbar Type Logic
    const navBtns = document.querySelectorAll('.theme-nav-btn');
    const navbar = document.getElementById('navbar');
    const horizontalMenu = document.querySelector('.horizontal-menu');

    function setNavbarType(type) {
        if (!navbar) return;

        // Reset classes
        navbar.classList.remove('sticky', 'top-0', 'hidden');
        if (horizontalMenu) {
            horizontalMenu.classList.remove('sticky', 'top-[72px]', 'z-20');
        }

        // Apply new type
        if (type === 'sticky') {
            navbar.classList.add('sticky', 'top-0');
            if (horizontalMenu) {
                horizontalMenu.classList.add('sticky', 'top-[72px]', 'z-20');
            }
        } else if (type === 'hidden') {
            navbar.classList.add('hidden');
        }
        // static is default (no classes needed)

        localStorage.setItem('turbine-nav-type', type);

        // Update active state
        navBtns.forEach(btn => {
            if (btn.dataset.navType === type) {
                btn.classList.add('active-nav');
            } else {
                btn.classList.remove('active-nav');
            }
        });
    }

    // Init Navbar Type
    const savedNavType = localStorage.getItem('turbine-nav-type') || 'sticky';
    setNavbarType(savedNavType);

    // Event Listeners for Navbar Buttons
    navBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const type = this.dataset.navType;
            setNavbarType(type);
        });
    });

    // Horizontal Menu Active State
    if (horizontalMenu) {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const hzLinks = horizontalMenu.querySelectorAll('a[href]');

        hzLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath) {
                // Active link style
                link.classList.add('text-primary', 'font-semibold');

                // Find parent group and style it
                const parentGroup = link.closest('.group');
                if (parentGroup) {
                    const toggle = parentGroup.querySelector('a'); // The main trigger
                    if (toggle) {
                        toggle.classList.add('text-primary', 'font-semibold');
                    }
                }

                // Handle nested groups (if any)
                const nestedGroup = link.closest('.group\\/sub');
                if (nestedGroup) {
                    const nestedToggle = nestedGroup.querySelector('a');
                    if (nestedToggle) {
                        nestedToggle.classList.add('text-primary', 'font-semibold');
                    }
                    // Also highlight the main parent
                    const mainGroup = nestedGroup.closest('.group');
                    if (mainGroup) {
                        const mainToggle = mainGroup.querySelector('a'); // The main trigger
                        if (mainToggle) {
                            mainToggle.classList.add('text-primary', 'font-semibold');
                        }
                    }
                }
            }
        });
    }

    // Footer Type Logic
    const footerBtns = document.querySelectorAll('.theme-footer-btn');
    const footer = document.querySelector('footer');

    function setFooterType(type) {
        if (!footer) return;

        // Reset classes
        footer.classList.remove('sticky', 'bottom-0', 'hidden');

        // Apply new type
        if (type === 'sticky') {
            footer.classList.add('sticky', 'bottom-0', 'z-20'); // Added z-index to ensure visibility
        } else if (type === 'hidden') {
            footer.classList.add('hidden');
        }
        // static is default (no classes needed)

        localStorage.setItem('turbine-footer-type', type);

        // Update active state
        footerBtns.forEach(btn => {
            if (btn.dataset.footerType === type) {
                btn.classList.add('active-nav'); // Reuse active-nav class for styling consistency
            } else {
                btn.classList.remove('active-nav');
            }
        });
    }

    // Init Footer Type
    const savedFooterType = localStorage.getItem('turbine-footer-type') || 'static';
    setFooterType(savedFooterType);

    // Event Listeners for Footer Buttons
    footerBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const type = this.dataset.footerType;
            setFooterType(type);
        });
    });

    // Card Style Logic
    const cardStyleBtns = document.querySelectorAll('.theme-card-style-btn');

    function setCardStyle(style) {
        document.documentElement.setAttribute('data-card-style', style);
        localStorage.setItem('turbine-card-style', style);

        // Update active state
        cardStyleBtns.forEach(btn => {
            if (btn.dataset.style === style) {
                btn.classList.add('active-card-style');
            } else {
                btn.classList.remove('active-card-style');
            }
        });
    }

    // Init Card Style
    const savedCardStyle = localStorage.getItem('turbine-card-style') || 'shadow';
    setCardStyle(savedCardStyle);

    // Event Listeners for Card Style Buttons
    cardStyleBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const style = this.dataset.style;
            setCardStyle(style);
        });
    });

    // Sidebar Theme Logic
    const sidebarThemeBtns = document.querySelectorAll('.theme-sidebar-btn');

    function setSidebarTheme(theme) {
        document.documentElement.setAttribute('data-sidebar-theme', theme);
        localStorage.setItem('turbine-sidebar-theme', theme);

        // Update active state
        sidebarThemeBtns.forEach(btn => {
            if (btn.dataset.sidebarTheme === theme) {
                btn.classList.add('active-sidebar-theme');
            } else {
                btn.classList.remove('active-sidebar-theme');
            }
        });
    }

    // Init Sidebar Theme
    const savedSidebarTheme = localStorage.getItem('turbine-sidebar-theme') || 'default';
    setSidebarTheme(savedSidebarTheme);

    // Event Listeners for Sidebar Theme
    sidebarThemeBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const theme = this.dataset.sidebarTheme;
            setSidebarTheme(theme);
        });
    });

    // Sidebar Profile Visibility Logic
    const profileBtns = document.querySelectorAll('.theme-profile-btn');
    const userProfileSection = document.getElementById('sidebar-user-profile');

    function setProfileVisibility(status) {
        if (!userProfileSection) return;

        if (status === 'hidden') {
            userProfileSection.classList.add('hidden');
        } else {
            userProfileSection.classList.remove('hidden');
        }
        localStorage.setItem('turbine-sidebar-profile', status);

        // Update active state
        profileBtns.forEach(btn => {
            if (btn.dataset.profile === status) {
                btn.classList.add('active-profile');
            } else {
                btn.classList.remove('active-profile');
            }
        });
    }

    // Init Profile Visibility
    const savedProfileStatus = localStorage.getItem('turbine-sidebar-profile') || 'hidden';
    setProfileVisibility(savedProfileStatus);

    // Event Listeners for Profile Buttons
    profileBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const status = this.dataset.profile;
            setProfileVisibility(status);
        });
    });

    // Header Theme Logic
    const headerThemeBtns = document.querySelectorAll('.theme-header-btn');

    function setHeaderTheme(theme) {
        document.documentElement.setAttribute('data-header-theme', theme);
        localStorage.setItem('turbine-header-theme', theme);

        // Update active state
        headerThemeBtns.forEach(btn => {
            if (btn.dataset.headerTheme === theme) {
                btn.classList.add('active-header-theme');
            } else {
                btn.classList.remove('active-header-theme');
            }
        });
    }

    // Init Header Theme
    const savedHeaderTheme = localStorage.getItem('turbine-header-theme') || 'default';
    setHeaderTheme(savedHeaderTheme);

    // Event Listeners for Header Theme
    headerThemeBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const theme = this.dataset.headerTheme;
            setHeaderTheme(theme);
        });
    });

    // Sidebar Background Logic
    const sidebarBgBtns = document.querySelectorAll('.theme-sidebar-bg-btn');
    const sidebarBgUpload = document.getElementById('sidebar-bg-upload');
    const sidebarBgRemove = document.getElementById('sidebar-bg-remove');
    const sidebarBgEl = document.getElementById('sidebar-bg');
    const sidebarOverlayEl = document.getElementById('sidebar-overlay');

    function setSidebarBackground(url) {
        if (!sidebarBgEl || !sidebarOverlayEl) return;

        if (url) {
            // Set the background image
            sidebarBgEl.style.backgroundImage = `url('${url}')`;
            sidebarBgEl.classList.remove('opacity-0');
            sidebarBgEl.classList.add('opacity-100');
            sidebarOverlayEl.classList.remove('opacity-0');
            sidebarOverlayEl.classList.add('opacity-100');

            // Save to localStorage
            localStorage.setItem('turbine-sidebar-bg', url);
        } else {
            // Remove background
            sidebarBgEl.style.backgroundImage = 'none';
            sidebarBgEl.classList.add('opacity-0');
            sidebarBgEl.classList.remove('opacity-100');
            sidebarOverlayEl.classList.add('opacity-0');
            sidebarOverlayEl.classList.remove('opacity-100');

            // Remove from localStorage
            localStorage.removeItem('turbine-sidebar-bg');
        }

        // Update active state on buttons
        sidebarBgBtns.forEach(btn => {
            const btnBg = btn.dataset.sidebarBg;
            if (url && url.includes(btnBg)) {
                btn.classList.add('ring-2', 'ring-primary', 'ring-offset-2');
            } else {
                btn.classList.remove('ring-2', 'ring-primary', 'ring-offset-2');
            }
        });
    }

    // Initialize sidebar background from localStorage
    const savedSidebarBg = localStorage.getItem('turbine-sidebar-bg');
    if (savedSidebarBg) {
        setSidebarBackground(savedSidebarBg);
    }

    // Preset button clicks
    sidebarBgBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const bgUrl = this.dataset.sidebarBg;
            setSidebarBackground(bgUrl);
        });
    });

    // Custom upload
    if (sidebarBgUpload) {
        sidebarBgUpload.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    setSidebarBackground(e.target.result);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Remove button
    if (sidebarBgRemove) {
        sidebarBgRemove.addEventListener('click', function () {
            setSidebarBackground(null);
            if (sidebarBgUpload) sidebarBgUpload.value = '';
        });
    }

});
// end: Settings Offcanvas