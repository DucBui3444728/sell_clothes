import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

export const Register: React.FC = () => {
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);

    const [errors, setErrors] = useState<{
        fullname?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
        terms?: string;
    }>({});

    const navigate = useNavigate();
    const { showToast } = useToast();

    const validateForm = () => {
        const newErrors: typeof errors = {};
        let isValid = true;

        if (!fullname.trim()) {
            newErrors.fullname = 'Full name is required';
            isValid = false;
        }

        if (!email) {
            newErrors.email = 'Email address is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Please enter a valid email address';
            isValid = false;
        }

        if (!password) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
            isValid = false;
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        if (!termsAccepted) {
            newErrors.terms = 'You must accept the terms and conditions';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Handle registration logic here (mocked for now)
        showToast('Registration successful! You can now log in.', 'success');
        navigate('/login');
    };
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 -translate-y-12 -translate-x-1/3">
                <div className="w-96 h-96 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            </div>
            <div className="absolute bottom-0 right-0 translate-y-1/3 translate-x-1/3">
                <div className="w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl overflow-hidden p-8 sm:p-10">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                            Create Account
                        </h2>
                        <p className="mt-2 text-slate-500">
                            Join us and start shopping today
                        </p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {/* Full Name */}
                        <div>
                            <label htmlFor="fullname" className="block text-sm font-medium text-slate-700 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    id="fullname"
                                    type="text"
                                    value={fullname}
                                    onChange={(e) => {
                                        setFullname(e.target.value);
                                        if (errors.fullname) setErrors({ ...errors, fullname: undefined });
                                    }}
                                    className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-slate-50/50 transition-all text-slate-900 shadow-sm ${errors.fullname ? 'border-red-300 ring-red-100 ring-4 focus:ring-red-200 focus:border-red-400' : 'border-slate-200'
                                        }`}
                                    placeholder="John Doe"
                                />
                            </div>
                            {errors.fullname && (
                                <p className="mt-2 text-sm text-red-500">{errors.fullname}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (errors.email) setErrors({ ...errors, email: undefined });
                                    }}
                                    className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-slate-50/50 transition-all text-slate-900 shadow-sm ${errors.email ? 'border-red-300 ring-red-100 ring-4 focus:ring-red-200 focus:border-red-400' : 'border-slate-200'
                                        }`}
                                    placeholder="you@example.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-2 text-sm text-red-500">{errors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (errors.password) setErrors({ ...errors, password: undefined });
                                        if (errors.confirmPassword && confirmPassword === e.target.value) {
                                            setErrors({ ...errors, password: undefined, confirmPassword: undefined });
                                        }
                                    }}
                                    className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-slate-50/50 transition-all text-slate-900 shadow-sm ${errors.password ? 'border-red-300 ring-red-100 ring-4 focus:ring-red-200 focus:border-red-400' : 'border-slate-200'
                                        }`}
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && (
                                <p className="mt-2 text-sm text-red-500">{errors.password}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    id="confirm-password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                                    }}
                                    className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-slate-50/50 transition-all text-slate-900 shadow-sm ${errors.confirmPassword ? 'border-red-300 ring-red-100 ring-4 focus:ring-red-200 focus:border-red-400' : 'border-slate-200'
                                        }`}
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-2 text-sm text-red-500">{errors.confirmPassword}</p>
                            )}
                        </div>

                        {/* Terms */}
                        <div>
                            <div className="flex items-start gap-2">
                                <input
                                    id="terms"
                                    type="checkbox"
                                    checked={termsAccepted}
                                    onChange={(e) => {
                                        setTermsAccepted(e.target.checked);
                                        if (errors.terms) setErrors({ ...errors, terms: undefined });
                                    }}
                                    className={`mt-1 h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 accent-primary-600 ${errors.terms ? 'border-red-500' : ''}`}
                                />
                                <label htmlFor="terms" className="text-sm text-slate-600">
                                    I agree to the{' '}
                                    <a href="#" className="text-primary-600 hover:text-primary-500 font-medium">Terms of Service</a>
                                    {' '}and{' '}
                                    <a href="#" className="text-primary-600 hover:text-primary-500 font-medium">Privacy Policy</a>
                                </label>
                            </div>
                            {errors.terms && (
                                <p className="mt-2 text-sm text-red-500 pl-6">{errors.terms}</p>
                            )}
                        </div>

                        <Button variant="primary" className="w-full h-12 text-base rounded-xl shadow-lg shadow-primary-500/30 group">
                            Create Account
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-500">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
