import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { CartProvider } from './context/CartContext'
import { UserActivityProvider } from './context/UserActivityContext'
import { WishlistProvider } from './context/WishlistContext'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UserActivityProvider>
          <WishlistProvider>
            <CartProvider>
              <ToastProvider>
                <App />
              </ToastProvider>
            </CartProvider>
          </WishlistProvider>
        </UserActivityProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
