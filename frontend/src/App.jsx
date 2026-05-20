import React, { useState, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './shared/Navbar';
import CatalogPage from './catalog/CatalogPage';
import OrdersPage from './orders/OrdersPage';
import CartWidget from './shared/CartWidget';

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartVersion, setCartVersion] = useState(0);

  const refreshCart = useCallback(() => setCartVersion(v => v + 1), []);

  return (
    <>
      <Navbar onCartClick={() => setCartOpen(true)} cartVersion={cartVersion} />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
        <Routes>
          <Route path="/"        element={<CatalogPage onCartChange={refreshCart} />} />
          <Route path="/orders"  element={<OrdersPage />} />
        </Routes>
      </main>
      {cartOpen && (
        <CartWidget
          onClose={() => setCartOpen(false)}
          onCartChange={refreshCart}
          cartVersion={cartVersion}
        />
      )}
    </>
  );
}
