import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Editor from '@toast-ui/editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import {
    Plus,
    FileSpreadsheet,
    Upload,
    Sparkles,
    Search,
    Filter,
    MoreVertical,
    Eye,
    Pencil,
    Trash2,
    CheckCircle2,
    XCircle,
    BookOpen,
    Loader2,
    X,
    Calendar,
    Image,
    AlertCircle,
    Check
} from 'lucide-react';

export default function PostIndex({ posts, stats, categories = [], filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || 'Semua');
    const [status, setStatus] = useState(filters.status || 'all');

    // Modals state
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [activeKebabId, setActiveKebabId] = useState(null);

    // Filter submit handler
    const applyFilters = (newSearch, newCategory, newStatus) => {
        router.get('/dashboard/posts', {
            search: newSearch,
            category: newCategory !== 'Semua' ? newCategory : '',
            status: newStatus !== 'all' ? newStatus : '',
        }, {
            preserveState: true,
            replace: true,
        });
    };

    // Close kebab when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setActiveKebabId(null);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    // Delete post handler
    const handleDelete = (postId, postTitle) => {
        if (confirm(`Apakah Anda yakin ingin menghapus artikel "${postTitle}"?`)) {
            router.delete(`/dashboard/posts/${postId}`);
        }
    };

    // Toggle publish handler
    const handleTogglePublish = (postId) => {
        router.patch(`/dashboard/posts/${postId}/publish`);
    };

    return (
        <AppLayout>
            <Head title="Dashboard Penulis - BlogVerse Pro" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                {/* Header & Page Title */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                            Manajemen Artikel Saya
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Kelola, sunting, analisis, dan publikasikan draf karya tulis Anda
                        </p>
                    </div>

                    {/* Top Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2.5">
                        <button
                            type="button"
                            onClick={() => setIsCreateModalOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Tulis Artikel Baru</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsAiModalOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition cursor-pointer"
                        >
                            <Sparkles className="w-4 h-4 text-indigo-600" />
                            <span>AI Generator</span>
                        </button>

                        <a
                            href="/dashboard/posts/export"
                            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-semibold text-sm text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition cursor-pointer"
                            title="Ekspor ke Excel"
                        >
                            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                            <span className="hidden sm:inline">Ekspor Excel</span>
                        </a>

                        <button
                            type="button"
                            onClick={() => setIsImportModalOpen(true)}
                            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-semibold text-sm text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition cursor-pointer"
                            title="Impor dari Excel"
                        >
                            <Upload className="w-4 h-4 text-slate-500" />
                            <span className="hidden sm:inline">Impor Excel</span>
                        </button>
                    </div>
                </div>

                {/* Ringkasan Statistik (3 Kartu Ringkasan) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {/* Total Artikel */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex items-center justify-between">
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Total Artikel
                            </span>
                            <div className="text-3xl font-black text-slate-900 mt-1">
                                {stats?.total || 0}
                            </div>
                            <span className="text-xs text-slate-500 mt-1 block">Seluruh karya tulis pribadi</span>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                            <BookOpen className="w-6 h-6" />
                        </div>
                    </div>

                    {/* Total Selesai (Published) */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex items-center justify-between">
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Total Selesai
                            </span>
                            <div className="text-3xl font-black text-emerald-600 mt-1">
                                {stats?.published || 0}
                            </div>
                            <span className="text-xs text-slate-500 mt-1 block">Artikel telah dipublikasikan</span>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                    </div>

                    {/* Belum Selesai (Draft) */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex items-center justify-between">
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Belum Selesai
                            </span>
                            <div className="text-3xl font-black text-amber-600 mt-1">
                                {stats?.draft || 0}
                            </div>
                            <span className="text-xs text-slate-500 mt-1 block">Masih dalam bentuk draf</span>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                            <XCircle className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="flex-1 w-full flex flex-col sm:flex-row gap-3">
                        {/* Search Input */}
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
                                        applyFilters(search, category, status);
                                    }
                                }}
                                placeholder="Cari judul artikel..."
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition"
                            />
                        </div>

                        {/* Category Dropdown */}
                        <select
                            value={category}
                            onChange={(e) => {
                                setCategory(e.target.value);
                                applyFilters(search, e.target.value, status);
                            }}
                            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 transition cursor-pointer"
                        >
                            <option value="Semua">Semua Kategori</option>
                            {categories.map((c) => (
                                <option key={c.value} value={c.value}>
                                    {c.value}
                                </option>
                            ))}
                        </select>

                        {/* Status Dropdown */}
                        <select
                            value={status}
                            onChange={(e) => {
                                setStatus(e.target.value);
                                applyFilters(search, category, e.target.value);
                            }}
                            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 transition cursor-pointer"
                        >
                            <option value="all">Semua Status</option>
                            <option value="published">Selesai (Published)</option>
                            <option value="draft">Belum Selesai (Draft)</option>
                        </select>
                    </div>

                    <button
                        type="button"
                        onClick={() => applyFilters(search, category, status)}
                        className="w-full md:w-auto px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-semibold transition cursor-pointer shadow-xs"
                    >
                        Terapkan Filter
                    </button>
                </div>

                {/* DAFTAR ARTIKEL (FORMAT LIST VIEW - BUKAN CARD, TANPA DESKRIPSI DI DAFTAR UTAMA) */}
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
                                        <th className="py-4 px-6">Waktu Terbit</th>
                                        <th className="py-4 px-6 text-right w-24">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    {posts.data.map((post) => (
                                        <tr key={post.id} className="hover:bg-slate-50/70 transition">
                                            {/* Thumbnail / Sampul */}
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

                                            {/* Judul & Slug */}
                                            <td className="py-3.5 px-6 font-medium text-slate-900">
                                                <div className="max-w-md">
                                                    <Link
                                                        href={`/dashboard/posts/${post.id}`}
                                                        className="font-bold hover:text-blue-600 transition block truncate"
                                                    >
                                                        {post.title}
                                                    </Link>
                                                    <span className="text-xs text-slate-400 font-mono block truncate mt-0.5">
                                                        /{post.slug}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Kategori */}
                                            <td className="py-3.5 px-6">
                                                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                                                    {post.category?.value || post.category}
                                                </span>
                                            </td>

                                            {/* Status */}
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

                                            {/* Tanggal */}
                                            <td className="py-3.5 px-6 text-xs text-slate-500 whitespace-nowrap">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                    <span>
                                                        {post.published_at
                                                            ? new Date(post.published_at).toLocaleDateString('id-ID', {
                                                                  day: 'numeric',
                                                                  month: 'short',
                                                                  year: 'numeric',
                                                              })
                                                            : 'Belum terbit'}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Menu Tindakan Kebab (⋮) */}
                                            <td className="py-3.5 px-6 text-right relative">
                                                <div className="inline-block text-left">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveKebabId(activeKebabId === post.id ? null : post.id);
                                                        }}
                                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                                                        title="Menu Tindakan"
                                                    >
                                                        <MoreVertical className="w-4 h-4" />
                                                    </button>

                                                    {/* Kebab Dropdown Menu */}
                                                    {activeKebabId === post.id && (
                                                        <div
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="absolute right-6 top-10 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 text-xs font-medium space-y-0.5"
                                                        >
                                                            {/* Detail (Mata, Primary) */}
                                                            <Link
                                                                href={`/dashboard/posts/${post.id}`}
                                                                className="flex items-center gap-2.5 px-3.5 py-2 text-blue-600 hover:bg-blue-50 transition cursor-pointer font-bold"
                                                            >
                                                                <Eye className="w-4 h-4 text-blue-600" />
                                                                <span>Lihat Detail</span>
                                                            </Link>

                                                            {/* Ubah Edit (Pensil, Primary) */}
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setEditingPost(post);
                                                                    setIsEditModalOpen(true);
                                                                    setActiveKebabId(null);
                                                                }}
                                                                className="w-full text-left flex items-center gap-2.5 px-3.5 py-2 text-blue-600 hover:bg-blue-50 transition cursor-pointer font-bold"
                                                            >
                                                                <Pencil className="w-4 h-4 text-blue-600" />
                                                                <span>Ubah Edit</span>
                                                            </button>

                                                            {/* Toggle Status */}
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    handleTogglePublish(post.id);
                                                                    setActiveKebabId(null);
                                                                }}
                                                                className="w-full text-left flex items-center gap-2.5 px-3.5 py-2 text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                                                            >
                                                                {post.is_published ? (
                                                                    <>
                                                                        <XCircle className="w-4 h-4 text-amber-500" />
                                                                        <span>Jadikan Draf</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                                                        <span>Publikasikan</span>
                                                                    </>
                                                                )}
                                                            </button>

                                                            <div className="border-t border-slate-100 my-1"></div>

                                                            {/* Hapus (Tempat Sampah, Merah) */}
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    handleDelete(post.id, post.title);
                                                                    setActiveKebabId(null);
                                                                }}
                                                                className="w-full text-left flex items-center gap-2.5 px-3.5 py-2 text-rose-600 hover:bg-rose-50 transition cursor-pointer font-bold"
                                                            >
                                                                <Trash2 className="w-4 h-4 text-rose-600" />
                                                                <span>Hapus Artikel</span>
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <h3 className="text-base font-bold text-slate-800">Belum Ada Artikel</h3>
                            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                                Anda belum memiliki artikel atau tidak ada yang sesuai dengan kriteria filter saat ini.
                            </p>
                            <button
                                type="button"
                                onClick={() => setIsCreateModalOpen(true)}
                                className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition cursor-pointer shadow-xs"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Tulis Artikel Sekarang</span>
                            </button>
                        </div>
                    )}

                    {/* Pagination */}
                    {posts?.links && posts.links.length > 3 && (
                        <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-200 flex justify-between items-center flex-wrap gap-2">
                            <div className="text-xs text-slate-500">
                                Menampilkan {posts.from || 0} - {posts.to || 0} dari {posts.total || 0} artikel
                            </div>
                            <div className="flex gap-1">
                                {posts.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                                            link.active
                                                ? 'bg-blue-600 text-white'
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

            {/* FULL SCREEN MODAL: TAMBAH ARTIKEL */}
            {isCreateModalOpen && (
                <PostModalForm
                    mode="create"
                    categories={categories}
                    onClose={() => setIsCreateModalOpen(false)}
                />
            )}

            {/* FULL SCREEN MODAL: UBAH ARTIKEL */}
            {isEditModalOpen && editingPost && (
                <PostModalForm
                    mode="edit"
                    post={editingPost}
                    categories={categories}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setEditingPost(null);
                    }}
                />
            )}

            {/* MODAL: AI GENERATOR */}
            {isAiModalOpen && (
                <AiGeneratorModal
                    categories={categories}
                    onClose={() => setIsAiModalOpen(false)}
                />
            )}

            {/* MODAL: IMPOR EXCEL */}
            {isImportModalOpen && (
                <ImportModal onClose={() => setIsImportModalOpen(false)} />
            )}
        </AppLayout>
    );
}

