import { Home, Camera, FileText, Users } from "lucide-react";

const ListingTips = () => {
  return (
    <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-t-4 border-purple-500 dark:border-purple-600">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-100">
        <Users className="h-5 w-5 text-purple-500 dark:text-purple-400" />
        Listing Tips
      </h3>
      <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
        <li className="flex items-start gap-2">
          <div className="bg-purple-100 dark:bg-purple-900/70 rounded-full p-1 mt-0.5">
            <Home className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          <span>
            Be specific about the room location to help potential roommates find
            it easily.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <div className="bg-purple-100 dark:bg-purple-900/70 rounded-full p-1 mt-0.5">
            <Camera className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          <span>
            Upload clear, well-lit photos of the room from different angles.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <div className="bg-purple-100 dark:bg-purple-900/70 rounded-full p-1 mt-0.5">
            <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          <span>
            Provide a detailed description including nearby facilities and any
            restrictions.
          </span>
        </li>
      </ul>
    </div>
  );
};

export default ListingTips;
