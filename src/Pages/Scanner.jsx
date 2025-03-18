import React, { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import { Camera, RefreshCw, X, AlertCircle, CheckCircle, Wallet, Edit3, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../AxiosMeta/ApiAxios";

const Scanner = () => {
  const videoRef = useRef(null);
  const [qrData, setQrData] = useState(null);
  const [isUpiQr, setIsUpiQr] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState(null);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const qrScannerRef = useRef(null);
  const navigate = useNavigate();
  
  // Form state for expense details
  const [expenseDetails, setExpenseDetails] = useState({
    amount: "",
    source: "Other Miscellaneous",
    description: "Payment via QR Scan",
    date: new Date().toISOString().split("T")[0],
    note: ""
  });

  // List of available UPI apps (would be populated dynamically in a real app)
  const upiApps = [
    { name: "Google Pay", icon: "gpay" },
    { name: "PhonePe", icon: "phonepe" },
    { name: "Paytm", icon: "paytm" },
    { name: "BHIM", icon: "bhim" }
  ];

  const cameraConstraints = {
    video: {
      facingMode: "environment",
      width: { ideal: 1920, min: 720 },
      height: { ideal: 1080, min: 720 },
      aspectRatio: { ideal: 1.7777777778 }
    },
    audio: false
  };

  const stopCamera = () => {
    if (qrScannerRef.current) {
      try {
        qrScannerRef.current.stop();
        qrScannerRef.current.destroy();
        qrScannerRef.current = null;
      } catch (error) {
        console.error("Error stopping camera:", error);
      }
    }
    
    // Ensure video stream is stopped
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    try {
      // Clean up any existing instances first
      stopCamera();
      
      // Check if we're on HTTPS or localhost (for dev)
      if (window.location.protocol !== 'https:' && 
          window.location.hostname !== 'localhost' && 
          window.location.hostname !== '127.0.0.1') {
        setError("Camera access requires HTTPS for security reasons");
        return;
      }
      
      const stream = await navigator.mediaDevices.getUserMedia(cameraConstraints);
      const video = videoRef.current;
      if (video) {
        video.srcObject = stream;
        
        // Wait for metadata to be loaded before playing
        video.onloadedmetadata = () => {
          // Use a Promise to ensure video plays before proceeding
          const playPromise = video.play();
          
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsCameraActive(true);
                setError(null);
                
                // Initialize QrScanner only after video is playing
                if (!qrScannerRef.current) {
                  try {
                    qrScannerRef.current = new QrScanner(
                      video,
                      (result) => {
                        handleQrResult(result.data);
                        // Don't stop camera automatically
                      },
                      {
                        returnDetailedScanResult: true,
                        highlightScanRegion: true,
                        highlightCodeOutline: true,
                        maxScansPerSecond: 3
                      }
                    );
                    
                    qrScannerRef.current.start().catch(err => {
                      console.error("QR Scanner start error:", err);
                      setError(`Scanner error: ${err.message}`);
                    });
                  } catch (err) {
                    console.error("QR Scanner initialization error:", err);
                    setError(`Scanner initialization failed: ${err.message}`);
                  }
                }
              })
              .catch(err => {
                console.error("Video play error:", err);
                setError(`Video playback failed: ${err.message}`);
              });
          }
        };
      }
    } catch (err) {
      console.error("Camera access error:", err);
      if (err.name === 'NotAllowedError') {
        setError("Camera access denied. Please allow camera permissions.");
      } else if (err.name === 'NotFoundError') {
        setError("No camera detected on this device.");
      } else {
        setError(`Camera error: ${err.message}`);
      }
    }
  };

  // Detect if QR code is UPI or other format
  const handleQrResult = (data) => {
    setQrData(data);
    
    // Check if it's a UPI QR code
    const isUpi = data.includes("upi://") || 
                  data.includes("pa=") || 
                  data.includes("pn=") || 
                  data.includes("am=");
    
    setIsUpiQr(isUpi);
    
    if (isUpi) {
      // Parse UPI QR and extract payment info
      const parsedData = parseUpiQrData(data);
      setExpenseDetails(prev => ({
        ...prev,
        amount: parsedData.amount || "",
        description: parsedData.description || "UPI Payment",
      }));
    }
    
    // Provide haptic feedback if available
    if (navigator.vibrate) {
      try {
        navigator.vibrate(100);
      } catch (e) {
        // Ignore vibration errors
      }
    }
  };

  // Parse UPI QR data
  const parseUpiQrData = (data) => {
    try {
      // Handle standard UPI format
      if (data.startsWith("upi://")) {
        try {
          const url = new URL(data);
          const params = new URLSearchParams(url.search);
          
          return {
            payee: url.pathname.split('/')[2] || "",
            amount: params.get("am") || "",
            description: params.get("tn") || params.get("pn") || "UPI Payment",
          };
        } catch (e) {
          console.error("UPI URL parsing error:", e);
          return { payee: "", amount: "", description: "UPI Payment" };
        }
      } 
      // Handle other formats with pa=, pn=, etc.
      else {
        try {
          const params = new URLSearchParams(data);
          return {
            payee: params.get("pa") || "",
            amount: params.get("am") || "",
            description: params.get("tn") || params.get("pn") || "UPI Payment",
          };
        } catch (e) {
          console.error("UPI params parsing error:", e);
          return { payee: "", amount: "", description: "UPI Payment" };
        }
      }
    } catch (e) {
      console.error("UPI data parsing error:", e);
      return { payee: "", amount: "", description: "UPI Payment" };
    }
  };

  useEffect(() => {
    // Start camera when component mounts
    startCamera();
    
    // Clean up resources when component unmounts
    return () => {
      stopCamera();
    };
  }, []);

  const handleReset = () => {
    setQrData(null);
    setIsUpiQr(false);
    setError(null);
    setMessage(null);
    setShowExpenseForm(false);
    setExpenseDetails({
      amount: "",
      source: "Other Miscellaneous",
      description: "Payment via QR Scan",
      date: new Date().toISOString().split("T")[0],
      note: ""
    });
    
    // Add a small delay before restarting camera
    setTimeout(() => {
      startCamera();
    }, 300);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExpenseDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle Pay button click to add expense to backend
  const handleAddExpense = async () => {
    if (!expenseDetails.amount || isNaN(parseFloat(expenseDetails.amount))) {
      setError("Please enter a valid amount");
      return;
    }

    try {
      setIsProcessing(true);
      await api.post("/api/expenses", expenseDetails);
      setMessage("Expense added successfully");
      setError(null);
      setShowExpenseForm(false);
      
      // Optional: Reset after success
      setTimeout(() => {
        handleReset();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to add expense");
      setMessage(null);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle UPI payment redirection
  const handleUpiPayment = (app) => {
    // Save expense first
    handleAddExpense().then(() => {
      // Then simulate app redirection (in a real app, use actual deep links)
      // For demo we'll just show successful redirection message
      setMessage(`Redirecting to ${app.name}...`);
      
      // In a real implementation, would use something like this based on platform:
      // if (navigator.userAgent.includes('Android')) {
      //   window.location.href = `intent://${qrData}#Intent;scheme=upi;package=com.${app.packageName};end`;
      // } else if (navigator.userAgent.includes('iPhone')) {
      //   window.location.href = `${app.scheme}://${qrData}`;
      // }
    });
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  // Custom scan line animation style
  const scanLineStyles = {
    animation: "scanLine 2s ease-in-out infinite",
    top: "50%"
  };
  
  // Custom radial gradient for better visibility
  const radialGradientStyles = {
    background: "radial-gradient(circle, transparent 60%, rgba(0,0,0,0.4) 100%)"
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
      <div className="w-full max-w-md flex flex-col h-[100svh] relative overflow-hidden">
        {/* Camera View */}
        <div className="relative flex-grow bg-black">
          <video 
            ref={videoRef} 
            className="w-full h-full object-cover" 
            playsInline 
          />

          {isCameraActive && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-72 h-72">
                {/* Frame for scanning */}
                <div className="w-72 h-72 border-2 border-white/70 rounded-lg">
                  <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>
                </div>
                
                {/* Animated scan line - moves from top to bottom */}
                <div 
                  className="absolute left-0 right-0 h-0.5 bg-blue-500 animate-bounce"
                  style={scanLineStyles}
                ></div>
                
                {/* Add a radial gradient for better visibility */}
                <div 
                  className="absolute inset-0 pointer-events-none" 
                  style={radialGradientStyles}
                ></div>
              </div>
            </div>
          )}

          {/* Top Navigation Bar */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
            <div className="text-white font-semibold flex items-center space-x-2">
              <Camera className="w-5 h-5" />
              <span>Scan & Pay</span>
            </div>
            
            <button
              onClick={() => {
                stopCamera();
                navigate("/");
              }}
              className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Bottom flash message */}
          {isCameraActive && !qrData && !error && (
            <div className="absolute bottom-20 left-4 right-4 bg-black/70 text-white py-2 px-4 rounded-full text-center text-sm animate-pulse">
              Point camera at any QR code
            </div>
          )}
        </div>

        {/* Results and Action Panel */}
        <div className={`bg-white dark:bg-[#121212] p-4 rounded-t-3xl shadow-lg transition-all duration-300 ${qrData ? 'flex-grow' : ''}`}>
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Wallet className="w-5 h-5 mr-2 text-blue-600" />
              <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-50">
                {qrData ? (isUpiQr ? "UPI Payment" : "QR Scanned") : "QR Scanner"}
              </h1>
            </div>
            <span className="text-xs text-gray-500">{currentDate}</span>
          </div>

          {/* QR Data and Actions Panel */}
          {qrData && !showExpenseForm && (
            <div className="mt-2 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              {/* QR Result */}
              <div className="p-4 bg-gray-50 dark:bg-[#1a1a1a]">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {isUpiQr ? "UPI Payment Details" : "Scanned Result"}
                  </span>
                  <button 
                    onClick={handleReset}
                    className="text-blue-600 dark:text-blue-400 p-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
                
                {isUpiQr ? (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Amount</span>
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        ₹{expenseDetails.amount || "---"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">To</span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {parseUpiQrData(qrData).payee || "Unknown Merchant"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Description</span>
                      <span className="text-gray-900 dark:text-white">
                        {expenseDetails.description}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-900 dark:text-gray-300 font-medium break-all bg-white dark:bg-[#0a0a0a] p-3 rounded border border-gray-200 dark:border-[#ffffff12] text-sm">
                    {qrData}
                  </p>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="p-4 space-y-3">
                {isUpiQr ? (
                  <>
                    <div className="grid grid-cols-4 gap-2 mb-3">
                      {upiApps.map((app, index) => (
                        <button
                          key={index}
                          onClick={() => handleUpiPayment(app)}
                          className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-1">
                            {/* Placeholder for app icon */}
                            <span className="text-xs font-bold">{app.name[0]}</span>
                          </div>
                          <span className="text-xs text-gray-600 dark:text-gray-300">{app.name}</span>
                        </button>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => setShowExpenseForm(true)}
                      className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      <Edit3 className="w-4 h-4 mr-2" /> Edit Expense Details
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setShowExpenseForm(true)}
                    className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" /> Continue
                  </button>
                )}
                
                <button
                  onClick={handleReset}
                  className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4 mr-2" /> Scan Again
                </button>
              </div>
            </div>
          )}

          {/* Expense Form Panel */}
          {showExpenseForm && (
            <div className="mt-2 p-4 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Expense Details</h3>
                <button 
                  onClick={() => setShowExpenseForm(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleAddExpense(); }}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Amount
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={expenseDetails.amount}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    placeholder="Enter amount"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Source
                  </label>
                  <select
                    name="source"
                    value={expenseDetails.source}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  >
                    <option value="Food">Food & Dining</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Other Miscellaneous">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={expenseDetails.description}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    placeholder="Enter description"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={expenseDetails.date}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Note (Optional)
                  </label>
                  <textarea
                    name="note"
                    value={expenseDetails.note}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    placeholder="Add a note"
                  />
                </div>
                
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className={`w-full flex items-center justify-center px-4 py-3 ${
                      isProcessing ? "bg-gray-400 dark:bg-gray-600" : "bg-blue-600 hover:bg-blue-700"
                    } text-white rounded-xl transition-colors font-medium`}
                  >
                    {isProcessing ? "Processing..." : (isUpiQr ? "Save & Continue" : "Save Expense")}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Status Messages */}
          {(error || message) && (
            <div
              className={`mt-3 p-3 rounded-xl flex items-center gap-2 ${
                error ? "bg-red-50 text-red-600 dark:bg-red-900/20" : "bg-green-50 text-green-600 dark:bg-green-900/20"
              }`}
            >
              {error ? <AlertCircle className="w-5 h-5 flex-shrink-0" /> : <CheckCircle className="w-5 h-5 flex-shrink-0" />}
              <p className="text-sm font-medium">{error || message}</p>
            </div>
          )}

          {/* Initial State - No QR detected yet */}
          {!qrData && !error && !message && (
            <div className="text-center py-3">
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                {isCameraActive
                  ? "Align QR code within the square frame"
                  : navigator.mediaDevices?.getUserMedia
                  ? "Start the camera to scan a QR code"
                  : "Camera not supported on this device"}
              </p>
              {!isCameraActive && (
                <button
                  onClick={startCamera}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Camera className="w-4 h-4 mr-2" /> Start Camera
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Add keyframe animation in regular CSS */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes scanLine {
            0% { top: 0; }
            50% { top: 100%; }
            100% { top: 0; }
          }
        `
      }} />
    </div>
  );
};

export default Scanner;