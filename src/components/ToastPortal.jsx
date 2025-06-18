import React, { useEffect } from "react";
import "../styles/Toast.css";

const icons = {
  success: "✅",
  error: "❌",
  info: "ℹ️",
  warning: "⚠️"
};

const ToastPortal = ({ toasts, removeToast }) => {
  useEffect(() => {
    // Clean up toasts on unmount
    return () => {
      toasts.forEach((t) => removeToast(t.id));
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div className="toast-portal">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast-${toast.type || "info"}`}
          style={{ animationDuration: `${toast.duration || 3500}ms` }}
        >
          <div className="toast-icon">{icons[toast.type] || icons.info}</div>
          <div className="toast-content">
            <div className="toast-title">{toast.title}</div>
            {toast.message && <div className="toast-message">{toast.message}</div>}
          </div>
          <button className="toast-close" onClick={() => removeToast(toast.id)}>&times;</button>
          <div
            className="toast-progress"
            style={{ animationDuration: `${toast.duration || 3500}ms` }}
          ></div>
        </div>
      ))}
    </div>
  );
};

export default ToastPortal; 