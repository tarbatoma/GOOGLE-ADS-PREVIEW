import React from 'react';

function InputForm({
  headlines1, setHeadlines1,
  headlines2, setHeadlines2,
  headlines3, setHeadlines3,
  descriptions, setDescriptions,
  clientLink, setClientLink
}) {

  const handleChange = (setter) => (e) => {
    const lines = e.target.value
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    setter(lines);
  };

  const inputStyle = {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    marginBottom: '10px',
    transition: 'box-shadow 0.3s',
    outline: 'none',
    fontFamily:'inherit',
  };

  const handleFocus = (e) => {
    e.target.style.boxShadow = '0 0 5px rgba(0,123,255,0.5)';
  };

  const handleBlur = (e) => {
    e.target.style.boxShadow = 'none';
  };

  const labelStyle = {
    fontWeight: 'bold',
    marginBottom: '5px',
    color:'#333'
  };

  return (
    <div 
      style={{ 
        marginBottom: '30px', 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '20px'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label htmlFor="link" style={labelStyle}>Client URL</label>
        <input
          id="link"
          type="text"
          placeholder="e.g., www.clientwebsite.com"
          value={clientLink}
          onChange={(e) => setClientLink(e.target.value)}
          style={inputStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label htmlFor="h1" style={labelStyle}>Headline 1 (H1)*</label>
        <textarea
          id="h1"
          rows={5}
          placeholder="One H1 per line"
          onChange={handleChange(setHeadlines1)}
          style={inputStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label htmlFor="h2" style={labelStyle}>Headline 2 (H2)*</label>
        <textarea
          id="h2"
          rows={5}
          placeholder="One H2 per line"
          onChange={handleChange(setHeadlines2)}
          style={inputStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label htmlFor="h3" style={labelStyle}>Headline 3 (H3) - optional</label>
        <textarea
          id="h3"
          rows={5}
          placeholder="One H3 per line"
          onChange={handleChange(setHeadlines3)}
          style={inputStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gridColumn: '1 / span 2' }}>
        <label htmlFor="desc" style={labelStyle}>Descriptions*</label>
        <textarea
          id="desc"
          rows={5}
          placeholder="One description per line. Will randomly choose 2 for each ad."
          onChange={handleChange(setDescriptions)}
          style={inputStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>
    </div>
  );
}

export default InputForm;
