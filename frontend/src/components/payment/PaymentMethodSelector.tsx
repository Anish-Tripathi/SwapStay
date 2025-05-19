import React from "react";
import { CreditCard, Banknote, Smartphone } from "lucide-react";

interface PaymentMethodSelectorProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  paymentMethod,
  setPaymentMethod,
}) => {
  const methods = [
    {
      id: "card",
      name: "Credit Card",
      icon: <CreditCard className="w-6 h-6" />,
    },
    {
      id: "upi",
      name: "UPI / QR",
      icon: <Smartphone className="w-6 h-6" />,
    },
    {
      id: "cash",
      name: "Cash",
      icon: <Banknote className="w-6 h-6" />,
    },
  ];

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center dark:text-gray-200">
        <svg
          className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          ></path>
        </svg>
        Select Payment Method
      </h3>
      <div className="grid grid-cols-3 gap-4">
        {methods.map((method) => (
          <button
            key={method.id}
            className={`flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-all ${
              paymentMethod === method.id
                ? "border-indigo-600 bg-indigo-50 shadow-md dark:border-indigo-500 dark:bg-gray-700"
                : "border-gray-200 hover:border-indigo-300 dark:border-gray-600 dark:hover:border-indigo-400"
            }`}
            onClick={() => setPaymentMethod(method.id)}
          >
            <div
              className={`mb-2 ${
                paymentMethod === method.id
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {method.icon}
            </div>
            <span
              className={`font-medium ${
                paymentMethod === method.id
                  ? "text-indigo-700 dark:text-indigo-300"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              {method.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
