import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import { LogIn, Lock, User, ArrowLeft, Loader2 } from 'lucide-react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        login: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <AppLayout isPublic={true}>
            <Head title="Masuk ke Akun - BlogVerse Pro" />

            <div className="py-16 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-blue-500/20">
                            <LogIn className="w-6 h-6" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Masuk ke BlogVerse Pro
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Masuk menggunakan username atau alamat email Anda
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Username or Email Input */}
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
                            >
                                Username atau Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <User className="w-4 h-4" />
                                </div>
                                <input
                                    id="username"
                                    name="username"
                                    autoComplete="username"
                                    type="text"
                                    value={data.login}
                                    onChange={(e) => setData('login', e.target.value)}
                                    className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 transition ${
                                        errors.login || errors.username
                                            ? 'border-rose-400 focus:ring-rose-200 text-rose-900'
                                            : 'border-slate-300 focus:ring-blue-200 focus:border-blue-600 text-slate-900'
                                    }`}
                                    placeholder="Contoh: member atau admin"
                                    required
                                    autoFocus
                                />
                            </div>
                            {(errors.login || errors.username) && (
                                <p className="text-xs text-rose-600 mt-1.5 font-medium">{errors.login || errors.username}</p>
                            )}
                        </div>

                        {/* Password Input */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
                            >
                                Kata Sandi
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    autoComplete="current-password"
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
                                <p className="text-xs text-rose-600 mt-1.5 font-medium">{errors.password}</p>
                            )}
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                                />
                                <span className="text-slate-600">Ingat saya di perangkat ini</span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            id="login-submit"
                            type="submit"
                            disabled={processing}
                            className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Memverifikasi...</span>
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-4 h-4" />
                                    <span>Masuk ke Dashboard</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm text-slate-500">
                        Belum memiliki akun penulis?{' '}
                        <Link
                            href="/register"
                            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                        >
                            Daftar Penulis Baru
                        </Link>
                    </div>

                    <div className="mt-4 text-center">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition cursor-pointer"
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
