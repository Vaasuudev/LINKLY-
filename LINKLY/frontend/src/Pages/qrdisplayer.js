import React, { useEffect, useRef } from "react";
import QRCode from "qrcode";
import { useParams } from "react-router-dom";

const QrDisplayer = () => {
  const qrRef = useRef(null);
  const { web_id } = useParams();

  useEffect(() => {
    const generateQRCode = async (url) => {
      try {
        await QRCode.toCanvas(qrRef.current, url, {
          width: 300, // Fixed size
          height: 300, // Fixed size
        });
      } catch (error) {
        console.error("Failed to generate QR code", error);
      }
    };

    const url = `${window.location.origin}/linkly/${web_id}`;

    generateQRCode(url);
  }, [web_id]);

  const downloadQRCode = () => {
    const canvas = qrRef.current;
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = "qrcode.png";
    link.click();
  };

  const displayUrl = `${window.location.origin}/linkly/${web_id}`;

  return (
    <div className="home-container">
      <div className="home-item-box">
        <div className="qr">
          <h2>QR Code of the Url</h2>
          <canvas ref={qrRef}></canvas>
          <div className="mt-4 text-center">{/* <p>{displayUrl}</p> */}</div>
          <button onClick={downloadQRCode} className="qr-button">
            Download QR
          </button>
        </div>
      </div>
    </div>
  );
};

export default QrDisplayer;
