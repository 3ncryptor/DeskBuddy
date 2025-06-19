import React from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from '../components/ToastProvider';

const ConfirmButton = ({ studentId, stage, onReset }) => {
  const { user } = useAuth();
  const volunteerName = user?.displayName || "Anonymous";
  const { addToast } = useToast();

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
          addToast({
            type: 'warning',
            title: `${stage.charAt(0).toUpperCase() + stage.slice(1)} already completed for ${studentId}`,
            duration: 4000
          });
        } else if (res.status === 404) {
          // Student not found
          addToast({
            type: 'error',
            title: `Student not found: ${studentId}`,
            duration: 4000
          });
        } else {
          // Generic error
          throw new Error(data.error || 'Failed to update status');
        }
        return;
      }

      // Success case
      addToast({
        type: 'success',
        title: `${stage.charAt(0).toUpperCase() + stage.slice(1)} confirmed for ${studentId}`,
        duration: 3500
      });
      onReset();
    } catch (error) {
      addToast({
        type: 'error',
        title: `Failed to update status: ${error.message}`,
        duration: 4000
      });
    }
  };

  return (
    <button className="confirm-btn" onClick={handleConfirm}>
      ✅ Confirm {stage.charAt(0).toUpperCase() + stage.slice(1)}
    </button>
  );
};

export default ConfirmButton;
