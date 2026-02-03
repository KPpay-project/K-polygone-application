export const calculatePercentage = (amount: number, percentage: number): number => {
    return (amount * percentage) / 100;
};

export const addInterest = (amount: number, rate: number): number => {
    return amount + calculatePercentage(amount, rate);
};
