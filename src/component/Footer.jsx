import React from 'react'
import { useTheme } from '../context/ThemeContext'

const Footer = () => {
    const { footerType } = useTheme();
    return (
        <footer id="main-footer" className={`mt-auto p-6 bg-white dark:bg-black border-t border-black/10 dark:border-white/10 ${footerType === 'hidden' ? 'hidden' : footerType === 'sticky' ? 'sticky bottom-0 z-20' : 'relative'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div className="text-center md:text-left">
                    <p className="text-sm text-black/50 dark:text-white/50 mb-0">
                        {new Date().getFullYear()} © Turbine.
                    </p>
                </div>
                <div className="text-center md:text-right">
                    <p className="text-sm text-black/50 dark:text-white/50 mb-0">
                        Design & Develop by <a href="#"
                            className="text-primary hover:text-primary-focus transition-colors">Turbine
                            UI</a>
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
