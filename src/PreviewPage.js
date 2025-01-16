// PreviewPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';

const displayAdImages = [
  { src: require('./assets/displayAds/NH-120by600-px.gif'), alt: '120x600' },
  { src: require('./assets/displayAds/NH-160by600-px.gif'), alt: '160x600' },
  { src: require('./assets/displayAds/NH-200by200-px.gif'), alt: '200x200' },
  { src: require('./assets/displayAds/NH-250by250-px.gif'), alt: '250x250' },
  { src: require('./assets/displayAds/NH-300by50-px.gif'), alt: '300x50' },
  { src: require('./assets/displayAds/NH-300by250-px.gif'), alt: '300x250' },
  { src: require('./assets/displayAds/NH-300by600-px.gif'), alt: '300x600' },
  { src: require('./assets/displayAds/NH-320by50-px.gif'), alt: '320x50' },
  { src: require('./assets/displayAds/NH-320by100-px.gif'), alt: '320x100' },
  { src: require('./assets/displayAds/NH-336by280-px.gif'), alt: '336x280' },
  { src: require('./assets/displayAds/NH-468by60-px.gif'), alt: '468x60' },
  { src: require('./assets/displayAds/NH-728by90-px.gif'), alt: '728x90' },
  { src: require('./assets/displayAds/NH-970by90-px.gif'), alt: '970x90' },
  { src: require('./assets/displayAds/NH-970by250-px.gif'), alt: '970x250' },
];

// ADDED: array pentru screenshot-urile „Display Ad Position Examples”
const displayAdPositions = [
  { src: require('./assets/displayAdsPreview/1.jpg'), alt: 'Position Example 1' },
  { src: require('./assets/displayAdsPreview/2.jpg'), alt: 'Position Example 2' },
  { src: require('./assets/displayAdsPreview/3.jpg'), alt: 'Position Example 3' },
  { src: require('./assets/displayAdsPreview/4.jpg'), alt: 'Position Example 4' },
  { src: require('./assets/displayAdsPreview/5.jpg'), alt: 'Position Example 5' },
  { src: require('./assets/displayAdsPreview/6.jpg'), alt: 'Position Example 6' },
  { src: require('./assets/displayAdsPreview/7.jpg'), alt: 'Position Example 7' },
];

