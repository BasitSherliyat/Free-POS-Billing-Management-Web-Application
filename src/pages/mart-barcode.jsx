import React, { useEffect, useMemo, useState } from 'react';
import Breadcrumb from '../component/Breadcrumb';
import { generateOneDimensionalBarcode, listResource } from '../services/martBillingApi';

function barcodeValue(item) {
    return String(item.barcode || item.id);
}

export default function MartBarcode() {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [itemPickerOpen, setItemPickerOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [draftSelectedIds, setDraftSelectedIds] = useState([]);
    const [itemQuantities, setItemQuantities] = useState({});
    const [barcodes, setBarcodes] = useState([]);
    const [rollWidth, setRollWidth] = useState('4');
    const [rollHeight, setRollHeight] = useState('1');
    const [labelsPerRow, setLabelsPerRow] = useState('2');
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        let active = true;
        Promise.all([listResource('items'), listResource('categories')])
            .then(([loadedItems, loadedCategories]) => {
                if (active) {
                    setItems(loadedItems);
                    setCategories(loadedCategories);
                }
            })
            .catch((loadError) => {
                if (active) setError(loadError.message || 'Unable to load items.');
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, []);

    const filteredItems = useMemo(() => {
        const query = search.trim().toLowerCase();
        return items.filter((item) => {
            const categoryId = item.category_id ?? item.category?.id;
            const matchesCategory = !categoryFilter || String(categoryId) === categoryFilter;
            const matchesSearch = !query
                || `${item.item_name} ${item.barcode ?? ''} ${item.id}`.toLowerCase().includes(query);
            return matchesCategory && matchesSearch;
        });
    }, [categoryFilter, items, search]);

    function toggleItem(itemId) {
        setBarcodes([]);
        if (selectedIds.includes(itemId)) {
            setSelectedIds((current) => current.filter((id) => id !== itemId));
            return;
        }
        setItemQuantities((current) => ({ ...current, [itemId]: current[itemId] ?? '1' }));
        setSelectedIds((current) => [...current, itemId]);
    }

    function toggleVisibleItems() {
        const visibleIds = filteredItems.map((item) => item.id);
        const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => draftSelectedIds.includes(id));
        if (allVisibleSelected) {
            setDraftSelectedIds((current) => current.filter((id) => !visibleIds.includes(id)));
            return;
        }
        setItemQuantities((current) => ({
            ...current,
            ...Object.fromEntries(visibleIds.map((id) => [id, current[id] ?? '1'])),
        }));
        setDraftSelectedIds((current) => [...new Set([...current, ...visibleIds])]);
    }

    function toggleDraftItem(itemId) {
        if (draftSelectedIds.includes(itemId)) {
            setDraftSelectedIds((current) => current.filter((id) => id !== itemId));
            return;
        }
        setItemQuantities((current) => ({ ...current, [itemId]: current[itemId] ?? '1' }));
        setDraftSelectedIds((current) => [...current, itemId]);
    }

    function openItemPicker() {
        setDraftSelectedIds(selectedIds);
        setItemPickerOpen(true);
    }

    function confirmItemSelection() {
        const selectionChanged = selectedIds.length !== draftSelectedIds.length
            || selectedIds.some((id) => !draftSelectedIds.includes(id));
        if (selectionChanged) setBarcodes([]);
        setSelectedIds(draftSelectedIds);
        setItemPickerOpen(false);
    }

    async function generateSelected() {
        const selectedItems = items.filter((item) => selectedIds.includes(item.id));
        if (!selectedItems.length) {
            setError('Select at least one item to generate barcodes.');
            return;
        }
        const invalidQuantity = selectedItems.find((item) => {
            const quantity = Number(itemQuantities[item.id] ?? 1);
            return !Number.isInteger(quantity) || quantity < 1 || quantity > 999;
        });
        if (invalidQuantity) {
            setError(`Enter a whole number from 1 to 999 for ${invalidQuantity.item_name}.`);
            return;
        }

        setGenerating(true);
        setError('');
        setBarcodes([]);
        try {
            const generated = [];
            for (const item of selectedItems) {
                try {
                    const barcode = await generateOneDimensionalBarcode(barcodeValue(item));
                    const quantity = Number(itemQuantities[item.id] ?? 1);
                    for (let copy = 0; copy < quantity; copy += 1) {
                        generated.push({
                            itemId: item.id,
                            copy,
                            itemName: item.item_name,
                            price: Number(item.price ?? 0),
                            svg: barcode.svg_raw,
                        });
                    }
                } catch (generationError) {
                    throw new Error(`Unable to generate a barcode for ${item.item_name}: ${generationError.message}`);
                }
            }
            setBarcodes(generated);
        } catch (generationError) {
            setError(generationError.message || 'Unable to generate the selected barcodes.');
        } finally {
            setGenerating(false);
        }
    }

    const allVisibleSelected = filteredItems.length > 0
        && filteredItems.every((item) => draftSelectedIds.includes(item.id));
    const selectedItems = items.filter((item) => selectedIds.includes(item.id));
    const totalLabels = selectedIds.reduce(
        (total, itemId) => total + (Number(itemQuantities[itemId]) || 0),
        0,
    );
    const printWidth = Number(rollWidth);
    const printHeight = Number(rollHeight);
    const printLabelsPerRow = Number(labelsPerRow);
    const validPrintSize = Number.isFinite(printWidth)
        && printWidth >= 0.5
        && Number.isFinite(printHeight)
        && printHeight >= 0.5;
    const labelWidth = validPrintSize ? printWidth / printLabelsPerRow : 0;
    const barcodeRows = [];
    for (let index = 0; index < barcodes.length; index += printLabelsPerRow) {
        barcodeRows.push(barcodes.slice(index, index + printLabelsPerRow));
    }

    return (
        <div className="p-6">
            <Breadcrumb
                title="Barcode generation"
                category="Mart management"
                description="Select products, customize the label roll size, and print Code 128 barcodes."
            />

            {error && (
                <div className="mb-5 rounded-lg border border-danger/30 bg-danger/5 p-4 text-sm text-danger" role="alert">
                    {error}
                </div>
            )}

            {itemPickerOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
                    onClick={(event) => {
                        if (event.target === event.currentTarget) setItemPickerOpen(false);
                    }}
                >
                    <section
                        aria-labelledby="barcode-item-picker-title"
                        aria-modal="true"
                        className="box flex h-[80vh] max-h-[90vh] w-full max-w-2xl flex-col !p-5"
                        role="dialog"
                    >
                        <div className="mb-4 flex items-start justify-between gap-4">
                            <div>
                                <h5 className="font-bold text-black dark:text-white" id="barcode-item-picker-title">Select items</h5>
                                <p className="mt-1 text-xs text-black/50 dark:text-white/50">
                                    {draftSelectedIds.length} selected · Set print quantities after selection.
                                </p>
                            </div>
                            <button
                                aria-label="Close item selection"
                                className="text-xl text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white"
                                onClick={() => setItemPickerOpen(false)}
                                type="button"
                            >
                                <i className="ri-close-line" />
                            </button>
                        </div>
                        <div className="mb-4 grid gap-2 sm:grid-cols-2">
                            <input
                                aria-label="Search items"
                                className="form-input"
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search items or barcode"
                                type="search"
                                value={search}
                            />
                            <select
                                aria-label="Filter items by category"
                                className="form-input"
                                onChange={(event) => setCategoryFilter(event.target.value)}
                                value={categoryFilter}
                            >
                                <option value="">All categories</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>{category.category_name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3 flex items-center gap-2 border-b border-black/5 pb-3 text-sm dark:border-white/10">
                            <input
                                aria-label="Select all visible items"
                                checked={allVisibleSelected}
                                className="form-checkbox"
                                onChange={toggleVisibleItems}
                                type="checkbox"
                            />
                            <span>Select all visible items</span>
                        </div>
                        <div className="min-h-0 flex-1 overflow-y-auto">
                            {filteredItems.map((item) => (
                                <label className="flex cursor-pointer items-center gap-3 border-b border-black/5 py-3 text-sm last:border-0 dark:border-white/10" key={item.id}>
                                    <input
                                        aria-label={`Select ${item.item_name}`}
                                        checked={draftSelectedIds.includes(item.id)}
                                        className="form-checkbox"
                                        onChange={() => toggleDraftItem(item.id)}
                                        type="checkbox"
                                    />
                                    <span className="min-w-0 flex-1">
                                        <span className="block truncate font-medium text-black dark:text-white">{item.item_name}</span>
                                        <span className="block truncate text-xs text-black/50 dark:text-white/50">
                                            {item.barcode ? `Barcode: ${item.barcode}` : `Barcode not assigned · using item ID ${item.id}`}
                                        </span>
                                    </span>
                                </label>
                            ))}
                            {!loading && filteredItems.length === 0 && (
                                <p className="py-8 text-center text-sm text-black/50 dark:text-white/50">No items found.</p>
                            )}
                            {loading && <p className="py-8 text-center text-sm text-black/50 dark:text-white/50">Loading items…</p>}
                        </div>
                        <div className="mt-4 flex justify-end gap-2 border-t border-black/5 pt-4 dark:border-white/10">
                            <button className="btn btn-primary" onClick={confirmItemSelection} type="button">
                                Done · {draftSelectedIds.length} selected
                            </button>
                        </div>
                    </section>
                </div>
            )}

            <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)]">
                <div className="space-y-6">
                    <section className="box !p-5">
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h5 className="font-bold text-black dark:text-white">Barcode items</h5>
                                <p className="mt-1 text-xs text-black/50 dark:text-white/50">
                                    {selectedIds.length} items selected · {totalLabels} labels
                                </p>
                            </div>
                            <button className="btn btn-outline" onClick={openItemPicker} type="button">
                                <i className="ri-add-line mr-1" />{selectedIds.length ? 'Edit selected items' : 'Select items'}
                            </button>
                        </div>
                        {selectedItems.length ? (
                            <div className="max-h-[22rem] overflow-y-auto">
                                {selectedItems.map((item) => (
                                    <div className="flex items-center gap-3 border-b border-black/5 py-3 text-sm last:border-0 dark:border-white/10" key={item.id}>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate font-medium text-black dark:text-white">{item.item_name}</p>
                                            <p className="truncate text-xs text-black/50 dark:text-white/50">
                                                {item.barcode ? `Barcode: ${item.barcode}` : `Using item ID ${item.id}`}
                                            </p>
                                        </div>
                                        <label className="w-24 shrink-0 text-xs text-black/50 dark:text-white/50">
                                            Print qty
                                            <input
                                                aria-label={`Print quantity for ${item.item_name}`}
                                                className="form-input mt-1 w-full"
                                                max="999"
                                                min="1"
                                                onChange={(event) => {
                                                    setBarcodes([]);
                                                    setItemQuantities((current) => ({
                                                        ...current,
                                                        [item.id]: event.target.value,
                                                    }));
                                                }}
                                                type="number"
                                                value={itemQuantities[item.id] ?? '1'}
                                            />
                                        </label>
                                        <button
                                            aria-label={`Remove ${item.item_name}`}
                                            className="text-lg text-black/40 hover:text-danger"
                                            onClick={() => toggleItem(item.id)}
                                            type="button"
                                        >
                                            <i className="ri-delete-bin-line" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-lg border border-dashed border-black/10 p-6 text-center text-sm text-black/50 dark:border-white/10 dark:text-white/50">
                                Choose items to set their print quantities and generate barcode labels.
                            </div>
                        )}
                    <button
                        className="btn btn-primary mt-4 w-full justify-center"
                        disabled={generating || loading || selectedIds.length === 0}
                        onClick={generateSelected}
                        type="button"
                    >
                        <i className="ri-barcode-line mr-1" />
                        {generating ? 'Generating barcodes…' : `Generate ${totalLabels || ''} label${totalLabels === 1 ? '' : 's'}`}
                    </button>
                    </section>

                    <section className="box !p-5">
                        <h5 className="font-bold text-black dark:text-white">Sticker size setup</h5>
                        <p className="mb-4 mt-1 text-xs text-black/50 dark:text-white/50">
                            Configure the roll dimensions and number of stickers printed across each row.
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                            <label className="text-xs font-medium text-black/70 dark:text-white/70" htmlFor="barcode-roll-width">
                                Roll width (in)
                                <input
                                    className="form-input mt-1 w-full"
                                    id="barcode-roll-width"
                                    min="0.5"
                                    onChange={(event) => setRollWidth(event.target.value)}
                                    required
                                    step="0.1"
                                    type="number"
                                    value={rollWidth}
                                />
                            </label>
                            <label className="text-xs font-medium text-black/70 dark:text-white/70" htmlFor="barcode-roll-height">
                                Roll height (in)
                                <input
                                    className="form-input mt-1 w-full"
                                    id="barcode-roll-height"
                                    min="0.5"
                                    onChange={(event) => setRollHeight(event.target.value)}
                                    required
                                    step="0.1"
                                    type="number"
                                    value={rollHeight}
                                />
                            </label>
                            <label className="text-xs font-medium text-black/70 dark:text-white/70" htmlFor="barcode-labels-per-row">
                                Labels per row
                                <select
                                    className="form-input mt-1 w-full"
                                    id="barcode-labels-per-row"
                                    onChange={(event) => setLabelsPerRow(event.target.value)}
                                    value={labelsPerRow}
                                >
                                    {[1, 2, 3, 4].map((count) => <option key={count} value={count}>{count}</option>)}
                                </select>
                            </label>
                        </div>
                        <p className="mt-3 text-xs text-black/50 dark:text-white/50">
                            Each sticker: {validPrintSize ? `${labelWidth.toFixed(2)} × ${printHeight.toFixed(2)}` : '—'} in
                        </p>
                    </section>
                </div>

                <section className="box !p-5" aria-live="polite">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h5 className="font-bold text-black dark:text-white">Label preview</h5>
                            <p className="mt-1 text-xs text-black/50 dark:text-white/50">
                                {barcodes.length} labels · Roll: {validPrintSize ? `${printWidth} × ${printHeight}` : 'Invalid size'} in · {printLabelsPerRow} per row
                            </p>
                        </div>
                        {barcodes.length > 0 && (
                            <button className="btn btn-primary btn-sm" disabled={!validPrintSize} onClick={() => window.print()} type="button">
                                <i className="ri-printer-line mr-1" />Print labels
                            </button>
                        )}
                    </div>
                    {barcodes.length > 0 ? (
                        <div className="barcode-print-root" aria-label="Generated barcode labels">
                            {barcodeRows.map((row, rowIndex) => (
                                <div className="barcode-label-sheet" key={`barcode-row-${rowIndex}`}>
                                    {row.map((barcode) => (
                                        <div className="barcode-label" key={`${barcode.itemId}-${barcode.copy}`}>
                                            <span className="barcode-label-mart">Mart Billing</span>
                                            <span className="barcode-label-name">{barcode.itemName}</span>
                                            <img alt={`Code 128 barcode for ${barcode.itemName}`} src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(barcode.svg)}`} />
                                            {/* <span className="barcode-label-value">{barcode.value}</span> */}
                                            <span className="barcode-label-price">Rs. {barcode.price.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex min-h-[16rem] flex-col items-center justify-center rounded-lg border border-dashed border-black/10 p-6 text-center dark:border-white/10">
                            <i className="ri-barcode-line mb-3 text-4xl text-black/25 dark:text-white/25" />
                            <p className="text-sm text-black/50 dark:text-white/50">Select items and generate barcodes to preview the roll layout.</p>
                        </div>
                    )}
                </section>
            </div>
            <style>{`
                .barcode-print-root {
                    width: ${validPrintSize ? `${printWidth}in` : '100%'};
                    height: 16rem;
                    overflow: auto;
                    background: white;
                    color: black;
                }
                .barcode-label-sheet {
                    display: flex;
                    width: ${validPrintSize ? `${printWidth}in` : '100%'};
                    height: ${validPrintSize ? `${printHeight}in` : 'auto'};
                    overflow: hidden;
                    background: white;
                }
                .barcode-label {
                    display: flex;
                    min-width: 0;
                    width: ${validPrintSize ? `${labelWidth}in` : `${100 / printLabelsPerRow}%`};
                    height: ${validPrintSize ? `${printHeight}in` : 'auto'};
                    flex: 0 0 ${validPrintSize ? `${labelWidth}in` : `${100 / printLabelsPerRow}%`};
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 0.025in;
                    overflow: hidden;
                    padding: 0.04in 0.08in;
                    text-align: center;
                }
                .barcode-label-mart, .barcode-label-name, .barcode-label-value, .barcode-label-price {
                    max-width: 100%;
                    overflow: hidden;
                    font-size: 7pt;
                    line-height: 1.1;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .barcode-label-mart, .barcode-label-price {
                    font-weight: 700;
                }
                .barcode-label img {
                    display: block;
                    width: 100%;
                    max-height: ${validPrintSize ? `${Math.max(0.1, printHeight * 0.42)}in` : '45%'};
                    object-fit: contain;
                }
                @media print {
                    @page { size: ${validPrintSize ? `${printWidth}in ${printHeight}in` : '4in 1in'}; margin: 0; }
                    body * { visibility: hidden !important; }
                    .barcode-print-root, .barcode-print-root * { visibility: visible !important; }
                    .barcode-print-root {
                        position: absolute;
                        top: 0;
                        left: 0;
                        height: auto;
                        width: ${validPrintSize ? `${printWidth}in` : '4in'};
                        max-height: none;
                        overflow: visible;
                    }
                    .barcode-label {
                        width: ${validPrintSize ? `${labelWidth}in` : '2in'};
                        height: ${validPrintSize ? `${printHeight}in` : '1in'};
                        break-inside: avoid;
                    }
                    .barcode-label-sheet {
                        break-after: page;
                        page-break-after: always;
                    }
                    .barcode-label-sheet:last-child {
                        break-after: auto;
                        page-break-after: auto;
                    }
                }
            `}</style>
        </div>
    );
}
