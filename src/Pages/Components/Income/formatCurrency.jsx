export const formatCurrency = (amount, currencyCode = localStorage.getItem('currency') || 'INR') => {
  // Currency formatting options and approximate exchange rates (INR to target currency)
  const currencyOptions = {
    INR: { locale: 'en-IN', currency: 'INR', symbol: '₹', rate: 1 },        
    USD: { locale: 'en-US', currency: 'USD', symbol: '$', rate: 0.011 },   
    EUR: { locale: 'en-GB', currency: 'EUR', symbol: '€', rate: 0.011 },    
    GBP: { locale: 'en-GB', currency: 'GBP', symbol: '£', rate: 0.0091 },  
  };

  // Get formatting options, default to INR if currencyCode not found
  const options = currencyOptions[currencyCode.toUpperCase()] || currencyOptions.INR;

  // Return default formatted string if amount is invalid
  if (amount === undefined || amount === null || isNaN(amount)) {
    return `${options.symbol}0.0`;
  }

  // Convert amount from INR to target currency
  const numericAmount = Number(amount);
  const convertedAmount = numericAmount * options.rate;
  

  // Format large numbers based on currency
  if (options.currency === 'INR') {
    if (convertedAmount >= 10000000) { // 1 crore = 10,000,000
      return `${options.symbol}${(convertedAmount / 10000000).toFixed(1)} Cr`;
    } else if (convertedAmount >= 1000000) { // 10 lakhs = 1,000,000
      return `${options.symbol}${(convertedAmount / 1000000).toFixed(1)} M`;
    } else if (convertedAmount >= 100000) { // 1 lakh = 100,000
      return `${options.symbol}${(convertedAmount / 100000).toFixed(1)} L`;
    } else if (convertedAmount >= 10000 && convertedAmount < 100000) { // 10K to 100K
      return `${options.symbol}${(convertedAmount / 1000).toFixed(1)} K`;
    }
  } else {
    if (convertedAmount >= 1000000) { // 1 million = 1,000,000 in target currency
      return `${options.symbol}${(convertedAmount / 1000000).toFixed(1)} M`;
    } else if (convertedAmount >= 10000 && convertedAmount < 100000) { // 10K to 100K
      return `${options.symbol}${(convertedAmount / 1000).toFixed(1)} K`;
    }
  }

  // Standard formatting for smaller amounts
  return convertedAmount.toLocaleString(options.locale, {
    style: 'currency',
    currency: options.currency,
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
};