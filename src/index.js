// index.js
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';

import { auth } from './firebase'; 
import Login from './Login';       
import App from './App';         
import PreviewPage from './PreviewPage';

function Root() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ascultăm starea de autentificare
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ color:'#fff', textAlign:'center', marginTop:'100px' }}>
        Checking auth...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Permitem accesul anonim pentru pagina de preview */}
        <Route path="/preview/:id" element={<PreviewPage />} />

        {/* Dacă utilizatorul nu este logat, afișăm Login pentru alte rute */}
        {!user ? (
          <Route path="*" element={<Login />} />
        ) : (
          <>
            {/* Rutele normale protejate */}
            <Route path="/" element={<App user={user} />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Root />);
