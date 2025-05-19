import { ArrowLeft, Loader2 } from "lucide-react";

const PaymentActions = ({
  onBack,
  onPay,
  isProcessing,
  totalCost,
}: {
  onBack: () => void;
  onPay: () => void;
  isProcessing: boolean;
  totalCost: number;
}) => {
  return (
    <div className="flex justify-between items-center">
      <button
        onClick={onBack}
        className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
      >
        <ArrowLeft className="w-5 h-5 mr-1" /> Back to Selection
      </button>

      <button
        onClick={onPay}
        className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all"
        disabled={isProcessing}
      >
        {isProcessing ? (
          <div className="flex items-center">
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Processing...
          </div>
        ) : (
          <div className="flex items-center">Pay ₹{totalCost}</div>
        )}
      </button>
    </div>
  );
};

export default PaymentActions;
