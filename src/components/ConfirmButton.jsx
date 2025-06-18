import React from "react";
import { useAuth } from "../context/AuthContext";
import toast from 'react-hot-toast';
import { toastErrorStyle, toastSuccessStyle } from '../styles/toastStyles';

const ConfirmButton = ({ studentId, stage, onReset }) => {
  const { user } = useAuth();
  const volunteerName = user?.displayName || "Anonymous";

  const handleConfirm = async () => {
    try {
      const res = await fetch(`/api/scan/${stage}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, volunteerName }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Handle specific error cases
        if (res.status === 409) {
          // Already completed
          toast.error(
            <span style={{display:'flex',alignItems:'center',gap:'0.7rem'}}>
              <span style={{fontSize:'1.5rem'}}>⚠️</span>
              <span><b>{stage.charAt(0).toUpperCase() + stage.slice(1)} already completed</b> for {studentId}</span>
            </span>,
            { style: toastErrorStyle, icon: null, duration: 4000 }
          );
        } else if (res.status === 404) {
          // Student not found
          toast.error(
            <span style={{display:'flex',alignItems:'center',gap:'0.7rem'}}>
              <span style={{fontSize:'1.5rem'}}>❌</span>
              <span><b>Student not found:</b> {studentId}</span>
            </span>,
            { style: toastErrorStyle, icon: null, duration: 4000 }
          );
        } else {
          // Generic error
          throw new Error(data.error || 'Failed to update status');
        }
        return;
      }

      // Success case
      toast.success(
        <span style={{display:'flex',alignItems:'center',gap:'0.7rem'}}>
          <span style={{fontSize:'1.5rem'}}>✅</span>
          <span><b>{stage.charAt(0).toUpperCase() + stage.slice(1)} confirmed</b> for {studentId}</span>
        </span>,
        { style: toastSuccessStyle, icon: null, duration: 3500 }
      );
      onReset();
    } catch (error) {
      console.error('Confirm button error:', error);
      toast.error(
        <span style={{display:'flex',alignItems:'center',gap:'0.7rem'}}>
          <span style={{fontSize:'1.5rem'}}>❌</span>
          <span><b>Failed to update status:</b> {error.message}</span>
        </span>,
        { style: toastErrorStyle, icon: null, duration: 4000 }
      );
    }
  };

  return (
    <button className="confirm-btn" onClick={handleConfirm}>
      ✅ Confirm {stage.charAt(0).toUpperCase() + stage.slice(1)}
    </button>
  );
};

export default ConfirmButton;
