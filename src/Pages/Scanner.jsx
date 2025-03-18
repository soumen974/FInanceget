import React, { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { api } from "../AxiosMeta/ApiAxios";
import {
  Camera,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";

const Scanner = ({ onScanComplete }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [qrData, setQrData] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let animationFrameId;

    const startScanner = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          // Wait for the video to be ready before playing
          video.onloadedmetadata = () => {
            video
              .play()
              .then(() => {
                setIsScanning(true);
                animationFrameId = requestAnimationFrame(scanFrame);
              })
              .catch((err) => {
                setError("Failed to start video: " + err.message);
              });
          };
        }
      } catch (err) {
        setError("Camera access denied or unavailable: " + err.message);
      }
    };

    const scanFrame = () => {
      if (!videoRef.current || !isScanning) return;

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      const video = videoRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        handleQrScan(code.data);
      } else {
        animationFrameId = requestAnimationFrame(scanFrame);
      }
    };

    startScanner();

    return () => {
      stopScanner();
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [onScanComplete]);

  const stopScanner = () => {
    const video = videoRef.current;
    if (video && video.srcObject) {
      const stream = video.srcObject;
      stream.getTracks().forEach((track) => track.stop());
      video.srcObject = null;
    }
  };

  const handleQrScan = async (scannedData) => {
    setIsScanning(false);
    setLoading(true);

    try {
      const response = await api.post("/api/qr/scanner", {
        qrData: scannedData,
      });
      setQrData(response.data.data);
      if (onScanComplete) onScanComplete(response.data.data);
    } catch (error) {
      console.error("Error sending QR data:", error);
      setError("Failed to process QR code");
    } finally {
      setLoading(false);
      stopScanner();
    }
  };

  const handleReset = () => {
    setQrData(null);
    setError(null);
    setLoading(false);
    setIsScanning(true);
    const video = videoRef.current;
    if (video && !video.srcObject) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
          video.srcObject = stream;
          video.onloadedmetadata = () => {
            video
              .play()
              .then(() => {
                requestAnimationFrame(scanFrame);
              })
              .catch((err) => {
                setError("Failed to restart video: " + err.message);
              });
          };
        })
        .catch(() => setError("Camera access denied"));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 transform transition-all hover:shadow-3xl">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center justify-center mb-6">
          <Camera className="w-8 h-8 mr-3 text-blue-600 animate-pulse" /> QR Scanner
        </h1>

        {/* Scanner Area */}
        <div className="relative w-full h-72 bg-gray-100 rounded-xl overflow-hidden border-2 border-blue-300 shadow-inner">
          <video
            ref={videoRef}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              isScanning ? "opacity-100" : "opacity-60"
            }`}
            playsInline
          />
          <canvas ref={canvasRef} className="hidden" />

          {/* Scanning Overlay */}
          {isScanning && (
            <div className="absolute inset-0 bg-blue-500/20 animate-pulse">
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-600 animate-scan-line shadow-lg"></div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="mt-6 flex items-center justify-center space-x-3 bg-blue-50 p-4 rounded-lg">
            <Loader2 className="w-7 h-7 text-blue-600 animate-spin" />
            <span className="text-lg text-blue-700 font-medium">Processing QR code...</span>
          </div>
        )}

        {/* Success State */}
        {qrData && !loading && (
          <div className="mt-6 p-5 bg-green-50 rounded-xl border border-green-300 animate-fade-in">
            <div className="flex items-center justify-center mb-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <h3 className="ml-3 text-xl font-semibold text-green-800">
                Success!
              </h3>
            </div>
            <p className="text-gray-900 text-center break-all bg-white p-3 rounded-lg shadow-sm">{qrData}</p>
            <button
              onClick={handleReset}
              className="mt-5 w-full flex items-center justify-center px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <RefreshCw className="w-5 h-5 mr-2 animate-spin-on-hover" /> Scan Again
            </button>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="mt-6 p-5 bg-red-50 rounded-xl border border-red-300 animate-fade-in">
            <div className="flex items-center justify-center mb-3">
              <AlertCircle className="w-8 h-8 text-red-600" />
              <h3 className="ml-3 text-xl font-semibold text-red-800">Error</h3>
            </div>
            <p className="text-red-700 text-center">{error}</p>
            <button
              onClick={handleReset}
              className="mt-5 w-full flex items-center justify-center px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <RefreshCw className="w-5 h-5 mr-2 animate-spin-on-hover" /> Try Again
            </button>
          </div>
        )}

        {/* Instructions */}
        {!qrData && !error && !loading && (
          <p className="mt-4 text-gray-600 text-center text-sm italic animate-fade-in">
            Position a QR code within the frame to scan.
          </p>
        )}
      </div>
    </div>
  );
};

export default Scanner;