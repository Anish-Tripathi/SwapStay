import React, { useRef, useState, useEffect } from "react";
import ReactDOM from "react-dom";

const MessChangeReceipt = ({ receiptData, onClose }) => {
  const [isPrintFrameReady, setIsPrintFrameReady] = useState(false);
  const printFrameRef = useRef(null);

  const getEffectiveDate = () => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() + 1);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Setup iframe for printing
  useEffect(() => {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.onload = () => setIsPrintFrameReady(true);
    document.body.appendChild(iframe);
    printFrameRef.current = iframe;

    return () => {
      document.body.removeChild(iframe);
    };
  }, []);

  const printReceipt = () => {
    if (!printFrameRef.current || !isPrintFrameReady) return;

    const iframeDoc = printFrameRef.current.contentDocument;
    if (!iframeDoc) return;

    const PrintableReceipt = () => (
      <html>
        <head>
          <title>Mess Change Receipt</title>
          <style>
            {`
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
              
              body { 
                font-family: 'Inter', sans-serif;
                background-color: white;
                margin: 0;
                padding: 20px;
              }
              .receipt { 
                width: 100%;
                max-width: 500px;
                margin: 0 auto;
              }
              .header { 
                background: linear-gradient(135deg, #6D28D9 0%, #8B5CF6 100%);
                color: white;
                padding: 24px;
                text-align: center;
                border-radius: 4px 4px 0 0;
              }
              .header h2 {
                margin: 0;
                font-weight: 600;
                font-size: 1.5rem;
              }
              .content { 
                padding: 24px;
                border: 1px solid #EDE9FE;
                border-top: none;
                border-radius: 0 0 4px 4px;
              }
              .section { 
                margin-bottom: 24px;
                border-bottom: 1px solid #EDE9FE;
                padding-bottom: 16px;
              }
              .section:last-child {
                border-bottom: none;
              }
              .section h3 {
                color: #6D28D9;
                font-size: 1.1rem;
                margin-top: 0;
                margin-bottom: 16px;
                font-weight: 600;
              }
              .info-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
              }
              .label {
                font-weight: 500;
                color: #6B7280;
              }
              .value {
                color: #111827;
              }
              .notice {
                background-color: #F5F3FF;
                border-left: 4px solid #8B5CF6;
                padding: 12px;
                border-radius: 0 4px 4px 0;
                margin-top: 24px;
              }
              .notice p {
                margin: 0;
                color: #6D28D9;
                font-size: 0.9rem;
              }
            `}
          </style>
        </head>
        <body>
          <div className="receipt">
            <div className="header">
              <h2>Mess Change Receipt</h2>
            </div>
            <div className="content">
              <div className="section">
                <div className="info-row">
                  <span className="label">Transaction ID:</span>
                  <span className="value">{receiptData.transactionId}</span>
                </div>
                <div className="info-row">
                  <span className="label">Date:</span>
                  <span className="value">
                    {new Date(receiptData.swapDate).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </span>
                </div>
              </div>

              <div className="section">
                <h3>Student Details</h3>
                <div className="info-row">
                  <span className="label">Name:</span>
                  <span className="value">{receiptData.studentName}</span>
                </div>
                <div className="info-row">
                  <span className="label">Student ID:</span>
                  <span className="value">{receiptData.studentId}</span>
                </div>
              </div>

              <div className="section">
                <h3>Mess Change Details</h3>
                <div className="info-row">
                  <span className="label">From:</span>
                  <span className="value">{receiptData.previousMess}</span>
                </div>
                <div className="info-row">
                  <span className="label">To:</span>
                  <span className="value">{receiptData.newMess}</span>
                </div>
                <div className="info-row">
                  <span className="label">Reason:</span>
                  <span className="value">{receiptData.reason}</span>
                </div>
                {receiptData.comments && (
                  <div className="info-row">
                    <span className="label">Comments:</span>
                    <span className="value">{receiptData.comments}</span>
                  </div>
                )}
              </div>

              <div className="section">
                <h3>Important Dates</h3>
                <div className="info-row">
                  <span className="label">Request Date:</span>
                  <span className="value">
                    {new Date(receiptData.swapDate).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">Effective From:</span>
                  <span className="value">{getEffectiveDate()}</span>
                </div>
              </div>

              <div className="notice">
                <p>
                  Please present this receipt at the mess office, hostel office
                  and mess manager to complete your change request.
                </p>
              </div>
            </div>
          </div>
        </body>
      </html>
    );

    // Render the component to iframe and print
    ReactDOM.render(<PrintableReceipt />, iframeDoc.documentElement, () => {
      setTimeout(() => {
        printFrameRef.current.contentWindow.print();
      }, 250);
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Receipt Preview */}
        <div className="receipt">
          <div className="bg-gradient-to-r from-purple-700 to-purple-500 text-white p-6 text-center rounded-t-lg">
            <h2 className="text-2xl font-bold">Mess Change Receipt</h2>
          </div>

          <div className="p-6">
            <div className="mb-6 pb-4 border-b border-purple-100 dark:border-purple-800">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  Transaction ID:
                </span>
                <span className="text-gray-800 dark:text-gray-200">
                  {receiptData.transactionId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  Date:
                </span>
                <span className="text-gray-800 dark:text-gray-200">
                  {new Date(receiptData.swapDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-400 mb-3">
                Student Details
              </h3>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  Name:
                </span>
                <span className="text-gray-800 dark:text-gray-200">
                  {receiptData.studentName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  Student ID:
                </span>
                <span className="text-gray-800 dark:text-gray-200">
                  {receiptData.studentId}
                </span>
              </div>
            </div>

            <div className="mb-6 pb-4 border-b border-purple-100 dark:border-purple-800">
              <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-400 mb-3">
                Mess Change Details
              </h3>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  From:
                </span>
                <span className="text-gray-800 dark:text-gray-200">
                  {receiptData.previousMess}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  To:
                </span>
                <span className="text-gray-800 dark:text-gray-200">
                  {receiptData.newMess}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  Reason:
                </span>
                <span className="text-gray-800 dark:text-gray-200">
                  {receiptData.reason}
                </span>
              </div>
              {receiptData.comments && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">
                    Comments:
                  </span>
                  <span className="text-gray-800 dark:text-gray-200">
                    {receiptData.comments}
                  </span>
                </div>
              )}
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-400 mb-3">
                Important Dates
              </h3>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  Request Date:
                </span>
                <span className="text-gray-800 dark:text-gray-200">
                  {new Date(receiptData.swapDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  Effective From:
                </span>
                <span className="text-gray-800 dark:text-gray-200">
                  {getEffectiveDate()}
                </span>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/30 border-l-4 border-purple-500 dark:border-purple-400 p-4 mb-6">
              <p className="text-purple-700 dark:text-purple-300 text-sm">
                Please present this receipt at the mess office, hostel office
                and mess manager to complete your change request.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            Close
          </button>
          <button
            onClick={printReceipt}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessChangeReceipt;