function PreviewPage() {
  const { id } = useParams();
  const [ads, setAds] = useState([]);
  const [includeDisplayAds, setIncludeDisplayAds] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // 'desktop', 'mobile', 'displayAds', 'adPositionExamples'
  const [viewMode, setViewMode] = useState('desktop');

  // Link Ad Copy Spreadsheet
  const [adCopySpreadsheetLink, setAdCopySpreadsheetLink] = useState('');

  useEffect(() => {
    const fetchData = async () => {
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

        setAds(data.ads || []);
        setIncludeDisplayAds(data.includeDisplayAds || false);

        if (data.adCopySpreadsheetLink) {
          setAdCopySpreadsheetLink(data.adCopySpreadsheetLink);
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data.");
        setLoading(false);
      }
    };

    fetchData();
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

  // Fallback dacă nu există ads
  const NoAdsMessage = () => (
    <p style={{ textAlign:'center', color:'#fff', fontStyle:'italic', marginTop:'20px' }}>
      No ads generated.
    </p>
  );

  // ------------------------------------------------
  // DESKTOP VIEW 
  // ------------------------------------------------
  const renderDesktopView = () => {
    if (!ads || ads.length === 0) return <NoAdsMessage />;

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
              transition:'transform 0.2s, boxShadow 0.2s',
              cursor:'default',
              position:'relative',
              fontFamily:'Arial, sans-serif'
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
            {/* Google & Search Bar */}
            <div style={{ marginBottom:'15px', textAlign:'center' }}>
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
              <div style={{
                display:'flex',
                justifyContent:'center',
                alignItems:'center',
                gap:'10px'
              }}>
                <div style={{
                  width:'500px',
                  height:'35px',
                  border:'1px solid #ddd',
                  borderRadius:'20px',
                  background:'#fff',
                  display:'flex',
                  alignItems:'center',
                  padding:'0 15px',
                  maxWidth:'100%'
                }}>
                  <span style={{ color:'#aaa', fontSize:'14px' }}>
                    Search...
                  </span>
                </div>
              </div>
            </div>
            {/* /Google & Search Bar */}

            {/* Sponsored */}
            <div style={{ marginBottom:'5px' }}>
              <span style={{ fontSize:'12px', color:'#5f6368' }}>
                Sponsored
              </span>
            </div>

            {/* Bulina + link */}
            <div style={{
              display:'flex', 
              alignItems:'center', 
              gap:'8px',
              marginBottom:'8px'
            }}>
              <div 
                style={{
                  width:'20px',
                  height:'20px',
                  borderRadius:'50%',
                  background:'#eee'
                }}
              />
              <span 
                style={{
                  fontSize:'14px',
                  color:'#006621',
                  overflow:'hidden',
                  textOverflow:'ellipsis',
                  whiteSpace:'nowrap'
                }}
              >
                {ad.link}
              </span>
            </div>

            {/* HEADLINES + DESCRIPTIONS */}
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

            {/* SITELINKS */}
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
                      padding:'6px 12px',
                      borderRadius:'30px',
                      background:'#f0f0f0'
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
  };

  // ------------------------------------------------
  // MOBILE VIEW cu ajustări pt dimensiuni
  // ------------------------------------------------
  const renderMobileView = () => {
    if (!ads || ads.length === 0) return <NoAdsMessage />;
  
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
              transition:'transform 0.2s, boxShadow 0.2s',
              fontFamily:'Arial, sans-serif'
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
            {/* Mobile Google */}
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
                  width:'100%',
                  maxWidth:'250px',
                  height:'30px',
                  border:'1px solid #ddd',
                  borderRadius:'20px',
                  background:'#fff',
                  display:'flex',
                  alignItems:'center',
                  padding:'0 10px',
                  margin:'0 auto'
                }}>
                  <span style={{ color:'#aaa', fontSize:'14px' }}>
                    Search...
                  </span>
                </div>
              </div>
            </div>
            {/* /Mobile Google */}
  
            {/* Rând "Sponsored" */}
            <div style={{ marginBottom:'5px' }}>
              <span style={{ fontSize:'12px', color:'#5f6368' }}>
                Sponsored
              </span>
            </div>
  
            {/* Rând bulină + link */}
            <div style={{
              display:'flex', 
              alignItems:'center', 
              gap:'8px',
              marginBottom:'8px'
            }}>
              <div 
                style={{
                  width:'20px',
                  height:'20px',
                  borderRadius:'50%',
                  background:'#eee'
                }}
              />
              <span 
                style={{
                  fontSize:'12px',
                  color:'#006621',
                }}
              >
                {ad.link}
              </span>
            </div>
  
            {/* HEADLINE */}
            <h3 style={{
              fontSize:'16px',
              color:'#1a0dab',
              margin:'0 0 8px',
              lineHeight:'1.2',
            }}>
              {[ad.h1, ad.h2, ad.h3].filter(Boolean).join(' | ')}
            </h3>
  
            {/* DESCRIPTIONS -lăsăm să facă wrap */}
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
  
            {/* SITELINKS */}
            {ad.sitelinks && ad.sitelinks.length > 0 && (
              <div style={{
                marginTop:'10px',
                display:'flex',
                flexWrap:'wrap',
                gap:'8px'
              }}>
                {ad.sitelinks.map((sl, i) => (
                  <a
                    key={i}
                    href={sl.url.startsWith('http') ? sl.url : `https://${sl.url}`}
                    style={{
                      color:'#1a0dab',
                      fontSize:'14px',
                      textDecoration:'none',
                      padding:'6px 10px',
                      borderRadius:'20px',
                      background:'#f0f0f0'
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
  };
  // Afișăm bannere (Display Ads)
  const renderDisplayAds = () => (
    <div style={{
      display:'flex',
      flexWrap:'wrap',
      gap:'20px',
      justifyContent:'center',
      marginTop:'20px'
    }}>
      {displayAdImages.map((item, i) => (
        <div key={i} style={{ textAlign:'center' }}>
          <img
            src={item.src}
            alt={item.alt}
            style={{
              maxWidth:'100%',
              height:'auto',
              border:'1px solid #ccc',
              background:'#fff',
              borderRadius:'8px',
              boxShadow:'0 2px 6px rgba(0,0,0,0.2)'
            }}
          />
          <p style={{ color:'#fff', marginTop:'5px' }}>
            {item.alt}px
          </p>
        </div>
      ))}
    </div>
  );

  // Afișăm screenshot-urile "Display Ad Position Examples"
  const renderAdPositionExamples = () => (
    <div 
      style={{
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        gap:'40px',
        marginTop:'20px'
      }}
    >
      {displayAdPositions.map((item, i) => (
        <div 
          key={i} 
          style={{ 
            textAlign: 'center',
            width: '100%',
            maxWidth: '900px',
            margin: '0 auto'
          }}
        >
          <img 
            src={item.src}
            alt={item.alt}
            style={{
              width: '100%',
              height:'auto',
              border:'1px solid #ccc',
              background:'#fff',
              borderRadius:'8px',
              boxShadow:'0 2px 6px rgba(0,0,0,0.2)'
            }}
          />
        </div>
      ))}
    </div>
  );

  // RENDER principal, în funcție de viewMode
  const renderContent = () => {
    switch (viewMode) {
      case 'desktop':
        return renderDesktopView();
      case 'mobile':
        return renderMobileView();
      case 'displayAds':
        return includeDisplayAds ? renderDisplayAds() : null;
      case 'adPositionExamples':
        return includeDisplayAds ? renderAdPositionExamples() : null;
      default:
        return renderDesktopView();
    }
  };

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
        Noble House Media Group
      </h2>
        <h2 style={{
          margin:'0 0 10px',
          color:'#fff',
          fontSize:'2em',
          fontWeight:'normal',
          textShadow:'0 2px 5px rgba(0,0,0,0.3)'
        }}>
          Preview Ads
        </h2>
      </div>

      {/* Link spre Ad Copy Spreadsheet */}
      {adCopySpreadsheetLink && (
        <div style={{
          marginBottom: '20px',
          color: '#fff',
          textAlign: 'center',
          fontSize:'16px'
        }}>
          <strong>Ad Copy Spreadsheet Link: </strong>
          <a
            href={adCopySpreadsheetLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#61dafb' }}
          >
            {adCopySpreadsheetLink}
          </a>
        </div>
      )}

      {/* Butoane Desktop / Mobile / Display Ads */}
      <div 
        style={{
          textAlign:'center', 
          marginBottom:'20px', 
          display:'flex',
          flexWrap:'wrap',
          gap:'10px',
          justifyContent:'center'
        }}
      >
        <button
          onClick={() => setViewMode('desktop')}
          style={{
            padding:'10px 20px',
            cursor:'pointer',
            background: viewMode === 'desktop' ? '#007BFF' : '#777',
            color:'#fff',
            border:'none',
            borderRadius:'20px',
            fontWeight:'bold'
          }}
        >
          Search Ads Desktop View
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
          Search Ads Mobile View
        </button>

        {includeDisplayAds && (
          <>
            <button
              onClick={() => setViewMode('displayAds')}
              style={{
                padding:'10px 20px',
                cursor:'pointer',
                background: viewMode === 'displayAds' ? '#007BFF' : '#777',
                color:'#fff',
                border:'none',
                borderRadius:'20px',
                fontWeight:'bold'
              }}
            >
              Display Ads
            </button>
            <button
              onClick={() => setViewMode('adPositionExamples')}
              style={{
                padding:'10px 20px',
                cursor:'pointer',
                background: viewMode === 'adPositionExamples' ? '#007BFF' : '#777',
                color:'#fff',
                border:'none',
                borderRadius:'20px',
                fontWeight:'bold'
              }}
            >
              Display Ad Position Examples
            </button>
          </>
        )}
      </div>

      {/* Container anunțuri */}
      <div style={{
        maxWidth:
          viewMode === 'desktop' ? '800px'
          : viewMode === 'mobile' ? '375px'
          : '1000px',
        margin:'0 auto',
        background: viewMode === 'mobile' ? '#f8f9fa' : 'transparent',
        border: viewMode === 'mobile' ? '1px solid #ccc' : 'none',
        borderRadius: viewMode === 'mobile' ? '20px' : '0px',
        boxShadow: viewMode === 'mobile' ? '0 5px 15px rgba(0,0,0,0.2)' : 'none',
        padding: viewMode === 'mobile' ? '20px' : '0'
      }}>
        {renderContent()}
      </div>
    </div>
  );
}

export default PreviewPage;