import React, { forwardRef, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import {
  CheckCircle2,
  CreditCard,
  Banknote,
  Smartphone,
  Download,
  X,
} from "lucide-react";

interface BookingDetails {
  roomNumber: string | number;
  numberOfGuests: number;
  numberOfDays: number;
  totalCost: number;
  studentName?: string;
  guestNames?: string;
  guestHouseName?: string;
  roomPrice?: number;
}

interface ReceiptProps {
  bookingDetails: BookingDetails;
  paymentMethod: string;
  navigate: (path: string) => void;
}

const Receipt = forwardRef<HTMLDivElement, ReceiptProps>(
  ({ bookingDetails, paymentMethod, navigate }, ref) => {
    const receiptRef = useRef<HTMLDivElement>(null);
    const receiptNumber = `SW-${new Date().getFullYear()}-${Math.floor(
      Math.random() * 10000
    )
      .toString()
      .padStart(4, "0")}`;

    const currentDate = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const transactionId = `TXN-${Math.floor(Math.random() * 100000000)
      .toString()
      .padStart(8, "0")}`;

    const paymentDateTime = new Date().toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const handleDownloadPDF = async () => {
      if (!receiptRef.current) return;

      try {
        // Create a clone of the receipt to avoid affecting the original
        const receiptClone = receiptRef.current.cloneNode(true) as HTMLElement;
        receiptClone.style.position = "absolute";
        receiptClone.style.left = "-9999px";
        receiptClone.style.top = "0";
        receiptClone.style.width = receiptRef.current.offsetWidth + "px";
        document.body.appendChild(receiptClone);

        // Apply force-color styles to the clone
        receiptClone.classList.add("force-color-mode");

        // Hide controls in the clone
        const buttons = receiptClone.querySelectorAll(".receipt-controls");
        buttons.forEach((button) => {
          (button as HTMLElement).style.display = "none";
        });

        const canvas = await html2canvas(receiptClone, {
          scale: 2,
          useCORS: true,
          backgroundColor: null, // Set to null to make it transparent
          ignoreElements: (element) => {
            // Ignore elements that might cause issues
            return element.classList.contains("receipt-controls");
          },
          logging: true,
          allowTaint: true,
          scrollX: 0,
          scrollY: 0,
        });

        document.body.removeChild(receiptClone);

        const imgData = canvas.toDataURL("image/png", 1.0);
        const pdf = new jsPDF("p", "mm", "a4");
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = pageWidth - 20;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const yPos = imgHeight < pageHeight ? (pageHeight - imgHeight) / 2 : 10;

        pdf.addImage(imgData, "PNG", 10, yPos, imgWidth, imgHeight);

        const pdfName = `SwapStay-Receipt-${bookingDetails.roomNumber}-${
          new Date().toISOString().split("T")[0]
        }.pdf`;

        pdf.save(pdfName);
        showNotification("Success", "Receipt successfully downloaded");
      } catch (error) {
        console.error("Error generating PDF:", error);
        showNotification("Error", "Failed to download receipt");
      }
    };

    const showNotification = (title: string, message: string) => {
      const notification = document.createElement("div");
      notification.className = "download-notification";
      notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: white;
        color: #111827;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.15);
        padding: 15px 20px;
        z-index: 1000;
        transition: all 0.3s ease;
        transform: translateX(120%);
        display: flex;
        align-items: center;
      `;

      // Dark mode styles for notification
      const darkModeStyles = `
        @media (prefers-color-scheme: dark) {
          .download-notification {
            background-color: #1f2937;
            color: #f3f4f6;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
          }
        }
      `;

      const styleElement = document.createElement("style");
      styleElement.innerHTML = darkModeStyles;
      document.head.appendChild(styleElement);

      notification.innerHTML = `
        ${
          title === "Success"
            ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 12px;"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-.997-6l7.07-7.071-1.414-1.414-5.656 5.657-2.829-2.829-1.414 1.414L11.003 16z" fill="#10B981"/></svg>'
            : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 12px;"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z" fill="#EF4444"/></svg>'
        }
        <div>
          <h3 style="margin: 0 0 5px 0; font-size: 16px; font-weight: 600;">${title}</h3>
          <p style="margin: 0; font-size: 14px;">${message}</p>
        </div>
      `;

      document.body.appendChild(notification);

      setTimeout(() => {
        notification.style.transform = "translateX(0)";
      }, 100);

      setTimeout(() => {
        notification.style.transform = "translateX(120%)";
        setTimeout(() => {
          document.body.removeChild(notification);
          document.head.removeChild(styleElement);
        }, 300);
      }, 3000);
    };

    return (
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-xl overflow-hidden relative">
        {/* Controls */}
        <div className="absolute top-4 right-4 flex gap-2 receipt-controls">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-200 px-4 py-2 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </button>
          <button
            onClick={() => navigate("/guest-house")}
            className="flex items-center bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Receipt content */}
        <div
          ref={receiptRef}
          className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
          style={{
            fontFamily: "Arial, sans-serif",
            marginTop: 0,
            minHeight: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <div className="p-8 pt-5 bg-gradient-to-r from-purple-700 to-purple-900 dark:from-purple-800 dark:to-purple-950 text-white flex justify-between items-center">
            <h1 className="text-2xl font-bold">SwapStay</h1>
            <div className="text-right" style={{ marginRight: "180px" }}>
              <p className="text-sm opacity-80">Receipt #{receiptNumber}</p>
              <p className="text-sm opacity-80">Date: {currentDate}</p>
            </div>
          </div>

          {/* Title */}
          <div className="w-full text-center py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
            <h2 className="text-xl font-semibold text-purple-800 dark:text-purple-300 mb-1">
              Payment Receipt
            </h2>
            <p className="text-sm text-purple-600 dark:text-purple-400">
              Thank you for your booking!
            </p>
          </div>

          {/* Content container */}
          <div className="flex-grow p-6">
            {/* Student Details */}
            <div className="mb-6 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border-l-4 border-indigo-500 dark:border-indigo-400">
              <h3 className="text-indigo-800 dark:text-indigo-300 font-bold text-sm uppercase tracking-wider mb-2 flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
                Student Details
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Name
                  </p>
                  <p className="font-medium dark:text-gray-100">
                    {bookingDetails.studentName}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Room Number
                  </p>
                  <p className="font-medium dark:text-gray-100">
                    {bookingDetails.roomNumber}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Guest House
                  </p>
                  <p className="font-medium dark:text-gray-100">
                    {bookingDetails.guestHouseName}
                  </p>
                </div>
              </div>
            </div>

            {/* Guest Details */}
            <div className="mb-6 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border-l-4 border-purple-500 dark:border-purple-400">
              <h3 className="text-purple-800 dark:text-purple-300 font-bold text-sm uppercase tracking-wider mb-2 flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  ></path>
                </svg>
                Guest Details
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Number of Guests
                  </p>
                  <p className="font-medium dark:text-gray-100">
                    {bookingDetails.numberOfGuests}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Guest Names
                  </p>
                  <p className="font-medium dark:text-gray-100">
                    {bookingDetails.guestNames || "Not specified"}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Duration of Stay
                  </p>
                  <p className="font-medium dark:text-gray-100">
                    {bookingDetails.numberOfDays} days
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <h3 className="text-purple-800 dark:text-purple-300 font-bold text-sm uppercase tracking-wider mb-3 flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  ></path>
                </svg>
                Payment Details
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Amount Paid
                  </p>
                  <p className="font-bold text-lg text-purple-900 dark:text-purple-300">
                    ₹{bookingDetails.totalCost}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Payment Method
                  </p>
                  <p className="font-medium capitalize flex items-center dark:text-gray-100">
                    {paymentMethod === "card" && (
                      <CreditCard className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                    )}
                    {paymentMethod === "upi" && (
                      <Smartphone className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                    )}
                    {paymentMethod === "cash" && (
                      <Banknote className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                    )}
                    {paymentMethod}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Transaction ID
                  </p>
                  <p className="font-medium text-purple-700 dark:text-purple-400">
                    {transactionId}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Date & Time
                  </p>
                  <p className="font-medium dark:text-gray-100">
                    {paymentDateTime}
                  </p>
                </div>
              </div>

              {/* Status indicator */}
              <div className="mt-4 flex items-center justify-center bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 p-2 rounded-md">
                <CheckCircle2 className="w-5 h-5 mr-2" />
                <span className="font-medium">Payment Successful</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className="bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 dark:from-indigo-900/10 dark:via-purple-900/10 dark:to-indigo-900/10 p-4 text-center rounded-b-lg"
            style={{
              position: "relative",
              zIndex: 10,
              marginTop: "auto",
            }}
          >
            <div className="flex justify-center mb-2">
              <div className="px-2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 9L12 4L21 9V20H3V9Z"
                    fill="#6366F1"
                    className="dark:fill-indigo-400"
                  />
                  <path
                    d="M9 16H15V20H9V16Z"
                    fill="#4F46E5"
                    className="dark:fill-indigo-600"
                  />
                </svg>
              </div>
            </div>
            <p className="text-purple-800 dark:text-purple-300 font-medium mb-1">
              Thank you for choosing SwapStay!
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              For support, contact: help@swapstay.com
            </p>
          </div>
        </div>

        {/* CSS for PDF generation */}
        <style>{`
          .force-light-mode {
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          .force-light-mode * {
            background-color: #ffffff !important;
            color: #000000 !important;
            border-color: #e5e7eb !important;
          }
          .force-light-mode .bg-gradient-to-r {
            background-image: none !important;
            background-color: #f3f4f6 !important;
          }
        `}</style>
      </div>
    );
  }
);

Receipt.displayName = "Receipt";

export default Receipt;
