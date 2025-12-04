import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../services/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import authAPI from "../services/authAPI";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authType, setAuthType] = useState(null); // 'firebase' or 'jwt'

  // Check for existing JWT authentication on mount
  useEffect(() => {
    const checkJWTAuth = async () => {
      const token = authAPI.getStoredToken();
      
      if (token) {
        try {
          const response = await authAPI.getCurrentUser();
          setUser(response.user);
          setAuthType('jwt');
          setLoading(false);
          return;
        } catch (error) {
          console.error('JWT auth check failed:', error);
          authAPI.removeToken();
        }
      }
      
      // If no JWT auth, check Firebase auth
      const unsub = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          setUser(firebaseUser);
          setAuthType('firebase');
        } else {
          setUser(null);
          setAuthType(null);
        }
        setLoading(false);
      });
      
      return () => unsub();
    };

    checkJWTAuth();
  }, []);

  // JWT Authentication methods
  const loginWithJWT = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      setUser(response.user);
      setAuthType('jwt');
      return response;
    } catch (error) {
      throw error;
    }
  };

  const registerWithJWT = async (name, email, password) => {
    try {
      const response = await authAPI.register(name, email, password);
      setUser(response.user);
      setAuthType('jwt');
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Universal logout method
  const logout = async () => {
    try {
      if (authType === 'jwt') {
        await authAPI.logout();
      } else if (authType === 'firebase') {
        await signOut(auth);
      }
      
      setUser(null);
      setAuthType(null);
    } catch (error) {
      console.error("Error signing out:", error);
      // Force logout locally even if API call fails
      setUser(null);
      setAuthType(null);
      if (authType === 'jwt') {
        authAPI.removeToken();
      }
    }
  };

  const value = {
    user,
    loading,
    authType,
    logout,
    loginWithJWT,
    registerWithJWT
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
