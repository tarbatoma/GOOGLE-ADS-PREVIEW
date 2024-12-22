// App.js
import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import InputForm from './components/InputForm';
import AdsList from './components/AdsList';
import { db } from './firebase';
import { collection, addDoc } from "firebase/firestore";

function App() {
  const [clientLink, setClientLink] = useState('');
  const [headlines1, setHeadlines1] = useState([]);
  const [headlines2, setHeadlines2] = useState([]);
  const [headlines3, setHeadlines3] = useState([]);
  const [descriptions, setDescriptions] = useState([]);
  const [generatedAds, setGeneratedAds] = useState([]);

  // Toggling + data for call asset
  const [useCallAsset, setUseCallAsset] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  // Toggling + data for sitelinks
  const [useSitelinks, setUseSitelinks] = useState(false);
  const [sitelinks, setSitelinks] = useState([
    { title: '', url: '' },
    { title: '', url: '' },
    { title: '', url: '' },
    { title: '', url: '' },
  ]);

  // Toggling + data for headline 3
  const [useHeadline3, setUseHeadline3] = useState(true);

  const [isDragging, setIsDragging] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const [previewLink, setPreviewLink] = useState('');
  const dropRef = useRef(null);

  function getRandomItem(array) {
    const index = Math.floor(Math.random() * array.length);
    return array[index];
  }

  async function saveAdsToFirestore(ads) {
    const expiresAt = Date.now() + (30 * 24 * 60 * 60 * 1000);
    const docRef = await addDoc(collection(db, "adsPreviews"), {
      ads,
      expiresAt,
    });
    return docRef.id;
  }

  const generateAds = async () => {
    if (headlines1.length === 0 || headlines2.length === 0 || descriptions.length === 0) {
      alert("Please ensure you have at least one H1, one H2, and one Description.");
      return;
    }

    const ads = [];
    for (let i = 0; i < 10; i++) {
      const h1 = getRandomItem(headlines1);
      const h2 = getRandomItem(headlines2);
      const h3 = (useHeadline3 && headlines3.length > 0) ? getRandomItem(headlines3) : '';

      // Descriptions
      let d1;
      let d2;
      if (descriptions.length === 1) {
        d1 = descriptions[0];
        d2 = descriptions[0];
      } else {
        d1 = getRandomItem(descriptions);
        let d2Candidate = getRandomItem(descriptions);
        while (descriptions.length > 1 && d2Candidate === d1) {
          d2Candidate = getRandomItem(descriptions);
        }
        d2 = d2Candidate;
      }

      const ad = { 
        h1, h2, h3, 
        d1, d2, 
        link: clientLink.trim() || 'www.example.com' 
      };

      // Adaugăm call asset (phoneNumber) dacă este setat
      if (useCallAsset && phoneNumber.trim() !== '') {
        ad.phoneNumber = phoneNumber.trim();
      }

      // Adăugăm sitelinks dacă sunt activate
      if (useSitelinks) {
        const validSitelinks = sitelinks.filter(sl => sl.title.trim() !== '' && sl.url.trim() !== '');
        if (validSitelinks.length > 0) {
          ad.sitelinks = validSitelinks;
        }
      }

      ads.push(ad);
    }

    setGeneratedAds(ads);

    const docId = await saveAdsToFirestore(ads);
    const link = `${window.location.origin}/preview/${docId}`;
    setPreviewLink(link);
  };

  const handleFiles = (files) => {
    const file = files[0];
    if (!file) return;
    Papa.parse(file, {
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data;
        setUploadMessage('');

        if (!data || data.length <= 1) {
          setUploadMessage('No data extracted from the CSV. Please check the file format.');
          return;
        }

        const newClientLinks = [];
        const newH1 = [];
        const newH2 = [];
        const newH3 = [];
        const newDesc = [];

        for (let i = 1; i < data.length; i++) {
          const row = data[i];
          if (row && row.length > 7) {
            const website = row[0]?.trim();
            const h1 = row[1]?.trim();
            const h2 = row[3]?.trim();
            const h3 = row[5]?.trim();
            const desc = row[7]?.trim();

            if (website) newClientLinks.push(website);
            if (h1) newH1.push(h1);
            if (h2) newH2.push(h2);
            if (h3) newH3.push(h3);
            if (desc) newDesc.push(desc);
          }
        }

        if (newClientLinks.length > 0) {
          setClientLink(newClientLinks[newClientLinks.length - 1]);
        }
        if (newH1.length > 0) setHeadlines1(prev => [...prev, ...newH1]);
        if (newH2.length > 0) setHeadlines2(prev => [...prev, ...newH2]);
        if (newH3.length > 0) setHeadlines3(prev => [...prev, ...newH3]);
        if (newDesc.length > 0) setDescriptions(prev => [...prev, ...newDesc]);

        if (
          newClientLinks.length === 0 && 
          newH1.length === 0 && 
          newH2.length === 0 && 
          newH3.length === 0 && 
          newDesc.length === 0
        ) {
          setUploadMessage('No data extracted from the CSV. Please check the file format.');
        } else {
          setUploadMessage('Upload successful! You can now generate ads.');
        }
      },
      error: () => {
        setUploadMessage('Error parsing CSV. Please try again.');
      }
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  return (
    <div 
      style={{
        fontFamily: 'sans-serif',
        minHeight: '100vh',
        background: '#1f2631',
        display: 'flex',
        flexDirection: 'column'
      }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
      ref={dropRef}
    >
      {isDragging && (
        <div style={{
          position: 'fixed',
          top:0, left:0, right:0, bottom:0,
          backgroundColor: 'rgba(0,0,0,0.3)',
          zIndex: 9999,
          display:'flex',
          alignItems:'center',
          justifyContent:'center',
          color:'#fff',
          fontSize:'24px',
          fontWeight:'bold'
        }}>
          Drop your CSV file here
        </div>
      )}

      <h1 style={{ 
        textAlign: 'center', 
        margin: '30px 0', 
        color: '#fff', 
        fontSize: '2.5em',
        textShadow: '0 2px 5px rgba(0,0,0,0.3)'
      }}>
        Google Ads Preview Tool
      </h1>

      <div style={{
        background: '#fff',
        maxWidth: '1400px',
        margin: '0 auto 40px auto',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        padding: '30px',
        transition: 'all 0.3s ease-in-out'
      }}>
        <InputForm
          headlines1={headlines1} setHeadlines1={setHeadlines1}
          headlines2={headlines2} setHeadlines2={setHeadlines2}
          headlines3={headlines3} setHeadlines3={setHeadlines3}
          descriptions={descriptions} setDescriptions={setDescriptions}
          clientLink={clientLink} setClientLink={setClientLink}
          phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber}
          sitelinks={sitelinks} setSitelinks={setSitelinks}
          useSitelinks={useSitelinks}
        />
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            marginBottom: '20px',
            display:'flex',
            justifyContent:'center',
            alignItems:'center',
            flexDirection:'column'
          }}>
            <p style={{ color:'#333', marginBottom:'10px', fontWeight:'bold' }}>
              Or Click Below to Choose a CSV File
            </p>
            <label 
              htmlFor="csvUpload"
              style={{
                display: 'inline-block',
                marginRight: '20px',
                background: '#28a745',
                color: '#fff',
                padding: '12px 20px',
                borderRadius: '30px',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                fontWeight: 'bold',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
              }}
              onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={e => e.target.style.transform = 'scale(1)'}
            >
              Upload CSV
            </label>
            <input 
              type="file" 
              id="csvUpload" 
              style={{ display: 'none' }} 
              accept=".csv" 
              onChange={(e) => {
                if(e.target.files && e.target.files.length > 0) {
                  handleFiles(e.target.files);
                }
              }}
            />
            {uploadMessage && (
              <p style={{ color: 'green', marginTop: '10px', fontWeight:'bold' }}>
                {uploadMessage}
              </p>
            )}
          </div>

          <div style={{marginBottom:'20px'}}>
            <button 
              onClick={() => setUseHeadline3(true)} 
              style={{
                padding: '10px 20px', 
                cursor: 'pointer', 
                background: useHeadline3 ? '#007BFF' : '#777',
                color: '#fff',
                border: 'none',
                borderRadius: '20px',
                marginRight:'10px',
                fontWeight: 'bold'
              }}
            >
              With Headline 3
            </button>

            <button 
              onClick={() => setUseHeadline3(false)} 
              style={{
                padding: '10px 20px', 
                cursor: 'pointer', 
                background: !useHeadline3 ? '#007BFF' : '#777',
                color: '#fff',
                border: 'none',
                borderRadius: '20px',
                fontWeight: 'bold',
                marginRight:'10px'
              }}
            >
              Without Headline 3
            </button>

            <button 
              onClick={() => setUseCallAsset(!useCallAsset)} 
              style={{
                padding: '10px 20px', 
                cursor: 'pointer', 
                background: useCallAsset ? '#007BFF' : '#777',
                color: '#fff',
                border: 'none',
                borderRadius: '20px',
                fontWeight: 'bold',
                marginRight:'10px'
              }}
            >
              {useCallAsset ? 'With Call Asset' : 'Without Call Asset'}
            </button>

            <button
              onClick={() => setUseSitelinks(!useSitelinks)}
              style={{
                padding: '10px 20px',
                cursor: 'pointer',
                background: useSitelinks ? '#007BFF' : '#777',
                color: '#fff',
                border: 'none',
                borderRadius: '20px',
                fontWeight: 'bold'
              }}
            >
              {useSitelinks ? 'With Sitelinks' : 'Without Sitelinks'}
            </button>
          </div>

          <button 
            onClick={generateAds} 
            style={{
              padding: '14px 28px', 
              fontSize: '16px', 
              cursor: 'pointer', 
              background: '#007BFF',
              color: '#fff',
              border: 'none',
              borderRadius: '30px',
              transition: 'transform 0.2s, background 0.3s',
              fontWeight: 'bold',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}
            onMouseOver={e => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.background = '#0062CC';
            }}
            onMouseOut={e => {
              e.target.style.transform = 'scale(1)';
              e.target.style.background = '#007BFF';
            }}
          >
            Generate 10 Random Ads
          </button>

          {previewLink && (
            <div style={{ marginTop: '20px' }}>
              <p style={{color:'#333', marginBottom:'10px'}}>
                Your preview link:
              </p>
              <p style={{
                color:'#333',
                marginBottom:'10px',
                wordBreak:'break-all'
              }}>
                {previewLink}
              </p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(previewLink);
                  alert('Link copied to clipboard!');
                }}
                style={{
                  padding: '10px 20px',
                  cursor: 'pointer',
                  background: '#28a745',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '20px',
                  fontWeight: 'bold'
                }}
              >
                Copy Link
              </button>
            </div>
          )}
        </div>
      </div>

      <div style={{maxWidth: '1400px', margin:'0 auto', padding: '0 20px', marginBottom:'40px'}}>
        <AdsList ads={generatedAds} />
      </div>
    </div>
  );
}

export default App;
