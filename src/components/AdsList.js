// AdsList.js
import React from 'react';

function AdsList({ ads }) {
  if (ads.length === 0) {
    return (
      <p style={{ textAlign: 'center', fontStyle: 'italic', color: '#ccc', fontSize:'18px', marginBottom:'30px' }}>
        No ads generated yet. Please add data (manually or by CSV) and click "Generate 10 Random Ads".
      </p>
    );
  }

  return (
    <div>
      <h2 style={{ 
        textAlign: 'center', 
        marginBottom: '20px', 
        color: '#fff', 
        textShadow:'0 1px 3px rgba(0,0,0,0.3)'
      }}>
        Generated Ads Preview
      </h2>
      <div 
        style={{
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '60px',
          justifyItems: 'center',
          padding: '20px',
          boxSizing: 'border-box'
        }}
      >
        {ads.map((ad, index) => (
          <div 
            key={index} 
            style={{
              background: '#fff',
              width: '100%',
              border: '1px solid #ddd',
              padding: '15px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer',
              position: 'relative',
              fontFamily: 'Arial, sans-serif'
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            }}
          >
            <div style={{ fontSize: '12px', color: '#5f6368', marginBottom: '2px' }}>
              Sponsored
            </div>
            <div style={{ fontSize: '14px', color: '#006621', marginBottom: '5px', wordBreak: 'break-all' }}>
              {ad.link}
            </div>
            <h3 style={{
              fontSize: '18px',
              margin: '0 0 8px',
              color: '#1a0dab',
              fontWeight: 'normal',
              lineHeight: '1.4',
              wordBreak: 'break-word'
            }}>
              {[ad.h1, ad.h2, ad.h3].filter(Boolean).join(' | ')}
            </h3>
            <p style={{ fontSize: '14px', margin: '0 0 5px', color: '#202124', lineHeight: '1.4', wordBreak: 'break-word' }}>
              {ad.d1}
            </p>
            <p style={{ fontSize: '14px', margin: '0', color: '#202124', lineHeight: '1.4', wordBreak: 'break-word' }}>
              {ad.d2}
            </p>

            {/* Call asset */}
            {ad.phoneNumber && (
              <p style={{
                fontSize:'14px',
                margin:'10px 0 0',
                color:'#202124',
                lineHeight:'1.4',
                fontWeight:'bold',
                wordBreak:'break-word',
                display:'flex',
                alignItems:'center',
                gap:'5px'
              }}>
                <span style={{fontSize:'16px'}}>☎</span> 
                Call {ad.phoneNumber}
              </p>
            )}

            {/* Sitelinks */}
            {ad.sitelinks && ad.sitelinks.length > 0 && (
              <div style={{
                marginTop:'10px',
                display:'flex',
                flexWrap:'wrap',
                gap:'10px'
              }}>
                {ad.sitelinks.map((sl, i) => (
                  <a
                    key={i}
                    href={sl.url.startsWith('http') ? sl.url : `https://${sl.url}`}
                    style={{
                      color:'#1a0dab',
                      fontSize:'14px',
                      textDecoration:'none',
                      whiteSpace:'nowrap'
                    }}
                  >
                    {sl.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdsList;
