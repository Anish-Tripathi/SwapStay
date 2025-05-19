import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LogIn,
  Mail,
  Lock,
  KeyRound,
  HelpCircle,
  UserPlus,
  Loader2,
} from "lucide-react";

interface LoginFormProps {
  formData: {
    email: string;
    password: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onForgotPassword: () => void;
  switchAuthMode: (mode: string) => void;
}

export const LoginForm = ({
  formData,
  handleInputChange,
  isLoading,
  onSubmit,
  onForgotPassword,
  switchAuthMode,
}: LoginFormProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <Card className="w-full max-w-3xl border-purple-400 shadow-lg dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-purple-900 dark:text-purple-300 text-2xl font-bold">
          <LogIn className="h-6 w-6 inline mr-2" />
          Login
        </CardTitle>
        <CardDescription className="text-center dark:text-gray-400">
          Welcome back! Please login to continue.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={onSubmit}
          className="space-y-4"
          onKeyDown={handleKeyDown}
        >
          <div className="space-y-2">
            <Label htmlFor="email" className="dark:text-gray-300">
              Email
            </Label>
            <div className="relative">
              <Mail className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="xyz@gmail.com"
                value={formData.email}
                onChange={handleInputChange}
                className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="dark:text-gray-300">
              Password
            </Label>
            <div className="relative">
              <Lock className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div className="text-right">
              <Button
                variant="link"
                className="p-0 h-auto font-normal text-sm dark:text-gray-300"
                onClick={onForgotPassword}
                type="button"
              >
                <KeyRound className="h-3 w-3 mr-1" />
                Forgot Password?
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full dark:hover:bg-purple-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter>
        <p className="text-sm text-muted-foreground dark:text-gray-400 text-center w-full">
          <HelpCircle className="h-4 w-4 inline mr-1" />
          Don't have an account?{" "}
          <Button
            variant="link"
            className="p-0 h-auto font-normal dark:text-gray-300"
            onClick={() => switchAuthMode("signup")}
          >
            <UserPlus className="h-3 w-3 inline mr-1" />
            Sign Up
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
};
