import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [pendingEmail, setPendingEmail] = useState(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    
    // Check for pending verification
    const pendingEmailStorage = authService.getPendingVerificationEmail();
    if (pendingEmailStorage) {
      setNeedsVerification(true);
      setPendingEmail(pendingEmailStorage);
    }
    
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      if (data.requires_verification) {
        setNeedsVerification(true);
        setPendingEmail(data.email);
        toast.error('Please verify your email before logging in.');
        return { requiresVerification: true, email: data.email };
      }
      setUser(data.user);
      toast.success('Login successful!');
      return { success: true, user: data.user };
    } catch (error) {
      if (error.response?.data?.requires_verification) {
        setNeedsVerification(true);
        setPendingEmail(error.response.data.email);
        toast.error('Please verify your email first.');
        return { requiresVerification: true, email: error.response.data.email };
      }
      toast.error(error.response?.data?.error || 'Login failed');
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      if (data.requires_verification) {
        setNeedsVerification(true);
        setPendingEmail(data.email);
        toast.success('Registration successful! Please verify your email.');
        return { requiresVerification: true, email: data.email };
      }
      setUser(data.user);
      toast.success('Registration successful!');
      return { success: true, user: data.user };
    } catch (error) {
      const errorMsg = error.response?.data?.email?.[0] || 
                       error.response?.data?.username?.[0] || 
                       error.response?.data?.password?.[0] ||
                       'Registration failed';
      toast.error(errorMsg);
      throw error;
    }
  };

  const verifyEmail = async (email, code) => {
    try {
      const data = await authService.verifyEmail(email, code);
      setUser(data.user);
      setNeedsVerification(false);
      setPendingEmail(null);
      toast.success('Email verified successfully!');
      return { success: true, user: data.user };
    } catch (error) {
      const errorMsg = error.response?.data?.verification_code?.[0] ||
                       error.response?.data?.email?.[0] ||
                       'Verification failed';
      toast.error(errorMsg);
      throw error;
    }
  };

  const resendVerification = async (email) => {
    try {
      await authService.resendVerificationCode(email);
      toast.success('New verification code sent to your email!');
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to resend code');
      throw error;
    }
  };

  const googleLogin = async (idToken) => {
    try {
      const data = await authService.googleLogin(idToken);
      setUser(data.user);
      toast.success('Google sign in successful!');
      return { success: true, user: data.user };
    } catch (error) {
      toast.error(error.response?.data?.error || 'Google login failed');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setNeedsVerification(false);
      setPendingEmail(null);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      needsVerification,
      pendingEmail,
      login, 
      register, 
      verifyEmail,
      resendVerification,
      googleLogin,
      logout, 
      updateUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};