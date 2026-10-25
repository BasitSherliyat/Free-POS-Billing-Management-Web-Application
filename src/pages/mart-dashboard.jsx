import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../component/Breadcrumb';
import { loadMartDashboardData } from '../services/martBillingApi';

const formatCurrency = (amount) => `Rs. ${Number(amount || 0).toLocaleString('en-PK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
})}`;
const emptyData = { categories: [], items: [], customers: [], users: [], invoices: [] };

function invoiceTotal(invoice) {
    return Number(invoice?.grand_total ?? 0);
}

function invoicePaid(invoice) {
    return Number(invoice?.paid_amount ?? (invoice?.payment_status === 'paid' ? invoiceTotal(invoice) : 0));
}

function invoiceDue(invoice) {
    return Number(invoice?.due_amount ?? Math.max(invoiceTotal(invoice) - invoicePaid(invoice), 0));
}

function invoiceNumber(invoice) {
    return invoice?.invoice_no ?? `INV-${invoice?.id ?? ''}`;
}

function displayDate(value) {
    if (!value) return '—';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
}

function MartDashboard() {
    const [data, setData] = useState(emptyData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [retry, setRetry] = useState(0);

    useEffect(() => {
        let active = true;
        loadMartDashboardData({ force: retry > 0 })
            .then((loadedData) => {
                if (active) setData(loadedData);
            })
            .catch((loadError) => {
                if (active) setError(loadError.message || 'Unable to load dashboard data.');
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
    }, [retry]);

    const totalSales = data.invoices.reduce((sum, invoice) => sum + invoiceTotal(invoice), 0);
    const collected = data.invoices.reduce((sum, invoice) => sum + invoicePaid(invoice), 0);
    const outstanding = data.invoices.reduce((sum, invoice) => sum + invoiceDue(invoice), 0);
    const latestInvoices = [...data.invoices]
        .sort((a, b) => new Date(b.invoice_date ?? b.created_at ?? 0) - new Date(a.invoice_date ?? a.created_at ?? 0))
        .slice(0, 6);
    const categoryBreakdown = useMemo(
        () => data.categories.map((category) => ({
            ...category,
            itemCount: data.items.filter((item) => String(item.category_id) === String(category.id)).length,
        })),
        [data.categories, data.items],
    );
    const salesByDay = useMemo(() => {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        start.setDate(start.getDate() - 6);
        const days = Array.from({ length: 7 }, (_, index) => {
            const date = new Date(start);
            date.setDate(start.getDate() + index);
            return { date, total: 0 };
        });
        data.invoices.forEach((invoice) => {
            const date = new Date(invoice.invoice_date ?? invoice.created_at ?? '');
            if (Number.isNaN(date.getTime())) return;
            date.setHours(0, 0, 0, 0);
            const day = days.find((entry) => entry.date.getTime() === date.getTime());
            if (day) day.total += invoiceTotal(invoice);
        });
        return days;
    }, [data.invoices]);
    const maxDailySales = Math.max(...salesByDay.map((day) => day.total), 1);

    const metrics = [
        { label: 'Total sales', value: formatCurrency(totalSales), detail: `${data.invoices.length} invoices · ${formatCurrency(collected)} collected`, icon: 'ri-line-chart-line', color: 'bg-primary/10 text-primary' },
        { label: 'Outstanding', value: formatCurrency(outstanding), detail: 'Remaining customer balance', icon: 'ri-time-line', color: 'bg-warning/10 text-warning' },
        { label: 'Categories', value: data.categories.length, detail: 'Product groups', icon: 'ri-price-tag-3-line', color: 'bg-primary/10 text-primary' },
        { label: 'Items', value: data.items.length, detail: 'Products in store', icon: 'ri-shopping-basket-2-line', color: 'bg-info/10 text-info' },
        { label: 'Customers', value: data.customers.length, detail: 'Customer accounts', icon: 'ri-group-line', color: 'bg-success/10 text-success' },
        { label: 'Users', value: data.users.length, detail: 'Staff accounts', icon: 'ri-user-settings-line', color: 'bg-black/5 text-black/60 dark:bg-white/10 dark:text-white/60' },
    ];

    return (
        <div className="p-6">
            <Breadcrumb title="Mart Dashboard" category="Store" description="A live overview of your categories, products, customers, staff, and sales." />

            {error && (
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-danger/30 bg-danger/5 p-4 text-sm text-danger" role="alert">
                    <span>{error}</span>
                    <div className="flex items-center gap-3">
                        {error.includes('sign in again') && <Link className="font-semibold underline" to="/signin">Sign in</Link>}
                        <button className="font-semibold underline" onClick={() => { setError(''); setLoading(true); setRetry((value) => value + 1); }} type="button">
                            Retry
                        </button>
                    </div>
                </div>
            )}

            <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
                {metrics.map((metric) => (
                    <div className="box !p-5" key={metric.label}>
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-sm text-black/55 dark:text-white/55">{metric.label}</p>
                                <p className="mt-2 text-2xl font-bold text-black dark:text-white">{loading ? '—' : metric.value}</p>
                                <p className="mt-2 text-xs text-black/45 dark:text-white/45">{loading ? 'Loading…' : metric.detail}</p>
                            </div>
                            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${metric.color}`}>
                                <i className={`${metric.icon} text-xl`} />
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mb-6 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.8fr)]">
                <section className="box !p-5">
                    <div className="mb-5">
                        <h5 className="font-bold text-black dark:text-white">Sales — last 7 days</h5>
                        <p className="mt-1 text-xs text-black/50 dark:text-white/50">Invoice totals by invoice date</p>
                    </div>
                    <div className="flex h-48 items-end gap-3 border-b border-black/10 pb-2 dark:border-white/10 sm:gap-5">
                        {salesByDay.map((day) => (
                            <div className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2" key={day.date.toISOString()}>
                                <span className="max-w-full truncate text-[10px] text-black/45 dark:text-white/45">
                                    {day.total ? formatCurrency(day.total) : ''}
                                </span>
                                <div
                                    className="w-full max-w-12 rounded-t-md bg-primary/80 transition-all"
                                    style={{ height: `${Math.max((day.total / maxDailySales) * 100, day.total ? 8 : 2)}%` }}
                                    title={`${day.date.toLocaleDateString()}: ${formatCurrency(day.total)}`}
                                />
                                <span className="text-[10px] text-black/45 dark:text-white/45">{day.date.toLocaleDateString(undefined, { weekday: 'short' })}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="box !p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h5 className="font-bold text-black dark:text-white">Store inventory</h5>
                            <p className="mt-1 text-xs text-black/50 dark:text-white/50">Items in each category</p>
                        </div>
                        <Link className="text-xs font-semibold text-primary hover:underline" to="/categories">Manage</Link>
                    </div>
                    <div className="mb-4 grid grid-cols-2 gap-3">
                        <div className="rounded-lg bg-primary/5 p-3">
                            <p className="text-xs text-black/50 dark:text-white/50">Categories</p>
                            <p className="mt-1 text-xl font-bold text-black dark:text-white">{loading ? '—' : data.categories.length}</p>
                        </div>
                        <div className="rounded-lg bg-info/5 p-3">
                            <p className="text-xs text-black/50 dark:text-white/50">Items</p>
                            <p className="mt-1 text-xl font-bold text-black dark:text-white">{loading ? '—' : data.items.length}</p>
                        </div>
                    </div>
                    <div className="max-h-48 space-y-3 overflow-y-auto">
                        {categoryBreakdown.slice(0, 6).map((category) => (
                            <div className="flex items-center justify-between gap-3 text-sm" key={category.id}>
                                <span className="truncate text-black/70 dark:text-white/70">{category.category_name}</span>
                                <span className="shrink-0 rounded-full bg-black/5 px-2.5 py-1 text-xs font-semibold text-black/60 dark:bg-white/10 dark:text-white/60">
                                    {category.itemCount} items
                                </span>
                            </div>
                        ))}
                        {!loading && !categoryBreakdown.length && (
                            <p className="py-3 text-center text-sm text-black/45 dark:text-white/45">No categories added yet.</p>
                        )}
                    </div>
                    <Link className="mt-4 inline-flex text-xs font-semibold text-primary hover:underline" to="/items">Manage items</Link>
                </section>
            </div>

            <section className="box !p-5">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h5 className="font-bold text-black dark:text-white">Recent invoices</h5>
                        <p className="mt-1 text-xs text-black/50 dark:text-white/50">Latest sales and payment balances</p>
                    </div>
                    <Link className="btn btn-primary btn-sm" to="/invoice-list"><i className="ri-receipt-line mr-1" />Open invoices</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px]">
                        <thead className="bg-primary/10">
                            <tr>
                                <th className="th text-left">Invoice</th>
                                <th className="th text-left">Date</th>
                                <th className="th text-right">Total</th>
                                <th className="th text-right">Paid</th>
                                <th className="th text-right">Outstanding</th>
                                <th className="th text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {latestInvoices.map((invoice) => (
                                <tr className="border-b border-black/5 dark:border-white/5" key={invoice.id}>
                                    <td className="p-4 font-mono text-sm font-semibold text-primary">{invoiceNumber(invoice)}</td>
                                    <td className="p-4 text-sm text-black/60 dark:text-white/60">{displayDate(invoice.invoice_date ?? invoice.created_at)}</td>
                                    <td className="p-4 text-right text-sm font-semibold text-black dark:text-white">{formatCurrency(invoiceTotal(invoice))}</td>
                                    <td className="p-4 text-right text-sm text-black/60 dark:text-white/60">{formatCurrency(invoicePaid(invoice))}</td>
                                    <td className="p-4 text-right text-sm text-black/60 dark:text-white/60">{formatCurrency(invoiceDue(invoice))}</td>
                                    <td className="p-4">
                                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${invoice.payment_status === 'paid' ? 'bg-success/10 text-success' : invoice.payment_status === 'partial' ? 'bg-info/10 text-info' : 'bg-warning/10 text-warning'}`}>
                                            {invoice.payment_status === 'paid' ? 'Paid' : invoice.payment_status === 'partial' ? 'Partial' : 'Unpaid'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {!loading && !latestInvoices.length && (
                                <tr><td className="p-8 text-center text-sm text-black/50 dark:text-white/50" colSpan="6">No invoices yet. Create a sale to get started.</td></tr>
                            )}
                            {loading && <tr><td className="p-8 text-center text-sm text-black/50 dark:text-white/50" colSpan="6">Loading dashboard data…</td></tr>}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

export default MartDashboard;
