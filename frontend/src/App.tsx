import { Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { AdminRoute } from './components/routing/AdminRoute';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminProductForm } from './pages/admin/AdminProductForm';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminSupport } from './pages/admin/AdminSupport';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { Categories } from './pages/Categories';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { CheckoutSuccess } from './pages/CheckoutSuccess';
import { CheckoutFailed } from './pages/CheckoutFailed';
import { Profile } from './pages/Profile';
import { Wishlist } from './pages/Wishlist';
import { About } from './pages/About';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import EmailVerification from './components/EmailVerification';
import { LoadingOverlay } from './components/LoadingOverlay';
import { ScrollToTop } from './components/ScrollToTop';

function App() {
  return (
    <>
      <LoadingOverlay />
      <ScrollToTop />
      <Routes>
        {/* Public Application Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/checkout/fail" element={<CheckoutFailed />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="*" element={<Home />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<AdminProductForm />} />
            <Route path="products/edit/:id" element={<AdminProductForm />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="support" element={<AdminSupport />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
