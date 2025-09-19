import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QrScanner from 'qr-scanner';
import { api } from '../api.js';

export default function QRScanPage() {
  const navigate = useNavigate();
  const scannerRef = useRef(null);
  const [error, setError] = useState('');
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  // Check camera permissions
  useEffect(() => {
    const checkCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        setHasCameraPermission(true);
      } catch (err) {
        setHasCameraPermission(false);
        setError('Camera access is required to scan QR codes. Please enable camera permissions in your browser settings.');
      }
    };
    
    checkCameraPermission();
  }, []);

  useEffect(() => {
    if (hasCameraPermission !== true) return;

    let cancelled = false;
    const video = document.createElement('video');
    video.playsInline = true;
    video.setAttribute('autoplay', 'true');
    const container = document.getElementById('qr-reader');
    if (container) {
      container.innerHTML = '';
      container.appendChild(video);
    }

    const start = async () => {
      try {
        setIsScanning(true);
        const scanner = new QrScanner(
          video,
          async (result) => {
            if (cancelled) return;
            try {
              const vendorId = result.data;
              const res = await api.validateVendor(vendorId);
              const shopName = res?.shopName;
              if (!shopName) throw new Error('Invalid vendor');
              await scanner.stop();
              navigate('/amount', { state: { vendorId, shopName }, replace: true });
            } catch (e) {
              setError(e?.message || 'Failed to validate vendor');
              // Auto-clear error after 3 seconds
              setTimeout(() => setError(''), 3000);
            }
          },
          {
            preferredCamera: 'environment',
            highlightScanRegion: true,
            highlightCodeOutline: true,
            maxScansPerSecond: 5,
            returnDetailedScanResult: true
          }
        );
        scannerRef.current = scanner;
        await scanner.start();
      } catch (e) {
        setError(e?.message || 'Camera initialization failed');
        setIsScanning(false);
      }
    };
    start();

    return () => {
      cancelled = true;
      setIsScanning(false);
      const s = scannerRef.current;
      if (s) {
        try {
          const maybePromise = s.stop?.();
          if (maybePromise && typeof maybePromise.then === 'function') {
            maybePromise.finally(() => { try { s.destroy?.(); } catch {} });
          } else {
            try { s.destroy?.(); } catch {}
          }
        } catch {
          try { s.destroy?.(); } catch {}
        }
      }
    };
  }, [navigate, hasCameraPermission]);

  const retryCamera = () => {
    setError('');
    setHasCameraPermission(null);
  };

  return (
    <div className="qr-fullscreen" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      boxSizing: 'border-box',
      minHeight: '100vh',
      backgroundColor: '#000000'
    }}>
      <header style={{ 
        textAlign: 'center', 
        padding: '16px 0',
        position: 'relative',
      }}>
        <h2 style={{ 
          margin: 0, 
          fontSize: '1.5rem',
          fontWeight: '600',
          color: '#ffffff'
        }}>Scan Vendor QR Code</h2>
        <p style={{
          margin: '8px 0 0 0',
          fontSize: '0.9rem',
          color: '#ffffff'
        }}>Position the QR code within the frame</p>
      </header>

      <div style={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        {hasCameraPermission === false && (
          <div style={{
            textAlign: 'center',
            padding: '24px',
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            maxWidth: '400px',
            width: '100%'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📷</div>
            <h3 style={{ margin: '0 0 12px 0', color: '#1a1a1a' }}>Camera Access Required</h3>
            <p style={{ margin: '0 0 20px 0', color: '#666', lineHeight: '1.5' }}>
              Please enable camera permissions in your browser settings to scan QR codes.
            </p>
            <button 
              onClick={retryCamera}
              style={{
                padding: '12px 24px',
                backgroundColor: '#0066cc',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Scanner view */}
        {hasCameraPermission === true && (
          <>
            <div style={{ 
              
              width: '100%',
              maxWidth: 'min(400px, 85vw)',
              aspectRatio: '1',
              border: '2px solid #ccc',
              borderRadius: '12px',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}>
              <div id="qr-reader" style={{ 
                width: '100%', 
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#000'
              }} />
            </div>
          </>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div style={{ 
          padding: '16px', 
          margin: '16px',
          backgroundColor: 'rgba(255, 99, 71, 0.1)',
          border: '1px solid rgba(255, 99, 71, 0.3)',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <p style={{ 
            margin: 0, 
            color: 'tomato',
            fontSize: '0.9rem'
          }}>{error}</p>
        </div>
      )}
    </div>
  );
}