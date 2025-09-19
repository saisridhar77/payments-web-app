import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QrScanner from 'qr-scanner';
import { api } from '../api.js';

export default function QRScanPage() {
  const navigate = useNavigate();
  const scannerRef = useRef(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const video = document.createElement('video');
    video.playsInline = true;
    const container = document.getElementById('qr-reader');
    if (container) {
      container.innerHTML = '';
      container.appendChild(video);
    }

    const start = async () => {
      try {
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
            }
          },
          { preferredCamera: 'environment' }
        );
        scannerRef.current = scanner;
        await scanner.start();
      } catch (e) {
        setError(e?.message || 'Camera initialization failed');
      }
    };
    start();

    return () => {
      cancelled = true;
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
  }, [navigate]);

  return (
    <div className="qr-fullscreen" style={{ display: 'flex', flexDirection: 'column', padding: '20px', boxSizing: 'border-box' }}>
      <h2 style={{ textAlign: 'center', margin: '0 0 20px 0' }}>Scan Vendor QR</h2>
      <div style={{ 
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px'
      }}>
        <div style={{ 
          width: '100%',
          maxWidth: '400px',
          aspectRatio: '1',
          border: '2px solid #ccc',
          borderRadius: '12px',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div id="qr-reader" style={{ 
            width: '100%', 
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }} />
        </div>
      </div>
      {error && <p style={{ color: 'tomato', textAlign: 'center', margin: '10px 0' }}>{error}</p>}
    </div>
  );
}


