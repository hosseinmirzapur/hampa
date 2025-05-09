import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateDefaultUser } from '../utils/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phoneNumber: string) => Promise<boolean>;
  verifyOtp: (otp: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
  phoneVerification: {
    phoneNumber: string;
    isVerifying: boolean;
    timeLeft: number;
    attemptsLeft: number;
  };
  resetVerification: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useLocalStorage<User | null>('hampa-user', null);
  const [isLoading, setIsLoading] = useState(true);
  const [phoneVerification, setPhoneVerification] = useState({
    phoneNumber: '',
    isVerifying: false,
    timeLeft: 0,
    attemptsLeft: 3,
  });

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
    } else if (phoneVerification.timeLeft === 0 && phoneVerification.attemptsLeft === 0) {
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
  }, [phoneVerification.timeLeft]);

  const resetVerification = () => {
    setPhoneVerification({
      phoneNumber: '',
      isVerifying: false,
      timeLeft: 0,
      attemptsLeft: 3,
    });
  };

  const login = async (phoneNumber: string): Promise<boolean> => {
    try {
      // In a real app, this would send an OTP to the phoneNumber
      // For this MVP, we'll simulate the process
      setPhoneVerification({
        phoneNumber,
        isVerifying: true,
        timeLeft: 180, // 3 minutes
        attemptsLeft: 3,
      });
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const verifyOtp = async (otp: string): Promise<boolean> => {
    try {
      // In a real app, this would verify the OTP with a backend service
      // For this MVP, we'll accept any 6-digit OTP (mock "123456")
      
      if (phoneVerification.attemptsLeft <= 0) {
        return false;
      }

      if (otp === '123456') {
        // Check if user exists, if not create a new user
        if (!user || user.phoneNumber !== phoneVerification.phoneNumber) {
          const newUser = generateDefaultUser(phoneVerification.phoneNumber);
          setUser(newUser);
        }
        
        resetVerification();
        return true;
      } else {
        // Decrement attempts
        setPhoneVerification((prev) => ({
          ...prev,
          attemptsLeft: prev.attemptsLeft - 1,
          timeLeft: prev.attemptsLeft === 1 ? 180 : prev.timeLeft, // Set cooldown if out of attempts
        }));
        return false;
      }
    } catch (error) {
      console.error('OTP verification error:', error);
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