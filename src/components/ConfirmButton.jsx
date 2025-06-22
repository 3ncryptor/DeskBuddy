import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from './ToastProvider';
import VisitorCountModal from './VisitorCountModal';
import LanyardPreview from './LanyardPreview';
import LanyardPrintService from '../services/lanyardPrintService';

const ConfirmButton = ({ studentId, stage, onReset, studentData }) => {
  const { user } = useAuth();
  const volunteerName = user?.displayName || "Anonymous";
  const { addToast } = useToast();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  const [showVisitorModal, setShowVisitorModal] = useState(false);
  const [showLanyardPreview, setShowLanyardPreview] = useState(false);
  const [visitorCount, setVisitorCount] = useState(0);

  const handleConfirm = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/scan/${stage}`, {
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

      // For arrival stage, show visitor count modal
      if (stage === 'arrival') {
        setShowVisitorModal(true);
      } else {
        onReset();
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: `Failed to update status: ${error.message}`,
        duration: 4000
      });
    }
  };

  const handleVisitorCountSet = (count) => {
    setVisitorCount(count);
    setShowVisitorModal(false);
  };

  const handleGenerateLanyards = () => {
    setShowLanyardPreview(true);
  };

  const handlePrintLanyards = async (pageSize = 'a6') => {
    if (visitorCount === 0) {
      addToast({
        type: 'warning',
        title: 'No visitors to print lanyards for',
        duration: 3000
      });
      return;
    }

    try {
      // Try direct print first, fallback to PDF if print fails
      try {
        await LanyardPrintService.printDirect(visitorCount, studentData?.name || studentId, async () => {
          // Fallback: If print fails, try PDF
          try {
            await LanyardPrintService.printLanyards(visitorCount, studentData?.name || studentId, pageSize);
            addToast({
              type: 'success',
              title: `PDF fallback generated with ${visitorCount} lanyard${visitorCount !== 1 ? 's' : ''} (${pageSize.toUpperCase()})`,
              duration: 4000
            });
          } catch (finalError) {
            addToast({
              type: 'error',
              title: `Failed to print or generate PDF: ${finalError.message}`,
              duration: 4000
            });
          }
        }, pageSize, volunteerName);
        addToast({
          type: 'success',
          title: `Print dialog opened for ${visitorCount} lanyard${visitorCount !== 1 ? 's' : ''} (${pageSize.toUpperCase()})`,
          duration: 4000
        });
      } catch {
        // This should only happen if printDirect throws synchronously
        try {
          await LanyardPrintService.printLanyards(visitorCount, studentData?.name || studentId, pageSize);
          addToast({
            type: 'success',
            title: `PDF fallback generated with ${visitorCount} lanyard${visitorCount !== 1 ? 's' : ''} (${pageSize.toUpperCase()})`,
            duration: 4000
          });
        } catch (finalError) {
          addToast({
            type: 'error',
            title: `Failed to print or generate PDF: ${finalError.message}`,
            duration: 4000
          });
        }
      }
      setShowLanyardPreview(false);
      onReset(); // Reset the scanner after printing
    } catch (error) {
      addToast({
        type: 'error',
        title: `Failed to print lanyards: ${error.message}`,
        duration: 4000
      });
    }
  };

  const handleCloseVisitorModal = () => {
    setShowVisitorModal(false);
    onReset(); // Reset if user cancels
  };

  const handleCloseLanyardPreview = () => {
    setShowLanyardPreview(false);
    onReset(); // Reset after preview
  };

  return (
    <>
      <button className="confirm-btn" onClick={handleConfirm}>
        ✅ Confirm {stage.charAt(0).toUpperCase() + stage.slice(1)}
      </button>

      {/* Visitor Count Modal */}
      <VisitorCountModal
        isOpen={showVisitorModal}
        onClose={handleCloseVisitorModal}
        studentName={studentData?.name || studentId}
        studentId={studentId}
        onVisitorCountSet={handleVisitorCountSet}
        onGenerateLanyards={handleGenerateLanyards}
      />

      {/* Lanyard Preview Modal */}
      <LanyardPreview
        isOpen={showLanyardPreview}
        onClose={handleCloseLanyardPreview}
        studentName={studentData?.name || studentId}
        visitorCount={visitorCount}
        onPrint={handlePrintLanyards}
      />
    </>
  );
};

export default ConfirmButton;
