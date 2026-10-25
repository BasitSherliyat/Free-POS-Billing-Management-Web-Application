// Initialize Choices.js
const singleSelect = new Choices('#choices-single', {
    searchEnabled: true,
    itemSelectText: '',
});

const multipleSelect = new Choices('#choices-multiple', {
    removeItemButton: true,
    searchEnabled: true,
});

const groupSelect = new Choices('#choices-groups', {
    searchEnabled: true,
});

// Initialize Flatpickr
flatpickr('#date-picker', {
    dateFormat: 'Y-m-d',
});

flatpickr('#date-range', {
    mode: 'range',
    dateFormat: 'Y-m-d',
});

flatpickr('#time-picker', {
    enableTime: true,
    noCalendar: true,
    dateFormat: 'H:i',
    time_24hr: true
});

flatpickr('#datetime-picker', {
    enableTime: true,
    dateFormat: 'Y-m-d H:i',
});

// Range Slider Updates
document.getElementById('basic-range').addEventListener('input', function () {
    document.getElementById('basic-range-value').textContent = this.value;
});

document.getElementById('price-range').addEventListener('input', function () {
    document.getElementById('price-value').textContent = this.value;
});

// Color Picker Sync
document.getElementById('color-primary').addEventListener('input', function () {
    document.getElementById('color-primary-hex').value = this.value;
});

document.getElementById('color-primary-hex').addEventListener('input', function () {
    document.getElementById('color-primary').value = this.value;
});

// Tags Input
document.getElementById('tag-input').addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && this.value.trim()) {
        e.preventDefault();
        const tag = document.createElement('span');
        tag.className = 'inline-flex items-center gap-1 px-3 py-1 bg-info/10 text-info rounded-full text-sm';
        tag.innerHTML = `${this.value.trim()} <button class="hover:text-danger" onclick="this.parentElement.remove()"><i class="ri-close-line"></i></button>`;
        this.parentElement.insertBefore(tag, this);
        this.value = '';
    }
});

// Character Counter
document.getElementById('bio-textarea').addEventListener('input', function () {
    document.getElementById('char-count').textContent = this.value.length;
});

// Drag & Drop
const dropzone = document.getElementById('dropzone');

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, () => {
        dropzone.classList.add('border-primary', 'bg-primary/10');
    }, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, () => {
        dropzone.classList.remove('border-primary', 'bg-primary/10');
    }, false);
});