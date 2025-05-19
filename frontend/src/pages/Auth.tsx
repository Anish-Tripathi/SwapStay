import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import ActivationForm from "@/components/auth/ActivationForm";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [authMode, setAuthMode] = useState("login");
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    department: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    declaration: false,
    year: "",
    degree: "",
    gender: "",
  });
  const [deactivatedEmail, setDeactivatedEmail] = useState("");
  const [showReactivationModal, setShowReactivationModal] = useState(false);
  const returnPath = location.state?.returnTo || "/";

  // Handle password reset verification
  const isPasswordReset = location.search.includes("mode=reset-password");

  // Extract reset token from URL
  const resetToken = new URLSearchParams(location.search).get("token") || "";

  // Update auth mode based on URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const modeParam = queryParams.get("mode") || "login";

    setAuthMode(modeParam);
    setIsLogin(modeParam === "login");

    // Reset the forgot password state when URL changes to login or signup
    if (modeParam === "login" || modeParam === "signup") {
      setShowForgotPassword(false);
    }
  }, [location.search]);

  // The switchAuthMode function to reset forgot password state
  const switchAuthMode = (mode) => {
    setAuthMode(mode);
    setIsLogin(mode === "login");
    setShowForgotPassword(false); // Reset forgot password state

    if (mode === "login" || mode === "signup") {
      navigate(`/auth?mode=${mode}`);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle login form submission
  const handleLogin = async (loginData) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth?mode=login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(loginData),
        }
      );

      const data = await response.json();

      // Handle deactivated account
      if (response.status === 403 && data.deactivated) {
        setDeactivatedEmail(loginData.email);
        setShowReactivationModal(true);
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userId", data.user.id || data.user._id);

      toast({
        title: "Welcome back!",
        description: "You have been logged in.",
      });

      navigate(returnPath);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle signup form submission
  const handleSignup = async (signupData) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth?mode=signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(signupData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("isLoggedIn", "true");

      toast({
        title: "Account created successfully!",
        description: "Your account has been created and you are now logged in.",
      });

      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle forgot password request
  const handleForgotPassword = async (email) => {
    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setResetEmailSent(true);
        toast({
          title: "Password Reset Link Sent",
          description:
            "Check your email for instructions to reset your password",
          duration: 5000,
        });
        setResetEmail("");
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || "Failed to send reset link",
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
        duration: 3000,
      });
      console.error("Forgot password error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password reset
  const handleResetPassword = async (password, confirmPassword, token) => {
    setIsLoading(true);

    try {
      // Get the token from URL or localStorage
      const resetToken =
        token ||
        localStorage.getItem("resetToken") ||
        new URLSearchParams(location.search).get("token");

      if (!resetToken) {
        throw new Error("Reset token not found");
      }

      // Make API call to reset the password
      const response = await fetch(
        "http://localhost:5000/api/auth/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: resetToken,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      // Clear reset token
      localStorage.removeItem("resetToken");

      // Set a state to show password reset success
      setPasswordResetSuccess(true);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Password Reset Failed",
        description:
          error.message ||
          "Failed to reset your password. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Render appropriate form based on current state
  const renderAuthContent = () => {
    if (showForgotPassword) {
      return (
        <ForgotPasswordForm
          onSubmit={handleForgotPassword}
          switchAuthMode={switchAuthMode}
        />
      );
    } else if (isPasswordReset) {
      return (
        <ResetPasswordForm
          token={resetToken}
          onSubmit={handleResetPassword}
          switchAuthMode={switchAuthMode}
        />
      );
    } else if (authMode === "login") {
      return (
        <LoginForm
          formData={formData}
          handleInputChange={handleInputChange}
          isLoading={isLoading}
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin({
              email: formData.email,
              password: formData.password,
            });
          }}
          onForgotPassword={() => setShowForgotPassword(true)}
          switchAuthMode={switchAuthMode}
        />
      );
    } else if (authMode === "signup") {
      return (
        <SignupForm
          formData={formData}
          handleInputChange={handleInputChange}
          isLoading={isLoading}
          onSubmit={(e) => {
            e.preventDefault();
            if (!formData.declaration) {
              toast({
                variant: "destructive",
                title: "Declaration Required",
                description: "Please accept the declaration to continue.",
              });
              return;
            }
            if (formData.password !== formData.confirmPassword) {
              toast({
                variant: "destructive",
                title: "Password Mismatch",
                description: "Passwords do not match. Please try again.",
              });
              return;
            }
            handleSignup({
              name: formData.name,
              rollNo: formData.rollNo,
              department: formData.department,
              email: formData.email,
              phone: formData.phone,
              password: formData.password,
              year: formData.year,
              degree: formData.degree,
              gender: formData.gender,
            });
          }}
          switchAuthMode={switchAuthMode}
        />
      );
    } else if (authMode === "activate") {
      return <ActivationForm switchAuthMode={switchAuthMode} />;
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-purple-200 p-4 dark:bg-gradient-to-r dark:from-gray-900 dark:to-purple-900 transition-colors duration-200">
        {isLoading &&
          !showForgotPassword &&
          !resetEmailSent &&
          !isLogin &&
          !isPasswordReset && (
            <div className="fixed inset-0 bg-black/20 dark:bg-black/40 flex items-center justify-center z-50">
              <Card className="w-full max-w-md p-6 dark:bg-gray-800 dark:border-gray-700">
                <div className="text-center space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-purple-600 dark:text-purple-400" />
                  <p className="text-lg font-medium dark:text-white">
                    Verifying your link...
                  </p>
                  <p className="text-sm text-muted-foreground dark:text-gray-300">
                    Please wait while we verify your password reset link.
                  </p>
                </div>
              </Card>
            </div>
          )}
        {renderAuthContent()}
      </div>
      <Footer />
    </>
  );
};

export default Auth;
