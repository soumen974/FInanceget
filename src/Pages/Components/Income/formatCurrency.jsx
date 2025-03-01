export const formatCurrency = (amount) => {
  // Return a default formatted string if amount is undefined, null, or not a number
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0.0';
  }
  
  // Convert to number explicitly and format
  const numericAmount = Number(amount);
  return numericAmount.toLocaleString('en-IN', { 
    style: 'currency', 
    currency: 'INR',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
};