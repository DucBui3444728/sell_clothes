import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/** Resolve an image path: if it's already a full URL, return as-is; if relative, prepend API_BASE_URL */
export const resolveImageUrl = (path: string | null | undefined, fallback?: string): string => {
  if (!path) return fallback || '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${API_BASE_URL}${path}`;
};

// Create an Axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach access token if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Auto-logout on 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// ======================== //
//      AUTH API CALLS      //
// ======================== //

export const authService = {
  register: async (data: any) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: any) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  verifyEmail: async (data: { token: string }) => {
    const response = await api.post('/auth/verify-email', data);
    return response.data;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await api.post('/auth/refresh-token', { refresh_token: refreshToken });
    return response.data;
  }
};

// ======================== //
//      USER API CALLS      //
// ======================== //

export const userService = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (formData: FormData) => {
    // Need to use multipart/form-data for file uploads
    const response = await api.put('/users/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

// ======================== //
//     ADDRESS API CALLS    //
// ======================== //

export interface Address {
  id: string;
  phone: string;
  detailed_address: string;
  street: string;
  city: string;
  state: string;
  country: string;
  is_default: boolean;
}

export const addressService = {
  getAddresses: async (): Promise<Address[]> => {
    const response = await api.get('/addresses');
    return response.data;
  },

  createAddress: async (data: Partial<Address>): Promise<Address> => {
    const response = await api.post('/addresses', data);
    return response.data;
  },

  updateAddress: async (id: string, data: Partial<Address>): Promise<Address> => {
    const response = await api.put(`/addresses/${id}`, data);
    return response.data;
  },

  deleteAddress: async (id: string) => {
    const response = await api.delete(`/addresses/${id}`);
    return response.data;
  }
};

// ======================== //
//     ADMIN API CALLS      //
// ======================== //

export const adminUserService = {
  getUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  updateRole: async (id: string, role: string) => {
    const response = await api.put(`/users/${id}/role`, { role });
    return response.data;
  },
  deleteUser: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }
};

export const categoryService = {
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },
  createCategory: async (formData: FormData) => {
    const response = await api.post('/categories', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  updateCategory: async (id: string, formData: FormData) => {
    const response = await api.put(`/categories/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  deleteCategory: async (id: string) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  }
};

export const productService = {
  getProducts: async () => {
    const response = await api.get('/products');
    return response.data;
  },
  getProductById: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  createProduct: async (formData: FormData) => {
    const response = await api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  updateProduct: async (id: string, formData: FormData) => {
    const response = await api.put(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  deleteProduct: async (id: string) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
  deleteMedia: async (mediaId: string) => {
    const response = await api.delete(`/products/media/${mediaId}`);
    return response.data;
  }
};

export const orderService = {
  getOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },
  getMyOrders: async () => {
    const response = await api.get('/orders/my-orders');
    return response.data;
  },
  updateStatus: async (id: string, status: string) => {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data;
  }
};

export const supportService = {
  getTickets: async () => {
    const response = await api.get('/support');
    return response.data;
  },
  replyTicket: async (id: string, reply: string, status: string) => {
    const response = await api.put(`/support/${id}/reply`, { reply, status });
    return response.data;
  }
};

export const wishlistService = {
  getWishlist: async () => {
    const response = await api.get('/wishlist');
    return response.data;
  },
  addToWishlist: async (productId: string) => {
    const response = await api.post('/wishlist', { product_id: productId });
    return response.data;
  },
  removeFromWishlist: async (id: string) => {
    const response = await api.delete(`/wishlist/${id}`);
    return response.data;
  }
};

export const ratingService = {
  getRatingsByProduct: async (productId: string) => {
    const response = await api.get(`/ratings/product/${productId}`);
    return response.data;
  },
  addRating: async (productId: string, rating: number, review?: string) => {
    const response = await api.post('/ratings', { product_id: productId, rating, review });
    return response.data;
  }
};

export const cartService = {
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },
  addToCart: async (productId: string, quantity: number, size?: string, color?: string) => {
    const response = await api.post('/cart', { product_id: productId, quantity, size, color });
    return response.data;
  },
  updateCartItem: async (id: string, quantity: number) => {
    const response = await api.put(`/cart/${id}`, { quantity });
    return response.data;
  },
  removeFromCart: async (id: string) => {
    const response = await api.delete(`/cart/${id}`);
    return response.data;
  },
  clearCart: async () => {
    const response = await api.delete('/cart');
    return response.data;
  }
};
