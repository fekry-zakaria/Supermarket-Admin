import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
// import Categories from '../pages/Categories';
import Products from '../pages/Products';
import NotFound from '../pages/NotFound';
import Offers from '../pages/offers';
import OffersList from '../pages/OffersList';
import Navbar from '../components/Navbar';
// import ProtectedRoute from '../components/ProtectedRoute';

const AppRoutes = () => {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
        
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/offersList" element={<OffersList />} />
       
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

