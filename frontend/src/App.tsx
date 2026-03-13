import { Routes, Route } from 'react-router-dom'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { Home } from './pages/Home'
import { Shop } from './pages/Shop'
import { ProductDetail } from './pages/ProductDetail'
import { Cart } from './pages/Cart'
import { Checkout } from './pages/Checkout'
import { CheckoutSuccess } from './pages/CheckoutSuccess'
import { CheckoutFailed } from './pages/CheckoutFailed'
import { Profile } from './pages/Profile'
import { Wishlist } from './pages/Wishlist'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import EmailVerification from './components/EmailVerification';
import { LoadingOverlay } from './components/LoadingOverlay'

function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-800">
      <LoadingOverlay />
      <Header />
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/checkout/fail" element={<CheckoutFailed />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
