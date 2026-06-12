import React, { useState } from 'react';
import { ChevronRight, Check, Wallet, Lock, Mail, X, Crown, ShieldCheck, ArrowLeft, Clock } from 'lucide-react';
import payme29  from "./assets/payme29qr.png";
import { authCheck } from "../Auth/Components/ProtectedCheck";
import { Link } from 'react-router-dom';
import { api } from "../AxiosMeta/ApiAxios";

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
  const [showAdminWaitPopup, setShowAdminWaitPopup] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [verificationStatus, setVerificationStatus] = useState(null); // 'pending', 'success', 'error'
  const [verificationMessage, setVerificationMessage] = useState('');
  const { name , userEmail ,userType,setIsAction,updated_at }= authCheck();
  

  const handleProceedToPayment = () => {
    console.log(`Proceeding to payment for ${selectedPlan} with ${paymentMethod}`);
    setShowQrPopup(true); // Show QR popup
  };

  const closeQrPopup = () => {
    setShowQrPopup(false);
    setUtrNumber('');
    setVerificationStatus(null);
    setVerificationMessage('');
  };

  const handleVerifyUpi = async (e) => {
    e.preventDefault();
    if (!utrNumber || utrNumber.trim().length < 6) {
      setVerificationStatus('error');
      setVerificationMessage('Please enter a valid Transaction UTR / Ref Number (minimum 6 characters).');
      return;
    }
    setVerificationStatus('pending');
    try {
      const response = await api.post('/api/payment/verify-upi', { utr: utrNumber });
      
      // Close the payment QR code modal
      setShowQrPopup(false);
      
      // Clear inputs and verification status
      setUtrNumber('');
      setVerificationStatus(null);
      setVerificationMessage('');
      
      // Show the waiting for admin permission popup
      setShowAdminWaitPopup(true);
    } catch (err) {
      setVerificationStatus('error');
      const errorMsg = err.response?.data?.error || err.message || 'Verification failed';
      setVerificationMessage(errorMsg);
    }
  };

  if (userType === 'premium' || userType === 'admin') {
    return (
      <div className="dark:bg-[#0a0a0a] text-[#1F2937] dark:text-white flex items-center justify-center min-h-[70vh] px-4">
        <div className="max-w-md w-full bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-[#ffffff24] p-8 shadow-2xl text-center relative overflow-hidden">
          {/* Subtle glowing radial background */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Icon Badge */}
          <div className="relative mx-auto w-20 h-20 bg-gradient-to-tr from-amber-400 to-yellow-500 dark:from-amber-600 dark:to-yellow-500 rounded-full flex items-center justify-center shadow-lg mb-6 animate-pulse">
            {userType === 'admin' ? (
              <ShieldCheck className="h-10 w-10 text-white animate-spin-slow" />
            ) : (
              <Crown className="h-10 w-10 text-white" />
            )}
            <span className="absolute -bottom-1 px-3 py-0.5 rounded-full text-[10px] font-extrabold tracking-widest text-amber-950 bg-white dark:bg-amber-400 uppercase shadow-sm">
              {userType}
            </span>
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            Welcome, {name || 'Valued User'}!
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {userType === 'admin' 
              ? 'Administrator Access Activated' 
              : 'Thank you for supporting FinanceGet! Premium is fully active.'}
          </p>

          <div className="bg-gray-50 dark:bg-[#0a0a0a] border border-gray-100 dark:border-[#ffffff12] rounded-xl p-5 mb-8 text-left space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Unlocked Features:
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>Previous Year Data</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>Custom Budget Rules</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>Forecasting Trends</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>Priority support</span>
              </div>
            </div>
          </div>

          <Link
            to="/"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:bg-opacity-20 dark:text-indigo-400 dark:hover:bg-opacity-30 transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go to Dashboard</span>
          </Link>
        </div>
      </div>
    );
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
                Important: Please enter your Transaction Ref/UTR below for instant verification.
              </p>
            </div>
          </div>

          {/* UTR Verification Form */}
          <form onSubmit={handleVerifyUpi} className="mt-6 border-t border-gray-200 dark:border-[#ffffff1a] pt-4 space-y-3">
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
              Already paid? Enter UPI Transaction Ref/UTR Number:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                placeholder="e.g. 123456789012"
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:bg-black dark:border-[#ffffff24] dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
              <button
                type="submit"
                disabled={verificationStatus === 'pending'}
                className="px-3 py-1.5 bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-medium rounded-lg disabled:bg-gray-400 transition-colors"
              >
                {verificationStatus === 'pending' ? 'Verifying...' : 'Verify'}
              </button>
            </div>
            {verificationMessage && (
              <p className={`text-xs text-center font-medium ${verificationStatus === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {verificationMessage}
              </p>
            )}
          </form>
      
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

      {showAdminWaitPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0a0a0a] border border-[#ffffff24] rounded-2xl p-8 w-full max-w-sm relative shadow-2xl text-center space-y-6">
            <button
              onClick={() => setShowAdminWaitPopup(false)}
              className="absolute top-3 right-3 p-2 rounded-full bg-gray-200 dark:bg-[#ffffff17] text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-[#ffffff24] transition-colors duration-150"
            >
              <X size={20} />
            </button>
            
            <div className="mx-auto w-16 h-16 bg-indigo-50 dark:bg-[#ffffff0f] rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Clock className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Waiting for Admin Permission
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your payment transaction reference has been sent to the admin for verification.
              </p>
              <p className="text-xs text-yellow-600 dark:text-yellow-500 bg-yellow-50 dark:bg-[#ffffff0a] p-2.5 rounded-lg font-medium">
                Please wait. Your account will be upgraded to Premium once verified.
              </p>
            </div>

            <button
              onClick={() => setShowAdminWaitPopup(false)}
              className="w-full py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 text-sm font-medium rounded-lg transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Upgrade;