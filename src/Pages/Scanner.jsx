import React, { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { Camera, RefreshCw, X, ZoomIn } from "lucide-react";
import { useNavigate ,Link} from "react-router-dom";

const Scanner = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [qrData, setQrData] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);
  const [lastCapture, setLastCapture] = useState(null);

  // Add camera constraints for better quality
  const cameraConstraints = {
    video: {
      facingMode: "environment",
      width: { ideal: 1920, min: 720 },
      height: { ideal: 1080, min: 720 },
      aspectRatio: { ideal: 1.7777777778 },
      focusMode: "continuous"
    }
  };
  const navigate = useNavigate();

  const stopCamera = () => {
    const video = videoRef.current;
    if (video && video.srcObject) {
      const stream = video.srcObject;
      stream.getTracks().forEach((track) => track.stop());
      video.srcObject = null;
    }
    // navigate('/');
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    try {
      // First try to get a high quality camera
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia(cameraConstraints);
        setDebugInfo("Using high quality camera");
      } catch (highQualityErr) {
        console.warn("Failed to get high quality camera, falling back to default", highQualityErr);
        setDebugInfo("Using default camera (high quality failed)");
        // Fall back to basic camera
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "environment" } 
        });
      }
      
      const video = videoRef.current;
      if (video) {
        video.srcObject = stream;
        // Get video track for additional settings
        const videoTrack = stream.getVideoTracks()[0];
        
        try {
          // Try to apply advanced settings if supported
          const capabilities = videoTrack.getCapabilities();
          if (capabilities) {
            setDebugInfo(prev => `${prev}\nCamera capabilities: ${JSON.stringify(capabilities)}`);
            
            // Try to set focus mode if available
            if (capabilities.focusMode && capabilities.focusMode.includes("continuous")) {
              await videoTrack.applyConstraints({ 
                advanced: [{ focusMode: "continuous" }] 
              });
            }
            
            // Try to set brightness/contrast if available
            if (capabilities.brightness || capabilities.contrast) {
              await videoTrack.applyConstraints({
                advanced: [{ 
                  brightness: capabilities.brightness ? capabilities.brightness.max * 0.7 : undefined,
                  contrast: capabilities.contrast ? capabilities.contrast.max * 0.7 : undefined
                }]
              });
            }
          }
        } catch (settingsErr) {
          console.warn("Could not apply advanced camera settings", settingsErr);
        }

        video.onloadedmetadata = () => {
          video.play()
            .then(() => {
              setIsCameraActive(true);
              setError(null);
              setDebugInfo(prev => `${prev}\nVideo dimensions: ${video.videoWidth}x${video.videoHeight}`);
            })
            .catch((err) => {
              setError(`Failed to start video: ${err.message}`);
            });
        };
      }
    } catch (err) {
      setError(`Camera access denied or unavailable: ${err.message}`);
      console.error("Camera error:", err);
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

  const enhanceImageForQR = (context, width, height) => {
    // Get the image data
    let imageData = context.getImageData(0, 0, width, height);
    let data = imageData.data;
    
    // Apply image processing to enhance QR code detection
    for (let i = 0; i < data.length; i += 4) {
      // Increase contrast
      let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      let threshold = 128;
      
      if (avg > threshold) {
        data[i] = 255;     // R
        data[i + 1] = 255; // G
        data[i + 2] = 255; // B
      } else {
        data[i] = 0;       // R
        data[i + 1] = 0;   // G
        data[i + 2] = 0;   // B
      }
      
      // Keep alpha channel
      data[i + 3] = 255;
    }
    
    // Put the enhanced image data back on the canvas
    context.putImageData(imageData, 0, 0);
    
    // Return the enhanced image data for QR processing
    return context.getImageData(0, 0, width, height);
  };

  const captureFrame = () => {
    if (!isCameraActive || !videoRef.current) {
      return;
    }

    setIsCapturing(true);
    setError(null);
    
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d", { alpha: false, willReadFrequently: true });
      
      // Set canvas dimensions to match video
      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }
      
      // Clear canvas before drawing
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw current video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Save a copy of the original capture for debugging
      setLastCapture(canvas.toDataURL('image/jpeg', 0.7));
      
      // First try with original image data
      let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      let code = jsQR(imageData.data, imageData.width, imageData.height);
      
      // If no code found, try with enhanced image
      if (!code) {
        // Try with an enhanced image
        let enhancedImageData = enhanceImageForQR(context, canvas.width, canvas.height);
        code = jsQR(enhancedImageData.data, enhancedImageData.width, enhancedImageData.height);
        
        // Save enhanced image for debugging
        setLastCapture(canvas.toDataURL('image/jpeg', 0.7));
      }
      
      if (code && code.data) {
        setQrData(code.data);
        setDebugInfo(`QR data found: ${code.data.substring(0, 20)}${code.data.length > 20 ? '...' : ''}`);
        stopCamera(); // Stop camera after successful scan
      } else {
        // Try multiple regions of the image at different sizes
        const regions = [
          // Center region (50% of width/height)
          { x: canvas.width * 0.25, y: canvas.height * 0.25, 
            width: canvas.width * 0.5, height: canvas.height * 0.5 },
          // Full image at lower resolution
          { x: 0, y: 0, width: canvas.width, height: canvas.height, scale: 0.5 }
        ];
        
        for (const region of regions) {
          // Create a temporary canvas for the region
          const tempCanvas = document.createElement('canvas');
          const tempCtx = tempCanvas.getContext('2d');
          
          const regionWidth = region.scale ? canvas.width * region.scale : region.width;
          const regionHeight = region.scale ? canvas.height * region.scale : region.height;
          
          tempCanvas.width = regionWidth;
          tempCanvas.height = regionHeight;
          
          if (region.scale) {
            // Scale the entire image
            tempCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 
                              0, 0, regionWidth, regionHeight);
          } else {
            // Extract specific region
            tempCtx.drawImage(canvas, region.x, region.y, region.width, region.height,
                              0, 0, regionWidth, regionHeight);
          }
          
          const regionData = tempCtx.getImageData(0, 0, regionWidth, regionHeight);
          const regionCode = jsQR(regionData.data, regionWidth, regionHeight);
          
          if (regionCode && regionCode.data) {
            setQrData(regionCode.data);
            setDebugInfo(`QR found in region: ${JSON.stringify({
              x: region.x, y: region.y, 
              width: region.width, height: region.height,
              scale: region.scale || 1
            })}`);
            stopCamera();
            return;
          }
        }
        
        setError("No QR code found. Make sure it's clearly visible and try again.");
        setDebugInfo("No QR code detected in any region");
      }
    } catch (err) {
      setError(`Error processing image: ${err.message}`);
      console.error("QR processing error:", err);
      setDebugInfo(`Error: ${err.message}`);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleReset = () => {
    setQrData(null);
    setError(null);
    setDebugInfo(null);
    setLastCapture(null);
    startCamera();
  };

  const currentDate = new Date().toISOString().split('T')[0];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-[#0a0a0a]">
      <div className="w-full max-w-md flex flex-col h-[100svh]">
        {/* Camera/Scanner Area */}
        <div className="relative  flex-grow bg-black">
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
              <div className="w-72 h-72 border-2 border-white/70 rounded-lg">
                <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
                <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>
              </div>
            </div>
          )}

          {/* Stop Camera Button */}
          {isCameraActive && (
            <button
              onClick={()=>{stopCamera;navigate('/');}}
              className="absolute top-4 right-4 p-2 bg-red-500  text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          
          {/* Capture Frame Button */}
          {isCameraActive && (
            <button
              onClick={captureFrame}
              disabled={isCapturing}
              className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 px-6 w-[70%] py-3 ${
                isCapturing ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'
              } text-white rounded-full transition-colors shadow-lg flex items-center justify-center`}
            >
              <Camera className="w-5 h-5 mr-2" />
              <h1 className="w-full">{isCapturing ? "Processing..." : "Capture QR Code"}</h1>
              
            </button>
          )}
        </div>

        {/* Bottom Panel */}
        <div className="bg-white dark:bg-[#0a0a0a] p-4 rounded-t-xl shadow-lg">
          <div className="flex items-center justify-center mb-4">
            <Camera className="w-6 h-6 mr-2 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">QR Scanner</h1>
            <span className="ml-auto text-xs text-gray-500 ">{currentDate}</span>
          </div>

          {/* QR Data Display */}
          {qrData && (
            <div className="mt-2 p-4 bg-gray-50 dark:bg-[#0a0a0a] rounded-lg border border-gray-200 dark:border-[#ffffff24]">
              <p className="text-gray-700 dark:text-gray-400 text-sm mb-1">Scanned Result:</p>
              <p className="text-gray-900 dark:text-gray-400 font-medium break-all bg-white dark:bg-[#0a0a0a] p-3 rounded border border-gray-200 dark:border-[#ffffff24]">{qrData}</p>

               <div className="mt-4 md:hidden pt-4 border-t border-gray-200 dark:border-[#ffffff1a]">
                  <div className="flex items-center justify-center gap-3">
                    <Link to={qrData} className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">Pay</Link>
                  </div>
                </div>
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
            <div className="mt-2 p-3 bg-red-50 dark:bg-[#0a0a0a] rounded-lg border border-red-200 dark:border-[#ffffff24] transition-opacity">
              <p className="text-red-600 text-sm">{error}</p>
              <div className="flex space-x-2 mt-3">
                <button
                  onClick={captureFrame}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  disabled={isCapturing || !isCameraActive}
                >
                  <Camera className="w-4 h-4 mr-2" /> Try Again
                </button>
                {!isCameraActive && (
                  <button
                    onClick={startCamera}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" /> Restart Camera
                  </button>
                )}
              </div>
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

        {/* Last Capture Preview (for debugging) */}
        {lastCapture && !qrData && (
          <div className="mt-4 p-2 bg-gray-100 dark:bg-[#0a0a0a] rounded border border-gray-200 dark:border-[#ffffff24]">
            <p className="text-xs text-gray-500 mb-1">Last Capture:</p>
            <div className="flex justify-center">
              <img 
                src={lastCapture} 
                alt="Last captured frame" 
                className="max-h-32 rounded border border-gray-300 dark:border-[#ffffff24]" 
              />
            </div>
            <details className="mt-2">
              <summary className="text-xs text-blue-600 cursor-pointer">Debug Info</summary>
              <pre className="text-xs mt-1 p-2 bg-gray-800 text-green-400 rounded overflow-auto max-h-24">
                {debugInfo || "No debug information available"}
              </pre>
            </details>
          </div>
        )}

        {/* App version */}
        <p className="text-xs text-gray-400 text-center mt-4">
          QR Scanner v1.1.0
        </p>
      </div>
    </div>
  </div>
);
};

export default Scanner;