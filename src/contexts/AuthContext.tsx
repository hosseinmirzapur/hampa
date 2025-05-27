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
import {
  gql,
  useMutation,
  ApolloClient,
  useApolloClient,
} from "@apollo/client";

const REQUEST_OTP_MUTATION = gql`
  mutation RequestOtp($requestOtpInput: RequestOtpInput!) {
    requestOtp(requestOtpInput: $requestOtpInput)
  }
`;

const VERIFY_OTP_MUTATION = gql`
  mutation VerifyOtpAndRegisterUser(
    $verifyOtpAndRegisterUserInput: VerifyOtpAndRegisterUserInput!
  ) {
    verifyOtpAndRegisterUser(
      verifyOtpAndRegisterUserInput: $verifyOtpAndRegisterUserInput
    ) {
      id
      phone
      name
      email
      avatarUrl
      bio
    }
  }
`;

interface PhoneVerification {
  phoneNumber: string;
  timeLeft: number;
  attemptsLeft: number;
  error?: ReactNode;
  verifyLoading: boolean;
  resendLoading: boolean;
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
  verifyLoading: boolean;
  resendLoading: boolean;
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
  const client = useApolloClient();
  const [user, setUser] = useLocalStorage<User | null>("hampa-user", null);
  const [isLoading, setIsLoading] = useState(true);
  const [phoneVerification, setPhoneVerification] = useState<PhoneVerification>(
    {
      phoneNumber: "",
      timeLeft: 0,
      attemptsLeft: 3,
      error: null,
      verifyLoading: false,
      resendLoading: false,
    }
  );

  const [requestOtpMutation] = useMutation(REQUEST_OTP_MUTATION);
  const [verifyOtpAndRegisterUserMutation] = useMutation(VERIFY_OTP_MUTATION);

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
      timeLeft: 0,
      attemptsLeft: 3,
      error: null,
      verifyLoading: false,
      resendLoading: false,
    });
  };

  const login = async (phoneNumber: string): Promise<boolean> => {
    try {
      setPhoneVerification((prev) => ({
        ...prev,
        phoneNumber,
        resendLoading: true,
        timeLeft: 180,
        attemptsLeft: 3,
        error: null,
      }));

      const { data, errors } = await requestOtpMutation({
        variables: { requestOtpInput: { phone: phoneNumber } },
      });

      setPhoneVerification((prev) => ({ ...prev, resendLoading: false }));

      if (data?.requestOtp) {
        console.log("requestOtp mutation successful, returning true");
        return true;
      } else {
        const errorMessage = errors?.[0]?.message || "خطا در ارسال کد تایید";
        setPhoneVerification((prev) => ({
          ...prev,
          error: errorMessage,
        }));
        console.log("requestOtp mutation failed, returning false");
        return false;
      }
    } catch (error: unknown) {
      console.error("Login error:", error);
      setPhoneVerification((prev) => ({
        ...prev,
        resendLoading: false,
        error: error instanceof Error ? error.message : "خطا در ارسال کد تایید",
      }));
      return false;
    }
  };

  const verifyOtp = async (otp: string): Promise<boolean> => {
    try {
      if (phoneVerification.attemptsLeft <= 0) {
        setPhoneVerification((prev) => ({
          ...prev,
          error: "تعداد تلاش‌های مجاز به پایان رسیده است.",
        }));
        return false;
      }

      setPhoneVerification((prev) => ({ ...prev, verifyLoading: true }));

      // Keep the mock "123456" check for now as requested by the user
      if (otp === "123456") {
        const { data, errors } = await verifyOtpAndRegisterUserMutation({
          variables: {
            verifyOtpAndRegisterUserInput: {
              phone: phoneVerification.phoneNumber,
              otp,
            },
          },
        });

        setPhoneVerification((prev) => ({ ...prev, verifyLoading: false }));

        if (data?.verifyOtpAndRegisterUser) {
          const userProfile = data.verifyOtpAndRegisterUser;
          setUser(userProfile);
          resetVerification();
          return true;
        } else {
          const errorMessage = errors?.[0]?.message || "کد تایید اشتباه است.";
          setPhoneVerification((prev) => ({
            ...prev,
            attemptsLeft: prev.attemptsLeft - 1,
            timeLeft: prev.attemptsLeft === 1 ? 180 : prev.timeLeft,
            error: errorMessage,
          }));
          return false;
        }
      } else {
        setPhoneVerification((prev) => ({ ...prev, verifyLoading: false }));
        // Decrement attempts and set error for incorrect mock OTP
        setPhoneVerification((prev) => ({
          ...prev,
          attemptsLeft: prev.attemptsLeft - 1,
          timeLeft: prev.attemptsLeft === 1 ? 180 : prev.timeLeft,
          error: "کد تایید اشتباه است.",
        }));
        return false;
      }
    } catch (error: unknown) {
      console.error("OTP verification error:", error);
      setPhoneVerification((prev) => ({
        ...prev,
        verifyLoading: false,
        error: error instanceof Error ? error.message : "خطا در تایید کد تایید",
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
        verifyLoading: phoneVerification.verifyLoading,
        resendLoading: phoneVerification.resendLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
