import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import {
    Users,
    Search,
    Shield,
    User,
    BookOpen,
    Calendar,
    ArrowRight,
    FileText
} from 'lucide-react';

export default function UserList({ users, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [role, setRole] = useState(filters.role || 'Semua');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/users', {
            search,
            role: role !== 'Semua' ? role : '',
        }, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AppLayout>
            <Head title="Kelola Pengguna - Panel Admin BlogVerse Pro" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 uppercase tracking-wider mb-2">
                            <Shield className="w-3.5 h-3.5" />
                            <span>Panel Administrator</span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                            Kelola Daftar Pengguna
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Pantau seluruh akun penulis dan administrator yang terdaftar di sistem
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/posts"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition cursor-pointer"
                        >
                            <FileText className="w-4 h-4 text-purple-600" />
                            <span>Monitoring Semua Artikel</span>
                        </Link>
                    </div>
                </div>

                {/* Filter and Search */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
                    <form onSubmit={handleSearch} className="flex-1 w-full flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <Search className="w-4 h-4" />
                            </div>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nama, username, atau email..."
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition"
                            />
                        </div>

                        <select
                            value={role}
                            onChange={(e) => {
                                setRole(e.target.value);
                                router.get('/admin/users', {
                                    search,
                                    role: e.target.value !== 'Semua' ? e.target.value : '',
                                }, { preserveState: true, replace: true });
                            }}
                            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 transition cursor-pointer"
                        >
                            <option value="Semua">Semua Role</option>
                            <option value="admin">Admin</option>
                            <option value="member">Member</option>
                        </select>

                        <button
                            type="submit"
                            className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold transition cursor-pointer shadow-xs"
                        >
                            Cari
                        </button>
                    </form>
                </div>

                {/* User Table */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                    {users?.data?.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        <th className="py-4 px-6">Pengguna</th>
                                        <th className="py-4 px-6">Email</th>
                                        <th className="py-4 px-6">Role</th>
                                        <th className="py-4 px-6">Total Artikel</th>
                                        <th className="py-4 px-6">Bergabung</th>
                                        <th className="py-4 px-6 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    {users.data.map((u) => (
                                        <tr key={u.id} className="hover:bg-slate-50/70 transition">
                                            <td className="py-4 px-6 font-medium text-slate-900">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center shrink-0">
                                                        {u.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <span className="font-bold block text-slate-900">{u.name}</span>
                                                        <span className="text-xs text-slate-400">@{u.username}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-4 px-6 text-slate-600 font-mono text-xs">
                                                {u.email}
                                            </td>

                                            <td className="py-4 px-6">
                                                {u.role === 'admin' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
                                                        <Shield className="w-3.5 h-3.5" />
                                                        <span>Admin</span>
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
                                                        <User className="w-3.5 h-3.5" />
                                                        <span>Member</span>
                                                    </span>
                                                )}
                                            </td>

                                            <td className="py-4 px-6">
                                                <span className="inline-flex items-center gap-1.5 font-bold text-slate-700">
                                                    <BookOpen className="w-4 h-4 text-slate-400" />
                                                    <span>{u.posts_count || 0} Karya</span>
                                                </span>
                                            </td>

                                            <td className="py-4 px-6 text-xs text-slate-500">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                    <span>
                                                        {new Date(u.created_at).toLocaleDateString('id-ID', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                        })}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="py-4 px-6 text-right">
                                                <Link
                                                    href={`/admin/users/${u.id}/posts`}
                                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition cursor-pointer"
                                                >
                                                    <span>Lihat Artikel</span>
                                                    <ArrowRight className="w-3.5 h-3.5" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-12 text-center text-slate-500 text-sm">
                            Tidak ditemukan pengguna yang sesuai dengan kriteria filter.
                        </div>
                    )}

                    {/* Pagination */}
                    {users?.links && users.links.length > 3 && (
                        <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-200 flex justify-between items-center flex-wrap gap-2">
                            <div className="text-xs text-slate-500">
                                Menampilkan {users.from || 0} - {users.to || 0} dari {users.total || 0} pengguna
                            </div>
                            <div className="flex gap-1">
                                {users.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                                            link.active
                                                ? 'bg-purple-600 text-white'
                                                : link.url
                                                ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                                                : 'text-slate-400 cursor-not-allowed pointer-events-none'
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
