/**
 * Range Slider Initialization
 * Initializes various range sliders using noUiSlider
 */

(function () {
    'use strict';

    // Helper function to create slider
    function createSlider(selector, options, valueElement, callback) {
        const slider = document.getElementById(selector);
        if (!slider) return;

        noUiSlider.create(slider, options);

        if (valueElement) {
            slider.noUiSlider.on('update', function (values, handle) {
                const value = Math.round(values[handle]);
                if (callback) {
                    callback(value, handle);
                } else {
                    const element = document.getElementById(valueElement);
                    if (element) {
                        element.textContent = value;
                    }
                }
            });
        }

        return slider;
    }

    // Basic Single Handle Slider
    createSlider('slider-basic', {
        start: [50],
        connect: [true, false],
        range: {
            'min': 0,
            'max': 100
        }
    }, 'slider-basic-value');

    // Range Slider (Two Handles)
    const rangeSlider = document.getElementById('slider-range');
    if (rangeSlider) {
        noUiSlider.create(rangeSlider, {
            start: [20, 80],
            connect: true,
            range: {
                'min': 0,
                'max': 100
            }
        });

        rangeSlider.noUiSlider.on('update', function (values) {
            document.getElementById('slider-range-min').textContent = Math.round(values[0]);
            document.getElementById('slider-range-max').textContent = Math.round(values[1]);
        });
    }

    // Native HTML5 Range Sliders
    const nativeRange1 = document.getElementById('native-range-1');
    const nativeValue1 = document.getElementById('native-value-1');
    if (nativeRange1 && nativeValue1) {
        nativeRange1.addEventListener('input', function () {
            nativeValue1.textContent = this.value;
        });
    }

    const nativeRange2 = document.getElementById('native-range-2');
    const nativeValue2 = document.getElementById('native-value-2');
    if (nativeRange2 && nativeValue2) {
        nativeRange2.addEventListener('input', function () {
            nativeValue2.textContent = this.value;
        });
    }

    // Step Slider
    createSlider('slider-step', {
        start: [50],
        connect: [true, false],
        step: 10,
        range: {
            'min': 0,
            'max': 100
        }
    }, 'slider-step-value');

    // Custom Step Slider
    createSlider('slider-custom-step', {
        start: [25],
        connect: [true, false],
        range: {
            'min': [0, 5],
            '25%': [25, 10],
            '50%': [50, 15],
            '75%': [75, 20],
            'max': [100]
        }
    }, 'slider-custom-step-value');

    // Vertical Sliders
    createSlider('slider-vertical-1', {
        start: [70],
        connect: [true, false],
        orientation: 'vertical',
        range: {
            'min': 0,
            'max': 100
        }
    }, 'slider-vertical-1-value');

    createSlider('slider-vertical-2', {
        start: [50],
        connect: [true, false],
        orientation: 'vertical',
        range: {
            'min': 0,
            'max': 100
        }
    }, 'slider-vertical-2-value');

    createSlider('slider-vertical-3', {
        start: [60],
        connect: [true, false],
        orientation: 'vertical',
        range: {
            'min': 0,
            'max': 100
        }
    }, 'slider-vertical-3-value');

    // Color Variants
    createSlider('slider-primary', {
        start: [50],
        connect: [true, false],
        range: {
            'min': 0,
            'max': 100
        }
    }, 'slider-primary-value');

    createSlider('slider-success', {
        start: [60],
        connect: [true, false],
        range: {
            'min': 0,
            'max': 100
        }
    }, 'slider-success-value');

    createSlider('slider-warning', {
        start: [70],
        connect: [true, false],
        range: {
            'min': 0,
            'max': 100
        }
    }, 'slider-warning-value');

    createSlider('slider-danger', {
        start: [40],
        connect: [true, false],
        range: {
            'min': 0,
            'max': 100
        }
    }, 'slider-danger-value');

    // Price Range Slider
    const priceSlider = document.getElementById('slider-price');
    if (priceSlider) {
        noUiSlider.create(priceSlider, {
            start: [100, 500],
            connect: true,
            range: {
                'min': 0,
                'max': 1000
            }
        });

        priceSlider.noUiSlider.on('update', function (values) {
            document.getElementById('price-min').textContent = '$' + Math.round(values[0]);
            document.getElementById('price-max').textContent = '$' + Math.round(values[1]);
        });
    }

    // Pips Slider
    const pipsSlider = document.getElementById('slider-pips');
    if (pipsSlider) {
        noUiSlider.create(pipsSlider, {
            start: [5],
            connect: [true, false],
            range: {
                'min': 0,
                'max': 10
            },
            pips: {
                mode: 'steps',
                density: 10
            }
        });

        pipsSlider.noUiSlider.on('update', function (values) {
            document.getElementById('slider-pips-value').textContent = Math.round(values[0]);
        });
    }

    // Disabled Slider
    const disabledSlider = document.getElementById('slider-disabled');
    if (disabledSlider) {
        noUiSlider.create(disabledSlider, {
            start: [50],
            connect: [true, false],
            range: {
                'min': 0,
                'max': 100
            }
        });
        disabledSlider.setAttribute('disabled', true);
    }

    // Tooltips Slider
    createSlider('slider-tooltips', {
        start: [30, 70],
        connect: true,
        tooltips: [true, true],
        range: {
            'min': 0,
            'max': 100
        }
    });

    // Interactive Product Filter
    const filterPrice = document.getElementById('filter-price');
    if (filterPrice) {
        noUiSlider.create(filterPrice, {
            start: [0, 1000],
            connect: true,
            range: {
                'min': 0,
                'max': 1000
            }
        });

        filterPrice.noUiSlider.on('update', function (values) {
            const min = Math.round(values[0]);
            const max = Math.round(values[1]);
            document.getElementById('filter-price-min').textContent = '$' + min;
            document.getElementById('filter-price-max').textContent = '$' + max;
            document.getElementById('summary-price').textContent = '$' + min + ' - $' + max;
        });
    }

    const filterRating = document.getElementById('filter-rating');
    if (filterRating) {
        noUiSlider.create(filterRating, {
            start: [3],
            connect: [true, false],
            step: 0.5,
            range: {
                'min': 0,
                'max': 5
            }
        });

        filterRating.noUiSlider.on('update', function (values) {
            const rating = parseFloat(values[0]);
            document.getElementById('summary-rating').textContent = rating.toFixed(1) + ' ★';

            // Update star display
            const stars = document.querySelectorAll('#rating-stars i');
            stars.forEach((star, index) => {
                if (index < Math.floor(rating)) {
                    star.className = 'ri-star-fill text-warning text-xl';
                } else if (index < rating) {
                    star.className = 'ri-star-half-fill text-warning text-xl';
                } else {
                    star.className = 'ri-star-line text-black/20 dark:text-white/20 text-xl';
                }
            });
        });
    }

    const filterDistance = document.getElementById('filter-distance');
    if (filterDistance) {
        noUiSlider.create(filterDistance, {
            start: [25],
            connect: [true, false],
            range: {
                'min': 0,
                'max': 100
            }
        });

        filterDistance.noUiSlider.on('update', function (values) {
            const distance = Math.round(values[0]);
            document.getElementById('filter-distance-value').textContent = distance;
            document.getElementById('summary-distance').textContent = distance + ' km';
        });
    }

    // Apply custom styles to sliders
    const style = document.createElement('style');
    style.textContent = `
        .noUi-connect {
            background: rgb(var(--color-primary));
        }
        .noUi-handle {
            height:25px;
            width:25px;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            background: white;
            border: 2px solid rgb(var(--color-primary));
        }
        .dark .noUi-handle {
            background: rgb(31 41 55);
            border-color: rgb(var(--color-primary));
        }
        .noUi-handle:before,
        .noUi-handle:after {
            display: none;
        }
        #slider-success .noUi-connect {
            background: rgb(16 185 129);
        }
        #slider-success .noUi-handle {
            border-color: rgb(16 185 129);
        }
        #slider-warning .noUi-connect {
            background: rgb(245 158 11);
        }
        #slider-warning .noUi-handle {
            border-color: rgb(245 158 11);
        }
        #slider-danger .noUi-connect {
            background: rgb(239 68 68);
        }
        #slider-danger .noUi-handle {
            border-color: rgb(239 68 68);
        }
        .noUi-tooltip {
            background: rgb(var(--color-primary));
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
            padding: 4px 8px;
        }
        .noUi-pips-horizontal {
            padding-top: 10px;
        }
        .noUi-value {
            font-size: 11px;
            color: rgba(0, 0, 0, 0.5);
        }
        .dark .noUi-value {
            color: rgba(255, 255, 255, 0.5);
        }
        .noUi-marker-horizontal.noUi-marker-large {
            height: 10px;
        }
        .noUi-target {
            background: rgba(0, 0, 0, 0.1);
            border: none;
        }
        .dark .noUi-target {
            background: rgba(255, 255, 255, 0.1);
        }
    `;
    document.head.appendChild(style);

})();
