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

      if (!res.ok) throw new Error();
      toast.success(
        <span style={{display:'flex',alignItems:'center',gap:'0.7rem'}}>
          <span style={{fontSize:'1.5rem'}}>✅</span>
          <span><b>{stage.charAt(0).toUpperCase() + stage.slice(1)} confirmed</b> for {studentId}</span>
        </span>,
        { style: toastSuccessStyle, icon: null, duration: 3500 }
      );
      onReset();
    } catch {
      toast.error(
        <span style={{display:'flex',alignItems:'center',gap:'0.7rem'}}>
          <span style={{fontSize:'1.5rem'}}>❌</span>
          <span><b>Failed to update status.</b></span>
        </span>,
        { style: toastErrorStyle, icon: null, duration: 3500 }
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
