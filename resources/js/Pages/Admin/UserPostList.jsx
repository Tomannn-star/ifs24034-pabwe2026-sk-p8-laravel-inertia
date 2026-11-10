import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import {
    ArrowLeft,
    FileSpreadsheet,
    Search,
    BookOpen,
    CheckCircle2,
    XCircle,
    Calendar,
    Image,
    Eye,
    Tag,
    User,
    Shield
} from 'lucide-react';

export default function UserPostList({ author, posts, stats, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || 'Semua');
    const [status, setStatus] = useState(filters.status || 'all');

    const handleFilter = (newSearch, newCategory, newStatus) => {
        router.get(`/admin/users/${author.id}/posts`, {
            search: newSearch,
            category: newCategory !== 'Semua' ? newCategory : '',
            status: newStatus !== 'all' ? newStatus : '',
        }, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AppLayout>
            <Head title={`Artikel Penulis: ${author.name} - Panel Admin`} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                {/* Back button */}
                <div>
                    <Link
                        href="/admin/users"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-purple-600 transition cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Kembali ke Daftar Pengguna</span>
                    </Link>
                </div>

                {/* Author Info Card & Action */}
                <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-4">
                        {author.profile_photo_url ? (
                            <img
                                src={author.profile_photo_url}
                                alt={author.name}
                                className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-2xl bg-purple-600 text-white font-bold text-2xl flex items-center justify-center shadow-md">
                                {author.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                                    {author.name}
                                </h1>
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700">
                                    {author.role}
                                </span>
                            </div>
                            <p className="text-sm text-slate-500 mt-0.5">
                                @{author.username} • {author.email}
                            </p>
                            <span className="text-xs text-slate-400 mt-1 block">
                                Monitoring karya tulis pengguna (Read-Only Admin)
                            </span>
                        </div>
                    </div>

                    {/* Export Button */}
                    <a
                        href={`/admin/users/${author.id}/posts/export`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition cursor-pointer shadow-xs"
                    >
                        <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                        <span>Ekspor Artikel Penulis Ini ke Excel</span>
                    </a>
                </div>

                {/* 3 Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex items-center justify-between">
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Artikel</span>
                            <div className="text-3xl font-black text-slate-900 mt-1">{stats?.total || 0}</div>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                            <BookOpen className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex items-center justify-between">
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Selesai (Published)</span>
                            <div className="text-3xl font-black text-emerald-600 mt-1">{stats?.published || 0}</div>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex items-center justify-between">
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Belum Selesai (Draft)</span>
                            <div className="text-3xl font-black text-amber-600 mt-1">{stats?.draft || 0}</div>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                            <XCircle className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Filter and Search */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="flex-1 w-full flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <Search className="w-4 h-4" />
                            </div>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleFilter(search, category, status);
                                    }
                                }}
                                placeholder="Cari judul artikel penulis..."
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 transition"
                            />
                        </div>

                        <select
                            value={status}
                            onChange={(e) => {
                                setStatus(e.target.value);
                                handleFilter(search, category, e.target.value);
                            }}
                            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 transition cursor-pointer"
                        >
                            <option value="all">Semua Status</option>
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                        </select>
                    </div>

                    <button
                        type="button"
                        onClick={() => handleFilter(search, category, status)}
                        className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold transition cursor-pointer shadow-xs"
                    >
                        Terapkan Filter
                    </button>
                </div>

                {/* Article List View */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                    {posts?.data?.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        <th className="py-4 px-6 w-16">Sampul</th>
                                        <th className="py-4 px-6">Judul Artikel & Slug</th>
                                        <th className="py-4 px-6">Kategori</th>
                                        <th className="py-4 px-6">Status</th>
                                        <th className="py-4 px-6">Tanggal</th>
                                        <th className="py-4 px-6 text-right w-24">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    {posts.data.map((post) => (
                                        <tr key={post.id} className="hover:bg-slate-50/70 transition">
                                            <td className="py-3.5 px-6">
                                                <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                                                    {post.cover_url ? (
                                                        <img
                                                            src={post.cover_url}
                                                            alt={post.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <Image className="w-5 h-5 text-slate-400" />
                                                    )}
                                                </div>
                                            </td>

                                            <td className="py-3.5 px-6 font-medium text-slate-900">
                                                <div className="max-w-md">
                                                    <span className="font-bold block truncate">{post.title}</span>
                                                    <span className="text-xs text-slate-400 font-mono block truncate mt-0.5">
                                                        /{post.slug}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="py-3.5 px-6">
                                                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                                                    {post.category?.value || post.category}
                                                </span>
                                            </td>

                                            <td className="py-3.5 px-6">
                                                {post.is_published ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                                                        <span>Published</span>
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                                                        <span>Draft</span>
                                                    </span>
                                                )}
                                            </td>

                                            <td className="py-3.5 px-6 text-xs text-slate-500 whitespace-nowrap">
                                                {post.published_at
                                                    ? new Date(post.published_at).toLocaleDateString('id-ID', {
                                                          day: 'numeric',
                                                          month: 'short',
                                                          year: 'numeric',
                                                      })
                                                    : 'Belum terbit'}
                                            </td>

                                            <td className="py-3.5 px-6 text-right">
                                                {post.is_published && (
                                                    <a
                                                        href={`/articles/${post.slug}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                        <span>Lihat</span>
                                                    </a>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-12 text-center text-slate-500 text-sm">
                            Pengguna ini belum memiliki artikel yang cocok dengan filter.
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
