import React, { useEffect, useRef, useState, useCallback } from "react";
import QrScanner from "qr-scanner";
import {
  Camera, X, AlertCircle, Loader, CheckCircle, XCircle,
  IndianRupee, Tag, Calendar, FileText, StickyNote, HelpCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../AxiosMeta/ApiAxios";

const EXPENSE_CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Utilities",
  "Entertainment",
  "Healthcare",
  "Housing",
  "Education",
  "Insurance",
  "Savings/Investments",
  "Grocery",
  "Recharge",
  "Other Miscellaneous",
];

const formatDateToString = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const parseUpiQrData = (data) => {
  try {
    let queryString = "";
    if (data.startsWith("upi://")) {
      const qIndex = data.indexOf("?");
      if (qIndex !== -1) {
        queryString = data.substring(qIndex + 1);
      }
    } else {
      queryString = data;
    }
    const params = new URLSearchParams(queryString);
    return {
      payee: params.get("pa") || "",
      payeeName: params.get("pn") || "",
      amount: params.get("am") || "",
      description: params.get("tn") || params.get("pn") || "UPI Payment",
    };
  } catch {
    return { payee: "", payeeName: "", amount: "", description: "UPI Payment" };
  }
};

const buildUpiUrl = (rawScanData, amount, description) => {
  try {
    let queryString = "";
    if (rawScanData.startsWith("upi://")) {
      const qIndex = rawScanData.indexOf("?");
      if (qIndex !== -1) {
        queryString = rawScanData.substring(qIndex + 1);
      }
    } else {
      queryString = rawScanData;
    }

    const params = new URLSearchParams(queryString);
    
    if (amount) {
      const formattedAmount = parseFloat(amount).toFixed(2);
      params.set("am", formattedAmount);
    }
    
    if (description) {
      params.set("tn", description);
    }
    
    if (!params.has("cu")) {
      params.set("cu", "INR");
    }

    return `upi://pay?${params.toString()}`;
  } catch (e) {
    console.error("Error building UPI URL:", e);
    return rawScanData.startsWith("upi://") ? rawScanData : `upi://pay?${rawScanData}`;
  }
};

