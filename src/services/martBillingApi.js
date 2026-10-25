const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api').replace(/\/+$/, '');
const TOKEN_KEY = 'mart_billing_token';
const USER_KEY = 'mart_billing_user';
const AUTH_PATHS = new Set(['auth/login', 'auth/logout', 'auth/refresh']);
const resourceCache = new Map();
const resourceRequests = new Map();

async function sendRequest(path, options, token) {
    const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
    return fetch(`${API_BASE_URL}/${path}`, {
        ...options,
        headers: {
            Accept: 'application/json',
            ...(token && path !== 'auth/login' ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.body && !isFormData ? { 'Content-Type': 'application/json' } : {}),
            ...options.headers,
        },
    });
}

async function readResponse(response) {
    const body = await response.text();
    let payload = null;

    if (body) {
        try {
            payload = JSON.parse(body);
        } catch {
            throw new Error(`The API returned an unreadable response (${response.status}).`);
        }
    }

    return payload;
}

function clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    invalidateAllResources();
}

async function request(path, options = {}) {
    const token = localStorage.getItem(TOKEN_KEY);
    let response = await sendRequest(path, options, token);
    let payload = await readResponse(response);

    if (response.status === 401 && token && !AUTH_PATHS.has(path)) {
        try {
            const refreshResponse = await sendRequest('auth/refresh', { method: 'POST' }, token);
            const refreshPayload = await readResponse(refreshResponse);
            if (!refreshResponse.ok || !refreshPayload?.access_token) {
                throw new Error(refreshPayload?.message || 'The session refresh was rejected.');
            }
            localStorage.setItem(TOKEN_KEY, refreshPayload.access_token);
            response = await sendRequest(path, options, refreshPayload.access_token);
            payload = await readResponse(response);
        } catch (error) {
            clearSession();
            throw new Error(`Your session could not be refreshed. Please sign in again. ${error.message}`);
        }
    }

    if (!response.ok) {
        if (response.status === 401 && path !== 'auth/login') {
            clearSession();
            throw new Error('Your session has expired or you are not signed in. Please sign in again.');
        }
        const validationErrors = payload?.errors
            ? Object.values(payload.errors).flat().join(' ')
            : '';
        throw new Error(validationErrors || payload?.message || `Request failed (${response.status}).`);
    }

    return payload;
}

function collection(payload, resource) {
    const result = Array.isArray(payload) ? payload
        : Array.isArray(payload?.data) ? payload.data
            : Array.isArray(payload?.data?.data) ? payload.data.data
                : null;

    if (!result) {
        throw new Error(`The ${resource} endpoint returned an unexpected response.`);
    }

    return result;
}

async function paginatedCollection(path, label) {
    const result = [];
    let page = 1;
    let lastPage = 1;

    do {
        const payload = await request(page === 1 ? path : `${path}?page=${page}`);
        result.push(...collection(payload, label));
        lastPage = Number(payload?.last_page ?? payload?.meta?.last_page ?? page);
        page += 1;
    } while (page <= lastPage);

    return result;
}

function invalidateResources(...resourceNames) {
    resourceNames.forEach((resourceName) => {
        resourceCache.delete(resourceName);
        resourceRequests.delete(resourceName);
    });
}

function invalidateAllResources() {
    resourceCache.clear();
    resourceRequests.clear();
}

function resource(payload) {
    return payload?.data && !Array.isArray(payload.data) ? payload.data : payload;
}

export async function listResource(resourceName, { force = false } = {}) {
    if (!force && resourceCache.has(resourceName)) {
        return resourceCache.get(resourceName);
    }

    if (!force && resourceRequests.has(resourceName)) {
        return resourceRequests.get(resourceName);
    }

    const requestPromise = paginatedCollection(resourceName, resourceName)
        .then((records) => {
            resourceCache.set(resourceName, records);
            return records;
        })
        .finally(() => {
            if (resourceRequests.get(resourceName) === requestPromise) {
                resourceRequests.delete(resourceName);
            }
        });

    resourceRequests.set(resourceName, requestPromise);
    return requestPromise;
}

export async function loadMartBillingData({ force = false } = {}) {
    const [invoices, customers, items, categories, invoiceItems] = await Promise.all([
        listResource('sales-invoices', { force }),
        listResource('customers', { force }),
        listResource('items', { force }),
        listResource('categories', { force }),
        listResource('sales-invoice-items', { force }),
    ]);

    return {
        invoices,
        customers,
        items,
        categories,
        invoiceItems,
    };
}

export async function loadStoreSettings() {
    const settings = await request('store-settings');
    if (!settings || typeof settings.mart_name !== 'string') {
        throw new Error('The store settings endpoint returned an unexpected response.');
    }
    return settings;
}

