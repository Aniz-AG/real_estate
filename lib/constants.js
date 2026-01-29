export const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const PROPERTY_TYPES = ['apartment', 'house', 'villa'];
export const USAGE_TYPES = ['rent', 'sale'];
export const PROPERTY_STATUS = ['available', 'sold', 'rented'];

export const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(price);
};

export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};
