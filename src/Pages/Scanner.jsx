import React, { useEffect, useRef, useState, useCallback } from "react";
import jsQR from "jsqr";
import { Camera, RefreshCw, Copy, CheckCircle, AlertTriangle } from "lucide-react";

const Scanner = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const processingRef = useRef(false);
  const scanIntervalRef = useRef(null);
  const [qrData, setQrData] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [scanWarning, setScanWarning] = useState(false);
  const lastProcessTimeRef = useRef(0);

  // Process video frame to detect QR code - using interval instead of requestAnimationFrame
  const processVideoFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !isScanning || processingRef.current) return;
    
    const now = Date.now();
    const timeSinceLastProcess = now - lastProcessTimeRef.current;
    
    // Only process every 200ms to reduce CPU usage
    if (timeSinceLastProcess < 200) return;
    
    lastProcessTimeRef.current = now;
    processingRef.current = true;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    
    // Only process if video is ready
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      // Set canvas size once when video data is available
      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }
      
      // Process the frame
      try {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });
        
        if (code && code.data) {
          setQrData(code.data);
          stopScanner();
        } else {
          processingRef.current = false;
        }
      } catch (err) {
        console.error("Error processing frame:", err);
        processingRef.current = false;
      }
    } else {
      processingRef.current = false;
    }
  }, [isScanning]);

  // Stop scanner and cleanup
  const stopScanner = useCallback(() => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop());
    }
    
    setIsScanning(false);
    processingRef.current = false;
  }, []);

  // Start scanner with stable video setup
  const startScanner = useCallback(async () => {
    setError(null);
    setQrData(null);
    setCopied(false);
    setScanWarning(false);
    
    try {
      const constraints = {
        video: { 
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        // Apply the stream to video element
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play()
            .then(() => {
              setIsScanning(true);
              
              // Start interval for processing frames
              scanIntervalRef.current = setInterval(() => {
                if (!processingRef.current) {
                  processVideoFrame();
                } else {
                  // Show warning if processing is taking too long
                  setScanWarning(true);
                  setTimeout(() => setScanWarning(false), 3000);
                }
              }, 200);
            })
            .catch(err => {
              setError(`Failed to start video: ${err.message}`);
            });
        };
      }
    } catch (err) {
      let errorMessage = "Camera access denied or unavailable";
      if (err.name === "NotAllowedError") {
        errorMessage = "Camera permission denied. Please allow camera access.";
      } else if (err.name === "NotFoundError") {
        errorMessage = "No camera found on this device.";
      }
      setError(errorMessage);
    }
  }, [processVideoFrame]);

  // Initialize scanner on component mount
  useEffect(() => {
    startScanner();
    
    return () => {
      stopScanner();
    };
  }, [startScanner, stopScanner]);

  // Copy QR code data to clipboard
  const copyToClipboard = () => {
    if (!qrData) return;
    
    navigator.clipboard.writeText(qrData).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Detect if QR data is a URL
  const isUrl = qrData && (
    qrData.startsWith("http://") || 
    qrData.startsWith("https://") || 
    qrData.startsWith("www.")
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md overflow-hidden bg-white rounded-2xl shadow-xl">
        {/* Video container */}
        <div className="relative w-full aspect-video bg-black">
          {/* Video element - fixed size to prevent resize flickering */}
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            playsInline
            muted
          />
          
          {/* Hidden canvas for processing */}
          <canvas
            ref={canvasRef}
            className="hidden"
          />
          
          {/* Scan target overlay */}
          {isScanning && !qrData && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-52 h-52 relative">
                {/* Target frame */}
                <div className="absolute inset-0 border-2 border-white/50 rounded-lg"></div>
                
                {/* Corner indicators */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-500"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-500"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-blue-500"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-500"></div>
              </div>
            </div>
          )}
          
          {/* Scan warning */}
          {scanWarning && (
            <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center">
              <div className="bg-yellow-500/80 text-white px-4 py-2 rounded-full text-sm flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Please hold the camera steady
              </div>
            </div>
          )}
        </div>
        
        {/* Content area */}
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-center mb-4">
            <Camera className="w-6 h-6 mr-2 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">QR Scanner</h2>
          </div>
          
          {/* QR Result */}
          {qrData && (
            <div className="mt-3 transition-opacity duration-300 opacity-100">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <h3 className="text-lg font-medium text-green-800">QR Code Detected</h3>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
                <p className="text-gray-800 text-center break-all font-medium">{qrData}</p>
              </div>
              
              <div className="flex gap-2">
                {isUrl && (
                  <a
                    href={qrData.startsWith("www.") ? `https://${qrData}` : qrData}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg text-center font-medium transition-colors"
                  >
                    Open Link
                  </a>
                )}
                
                <button
                  onClick={copyToClipboard}
                  className="flex items-center justify-center px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
                >
                  {copied ? <CheckCircle className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                  {copied ? "Copied" : "Copy"}
                </button>
                
                <button
                  onClick={startScanner}
                  className="flex items-center justify-center px-4 py-3 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Scan New
                </button>
              </div>
            </div>
          )}
          
          {/* Error State */}
          {error && (
            <div className="mt-3 p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-red-700 text-center">{error}</p>
              <button
                onClick={startScanner}
                className="mt-3 w-full flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Try Again
              </button>
            </div>
          )}
          
          {/* Scanning Instructions */}
          {isScanning && !qrData && !error && (
            <p className="text-gray-500 text-center text-sm mt-2">
              Center the QR code within the frame to scan
            </p>
          )}
          
          {/* Start Button */}
          {!isScanning && !qrData && !error && (
            <button
              onClick={startScanner}
              className="mt-3 w-full flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Camera className="w-4 h-4 mr-1" />
              Start Scanning
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scanner;