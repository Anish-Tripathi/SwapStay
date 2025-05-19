import React, { useState } from "react";
import { AlertTriangle, X, Check, Info } from "lucide-react";
import { ConfirmationDialogProps } from "./types/booking";

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  paymentStatus = "pending",
}) => {
  const [showCharges, setShowCharges] = useState(false);
  const showCancellationCharges = paymentStatus === "completed";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="text-yellow-500" size={24} />
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        </div>

        <p className="text-gray-700 mb-4">{message}</p>

        {showCancellationCharges && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-yellow-700 font-medium">
                Since payment is completed, cancellation charges may apply.
              </div>
              <button
                onClick={() => setShowCharges(!showCharges)}
                className="text-yellow-600 hover:underline text-sm flex items-center gap-1"
              >
                {showCharges ? "Hide Details" : "View Charges"}
              </button>
            </div>

            {showCharges && (
              <ul className="text-sm text-gray-700 mt-2 list-disc list-inside">
                <li>
                  <strong>10%</strong> deduction if canceled more than 48 hours
                  in advance.
                </li>
                <li>
                  <strong>50%</strong> deduction if canceled within 24–48 hours.
                </li>
                <li>
                  <strong>No refund</strong> for cancellations within 24 hours
                  of check-in.
                </li>
              </ul>
            )}
          </div>
        )}

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onCancel}
            className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <X size={16} />
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            <Check size={16} />
            Confirm Cancellation
          </button>
        </div>
      </div>
    </div>
  );
};
