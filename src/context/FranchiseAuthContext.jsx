import { createContext, useContext, useState, useEffect, useCallback } from "react";
import API from "../api/axiosInstance";

/**
 * FranchiseAuthContext
 * 
 * Provides franchise authentication state and credit management
 * throughout the site application.
 */
const FranchiseAuthContext = createContext(null);

export function FranchiseAuthProvider({ children }) {
  const [franchise, setFranchise] = useState(null);
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const franchiseToken = localStorage.getItem("franchise_token");
  const userRole = localStorage.getItem("user_role");

  /**
   * Check if user is a franchise
   */
  const isFranchise = userRole === "franchise" && !!franchiseToken;

  /**
   * Fetch franchise profile
   */
  const fetchFranchiseProfile = useCallback(async () => {
    if (!isFranchise) {
      setFranchise(null);
      return;
    }

    try {
      const res = await API.get("/franchise-profile/me");
      setFranchise(res.data?.data || null);
    } catch (err) {
      console.error("Failed to fetch franchise profile:", err);
      setFranchise(null);
    }
  }, [isFranchise]);

  /**
   * Fetch franchise credits
   */
  const fetchCredits = useCallback(async () => {
    if (!isFranchise) {
      setCredits(null);
      return;
    }

    try {
      const res = await API.get("/credits/my-credits");
      setCredits(res.data?.data || null);
    } catch (err) {
      console.error("Failed to fetch credits:", err);
      setCredits(null);
    }
  }, [isFranchise]);

  /**
   * Refresh both profile and credits
   */
  const refreshFranchiseData = useCallback(async () => {
    if (!isFranchise) return;
    await Promise.all([fetchFranchiseProfile(), fetchCredits()]);
  }, [isFranchise, fetchFranchiseProfile, fetchCredits]);

  /**
   * Check if has sufficient credits
   */
  const hasSufficientCredits = useCallback((requiredCredits) => {
    if (!isFranchise) return true;
    const currentCredits = credits?.credits ?? 0;
    return currentCredits >= requiredCredits;
  }, [isFranchise, credits]);

  /**
   * Get credit color indicator
   */
  const getCreditColor = useCallback(() => {
    if (!credits) return "secondary";
    const balance = credits.credits ?? 0;
    if (balance > 20) return "success";
    if (balance >= 10) return "warning";
    return "danger";
  }, [credits]);

  /**
   * Login function
   */
  const login = useCallback((token, role = "franchise") => {
    localStorage.setItem("franchise_token", token);
    localStorage.setItem("user_role", role);
    setIsAuthenticated(true);
    refreshFranchiseData();
  }, [refreshFranchiseData]);

  /**
   * Logout function
   */
  const logout = useCallback(() => {
    localStorage.removeItem("franchise_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("profile_image");
    setFranchise(null);
    setCredits(null);
    setIsAuthenticated(false);
  }, []);

  // Initial load
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      if (isFranchise) {
        setIsAuthenticated(true);
        await refreshFranchiseData();
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    init();
  }, [isFranchise, refreshFranchiseData]);

  // Auto-refresh credits every 30 seconds
  useEffect(() => {
    if (!isFranchise) return;

    const interval = setInterval(() => {
      fetchCredits();
    }, 30000);

    return () => clearInterval(interval);
  }, [isFranchise, fetchCredits]);

  const value = {
    // State
    franchise,
    credits,
    loading,
    isAuthenticated,
    isFranchise,

    // Credit info
    creditBalance: credits?.credits ?? 0,
    creditColor: getCreditColor(),

    // Actions
    login,
    logout,
    refreshFranchiseData,
    fetchCredits,
    hasSufficientCredits,
  };

  return (
    <FranchiseAuthContext.Provider value={value}>
      {children}
    </FranchiseAuthContext.Provider>
  );
}

/**
 * Hook to use franchise auth context
 */
export function useFranchiseAuth() {
  const context = useContext(FranchiseAuthContext);
  if (!context) {
    throw new Error(
      "useFranchiseAuth must be used within a FranchiseAuthProvider"
    );
  }
  return context;
}

export default FranchiseAuthContext;
