import React from 'react';

const TransactionItem = ({ type, title, account, amount, time, color }) => {
    const bgColorClass = {
        success: 'bg-success/5 hover:bg-success/10',
        danger: 'bg-danger/5 hover:bg-danger/10',
        primary: 'bg-primary/5 hover:bg-primary/10',
        warning: 'bg-warning/5 hover:bg-warning/10',
        info: 'bg-info/5 hover:bg-info/10',
    }[color] || 'bg-gray-50';

    const iconBgClass = {
        success: 'bg-success/10 text-success',
        danger: 'bg-danger/10 text-danger',
        primary: 'bg-primary/10 text-primary',
        warning: 'bg-warning/10 text-warning',
        info: 'bg-info/10 text-info',
    }[color] || 'bg-gray-100';

    const iconClass = {
        deposit: 'ri-arrow-down-line',
        withdrawal: 'ri-arrow-up-line',
        transfer: 'ri-exchange-line',
        payment: 'ri-hand-coin-line',
        card: 'ri-bank-card-line',
        interest: 'ri-percent-line',
    }[type.toLowerCase()] || 'ri-checkbox-blank-circle-line';

    const amountColorClass = {
        success: 'text-success',
        danger: 'text-danger',
        primary: 'text-primary',
        warning: 'text-warning',
        info: 'text-info',
    }[color] || 'text-dark';

    return (
        <div className={`flex items-center justify-between p-3 rounded-lg ${bgColorClass} transition-colors`}>
            <div className="flex items-center gap-3">
                <div className={`h-10 w-10 ${iconBgClass} rounded-full flex items-center justify-center`}>
                    <i className={iconClass}></i>
                </div>
                <div>
                    <h6 className="text-sm font-semibold text-dark dark:text-white">{title}</h6>
                    <span className="text-xs text-gray/50 dark:text-white/50">{account}</span>
                </div>
            </div>
            <div className="text-right">
                <h6 className={`text-sm font-bold ${amountColorClass}`}>{amount}</h6>
                <span className="text-xs text-gray/50 dark:text-white/50">{time}</span>
            </div>
        </div>
    );
};

export default TransactionItem;
