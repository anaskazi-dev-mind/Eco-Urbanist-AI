import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Results from './pages/Results';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen relative">
        {/* FALLING LEAVES - LEFT & RIGHT SIDES ONLY */}
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 999 }}>
          {/* LEFT SIDE LEAVES */}
          <div style={{ position: 'absolute', left: '2%', top: '-10%', fontSize: '2rem', animation: 'floatLeaf 15s infinite linear', animationDelay: '0s' }}>🍃</div>
          <div style={{ position: 'absolute', left: '8%', top: '-10%', fontSize: '1.5rem', animation: 'floatLeafReverse 18s infinite linear', animationDelay: '3s' }}>🌿</div>
          <div style={{ position: 'absolute', left: '5%', top: '-10%', fontSize: '2rem', animation: 'floatLeaf 15s infinite linear', animationDelay: '6s' }}>🍀</div>
          <div style={{ position: 'absolute', left: '12%', top: '-10%', fontSize: '2.5rem', animation: 'floatLeafReverse 18s infinite linear', animationDelay: '2s' }}>🌱</div>
          <div style={{ position: 'absolute', left: '3%', top: '-10%', fontSize: '2rem', animation: 'floatLeaf 15s infinite linear', animationDelay: '8s' }}>🌾</div>
          <div style={{ position: 'absolute', left: '10%', top: '-10%', fontSize: '1.8rem', animation: 'floatLeafReverse 18s infinite linear', animationDelay: '5s' }}>🪴</div>
          <div style={{ position: 'absolute', left: '7%', top: '-10%', fontSize: '1.6rem', animation: 'floatLeaf 15s infinite linear', animationDelay: '10s' }}>🍃</div>

          {/* RIGHT SIDE LEAVES */}
          <div style={{ position: 'absolute', right: '2%', top: '-10%', fontSize: '2rem', animation: 'floatLeafReverse 18s infinite linear', animationDelay: '1s' }}>🌿</div>
          <div style={{ position: 'absolute', right: '8%', top: '-10%', fontSize: '1.5rem', animation: 'floatLeaf 15s infinite linear', animationDelay: '4s' }}>🍀</div>
          <div style={{ position: 'absolute', right: '5%', top: '-10%', fontSize: '2.2rem', animation: 'floatLeafReverse 18s infinite linear', animationDelay: '7s' }}>🌱</div>
          <div style={{ position: 'absolute', right: '12%', top: '-10%', fontSize: '2rem', animation: 'floatLeaf 15s infinite linear', animationDelay: '2s' }}>🌾</div>
          <div style={{ position: 'absolute', right: '3%', top: '-10%', fontSize: '1.8rem', animation: 'floatLeafReverse 18s infinite linear', animationDelay: '9s' }}>🪴</div>
          <div style={{ position: 'absolute', right: '10%', top: '-10%', fontSize: '2.3rem', animation: 'floatLeaf 15s infinite linear', animationDelay: '5s' }}>🍃</div>
          <div style={{ position: 'absolute', right: '7%', top: '-10%', fontSize: '1.7rem', animation: 'floatLeafReverse 18s infinite linear', animationDelay: '11s' }}>🌿</div>
        </div>
        
        <Navbar />
        <main className="flex-grow relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/results" element={<Results />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;