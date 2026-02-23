import React from 'react';
import { Mail, Lock, ArrowRight, Github } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';

export const Login: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
                <div className="w-96 h-96 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            </div>
            <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3">
                <div className="w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl overflow-hidden p-8 sm:p-10">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                            Welcome Back
                        </h2>
                        <p className="mt-2 text-slate-500">
                            Sign in to your account to continue
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
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
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-slate-50/50 transition-all text-slate-900 shadow-sm"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                                    Password
                                </label>
                                <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                                    Forgot password?
                                </a>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-slate-50/50 transition-all text-slate-900 shadow-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <Button variant="primary" className="w-full h-12 text-base rounded-xl shadow-lg shadow-primary-500/30 group">
                            Sign In
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </form>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-slate-500">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Button variant="secondary" className="w-full h-12 rounded-xl flex items-center justify-center gap-2">
                                <Github className="w-5 h-5 text-slate-800" />
                                <span className="text-slate-800 font-medium">GitHub</span>
                            </Button>
                        </div>
                    </div>

                    <p className="mt-8 text-center text-sm text-slate-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-500">
                            Sign up free
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
