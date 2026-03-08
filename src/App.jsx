import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import CartSidebar from './components/CartSidebar/CartSidebar';
import OfflineBanner from './components/OfflineBanner/OfflineBanner';
import Home from './pages/Home';
import ProductListPage from './pages/ProductListPage';
import JerseyDetail from './pages/JerseyDetail';
import ProductDetail from './pages/ProductDetail';
import Leagues from './pages/Leagues';
import Wishlist from './pages/Wishlist';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

const App = () => {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="appLayout">
        <OfflineBanner />
        <Navbar onCartOpen={() => setCartOpen(true)} />
        <main className="appMain">
          <Routes>
            <Route path="/" element={<Home />} />

            {/* Jerseys */}
            <Route path="/jerseys" element={<ProductListPage type="jerseys" title="Jerseys" />} />
            <Route path="/jerseys/:id" element={<JerseyDetail />} />

            {/* Products */}
            <Route path="/products/:id" element={<ProductDetail />} />

            {/* Filtered jersey pages */}
            <Route path="/sale" element={
              <ProductListPage type="jerseys" title="Sale" defaultFilters={{ is_discounted: true }} />
            } />
            <Route path="/new-arrivals" element={
              <ProductListPage type="jerseys" title="New Arrivals" defaultFilters={{ is_new_arrival: true }} />
            } />

            {/* Boots */}
            <Route path="/boots" element={
              <ProductListPage type="products" title="Boots" category="boot" showLeagueFilter={false} />
            } />
            <Route path="/boots/:subcategory" element={
              <ProductListPage type="products" title="Boots" category="boot" showLeagueFilter={false} />
            } />

            {/* Equipment */}
            <Route path="/equipment" element={
              <ProductListPage type="products" title="Equipment" category="equipment" showLeagueFilter={false} />
            } />
            <Route path="/equipment/:subcategory" element={
              <ProductListPage type="products" title="Equipment" category="equipment" showLeagueFilter={false} />
            } />

            {/* Training */}
            <Route path="/training" element={
              <ProductListPage type="products" title="Training" category="training" showLeagueFilter={false} />
            } />
            <Route path="/training/:subcategory" element={
              <ProductListPage type="products" title="Training" category="training" showLeagueFilter={false} />
            } />

            {/* Accessories */}
            <Route path="/accessories" element={
              <ProductListPage type="products" title="Accessories" category="accessory" showLeagueFilter={false} />
            } />

            {/* Leagues */}
            <Route path="/leagues" element={<Leagues />} />
            <Route path="/leagues/:id" element={<Leagues />} />

            {/* Wishlist */}
            <Route path="/wishlist" element={<Wishlist />} />

            {/* Admin */}
            <Route path="/admin" element={<Admin />} />

            {/* Catch-all */}
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