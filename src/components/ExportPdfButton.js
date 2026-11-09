// ExportPdfButton.js
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faSpinner } from '@fortawesome/free-solid-svg-icons';

function ExportPdfButton({ ads, spreadsheetLink, title }) {
  const [busy, setBusy] = useState(false);
  const disabled = busy || !ads || ads.length === 0;

  const handleClick = async () => {
    setBusy(true);
    try {
      // încărcăm jsPDF + html2canvas doar când e nevoie
      const { exportAdsToPdf } = await import('../utils/exportAdsPdf');
      await exportAdsToPdf(ads, { spreadsheetLink, title });
    } catch (err) {
      console.error('PDF export error:', err);
      alert('Could not create the PDF. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      style={{
        padding: '10px 22px',
        cursor: disabled ? 'default' : 'pointer',
        background: disabled ? '#9aa5ad' : '#c5221f',
        color: '#fff',
        border: 'none',
        borderRadius: '20px',
        fontWeight: 'bold',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        transition: 'transform 0.2s',
      }}
      onMouseOver={e => { if (!disabled) e.currentTarget.style.transform = 'scale(1.05)'; }}
      onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      <FontAwesomeIcon icon={busy ? faSpinner : faFilePdf} spin={busy} />
      {busy ? 'Creating PDF…' : 'Export PDF'}
    </button>
  );
}

export default ExportPdfButton;
