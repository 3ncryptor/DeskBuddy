import React, { useState, useEffect } from "react";
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
import logo from '../assets/Login.svg';

// SVG ICONS
const UserIcon = (props) => (
  <svg viewBox="0 0 24 24" width={props.size || 20} height={props.size || 20} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}><circle cx="12" cy="8" r="4"/><path d="M20 20v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1"/></svg>
);
const MailIcon = (props) => (
  <svg viewBox="0 0 24 24" width={props.size || 20} height={props.size || 20} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}><rect x="3" y="5" width="18" height="14" rx="2"/><polyline points="3 7 12 13 21 7"/></svg>
);
const LockIcon = (props) => (
  <svg viewBox="0 0 24 24" width={props.size || 20} height={props.size || 20} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);
const EyeIcon = (props) => (
  <svg viewBox="0 0 24 24" width={props.size || 20} height={props.size || 20} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>
);
const EyeOffIcon = (props) => (
  <svg viewBox="0 0 24 24" width={props.size || 20} height={props.size || 20} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.81 21.81 0 0 1 5.06-6.06"/><path d="M1 1l22 22"/><path d="M9.53 9.53A3 3 0 0 0 12 15a3 3 0 0 0 2.47-5.47"/></svg>
);
const ArrowRightIcon = (props) => (
  <svg viewBox="0 0 24 24" width={props.size || 20} height={props.size || 20} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
);
const CheckCircleIcon = (props) => (
  <svg viewBox="0 0 24 24" width={props.size || 20} height={props.size || 20} fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>
);

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

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
    if (!formData.email || !formData.password) {
      addToast({
        type: 'error',
        title: 'Please enter both email and password.',
        duration: 3500
      });
      return;
    }
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
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
    if (!formData.email || !formData.password || !formData.name) {
      addToast({
        type: 'error',
        title: 'Please fill all fields.',
        duration: 3500
      });
      return;
    }
    if (formData.password.length < 6) {
      addToast({
        type: 'error',
        title: 'Password must be at least 6 characters.',
        duration: 3500
      });
      return;
    }
    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, formData.email, formData.password);
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
    if (!formData.email) return addToast({
      type: 'error',
      title: 'Enter email to reset',
      duration: 3500
    });
    try {
      await sendPasswordResetEmail(auth, formData.email);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      handleEmailLogin();
    } else {
      handleSignup();
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleToggle = (loginState) => {
    setIsLogin(loginState);
    setFormData({ email: "", password: "", name: "" });
  };

  if (!mounted) return null;

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="animated-gradient"></div>
        <div className="geometric-shapes">
          <div className="shape-container shape-container-1">
            <div className="geometric-shape triangle"></div>
          </div>
          <div className="shape-container shape-container-2">
            <div className="geometric-shape square"></div>
          </div>
          <div className="shape-container shape-container-3">
            <div className="geometric-shape circle"></div>
          </div>
          <div className="shape-container shape-container-4">
            <div className="geometric-shape hexagon"></div>
          </div>
          <div className="shape-container shape-container-5">
            <div className="geometric-shape diamond"></div>
          </div>
        </div>
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="gradient-orb orb-4"></div>
        <div className="floating-particles">
          {[...Array(30)].map((_, i) => (
            <div key={i} className={`particle particle-${i + 1}`}></div>
          ))}
        </div>
        <div className="wave-animation">
          <div className="wave wave-1"></div>
          <div className="wave wave-2"></div>
          <div className="wave wave-3"></div>
        </div>
      </div>
      <div className="login-card">
        <div className="login-header">
          <div className="logo-container">
            <div className="logo">
              <div className="logo-inner">
                <UserIcon className="logo-icon" size={28} />
              </div>
            </div>
            <div className="brand-info">
              <h1 className="brand-name">DeskBuddy</h1>
              <p className="brand-tagline">Your Productivity Partner</p>
            </div>
          </div>
          <div className="welcome-section">
            <h2 className="welcome-title">{isLogin ? "Welcome back" : "Get started"}</h2>
            <p className="welcome-text">
              {isLogin
                ? "Sign in to continue your productivity journey"
                : "Create your account and boost your productivity"}
            </p>
          </div>
        </div>
        <div className="form-toggle">
          <button className={`toggle-btn ${isLogin ? "active" : ""}`} onClick={() => handleToggle(true)}>
            Sign In
          </button>
          <button className={`toggle-btn ${!isLogin ? "active" : ""}`} onClick={() => handleToggle(false)}>
            Sign Up
          </button>
          <div className={`toggle-indicator ${isLogin ? "left" : "right"}`}></div>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <div className="input-group name-field">
              <label className="input-label">Full Name</label>
              <div className="input-wrapper">
                <UserIcon className="input-icon" />
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required={!isLogin}
                />
                <div className="input-border"></div>
              </div>
            </div>
          )}
          <div className="input-group email-field">
            <label className="input-label">Email Address</label>
            <div className="input-wrapper">
              <MailIcon className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <div className="input-border"></div>
            </div>
          </div>
          <div className="input-group password-field">
            <label className="input-label">Password</label>
            <div className="input-wrapper">
              <LockIcon className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
              </button>
              <div className="input-border"></div>
            </div>
          </div>
          {isLogin && (
            <div className="form-options">
              <label className="checkbox-container">
                <input type="checkbox" />
                <span className="checkmark"></span>
                <span className="checkbox-text">Keep me signed in</span>
              </label>
              <a href="#" className="forgot-password" onClick={handleResetPassword}>
                Forgot Password?
              </a>
            </div>
          )}
          <button type="submit" className={`submit-btn${isSuccess ? " success" : ""}`} disabled={isLoading}>
            {isSuccess ? (
              <>
                <CheckCircleIcon className="success-icon" />
                Success!
              </>
            ) : isLoading ? (
              <>
                <div className="loading-spinner"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>{isLogin ? "Sign In" : "Create Account"}</span>
                <ArrowRightIcon className="submit-arrow" />
              </>
            )}
          </button>
        </form>
        <div className="divider">
          <span>or continue with</span>
        </div>
        <div className="social-login">
          <button className="social-btn google" onClick={handleGoogleLogin}>
            <div className="social-icon">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>
            <span>Continue with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
