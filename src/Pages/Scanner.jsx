import React, { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner"; // Import qr-scanner
import { Camera, RefreshCw, X, AlertCircle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../AxiosMeta/ApiAxios";

const Scanner = () => {
  const videoRef = useRef(null);
  const [qrData, setQrData] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false); // Renamed for clarity
  const [message, setMessage] = useState(null);
  const qrScannerRef = useRef(null); // Reference to QrScanner instance
  const navigate = useNavigate();

  const cameraConstraints = {
    video: {
      facingMode: "environment",
      width: { ideal: 1920, min: 720 },
      height: { ideal: 1080, min: 720 },
      aspectRatio: { ideal: 1.7777777778 },
      focusMode: "continuous",
    },
  };

  const stopCamera = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current.destroy();
      qrScannerRef.current = null;
    }
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(cameraConstraints);
      const video = videoRef.current;
      if (video) {
        video.srcObject = stream;
        video.onloadedmetadata = async () => {
          try {
            await video.play();
            setIsCameraActive(true);
            setError(null);

            // Initialize QrScanner
            qrScannerRef.current = new QrScanner(
              video,
              (result) => {
                setQrData(result.data);
                stopCamera(); // Stop scanning once QR is detected
              },
              {
                returnDetailedScanResult: true,
                highlightScanRegion: true, // Adds a visual overlay (optional)
                highlightCodeOutline: true, // Highlights detected QR code
              }
            );

            // Start scanning
            await qrScannerRef.current.start();
          } catch (err) {
            setError(`Failed to start video or scanner: ${err.message}`);
          }
        };
      }
    } catch (err) {
      setError(`Camera access denied or unavailable: ${err.message}`);
    }
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const handleReset = () => {
    setQrData(null);
    setError(null);
    setMessage(null);
    startCamera();
  };

  // Parse QR data into expense fields
  const parseQrData = (data) => {
    const params = new URLSearchParams(data);
    return {
      amount: params.get("amount") || "",
      source: params.get("source") || "Other Miscellaneous",
      description: params.get("description") || "Payment via QR Scan",
      date: new Date(),
      note: "",
    };
  };

  // Handle Pay button click to add expense to backend
  const handlePay = async () => {
    if (!qrData) return;

    const expenseData = parseQrData(qrData);

    if (!expenseData.amount || isNaN(expenseData.amount)) {
      setError("Invalid amount in QR code");
      return;
    }

    try {
      setIsProcessing(true);
      await api.post("/api/expenses", expenseData);
      setMessage("Expense added successfully");
      setError(null);
      setQrData(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to add expense");
      setMessage(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const currentDate = new Date().toISOString().split("T")[0];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-[#0a0a0a]">
      <div className="w-full max-w-md flex flex-col h-[100svh]">
        <div className="relative flex-grow bg-black">
          <video ref={videoRef} className="w-full h-full object-cover" playsInline autoPlay />

          {isCameraActive && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-72 h-72 border-2 border-white/70 rounded-lg">
                <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
                <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>
              </div>
            </div>
          )}

          {isCameraActive && (
            <button
              onClick={() => {
                stopCamera();
                navigate("/");
              }}
              className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="bg-white dark:bg-[#0a0a0a] p-4 rounded-t-xl shadow-lg">
          <div className="flex items-center justify-center mb-4">
            <Camera className="w-6 h-6 mr-2 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">QR Scanner</h1>
            <span className="ml-auto text-xs text-gray-500">{currentDate}</span>
          </div>

          {qrData && (
            <div className="mt-2 p-4 bg-gray-50 dark:bg-[#0a0a0a] rounded-lg border border-gray-200 dark:border-[#ffffff24]">
              <p className="text-gray-700 dark:text-gray-400 text-sm mb-1">Scanned Result:</p>
              <p className="text-gray-900 dark:text-gray-400 font-medium break-all bg-white dark:bg-[#0a0a0a] p-3 rounded border border-gray-200 dark:border-[#ffffff24]">
                {qrData}
              </p>
              <button
                onClick={handlePay}
                disabled={isProcessing}
                className={`mt-4 w-full flex items-center justify-center px-4 py-2 ${
                  isProcessing ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
                } text-white rounded-md transition-colors`}
              >
                {isProcessing ? "Processing..." : "Pay"}
              </button>
              <button
                onClick={handleReset}
                className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" /> Scan Again
              </button>
            </div>
          )}

          {(error || message) && (
            <div
              className={`mt-2 p-3 rounded-lg flex items-center gap-2 ${
                error ? "bg-red-50 text-red-600 dark:bg-red-600/20" : "bg-green-50 text-green-600 dark:bg-green-600/20"
              }`}
            >
              {error ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
              <p className="text-sm font-medium">{error || message}</p>
            </div>
          )}

          {!qrData && !error && !message && (
            <div className="text-center">
              <p className="text-gray-500 text-sm">
                {isCameraActive
                  ? "Align QR code within the square"
                  : navigator.mediaDevices?.getUserMedia
                  ? "Start the camera to scan a QR code"
                  : "Camera not supported on this device"}
              </p>
              {!isCameraActive && (
                <button
                  onClick={startCamera}
                  className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Camera className="w-4 h-4 mr-2" /> Start Camera
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scanner;