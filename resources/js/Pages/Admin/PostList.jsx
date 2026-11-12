import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import {
    FileSpreadsheet,
    Search,
    BookOpen,
    CheckCircle2,
    XCircle,
    Calendar,
    Tag,
    User,
    Shield,
    ExternalLink
} from 'lucide-react';

export default function PostList({ posts, categories = [], filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || 'Semua');

    const handleFilter = (newSearch, newCategory) => {
        router.get('/admin/posts', {
            search: newSearch,
            category: newCategory !== 'Semua' ? newCategory : '',
        }, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AppLayout>
            <Head title="Monitoring Seluruh Artikel - Panel Admin" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                {/* Header & Export Action */}
                <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                            <Shield className="w-3.5 h-3.5" />
                            <span>Panel Administrator</span>
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                            Monitoring Seluruh Artikel
                        </h1>
                        <p className="text-slate-500 text-sm">
                            Pantau dan audit seluruh artikel yang ditulis oleh semua pengguna BlogVerse Pro secara komprehensif.
                        </p>
                    </div>

                    <a
                        href="/admin/posts/export"
                        className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition cursor-pointer"
                    >
                        <FileSpreadsheet className="w-4 h-4" />
                        <span>Ekspor Semua Artikel ke Excel</span>
                    </a>
                </div>

                {/* Filter and Search Bar */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full sm:w-96">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            aria-label="Cari artikel"
                            placeholder="Cari berdasarkan judul, cuplikan, atau konten..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                handleFilter(e.target.value, category);
                            }}
                            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 focus:bg-white transition"
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Kategori:</span>
                        <select
                            aria-label="Filter kategori artikel"
                            value={category}
                            onChange={(e) => {
                                setCategory(e.target.value);
                                handleFilter(search, e.target.value);
                            }}
                            className="w-full sm:w-auto px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 font-medium text-slate-700 cursor-pointer"
                        >
                            <option value="Semua">Semua Kategori</option>
                            {categories.map((cat) => {
                                const value = typeof cat === 'string' ? cat : cat.value;
                                const label = typeof cat === 'string' ? cat : (cat.label || cat.value);
                                return (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                </div>

                {/* Posts Table */}
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-bold border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4">Artikel</th>
                                    <th className="px-6 py-4">Penulis</th>
                                    <th className="px-6 py-4">Kategori</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Tanggal Dibuat</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {posts.data && posts.data.length > 0 ? (
                                    posts.data.map((post) => (
                                        <tr key={post.id} className="hover:bg-slate-50/80 transition">
                                            <td className="px-6 py-4">
                                                <div className="flex items-start gap-3 max-w-md">
                                                    {post.cover_image_path ? (
                                                        <img
                                                            src={`/storage/${post.cover_image_path}`}
                                                            alt={post.title}
                                                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 mt-0.5"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 shrink-0 mt-0.5">
                                                            <BookOpen className="w-5 h-5" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <h3 className="font-bold text-slate-900 line-clamp-1 hover:text-purple-600 transition">
                                                            {post.title}
                                                        </h3>
                                                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                                                            {post.excerpt || 'Tidak ada ringkasan.'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {post.user ? (
                                                    <div className="flex items-center gap-2.5">
                                                        {post.user.profile_photo_path ? (
                                                            <img
                                                                src={`/storage/${post.user.profile_photo_path}`}
                                                                alt={post.user.name}
                                                                className="w-8 h-8 rounded-full object-cover border border-slate-200"
                                                            />
                                                        ) : (
                                                            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center">
                                                                {post.user.name ? post.user.name.charAt(0).toUpperCase() : 'U'}
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div className="font-semibold text-slate-800 text-xs">
                                                                {post.user.name}
                                                            </div>
                                                            <div className="text-[11px] text-slate-400">
                                                                @{post.user.username}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-slate-400 italic">Anonim</span>
                                                )}
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                                                    <Tag className="w-3 h-3 text-slate-400" />
                                                    {post.category?.value || post.category}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {post.is_published ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                        <span>Diterbitkan</span>
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                                        <XCircle className="w-3.5 h-3.5" />
                                                        <span>Draf</span>
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                    <span>
                                                        {new Date(post.created_at).toLocaleDateString('id-ID', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                        })}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                {post.is_published ? (
                                                    <a
                                                        href={`/articles/${post.slug}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition"
                                                        title="Lihat Publikasi Artikel"
                                                    >
                                                        <span>Buka</span>
                                                        <ExternalLink className="w-3.5 h-3.5" />
                                                    </a>
                                                ) : (
                                                    <span className="text-xs text-slate-400 italic">Draf (Privat)</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-16 text-center text-slate-400">
                                            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30 text-purple-600" />
                                            <p className="font-semibold text-slate-600">Tidak ada artikel ditemukan</p>
                                            <p className="text-xs mt-1">Coba sesuaikan kata kunci pencarian atau kategori filter.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {posts.links && posts.links.length > 3 && (
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                            <span className="text-xs text-slate-500">
                                Menampilkan <span className="font-bold">{posts.from || 0}</span> - <span className="font-bold">{posts.to || 0}</span> dari <span className="font-bold">{posts.total || 0}</span> artikel
                            </span>
                            <div className="flex items-center gap-1">
                                {posts.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                                            link.active
                                                ? 'bg-purple-600 text-white shadow-xs'
                                                : link.url
                                                ? 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                                                : 'text-slate-300 pointer-events-none'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
