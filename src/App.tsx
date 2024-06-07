import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductsList from './features/products/ProductsList/ProductsList';
import ProductView from './features/products/ProductView/ProductView';
import RedirectHome from './features/RedirectPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProductsList />} />
        <Route path="/products/:id" element={<ProductView />} />
        <Route path="*" element={<RedirectHome />} />
      </Routes>
    </Router>
  );
};

export default App;
