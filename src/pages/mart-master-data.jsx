import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Breadcrumb from '../component/Breadcrumb';
import { Link } from 'react-router-dom';
import {
    createResource,
    bulkUploadItems,
    deleteResource,
    getAssetUrl,
    getSignedInUserType,
    listResource,
    updateResource,
    uploadItemImage,
} from '../services/martBillingApi';

const PAGE_CONFIG = {
    categories: {
        title: 'Categories',
        singular: 'Category',
        resource: 'categories',
        description: 'Organize the products you sell.',
        fields: [{ name: 'category_name', label: 'Category name', required: true }],
        columns: [{ name: 'category_name', label: 'Category' }, { name: 'items_count', label: 'Products', value: (row) => row.items_count ?? 0 }],
    },
    items: {
        title: 'Items',
        singular: 'Item',
        resource: 'items',
        description: 'Manage products, prices, units, and categories.',
        fields: [
            { name: 'item_name', label: 'Item name', required: true },
            { name: 'category_id', label: 'Category', type: 'category', required: true },
            { name: 'price', label: 'Price', type: 'number', min: 0, step: '0.01' },
            { name: 'unit', label: 'Unit', required: true, placeholder: 'piece, kg, litre' },
            { name: 'barcode', label: 'Barcode' },
            { name: 'item_image', label: 'Item image', type: 'image' },
        ],
        columns: [
            {
                name: 'item_name',
                label: 'Item',
                value: (row) => (
                    <div className="flex items-center gap-3">
                        {row.item_image ? (
                            <img alt="" className="h-10 w-10 rounded-lg object-cover" src={getAssetUrl(row.item_image)} />
                        ) : (
                            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <i className="ri-image-line" />
                            </span>
                        )}
                        <span>{row.item_name}</span>
                    </div>
                ),
            },
            { name: 'category', label: 'Category', value: (row) => row.category?.category_name ?? row.category_name ?? '—' },
            { name: 'price', label: 'Price', value: (row) => Number(row.price ?? 0).toFixed(2) },
            { name: 'unit', label: 'Unit' },
            { name: 'barcode', label: 'Barcode', value: (row) => row.barcode || '—' },
        ],
    },
    customers: {
        title: 'Customers',
        singular: 'Customer',
        resource: 'customers',
        description: 'Maintain customer contact and billing details.',
        fields: [
            { name: 'customer_name', label: 'Customer name', required: true },
            { name: 'shop_name', label: 'Shop name' },
            { name: 'customer_contact', label: 'Contact number', required: true },
            { name: 'alt_number', label: 'Alternate number' },
            { name: 'address', label: 'Address', type: 'textarea' },
        ],
        columns: [
            { name: 'customer_name', label: 'Customer' },
            { name: 'shop_name', label: 'Shop', value: (row) => row.shop_name || '—' },
            { name: 'customer_contact', label: 'Contact' },
            { name: 'address', label: 'Address', value: (row) => row.address || '—' },
        ],
    },
    users: {
        title: 'Users',
        singular: 'User',
        resource: 'users',
        description: 'Manage staff, admin, and super admin accounts.',
        fields: [
            { name: 'user_name', label: 'User name', required: true },
            { name: 'email', label: 'Email address', type: 'email', required: true },
            { name: 'password', label: 'Password', type: 'password', required: true, editOptional: true, minLength: 8 },
            {
                name: 'user_type',
                label: 'User type',
                type: 'select',
                required: true,
                options: [
                    { value: 'staff', label: 'Staff' },
                    { value: 'admin', label: 'Admin' },
                    { value: 'super admin', label: 'Super admin' },
                ],
            },
        ],
        columns: [
            { name: 'user_name', label: 'User' },
            { name: 'email', label: 'Email' },
            { name: 'user_type', label: 'User type' },
            { name: 'created_at', label: 'Joined', value: (row) => row.created_at ? new Date(row.created_at).toLocaleDateString() : '—' },
        ],
    },
};

