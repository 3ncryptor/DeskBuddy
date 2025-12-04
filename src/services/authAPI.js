const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002';

/**
 * Make API request with error handling
 */
const apiRequest = async (url, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

/**
 * Get stored JWT token from localStorage
 */
export const getStoredToken = () => {
  try {
    return localStorage.getItem('deskbuddy_token');
  } catch (error) {
    console.error('Error reading token from localStorage:', error);
    return null;
  }
};

/**
 * Store JWT token in localStorage
 */
export const storeToken = (token) => {
  try {
    localStorage.setItem('deskbuddy_token', token);
  } catch (error) {
    console.error('Error storing token in localStorage:', error);
  }
};

/**
 * Remove JWT token from localStorage
 */
export const removeToken = () => {
  try {
    localStorage.removeItem('deskbuddy_token');
  } catch (error) {
    console.error('Error removing token from localStorage:', error);
  }
};

/**
 * Make authenticated API request
 */
const authenticatedRequest = (url, options = {}) => {
  const token = getStoredToken();
  
  return apiRequest(url, {
    ...options,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });
};

/**
 * Register new user
 */
export const register = async (name, email, password) => {
  const data = await apiRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  
  // Store token on successful registration
  if (data.token) {
    storeToken(data.token);
  }
  
  return data;
};

/**
 * Login user
 */
export const login = async (email, password) => {
  const data = await apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  
  // Store token on successful login
  if (data.token) {
    storeToken(data.token);
  }
  
  return data;
};

/**
 * Get current user info
 */
export const getCurrentUser = async () => {
  return await authenticatedRequest('/api/auth/me');
};

/**
 * Logout user
 */
export const logout = async () => {
  try {
    await authenticatedRequest('/api/auth/logout', {
      method: 'POST',
    });
  } catch (error) {
    // Even if logout request fails, remove token locally
    console.error('Logout request failed:', error);
  } finally {
    // Always remove token from localStorage
    removeToken();
  }
};

/**
 * Check if user has valid token
 */
export const isAuthenticated = () => {
  const token = getStoredToken();
  return !!token;
};

export default {
  register,
  login,
  getCurrentUser,
  logout,
  isAuthenticated,
  getStoredToken,
  storeToken,
  removeToken,
};