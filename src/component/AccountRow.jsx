import React from 'react';

const AccountRow = ({ type, icon, count, balance, growth, color }) => {
    const iconBgClass = {
        primary: 'bg-primary/10 text-primary',
        success: 'bg-success/10 text-success',
        warning: 'bg-warning/10 text-warning',
        info: 'bg-info/10 text-info',
        danger: 'bg-danger/10 text-danger',
    }[color] || 'bg-gray-100';

    const growthClass = growth.startsWith('+') ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger';

    return (
        <tr className="hover:bg-gray/5 dark:hover:bg-white/10 transition-colors">
            <td className="p-3">
                <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 ${iconBgClass} rounded-lg flex items-center justify-center`}>
                        <i className={icon}></i>
                    </div>
                    <h6 className="text-sm font-semibold text-dark dark:text-white">{type}</h6>
                </div>
            </td>
            <td className="p-3 text-sm text-gray-600 dark:text-white/40">{count}</td>
            <td className="p-3 text-sm font-semibold text-dark dark:text-white">{balance}</td>
            <td className="p-3">
                <span className={`badge ${growthClass} text-xs px-2 py-1 rounded`}>{growth}</span>
            </td>
        </tr>
    );
};

export default AccountRow;
