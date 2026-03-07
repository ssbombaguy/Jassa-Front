import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import CartSidebar from './components/CartSidebar/CartSidebar';
import OfflineBanner from './components/OfflineBanner/OfflineBanner';
import Home from './pages/Home';
import Jerseys from './pages/Jerseys';
import JerseyDetail from './pages/JerseyDetail';
import Leagues from './pages/Leagues';
import { useState } from 'react';
// import Products from './pages/Products'; // need to create this
// import Search from './pages/Search';  

const App = () => {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <BrowserRouter>
      <OfflineBanner />
      <div className="appLayout">
        <Navbar onCartOpen={() => setCartOpen(true)} />
        <main className="appMain">
          <Routes>
            <Route path="/boots" element={<Products category="boots" />} />
            <Route path="/equipment" element={<Products category="equipment" />} />
            <Route path="/sale" element={<Jerseys defaultFilter={{ is_discounted: true }} />} />
            <Route path="/new-arrivals" element={<Jerseys defaultFilter={{ is_new_arrival: true }} />} />
            <Route path="/search" element={<Search />} />
          </Routes>
        </main>
        <Footer />
        <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
      </div>
    </BrowserRouter>
  );
};

export default App;
