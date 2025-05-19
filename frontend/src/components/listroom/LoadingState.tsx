import { Card } from "@/components/ui/card";

const LoadingState = () => {
  return (
    <Card className="border-none shadow-lg bg-white dark:bg-gray-800 dark:border-gray-700 text-center p-8">
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 dark:border-purple-400"></div>
      </div>
      <p className="mt-4 text-lg text-gray-700 dark:text-gray-200">
        Checking your listings...
      </p>
    </Card>
  );
};

export default LoadingState;
