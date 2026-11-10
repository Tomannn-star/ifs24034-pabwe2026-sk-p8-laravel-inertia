import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import {
    Search,
    BookOpen,
    LogIn,
    UserPlus,
    Calendar,
    User,
    ArrowRight,
    Sparkles,
    SlidersHorizontal,
    Tag
} from 'lucide-react';

export default function PostIndex({ posts, categories = [], filters = {}, isHome = false }) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || 'Semua');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(isHome ? '/' : '/articles', {
            search: search,
            category: selectedCategory !== 'Semua' ? selectedCategory : '',
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleCategoryClick = (catValue) => {
        setSelectedCategory(catValue);
        router.get(isHome ? '/' : '/articles', {
            search: search,
            category: catValue !== 'Semua' ? catValue : '',
        }, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AppLayout isPublic={true}>
            <Head title={isHome ? 'Beranda - BlogVerse Pro' : 'Galeri Artikel - BlogVerse Pro'} />

            {/* Hero Banner on Homepage */}
            {isHome && (
                <div className="relative bg-gradient-to-b from-blue-50/80 via-white to-slate-50 border-b border-slate-200 py-20 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
                    <div className="max-w-4xl mx-auto space-y-6">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 text-blue-700 text-xs font-bold tracking-wide uppercase">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Platform Publikasi Artikel Digital Multi-Tier</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
                            Eksplorasi Wawasan, Tulisan, dan Inspirasi Tanpa Batas di{' '}
                            <span className="text-blue-600 underline decoration-blue-300 decoration-wavy decoration-2">
                                BlogVerse Pro
                            </span>
                        </h1>

                        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                            Temukan ratusan artikel berkualitas seputar teknologi, pendidikan, gaya hidup, bisnis,
                            dan opini langsung dari para penulis handal di komunitas kami.
                        </p>

                        {/* CTA Buttons to Login and Register */}
                        <div className="pt-4 flex flex-wrap justify-center items-center gap-4">
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-slate-700 bg-white border border-slate-300 shadow-sm hover:border-blue-400 hover:text-blue-600 transition cursor-pointer"
                            >
                                <LogIn className="w-4 h-4 text-blue-600" />
                                <span>Halaman Login (Masuk)</span>
                            </Link>
                            <Link
                                href="/register"
                                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 transition cursor-pointer"
                            >
                                <UserPlus className="w-4 h-4" />
                                <span>Halaman Register (Daftar Penulis)</span>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Search & Filter Header */}
                <div className="mb-10 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                                {isHome ? 'Artikel Pilihan Terbaru' : 'Jelajahi Galeri Artikel'}
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">
                                {isHome
                                    ? 'Tulisan segar yang baru saja dipublikasikan oleh para penulis'
                                    : 'Cari topik yang Anda minati atau saring berdasarkan kategori'}
                            </p>
                        </div>

                        {/* Search Input Form */}
                        <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-md w-full">
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <Search className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari judul atau isi artikel..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-600 text-slate-900 transition shadow-xs"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition cursor-pointer shrink-0 shadow-xs"
                            >
                                Cari
                            </button>
                        </form>
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
                            <Tag className="w-3.5 h-3.5" />
                            <span>Kategori:</span>
                        </span>
                        <button
                            type="button"
                            onClick={() => handleCategoryClick('Semua')}
                            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer shrink-0 ${
                                selectedCategory === 'Semua'
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            Semua Kategori
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.value}
                                type="button"
                                onClick={() => handleCategoryClick(cat.value)}
                                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer shrink-0 ${
                                    selectedCategory === cat.value
                                        ? 'bg-blue-600 text-white shadow-xs'
                                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                {cat.value}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Article Grid */}
                {posts?.data?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.data.map((post) => (
                            <article
                                key={post.id}
                                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-blue-200 transition-all flex flex-col group"
                            >
                                {/* Cover Image */}
                                <Link
                                    href={`/articles/${post.slug}`}
                                    className="block aspect-video w-full bg-slate-100 overflow-hidden relative cursor-pointer"
                                >
                                    {post.cover_url ? (
                                        <img
                                            src={post.cover_url}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-400 group-hover:from-blue-100 group-hover:to-indigo-100 transition">
                                            <BookOpen className="w-10 h-10 mb-2 opacity-50" />
                                            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                                                {post.category?.value || post.category}
                                            </span>
                                        </div>
                                    )}

                                    {/* Category Pill Tag on Card */}
                                    <div className="absolute top-3 left-3">
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-blue-700 shadow-sm backdrop-blur-sm">
                                            {post.category?.value || post.category}
                                        </span>
                                    </div>
                                </Link>

                                {/* Body */}
                                <div className="p-6 flex-1 flex flex-col justify-between">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-xs text-slate-400">
                                            <span className="flex items-center gap-1 font-medium text-slate-600">
                                                <User className="w-3.5 h-3.5 text-blue-500" />
                                                <span>{post.user ? post.user.name : 'Penulis'}</span>
                                            </span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <span>
                                                    {post.published_at
                                                        ? new Date(post.published_at).toLocaleDateString('id-ID', {
                                                              day: 'numeric',
                                                              month: 'short',
                                                              year: 'numeric',
                                                          })
                                                        : '-'}
                                                </span>
                                            </span>
                                        </div>

                                        <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition leading-snug line-clamp-2">
                                            <Link href={`/articles/${post.slug}`} className="cursor-pointer">
                                                {post.title}
                                            </Link>
                                        </h3>

                                        <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                                            {post.excerpt || (post.content ? post.content.substring(0, 140) + '...' : '')}
                                        </p>
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                                        <Link
                                            href={`/articles/${post.slug}`}
                                            className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 transition cursor-pointer"
                                        >
                                            <span>Baca Selengkapnya</span>
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="w-7 h-7" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-1">
                            Belum Ada Artikel yang Sesuai
                        </h3>
                        <p className="text-sm text-slate-500 mb-6">
                            Tidak ditemukan artikel publik untuk pencarian atau kategori ini. Coba kata kunci lain atau reset filter.
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                setSearch('');
                                setSelectedCategory('Semua');
                                router.get(isHome ? '/' : '/articles');
                            }}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition cursor-pointer shadow-xs"
                        >
                            Reset Semua Filter
                        </button>
                    </div>
                )}

                {/* Pagination */}
                {posts?.links && posts.links.length > 3 && (
                    <div className="mt-12 flex justify-center items-center gap-1 flex-wrap">
                        {posts.links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.url || '#'}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer ${
                                    link.active
                                        ? 'bg-blue-600 text-white shadow-xs'
                                        : link.url
                                        ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                                        : 'bg-slate-100 text-slate-400 cursor-not-allowed pointer-events-none'
                                }`}
                            />
                        ))}
                    </div>
                )}

                {/* View More Link on Home */}
                {isHome && (
                    <div className="mt-12 text-center">
                        <Link
                            href="/articles"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition cursor-pointer"
                        >
                            <span>Lihat Seluruh Galeri Artikel ({posts?.total || 0} Tulisan)</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
