import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import CartSidebar from './components/CartSidebar/CartSidebar';
import OfflineBanner from './components/OfflineBanner/OfflineBanner';
import Home from './pages/Home';
import Jerseys from './pages/Jerseys';
import JerseyDetail from './pages/JerseyDetail';
import Leagues from './pages/Leagues';
import NotFound from './pages/NotFound';
import { useState } from 'react';

const App = () => {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <BrowserRouter>
      <OfflineBanner />
      <div className="appLayout">
        <Navbar onCartOpen={() => setCartOpen(true)} />
        <main className="appMain">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jerseys" element={<Jerseys />} />
            <Route path="/jerseys/:id" element={<JerseyDetail />} />
            <Route path="/leagues" element={<Leagues />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
      </div>
    </BrowserRouter>
  );
};

export default App;
