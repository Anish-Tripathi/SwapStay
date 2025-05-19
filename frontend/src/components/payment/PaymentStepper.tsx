import React from "react";

interface PaymentStepperProps {
  activeStep: number;
}

const PaymentStepper: React.FC<PaymentStepperProps> = ({ activeStep }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {[1, 2, 3].map((step) => (
          <React.Fragment key={step}>
            <div
              className={`flex flex-col items-center ${
                activeStep >= step ? "text-indigo-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  activeStep >= step
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step}
              </div>
              <span className="text-sm font-medium">
                {step === 1
                  ? "Details"
                  : step === 2
                  ? "Processing"
                  : "Confirmation"}
              </span>
            </div>
            {step < 3 && (
              <div
                className={`w-16 h-1 ${
                  activeStep >= step + 1 ? "bg-indigo-600" : "bg-gray-200"
                }`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default PaymentStepper;
