import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

// API Configuration
const API_URL = "http://localhost:5000/api";

// Type Definitions
export interface User {
  _id: string;
  name: string;
  email: string;
  rollNo: string;
  department: string;
  year: string;
  degree: string;
  gender: string;
  phone: string;
  role?: string;
}

export type AuthErrorCode =
  | "CREDENTIALS_MISSING"
  | "INVALID_CREDENTIALS"
  | "ACCOUNT_DEACTIVATED"
  | "EMAIL_NOT_VERIFIED"
  | "SERVER_ERROR"
  | "ACCOUNT_NOT_FOUND"
  | "INVALID_REACTIVATION_CREDENTIALS"
  | "REACTIVATION_CREDENTIALS_MISSING"
  | "EMAIL_MISSING"
  | "EMAIL_REQUIRED"
  | "REACTIVATION_DATA_MISSING"
  | "INVALID_OTP"
  | "REACTIVATION_ERROR"
  | "REACTIVATION_OTP_ERROR";

export interface AuthError {
  success: false;
  message: string;
  code: AuthErrorCode;
  email?: string;
  canReactivate?: boolean;
}

interface RegistrationData {
  name: string;
  rollNo: string;
  department: string;
  email: string;
  phone: string;
  password: string;
  year: string;
  degree: string;
  gender: string;
}

// Response type definitions
interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

interface AuthResponse extends ApiResponse {
  token?: string;
  user?: User;
}

interface CheckAccountStatusResponse extends ApiResponse {
  isActive: boolean;
}

interface VerifyResetTokenResponse extends ApiResponse {
  email?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  errorCode: AuthErrorCode | null;
  isAuthenticated: boolean;

