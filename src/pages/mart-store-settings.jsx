import React, { useEffect, useState } from 'react';
import Breadcrumb from '../component/Breadcrumb';
import { getAssetUrl, loadStoreSettings, saveStoreSettings } from '../services/martBillingApi';

export default function MartStoreSettings() {
    const [values, setValues] = useState({
        mart_name: '',
        address: '',
        contact_number: '',
        logo_path: '',
    });
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState('');
    const [removeLogo, setRemoveLogo] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');

    useEffect(() => {
        let active = true;
        loadStoreSettings()
            .then((settings) => {
                if (active) setValues({
                    mart_name: settings.mart_name ?? 'Mart Billing',
                    address: settings.address ?? '',
                    contact_number: settings.contact_number ?? '',
                    logo_path: settings.logo_path ?? '',
                });
            })
            .catch((loadError) => {
                if (active) setError(loadError.message || 'Unable to load store settings.');
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
    }, []);

    function selectLogo(event) {
        const file = event.target.files?.[0] ?? null;
        setError('');
        setNotice('');
        if (file && file.size > 5 * 1024 * 1024) {
            setError('Choose a logo smaller than 5 MB.');
            event.target.value = '';
            return;
        }

        setLogoFile(file);
        setRemoveLogo(false);
        if (!file) {
            setLogoPreview('');
            return;
        }
        const reader = new FileReader();
        reader.onload = () => setLogoPreview(typeof reader.result === 'string' ? reader.result : '');
        reader.onerror = () => setError('Could not preview the selected logo.');
        reader.readAsDataURL(file);
    }

    async function submit(event) {
        event.preventDefault();
        setSaving(true);
        setError('');
        setNotice('');
        try {
            const updated = await saveStoreSettings({
                mart_name: values.mart_name.trim(),
                address: values.address.trim(),
                contact_number: values.contact_number.trim(),
                remove_logo: removeLogo,
            }, logoFile);
            setValues({
                mart_name: updated.mart_name,
                address: updated.address ?? '',
                contact_number: updated.contact_number ?? '',
                logo_path: updated.logo_path ?? '',
            });
            setLogoFile(null);
            setLogoPreview('');
            setRemoveLogo(false);
            setNotice('Store details saved successfully.');
        } catch (saveError) {
            setError(saveError.message || 'Unable to save store settings.');
        } finally {
            setSaving(false);
        }
    }

    const currentLogo = logoPreview || (!removeLogo && values.logo_path ? getAssetUrl(values.logo_path) : '');

    return (
        <div className="p-6">
            <Breadcrumb
                category="Store management"
                description="Customize the business identity shown in navigation and on printed receipts."
                title="Store settings"
            />

            <div className="mx-auto max-w-5xl">
                <div className="mb-6 rounded-2xl border border-primary/10 bg-gradient-to-r from-primary/[0.08] via-white to-white p-6 dark:via-gray dark:to-gray sm:p-8">
                    <div className="flex flex-wrap items-center gap-4">
                        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
                            <i className="ri-store-2-line text-2xl" />
                        </span>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Business profile</p>
                            <h1 className="mt-1 text-2xl font-bold tracking-tight text-black dark:text-white">Make it yours</h1>
                            <p className="mt-1 text-sm text-black/55 dark:text-white/55">
                                Your store name, logo, address, and phone appear across the billing experience.
                            </p>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-5 flex items-start gap-3 rounded-xl border border-danger/20 bg-danger/[0.06] p-4 text-sm text-danger" role="alert">
                        <i className="ri-error-warning-line mt-0.5 text-lg" />
                        <span>{error}</span>
                        {loading && <button className="ml-auto font-semibold underline" onClick={() => window.location.reload()} type="button">Retry</button>}
                    </div>
                )}
                {notice && (
                    <div className="mb-5 flex items-center gap-2 rounded-xl border border-success/20 bg-success/[0.06] p-4 text-sm text-success" role="status">
                        <i className="ri-checkbox-circle-line text-lg" />{notice}
                    </div>
                )}

                <form className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm dark:border-white/10 dark:bg-gray" onSubmit={submit}>
                    <div className="grid lg:grid-cols-[minmax(0,1fr)_300px]">
                        <div className="space-y-5 p-5 sm:p-7">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-black dark:text-white" htmlFor="mart-name">Mart name</label>
                                <div className="relative">
                                    <i className="ri-store-2-line absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-black/35" />
                                    <input
                                        autoComplete="organization"
                                        className="form-input h-12 w-full rounded-xl pl-11"
                                        id="mart-name"
                                        maxLength={150}
                                        onChange={(event) => setValues((current) => ({ ...current, mart_name: event.target.value }))}
                                        placeholder="e.g. Green Valley Mart"
                                        required
                                        value={values.mart_name}
                                    />
                                </div>
                                <p className="mt-1.5 text-xs text-black/45 dark:text-white/45">This name is shown in the sidebar and at the top of receipts.</p>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-black dark:text-white" htmlFor="mart-address">Business address</label>
                                <div className="relative">
                                    <i className="ri-map-pin-line absolute left-3.5 top-3.5 text-lg text-black/35" />
                                    <textarea
                                        autoComplete="street-address"
                                        className="form-input min-h-28 w-full resize-y rounded-xl pl-11"
                                        id="mart-address"
                                        maxLength={2000}
                                        onChange={(event) => setValues((current) => ({ ...current, address: event.target.value }))}
                                        placeholder="Street, area, city"
                                        rows={3}
                                        value={values.address}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-black dark:text-white" htmlFor="mart-contact">Contact number</label>
                                <div className="relative">
                                    <i className="ri-phone-line absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-black/35" />
                                    <input
                                        autoComplete="tel"
                                        className="form-input h-12 w-full rounded-xl pl-11"
                                        id="mart-contact"
                                        maxLength={30}
                                        onChange={(event) => setValues((current) => ({ ...current, contact_number: event.target.value }))}
                                        placeholder="e.g. 03XX-XXXXXXX"
                                        type="tel"
                                        value={values.contact_number}
                                    />
                                </div>
                            </div>
                        </div>

                        <aside className="border-t border-black/5 bg-black/[0.015] p-5 dark:border-white/10 dark:bg-white/[0.02] sm:p-7 lg:border-l lg:border-t-0">
                            <h2 className="text-sm font-bold text-black dark:text-white">Store logo</h2>
                            <p className="mt-1 text-xs leading-5 text-black/50 dark:text-white/50">Upload a square or landscape logo for your navigation and receipts.</p>
                            <div className="mt-5 flex aspect-square max-h-56 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-black/15 bg-white p-5 dark:border-white/15 dark:bg-gray">
                                {currentLogo
                                    ? <img alt="Store logo preview" className="max-h-full max-w-full object-contain" src={currentLogo} />
                                    : <div className="text-center text-black/35 dark:text-white/35"><i className="ri-image-add-line text-4xl" /><p className="mt-2 text-xs">Logo preview</p></div>}
                            </div>
                            <label className="btn btn-outline mt-4 flex w-full cursor-pointer justify-center">
                                <i className="ri-upload-2-line mr-2" />Choose logo
                                <input accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={selectLogo} type="file" />
                            </label>
                            {values.logo_path && !removeLogo && !logoFile && (
                                <button
                                    className="mt-3 w-full text-center text-xs font-semibold text-danger hover:underline"
                                    onClick={() => {
                                        setRemoveLogo(true);
                                        setLogoPreview('');
                                    }}
                                    type="button"
                                >
                                    Remove current logo
                                </button>
                            )}
                            <p className="mt-3 text-center text-[11px] text-black/40 dark:text-white/40">JPG, PNG, WebP · up to 5 MB</p>
                        </aside>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/5 bg-white px-5 py-4 dark:border-white/10 dark:bg-gray sm:px-7">
                        <p className="text-xs text-black/45 dark:text-white/45">
                            <i className="ri-information-line mr-1" />Settings are shared across this store.
                        </p>
                        <button className="btn btn-primary min-w-40 justify-center" disabled={loading || saving} type="submit">
                            {saving ? <><i className="ri-loader-4-line mr-2 animate-spin" />Saving…</> : <><i className="ri-save-3-line mr-2" />Save changes</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