/* =========================================================================
   FULL SCREEN MODAL FORM (CREATE & EDIT)
   - Full screen (fixed inset-0 z-50 flex flex-col bg-white)
   - Distinct colored header & footer
   - Action buttons (Batal & Simpan) on the right of footer
   - TOAST UI Editor integrated via useRef
   ========================================================================= */
function PostModalForm({ mode = 'create', post = null, categories = [], onClose }) {
    const isEdit = mode === 'edit';
    const editorRef = useRef(null);
    const editorInstance = useRef(null);

    const { data, setData, post: postForm, processing, errors } = useForm({
        _method: isEdit ? 'PUT' : 'POST',
        title: post?.title || '',
        category: post?.category?.value || post?.category || (categories[0]?.value || 'Teknologi'),
        excerpt: post?.excerpt || '',
        content: post?.content || '',
        is_published: post ? Boolean(post.is_published) : false,
        cover_image: null,
    });

    useEffect(() => {
        if (editorRef.current && !editorInstance.current) {
            editorInstance.current = new Editor({
                el: editorRef.current,
                height: '100%',
                initialEditType: 'markdown',
                previewStyle: 'vertical',
                initialValue: data.content || '',
                events: {
                    change: () => {
                        if (editorInstance.current) {
                            setData('content', editorInstance.current.getMarkdown());
                        }
                    },
                },
            });
        }

        return () => {
            if (editorInstance.current) {
                editorInstance.current.destroy();
                editorInstance.current = null;
            }
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        // ensure markdown is synced
        if (editorInstance.current) {
            data.content = editorInstance.current.getMarkdown();
        }

        const endpoint = isEdit ? `/dashboard/posts/${post.id}` : '/dashboard/posts';
        postForm(endpoint, {
            onSuccess: () => onClose(),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-white overflow-hidden">
            {/* DISTINCT COLORED HEADER */}
            <div
                className={`px-8 py-5 flex items-center justify-between text-white shadow-md shrink-0 ${
                    isEdit
                        ? 'bg-gradient-to-r from-teal-700 via-emerald-700 to-emerald-800'
                        : 'bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-800'
                }`}
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center font-bold">
                        {isEdit ? <Pencil className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">
                            {isEdit ? 'Ubah Edit Artikel' : 'Tulis Artikel Baru (Full Screen)'}
                        </h2>
                        <span className="text-xs text-white/80">
                            {isEdit ? `Menyunting: ${post.title}` : 'Lengkapi formulir dan tulis konten Markdown'}
                        </span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* BODY (SCROLLABLE) */}
            <form id="post-modal-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6 max-w-5xl mx-auto w-full">
                {/* Judul Artikel */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Judul Artikel *
                    </label>
                    <input
                        type="text"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        placeholder="Contoh: Menguasai Clean Architecture di Laravel 13"
                        className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-base font-semibold focus:bg-white focus:outline-none focus:ring-2 transition ${
                            errors.title
                                ? 'border-rose-400 focus:ring-rose-200 text-rose-900'
                                : 'border-slate-300 focus:ring-blue-200 focus:border-blue-600 text-slate-900'
                        }`}
                        required
                    />
                    {errors.title && <p className="text-xs text-rose-600 mt-1.5 font-medium">{errors.title}</p>}
                </div>

                {/* Kategori & Publikasi Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                            Kategori Artikel *
                        </label>
                        <select
                            value={data.category}
                            onChange={(e) => setData('category', e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 transition cursor-pointer"
                            required
                        >
                            {categories.map((c) => (
                                <option key={c.value} value={c.value}>
                                    {c.value} ({c.label})
                                </option>
                            ))}
                        </select>
                        {errors.category && <p className="text-xs text-rose-600 mt-1.5 font-medium">{errors.category}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                            Status Publikasi
                        </label>
                        <label className="flex items-center gap-3 p-2.5 bg-slate-50 border border-slate-300 rounded-xl cursor-pointer hover:bg-slate-100 transition">
                            <input
                                type="checkbox"
                                checked={data.is_published}
                                onChange={(e) => setData('is_published', e.target.checked)}
                                className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                            />
                            <div>
                                <span className="font-bold text-sm text-slate-800">
                                    {data.is_published ? 'Publikasikan Langsung' : 'Simpan sebagai Draf'}
                                </span>
                                <span className="block text-xs text-slate-500">
                                    {data.is_published
                                        ? 'Artikel akan langsung tampil di galeri publik'
                                        : 'Artikel tersimpan di dashboard pribadi untuk ditinjau lagi'}
                                </span>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Ringkasan (Excerpt) */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Ringkasan Pemikat (Excerpt)
                    </label>
                    <textarea
                        rows={2}
                        value={data.excerpt}
                        onChange={(e) => setData('excerpt', e.target.value)}
                        placeholder="Ringkasan singkat 1-2 kalimat untuk menarik perhatian pembaca di kartu depan..."
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                    />
                    {errors.excerpt && <p className="text-xs text-rose-600 mt-1.5 font-medium">{errors.excerpt}</p>}
                </div>

                {/* Upload Foto Sampul */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Unggah Foto Sampul (Cover Image)
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setData('cover_image', e.target.files[0])}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                    />
                    {errors.cover_image && <p className="text-xs text-rose-600 mt-1.5 font-medium">{errors.cover_image}</p>}
                </div>

                {/* TOAST UI Editor Container */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Isi Konten Artikel (Markdown Editor) *
                    </label>
                    <div className="border border-slate-300 rounded-2xl overflow-hidden min-h-[420px]">
                        <div ref={editorRef} style={{ height: '420px' }}></div>
                    </div>
                    {errors.content && <p className="text-xs text-rose-600 mt-1.5 font-medium">{errors.content}</p>}
                </div>
            </form>

            {/* DISTINCT COLORED FOOTER WITH ACTIONS ON THE RIGHT */}
            <div
                className={`px-8 py-4 flex items-center justify-between shrink-0 ${
                    isEdit
                        ? 'bg-emerald-50 border-t border-emerald-200'
                        : 'bg-blue-50 border-t border-blue-200'
                }`}
            >
                <div className="text-xs text-slate-500 font-medium hidden sm:block">
                    Format penulisan didukung penuh oleh TOAST UI Markdown Editor
                </div>

                {/* Action Buttons on the Right */}
                <div className="flex items-center gap-3 ml-auto">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={processing}
                        className="px-5 py-2.5 rounded-xl font-bold text-sm text-slate-600 hover:text-slate-800 bg-white border border-slate-300 hover:bg-slate-100 transition cursor-pointer"
                    >
                        Batal
                    </button>

                    <button
                        type="submit"
                        form="post-modal-form"
                        disabled={processing}
                        className={`px-6 py-2.5 rounded-xl font-bold text-sm text-white shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50 ${
                            isEdit
                                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
                                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
                        }`}
                    >
                        {processing ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Menyimpan...</span>
                            </>
                        ) : (
                            <>
                                <Check className="w-4 h-4" />
                                <span>{isEdit ? 'Perbarui Artikel' : 'Simpan Artikel'}</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* =========================================================================
   MODAL: AI GENERATOR
   - Input kuantitas menggunakan type="number"
   ========================================================================= */
function AiGeneratorModal({ categories = [], onClose }) {
    const [topic, setTopic] = useState('');
    const [count, setCount] = useState(2);
    const [category, setCategory] = useState(categories[0]?.value || 'Teknologi');
    const [generating, setGenerating] = useState(false);
    const [generatedPosts, setGeneratedPosts] = useState([]);
    const [selectedIndices, setSelectedIndices] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');

    const handleGenerate = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setGenerating(true);

        try {
            const res = await fetch('/dashboard/posts/ai-generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    topic,
                    count: parseInt(count, 10),
                    category,
                }),
            });

            const json = await res.json();
            if (res.ok && json.success) {
                setGeneratedPosts(json.data);
                setSelectedIndices(json.data.map((_, i) => i));
            } else {
                setErrorMsg(json.message || 'Gagal menghasilkan artikel dengan AI.');
            }
        } catch (err) {
            setErrorMsg('Terjadi kendala jaringan saat menghubungi layanan AI.');
        } finally {
            setGenerating(false);
        }
    };

    const handleSaveBatch = () => {
        const postsToSave = generatedPosts.filter((_, idx) => selectedIndices.includes(idx));
        if (postsToSave.length === 0) {
            alert('Pilih minimal satu artikel untuk disimpan.');
            return;
        }

        router.post('/dashboard/posts/ai-save', {
            posts: postsToSave,
            is_published: false,
        }, {
            onSuccess: () => onClose(),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2.5">
                        <Sparkles className="w-5 h-5 text-indigo-200" />
                        <h3 className="font-bold text-lg">AI Post Generator</h3>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-white cursor-pointer">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto space-y-6">
                    {errorMsg && (
                        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    <form onSubmit={handleGenerate} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Topik atau Ide Artikel *
                            </label>
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="Contoh: Manfaat Clean Architecture untuk Web Developer Pemula"
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Input angka kuantitas */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Jumlah Artikel (1 - 5) *
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={count}
                                    onChange={(e) => setCount(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Kategori
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600 cursor-pointer"
                                >
                                    {categories.map((c) => (
                                        <option key={c.value} value={c.value}>
                                            {c.value}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={generating}
                            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            {generating ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Menghasilkan Draf dengan AI...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4" />
                                    <span>Hasilkan Draf Artikel Sekarang</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Preview Generated Posts */}
                    {generatedPosts.length > 0 && (
                        <div className="space-y-4 pt-4 border-t border-slate-200">
                            <h4 className="font-bold text-sm text-slate-800">
                                Hasil Generasi ({generatedPosts.length} Artikel):
                            </h4>
                            <div className="space-y-3">
                                {generatedPosts.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2"
                                    >
                                        <div className="flex items-center justify-between">
                                            <label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-slate-900">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIndices.includes(idx)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedIndices([...selectedIndices, idx]);
                                                        } else {
                                                            setSelectedIndices(selectedIndices.filter((i) => i !== idx));
                                                        }
                                                    }}
                                                    className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                                                />
                                                <span>{item.title}</span>
                                            </label>
                                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-semibold">
                                                {item.category}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-600 line-clamp-2">{item.excerpt}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {generatedPosts.length > 0 && (
                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                        >
                            Tutup
                        </button>
                        <button
                            type="button"
                            onClick={handleSaveBatch}
                            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md transition cursor-pointer"
                        >
                            Simpan ({selectedIndices.length}) Draf Terpilih
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

/* =========================================================================
   MODAL: IMPOR EXCEL
   ========================================================================= */
function ImportModal({ onClose }) {
    const { data, setData, post, processing, errors } = useForm({
        file: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/dashboard/posts/import', {
            onSuccess: () => onClose(),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 bg-slate-800 text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Upload className="w-5 h-5 text-blue-400" />
                        <h3 className="font-bold text-base">Impor Artikel dari Excel</h3>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-white cursor-pointer">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Pilih berkas Excel (.xlsx, .xls) yang berisi daftar artikel. Kolom B akan dibaca sebagai Judul,
                        Kolom C sebagai Kategori, Kolom G sebagai Ringkasan, dan Kolom H sebagai Isi Konten.
                    </p>

                    <div>
                        <input
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            onChange={(e) => setData('file', e.target.files[0])}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                            required
                        />
                        {errors.file && <p className="text-xs text-rose-600 mt-1.5 font-medium">{errors.file}</p>}
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Mengimpor...</span>
                                </>
                            ) : (
                                <span>Mulai Impor</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