export async function saveStoreSettings(values, logoFile) {
    const options = logoFile
        ? (() => {
            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) => {
                const formValue = typeof value === 'boolean' ? (value ? '1' : '0') : value ?? '';
                formData.append(key, formValue);
            });
            formData.append('logo', logoFile);
            return { method: 'POST', body: formData };
        })()
        : {
            method: 'POST',
            body: JSON.stringify(values),
        };
    const settings = await request('store-settings', options);
    if (!settings || typeof settings.mart_name !== 'string') {
        throw new Error('The store settings endpoint returned an unexpected response.');
    }
    window.dispatchEvent(new CustomEvent('mart:store-settings-updated', { detail: settings }));
    return settings;
}

export async function signIn(credentials) {
    const payload = await request('auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    });
    if (!payload?.access_token || !payload?.user?.id) {
        throw new Error('The sign-in response did not include an access token and user.');
    }
    localStorage.setItem(TOKEN_KEY, payload.access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
    invalidateAllResources();
    return payload.user;
}

export async function getCurrentUser() {
    return request('auth/me');
}

export async function generateOneDimensionalBarcode(value) {
    const payload = await request('barcode/1d', {
        method: 'POST',
        body: JSON.stringify({ value }),
    });

    if (payload?.status !== 'success'
        || payload?.type !== 'CODE128'
        || typeof payload?.value !== 'string'
        || typeof payload?.svg_raw !== 'string') {
        throw new Error('The barcode endpoint returned an unexpected response.');
    }

    return payload;
}

export async function refreshSession() {
    const payload = await request('auth/refresh', { method: 'POST' });
    if (!payload?.access_token) {
        throw new Error('The session refresh response did not include an access token.');
    }
    localStorage.setItem(TOKEN_KEY, payload.access_token);
    return payload;
}

export async function signOut() {
    try {
        await request('auth/logout', { method: 'POST' });
    } finally {
        clearSession();
    }
}

export function getSignedInUser() {
    const storedUser = localStorage.getItem(USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
}

export function getSignedInUserType() {
    return String(getSignedInUser()?.user_type ?? '').trim().toLowerCase();
}

export function hasAccessToken() {
    return Boolean(localStorage.getItem(TOKEN_KEY));
}

export async function createSalesInvoice(invoice) {
    const created = resource(await request('sales-invoices', {
        method: 'POST',
        body: JSON.stringify(invoice),
    }));
    invalidateResources('sales-invoices');
    return created;
}

export async function createSalesInvoiceItem(invoiceItem) {
    const created = resource(await request('sales-invoice-items', {
        method: 'POST',
        body: JSON.stringify(invoiceItem),
    }));
    invalidateResources('sales-invoice-items', 'sales-invoices');
    return created;
}

export async function updateSalesInvoice(invoiceId, changes) {
    const updated = resource(await request(`sales-invoices/${encodeURIComponent(invoiceId)}`, {
        method: 'PATCH',
        body: JSON.stringify(changes),
    }));
    invalidateResources('sales-invoices');
    return updated;
}

export async function loadMartDashboardData({ force = false } = {}) {
    const [categories, items, customers, users, invoices] = await Promise.all([
        listResource('categories', { force }),
        listResource('items', { force }),
        listResource('customers', { force }),
        listResource('users', { force }),
        listResource('sales-invoices', { force }),
    ]);

    return { categories, items, customers, users, invoices };
}

export async function createResource(resourceName, values) {
    const created = resource(await request(resourceName, {
        method: 'POST',
        body: JSON.stringify(values),
    }));
    invalidateResources(resourceName);
    return created;
}

export async function uploadItemImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    const response = await request('items/upload-image', {
        method: 'POST',
        body: formData,
    });
    if (!response?.item_image) {
        throw new Error('The image upload response did not include an image path.');
    }
    return response.item_image;
}

export async function bulkUploadItems(file) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await request('items/bulk-upload', {
        method: 'POST',
        body: formData,
    });
    if (!Number.isInteger(response?.imported_count)
        || !Number.isInteger(response?.failed_count)
        || !Array.isArray(response?.items)
        || !Array.isArray(response?.errors)) {
        throw new Error('The bulk upload response did not include the expected import results.');
    }
    invalidateResources('items');
    return response;
}

export function getAssetUrl(path) {
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) return path;
    const apiOrigin = API_BASE_URL.replace(/\/api\/?$/i, '');
    return `${apiOrigin}${path.startsWith('/') ? '' : '/'}${path}`;
}

export async function updateResource(resourceName, id, values) {
    const updated = resource(await request(`${resourceName}/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        body: JSON.stringify(values),
    }));
    invalidateResources(resourceName);
    return updated;
}

export async function deleteResource(resourceName, id) {
    await request(`${resourceName}/${encodeURIComponent(id)}`, { method: 'DELETE' });
    invalidateResources(resourceName);
}
