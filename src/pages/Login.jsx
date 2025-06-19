import React, { useState } from "react";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, provider } from "../services/firebase";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { useToast } from '../components/ToastProvider';
import loginIllustration from '../assets/Login.svg';

const Login = () => {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithPopup(auth, provider);
      addToast({
        type: 'success',
        title: 'Login Successful',
        duration: 3500
      });
      navigate('/dashboard');
    } catch (error) {
      addToast({
        type: 'error',
        title: error.message || 'Google Login Failed',
        duration: 3500
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    if (!email || !password) {
      addToast({
        type: 'error',
        title: 'Please enter both email and password.',
        duration: 3500
      });
      return;
    }
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      addToast({
        type: 'success',
        title: 'Login Successful',
        duration: 3500
      });
      navigate('/dashboard');
    } catch (error) {
      addToast({
        type: 'error',
        title: error.message || 'Login Failed',
        duration: 3500
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!email || !password || !name) {
      addToast({
        type: 'error',
        title: 'Please fill all fields.',
        duration: 3500
      });
      return;
    }
    if (password.length < 6) {
      addToast({
        type: 'error',
        title: 'Password must be at least 6 characters.',
        duration: 3500
      });
      return;
    }
    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      addToast({
        type: 'success',
        title: 'Account Created',
        duration: 3500
      });
      navigate('/dashboard');
    } catch (error) {
      addToast({
        type: 'error',
        title: error.message || 'Signup Failed',
        duration: 3500
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) return addToast({
      type: 'error',
      title: 'Enter email to reset',
      duration: 3500
    });
    try {
      await sendPasswordResetEmail(auth, email);
      addToast({
        type: 'success',
        title: 'Reset email sent',
        duration: 3500
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: error.message || 'Failed to send reset link',
        duration: 3500
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'login') {
      handleEmailLogin();
    } else {
      handleSignup();
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">

        {/* Main Content */}
        <main className="login-main">
          <div className="login-content">
            {/* Left Side - Branding */}
            <div className="login-branding">
              <div className="brand-content">
                <div className="brand-logo">
                  <img src={loginIllustration} alt="DeskBuddy" />
                </div>
                <h2 className="brand-title">Welcome to DeskBuddy</h2>
                <p className="brand-subtitle">
                  Your comprehensive student management platform for seamless check-ins and verifications
                </p>
                <div className="brand-features">
                  <div className="feature-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22,4 12,14.01 9,11.01"></polyline>
                    </svg>
                    <span>Quick student check-ins</span>
                  </div>
                  <div className="feature-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14,2 14,8 20,8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10,9 9,9 8,9"></polyline>
                    </svg>
                    <span>Document verification</span>
                  </div>
                  <div className="feature-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>Real-time analytics</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Auth Form */}
            <div className="login-form-container">
              <div className="login-form-card">
                <div className="form-header">
                  <h2 className="form-title">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
                  <p className="form-subtitle">
                    {mode === 'login' 
                      ? 'Sign in to your account to continue' 
                      : 'Create a new account to get started'
                    }
                  </p>
                </div>

                {/* Tab Navigation */}
                <div className="auth-tabs">
                  <button
                    className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
                    onClick={() => setMode('login')}
                    type="button"
                  >
                    Sign In
                  </button>
                  <button
                    className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
                    onClick={() => setMode('signup')}
                    type="button"
                  >
                    Sign Up
                  </button>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                  <div className="form-group" style={{ display: mode === 'signup' ? 'flex' : 'none' }}>
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="form-input"
                      autoFocus={mode === 'signup'}
                      required={mode === 'signup'}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-input"
                      autoFocus={mode === 'login'}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>

                  {mode === 'login' && (
                    <div className="form-actions">
                      <button 
                        type="button" 
                        className="forgot-password"
                        onClick={handleResetPassword}
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="login-submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="spinner"></div>
                        {mode === 'login' ? 'Signing In...' : 'Creating Account...'}
                      </>
                    ) : (
                      mode === 'login' ? 'Sign In' : 'Create Account'
                    )}
                  </button>

                  <div className="divider">
                    <span>or</span>
                  </div>

                  <button 
                    type="button" 
                    className="google-btn"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                  >
                    <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Login;
