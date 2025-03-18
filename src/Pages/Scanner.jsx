import React, { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { Camera, RefreshCw, X } from "lucide-react";

const Scanner = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [qrData, setQrData] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const stopCamera = () => {
    const video = videoRef.current;
    if (video && video.srcObject) {
      const stream = video.srcObject;
      stream.getTracks().forEach((track) => track.stop());
      video.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      const video = videoRef.current;
      if (video) {
        video.srcObject = stream;
        video.onloadedmetadata = () => {
          video.play()
            .then(() => {
              setIsCameraActive(true);
              setError(null);
            })
            .catch((err) => {
              setError(`Failed to start video: ${err.message}`);
            });
        };
      }
    } catch (err) {
      setError(`Camera access denied or unavailable: ${err.message}`);
    }
  };

  useEffect(() => {
    // Start camera when component mounts
    startCamera();

    // Clean up when component unmounts
    return () => {
      stopCamera();
    };
  }, []);

  const captureFrame = () => {
    if (!isCameraActive || !videoRef.current) {
      return;
    }

    setIsCapturing(true);
    
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d", { alpha: false });
      
      // Set canvas dimensions to match video
      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }
      
      // Draw current video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Get image data for QR processing
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      
      // Process QR code
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      
      if (code && code.data) {
        setQrData(code.data);
        stopCamera(); // Stop camera after successful scan
      } else {
        setError("No QR code found. Try again.");
        setTimeout(() => setError(null), 2000); // Clear error after 2 seconds
      }
    } catch (err) {
      setError(`Error processing image: ${err.message}`);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleReset = () => {
    setQrData(null);
    setError(null);
    startCamera();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-black">
      <div className="w-full max-w-md flex flex-col h-screen">
        {/* Camera/Scanner Area */}
        <div className="relative flex-grow bg-black">
          {/* Video element to show camera feed */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            autoPlay
          />
          
          {/* Hidden canvas for frame capture and processing */}
          <canvas
            ref={canvasRef}
            className="hidden"
          />

          {/* Scanner Overlay */}
          {isCameraActive && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 border-2 border-white/70 rounded-lg"></div>
            </div>
          )}

          {/* Stop Camera Button */}
          {isCameraActive && (
            <button
              onClick={stopCamera}
              className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          
          {/* Capture Frame Button */}
          {isCameraActive && (
            <button
              onClick={captureFrame}
              disabled={isCapturing}
              className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 px-6 py-3 ${
                isCapturing ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'
              } text-white rounded-full transition-colors shadow-lg flex items-center justify-center`}
            >
              <Camera className="w-5 h-5 mr-2" />
              {isCapturing ? "Processing..." : "Capture QR Code"}
            </button>
          )}
        </div>

        {/* Bottom Panel */}
        <div className="bg-white p-4 rounded-t-xl shadow-lg">
          <div className="flex items-center justify-center mb-4">
            <Camera className="w-6 h-6 mr-2 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-800">QR Scanner</h1>
          </div>

          {/* QR Data Display */}
          {qrData && (
            <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-700 text-sm mb-1">Scanned Result:</p>
              <p className="text-gray-900 font-medium break-all bg-white p-3 rounded border border-gray-200">{qrData}</p>
              <button
                onClick={handleReset}
                className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" /> Scan Again
              </button>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className={`mt-2 p-3 bg-red-50 rounded-lg border border-red-200 transition-opacity ${error ? 'opacity-100' : 'opacity-0'}`}>
              <p className="text-red-600 text-sm">{error}</p>
              {!isCameraActive && (
                <button
                  onClick={startCamera}
                  className="mt-3 w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4 mr-2" /> Try Again
                </button>
              )}
            </div>
          )}

          {/* Instructions */}
          {!qrData && !error && (
            <div className="text-center">
              <p className="text-gray-500 text-sm">
                {isCameraActive 
                  ? "Position QR code in the center square and tap the capture button" 
                  : navigator.mediaDevices?.getUserMedia
                    ? "Start the camera to scan a QR code"
                    : "Camera not supported on this device"
                }
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