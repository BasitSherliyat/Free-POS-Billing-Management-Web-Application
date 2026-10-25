import React from 'react';

const StatCard = ({ title, value, icon, percentage, trend, color, variant = 'plain' }) => {
    const isGradient = variant === 'gradient';

    const bgColorClass = {
        primary: 'bg-primary/10 text-primary',
        success: 'bg-success/10 text-success',
        warning: 'bg-warning/10 text-warning',
        danger: 'bg-danger/10 text-danger',
        info: 'bg-info/10 text-info',
    }[color] || 'bg-primary/10 text-primary';

    const gradientStyle = {
        primary: { background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', boxShadow: '0 10px 15px -3px rgba(139, 92, 246, 0.3)' },
        success: { background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)' },
        warning: { background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', boxShadow: '0 10px 15px -3px rgba(245, 158, 11, 0.3)' },
        danger: { background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', boxShadow: '0 10px 15px -3px rgba(239, 68, 68, 0.3)' },
        info: { background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', boxShadow: '0 10px 15px -3px rgba(6, 182, 212, 0.3)' },
        orange: { background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', boxShadow: '0 10px 15px -3px rgba(249, 115, 22, 0.3)' },
        blue: { background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)' },
    }[color] || {};

    if (isGradient) {
        return (
            <div className="relative overflow-hidden rounded-2xl p-5 text-white shadow-lg group hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl"
                style={gradientStyle}>
                <div className="relative z-10 flex flex-col justify-between h-full">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                                <i className={`${icon} text-xl text-white`}></i>
                            </div>
                            <span className="badge bg-white/20 text-white backdrop-blur-sm text-xs px-2 py-1 rounded flex items-center gap-1 border border-white/10">
                                <i className={trend === 'up' ? "ri-arrow-up-line" : "ri-arrow-down-line"}></i> {percentage}
                            </span>
                        </div>
                        <h3 className="text-2xl font-black text-white mb-1 tracking-tight">{value}</h3>
                        <p className="text-sm font-medium text-white/80">{title}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="box !p-5 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 hover:shadow-lg">
            <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-${color}/5 group-hover:bg-${color}/10 transition-colors z-0`}></div>
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${bgColorClass} group-hover:scale-110 transition-transform duration-300`}>
                        <i className={`${icon} text-xl`}></i>
                    </div>
                    {percentage && (
                        <span className={`badge border border-${trend === 'up' ? 'success' : 'danger'}/20 bg-${trend === 'up' ? 'success' : 'danger'}/5 text-${trend === 'up' ? 'success' : 'danger'} text-xs px-2 py-1 rounded-full flex items-center gap-1`}>
                            <i className={trend === 'up' ? "ri-arrow-up-line" : "ri-arrow-down-line"}></i> {percentage}
                        </span>
                    )}
                </div>
                <div>
                    <h3 className="text-2xl font-black text-dark dark:text-white mb-1 tracking-tight">{value}</h3>
                    <p className="text-sm font-medium text-gray-500 dark:text-white/40">{title}</p>
                </div>
            </div>
        </div>
    );
};

export default StatCard;