  // Auth Methods
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegistrationData) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  verifyResetToken: (
    token: string
  ) => Promise<{ valid: boolean; email?: string }>;

  // Account Status Methods
  checkAccountStatus: (email: string) => Promise<{ isActive: boolean }>;
  deactivateAccount: (password: string) => Promise<void>;
  reactivateAccount: (email: string, password: string) => Promise<void>;

  // OTP Methods
  sendReactivationOTP: (email: string) => Promise<void>;
  verifyReactivationOTP: (email: string, otp: string) => Promise<void>;

  // Helpers
  clearError: () => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<AuthErrorCode | null>(null);
  const { toast } = useToast();

  // Configure Axios
  const setupAxiosInterceptors = () => {
    // Request interceptor
    axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle token expiration
        if (error.response?.status === 401) {
          // If not on auth page and token expired
          const currentPath = window.location.pathname;
          if (!currentPath.includes("/auth")) {
            localStorage.removeItem("token");
            setUser(null);
            toast({
              title: "Session Expired",
              description: "Please log in again to continue.",
              variant: "destructive",
            });
            window.location.href = "/auth?mode=login";
          }
        }
        return Promise.reject(error);
      }
    );
  };

  // Handle errors consistently
  const handleAuthError = (
    err: any
  ): { message: string; code: AuthErrorCode } => {
    const responseData = err.response?.data as AuthError;
    const errorMessage =
      responseData?.message || "An unexpected error occurred";
    const errorCode = responseData?.code || "SERVER_ERROR";

    setError(errorMessage);
    setErrorCode(errorCode);
    console.error(`Auth error (${errorCode}):`, err);

    return { message: errorMessage, code: errorCode };
  };

  // Initialize auth state
  useEffect(() => {
    setupAxiosInterceptors();

    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (token) {
          // Get current user data
          const response = await axios.get<AuthResponse>(`${API_URL}/auth/me`);
          console.log(response);

          if (response.data.success && response.data.user) {
            setUser(response.data.user);
          }
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        // Clear potentially invalid token
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const clearError = () => {
    setError(null);
    setErrorCode(null);
  };

  // Auth Methods
  const login = async (email: string, password: string) => {
    try {
      clearError();
      setLoading(true);

      const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, {
        email,
        password,
      });

      if (response.data.success && response.data.token && response.data.user) {
        // Store token
        localStorage.setItem("token", response.data.token);

        // Set user state
        setUser(response.data.user);

        toast({
          title: "Login Successful",
          description: `Welcome back, ${response.data.user.name}!`,
        });
      }
    } catch (err) {
      const { message, code } = handleAuthError(err);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegistrationData) => {
    try {
      clearError();
      setLoading(true);

      const response = await axios.post<AuthResponse>(
        `${API_URL}/auth/register`,
        data
      );

      if (response.data.success && response.data.token && response.data.user) {
        // Store token
        localStorage.setItem("token", response.data.token);

        // Set user state
        setUser(response.data.user);

        toast({
          title: "Registration Successful",
          description: `Welcome, ${response.data.user.name}!`,
        });
      }
    } catch (err) {
      const { message } = handleAuthError(err);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);

      // Call backend logout endpoint
      await axios.get<ApiResponse>(`${API_URL}/auth/logout`);

      // Clear local storage and state
      localStorage.removeItem("token");
      setUser(null);

      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (err) {
      console.error("Logout error:", err);
      // Still clear on frontend even if backend fails
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      clearError();
      setLoading(true);

      const response = await axios.post<ApiResponse>(
        `${API_URL}/auth/forgot-password`,
        { email }
      );

      if (response.data.success) {
        toast({
          title: "Email Sent",
          description:
            "Password reset instructions have been sent to your email.",
        });
      }
    } catch (err) {
      const { message } = handleAuthError(err);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const verifyResetToken = async (token: string) => {
    try {
      clearError();
      setLoading(true);

      const response = await axios.post<VerifyResetTokenResponse>(
        `${API_URL}/auth/verify-reset-token`,
        { token }
      );

      if (response.data.success) {
        return { valid: true, email: response.data.email };
      }
      return { valid: false };
    } catch (err) {
      handleAuthError(err);
      return { valid: false };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      clearError();
      setLoading(true);

      const response = await axios.post<ApiResponse>(
        `${API_URL}/auth/reset-password`,
        { token, password }
      );

      if (response.data.success) {
        toast({
          title: "Password Reset",
          description:
            "Your password has been reset successfully. You can now login with your new password.",
        });
      }
    } catch (err) {
      const { message } = handleAuthError(err);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Account Status Methods
  const checkAccountStatus = async (email: string) => {
    try {
      clearError();
      setLoading(true);

      const response = await axios.post<CheckAccountStatusResponse>(
        `${API_URL}/auth/check-account-status`,
        { email }
      );

      return { isActive: response.data.isActive };
    } catch (err) {
      handleAuthError(err);
      return { isActive: false };
    } finally {
      setLoading(false);
    }
  };

  const deactivateAccount = async (password: string) => {
    try {
      clearError();
      setLoading(true);

      const response = await axios.put<ApiResponse>(
        `${API_URL}/auth/deactivate-account`,
        { password }
      );

      if (response.data.success) {
        // Clear auth data
        localStorage.removeItem("token");
        setUser(null);

        toast({
          title: "Account Deactivated",
          description: "Your account has been successfully deactivated.",
        });
      }
    } catch (err) {
      const { message } = handleAuthError(err);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const reactivateAccount = async (email: string, password: string) => {
    try {
      clearError();
      setLoading(true);

      const response = await axios.put<AuthResponse>(
        `${API_URL}/auth/reactivate`,
        { email, password }
      );

      if (response.data.success && response.data.token && response.data.user) {
        // Store token
        localStorage.setItem("token", response.data.token);

        // Set user state
        setUser(response.data.user);

        toast({
          title: "Account Reactivated",
          description: "Your account has been successfully reactivated.",
        });
      }
    } catch (err) {
      const { message } = handleAuthError(err);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // OTP Methods
  const sendReactivationOTP = async (email: string) => {
    try {
      clearError();
      setLoading(true);

      const response = await axios.post<ApiResponse>(
        `${API_URL}/auth/reactivate/send-otp`,
        { email }
      );

      if (response.data.success) {
        toast({
          title: "OTP Sent",
          description: "A verification code has been sent to your email.",
        });
      }
    } catch (err) {
      const { message } = handleAuthError(err);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const verifyReactivationOTP = async (email: string, otp: string) => {
    try {
      clearError();
      setLoading(true);

      const response = await axios.put<AuthResponse>(
        `${API_URL}/auth/reactivate/verify-otp`,
        { email, otp }
      );

      if (response.data.success && response.data.token && response.data.user) {
        // Store token
        localStorage.setItem("token", response.data.token);

        // Set user state
        setUser(response.data.user);

        toast({
          title: "Account Reactivated",
          description:
            "Your account has been successfully reactivated with OTP verification.",
        });
      }
    } catch (err) {
      const { message } = handleAuthError(err);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        errorCode,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        verifyResetToken,
        checkAccountStatus,
        deactivateAccount,
        reactivateAccount,
        sendReactivationOTP,
        verifyReactivationOTP,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for using auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
