import React, { useEffect, useRef, useCallback, useState } from "react";
import jsQR from "jsqr";
import { api } from "../AxiosMeta/ApiAxios";
import { Camera, RefreshCw, Loader2, X } from "lucide-react";

const Scanner = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [qrData, setQrData] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const animationFrameId = useRef(null);

  const stopScanner = useCallback(() => {
    const video = videoRef.current;
    if (video && video.srcObject) {
      const stream = video.srcObject;
      stream.getTracks().forEach((track) => track.stop());
      video.srcObject = null;
    }
    setIsScanning(false);
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
  }, []);

  const scanFrame = useCallback(() => {
    if (!videoRef.current || !isScanning) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d", { alpha: false });
    const video = videoRef.current;

    // Adjust canvas size only if needed
    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (code) {
      handleQrScan(code.data);
    }

    // Continuously request the next frame
    animationFrameId.current = requestAnimationFrame(scanFrame);
  }, [isScanning]);

  const startScanner = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      const video = videoRef.current;
      if (video) {
        video.srcObject = stream;
        video.onloadedmetadata = () => {
          video
            .play()
            .then(() => {
              setIsScanning(true);
              animationFrameId.current = requestAnimationFrame(scanFrame);
            })
            .catch((err) => {
              setError(`Failed to start video: ${err.message}`);
            });
        };
      }
    } catch (err) {
      setError(`Camera access denied or unavailable: ${err.message}`);
    }
  }, [scanFrame]);

  useEffect(() => {
    startScanner();

    return () => {
      stopScanner();
    };
  }, [startScanner, stopScanner]);

  const handleQrScan = async (scannedData) => {
    if (loading || qrData === scannedData) return; // Prevent duplicate scans

    setLoading(true);
    try {
      const response = await api.post("/api/qr/scanner", {
        qrData: scannedData,
      }, { timeout: 5000 });
      setQrData(response.data.data);
    } catch (error) {
      console.error("Error sending QR data:", error);
      setError(error.response?.data?.message || "Failed to process QR code");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setQrData(null);
    setError(null);
    setLoading(false);
    if (!isScanning) startScanner();
  };

  const handleStop = () => {
    stopScanner();
    setQrData(null);
    setError(null);
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md flex flex-col h-screen">
        {/* Scanner Area */}
        <div className="relative flex-grow bg-black">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
          />
          <canvas
            ref={canvasRef}
            className="hidden" // Canvas is only for processing, not display
          />

          {/* Minimal Overlay for Guidance */}
          {isScanning && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 border-2 border-white/50 rounded-lg" />
            </div>
          )}

          {/* Stop Button */}
          {isScanning && (
            <button
              onClick={handleStop}
              className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Bottom Panel */}
        <div className="bg-white p-4 rounded-t-xl shadow-lg">
          <div className="flex items-center justify-center mb-4">
            <Camera className="w-6 h-6 mr-2 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-800">QR Scanner</h1>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
              <span className="ml-2 text-gray-600">Processing...</span>
            </div>
          )}

          {/* QR Data Display */}
          {qrData && !loading && (
            <div className="text-center">
              <p className="text-gray-700 text-sm">Scanned Data:</p>
              <p className="text-gray-900 font-medium break-all">{qrData}</p>
              <button
                onClick={handleReset}
                className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" /> Scan Again
              </button>
            </div>
          )}

          {/* Error Display */}
          {error && !loading && (
            <div className="text-center">
              <p className="text-red-600 text-sm">{error}</p>
              <button
                onClick={handleReset}
                className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" /> Try Again
              </button>
            </div>
          )}

          {/* Instructions */}
          {!qrData && !error && !loading && (
            <div className="text-center">
              <p className="text-gray-500 text-sm">
                {navigator.mediaDevices?.getUserMedia
                  ? "Align QR code within the frame"
                  : "Camera not supported on this device"}
              </p>
              {!isScanning && (
                <button
                  onClick={startScanner}
                  className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Start Scanning
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