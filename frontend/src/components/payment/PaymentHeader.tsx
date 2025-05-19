import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PaymentHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white flex justify-between items-center dark:from-indigo-800 dark:to-purple-800">
      <div className="flex items-center">
        <div className="bg-white p-2 rounded-full mr-3 dark:bg-gray-700">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 9L12 4L21 9V20H3V9Z"
              className="dark:fill-indigo-300"
              fill="#6366F1"
            />
            <path
              d="M9 16H15V20H9V16Z"
              className="dark:fill-purple-400"
              fill="#4F46E5"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold dark:text-gray-100">
          SwapStay Payment
        </h2>
      </div>
      <button
        onClick={() => navigate("/guest-house")}
        className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors dark:hover:bg-gray-700"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>
    </div>
  );
};

export default PaymentHeader;
