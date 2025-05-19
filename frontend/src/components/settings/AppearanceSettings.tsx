import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Moon, Paintbrush, Save, Sun } from "lucide-react";

const AppearanceSettings = ({ updateTheme, toast }) => {
  const [currentTheme, setCurrentTheme] = useState("system");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch current theme on component mount
  useEffect(() => {
    const isDarkMode =
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    const isSystemTheme = !("theme" in localStorage);

    setCurrentTheme(
      isDarkMode
        ? isSystemTheme
          ? "system"
          : "dark"
        : isSystemTheme
        ? "system"
        : "light"
    );
  }, []);

  const setTheme = async (theme) => {
    setIsLoading(true);

    try {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
        localStorage.theme = "dark";
      } else if (theme === "light") {
        document.documentElement.classList.remove("dark");
        localStorage.theme = "light";
      } else {
        localStorage.removeItem("theme");
        const systemIsDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        if (systemIsDark) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }

      setCurrentTheme(theme);
      await updateTheme(theme);

      toast({
        title: "Theme Updated",
        description: `Theme set to ${theme} mode.`,
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update theme. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
      console.error("Error updating theme:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-2xl font-bold dark:text-white">
          Appearance
        </CardTitle>
        <CardDescription className="dark:text-gray-400">
          Customize how SwapStay looks on your device
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Paintbrush className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <h3 className="text-lg font-medium dark:text-white">Theme</h3>
          </div>
          <Separator className="dark:bg-gray-700" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card
              className={`cursor-pointer hover:border-blue-500 transition-colors ${
                currentTheme === "light"
                  ? "border-blue-500 ring-2 ring-blue-500"
                  : ""
              } dark:bg-gray-700 dark:border-gray-600`}
              onClick={() => setTheme("light")}
            >
              <CardContent className="p-4 flex flex-col items-center justify-center space-y-2">
                <Sun className="h-8 w-8 text-yellow-500" />
                <h4 className="font-medium dark:text-white">Light</h4>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer hover:border-blue-500 transition-colors ${
                currentTheme === "dark"
                  ? "border-blue-500 ring-2 ring-blue-500"
                  : ""
              } dark:bg-gray-700 dark:border-gray-600`}
              onClick={() => setTheme("dark")}
            >
              <CardContent className="p-4 flex flex-col items-center justify-center space-y-2">
                <Moon className="h-8 w-8 text-indigo-500" />
                <h4 className="font-medium dark:text-white">Dark</h4>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer hover:border-blue-500 transition-colors ${
                currentTheme === "system"
                  ? "border-blue-500 ring-2 ring-blue-500"
                  : ""
              } dark:bg-gray-700 dark:border-gray-600`}
              onClick={() => setTheme("system")}
            >
              <CardContent className="p-4 flex flex-col items-center justify-center space-y-2">
                <div className="flex">
                  <Sun className="h-8 w-8 text-yellow-500" />
                  <Moon className="h-8 w-8 text-indigo-500 -ml-2" />
                </div>
                <h4 className="font-medium dark:text-white">System</h4>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppearanceSettings;
