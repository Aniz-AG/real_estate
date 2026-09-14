export const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const PROPERTY_TYPES = ['apartment', 'house', 'villa'];
export const USAGE_TYPES = ['rent', 'sale', 'lease'];
export const PROPERTY_STATUS = ['available', 'sold', 'rented', 'leased'];

export const PRICE_UNITS = [
    { value: 'sqft', label: 'Sq. Ft.' },
    { value: 'sqyd', label: 'Sq. Yd.' },
    { value: 'sqm', label: 'Sq. M.' },
    { value: 'acre', label: 'Acre' },
    { value: 'katha', label: 'Katha' },
    { value: 'bigha', label: 'Bigha' },
    { value: 'marla', label: 'Marla' },
    { value: 'cent', label: 'Cent' },
];

export const PRICE_UNIT_LABELS = PRICE_UNITS.reduce((acc, unit) => {
    acc[unit.value] = unit.label;
    return acc;
}, {});

export const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(price);
};

// Short form used on cards/marketing surfaces, e.g. "₹85.00 Lac"
export const formatPriceShort = (price) => {
    if (!Number.isFinite(price)) return 'Price on request';
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} Lac`;
    return `₹${price.toLocaleString('en-IN')}`;
};

// Auto-derives a range display ("₹19.00 Lac - ₹25.00 Lac") when price_max is
// set and higher than price, otherwise just the single formatted price.
// Callers should prefer an explicit price_text override when present.
export const formatPriceDisplay = (price, priceMax) => {
    if (priceMax && priceMax > price) {
        return `${formatPriceShort(price)} - ${formatPriceShort(priceMax)}`;
    }
    return formatPriceShort(price);
};

export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};
