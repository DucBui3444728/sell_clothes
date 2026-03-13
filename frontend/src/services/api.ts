import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
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

// Response Interceptor: Handle automated token refresh later if needed
// api.interceptors.response.use(...)

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
