import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import { UserPlus, User, Mail, Lock, ArrowLeft, Loader2 } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <AppLayout isPublic={true}>
            <Head title="Daftar Akun Penulis - BlogVerse Pro" />

            <div className="py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-blue-500/20">
                            <UserPlus className="w-6 h-6" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Daftar Akun Penulis
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Mulai terbitkan artikel bermutu dan bagikan inspirasi Anda
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Nama Lengkap */}
                        <div>
                            <label htmlFor="register-name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Nama Lengkap
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <User className="w-4 h-4" />
                                </div>
                                <input
                                    id="register-name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 transition ${
                                        errors.name
                                            ? 'border-rose-400 focus:ring-rose-200 text-rose-900'
                                            : 'border-slate-300 focus:ring-blue-200 focus:border-blue-600 text-slate-900'
                                    }`}
                                    placeholder="Contoh: John Doe"
                                    required
                                    autoFocus
                                />
                            </div>
                            {errors.name && (
                                <p className="text-xs text-rose-600 mt-1 font-medium">{errors.name}</p>
                            )}
                        </div>

                        {/* Username */}
                        <div>
                            <label htmlFor="register-username" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Username Unik
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <span className="font-bold text-sm">@</span>
                                </div>
                                <input
                                    id="register-username"
                                    type="text"
                                    value={data.username}
                                    onChange={(e) => setData('username', e.target.value)}
                                    className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 transition ${
                                        errors.username
                                            ? 'border-rose-400 focus:ring-rose-200 text-rose-900'
                                            : 'border-slate-300 focus:ring-blue-200 focus:border-blue-600 text-slate-900'
                                    }`}
                                    placeholder="johndoe"
                                    required
                                />
                            </div>
                            {errors.username && (
                                <p className="text-xs text-rose-600 mt-1 font-medium">{errors.username}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="register-email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Alamat Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <input
                                    id="register-email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 transition ${
                                        errors.email
                                            ? 'border-rose-400 focus:ring-rose-200 text-rose-900'
                                            : 'border-slate-300 focus:ring-blue-200 focus:border-blue-600 text-slate-900'
                                    }`}
                                    placeholder="nama@email.com"
                                    required
                                />
                            </div>
                            {errors.email && (
                                <p className="text-xs text-rose-600 mt-1 font-medium">{errors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="register-password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Kata Sandi (Min. 6 Karakter)
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input
                                    id="register-password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 transition ${
                                        errors.password
                                            ? 'border-rose-400 focus:ring-rose-200 text-rose-900'
                                            : 'border-slate-300 focus:ring-blue-200 focus:border-blue-600 text-slate-900'
                                    }`}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            {errors.password && (
                                <p className="text-xs text-rose-600 mt-1 font-medium">{errors.password}</p>
                            )}
                        </div>

                        {/* Password Confirmation */}
                        <div>
                            <label htmlFor="register-password-confirmation" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Konfirmasi Kata Sandi
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input
                                    id="register-password-confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-600 text-slate-900 transition"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full mt-2 py-3 px-4 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Mendaftarkan Akun...</span>
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-4 h-4" />
                                    <span>Daftar sebagai Penulis</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm text-slate-500">
                        Sudah memiliki akun?{' '}
                        <Link
                            href="/login"
                            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                        >
                            Masuk di Sini
                        </Link>
                    </div>

                    <div className="mt-4 text-center">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-800 transition cursor-pointer"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Kembali ke Beranda Publik</span>
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
