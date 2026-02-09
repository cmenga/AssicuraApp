export function getDaysUntilExpiry (expiry: any) {
    const today: Date = new Date();
    const expiryDate: Date = new Date(expiry);
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};