function MartMasterData({ kind }) {
    const config = PAGE_CONFIG[kind];
    const isCatalogPage = kind === 'categories' || kind === 'items';
    const [records, setRecords] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [editing, setEditing] = useState(null);
    const [pendingDelete, setPendingDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [values, setValues] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedImagePreview, setSelectedImagePreview] = useState('');
    const [bulkUploading, setBulkUploading] = useState(false);
    const [bulkUploadResult, setBulkUploadResult] = useState(null);
    const bulkUploadInput = useRef(null);
    const userType = getSignedInUserType();

    const refresh = useCallback(async ({ force = true } = {}) => {
        setLoading(true);
        setError('');
        try {
            const [loadedRecords, loadedCategories] = await Promise.all([
                listResource(config.resource, { force }),
                kind === 'items' ? listResource('categories', { force }) : Promise.resolve([]),
            ]);
            setRecords(loadedRecords);
            setCategories(loadedCategories);
        } catch (loadError) {
            setError(loadError.message || `Unable to load ${config.title.toLowerCase()}.`);
        } finally {
            setLoading(false);
        }
    }, [config.resource, config.title, kind]);

    useEffect(() => {
        let active = true;
        Promise.all([
            listResource(config.resource),
            kind === 'items' ? listResource('categories') : Promise.resolve([]),
        ])
            .then(([loadedRecords, loadedCategories]) => {
                if (active) {
                    setRecords(loadedRecords);
                    setCategories(loadedCategories);
                }
            })
            .catch((loadError) => {
                if (active) setError(loadError.message || `Unable to load ${config.title.toLowerCase()}.`);
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [config.resource, config.title, kind]);

    const filteredRecords = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return records;
        return records.filter((record) => config.columns.some((column) => (
            String(column.value ? column.value(record) : record[column.name] ?? '').toLowerCase().includes(query)
        )));
    }, [config.columns, records, search]);
    const catalogStats = kind === 'categories'
        ? [
            { label: 'Total categories', value: records.length, icon: 'ri-price-tag-3-line', tint: 'bg-primary/10 text-primary' },
            { label: 'Products organized', value: records.reduce((total, category) => total + Number(category.items_count ?? 0), 0), icon: 'ri-shopping-basket-2-line', tint: 'bg-success/10 text-success' },
            { label: 'Empty categories', value: records.filter((category) => Number(category.items_count ?? 0) === 0).length, icon: 'ri-inbox-2-line', tint: 'bg-warning/10 text-warning' },
        ]
        : [
            { label: 'Total items', value: records.length, icon: 'ri-shopping-basket-2-line', tint: 'bg-primary/10 text-primary' },
            { label: 'With barcode', value: records.filter((item) => item.barcode).length, icon: 'ri-barcode-line', tint: 'bg-success/10 text-success' },
            { label: 'Categories', value: categories.length, icon: 'ri-price-tag-3-line', tint: 'bg-info/10 text-info' },
        ];

    function startCreate() {
        setEditing(null);
        setValues(kind === 'users' ? { user_type: 'staff' } : {});
        setSelectedImage(null);
        setSelectedImagePreview('');
        setError('');
    }

    function startEdit(record) {
        setEditing(record);
        setSelectedImage(null);
        setSelectedImagePreview('');
        setValues(Object.fromEntries(config.fields.map((field) => [
            field.name,
            field.name === 'password' ? '' : record[field.name] ?? (field.name === 'category_id' ? record.category?.id ?? '' : ''),
        ])));
        setError('');
    }

    async function submit(event) {
        event.preventDefault();
        setSaving(true);
        setError('');
        const payload = Object.fromEntries(
            config.fields
                .filter((field) => !(field.name === 'password' && editing && !values.password))
                .map((field) => [field.name, values[field.name] ?? '']),
        );
        if (kind === 'items' && payload.price === '') payload.price = 0;
        if (kind === 'customers') {
            payload.shop_name ||= null;
            payload.alt_number ||= null;
            payload.address ||= null;
        }
        if (kind === 'items') payload.item_image ||= null;

        try {
            if (kind === 'items' && selectedImage) {
                try {
                    payload.item_image = await uploadItemImage(selectedImage);
                } catch (uploadError) {
                    throw new Error(`Image upload failed. ${uploadError.message}`);
                }
            }
            if (editing) {
                await updateResource(config.resource, editing.id, payload);
            } else {
                await createResource(config.resource, payload);
            }
            setEditing(null);
            setValues({});
            setSelectedImage(null);
            setSelectedImagePreview('');
            await refresh({ force: false });
        } catch (saveError) {
            setError(saveError.message || `Unable to save ${config.singular.toLowerCase()}.`);
        } finally {
            setSaving(false);
        }
    }

    async function remove(record) {
        if (isCatalogPage) {
            setPendingDelete(record);
            return;
        }
        if (!window.confirm(`Delete ${record.item_name ?? record.customer_name ?? record.user_name ?? record.category_name}?`)) return;
        await confirmRemove(record);
    }

    async function confirmRemove(record) {
        setError('');
        setDeleting(true);
        try {
            await deleteResource(config.resource, record.id);
            setRecords((current) => current.filter((entry) => entry.id !== record.id));
            setPendingDelete(null);
        } catch (deleteError) {
            setError(deleteError.message || 'Unable to delete this record.');
        } finally {
            setDeleting(false);
        }
    }

    async function uploadItems(event) {
        const input = event.currentTarget;
        const file = input.files?.[0];
        if (!file) return;

        setError('');
        setBulkUploadResult(null);
        if (!file.name.toLowerCase().endsWith('.csv')) {
            setError('Choose a CSV file to bulk upload items.');
            input.value = '';
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            setError('The CSV file must be 10 MB or smaller.');
            input.value = '';
            return;
        }

        setBulkUploading(true);
        try {
            const result = await bulkUploadItems(file);
            setBulkUploadResult(result);
            if (result.imported_count > 0) await refresh({ force: false });
        } catch (uploadError) {
            setError(uploadError.message || 'Unable to bulk upload items.');
        } finally {
            setBulkUploading(false);
            input.value = '';
        }
    }

    return (
        <div className="p-6">
            {isCatalogPage ? (
                <>
                    <div className="mb-6 overflow-hidden rounded-2xl border border-black/5 bg-gradient-to-br from-white via-white to-primary/[0.06] shadow-sm dark:border-white/10 dark:from-gray dark:via-gray dark:to-primary/[0.08]">
                        <div className="flex flex-wrap items-center justify-between gap-5 p-6 sm:p-8">
                            <div className="flex items-center gap-4">
                                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
                                    <i className={`${kind === 'categories' ? 'ri-price-tag-3-line' : 'ri-shopping-basket-2-line'} text-2xl`} />
                                </span>
                                <div>
                                    <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                                        <span>Catalog management</span>
                                        <i className="ri-arrow-right-s-line text-base" />
                                        <span className="text-black/40 dark:text-white/40">{config.title}</span>
                                    </div>
                                    <h1 className="text-2xl font-bold tracking-tight text-black dark:text-white sm:text-3xl">{config.title}</h1>
                                    <p className="mt-1 max-w-xl text-sm text-black/55 dark:text-white/55">{config.description}</p>
                                </div>
                            </div>
                            <span className="hidden h-20 w-20 items-center justify-center rounded-full bg-primary/[0.06] text-primary/40 sm:flex">
                                <i className={`${kind === 'categories' ? 'ri-price-tag-3-line' : 'ri-store-2-line'} text-5xl`} />
                            </span>
                        </div>
                    </div>
                    <div className="mb-6 grid gap-4 sm:grid-cols-3">
                        {catalogStats.map((stat) => (
                            <div className="rounded-xl border border-black/5 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-gray" key={stat.label}>
                                <div className="flex items-center gap-3">
                                    <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.tint}`}>
                                        <i className={`${stat.icon} text-lg`} />
                                    </span>
                                    <div>
                                        <p className="text-xs font-medium text-black/50 dark:text-white/50">{stat.label}</p>
                                        <p className="mt-0.5 text-xl font-bold text-black dark:text-white">{stat.value}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <Breadcrumb title={config.title} category="Mart management" description={config.description} />
            )}
            {error && (
                <div className="mb-5 rounded-lg border border-danger/30 bg-danger/5 p-4 text-sm text-danger" role="alert">
                    <div className="flex items-start justify-between gap-3">
                        <span>{error}</span>
                        <div className="flex shrink-0 items-center gap-3">
                            {error.includes('sign in again')
                                ? <Link className="font-semibold underline" to="/signin">Sign in</Link>
                                : <button className="font-semibold underline" type="button" onClick={refresh}>Retry</button>}
                            <button type="button" onClick={() => setError('')} aria-label="Dismiss error"><i className="ri-close-line" /></button>
                        </div>
                    </div>
                </div>
            )}

            <div className={`grid items-start gap-6 ${isCatalogPage ? 'xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.75fr)]' : 'xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.8fr)]'}`}>
                <section className={`overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm dark:border-white/10 dark:bg-gray ${isCatalogPage ? '!p-0' : 'box !p-5'}`}>
                    <div className={`flex flex-wrap items-center justify-between gap-3 ${isCatalogPage ? 'border-b border-black/5 p-5 dark:border-white/10 sm:p-6' : 'mb-5'}`}>
                        <div>
                            {isCatalogPage ? (
                                <>
                                    <h2 className="text-base font-bold text-black dark:text-white">{kind === 'categories' ? 'Category directory' : 'Product inventory'}</h2>
                                    <p className="mt-1 text-xs text-black/50 dark:text-white/50">
                                        Showing {filteredRecords.length} of {records.length} {config.title.toLowerCase()}
                                    </p>
                                </>
                            ) : (
                                <>
                                    <h5 className="font-bold text-black dark:text-white">All {config.title.toLowerCase()}</h5>
                                    <p className="mt-1 text-xs text-black/50 dark:text-white/50">{records.length} records</p>
                                </>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <label className="relative">
                                <span className="sr-only">Search {config.title.toLowerCase()}</span>
                                <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-black/35" />
                                <input
                                    className={`form-input ${isCatalogPage ? 'h-10 min-w-48 rounded-lg pl-9 text-sm' : 'pl-9'}`}
                                    placeholder={`Search ${config.title.toLowerCase()}`}
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                />
                            </label>
                            {kind === 'items' && (
                                <>
                                    <a
                                        className="btn btn-outline whitespace-nowrap"
                                        download="items-template.csv"
                                        href="data:text/csv;charset=utf-8,item_name%2Ccategory_name%2Cprice%2Cunit%2Cbarcode%2Citem_image%0A"
                                    >
                                        <i className="ri-download-line mr-1" />CSV template
                                    </a>
                                    <label className={`btn btn-outline whitespace-nowrap ${bulkUploading ? 'pointer-events-none opacity-60' : 'cursor-pointer'}`}>
                                        <i className="ri-upload-2-line mr-1" />{bulkUploading ? 'Uploading…' : 'Bulk upload CSV'}
                                        <input
                                            accept=".csv,text/csv"
                                            className="sr-only"
                                            disabled={bulkUploading}
                                            onChange={uploadItems}
                                            ref={bulkUploadInput}
                                            type="file"
                                        />
                                    </label>
                                </>
                            )}
                            
                        </div>
                    </div>
                    {kind === 'items' && (
                        <>
                            <p className="mx-5 mb-4 mt-4 rounded-lg bg-primary/[0.05] px-3 py-2.5 text-xs text-black/55 dark:text-white/55 sm:mx-6">
                                Import a CSV up to 10 MB. Required columns: item_name, category_name, and unit; price, barcode, and item_image are optional. Category names must match an existing category.
                            </p>
                            {bulkUploadResult && (
                                <div className={`mb-4 rounded-lg border p-4 text-sm ${bulkUploadResult.failed_count ? 'border-warning/30 bg-warning/5 text-black dark:text-white' : 'border-success/30 bg-success/5 text-black dark:text-white'}`} role="status">
                                    <p className="font-semibold">
                                        Imported {bulkUploadResult.imported_count} item{bulkUploadResult.imported_count === 1 ? '' : 's'}; failed {bulkUploadResult.failed_count}.
                                    </p>
                                    {bulkUploadResult.errors.length > 0 && (
                                        <ul className="mt-2 space-y-1 text-xs text-danger">
                                            {bulkUploadResult.errors.map((rowError) => (
                                                <li key={rowError.row}>
                                                    Row {rowError.row}: {Object.entries(rowError.errors || {})
                                                        .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
                                                        .join('; ')}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                    <div className={`overflow-x-auto ${isCatalogPage ? 'px-4 pb-4 sm:px-6 sm:pb-6' : ''}`}>
                        <table className={`w-full min-w-[560px] ${isCatalogPage ? 'border-separate border-spacing-y-1' : ''}`}>
                            <thead className={isCatalogPage ? 'text-left text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/40' : 'bg-primary/10'}>
                                <tr>
                                    {config.columns.map((column) => <th className={isCatalogPage ? 'px-3 py-3 text-left' : 'th text-left'} key={column.name}>{column.label}</th>)}
                                    <th className={isCatalogPage ? 'px-3 py-3 text-right' : 'th text-right'}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRecords.map((record) => (
                                    <tr className={isCatalogPage ? 'group bg-black/[0.015] transition hover:bg-primary/[0.04] dark:bg-white/[0.025] dark:hover:bg-primary/[0.08]' : 'border-b border-black/5 dark:border-white/5'} key={record.id}>
                                        {config.columns.map((column) => (
                                            <td className={`${isCatalogPage ? 'px-3 py-3.5 text-sm text-black dark:text-white first:rounded-l-lg last:rounded-r-lg' : 'p-4 text-sm text-black dark:text-white'}`} key={column.name}>
                                                {kind === 'categories' && column.name === 'category_name' ? (
                                                    <div className="flex items-center gap-3">
                                                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                            <i className="ri-price-tag-3-line" />
                                                        </span>
                                                        <span className="font-semibold">{record.category_name}</span>
                                                    </div>
                                                ) : kind === 'categories' && column.name === 'items_count' ? (
                                                    <span className="inline-flex min-w-20 items-center justify-center gap-1.5 rounded-full bg-primary/[0.08] px-3 py-1.5 text-xs font-bold text-primary">
                                                        {record.items_count ?? 0}<span className="font-medium">{Number(record.items_count ?? 0) === 1 ? 'product' : 'products'}</span>
                                                    </span>
                                                ) : kind === 'items' && column.name === 'price' ? (
                                                    <span className="font-semibold">Rs. {Number(record.price ?? 0).toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                                ) : kind === 'items' && column.name === 'barcode' ? (
                                                    record.barcode
                                                        ? <span className="inline-flex items-center gap-1 rounded-md bg-black/[0.04] px-2 py-1 font-mono text-xs dark:bg-white/5"><i className="ri-barcode-line text-primary" />{record.barcode}</span>
                                                        : <span className="text-xs text-black/35 dark:text-white/35">Not set</span>
                                                ) : (
                                                    column.value ? column.value(record) : record[column.name] || '—'
                                                )}
                                            </td>
                                        ))}
                                        <td className={`${isCatalogPage ? 'rounded-r-lg px-3 py-3 text-right' : 'p-4'}`}>
                                            <div className="flex justify-end gap-2">
                                                <button className={`btn btn-outline btn-sm ${isCatalogPage ? 'h-8 rounded-lg px-2.5' : ''}`} onClick={() => startEdit(record)} type="button">
                                                    <i className="ri-edit-line sm:mr-1" /><span className="hidden sm:inline">Edit</span>
                                                </button>
                                                {(kind !== 'customers' || userType !== 'staff') && (
                                                    <button className={`btn btn-outline btn-sm text-danger ${isCatalogPage ? 'h-8 rounded-lg px-2.5' : ''}`} onClick={() => remove(record)} type="button">
                                                        <i className="ri-delete-bin-line sm:mr-1" /><span className="hidden sm:inline">Delete</span>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {!loading && !filteredRecords.length && (
                                    <tr><td className="p-8 text-center text-sm text-black/50 dark:text-white/50" colSpan={config.columns.length + 1}>
                                        {search ? `No ${config.title.toLowerCase()} match “${search}”.` : `No ${config.title.toLowerCase()} yet. Add your first ${config.singular.toLowerCase()} to get started.`}
                                    </td></tr>
                                )}
                                {loading && (
                                    <tr><td className="p-8 text-center text-sm text-black/50 dark:text-white/50" colSpan={config.columns.length + 1}>Loading…</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                <form className={isCatalogPage ? 'overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm dark:border-white/10 dark:bg-gray' : 'box !p-5'} onSubmit={submit}>
                    <div className={isCatalogPage ? 'border-b border-black/5 p-5 dark:border-white/10' : 'mb-4'}>
                        <div className="flex items-center gap-3">
                            {isCatalogPage && (
                                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${editing ? 'bg-warning/10 text-warning' : 'bg-primary/10 text-primary'}`}>
                                    <i className={`${editing ? 'ri-edit-line' : 'ri-add-line'} text-xl`} />
                                </span>
                            )}
                            <div>
                                <h5 className="font-bold text-black dark:text-white">{editing ? `Edit ${config.singular}` : `Add ${config.singular}`}</h5>
                                {isCatalogPage && (
                                    <p className="mt-1 text-xs text-black/50 dark:text-white/50">
                                        {editing ? `Update the ${config.singular.toLowerCase()} details below.` : `Add details to create a new ${config.singular.toLowerCase()}.`}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className={isCatalogPage ? 'space-y-4 p-5' : 'space-y-4'}>
                    <div className="space-y-4">
                        {config.fields.map((field) => (
                            <div key={field.name}>
                                <label className="form-label" htmlFor={`${kind}-${field.name}`}>
                                    {field.label}{field.required && !(field.editOptional && editing) ? ' *' : ''}
                                </label>
                                {field.type === 'textarea' ? (
                                    <textarea
                                        className="form-input"
                                        id={`${kind}-${field.name}`}
                                        rows="3"
                                        value={values[field.name] ?? ''}
                                        onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
                                    />
                                ) : field.type === 'image' ? (
                                    <div>
                                        <input
                                            accept="image/jpeg,image/png,image/webp"
                                            className="form-input file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary"
                                            id={`${kind}-${field.name}`}
                                            onChange={(event) => {
                                                const file = event.target.files?.[0] ?? null;
                                                if (file && file.size > 5 * 1024 * 1024) {
                                                    setError('Choose an image smaller than 5 MB.');
                                                    event.target.value = '';
                                                    return;
                                                }
                                                setError('');
                                                setSelectedImage(file);
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onload = () => setSelectedImagePreview(
                                                        typeof reader.result === 'string' ? reader.result : '',
                                                    );
                                                    reader.onerror = () => setError('Could not preview the selected image.');
                                                    reader.readAsDataURL(file);
                                                } else {
                                                    setSelectedImagePreview('');
                                                }
                                            }}
                                            type="file"
                                        />
                                        <p className="mt-1 text-xs text-black/45 dark:text-white/45">JPG, PNG, or WebP. Maximum file size: 5 MB.</p>
                                        {(selectedImage || values.item_image) && (
                                            <img
                                                alt="Item preview"
                                                className="mt-3 h-24 w-24 rounded-lg border border-black/10 object-cover dark:border-white/10"
                                                src={selectedImagePreview || getAssetUrl(values.item_image)}
                                            />
                                        )}
                                    </div>
                                ) : field.type === 'category' ? (
                                    <select
                                        className="form-input"
                                        id={`${kind}-${field.name}`}
                                        required={field.required}
                                        value={values[field.name] ?? ''}
                                        onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
                                    >
                                        <option value="">Choose category</option>
                                        {categories.map((category) => <option key={category.id} value={category.id}>{category.category_name}</option>)}
                                    </select>
                                ) : field.type === 'select' ? (
                                    <select
                                        className="form-input"
                                        id={`${kind}-${field.name}`}
                                        required={field.required}
                                        value={values[field.name] ?? ''}
                                        onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
                                    >
                                        <option value="">Choose {field.label.toLowerCase()}</option>
                                        {field.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                                    </select>
                                ) : (
                                    <input
                                        className="form-input"
                                        id={`${kind}-${field.name}`}
                                        type={field.type ?? 'text'}
                                        min={field.min}
                                        minLength={field.minLength}
                                        step={field.step}
                                        placeholder={field.placeholder}
                                        required={field.required && !(field.editOptional && editing)}
                                        value={values[field.name] ?? ''}
                                        onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className={`${isCatalogPage ? 'mt-2 border-t border-black/5 pt-4 dark:border-white/10' : 'mt-6'} flex gap-2`}>
                        <button className="btn btn-primary flex-1 justify-center" disabled={saving} type="submit">
                            {saving ? 'Saving…' : editing ? 'Save changes' : 'Create'}
                        </button>
                        {editing && <button className="btn btn-outline" onClick={startCreate} type="button">Cancel</button>}
                    </div>
                    </div>
                </form>
            </div>
            {isCatalogPage && pendingDelete && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
                    onClick={(event) => {
                        if (event.target === event.currentTarget && !deleting) setPendingDelete(null);
                    }}
                >
                    <section
                        aria-labelledby="catalog-delete-title"
                        aria-modal="true"
                        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray"
                        role="dialog"
                    >
                        <div className="flex items-start gap-4">
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-danger/10 text-danger">
                                <i className="ri-delete-bin-line text-xl" />
                            </span>
                            <div>
                                <h2 className="text-lg font-bold text-black dark:text-white" id="catalog-delete-title">
                                    Delete {config.singular.toLowerCase()}?
                                </h2>
                                <p className="mt-2 text-sm leading-6 text-black/60 dark:text-white/60">
                                    Are you sure you want to delete <strong className="text-black dark:text-white">
                                        {pendingDelete.item_name ?? pendingDelete.category_name}
                                    </strong>? This action cannot be undone.
                                </p>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                className="btn btn-outline"
                                disabled={deleting}
                                onClick={() => setPendingDelete(null)}
                                type="button"
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-danger"
                                disabled={deleting}
                                onClick={() => confirmRemove(pendingDelete)}
                                type="button"
                            >
                                {deleting ? 'Deleting…' : 'Delete'}
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}

export default MartMasterData;
