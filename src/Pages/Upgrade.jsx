import React, { useState } from 'react';
import { ChevronRight, Check, Wallet, Lock, Mail, X } from 'lucide-react';
import payme29  from "./assets/payme29qr.png";
import { authCheck } from "../Auth/Components/ProtectedCheck";
import { Link } from 'react-router-dom';

const COLORS = {
  primary: '#6366F1',    // Modern Indigo for Premium
  bgLight: '#F9FAFB',    // Light Gray for light theme
  bgDark: '#0a0a0a',     // Blackish background for dark theme
  textDark: '#1F2937',   // Dark Gray for light theme
  textLight: '#6B7280',  // Light Gray
};

const pricingPlans = [
  {
    name: "Basic",
    price: "Free",
    features: [
      "Current year tracking",
      "50/30/20 rule",
      "Basic reports",
    ],
  },
  {
    name: "Premium",
    price: "₹499",
    priceSubtext: "/year",
    discountPrice: "₹29", // Promotional discount
    features: [
      "Previous year data",
      "Custom rules",
      "Forecasting",
      "Priority support",
    ],
  },
];

const Upgrade = () => {
  const [selectedPlan, setSelectedPlan] = useState('Premium');
  const [paymentMethod] = useState('upi'); // Fixed to UPI
  const [showQrPopup, setShowQrPopup] = useState(false);
  const { name , userEmail ,userType,setIsAction,updated_at }= authCheck();
  

  const handleProceedToPayment = () => {
    console.log(`Proceeding to payment for ${selectedPlan} with ${paymentMethod}`);
    setShowQrPopup(true); // Show QR popup
  };

  const closeQrPopup = () => {
    setShowQrPopup(false);
  };

  if(userType==='premium'){
    return <div className='dark:text-white'>Enjoy your premium</div>
  }else if(userType==='admin'){
    return <div className='dark:text-white'>Admin page is activated</div>
  }

  return (
    <div className="  dark:bg-[#0a0a0a] text-[#1F2937] dark:text-white flex items-center justify-center ">
      <div className="max-w-md w-full space-y-8 mb-6">

        {/* Header */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-center tracking-tight">
            Upgrade to <span className="text-indigo-600 dark:text-indigo-400">Premium</span>
          </h1>
          <p className="text-sm text-[#6B7280] dark:text-gray-400 text-center">
            Unlock advanced tools at a special price.
          </p>
        </div>

        {/* Pricing Plans */}
        <div className="grid gap-6">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`p-6 rounded-xl bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#ffffff24] cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedPlan === plan.name ? 'border-indigo-600 dark:border-indigo-400 shadow-md' : ''
              }`}
              onClick={() => setSelectedPlan(plan.name)}
            >
              <div className="flex justify-between items-baseline mb-4">
                <span className="text-xl font-semibold">{plan.name}</span>
                <div className="text-right">
                  {plan.discountPrice ? (
                    <>
                      <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{plan.discountPrice}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-500 line-through ml-1">{plan.price}</span>
                      <span className="text-xs text-[#6B7280] dark:text-gray-400 ml-1">{plan.priceSubtext}</span>
                    </>
                  ) : (
                    <span className="text-xl font-bold">{plan.price}</span>
                  )}
                </div>
              </div>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check size={16} className="text-indigo-600 dark:text-indigo-400" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Payment Details */}
        {selectedPlan === 'Premium' && (
          <div className="p-6 rounded-xl bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#ffffff24] shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-[#6B7280] dark:text-gray-400">Plan:</span>
              <span className="text-sm font-medium">Premium (₹29, originally ₹499/year)</span>
            </div>
            <div className="flex items-center justify-between bg-gray-100 dark:bg-[#1c1c1c9a] p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Wallet size={18} className="text-indigo-600 dark:text-indigo-400" />
                <span className="text-sm">UPI Payment</span>
              </div>
              <span className="text-xs text-[#6B7280] dark:text-gray-400">Secure</span>
            </div>
          </div>
        )}

        {/* Proceed Button */}
        <button
          onClick={handleProceedToPayment}
          disabled={selectedPlan === 'Basic'}
          className={`w-full py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            selectedPlan === 'Premium'
              ? 'bg-indigo-600 text-white dark:text-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:bg-opacity-20 dark:hover:bg-opacity-20  dark:hover:bg-indigo-500 hover:shadow-md'
              : 'bg-gray-300 text-gray-500 dark:bg-[#1c1c1c9a] dark:text-gray-400 cursor-not-allowed'
          }`}
        >
          {selectedPlan === 'Premium' ? 'Proceed to Payment' : 'Already Free'}
          <ChevronRight size={18} />
        </button>

        {/* Support Email */}
        <div className="text-center text-xs">
          <p className="text-[#6B7280] dark:text-gray-400 mb-1">Payment done but didn't get premium?</p>
          <a
            href="mailto:me.soumen.bhunia@gmail.com"
            className="flex items-center justify-center gap-1  text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-150"
          >
            <Mail size={14} />
            me.soumen.bhunia@gmail.com
          </a>
        </div>
      </div>

      
      {showQrPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-white dark:bg-[#0a0a0a] border border-[#ffffff24] rounded-2xl p-8 w-full max-w-sm relative shadow-2xl">
          <button
            onClick={closeQrPopup}
            className="absolute top-3 right-3 p-2 rounded-full bg-gray-200 dark:bg-[#ffffff17] text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-[#ffffff24] transition-colors duration-150"
          >
            <X size={20} />
          </button>
      
          {/* Header Section */}
          <div className="space-y-2 mb-6">
            <h3 className="text-xl font-bold text-center text-[#1F2937] dark:text-white">Scan to Pay</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">Complete your payment securely</p>
          </div>
      
          {/* Amount Display */}
          <div className="bg-indigo-50 dark:bg-[#ffffff0a] rounded-lg p-3 mb-6">
            <div className="flex items-center justify-center">
              <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">₹29/-</span>
            </div>
          </div>
      
          {/* QR Code Section */}
          <div className="relative">
            <div className="w-52 h-52 mx-auto bg-white dark:bg-gray-800 rounded-xl p-3 shadow-md">
              <img 
                src={payme29} 
                alt="Payment QR Code" 
                className="w-full h-full object-contain rounded-lg" 
              />
            </div>
            
            {/* Scanner Animation Overlay */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-52 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-75 animate-[scan_2s_ease-in-out_infinite]"></div>
          </div>
      
          {/* Instructions */}
          <div className="mt-6 space-y-3">
            <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
              Use your UPI app to scan and complete payment
            </p>
            <div className="bg-yellow-50 dark:bg-[#ffffff0a] p-3 rounded-lg">
              <p className="text-xs text-yellow-700 dark:text-yellow-500 text-center font-medium">
                Important: Please include your account email with the payment note for successful verification.
              </p>
            </div>
          </div>
      
          {/* Security Badge */}
          <div className="mt-4 flex items-center justify-center gap-2 p-2 bg-[#f8fafc] dark:bg-[#ffffff0a] rounded-lg">
            <Lock size={16} className="text-green-600 dark:text-green-500" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Secure SSL encrypted payment
            </span>
          </div>
      
          {/* Payment Methods */}
          <div className="mt-4 md:hidden pt-4 border-t border-gray-200 dark:border-[#ffffff1a]">
            <div className="flex items-center justify-center gap-3">
              {/* <img src="/upi-icon.png" alt="UPI" className="h-6 w-auto opacity-70" />
              <img src="/gpay-icon.png" alt="Google Pay" className="h-6 w-auto opacity-70" />
              <img src="/phonepe-icon.png" alt="PhonePe" className="h-6 w-auto opacity-70" />
              <img src="/paytm-icon.png" alt="Paytm" className="h-6 w-auto opacity-70" /> */}
              <Link to="upi://pay?pa=sob99338@okaxis&pn=Soumen&am=29.00&cu=INR&aid=uGICAgIDt7YC4Qw" className="h-6 flex justify-center text-white items-center p-5 rounded-full font-bold opacity-70 bg-indigo-600 w-full">Pay</Link>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default Upgrade;