import React, { useState } from "react";
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
  KeyRound,
  Mail,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ForgotPasswordFormProps {
  onSubmit: (email: string) => Promise<void>;
  switchAuthMode: (mode: string) => void;
}

export const ForgotPasswordForm = ({
  onSubmit,
  switchAuthMode,
}: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      await onSubmit(email);
      setSuccess("Password reset instructions have been sent to your email.");
    } catch (err: any) {
      setError(err.message || "Failed to process request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-purple-400 shadow-lg dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-center text-purple-900 dark:text-purple-300 text-2xl font-bold">
          <KeyRound className="h-6 w-6 inline mr-2" />
          Reset Password
        </CardTitle>
        <CardDescription className="text-center dark:text-gray-400">
          Enter your email to receive a password reset link
        </CardDescription>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="dark:text-gray-300">
              Email
            </Label>
            <div className="relative">
              <Mail className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-700 dark:hover:bg-purple-600"
            disabled={isSubmitting || !email}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col space-y-2 pt-0">
        <div className="text-sm text-center text-gray-500 dark:text-gray-400">
          Remembered your password?{" "}
          <button
            type="button"
            onClick={() => switchAuthMode("login")}
            className="text-purple-600 hover:underline dark:text-purple-400 font-medium"
          >
            Back to Login
          </button>
        </div>
        <div className="text-sm text-center text-gray-500 dark:text-gray-400">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => switchAuthMode("signup")}
            className="text-purple-600 hover:underline dark:text-purple-400 font-medium"
          >
            Sign up
          </button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ForgotPasswordForm;
