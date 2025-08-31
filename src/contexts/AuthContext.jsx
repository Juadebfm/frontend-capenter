import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

// Create custom hooks
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Endpoint we need to hit to get this data
  const API_URL =
    "https://e-commerce-backend-beta-lemon.vercel.app/api/auth" ||
    "http://localhost:3001";

  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token]);

  // Special functions being sent out
  const register = async (name, email, password) => {};
  const login = async (email, password) => {};
  const fetchProfile = async () => {};
  const logout = async () => {};

  const contextValue = {
    // States
    user,
    token,
    isLoading,
    error,

    // functions
    register,
    login,
    fetchProfile,
    logout,

    // Auth Check
    isAuthenticated: !!token && !!user,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