const Scanner = () => {
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);
  const visibilityHandlerRef = useRef(null);
  const navigate = useNavigate();

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Popup modes: null | "form" | "saving" | "payment-status"
  const [popupMode, setPopupMode] = useState(null);
  const [scannedUpiRaw, setScannedUpiRaw] = useState("");
  const [isUpi, setIsUpi] = useState(false);

  // Saved expense ID — needed to delete if payment fails
  const savedExpenseIdRef = useRef(null);

  // Expense form fields
  const [form, setForm] = useState({
    amount: "",
    source: "",
    date: formatDateToString(new Date()),
    description: "",
    note: "",
  });

  // ─── Camera ───────────────────────────────────────────────
  const stopCamera = () => {
    if (qrScannerRef.current) {
      try {
        qrScannerRef.current.stop();
        qrScannerRef.current.destroy();
        qrScannerRef.current = null;
      } catch (e) {
        console.error("Error stopping scanner:", e);
      }
    }
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const startCamera = useCallback(async () => {
    try {
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      const video = videoRef.current;
      if (!video) return;

      video.srcObject = stream;
      video.setAttribute("playsinline", true);
      video.onloadedmetadata = () => {
        video.play().catch((e) => setError(`Video error: ${e.message}`));
        setIsCameraActive(true);
        setError(null);

        qrScannerRef.current = new QrScanner(
          video,
          (result) => handleQrResult(result.data),
          {
            returnDetailedScanResult: true,
            highlightScanRegion: true,
            highlightCodeOutline: true,
            maxScansPerSecond: 5,
          }
        );
        qrScannerRef.current.start().catch((e) => setError(`Scanner error: ${e.message}`));
      };
    } catch (err) {
      if (err.name === "NotAllowedError") setError("Camera access denied. Please allow camera permissions.");
      else if (err.name === "NotFoundError") setError("No camera detected on this device.");
      else setError(`Camera error: ${err.message}`);
    }
  }, []);

  // ─── QR Result ────────────────────────────────────────────
  const handleQrResult = (data) => {
    if (qrScannerRef.current) {
      try { qrScannerRef.current.stop(); } catch { }
    }

    const upiDetected =
      data.includes("upi://") || data.includes("pa=") || data.includes("pn=") || data.includes("am=");

    setIsUpi(upiDetected);
    setScannedUpiRaw(data);

    if (upiDetected) {
      const parsed = parseUpiQrData(data);
      setForm({
        amount: parsed.amount || "",
        source: "Other Miscellaneous",
        date: formatDateToString(new Date()),
        description: parsed.description || "UPI Payment",
        note: parsed.payeeName ? `Paid to ${parsed.payeeName} (${parsed.payee})` : "",
      });
    } else {
      setForm({
        amount: "",
        source: "Other Miscellaneous",
        date: formatDateToString(new Date()),
        description: "QR Scan Payment",
        note: data.length < 120 ? data : "",
      });
    }

    if (navigator.vibrate) navigator.vibrate(100);
    setPopupMode("form");
  };

  // ─── Confirm: Save expense, then redirect to UPI ──────────
  const handleConfirm = async () => {
    if (!form.amount || !form.source || !form.description) {
      setError("Please fill in Amount, Category, and Description.");
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);
      setPopupMode("saving");

      const response = await api.post("/api/expenses", {
        ...form,
        date: new Date(form.date),
      });

      // Store the saved expense ID so we can delete it if payment fails
      savedExpenseIdRef.current =
        response.data?._id ||
        response.data?.id ||
        response.data?.expense?._id ||
        response.data?.expense?.id ||
        null;

      if (isUpi && scannedUpiRaw) {
        // Register visibilitychange listener BEFORE opening UPI app
        registerPaymentReturnListener();

        // Small delay so listener is attached before tab hides
        setTimeout(() => {
          const upiUrl = buildUpiUrl(scannedUpiRaw, form.amount, form.description);
          window.location.href = upiUrl;
        }, 300);
      } else {
        // Non-UPI: just saved, go to expenses
        setIsProcessing(false);
        navigate("/expenses");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to save expense.");
      setIsProcessing(false);
      setPopupMode("form");
    }
  };

  // ─── Visibility listener: fires when user returns from UPI ─
  const registerPaymentReturnListener = () => {
    // Remove any previous listener
    if (visibilityHandlerRef.current) {
      document.removeEventListener("visibilitychange", visibilityHandlerRef.current);
    }

    const handler = () => {
      if (document.visibilityState === "visible") {
        document.removeEventListener("visibilitychange", handler);
        visibilityHandlerRef.current = null;
        // Show "was payment done?" dialog
        setIsProcessing(false);
        setPopupMode("payment-status");
      }
    };

    visibilityHandlerRef.current = handler;
    document.addEventListener("visibilitychange", handler);
  };

  // ─── Payment Confirmed ─────────────────────────────────────
  const handlePaymentSuccess = () => {
    savedExpenseIdRef.current = null;
    navigate("/");
  };

  // ─── Payment Failed: delete the expense ───────────────────
  const handlePaymentFailed = async () => {
    setIsProcessing(true);
    try {
      if (savedExpenseIdRef.current) {
        await api.delete(`/api/expenses/${savedExpenseIdRef.current}`);
      }
    } catch (e) {
      console.error("Failed to delete expense:", e);
    } finally {
      savedExpenseIdRef.current = null;
      setIsProcessing(false);
      setPopupMode(null);
      setError(null);
      startCamera();
    }
  };

  // ─── Cancel form popup, resume scanning ───────────────────
  const handleCancel = () => {
    setPopupMode(null);
    setError(null);
    setIsProcessing(false);
    if (qrScannerRef.current) {
      qrScannerRef.current.start().catch(() => startCamera());
    } else {
      startCamera();
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
      if (visibilityHandlerRef.current) {
        document.removeEventListener("visibilitychange", visibilityHandlerRef.current);
      }
    };
  }, []);

  // ─── UI ───────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
      <div className="w-full max-w-md flex flex-col h-[100vh] relative overflow-hidden">

        {/* ── Camera View ── */}
        <div className="relative flex-grow bg-black">
          <video ref={videoRef} className="w-full h-full object-cover" playsInline />

          {/* Scan frame overlay */}
          {isCameraActive && !popupMode && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-72 h-72">
                <div className="w-72 h-72 border-2 border-white/30 rounded-2xl" />
                <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-blue-400 rounded-tl-2xl" />
                <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-blue-400 rounded-tr-2xl" />
                <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-blue-400 rounded-bl-2xl" />
                <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-blue-400 rounded-br-2xl" />
                <div
                  className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full"
                  style={{ animation: "scanLine 2s ease-in-out infinite" }}
                />
              </div>
            </div>
          )}

          {/* Top bar */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-10 pb-6 bg-gradient-to-b from-black/80 to-transparent">
            <div className="text-white font-semibold flex items-center gap-2">
              <Camera className="w-5 h-5" />
              <span>Scan & Pay</span>
            </div>
            <button
              onClick={() => { stopCamera(); navigate("/"); }}
              className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Bottom hint */}
          {isCameraActive && !popupMode && !error && (
            <div className="absolute bottom-8 left-4 right-4 bg-black/60 backdrop-blur-sm text-white py-2 px-4 rounded-full text-center text-sm">
              Point camera at any QR code to scan
            </div>
          )}
        </div>

        {/* ── Error Banner (outside popup) ── */}
        {error && !popupMode && (
          <div className="fixed top-16 left-0 right-0 mx-4 p-3 rounded-xl flex items-center gap-2 bg-red-50 text-red-600 dark:bg-red-900/20 z-50 shadow">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* ── Popup / Bottom Sheet ── */}
        {popupMode && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            {/* Backdrop — only closeable on "form" mode */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={popupMode === "form" ? handleCancel : undefined}
            />

            {/* Sheet */}
            <div className="relative w-full max-w-md bg-white dark:bg-[#111] rounded-t-3xl shadow-2xl max-h-[92vh] overflow-y-auto">

              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
              </div>

              {/* ══ SAVING STATE ══ */}
              {popupMode === "saving" && (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                    <Loader className="w-8 h-8 text-blue-500 animate-spin" />
                  </div>
                  <p className="text-gray-800 dark:text-white font-semibold">Saving expense...</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Opening your UPI app shortly</p>
                </div>
              )}

              {/* ══ PAYMENT STATUS ══ */}
              {popupMode === "payment-status" && (
                <div className="px-5 py-6">
                  <div className="flex flex-col items-center gap-3 mb-6">
                    <div className="w-16 h-16 rounded-full bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center">
                      <HelpCircle className="w-8 h-8 text-yellow-500" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white text-center">
                      Did the payment go through?
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                      Confirm if your UPI payment was successful. If not, the expense will be removed.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 pb-2">
                    <button
                      onClick={handlePaymentSuccess}
                      disabled={isProcessing}
                      className="w-full py-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Yes, Payment was Successful
                    </button>
                    <button
                      onClick={handlePaymentFailed}
                      disabled={isProcessing}
                      className="w-full py-4 rounded-xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
                    >
                      {isProcessing ? (
                        <><Loader className="w-5 h-5 animate-spin" /> Removing expense...</>
                      ) : (
                        <><XCircle className="w-5 h-5" /> No, Payment Failed</>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* ══ FORM STATE ══ */}
              {popupMode === "form" && (
                <>
                  {/* Header */}
                  <div className="px-5 pt-2 pb-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                        {isUpi ? "UPI Payment Scanned" : "QR Code Scanned"}
                      </h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {isUpi ? "Review details and confirm to pay & log" : "Fill details to log this expense"}
                      </p>
                    </div>
                    <button onClick={handleCancel} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10">
                      <X className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                    </button>
                  </div>

                  <div className="px-5 py-4 space-y-4">

                    {/* Amount */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                        <IndianRupee className="w-3.5 h-3.5" /> Amount *
                      </label>
                      <input
                        name="amount"
                        type="number"
                        value={form.amount}
                        onChange={handleFormChange}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Category */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5" /> Category *
                      </label>
                      <select
                        name="source"
                        value={form.source}
                        onChange={handleFormChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                      >
                        <option value="">Select Category</option>
                        {EXPENSE_CATEGORIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" /> Description *
                      </label>
                      <input
                        name="description"
                        type="text"
                        value={form.description}
                        onChange={handleFormChange}
                        placeholder="What is this expense for?"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Date */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" /> Date
                      </label>
                      <input
                        name="date"
                        type="date"
                        value={form.date}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Note */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                        <StickyNote className="w-3.5 h-3.5" /> Note <span className="normal-case font-normal">(optional)</span>
                      </label>
                      <textarea
                        name="note"
                        value={form.note}
                        onChange={handleFormChange}
                        placeholder="Add any additional details..."
                        rows={2}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                    </div>

                    {/* Error in form */}
                    {error && (
                      <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-600 dark:text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {error}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2 pb-2">
                      <button
                        onClick={handleCancel}
                        disabled={isProcessing}
                        className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleConfirm}
                        disabled={isProcessing}
                        className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                      >
                        {isProcessing ? (
                          <><Loader className="w-4 h-4 animate-spin" /> Saving...</>
                        ) : isUpi ? "Pay & Save" : "Save Expense"}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Scan line animation */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes scanLine {
              0%   { top: 5%; opacity: 0; }
              10%  { opacity: 1; }
              90%  { opacity: 1; }
              100% { top: 95%; opacity: 0; }
            }
          `
        }} />
      </div>
    </div>
  );
};

export default Scanner;