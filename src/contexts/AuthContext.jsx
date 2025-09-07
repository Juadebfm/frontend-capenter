import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

// Create custom hooks
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // clean up in cases where the user is already stored - good to have.
  () => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  // Load state
  const [isLoading, setIsLoading] = useState(false);
  // Error state
  const [error, setError] = useState(null);

  // Endpoint we need to hit to get this data
  const API_URL =
    "https://e-commerce-backend-beta-lemon.vercel.app/api/auth" ||
    "http://localhost:3001";

  useEffect(() => {
    if (token && !user) {
      fetchProfile();
    }
  }, [token]);

  // Helpers: save session
  const saveSession = (tokenValue, userValue) => {
    setToken(tokenValue);
    setUser(userValue);
    localStorage.setItem("token", tokenValue);
    localStorage.setItem("user", JSON.stringify(userValue));
  };

  // Helpers: save session
  const clearSession = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // Register
  const register = async (name, email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || `Error ${res.status}`);

      // response --
      saveSession(data.token, data.user);
      return data;
    } catch (error) {
      setError(error.message);

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Login
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || `Error ${res.status}`);

      saveSession(data.token, data.user);
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Profile
  const fetchProfile = async () => {
    if (!token) return null;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || `Error ${res.status}`);

      if (data?.user) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      // token becomes invalid we should log out silently
      clearSession();
      setError(error.message);

      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    clearSession();
  };

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
