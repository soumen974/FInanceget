
export const formatCurrency = (amount) => {
  return amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' ,minimumFractionDigits: 1,
    maximumFractionDigits: 1,});
};