import React, { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import { Camera, RefreshCw, X, AlertCircle, CheckCircle, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../AxiosMeta/ApiAxios";

const Scanner = () => {
  const videoRef = useRef(null);
  const [qrData, setQrData] = useState(null);
  const [isUpiQr, setIsUpiQr] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const qrScannerRef = useRef(null);
  const navigate = useNavigate();
  
  // Simplified expense details - we'll use minimal data
  const [expenseDetails, setExpenseDetails] = useState({
    amount: "",
    source: "Other Miscellaneous",
    description: "Payment via QR Scan",
    date: new Date().toISOString().split("T")[0]
  });

  // Optimized camera constraints for better performance
  const cameraConstraints = {
    video: {
      facingMode: "environment",
      width: { ideal: 1280, min: 640 },  // Reduced resolution for faster startup
      height: { ideal: 720, min: 480 },  // Reduced resolution for faster startup
      aspectRatio: { ideal: 1.7777777778 }
    },
    audio: false
  };

  // More efficient camera stop function
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
    
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    setIsCameraActive(false);
  };

  // Optimized camera start function
  const startCamera = async () => {
    try {
      stopCamera();
      
      // Skip HTTPS check in development for faster testing
      const stream = await navigator.mediaDevices.getUserMedia(cameraConstraints);
      const video = videoRef.current;
      
      if (video) {
        video.srcObject = stream;
        video.setAttribute('playsinline', true); // Important for iOS
        
        // Simplified metadata handling
        video.onloadedmetadata = () => {
          video.play().catch(err => {
            console.error("Video play error:", err);
            setError(`Video playback failed: ${err.message}`);
          });
          
          setIsCameraActive(true);
          setError(null);
          
          // Initialize QR scanner with optimized settings
          qrScannerRef.current = new QrScanner(
            video,
            (result) => handleQrResult(result.data),
            {
              returnDetailedScanResult: true,
              highlightScanRegion: true,
              highlightCodeOutline: true,
              maxScansPerSecond: 5, // Increased scan rate
              calculationMethod: 'fast' // Prioritize speed
            }
          );
          
          qrScannerRef.current.start().catch(err => {
            console.error("QR Scanner start error:", err);
            setError(`Scanner error: ${err.message}`);
          });
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

  // Detect if QR code is UPI or other format and handle redirection
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
      
      // Update expense details
      const updatedExpenseDetails = {
        ...expenseDetails,
        amount: parsedData.amount || "",
        description: parsedData.description || "UPI Payment"
      };
      
      setExpenseDetails(updatedExpenseDetails);
      
      // Immediately proceed to UPI app redirection
      handleDirectUpiPayment(data, updatedExpenseDetails);
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
  
  // Function to directly redirect to default UPI app
  const handleDirectUpiPayment = async (upiData, details) => {
    try {
      setIsProcessing(true);
      
      // First save the expense data
      await api.post("/api/expenses", details);
      
      // Then redirect immediately to default UPI app
      const encodedUpiData = encodeURIComponent(upiData);
      
      // Determine platform and redirect accordingly
      if (/Android/i.test(navigator.userAgent)) {
        window.location.href = `intent://${upiData}#Intent;scheme=upi;end`;
      } else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        window.location.href = `upi://${encodedUpiData}`;
      } else {
        // Fallback for desktop or unsupported devices
        window.location.href = upiData;
      }
      
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to process payment");
      
      // Reset scanning if there's an error
      setTimeout(() => {
        handleReset();
      }, 2000);
    }
  };

  const handleReset = () => {
    setQrData(null);
    setIsUpiQr(false);
    setError(null);
    setExpenseDetails({
      amount: "",
      source: "Other Miscellaneous",
      description: "Payment via QR Scan",
      date: new Date().toISOString().split("T")[0]
    });
    
    // Add a small delay before restarting camera
    setTimeout(() => {
      startCamera();
    }, 300);
  };

  useEffect(() => {
    // Start camera immediately when component mounts
    startCamera();
    
    // Clean up resources when component unmounts
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
      <div className="w-full max-w-md flex flex-col h-[100vh] relative overflow-hidden">
        {/* Camera View */}
        <div className="relative flex-grow bg-black">
          <video 
            ref={videoRef} 
            className="w-full h-full object-cover" 
            playsInline 
          />

          {isCameraActive && !qrData && (
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
                  style={{ animation: "scanLine 2s ease-in-out infinite", top: "50%" }}
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

        {/* Status Messages */}
        {error && (
          <div className="fixed top-16 left-0 right-0 mx-4 p-3 rounded-xl flex items-center gap-2 bg-red-50 text-red-600 dark:bg-red-900/20 z-50">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}
        
        {isProcessing && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl max-w-xs w-full text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-800 dark:text-white font-medium">Processing payment...</p>
            </div>
          </div>
        )}
        
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
    </div>
  );
};

export default Scanner;