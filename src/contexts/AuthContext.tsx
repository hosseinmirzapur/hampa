import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "../types";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { generateDefaultUser } from "../utils/mockData";

interface PhoneVerification {
  phoneNumber: string;
  isVerifying?: boolean;
  timeLeft: number;
  attemptsLeft: number;
  error?: ReactNode;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phoneNumber: string) => Promise<boolean>;
  verifyOtp: (otp: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
  phoneVerification: PhoneVerification;
  resetVerification: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useLocalStorage<User | null>("hampa-user", null);
  const [isLoading, setIsLoading] = useState(true);
  const [phoneVerification, setPhoneVerification] = useState<PhoneVerification>(
    {
      phoneNumber: "",
      isVerifying: false,
      timeLeft: 0,
      attemptsLeft: 3,
      error: null, // Initialize error state
    }
  );

  // Handle countdown timer for OTP verification
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (phoneVerification.timeLeft > 0) {
      timer = setInterval(() => {
        setPhoneVerification((prev) => ({
          ...prev,
          timeLeft: prev.timeLeft - 1,
        }));
      }, 1000);
    } else if (
      phoneVerification.timeLeft === 0 &&
      phoneVerification.attemptsLeft === 0
    ) {
      // Reset attempts after timeout
      setPhoneVerification((prev) => ({
        ...prev,
        attemptsLeft: 3,
      }));
    }

    // Simulate loading delay
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => {
      clearInterval(timer);
      clearTimeout(loadingTimer);
    };
  }, [phoneVerification.timeLeft, phoneVerification.attemptsLeft]);

  const resetVerification = () => {
    setPhoneVerification({
      phoneNumber: "",
      isVerifying: false,
      timeLeft: 0,
      attemptsLeft: 3,
      error: null, // Reset error state
    });
  };

  const login = async (phoneNumber: string): Promise<boolean> => {
    try {
      // In a real app, this would send an OTP to the phoneNumber
      // For this MVP, we'll simulate the process
      setPhoneVerification((prev) => ({
        ...prev,
        phoneNumber,
        isVerifying: true,
        timeLeft: 180, // 3 minutes
        attemptsLeft: 3,
        error: null, // Clear previous errors on new login attempt
      }));
      return true;
    } catch (error: unknown) {
      // Use unknown type for catch clause variable
      console.error("Login error:", error);
      setPhoneVerification((prev) => ({
        ...prev,
        isVerifying: false,
        error: error instanceof Error ? error.message : "خطا در ارسال کد تایید", // Safely access error message
      }));
      return false;
    }
  };

  const verifyOtp = async (otp: string): Promise<boolean> => {
    try {
      // In a real app, this would verify the OTP with a backend service
      // For this MVP, we'll accept any 6-digit OTP (mock "123456")

      if (phoneVerification.attemptsLeft <= 0) {
        setPhoneVerification((prev) => ({
          ...prev,
          error: "تعداد تلاش‌های مجاز به پایان رسیده است.", // Set error for no attempts left
        }));
        return false;
      }

      if (otp === "123456") {
        // Check if user exists, if not create a new user
        if (!user || user.phoneNumber !== phoneVerification.phoneNumber) {
          const newUser = generateDefaultUser(phoneVerification.phoneNumber);
          setUser(newUser);
        }

        resetVerification();
        return true;
      } else {
        // Decrement attempts and set error
        setPhoneVerification((prev) => ({
          ...prev,
          attemptsLeft: prev.attemptsLeft - 1,
          timeLeft: prev.attemptsLeft === 1 ? 180 : prev.timeLeft, // Set cooldown if out of attempts
          error: "کد تایید اشتباه است.", // Set error for incorrect OTP
        }));
        return false;
      }
    } catch (error: unknown) {
      // Use unknown type for catch clause variable
      console.error("OTP verification error:", error);
      setPhoneVerification((prev) => ({
        ...prev,
        isVerifying: false,
        error: error instanceof Error ? error.message : "خطا در تایید کد تایید", // Safely access error message
      }));
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    resetVerification();
    // In a real app, you would also invalidate tokens, etc.
  };

  const updateUser = (updatedUser: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updatedUser });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        verifyOtp,
        logout,
        updateUser,
        phoneVerification,
        resetVerification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
