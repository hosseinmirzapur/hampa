import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "../types";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { gql, useMutation, useApolloClient } from "@apollo/client";
import { toast } from "react-toastify";
import { UPDATE_USER_PROFILE_MUTATION } from "../graphql/user.graphql";
import { authTokenVar } from "../apolloClient"; // Import authTokenVar

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

const LOGIN_MUTATION = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      accessToken
      user {
        id
        phone
        name
        email
        avatarUrl
        bio
      }
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
  authToken: string | null; // Add authToken to context type
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
  const [authToken, setAuthToken] = useLocalStorage<string | null>(
    "hampa-auth-token",
    null
  ); // New: Store auth token
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
  const [loginMutation] = useMutation(LOGIN_MUTATION);
  const [updateUserProfileMutation] = useMutation(UPDATE_USER_PROFILE_MUTATION); // Initialize mutation

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
        // The backend now returns a success message, not the OTP code.
        // We can optionally show a toast message to the user.
        toast.success(data.requestOtp); // Display the success message from the backend
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

      // The "123456" mock OTP check has been removed from the backend.
      // Now, always proceed with actual OTP verification.
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
        // After successful OTP verification/registration, call the login mutation to get the token
        const { data: loginData, errors: loginErrors } = await loginMutation({
          variables: {
            loginInput: {
              phone: phoneVerification.phoneNumber,
              password: "mock_password", // Use a mock password as the backend expects one
            },
          },
        });

        if (loginData?.login) {
          const { accessToken, user: userProfile } = loginData.login;
          setUser(userProfile);
          setAuthToken(accessToken); // Updates localStorage
          authTokenVar(accessToken); // Update reactive variable
          resetVerification();
          client.resetStore();
          return true;
        } else {
          const errorMessage =
            loginErrors?.[0]?.message || "خطا در ورود پس از تایید OTP";
          setPhoneVerification((prev) => ({
            ...prev,
            error: errorMessage,
          }));
          return false;
        }
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
    setAuthToken(null); // Clears localStorage
    authTokenVar(null); // Clear reactive variable
    resetVerification();
    // In a real app, you would also invalidate tokens, etc.
  };

  const updateUser = async (updatedUser: Partial<User>) => {
    if (!user) return;

    try {
      const { data, errors } = await updateUserProfileMutation({
        variables: {
          updateUserProfileInput: {
            name: updatedUser.name,
          },
        },
      });

      if (data?.updateUserProfile) {
        setUser(data.updateUserProfile);
        toast.success("پروفایل با موفقیت به‌روزرسانی شد.");
      } else {
        const errorMessage =
          errors?.[0]?.message || "خطا در به‌روزرسانی پروفایل";
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error: unknown) {
      console.error("Error updating user profile:", error);
      const errorMessage =
        error instanceof Error ? error.message : "خطا در به‌روزرسانی پروفایل";
      toast.error(errorMessage);
      throw error;
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
        authToken, // New: Expose authToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
