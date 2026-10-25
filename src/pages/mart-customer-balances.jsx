import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../component/Breadcrumb';
import { listResource } from '../services/martBillingApi';

const formatCurrency = (amount) => `Rs. ${Number(amount || 0).toLocaleString('en-PK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
})}`;

function getInvoiceTotal(invoice) {
    return Number(invoice?.grand_total ?? invoice?.total_amount ?? invoice?.total ?? invoice?.amount ?? 0);
}

function getPaidAmount(invoice) {
    const status = String(invoice?.payment_status ?? invoice?.status ?? 'unpaid').toLowerCase();
    return Number(invoice?.paid_amount ?? (status === 'paid' ? getInvoiceTotal(invoice) : 0));
}

function getDueAmount(invoice) {
    return Number(invoice?.due_amount ?? Math.max(getInvoiceTotal(invoice) - getPaidAmount(invoice), 0));
}

function getInvoiceCustomerId(invoice) {
    return invoice?.customer_id ?? invoice?.customer?.id;
}

function formatDate(value) {
    if (!value) return '—';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
}

export default function MartCustomerBalances() {
    const [customers, setCustomers] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [selectedCustomerId, setSelectedCustomerId] = useState('');

    const refresh = useCallback(async ({ force = true } = {}) => {
        setLoading(true);
        setError('');
        try {
            const [loadedCustomers, loadedInvoices] = await Promise.all([
                listResource('customers', { force }),
                listResource('sales-invoices', { force }),
            ]);
            setCustomers(loadedCustomers);
            setInvoices(loadedInvoices);
        } catch (loadError) {
            setError(loadError.message || 'Unable to load customer account balances.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let active = true;
        Promise.all([
            listResource('customers'),
            listResource('sales-invoices'),
        ])
            .then(([loadedCustomers, loadedInvoices]) => {
                if (active) {
                    setCustomers(loadedCustomers);
                    setInvoices(loadedInvoices);
                }
            })
            .catch((loadError) => {
                if (active) setError(loadError.message || 'Unable to load customer account balances.');
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, []);

    const customerAccounts = useMemo(() => customers.map((customer) => {
        const customerInvoices = invoices.filter((invoice) => (
            String(getInvoiceCustomerId(invoice) ?? '') === String(customer.id)
        ));
        return {
            customer,
            invoices: customerInvoices,
            purchases: customerInvoices.reduce((sum, invoice) => sum + getInvoiceTotal(invoice), 0),
            paid: customerInvoices.reduce((sum, invoice) => sum + getPaidAmount(invoice), 0),
            outstanding: customerInvoices.reduce((sum, invoice) => sum + getDueAmount(invoice), 0),
        };
    }), [customers, invoices]);

    const filteredAccounts = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return customerAccounts;
        const digits = query.replace(/\D/g, '');
        return customerAccounts.filter(({ customer }) => (
            String(customer.customer_name ?? '').toLowerCase().includes(query)
            || String(customer.shop_name ?? '').toLowerCase().includes(query)
            || String(customer.customer_contact ?? '').replace(/\D/g, '').includes(digits)
            || String(customer.alt_number ?? '').replace(/\D/g, '').includes(digits)
        ));
    }, [customerAccounts, search]);

    const selectedAccount = customerAccounts.find(
        ({ customer }) => String(customer.id) === String(selectedCustomerId),
    );

    return (
        <div className="p-6">
            <Breadcrumb
                title="Customer balances"
                category="Billing"
                description="Review each customer's purchases, payments, and outstanding balance."
            />

            {error && (
                <div className="mb-5 flex items-center justify-between gap-3 rounded-lg border border-danger/30 bg-danger/5 p-4 text-sm text-danger" role="alert">
                    <span>{error}</span>
                    <div className="flex shrink-0 gap-3">
                        {error.includes('sign in again')
                            ? <Link className="font-semibold underline" to="/signin">Sign in</Link>
                            : <button className="font-semibold underline" onClick={refresh} type="button">Retry</button>}
                    </div>
                </div>
            )}

            <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
                <section className="box !p-5">
                    <div className="mb-4">
                        <h5 className="font-bold text-black dark:text-white">Customer accounts</h5>
                        <p className="mt-1 text-xs text-black/50 dark:text-white/50">Search by customer name, shop, or phone number.</p>
                    </div>
                    <input
                        aria-label="Search customers"
                        className="form-input mb-4"
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search customer"
                        value={search}
                    />
                    <div className="max-h-[65vh] overflow-y-auto">
                        <table className="w-full min-w-[360px]">
                            <thead className="bg-primary/10">
                                <tr>
                                    <th className="th text-left">Customer</th>
                                    <th className="th text-right">Due</th>
                                    <th className="th text-right">Account</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAccounts.map(({ customer, outstanding }) => (
                                    <tr className="border-b border-black/5 dark:border-white/5" key={customer.id}>
                                        <td className="p-3">
                                            <p className="text-sm font-semibold text-black dark:text-white">{customer.customer_name}</p>
                                            <p className="mt-1 text-xs text-black/50 dark:text-white/50">{customer.customer_contact}</p>
                                        </td>
                                        <td className="p-3 text-right text-sm font-semibold text-warning">{formatCurrency(outstanding)}</td>
                                        <td className="p-3 text-right">
                                            <button
                                                aria-pressed={String(customer.id) === String(selectedCustomerId)}
                                                className={`btn btn-sm ${String(customer.id) === String(selectedCustomerId) ? 'btn-primary' : 'btn-outline'}`}
                                                onClick={() => setSelectedCustomerId(String(customer.id))}
                                                type="button"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {!loading && !filteredAccounts.length && (
                                    <tr><td className="p-6 text-center text-sm text-black/50 dark:text-white/50" colSpan="3">No customers found.</td></tr>
                                )}
                                {loading && (
                                    <tr><td className="p-6 text-center text-sm text-black/50 dark:text-white/50" colSpan="3">Loading customer accounts…</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="box !p-5">
                    {selectedAccount ? (
                        <>
                            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <h5 className="font-bold text-black dark:text-white">{selectedAccount.customer.customer_name}</h5>
                                    <p className="mt-1 text-sm text-black/50 dark:text-white/50">
                                        {[selectedAccount.customer.shop_name, selectedAccount.customer.customer_contact].filter(Boolean).join(' · ')}
                                    </p>
                                </div>
                                {selectedAccount.customer.alt_number && (
                                    <span className="text-sm text-black/50 dark:text-white/50">Alt: {selectedAccount.customer.alt_number}</span>
                                )}
                            </div>
                            <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                {[
                                    { label: 'Total purchases', value: formatCurrency(selectedAccount.purchases), color: 'text-black dark:text-white' },
                                    { label: 'Total paid', value: formatCurrency(selectedAccount.paid), color: 'text-success' },
                                    { label: 'Outstanding', value: formatCurrency(selectedAccount.outstanding), color: 'text-warning' },
                                    { label: 'Invoices', value: selectedAccount.invoices.length, color: 'text-primary' },
                                ].map((metric) => (
                                    <div className="rounded-lg bg-black/[0.03] p-4 dark:bg-white/[0.04]" key={metric.label}>
                                        <p className="text-xs text-black/50 dark:text-white/50">{metric.label}</p>
                                        <p className={`mt-2 text-lg font-bold ${metric.color}`}>{metric.value}</p>
                                    </div>
                                ))}
                            </div>
                            <h6 className="mb-3 font-semibold text-black dark:text-white">Purchase history</h6>
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[520px]">
                                    <thead className="bg-primary/10">
                                        <tr>
                                            <th className="th text-left">Invoice</th>
                                            <th className="th text-left">Date</th>
                                            <th className="th text-right">Purchased</th>
                                            <th className="th text-right">Paid</th>
                                            <th className="th text-right">Remaining</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedAccount.invoices.map((invoice) => (
                                            <tr className="border-b border-black/5 dark:border-white/5" key={invoice.id}>
                                                <td className="p-3 font-mono text-sm text-primary">{invoice.invoice_no ?? `INV-${invoice.id}`}</td>
                                                <td className="p-3 text-sm text-black/60 dark:text-white/60">
                                                    {formatDate(invoice.invoice_date ?? invoice.created_at)}
                                                </td>
                                                <td className="p-3 text-right text-sm">{formatCurrency(getInvoiceTotal(invoice))}</td>
                                                <td className="p-3 text-right text-sm text-success">{formatCurrency(getPaidAmount(invoice))}</td>
                                                <td className="p-3 text-right text-sm font-semibold text-warning">{formatCurrency(getDueAmount(invoice))}</td>
                                            </tr>
                                        ))}
                                        {!selectedAccount.invoices.length && (
                                            <tr><td className="p-6 text-center text-sm text-black/50 dark:text-white/50" colSpan="5">No purchases recorded for this customer.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <div className="flex min-h-72 items-center justify-center rounded-lg bg-black/[0.03] p-8 text-center text-sm text-black/50 dark:bg-white/[0.03] dark:text-white/50">
                            Select a customer to view their purchases, payments, and balance.
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
