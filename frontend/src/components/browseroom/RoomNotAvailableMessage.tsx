import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

const RoomNotAvailableMessage = ({ theme }: { theme: "light" | "dark" }) => (
  <div className="max-w-3xl mx-auto px-4">
    <Card
      className={`w-full mx-auto my-8 shadow-xl border 
        ${
          theme === "dark"
            ? " dark:bg-gray-800/95 dark:border-gray-700 dark:hover:shadow-lg dark:hover:shadow-gray-800/50"
            : "bg-white"
        }
      `}
    >
      <CardHeader>
        <div className="flex items-center gap-3">
          <AlertCircle
            className={`w-6 h-6 ${
              theme === "dark" ? "text-purple-300" : "text-purple-900"
            }`}
          />
          <div>
            <CardTitle
              className={`text-2xl font-semibold ${
                theme === "dark" ? "text-purple-300" : "text-purple-900"
              }`}
            >
              Room Not Available for Swap
            </CardTitle>
            <CardDescription
              className={`${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Your room is not marked as available for swap.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p
          className={`mb-4 ml-2 leading-relaxed ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          To browse and request room swaps, you need to mark your room as
          available. Please update your room listing to enable this feature.
        </p>
      </CardContent>

      <CardFooter>
        <Button
          onClick={() => (window.location.href = "/list-room")}
          className="w-full sm:w-auto bg-purple-700 hover:bg-purple-800 dark:bg-purple-600 dark:hover:bg-purple-500 dark:text-white font-semibold transition"
        >
          Update Room Listing
        </Button>
      </CardFooter>
    </Card>
  </div>
);

export default RoomNotAvailableMessage;
