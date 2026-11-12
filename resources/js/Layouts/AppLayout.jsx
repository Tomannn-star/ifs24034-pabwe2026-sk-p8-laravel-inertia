import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import {
    BookOpen,
    LogIn,
    UserPlus,
    LayoutDashboard,
    Shield,
    User,
    LogOut,
    Menu,
    X,
    FileText,
    Users,
    CheckCircle2,
    AlertCircle,
    Loader2
} from 'lucide-react';

export default function AppLayout({ children, isPublic = false, title = '' }) {
    const { auth, flash, appName } = usePage().props;
    const user = auth?.user;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [statusText, setStatusText] = useState('');

    useEffect(() => {
        const startHandler = () => {
            setLoading(true);
            setStatusText('Memproses tindakan...');
        };
        const finishHandler = () => {
            setLoading(false);
            setStatusText('');
        };

        const removeStart = router.on('start', startHandler);
        const removeFinish = router.on('finish', finishHandler);

        return () => {
            removeStart();
            removeFinish();
        };
    }, []);

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
            {/* Top Loading Progress Bar */}
            {loading && (
                <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-blue-200 overflow-hidden">
                    <div className="h-full bg-blue-600 animate-progress w-full"></div>
                </div>
            )}

            {/* Floating Action Pill Indicator */}
            {loading && (
                <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-900/90 text-white px-4 py-2.5 rounded-full shadow-lg backdrop-blur-sm text-sm font-medium">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                    <span>{statusText || 'Memproses tindakan...'}</span>
                </div>
            )}

            {/* Sticky Top Navbar */}
            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <Link href="/" className="flex items-center gap-2.5 group">
                                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md group-hover:bg-blue-700 transition">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="font-bold text-xl tracking-tight text-slate-900 group-hover:text-blue-600 transition">
                                        {appName || 'BlogVerse Pro'}
                                    </span>
                                    <span className="block text-[11px] font-medium text-slate-500 uppercase tracking-widest">
                                        Platform Publikasi
                                    </span>
                                </div>
                            </Link>

                            {/* Public nav links */}
                            <nav className="hidden md:flex items-center ml-8 gap-6 text-sm font-medium text-slate-600">
                                <Link
                                    href="/"
                                    className="hover:text-blue-600 transition cursor-pointer"
                                >
                                    Beranda
                                </Link>
                                <Link
                                    href="/articles"
                                    className="hover:text-blue-600 transition cursor-pointer"
                                >
                                    Semua Artikel
                                </Link>
                            </nav>
                        </div>

                        {/* Right side actions */}
                        <div className="hidden md:flex items-center gap-3">
                            {user ? (
                                <div className="flex items-center gap-3">
                                    <Link
                                        href="/dashboard/posts"
                                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition cursor-pointer"
                                    >
                                        <LayoutDashboard className="w-4 h-4" />
                                        <span>Dashboard Penulis</span>
                                    </Link>

                                    {user.role === 'admin' && (
                                        <div className="flex items-center gap-1 border-l border-slate-200 pl-3">
                                            <Link
                                                href="/admin/posts"
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-purple-700 hover:bg-purple-50 transition cursor-pointer"
                                            >
                                                <FileText className="w-4 h-4" />
                                                <span>Semua Artikel</span>
                                            </Link>
                                            <Link
                                                href="/admin/users"
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-purple-700 hover:bg-purple-50 transition cursor-pointer"
                                            >
                                                <Users className="w-4 h-4" />
                                                <span>Pengguna</span>
                                            </Link>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
                                        <Link
                                            href="/profile"
                                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                                        >
                                            {user.profile_photo_url ? (
                                                <img
                                                    src={user.profile_photo_url}
                                                    alt={user.name}
                                                    className="w-7 h-7 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <span className="font-semibold">{user.name}</span>
                                        </Link>

                                        <button
                                            onClick={handleLogout}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                            title="Keluar"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Keluar</span>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Link
                                        href="/login"
                                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition cursor-pointer"
                                    >
                                        <LogIn className="w-4 h-4" />
                                        <span>Masuk (Login)</span>
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition cursor-pointer"
                                    >
                                        <UserPlus className="w-4 h-4" />
                                        <span>Daftar Penulis</span>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <div className="flex md:hidden">
                            <button
                                type="button"
                                aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
                                aria-expanded={mobileMenuOpen}
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu dropdown */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2">
                        <Link
                            href="/"
                            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Beranda
                        </Link>
                        <Link
                            href="/articles"
                            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Semua Artikel
                        </Link>

                        {user ? (
                            <>
                                <div className="border-t border-slate-200 pt-2 mt-2">
                                    <div className="px-3 py-1 text-xs font-semibold text-slate-600 uppercase">
                                        Akun: {user.name} ({user.role})
                                    </div>
                                    <Link
                                        href="/dashboard/posts"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-blue-50 cursor-pointer"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Dashboard Penulis
                                    </Link>
                                    {user.role === 'admin' && (
                                        <>
                                            <Link
                                                href="/admin/posts"
                                                className="block px-3 py-2 rounded-md text-base font-medium text-purple-700 hover:bg-purple-50 cursor-pointer"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                Monitoring Artikel (Admin)
                                            </Link>
                                            <Link
                                                href="/admin/users"
                                                className="block px-3 py-2 rounded-md text-base font-medium text-purple-700 hover:bg-purple-50 cursor-pointer"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                Kelola Pengguna (Admin)
                                            </Link>
                                        </>
                                    )}
                                    <Link
                                        href="/profile"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Edit Profil
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-rose-600 hover:bg-rose-50 cursor-pointer"
                                    >
                                        Keluar
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="border-t border-slate-200 pt-3 space-y-2">
                                <Link
                                    href="/login"
                                    className="block w-full text-center px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 cursor-pointer"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Masuk (Login)
                                </Link>
                                <Link
                                    href="/register"
                                    className="block w-full text-center px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Daftar Penulis
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </header>

            {/* Flash Messages */}
            {flash?.success && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 w-full">
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-3 shadow-xs">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span className="text-sm font-medium">{flash.success}</span>
                    </div>
                </div>
            )}
            {flash?.error && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 w-full">
                    <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl flex items-center gap-3 shadow-xs">
                        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                        <span className="text-sm font-medium">{flash.error}</span>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 w-full">
                {children}
            </main>

            {/* Editorial Footer */}
            <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div className="md:col-span-2 space-y-4">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <span className="text-xl font-bold text-white tracking-tight">
                                    {appName || 'BlogVerse Pro'}
                                </span>
                            </div>
                            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
                                Platform publikasi artikel digital multi-tier modern dengan Clean Architecture.
                                Wadah berbagi ide, wawasan teknologi, tutorial, bisnis, dan opini bermutu tinggi.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">
                                Navigasi Publik
                            </h2>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <Link href="/" className="hover:text-blue-400 transition cursor-pointer">
                                        Beranda Publik
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/articles" className="hover:text-blue-400 transition cursor-pointer">
                                        Galeri Artikel
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/login" className="hover:text-blue-400 transition cursor-pointer">
                                        Halaman Login (Masuk)
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/register" className="hover:text-blue-400 transition cursor-pointer">
                                        Halaman Register (Daftar Penulis)
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">
                                Ruang Penulis
                            </h2>
                            <ul className="space-y-2 text-sm text-slate-300">
                                <li>Editor Markdown Canggih</li>
                                <li>Ekspor & Impor Data Excel</li>
                                <li>Asisten AI Generator Draf</li>
                                <li>Statistik Publikasi Interaktif</li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-300 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p>© {new Date().getFullYear()} {appName || 'BlogVerse Pro'}. Hak Cipta Dilindungi.</p>
                        <p className="text-slate-300">Praktikum 8 PABWE - Laravel 13, Inertia.js & React (Feature-First)</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
