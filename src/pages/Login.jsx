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
import toast from 'react-hot-toast';
import loginIllustration from '../assets/Login.svg';
import googleLoginImg from '../assets/Google.svg';
import { toastErrorStyle, toastSuccessStyle } from '../styles/toastStyles';

const Login = () => {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      toast.success(
        <span style={{display:'flex',alignItems:'center',gap:'0.7rem'}}>
          <span style={{fontSize:'1.5rem'}}>✅</span>
          <span><b>Login Successful</b></span>
        </span>,
        { style: toastSuccessStyle, icon: null, duration: 3500 }
      );
      navigate('/dashboard');
    } catch (error) {
      toast.error(
        <span style={{display:'flex',alignItems:'center',gap:'0.7rem'}}>
          <span style={{fontSize:'1.5rem'}}>❌</span>
          <span><b>{error.message || 'Google Login Failed'}</b></span>
        </span>,
        { style: toastErrorStyle, icon: null, duration: 3500 }
      );
    }
  };

  const handleEmailLogin = async () => {
    if (!email || !password) {
      toast.error(
        <span style={{display:'flex',alignItems:'center',gap:'0.7rem'}}>
          <span style={{fontSize:'1.5rem'}}>⚠️</span>
          <span><b>Please enter both email and password.</b></span>
        </span>,
        { style: toastErrorStyle, icon: null, duration: 3500 }
      );
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success(
        <span style={{display:'flex',alignItems:'center',gap:'0.7rem'}}>
          <span style={{fontSize:'1.5rem'}}>✅</span>
          <span><b>Login Successful</b></span>
        </span>,
        { style: toastSuccessStyle, icon: null, duration: 3500 }
      );
      navigate('/dashboard');
    } catch (error) {
      toast.error(
        <span style={{display:'flex',alignItems:'center',gap:'0.7rem'}}>
          <span style={{fontSize:'1.5rem'}}>❌</span>
          <span><b>{error.message || 'Login Failed'}</b></span>
        </span>,
        { style: toastErrorStyle, icon: null, duration: 3500 }
      );
    }
  };

  const handleSignup = async () => {
    if (!email || !password || !name) {
      toast.error(
        <span style={{display:'flex',alignItems:'center',gap:'0.7rem'}}>
          <span style={{fontSize:'1.5rem'}}>⚠️</span>
          <span><b>Please fill all fields.</b></span>
        </span>,
        { style: toastErrorStyle, icon: null, duration: 3500 }
      );
      return;
    }
    if (password.length < 6) {
      toast.error(
        <span style={{display:'flex',alignItems:'center',gap:'0.7rem'}}>
          <span style={{fontSize:'1.5rem'}}>⚠️</span>
          <span><b>Password must be at least 6 characters.</b></span>
        </span>,
        { style: toastErrorStyle, icon: null, duration: 3500 }
      );
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success(
        <span style={{display:'flex',alignItems:'center',gap:'0.7rem'}}>
          <span style={{fontSize:'1.5rem'}}>✅</span>
          <span><b>Account Created</b></span>
        </span>,
        { style: toastSuccessStyle, icon: null, duration: 3500 }
      );
      navigate('/dashboard');
    } catch (error) {
      toast.error(
        <span style={{display:'flex',alignItems:'center',gap:'0.7rem'}}>
          <span style={{fontSize:'1.5rem'}}>❌</span>
          <span><b>{error.message || 'Signup Failed'}</b></span>
        </span>,
        { style: toastErrorStyle, icon: null, duration: 3500 }
      );
    }
  };

  const handleResetPassword = async () => {
    if (!email) return toast.error(
      <span style={{display:'flex',alignItems:'center',gap:'0.7rem'}}>
        <span style={{fontSize:'1.5rem'}}>⚠️</span>
        <span><b>Enter email to reset</b></span>
      </span>,
      { style: toastErrorStyle, icon: null, duration: 3500 }
    );
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success(
        <span style={{display:'flex',alignItems:'center',gap:'0.7rem'}}>
          <span style={{fontSize:'1.5rem'}}>📩</span>
          <span><b>Reset email sent</b></span>
        </span>,
        { style: toastSuccessStyle, icon: null, duration: 3500 }
      );
    } catch (error) {
      toast.error(
        <span style={{display:'flex',alignItems:'center',gap:'0.7rem'}}>
          <span style={{fontSize:'1.5rem'}}>❌</span>
          <span><b>{error.message || 'Failed to send reset link'}</b></span>
        </span>,
        { style: toastErrorStyle, icon: null, duration: 3500 }
      );
    }
  };

  return (
    <div className="login-page">
      <div className="auth-modal-horizontal">
        <div className="auth-tabs-horizontal">
          <div
            className={`auth-tab-horizontal ${mode === 'login' ? 'active' : ''}`}
            onClick={() => setMode('login')}
          >
            Login
          </div>
          <div
            className={`auth-tab-horizontal ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => setMode('signup')}
          >
            Sign Up
          </div>
          <div className={`auth-tab-indicator ${mode}`}></div>
        </div>
        <div className={`auth-card premium-glass ${mode}`}
          style={{ position: 'relative', overflow: 'visible', paddingTop: '2.5rem' }}>
          <div className="login-floating-badge">
            <img src={loginIllustration} alt="Login" className="login-floating-badge-img" />
          </div>
          <h2 className="login-heading">{mode === 'login' ? 'Welcome to DeskBuddy' : 'Create Account'}</h2>
          {mode === 'signup' && (
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
              className="login-input"
              autoFocus
          />
        )}
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
            className="login-input"
            autoFocus={mode === 'login'}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
            className="login-input"
        />
          {mode === 'login' ? (
          <>
              <button className="login-btn primary" onClick={handleEmailLogin}>Login</button>
              <button className="login-btn google" onClick={handleGoogleLogin}>
                <img src={googleLoginImg} alt="Login with Google" className="google-login-img" />
              </button>
            <p className="link" onClick={handleResetPassword}>
              Forgot password?
            </p>
          </>
        ) : (
          <>
              <button className="login-btn primary" onClick={handleSignup}>Sign Up</button>
          </>
        )}
        </div>
      </div>
    </div>
  );
};

export default Login;
