import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { signOut } from '../services/martBillingApi';

export default function MartHeader({ onMenuClick }) {
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();
    const [signOutError, setSignOutError] = useState('');
    const [signingOut, setSigningOut] = useState(false);

    async function handleSignOut() {
        setSigningOut(true);
        setSignOutError('');
        try {
            await signOut();
            navigate('/signin', { replace: true });
        } catch (error) {
            setSignOutError(error.message || 'Unable to sign out.');
            navigate('/signin', { replace: true });
        } finally {
            setSigningOut(false);
        }
    }

    return (
        <header className="sticky top-0 z-30 flex min-h-16 items-center gap-3 border-b border-black/5 bg-white/95 px-4 backdrop-blur dark:border-white/10 dark:bg-gray/95 sm:px-6">
            {onMenuClick && (
                <button aria-label="Open navigation" className="rounded-lg p-2 text-black/60 hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/5 lg:hidden" onClick={onMenuClick} type="button">
                    <i className="ri-menu-line text-xl" />
                </button>
            )}
            <div className="flex-1">
                <p className="text-sm font-semibold text-black dark:text-white">Store overview</p>
                {signOutError && <p className="text-xs text-danger" role="alert">{signOutError}</p>}
            </div>
            <button
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-black/60 hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/5"
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                type="button"
            >
                <i className={`${theme === 'light' ? 'ri-moon-line' : 'ri-sun-line'} text-lg`} />
            </button>
            <button className="btn btn-outline btn-sm" disabled={signingOut} onClick={handleSignOut} type="button">
                <i className="ri-logout-box-r-line mr-1" />
                {signingOut ? 'Signing out…' : 'Sign out'}
            </button>
        </header>
    );
}
