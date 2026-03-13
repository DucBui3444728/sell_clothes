import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/api';

const EmailVerification: React.FC = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || 'your email';

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling && element.value !== '') {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = otp.join('');
    
    if (token.length !== 6) {
      setError('Please enter a valid 6-digit code.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await authService.verifyEmail({ token });
      alert('Email verified successfully! You can now login.');
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Verify Your Email</h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          We have sent a 6-digit code to {email}. Please enter it below.
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleVerify}>
          <div className="flex justify-between mb-6">
            {otp.map((data, index) => {
              return (
                <input
                  className="w-12 h-12 text-center border rounded text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  name="otp"
                  maxLength={1}
                  key={index}
                  value={data}
                  onChange={e => handleChange(e.target, index)}
                  onFocus={e => e.target.select()}
                />
              );
            })}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white p-3 rounded font-semibold transition ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>
        
        <div className="mt-4 text-center text-sm">
          <button 
            type="button"
            className="text-blue-600 hover:underline"
            onClick={() => navigate('/login')}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
