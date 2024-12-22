import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

// Font Awesome, dacă îl folosești
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';

function PreviewPage() {
  const { id } = useParams();
  const [ads, setAds] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Desktop vs. Mobile
  const [viewMode, setViewMode] = useState('desktop');

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const docRef = doc(db, "adsPreviews", id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          setError("This preview does not exist.");
          setLoading(false);
          return;
        }

        const data = docSnap.data();
        const now = Date.now();
        if (!data.expiresAt || now > data.expiresAt) {
          setError("This link has expired.");
          setLoading(false);
          return;
        }

        setAds(data.ads);
        setLoading(false);
      } catch (e) {
        console.error(e);
        setError("Failed to fetch data.");
        setLoading(false);
      }
    };

    fetchAds();
  }, [id]);

  if (loading) {
    return (
      <div style={{ color:'#fff', textAlign:'center', paddingTop:'50px', fontSize:'18px' }}>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ color:'#fff', textAlign:'center', paddingTop:'50px', fontSize:'18px' }}>
        {error}
      </div>
    );
  }

  // -------------- DESKTOP LAYOUT --------------
  function renderDesktopView() {
    return (
      <div style={{ display:'flex', flexDirection:'column', gap:'40px' }}>
        {ads.map((ad, idx) => (
          <div
            key={idx}
            style={{
              background:'#fff',
              border:'1px solid #ddd',
              borderRadius:'8px',
              boxShadow:'0 1px 3px rgba(0,0,0,0.1)',
              padding:'20px',
              transition:'transform 0.2s, box-shadow 0.2s',
              cursor:'default',
              position:'relative',
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
            {/* Simulare Google header */}
            <div style={{ marginBottom:'15px', textAlign:'center' }}>
              {/* "Google" colorat */}
              <h2 style={{ 
                margin:'0 0 10px', 
                fontSize:'30px', 
                fontFamily:'Arial,sans-serif',
                letterSpacing:'0.5px' 
              }}>
                <span style={{ color:'#4285F4' }}>G</span>
                <span style={{ color:'#DB4437' }}>o</span>
                <span style={{ color:'#F4B400' }}>o</span>
                <span style={{ color:'#4285F4' }}>g</span>
                <span style={{ color:'#0F9D58' }}>l</span>
                <span style={{ color:'#DB4437' }}>e</span>
              </h2>

              {/* Bara de căutare dummy */}
              <div style={{
                display:'flex',
                justifyContent:'center',
                alignItems:'center',
                gap:'10px'
              }}>
                <div style={{
                  flex:'0 0 500px',
                  maxWidth:'500px',
                  height:'35px',
                  border:'1px solid #ddd',
                  borderRadius:'20px',
                  background:'#fff',
                  display:'flex',
                  alignItems:'center',
                  padding:'0 15px'
                }}>
                  <span style={{ color:'#aaa', fontSize:'14px' }}>
                    Search...
                  </span>
                </div>
              </div>
            </div>
            {/* /Simulare Google header */}

            {/* Conținut anunț */}
            <div style={{ fontSize:'12px', color:'#5f6368', marginBottom:'5px' }}>
              Sponsored
            </div>
            <div style={{
              fontSize:'14px',
              color:'#006621',
              marginBottom:'5px',
              whiteSpace:'nowrap',
              overflow:'hidden',
              textOverflow:'ellipsis'
            }}>
              {ad.link}
            </div>
            <h3 style={{
              fontSize:'18px',
              margin:'0 0 10px',
              color:'#1a0dab',
              fontWeight:'normal',
              lineHeight:'1.3',
              overflow:'hidden',
              textOverflow:'ellipsis',
              whiteSpace:'nowrap'
            }}>
              {[ad.h1, ad.h2, ad.h3].filter(Boolean).join(' | ')}
            </h3>
            <p style={{
              fontSize:'14px',
              margin:'0 0 5px',
              color:'#202124',
              lineHeight:'1.4'
            }}>
              {ad.d1}
            </p>
            <p style={{
              fontSize:'14px',
              margin:'0',
              color:'#202124',
              lineHeight:'1.4'
            }}>
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
                display:'flex',
                alignItems:'center',
                gap:'5px'
              }}>
                <FontAwesomeIcon icon={faPhone} style={{ color:'#000', fontSize:'16px' }} />
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
    );
  }

  // -------------- MOBILE LAYOUT --------------
  function renderMobileView() {
    return (
      <div style={{ display:'flex', flexDirection:'column', gap:'40px' }}>
        {ads.map((ad, idx) => (
          <div 
            key={idx}
            style={{
              background:'#fff',
              border:'1px solid #ddd',
              borderRadius:'8px',
              marginBottom:'20px',
              padding:'10px',
              boxShadow:'0 1px 3px rgba(0,0,0,0.1)',
              transition:'transform 0.2s, boxShadow 0.2s'
            }}
          >
            {/* Simulare "Mobile Google" */}
            <div style={{ marginBottom:'10px', textAlign:'center' }}>
              <h2 style={{
                margin:'0 0 5px',
                fontSize:'24px',
                fontFamily:'Arial,sans-serif',
                letterSpacing:'0.5px'
              }}>
                <span style={{ color:'#4285F4' }}>G</span>
                <span style={{ color:'#DB4437' }}>o</span>
                <span style={{ color:'#F4B400' }}>o</span>
                <span style={{ color:'#4285F4' }}>g</span>
                <span style={{ color:'#0F9D58' }}>l</span>
                <span style={{ color:'#DB4437' }}>e</span>
              </h2>
              <div style={{
                display:'flex',
                justifyContent:'center',
                alignItems:'center',
                gap:'5px'
              }}>
                <div style={{
                  width:'250px',
                  height:'30px',
                  border:'1px solid #ddd',
                  borderRadius:'20px',
                  background:'#fff',
                  display:'flex',
                  alignItems:'center',
                  padding:'0 10px'
                }}>
                  <span style={{ color:'#aaa', fontSize:'14px' }}>
                    Search...
                  </span>
                </div>
              </div>
            </div>
            {/* /Simulare "Mobile Google" */}

            <div style={{ fontSize:'12px', color:'#5f6368', marginBottom:'5px' }}>
              Sponsored
            </div>
            <div style={{
              fontSize:'13px',
              color:'#006621',
              marginBottom:'5px',
              overflow:'hidden',
              textOverflow:'ellipsis',
              whiteSpace:'nowrap'
            }}>
              {ad.link}
            </div>
            <h3 style={{
              fontSize:'16px',
              color:'#1a0dab',
              margin:'0 0 8px',
              lineHeight:'1.2',
              overflow:'hidden',
              textOverflow:'ellipsis',
              whiteSpace:'nowrap'
            }}>
              {[ad.h1, ad.h2, ad.h3].filter(Boolean).join(' | ')}
            </h3>
            <p style={{
              fontSize:'14px',
              margin:'0 0 5px',
              color:'#202124',
              lineHeight:'1.3'
            }}>
              {ad.d1}
            </p>
            <p style={{
              fontSize:'14px',
              margin:'0',
              color:'#202124',
              lineHeight:'1.3'
            }}>
              {ad.d2}
            </p>

            {/* Call asset */}
            {ad.phoneNumber && (
              <div style={{
                marginTop:'10px',
                display:'flex',
                alignItems:'center',
                gap:'5px',
                fontWeight:'bold',
                color:'#222'
              }}>
                <FontAwesomeIcon icon={faPhone} style={{ color:'#000', fontSize:'18px' }} />
                <span style={{fontSize:'14px'}}>Call {ad.phoneNumber}</span>
              </div>
            )}

            {/* Sitelinks */}
            {ad.sitelinks && ad.sitelinks.length > 0 && (
              <div style={{
                marginTop:'10px',
                display:'flex',
                flexDirection:'column',
                gap:'5px'
              }}>
                {ad.sitelinks.map((sl, i) => (
                  <a
                    key={i}
                    href={sl.url.startsWith('http') ? sl.url : `https://${sl.url}`}
                    style={{
                      color:'#1a0dab',
                      fontSize:'14px',
                      textDecoration:'none'
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
    );
  }

  return (
    <div
      style={{
        background: '#1f2631',
        minHeight: '100vh',
        padding: '40px 20px',
        boxSizing: 'border-box',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      <div style={{ textAlign:'center', marginBottom:'30px' }}>
        <h2 style={{ 
          margin:'0 0 10px',
          color:'#fff',
          fontSize:'2em',
          fontWeight:'normal',
          textShadow:'0 2px 5px rgba(0,0,0,0.3)'
        }}>
          Preview Ads
        </h2>
        {/* Butoane Desktop/Mobile */}
        <div>
          <button 
            onClick={() => setViewMode('desktop')}
            style={{
              padding:'10px 20px',
              cursor:'pointer',
              background: viewMode === 'desktop' ? '#007BFF' : '#777',
              color:'#fff',
              border:'none',
              borderRadius:'20px',
              fontWeight:'bold',
              marginRight:'10px'
            }}
          >
            Desktop View
          </button>
          <button 
            onClick={() => setViewMode('mobile')}
            style={{
              padding:'10px 20px',
              cursor:'pointer',
              background: viewMode === 'mobile' ? '#007BFF' : '#777',
              color:'#fff',
              border:'none',
              borderRadius:'20px',
              fontWeight:'bold'
            }}
          >
            Mobile View
          </button>
        </div>
      </div>

      {/* Container ads */}
      <div style={{
        maxWidth: viewMode === 'desktop' ? '800px' : '375px',
        margin:'0 auto',
        background: viewMode === 'desktop' ? 'transparent' : '#f8f9fa',
        border: viewMode === 'mobile' ? '1px solid #ccc' : 'none',
        borderRadius: viewMode === 'mobile' ? '20px' : '0px',
        boxShadow: viewMode === 'mobile' ? '0 5px 15px rgba(0,0,0,0.2)' : 'none',
        padding: viewMode === 'mobile' ? '20px' : '0'
      }}>
        {viewMode === 'desktop' 
          ? renderDesktopView() 
          : renderMobileView()
        }
      </div>
    </div>
  );
}

export default PreviewPage;
