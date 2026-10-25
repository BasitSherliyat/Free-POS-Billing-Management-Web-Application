import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Breadcrumb from '../component/Breadcrumb';
import { Link, useLocation } from 'react-router-dom';
import {
    createSalesInvoice,
    createSalesInvoiceItem,
    getAssetUrl,
    getSignedInUser,
    loadMartBillingData,
    loadStoreSettings,
    updateSalesInvoice,
} from '../services/martBillingApi';

const formatCurrency = (amount) => `Rs. ${Number(amount || 0).toLocaleString('en-PK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
})}`;
const dateNow = new Date();
const today = new Date(dateNow.getTime() - dateNow.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

function getId(record) {
    return record?.id ?? record?.uuid ?? '';
}

function getName(record) {
    return record?.name ?? record?.full_name ?? record?.customer_name ?? record?.item_name
        ?? record?.category_name ?? record?.title ?? 'Unnamed';
}

function getCustomerName(invoice, customers) {
    const relation = invoice?.customer;
    if (relation) return getName(relation);
    const customerId = invoice?.customer_id;
    const customer = customers.find((entry) => String(getId(entry)) === String(customerId));
    return customer ? getName(customer) : 'Walk-in customer';
}

function getInvoiceNumber(invoice) {
    return invoice?.invoice_no ?? invoice?.invoice_number ?? invoice?.number ?? `INV-${getId(invoice)}`;
}

function getInvoiceCustomerId(invoice) {
    return invoice?.customer_id ?? invoice?.customer?.id;
}

function getPaymentStatus(invoice) {
    const status = String(invoice?.payment_status ?? invoice?.status ?? 'unpaid').toLowerCase();
    if (status === 'paid') return 'paid';
    if (status === 'partial') return 'partial';
    return 'unpaid';
}

function getInvoiceTotal(invoice) {
    return Number(invoice?.grand_total ?? invoice?.total_amount ?? invoice?.total ?? invoice?.amount ?? 0);
}

function getPaidAmount(invoice) {
    return Number(invoice?.paid_amount ?? (getPaymentStatus(invoice) === 'paid' ? getInvoiceTotal(invoice) : 0));
}

function getDueAmount(invoice) {
    return Number(invoice?.due_amount ?? Math.max(getInvoiceTotal(invoice) - getPaidAmount(invoice), 0));
}

function getItemPrice(item) {
    return Number(item?.selling_price ?? item?.sale_price ?? item?.unit_price ?? item?.price ?? 0);
}

function getLineInvoiceId(line) {
    return line?.invoice_id ?? line?.sales_invoice_id ?? line?.invoice?.id;
}

function getLineItem(line, items) {
    const relation = line?.item ?? line?.product;
    if (relation) return relation;
    return items.find((item) => String(getId(item)) === String(line?.item_id ?? line?.product_id));
}

function getLineAmount(line) {
    return Number(line?.total ?? line?.total_amount ?? line?.amount
        ?? Number(line?.quantity ?? 0) * Number(line?.unit_price ?? line?.price ?? 0));
}

function formatDate(value) {
    if (!value) return '—';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
}

function getInvoiceDateKey(invoice) {
    const value = invoice?.invoice_date ?? invoice?.date;
    if (value) {
        const dateValue = String(value);
        if (/^\d{4}-\d{2}-\d{2}/.test(dateValue)) return dateValue.slice(0, 10);
    }
    const fallback = invoice?.created_at;
    if (!fallback) return '';
    const date = new Date(fallback);
    return Number.isNaN(date.getTime())
        ? ''
        : new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

function statusLabel(status) {
    if (status === 'paid') return 'Paid';
    if (status === 'partial') return 'Partially paid';
    return 'Unpaid';
}

function normalizeCategoryId(item) {
    return item?.category_id ?? item?.category?.id ?? '';
}

function MartBilling() {
    const location = useLocation();
    const isAllInvoicesPage = location.pathname === '/invoice-list';
    const [data, setData] = useState({
        invoices: [],
        customers: [],
        items: [],
        categories: [],
        invoiceItems: [],
    });
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [actionError, setActionError] = useState('');
    const [saving, setSaving] = useState(false);
    const [updatingInvoice, setUpdatingInvoice] = useState('');
    const [search, setSearch] = useState('');
    const [invoiceDateFrom, setInvoiceDateFrom] = useState('');
    const [invoiceDateTo, setInvoiceDateTo] = useState('');
    const [invoiceCustomerFilter, setInvoiceCustomerFilter] = useState('');
    const [invoiceBalanceFilter, setInvoiceBalanceFilter] = useState('');
    const [invoiceStatusFilter, setInvoiceStatusFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [productSearch, setProductSearch] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [customerSearch, setCustomerSearch] = useState('');
    const [customerSearchOpen, setCustomerSearchOpen] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState('paid');
    const [paidAmount, setPaidAmount] = useState(0);
    const [cart, setCart] = useState([]);
    const [selectedItemIds, setSelectedItemIds] = useState([]);
    const [printDocument, setPrintDocument] = useState(null);
    const [storeSettings, setStoreSettings] = useState({ mart_name: 'Mart Billing', address: '', contact_number: '', logo_path: null });
    const productSearchInput = useRef(null);

    const refresh = useCallback(async ({ force = true } = {}) => {
        if (force) setLoading(true);
        setLoadError('');
        try {
            setData(await loadMartBillingData({ force }));
        } catch (error) {
            setLoadError(error.message || 'Unable to load billing data.');
        } finally {
            if (force) setLoading(false);
        }
    }, []);

    useEffect(() => {
        let active = true;
        loadMartBillingData()
            .then((loadedData) => {
                if (active) setData(loadedData);
            })
            .catch((error) => {
                if (active) setLoadError(error.message || 'Unable to load billing data.');
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        let active = true;
        loadStoreSettings()
            .then((settings) => {
                if (active) setStoreSettings(settings);
            })
            .catch((error) => {
                if (active) setActionError(`Store details could not be loaded. ${error.message}`);
            });
        const onSettingsUpdated = (event) => setStoreSettings(event.detail);
        window.addEventListener('mart:store-settings-updated', onSettingsUpdated);
        return () => {
            active = false;
            window.removeEventListener('mart:store-settings-updated', onSettingsUpdated);
        };
    }, []);

    useEffect(() => {
        if (!printDocument) return undefined;
        const timer = window.setTimeout(() => window.print(), 150);
        const clear = () => setPrintDocument(null);
        window.addEventListener('afterprint', clear, { once: true });
        return () => {
            window.clearTimeout(timer);
            window.removeEventListener('afterprint', clear);
        };
    }, [printDocument]);

    useEffect(() => {
        if (!isAllInvoicesPage) {
            productSearchInput.current?.focus();
        }
    }, [isAllInvoicesPage]);

    const filteredItems = useMemo(() => {
        const query = productSearch.trim().toLowerCase();
        return data.items.filter((item) => {
            const matchesCategory = !categoryFilter || String(normalizeCategoryId(item)) === String(categoryFilter);
            const matchesSearch = !query || `${getName(item)} ${item?.sku ?? ''} ${item?.barcode ?? ''}`.toLowerCase().includes(query);
            return matchesCategory && matchesSearch;
        });
    }, [categoryFilter, data.items, productSearch]);

    const filteredInvoices = useMemo(() => {
        const query = search.trim().toLowerCase();
        return data.invoices.filter((invoice) => (
            (isAllInvoicesPage
                ? (!invoiceDateFrom || getInvoiceDateKey(invoice) >= invoiceDateFrom)
                    && (!invoiceDateTo || getInvoiceDateKey(invoice) <= invoiceDateTo)
                : getInvoiceDateKey(invoice) === today)
            && (!isAllInvoicesPage || !invoiceCustomerFilter
                || (invoiceCustomerFilter === 'walk-in'
                    ? !getInvoiceCustomerId(invoice)
                    : String(getInvoiceCustomerId(invoice) ?? '') === invoiceCustomerFilter))
            && (!isAllInvoicesPage || !invoiceBalanceFilter
                || (invoiceBalanceFilter === 'outstanding'
                    ? getDueAmount(invoice) > 0
                    : getDueAmount(invoice) <= 0))
            && (!isAllInvoicesPage || !invoiceStatusFilter
                || getPaymentStatus(invoice) === invoiceStatusFilter)
            && (!query || `${getInvoiceNumber(invoice)} ${getCustomerName(invoice, data.customers)}`.toLowerCase().includes(query))
        ));
    }, [
        data.customers,
        data.invoices,
        invoiceBalanceFilter,
        invoiceCustomerFilter,
        invoiceDateFrom,
        invoiceDateTo,
        invoiceStatusFilter,
        isAllInvoicesPage,
        search,
    ]);

    const filteredCustomers = useMemo(() => {
        const query = customerSearch.trim().toLowerCase();
        if (!query) return data.customers.slice(0, 8);
        const digits = query.replace(/\D/g, '');
        return data.customers.filter((customer) => {
            const name = String(customer.customer_name ?? '').toLowerCase();
            const phone = String(customer.customer_contact ?? '');
            const alternatePhone = String(customer.alt_number ?? '');
            const shop = String(customer.shop_name ?? '').toLowerCase();
            return name.includes(query)
                || shop.includes(query)
                || (digits && (phone.replace(/\D/g, '').includes(digits) || alternatePhone.replace(/\D/g, '').includes(digits)));
        }).slice(0, 8);
    }, [customerSearch, data.customers]);

    const cartTotal = cart.reduce((total, line) => total + (line.quantity * line.price), 0);
    const itemNameById = useMemo(
        () => new Map(data.items.map((item) => [String(getId(item)), getName(item)])),
        [data.items],
    );

    function addToCart(item) {
        const id = getId(item);
        if (!id) {
            setActionError('This item has no ID and cannot be added to an invoice.');
            return;
        }
        const price = getItemPrice(item);
        if (!Number.isFinite(price) || price < 0) {
            setActionError(`${getName(item)} has an invalid price and cannot be added.`);
            return;
        }
        setActionError('');
        setCart((current) => {
            const existing = current.find((line) => String(line.itemId) === String(id));
            return existing
                ? current.map((line) => String(line.itemId) === String(id) ? { ...line, quantity: line.quantity + 1 } : line)
                : [...current, { itemId: id, name: getName(item), unit: item?.unit ?? 'unit', price, quantity: 1 }];
        });
    }

    function addSelectedItems() {
        selectedItemIds.forEach((id) => {
            const item = data.items.find((entry) => String(getId(entry)) === String(id));
            if (item) addToCart(item);
        });
        setSelectedItemIds([]);
    }

    function handleProductScan(event) {
        if (event.key !== 'Enter') return;

        const scannedValue = productSearch.trim().toLowerCase();
        if (!scannedValue) return;

        event.preventDefault();
        const matches = data.items.filter((item) => (
            [item?.barcode, item?.sku, getId(item)]
                .some((value) => String(value ?? '').trim().toLowerCase() === scannedValue)
        ));

        if (matches.length === 1) {
            addToCart(matches[0]);
            setProductSearch('');
        } else if (matches.length > 1) {
            setActionError(`More than one product matches barcode "${productSearch.trim()}".`);
        } else {
            setActionError(`No product found for barcode "${productSearch.trim()}".`);
        }
    }

    function changeQuantity(itemId, value) {
        if (value === '') return;
        const quantity = Number(value);
        if (!Number.isFinite(quantity) || quantity <= 0) {
            setCart((current) => current.filter((line) => String(line.itemId) !== String(itemId)));
            return;
        }
        setCart((current) => current.map((line) => (
            String(line.itemId) === String(itemId) ? { ...line, quantity: Number(quantity.toFixed(3)) } : line
        )));
    }

    function adjustQuantity(itemId, adjustment) {
        setCart((current) => current.map((line) => (
            String(line.itemId) === String(itemId)
                ? { ...line, quantity: Math.max(1, Number((line.quantity + adjustment).toFixed(3))) }
                : line
        )));
    }

    function selectCustomer(customer) {
        setCustomerId(String(getId(customer)));
        setCustomerSearch(`${customer.customer_name} · ${customer.customer_contact}`);
        setCustomerSearchOpen(false);
    }

    async function submitInvoice(event) {
        event.preventDefault();
        if (!cart.length) {
            setActionError('Add at least one item before creating an invoice.');
            return;
        }
        let user;
        try {
            user = getSignedInUser();
        } catch (error) {
            setActionError(error.message || 'Your saved sign-in could not be read. Please sign in again.');
            return;
        }
        if (!user?.id) {
            setActionError('Please sign in before creating an invoice.');
            return;
        }
        const receivedAmount = paymentStatus === 'paid'
            ? cartTotal
            : paymentStatus === 'partial' ? Number(paidAmount) : 0;
        if (paymentStatus === 'partial' && (receivedAmount <= 0 || receivedAmount >= cartTotal)) {
            setActionError('For a partially paid sale, enter an amount greater than zero and less than the total.');
            return;
        }
        setSaving(true);
        setActionError('');
        const invoiceNumber = `INV-${today.replaceAll('-', '')}-${Math.trunc(event.timeStamp)}`;
        let createdInvoice;
        try {
            createdInvoice = await createSalesInvoice({
                customer_id: customerId || null,
                user_id: user.id,
                invoice_no: invoiceNumber,
                invoice_date: today,
                subtotal: Number(cartTotal.toFixed(2)),
                discount: 0,
                tax: 0,
                grand_total: Number(cartTotal.toFixed(2)),
                paid_amount: Number(receivedAmount.toFixed(2)),
                due_amount: Number((cartTotal - receivedAmount).toFixed(2)),
                payment_status: paymentStatus,
            });
            const invoiceId = getId(createdInvoice);
            if (!invoiceId) {
                throw new Error('The invoice was created, but the API response did not include its ID. Invoice items were not submitted.');
            }

            for (const line of cart) {
                await createSalesInvoiceItem({
                    invoice_id: invoiceId,
                    item_id: line.itemId,
                    item_name: line.name,
                    unit: line.unit,
                    quantity: line.quantity,
                    price: line.price,
                    discount: 0,
                    total: Number((line.quantity * line.price).toFixed(2)),
                });
            }

            setCart([]);
            setCustomerId('');
            setPaymentStatus('paid');
            setPaidAmount(0);
            await refresh({ force: false });
            setPrintDocument({
                type: 'receipt',
                invoice: {
                    ...createdInvoice,
                    invoice_no: createdInvoice.invoice_no ?? invoiceNumber,
                    invoice_date: createdInvoice.invoice_date ?? today,
                    grand_total: createdInvoice.grand_total ?? cartTotal,
                    paid_amount: createdInvoice.paid_amount ?? receivedAmount,
                    due_amount: createdInvoice.due_amount ?? cartTotal - receivedAmount,
                    payment_status: createdInvoice.payment_status ?? paymentStatus,
                },
                lines: cart.map((line) => ({
                    name: line.name,
                    quantity: line.quantity,
                    unitPrice: line.price,
                    unit: line.unit,
                    total: line.quantity * line.price,
                })),
                customer: data.customers.find((customer) => String(getId(customer)) === String(customerId)),
                total: cartTotal,
            });
        } catch (error) {
            const invoiceId = getId(createdInvoice);
            setActionError(invoiceId
                ? `Invoice ${getInvoiceNumber(createdInvoice)} was created, but an invoice item could not be saved. Check the invoice before retrying. ${error.message}`
                : error.message || 'Unable to create invoice.');
            await refresh();
        } finally {
            setSaving(false);
        }
    }

    async function changePaymentStatus(invoice, nextStatus) {
        const invoiceId = getId(invoice);
        if (!invoiceId || nextStatus === getPaymentStatus(invoice)) return;
        setUpdatingInvoice(String(invoiceId));
        setActionError('');
        try {
            const total = getInvoiceTotal(invoice);
            const paid = nextStatus === 'paid' ? total : 0;
            const updated = await updateSalesInvoice(invoiceId, {
                payment_status: nextStatus,
                paid_amount: paid,
                due_amount: total - paid,
            });
            setData((current) => ({
                ...current,
                invoices: current.invoices.map((entry) => String(getId(entry)) === String(invoiceId)
                    ? {
                        ...entry,
                        ...updated,
                        payment_status: updated?.payment_status ?? nextStatus,
                        paid_amount: updated?.paid_amount ?? paid,
                        due_amount: updated?.due_amount ?? total - paid,
                    }
                    : entry),
            }));
        } catch (error) {
            setActionError(`Could not update payment status for ${getInvoiceNumber(invoice)}. ${error.message}`);
        } finally {
            setUpdatingInvoice('');
        }
    }

    function preparePrint(invoice, type) {
        const invoiceId = getId(invoice);
        const invoiceLines = Array.isArray(invoice?.items)
            ? invoice.items
            : data.invoiceItems.filter((line) => String(getLineInvoiceId(line)) === String(invoiceId));
        const lines = invoiceLines
            .map((line) => {
                const item = getLineItem(line, data.items);
                return {
                    name: line?.item_name ?? (item ? getName(item) : itemNameById.get(String(line?.item_id ?? line?.product_id))) ?? 'Mart item',
                    quantity: Number(line?.quantity ?? 0),
                    unitPrice: Number(line?.price ?? line?.unit_price ?? 0),
                    unit: line?.unit ?? 'unit',
                    total: getLineAmount(line),
                };
            });

        setPrintDocument({
            type,
            invoice,
            lines,
            customer: data.customers.find((customer) => String(getId(customer)) === String(invoice?.customer_id))
                ?? invoice?.customer,
            total: getInvoiceTotal(invoice),
        });
    }

    return (
        <div className={`mart-billing-page ${isAllInvoicesPage ? 'p-6' : 'p-3 sm:p-4'}`}>
            {/* <Breadcrumb
                title={isAllInvoicesPage ? 'All invoices' : 'Billing'}
                category="Sales"
                description={isAllInvoicesPage
                    ? 'Review and manage all sales invoices.'
                    : 'Build a basket, create sales invoices, and print receipts. Today’s invoices appear below.'}
            /> */}

            {!isAllInvoicesPage && (
                <div className="mb-3">
                    <Link className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-black/60 transition hover:bg-black/5 hover:text-primary dark:text-white/65 dark:hover:bg-white/5" to="/">
                        <i className="ri-arrow-left-line" />
                        Back to dashboard
                    </Link>
                </div>
            )}

            {loadError && (
                <div className="mb-5 rounded-lg border border-danger/30 bg-danger/5 p-4 text-sm text-danger" role="alert">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <span>
                            <strong>Billing data could not be loaded.</strong> {loadError}
                            {loadError.includes('sign in again') && (
                                <> <Link className="font-semibold underline" to="/signin">Sign in</Link></>
                            )}
                        </span>
                        {loadError.includes('sign in again')
                            ? <Link className="btn btn-outline btn-sm" to="/signin">Sign in</Link>
                            : <button className="btn btn-outline btn-sm" onClick={refresh} type="button">Retry</button>}
                    </div>
                </div>
            )}
            {actionError && (
                <div className="mb-5 rounded-lg border border-danger/30 bg-danger/5 p-4 text-sm text-danger" role="alert">
                    <div className="flex items-start justify-between gap-3">
                        <span>{actionError}</span>
                        <button className="shrink-0" onClick={() => setActionError('')} type="button" aria-label="Dismiss error">
                            <i className="ri-close-line" />
                        </button>
                    </div>
                </div>
            )}

            {/* <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                    { label: 'Invoices', value: data.invoices.length, icon: 'ri-file-list-3-line', color: 'bg-primary/10 text-primary' },
                    { label: 'Total sales', value: formatCurrency(totalSales), icon: 'ri-line-chart-line', color: 'bg-success/10 text-success' },
                    { label: 'Collected', value: formatCurrency(paidTotal), icon: 'ri-checkbox-circle-line', color: 'bg-info/10 text-info' },
                    { label: 'Outstanding', value: formatCurrency(unpaidTotal), icon: 'ri-time-line', color: 'bg-warning/10 text-warning' },
                    { label: 'Products', value: data.items.length, icon: 'ri-shopping-basket-2-line', color: 'bg-info/10 text-info' },
                ].map((metric) => (
                    <div className="box !p-4" key={metric.label}>
                        <div className="flex items-center gap-3">
                            <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${metric.color}`}>
                                <i className={`${metric.icon} text-xl`} />
                            </div>
                            <div>
                                <p className="text-xs text-black/55 dark:text-white/55">{metric.label}</p>
                                <p className="text-xl font-bold text-black dark:text-white">{metric.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div> */}

            {!isAllInvoicesPage && (
            <div className="grid items-stretch gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(340px,0.85fr)]">
                <section className="box flex h-[min(86vh,900px)] min-h-[640px] min-w-0 flex-col overflow-hidden !p-0">
                    <div className="shrink-0 border-b border-black/5 bg-gradient-to-r from-primary/[0.08] via-transparent to-transparent p-4 dark:border-white/10 sm:p-5">
                        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
                                    <i className="ri-shopping-basket-2-line text-xl" />
                                </span>
                                <div>
                                    <h5 className="font-bold text-black dark:text-white">Product catalog</h5>
                                    <p className="mt-1 text-xs text-black/50 dark:text-white/50">
                                        Browse products or scan a barcode to add items to this sale.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold text-black/60 shadow-sm dark:bg-white/10 dark:text-white/70">
                                <i className="ri-box-3-line text-primary" />
                                {data.items.length} products
                            </div>
                        </div>
                        <label className="relative block">
                            <span className="sr-only">Search products or scan barcode</span>
                            <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-lg text-black/40" />
                            <input
                                className="form-input h-12 w-full rounded-xl border-black/10 bg-white pl-11 pr-24 shadow-sm focus:border-primary focus:ring-primary dark:border-white/10 dark:bg-gray"
                                onKeyDown={handleProductScan}
                                placeholder="Search by product name or scan barcode…"
                                ref={productSearchInput}
                                value={productSearch}
                                onChange={(event) => setProductSearch(event.target.value)}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-black/10 bg-black/[0.03] px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-black/40 dark:border-white/10 dark:bg-white/5 dark:text-white/40">
                                Enter
                            </span>
                        </label>
                    </div>
                    <div className="grid min-h-0 flex-1 grid-cols-1 sm:grid-cols-[220px_minmax(0,1fr)]">
                    <aside aria-label="Product categories" className="max-h-28 overflow-y-auto border-b border-black/5 p-3 dark:border-white/10 sm:max-h-none sm:border-b-0 sm:border-r sm:p-3">
                        <p className="mb-2 hidden px-2 text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/40 sm:block">Categories</p>
                        <div className="flex flex-wrap gap-2 pb-1 sm:flex-col sm:flex-nowrap sm:pb-0">
                            <button
                                className={`flex shrink-0 items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-semibold transition sm:w-full ${!categoryFilter ? 'bg-primary text-white shadow-sm' : 'text-black/60 hover:bg-primary/5 hover:text-primary dark:text-white/60 dark:hover:bg-white/5'}`}
                                onClick={() => setCategoryFilter('')}
                                type="button"
                            >
                                <span className="flex items-center gap-2"><i className="ri-apps-2-line" />All products</span>
                                <span className="text-[10px] opacity-70">{data.items.length}</span>
                            </button>
                            {data.categories.map((category) => {
                                const categoryId = String(getId(category));
                                const count = data.items.filter((item) => String(normalizeCategoryId(item)) === categoryId).length;
                                const active = String(categoryFilter) === categoryId;
                                return (
                                    <button
                                        className={`flex shrink-0 items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-semibold transition sm:w-full ${active ? 'bg-primary text-white shadow-sm' : 'text-black/60 hover:bg-primary/5 hover:text-primary dark:text-white/60 dark:hover:bg-white/5'}`}
                                        key={getId(category)}
                                        onClick={() => setCategoryFilter(categoryId)}
                                        type="button"
                                    >
                                        <span className="flex min-w-0 items-center gap-2"><i className="ri-price-tag-3-line shrink-0" /><span className="whitespace-normal break-words">{getName(category)}</span></span>
                                        <span className="text-[10px] opacity-70">{count}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </aside>
                    <div className="flex min-h-0 min-w-0 flex-col p-3 sm:p-4">
                        <div className="mb-3 flex shrink-0 items-center justify-between gap-3 text-xs text-black/45 dark:text-white/45">
                            <span>{filteredItems.length} products shown</span>
                            <div className="flex items-center gap-3">
                                {selectedItemIds.length > 0 && <span>{selectedItemIds.length} selected</span>}
                                {selectedItemIds.length > 0 && (
                                    <button className="btn btn-primary btn-sm" onClick={addSelectedItems} type="button">
                                        <i className="ri-add-line mr-1" />Add selected
                                    </button>
                                )}
                            </div>
                        </div>
                    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
                        {loading ? (
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                                {Array.from({ length: 6 }, (_, index) => (
                                    <div className="h-52 animate-pulse rounded-xl border border-black/5 bg-black/[0.03] dark:border-white/10 dark:bg-white/[0.03]" key={index} />
                                ))}
                            </div>
                        ) : filteredItems.length ? (
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                                {filteredItems.map((item) => {
                                    const itemId = String(getId(item));
                                    const selected = selectedItemIds.includes(itemId);
                                    return (
                                        <article
                                            className={`group relative overflow-hidden rounded-xl border bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:bg-gray ${selected ? 'border-primary ring-1 ring-primary/20 shadow-sm' : 'border-black/10 hover:border-primary/40 dark:border-white/10'}`}
                                            key={getId(item)}
                                        >
                                            <button
                                                aria-label={`Add ${getName(item)} to sale`}
                                                className="block w-full text-left"
                                                onClick={() => addToCart(item)}
                                                type="button"
                                            >
                                                <div className="flex h-24 items-center justify-center bg-gradient-to-br from-primary/[0.08] to-primary/[0.02] p-2 dark:from-primary/10 dark:to-transparent">
                                                    {item.item_image ? (
                                                        <img
                                                            alt=""
                                                            className="h-full w-full rounded-lg object-contain transition-transform duration-200 group-hover:scale-105"
                                                            src={getAssetUrl(item.item_image)}
                                                        />
                                                    ) : (
                                                        <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-white text-primary shadow-sm dark:bg-white/10">
                                                            <i className="ri-shopping-bag-3-line text-2xl" />
                                                        </span>
                                                    )}
                                                </div>
                                            </button>
                                            <div className="p-2.5">
                                                <p className="truncate text-xs font-semibold text-black dark:text-white" title={getName(item)}>{getName(item)}</p>
                                                <div className="mt-1 flex min-h-4 items-center justify-between gap-2">
                                                    {item?.sku
                                                        ? <span className="truncate text-[9px] text-black/40 dark:text-white/40">SKU {item.sku}</span>
                                                        : <span className="text-[9px] text-black/35 dark:text-white/35">{item?.unit ?? 'Product'}</span>}
                                                    <span className="shrink-0 text-xs font-bold text-primary">{formatCurrency(getItemPrice(item))}</span>
                                                </div>
                                                <div className="mt-2 flex items-center justify-between gap-1.5 border-t border-black/5 pt-2 dark:border-white/10">
                                                    <label className={`flex min-w-0 cursor-pointer items-center gap-1.5 rounded-md px-1.5 py-1 text-[10px] font-semibold transition ${selected ? 'bg-primary/10 text-primary' : 'text-black/55 hover:bg-black/[0.04] dark:text-white/55 dark:hover:bg-white/5'}`}>
                                                        <input
                                                            aria-label={`Select ${getName(item)} for bulk add`}
                                                            checked={selected}
                                                            className="form-checkbox !h-4 !w-4 shrink-0"
                                                            onChange={(event) => setSelectedItemIds((current) => (
                                                                event.target.checked
                                                                    ? [...current, itemId]
                                                                    : current.filter((id) => id !== itemId)
                                                            ))}
                                                            type="checkbox"
                                                        />
                                                        <span className="truncate">Select</span>
                                                    </label>
                                                    <button
                                                        aria-label={`Add ${getName(item)} to sale`}
                                                        className="flex shrink-0 items-center gap-1 rounded-md bg-primary/[0.07] px-2 py-1 text-[10px] font-semibold text-primary transition hover:bg-primary hover:text-white"
                                                        onClick={() => addToCart(item)}
                                                        type="button"
                                                    >
                                                        <i className="ri-add-line" />Add
                                                    </button>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-black/10 px-6 text-center dark:border-white/10">
                                <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <i className="ri-search-eye-line text-2xl" />
                                </span>
                                <p className="text-sm font-semibold text-black dark:text-white">
                                    {data.items.length ? 'No matching products' : 'No products available'}
                                </p>
                                <p className="mt-1 text-xs text-black/50 dark:text-white/50">
                                    {data.items.length ? 'Try another search or choose a different category.' : 'Products will appear here when added to your catalog.'}
                                </p>
                            </div>
                        )}
                    </div>
                    </div>
                    </div>
                </section>

                <form className="box flex min-w-0 flex-col overflow-hidden !p-0" onSubmit={submitInvoice}>
                    <div className="shrink-0 border-b border-black/5 bg-gradient-to-r from-primary/[0.08] via-transparent to-transparent p-4 dark:border-white/10 sm:p-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
                                    <i className="ri-shopping-cart-2-line text-xl" />
                                </span>
                                <div>
                                    <h5 className="font-bold text-black dark:text-white">Current sale</h5>
                                    <p className="mt-1 text-xs text-black/50 dark:text-white/50">
                                        {cart.length} product{cart.length === 1 ? '' : 's'} in basket
                                    </p>
                                </div>
                            </div>
                            <span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
                                {cart.reduce((count, line) => count + line.quantity, 0)} items
                            </span>
                        </div>
                    </div>
                    <div className="flex-1 p-4 sm:p-5">
                    <div className="mb-5 shrink-0 rounded-xl border border-black/5 bg-black/[0.015] p-4 dark:border-white/10 dark:bg-white/[0.02]">
                        <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-black/55 dark:text-white/55" htmlFor="mart-customer-search">
                            <i className="ri-user-3-line text-primary" />Customer
                        </label>
                        <div className="relative">
                            <div className="relative">
                                <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
                                <input
                                    autoComplete="off"
                                    className="form-input h-11 rounded-lg bg-white pl-9 pr-10 dark:bg-gray"
                                    id="mart-customer-search"
                                    onBlur={() => window.setTimeout(() => setCustomerSearchOpen(false), 150)}
                                    onChange={(event) => {
                                        setCustomerSearch(event.target.value);
                                        setCustomerId('');
                                        setCustomerSearchOpen(true);
                                    }}
                                    onFocus={() => setCustomerSearchOpen(true)}
                                    placeholder="Search by phone number or name"
                                    value={customerSearch}
                                />
                                {customerId && (
                                    <button
                                        aria-label="Clear selected customer"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-black/45 hover:text-danger"
                                        onClick={() => {
                                            setCustomerId('');
                                            setCustomerSearch('');
                                            setCustomerSearchOpen(true);
                                        }}
                                        type="button"
                                    >
                                        <i className="ri-close-circle-line" />
                                    </button>
                                )}
                            </div>
                            {customerSearchOpen && !customerId && (
                                <div className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-black/10 bg-white p-1 shadow-lg dark:border-white/10 dark:bg-gray">
                                    <button
                                        className="w-full rounded-md px-3 py-2 text-left text-sm text-black/60 hover:bg-primary/5 dark:text-white/60 dark:hover:bg-white/5"
                                        onMouseDown={(event) => event.preventDefault()}
                                        onClick={() => {
                                            setCustomerId('');
                                            setCustomerSearch('');
                                            setCustomerSearchOpen(false);
                                        }}
                                        type="button"
                                    >
                                        Walk-in customer
                                    </button>
                                    {filteredCustomers.map((customer) => (
                                        <button
                                            className="w-full rounded-md px-3 py-2 text-left hover:bg-primary/5 dark:hover:bg-white/5"
                                            key={getId(customer)}
                                            onMouseDown={(event) => event.preventDefault()}
                                            onClick={() => selectCustomer(customer)}
                                            type="button"
                                        >
                                            <span className="block text-sm font-medium text-black dark:text-white">{customer.customer_name}</span>
                                            <span className="block text-xs text-black/50 dark:text-white/50">
                                                {customer.customer_contact}
                                                {customer.alt_number ? ` · ${customer.alt_number}` : ''}
                                                {customer.shop_name ? ` · ${customer.shop_name}` : ''}
                                            </span>
                                        </button>
                                    ))}
                                    {!filteredCustomers.length && (
                                        <p className="px-3 py-3 text-sm text-black/50 dark:text-white/50">No customer found. Add them from Customers.</p>
                                    )}
                                </div>
                            )}
                        </div>
                        <p className="mt-1 text-xs text-black/45 dark:text-white/45">
                            {customerId ? 'Customer selected' : 'Leave empty for a walk-in customer'}
                        </p>
                    </div>
                    <div className="mb-5 shrink-0">
                        <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-black/55 dark:text-white/55" htmlFor="mart-payment-status">
                            <i className="ri-bank-card-line text-primary" />Payment
                        </label>
                        <select
                            className="form-input h-11 rounded-lg"
                            id="mart-payment-status"
                            value={paymentStatus}
                            onChange={(event) => {
                                const status = event.target.value;
                                setPaymentStatus(status);
                                setPaidAmount(0);
                            }}
                        >
                            <option value="paid">Paid</option>
                            <option value="unpaid">Unpaid</option>
                            <option value="partial">Partially paid</option>
                        </select>
                    </div>
                    {paymentStatus === 'partial' && (
                        <div className="mb-4">
                            <label className="form-label" htmlFor="mart-paid-amount">Amount received</label>
                            <input
                                className="form-input"
                                id="mart-paid-amount"
                                type="number"
                                min="0.01"
                                max={cartTotal}
                                step="0.01"
                                value={paidAmount}
                                onChange={(event) => setPaidAmount(event.target.value)}
                                required
                            />
                            <p className="mt-1 text-xs text-black/45 dark:text-white/45">
                                Remaining balance: {formatCurrency(Math.max(cartTotal - Number(paidAmount || 0), 0))}
                            </p>
                        </div>
                    )}
                    <div className="mb-5 max-h-[17rem] space-y-2 overflow-y-auto overscroll-contain pr-1">
                        {cart.length ? cart.map((line) => (
                            <div className="flex items-center gap-2 rounded-xl border border-black/5 bg-white p-3 dark:border-white/10 dark:bg-white/[0.03] sm:gap-3" key={line.itemId}>
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <i className="ri-price-tag-3-line" />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-black dark:text-white">{line.name}</p>
                                    <p className="mt-0.5 text-[11px] text-black/50 dark:text-white/50">{formatCurrency(line.price)} each</p>
                                </div>
                                <div className="flex items-center gap-1 rounded-lg bg-black/[0.03] p-1 dark:bg-white/5">
                                    <button
                                        aria-label={`Decrease ${line.name} quantity`}
                                        className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-black/60 shadow-sm hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white/10 dark:text-white/60"
                                        disabled={line.quantity <= 1}
                                        onClick={() => adjustQuantity(line.itemId, -1)}
                                        type="button"
                                    >
                                        <i className="ri-subtract-line text-xs" />
                                    </button>
                                    <input
                                        aria-label={`Quantity for ${line.name}`}
                                        className="form-input h-7 w-14 border-0 bg-transparent px-1 text-center text-sm shadow-none"
                                        min="0.001"
                                        step="0.001"
                                        type="number"
                                        value={line.quantity}
                                        onChange={(event) => changeQuantity(line.itemId, event.target.value)}
                                    />
                                    <button
                                        aria-label={`Increase ${line.name} quantity`}
                                        className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-black/60 shadow-sm hover:text-primary dark:bg-white/10 dark:text-white/60"
                                        onClick={() => adjustQuantity(line.itemId, 1)}
                                        type="button"
                                    >
                                        <i className="ri-add-line text-xs" />
                                    </button>
                                </div>
                                <span className="w-20 shrink-0 text-right text-xs font-bold text-black dark:text-white sm:text-sm">
                                    {formatCurrency(line.quantity * line.price)}
                                </span>
                                <button
                                    aria-label={`Remove ${line.name}`}
                                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-black/35 transition hover:bg-danger/10 hover:text-danger"
                                    onClick={() => changeQuantity(line.itemId, 0)}
                                    type="button"
                                >
                                    <i className="ri-delete-bin-line" />
                                </button>
                            </div>
                        )) : (
                            <div className="flex min-h-44 flex-col items-center justify-center rounded-xl border border-dashed border-black/10 px-5 text-center dark:border-white/10">
                                <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <i className="ri-shopping-basket-line text-2xl" />
                                </span>
                                <p className="text-sm font-semibold text-black dark:text-white">Your sale is empty</p>
                                <p className="mt-1 text-xs text-black/50 dark:text-white/50">Choose a product from the catalog to get started.</p>
                            </div>
                        )}
                    </div>
                    <div className="mb-5 shrink-0 rounded-xl bg-black/[0.03] p-4 dark:bg-white/[0.05]">
                        <div className="mb-2 flex items-center justify-between text-xs text-black/50 dark:text-white/50">
                            <span>Subtotal</span>
                            <span>{formatCurrency(cartTotal)}</span>
                        </div>
                        <div className="flex items-end justify-between">
                            <span className="text-sm font-semibold text-black/70 dark:text-white/70">Total due</span>
                            <span className="text-2xl font-bold tracking-tight text-primary">{formatCurrency(cartTotal)}</span>
                        </div>
                    </div>
                    <button className="btn btn-primary h-12 w-full shrink-0 justify-center rounded-xl text-sm font-bold shadow-sm" disabled={saving || loading || !cart.length} type="submit">
                        <i className="ri-receipt-line mr-2" />
                        {saving ? 'Creating invoice…' : 'Create invoice & print receipt'}
                    </button>
                    <p className="mt-3 shrink-0 text-center text-xs text-black/45 dark:text-white/45">
                        Receipts and invoices open the browser print dialog. Choose “Save as PDF” to download a PDF.
                    </p>
                    </div>
                </form>
            </div>
            )}

            <section className="box mt-6 !p-5">
                <div className="mb-5 flex flex-col gap-3">
                    <div>
                        <h5 className="font-bold text-black dark:text-white">
                            {isAllInvoicesPage ? 'All sales invoices' : 'Today’s sales invoices'}
                        </h5>
                        <p className="mt-1 text-xs text-black/50 dark:text-white/50">
                            {isAllInvoicesPage
                                ? 'Update payment status or print a receipt / invoice PDF.'
                                : 'Invoices created today. View the all-invoices page for previous sales.'}
                        </p>
                    </div>
                    <div className={isAllInvoicesPage
                        ? 'grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-[minmax(140px,1.3fr)_repeat(5,minmax(105px,1fr))_auto]'
                        : 'flex flex-wrap items-center gap-2'}>
                        <label className="relative min-w-0">
                            <span className="sr-only">Search invoices</span>
                            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
                            <input
                                className={`form-input w-full ${isAllInvoicesPage ? 'px-2 pl-8 text-xs' : 'pl-9'}`}
                                placeholder="Search invoice or customer"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                            />
                        </label>
                        {isAllInvoicesPage && (
                            <>
                                <label className="min-w-0">
                                    <span className="sr-only">Filter invoices by customer</span>
                                    <select
                                        aria-label="Filter invoices by customer"
                                        className="form-input w-full px-2 text-xs"
                                        value={invoiceCustomerFilter}
                                        onChange={(event) => setInvoiceCustomerFilter(event.target.value)}
                                    >
                                        <option value="">All customers</option>
                                        <option value="walk-in">Walk-in customers</option>
                                        {data.customers.map((customer) => (
                                            <option key={getId(customer)} value={String(getId(customer))}>
                                                {getName(customer)}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <label className="min-w-0">
                                    <span className="sr-only">Filter invoices by remaining balance</span>
                                    <select
                                        aria-label="Filter invoices by remaining balance"
                                        className="form-input w-full px-2 text-xs"
                                        value={invoiceBalanceFilter}
                                        onChange={(event) => setInvoiceBalanceFilter(event.target.value)}
                                    >
                                        <option value="">Any balance</option>
                                        <option value="outstanding">Outstanding</option>
                                        <option value="settled">Settled</option>
                                    </select>
                                </label>
                                <label className="min-w-0">
                                    <span className="sr-only">Filter invoices by payment status</span>
                                    <select
                                        aria-label="Filter invoices by payment status"
                                        className="form-input w-full px-2 text-xs"
                                        value={invoiceStatusFilter}
                                        onChange={(event) => setInvoiceStatusFilter(event.target.value)}
                                    >
                                        <option value="">All statuses</option>
                                        <option value="paid">Paid</option>
                                        <option value="partial">Partially paid</option>
                                        <option value="unpaid">Unpaid</option>
                                    </select>
                                </label>
                                <label className="flex min-w-0 items-center gap-1 text-xs text-black/55 dark:text-white/55">
                                    <span className="shrink-0">From</span>
                                    <input
                                        aria-label="Filter invoices from date"
                                        className="form-input min-w-0 w-full px-2 text-xs"
                                        max={invoiceDateTo || undefined}
                                        type="date"
                                        value={invoiceDateFrom}
                                        onChange={(event) => setInvoiceDateFrom(event.target.value)}
                                    />
                                </label>
                                <label className="flex min-w-0 items-center gap-1 text-xs text-black/55 dark:text-white/55">
                                    <span className="shrink-0">To</span>
                                    <input
                                        aria-label="Filter invoices to date"
                                        className="form-input min-w-0 w-full px-2 text-xs"
                                        min={invoiceDateFrom || undefined}
                                        type="date"
                                        value={invoiceDateTo}
                                        onChange={(event) => setInvoiceDateTo(event.target.value)}
                                    />
                                </label>
                                {(invoiceDateFrom || invoiceDateTo || invoiceCustomerFilter || invoiceBalanceFilter || invoiceStatusFilter) && (
                                    <button
                                        className="btn btn-outline btn-sm"
                                        onClick={() => {
                                            setInvoiceDateFrom('');
                                            setInvoiceDateTo('');
                                            setInvoiceCustomerFilter('');
                                            setInvoiceBalanceFilter('');
                                            setInvoiceStatusFilter('');
                                        }}
                                        type="button"
                                    >
                                        Clear
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] whitespace-nowrap">
                        <thead className="bg-primary/10">
                            <tr>
                                <th className="th">Invoice</th>
                                <th className="th">Customer</th>
                                <th className="th">Date</th>
                                <th className="th text-right">Total</th>
                                <th className="th text-right">Remaining balance</th>
                                <th className="th">Payment status</th>
                                <th className="th text-right">Print</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInvoices.map((invoice) => {
                                const status = getPaymentStatus(invoice);
                                const invoiceId = getId(invoice);
                                return (
                                    <tr className="border-b border-black/5 dark:border-white/5" key={invoiceId}>
                                        <td className="p-4 font-mono font-semibold text-primary">{getInvoiceNumber(invoice)}</td>
                                        <td className="p-4 text-sm text-black dark:text-white">{getCustomerName(invoice, data.customers)}</td>
                                        <td className="p-4 text-sm text-black/60 dark:text-white/60">
                                            {formatDate(invoice?.invoice_date ?? invoice?.date ?? invoice?.created_at)}
                                        </td>
                                        <td className="p-4 text-right text-sm font-bold text-black dark:text-white">
                                            {formatCurrency(getInvoiceTotal(invoice))}
                                        </td>
                                        <td className="p-4 text-right text-sm font-semibold text-warning">
                                            {formatCurrency(getDueAmount(invoice))}
                                        </td>
                                        <td className="p-4">
                                            <select
                                                aria-label={`Payment status for ${getInvoiceNumber(invoice)}`}
                                                className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold ${status === 'paid' ? 'bg-success/10 text-success' : status === 'partial' ? 'bg-info/10 text-info' : 'bg-warning/10 text-warning'}`}
                                                disabled={updatingInvoice === String(invoiceId)}
                                                value={status}
                                                onChange={(event) => changePaymentStatus(invoice, event.target.value)}
                                            >
                                                <option value="paid">Paid</option>
                                                <option value="unpaid">Unpaid</option>
                                                {status === 'partial' && <option value="partial" disabled>Partially paid</option>}
                                            </select>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex justify-end gap-2">
                                                <button className="btn btn-outline btn-sm" onClick={() => preparePrint(invoice, 'receipt')} type="button">
                                                    <i className="ri-printer-line mr-1" />Receipt
                                                </button>
                                                <button className="btn btn-primary btn-sm" onClick={() => preparePrint(invoice, 'invoice')} type="button">
                                                    <i className="ri-file-pdf-2-line mr-1" />PDF
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {!loading && !filteredInvoices.length && (
                                <tr>
                                    <td className="p-8 text-center text-sm text-black/50 dark:text-white/50" colSpan="7">
                                        {data.invoices.length
                                            ? 'No invoices match the selected filters.'
                                            : 'No sales invoices yet. Create your first sale above.'}
                                    </td>
                                </tr>
                            )}
                            {loading && (
                                <tr><td className="p-8 text-center text-sm text-black/50 dark:text-white/50" colSpan="7">Loading invoices…</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {printDocument && (
                <div className={`mart-print-area ${printDocument.type === 'receipt' ? 'mart-print-receipt' : 'mart-print-invoice'}`}>
                    <div className="mart-print-header">
                        <img className="mart-print-logo" src={storeSettings.logo_path ? getAssetUrl(storeSettings.logo_path) : '/images/logo.png'} alt={`${storeSettings.mart_name} logo`} />
                        <h2 className="mart-print-store-name">{storeSettings.mart_name}</h2>
                        {storeSettings.address && <p className="mart-print-store-detail">{storeSettings.address}</p>}
                        {storeSettings.contact_number && <p className="mart-print-store-detail">{storeSettings.contact_number}</p>}
                        <h1>{printDocument.type === 'receipt' ? 'SALES RECEIPT' : 'INVOICE'}</h1>
                    </div>
                    <div className="mart-print-meta">
                        <span><strong>Invoice:</strong> {getInvoiceNumber(printDocument.invoice)}</span>
                        <span><strong>Date:</strong> {formatDate(printDocument.invoice?.invoice_date ?? printDocument.invoice?.created_at ?? today)}</span>
                        <span><strong>Customer:</strong> {printDocument.customer ? getName(printDocument.customer) : 'Walk-in customer'}</span>
                        <span><strong>Payment:</strong> {statusLabel(getPaymentStatus(printDocument.invoice))}</span>
                    </div>
                    {printDocument.customer?.shop_name && (
                        <p className="mart-print-shop"><strong>Shop:</strong> {printDocument.customer.shop_name}</p>
                    )}
                    {printDocument.lines.length ? (
                        <table className="mart-print-table">
                            <thead>
                                <tr><th>Item</th><th>Qty</th><th>Unit price</th><th>Total</th></tr>
                            </thead>
                            <tbody>
                                {printDocument.lines.map((line, index) => (
                                    <tr key={`${line.name}-${index}`}>
                                        <td>{line.name}</td>
                                        <td>{line.quantity} {line.unit}</td>
                                        <td>{formatCurrency(line.unitPrice)}</td>
                                        <td>{formatCurrency(line.total)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="mart-print-empty">Invoice items were not included in the API response.</p>
                    )}
                    <div className="mart-print-total"><span>Total</span><strong>{formatCurrency(printDocument.total)}</strong></div>
                    <div className="mart-print-settlement">
                        <span>Amount paid: {formatCurrency(getPaidAmount(printDocument.invoice))}</span>
                        <span>Balance due: {formatCurrency(getDueAmount(printDocument.invoice))}</span>
                    </div>
                    <p className="mart-print-thanks">Thank you for shopping with us!</p>
                    <div className="mart-print-developer">
                        <hr />
                        <p>Software by Dantech Solutions | Contact: 03142003149 | dantechsolutions.com.pk</p>
                    </div>
                </div>
            )}
            <style>{`
                .mart-print-area { display: none; }
                .mart-print-receipt { page: mart-receipt; }
                @page mart-receipt { size: 80mm auto; margin: 0; }
                @media print {
                    body * { visibility: hidden !important; }
                    .mart-print-area, .mart-print-area * { visibility: visible !important; }
                    .mart-print-area {
                        display: block !important;
                        position: absolute;
                        inset: 0 auto auto 0;
                        width: 100%;
                        box-sizing: border-box;
                        padding: 8mm;
                        color: #111827 !important;
                        background: #fff !important;
                        font-family: Arial, sans-serif;
                    }
                    .mart-print-header { margin-bottom: 14px; text-align: center; }
                    .mart-print-logo { display: block; width: auto; max-width: 38mm; height: auto; max-height: 14mm; margin: 0 auto 8px; object-fit: contain; }
                    .mart-print-store-name { margin: 0 0 3px; font-size: 16px; font-weight: 700; }
                    .mart-print-store-detail { margin: 2px 0; font-size: 10px; white-space: pre-line; }
                    .mart-print-area h1 { margin: 0; font-size: 20px; font-weight: 700; text-align: center; }
                    .mart-print-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 24px; font-size: 12px; }
                    .mart-print-shop { margin: -14px 0 18px; font-size: 12px; }
                    .mart-print-table { width: 100%; border-collapse: collapse; font-size: 12px; }
                    .mart-print-table th, .mart-print-table td { padding: 10px 8px; border-bottom: 1px solid #e5e7eb; text-align: left; }
                    .mart-print-table th:not(:first-child), .mart-print-table td:not(:first-child) { text-align: right; }
                    .mart-print-total { display: flex; justify-content: space-between; margin: 20px 0; font-size: 17px; }
                    .mart-print-settlement { display: flex; justify-content: space-between; font-size: 12px; }
                    .mart-print-thanks { margin-top: 32px; text-align: center; font-size: 12px; }
                    .mart-print-developer { margin-top: 12px; text-align: center; font-size: 9px; line-height: 1.5; }
                    .mart-print-developer hr { margin: 0 0 8px; border: 0; border-top: 1px solid #9ca3af; }
                    .mart-print-developer p { margin: 0; }
                    .mart-print-empty { padding: 16px 0; font-size: 12px; }
                    .mart-print-receipt { width: 80mm; max-width: 80mm; margin-top: 8mm; padding: 5mm; border: 1px solid #111827; }
                    .mart-print-receipt h1 { font-size: 17px; }
                    .mart-print-receipt .mart-print-meta { grid-template-columns: 1fr 1fr; gap: 5px 4px; margin-bottom: 10px; font-size: 9px; }
                    .mart-print-receipt .mart-print-header { margin-bottom: 12px; }
                    .mart-print-receipt .mart-print-shop { margin: -5px 0 10px; font-size: 9px; }
                    .mart-print-receipt .mart-print-table { font-size: 9px; }
                    .mart-print-receipt .mart-print-table th, .mart-print-receipt .mart-print-table td { padding: 7px 2px; font-size: 10px; }
                    .mart-print-receipt .mart-print-table th:first-child, .mart-print-receipt .mart-print-table td:first-child { max-width: 32mm; overflow-wrap: anywhere; }
                    .mart-print-receipt .mart-print-total { margin: 12px 0; font-size: 14px; }
                    .mart-print-receipt .mart-print-settlement { gap: 8px; font-size: 9px; }
                    .mart-print-receipt .mart-print-thanks { margin-top: 20px; font-size: 10px; }
                    .mart-print-receipt .mart-print-developer { margin-top: 10px; font-size: 8px; }
                    @page { margin: 12mm; }
                    @page :first { margin: 8mm; }
                }
                @media print and (min-width: 90mm) {
                    .mart-print-invoice { max-width: 210mm; }
                }
            `}</style>
        </div>
    );
}

export default MartBilling;
