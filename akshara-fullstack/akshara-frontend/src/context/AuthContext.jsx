import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import {
  AuthAPI,
  LearnerAPI,
} from "../api/resources";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [learner, setLearner] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMe = useCallback(async () => {
    const token = localStorage.getItem("access");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await LearnerAPI.me();
      setLearner(response.data);
    } catch (error) {
      console.error("Could not load learner:", error);

      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      setLearner(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMe();
  }, [loadMe]);

  const register = async (payload) => {
    const response = await AuthAPI.register(payload);

    localStorage.setItem(
      "access",
      response.data.access
    );

    localStorage.setItem(
      "refresh",
      response.data.refresh
    );

    setLearner(response.data.learner);

    return response.data;
  };

  const login = async (email, password) => {
    const response = await AuthAPI.login(
      email,
      password
    );

    localStorage.setItem(
      "access",
      response.data.access
    );

    localStorage.setItem(
      "refresh",
      response.data.refresh
    );

    setLearner(response.data.learner);

    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setLearner(null);
  };

  const refreshLearner = async () => {
    const response = await LearnerAPI.me();

    setLearner(response.data);

    return response.data;
  };

  return (
    <AuthContext.Provider
      value={{
        learner,
        loading,
        register,
        login,
        logout,
        refreshLearner,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* VERY IMPORTANT */
export function useAuth() {
  return useContext(AuthContext);
}