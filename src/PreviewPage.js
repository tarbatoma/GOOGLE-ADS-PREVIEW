// PreviewPage.js
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

function PreviewPage() {
  const { id } = useParams();
  const [ads, setAds] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div style={{color:'#fff', textAlign:'center', paddingTop:'50px', fontSize:'18px'}}>Loading...</div>;
  if (error) return <div style={{color:'#fff', textAlign:'center', paddingTop:'50px', fontSize:'18px'}}>{error}</div>;

  return (
    <div style={{
      background: '#1f2631',
      minHeight: '100vh',
      padding: '40px 20px',
      boxSizing: 'border-box',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{ 
        textAlign: 'center', 
        marginBottom: '40px', 
        color: '#fff', 
        fontSize: '2em',
        fontWeight: 'normal',
        textShadow:'0 2px 5px rgba(0,0,0,0.3)'
      }}>
        Preview Ads
      </h2>
      <div style={{
        maxWidth:'800px',
        margin:'0 auto',
        display:'flex',
        flexDirection:'column',
        gap:'20px'
      }}>
        {ads.map((ad, idx) => (
          <div key={idx} style={{
            background:'#fff',
            border:'1px solid #ddd',
            borderRadius:'8px',
            boxShadow:'0 1px 3px rgba(0,0,0,0.1)',
            padding:'20px',
            transition:'transform 0.2s, box-shadow 0.2s',
            cursor:'default',
            position:'relative'
          }}
          onMouseOver={e => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
          }}>
            <div style={{ 
              fontSize: '12px', 
              color: '#5f6368', 
              marginBottom: '5px',
              letterSpacing:'0.5px'
            }}>
              Sponsored
            </div>
            <div style={{
              fontSize: '14px',
              color: '#006621',
              marginBottom: '5px',
              wordBreak: 'break-all',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {ad.link}
            </div>
            <h3 style={{
              fontSize: '18px',
              margin: '0 0 10px',
              color: '#1a0dab',
              fontWeight: 'normal',
              lineHeight: '1.3',
              overflow: 'hidden',
              textOverflow:'ellipsis',
              whiteSpace:'nowrap'
            }}>
              {[ad.h1, ad.h2, ad.h3].filter(Boolean).join(' | ')}
            </h3>
            <p style={{ 
              fontSize: '14px', 
              margin: '0 0 5px', 
              color: '#202124', 
              lineHeight: '1.4' 
            }}>
              {ad.d1}
            </p>
            <p style={{ 
              fontSize: '14px', 
              margin: '0 0 5px', 
              color: '#202124', 
              lineHeight: '1.4' 
            }}>
              {ad.d2}
            </p>
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
                <span style={{fontSize:'16px'}}>📞</span> 
                Call {ad.phoneNumber}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PreviewPage;
