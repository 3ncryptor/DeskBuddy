import React from "react";
import { useNavigate } from "react-router-dom";
import scanQR from '../../assets/scanQR.svg';
import HistoryPNG from '../../assets/History.png';
import "../../styles/StagePage.css";

const KitPage = () => {
  const navigate = useNavigate();

  return (
    <div className="stage-page">
      <h2>Orientation Kit</h2>
      <div className="stage-card-container">
        <div className="stage-card" onClick={() => navigate("/kit/scan")}>
          <div className="card-svg-placeholder">
            <img src={scanQR} alt="Scan QR" />
          </div>
          <p className="card-label">Scan QR</p>
          <p className="card-desc">Scan kit QR</p>
        </div>
        <div className="stage-card disabled">
          <div className="card-svg-placeholder">
            <img src={HistoryPNG} alt="History" />
          </div>
          <p className="card-label">History</p>
          <p className="card-desc">View history</p>
        </div>
      </div>
    </div>
  );
};

export default KitPage;
