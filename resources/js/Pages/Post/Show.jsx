import React, { useEffect, useRef, useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import {
    ArrowLeft,
    Calendar,
    Pencil,
    Trash2,
    CheckCircle2,
    XCircle,
    Image,
    Upload,
    Tag,
    X,
    Check,
    Loader2
} from 'lucide-react';

export default function PostShow({ post, categories = [] }) {
    const viewerRef = useRef(null);
    const viewerInstance = useRef(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isUploadCoverOpen, setIsUploadCoverOpen] = useState(false);

    useEffect(() => {
        if (viewerRef.current && !viewerInstance.current) {
            viewerInstance.current = new Viewer({
                el: viewerRef.current,
                initialValue: post.content || '',
            });
        }

        return () => {
            if (viewerInstance.current) {
                viewerInstance.current.destroy();
                viewerInstance.current = null;
            }
        };
    }, [post.content]);

    const handleTogglePublish = () => {
        router.patch(`/dashboard/posts/${post.id}/publish`);
    };

    const handleDelete = () => {
        if (confirm(`Apakah Anda yakin ingin menghapus artikel "${post.title}"?`)) {
            router.delete(`/dashboard/posts/${post.id}`);
        }
    };

    const handleDeleteCover = () => {
        if (confirm('Hapus foto sampul artikel ini?')) {
            router.delete(`/dashboard/posts/${post.id}/cover`);
        }
    };

    return (
        <AppLayout>
            <Head title={`Detail: ${post.title} - BlogVerse Pro`} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                {/* Top Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Link
                        href="/dashboard/posts"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Kembali ke Daftar Artikel Saya</span>
                    </Link>

                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Toggle Publish */}
                        <button
                            type="button"
                            onClick={handleTogglePublish}
                            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                                post.is_published
                                    ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                            }`}
                        >
                            {post.is_published ? (
                                <>
                                    <XCircle className="w-4 h-4 text-amber-600" />
                                    <span>Jadikan Draf</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    <span>Publikasikan Sekarang</span>
                                </>
                            )}
                        </button>

                        {/* Ubah Edit */}
                        <button
                            type="button"
                            onClick={() => setIsEditModalOpen(true)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition cursor-pointer"
                        >
                            <Pencil className="w-4 h-4 text-blue-600" />
                            <span>Ubah Edit</span>
                        </button>

                        {/* Hapus */}
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition cursor-pointer"
                        >
                            <Trash2 className="w-4 h-4 text-rose-600" />
                            <span>Hapus</span>
                        </button>
                    </div>
                </div>

                {/* Article Header Card */}
                <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                            <Tag className="w-3.5 h-3.5 text-blue-600" />
                            <span>{post.category_label || post.category}</span>
                        </div>

                        <div>
                            {post.is_published ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                                    <span>Status: Published</span>
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                                    <span>Status: Draft</span>
                                </span>
                            )}
                        </div>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                        {post.title}
                    </h1>

                    {post.excerpt && (
                        <p className="text-base sm:text-lg text-slate-600 italic border-l-4 border-blue-500 pl-4 py-1 font-serif">
                            {post.excerpt}
                        </p>
                    )}

                    <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-slate-100 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span>Dibuat: {post.created_at}</span>
                        </span>
                        {post.published_at && (
                            <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Terbit: {post.published_at}</span>
                            </span>
                        )}
                        <span className="font-mono text-slate-400">Slug: /{post.slug}</span>
                    </div>

                    {/* Cover Image Section */}
                    <div className="pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Foto Sampul (Cover Image)
                            </span>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsUploadCoverOpen(true)}
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                                >
                                    <Upload className="w-3.5 h-3.5" />
                                    <span>{post.cover_url ? 'Ganti Sampul' : 'Unggah Sampul'}</span>
                                </button>
                                {post.cover_url && (
                                    <button
                                        type="button"
                                        onClick={handleDeleteCover}
                                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer ml-3"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        <span>Hapus Sampul</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {post.cover_url ? (
                            <div className="rounded-2xl overflow-hidden aspect-video bg-slate-100 border border-slate-200">
                                <img
                                    src={post.cover_url}
                                    alt={post.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ) : (
                            <div className="rounded-2xl p-8 bg-slate-50 border border-dashed border-slate-300 text-center text-slate-400 text-xs">
                                <Image className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <span>Belum ada foto sampul untuk artikel ini.</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Article Content Rendered with TOAST UI Viewer */}
                <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">
                        Pratinjau Konten Markdown
                    </h3>
                    <div ref={viewerRef} className="toastui-editor-contents text-slate-800 leading-relaxed text-base" />
                </div>
            </div>

            {/* FULL SCREEN MODAL: EDIT POST */}
            {isEditModalOpen && (
                <EditPostModal
                    post={post}
                    categories={categories}
                    onClose={() => setIsEditModalOpen(false)}
                />
            )}

            {/* MODAL: UPLOAD COVER */}
            {isUploadCoverOpen && (
                <UploadCoverModal
                    postId={post.id}
                    onClose={() => setIsUploadCoverOpen(false)}
                />
            )}
        </AppLayout>
    );
}

function EditPostModal({ post, categories = [], onClose }) {
    const editorRef = useRef(null);
    const editorInstance = useRef(null);

    const { data, setData, post: postForm, processing, errors } = useForm({
        _method: 'PUT',
        title: post.title,
        category: post.category?.value || post.category,
        excerpt: post.excerpt || '',
        content: post.content || '',
        is_published: Boolean(post.is_published),
    });

    useEffect(() => {
        let cancelled = false;
        Promise.all([
            import('@toast-ui/editor'),
            import('@toast-ui/editor/dist/toastui-editor.css'),
        ]).then(([{ default: Editor }]) => {
            if (cancelled || !editorRef.current || editorInstance.current) return;
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
        });

        return () => {
            cancelled = true;
            if (editorInstance.current) {
                editorInstance.current.destroy();
                editorInstance.current = null;
            }
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editorInstance.current) {
            data.content = editorInstance.current.getMarkdown();
        }

        postForm(`/dashboard/posts/${post.id}`, {
            onSuccess: () => onClose(),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-white overflow-hidden">
            {/* DISTINCT COLORED HEADER */}
            <div className="px-8 py-5 flex items-center justify-between text-white bg-gradient-to-r from-teal-700 via-emerald-700 to-emerald-800 shadow-md shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center font-bold">
                        <Pencil className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">Ubah Edit Artikel</h2>
                        <span className="text-xs text-white/80">Menyunting: {post.title}</span>
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

            {/* BODY */}
            <form id="edit-form-inner" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6 max-w-5xl mx-auto w-full">
                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Judul Artikel *
                    </label>
                    <input
                        type="text"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-base font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200"
                        required
                    />
                    {errors.title && <p className="text-xs text-rose-600 mt-1.5">{errors.title}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                            Kategori *
                        </label>
                        <select
                            value={data.category}
                            onChange={(e) => setData('category', e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-200 cursor-pointer"
                            required
                        >
                            {categories.map((c) => (
                                <option key={c.value} value={c.value}>
                                    {c.value}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                            Status Publikasi
                        </label>
                        <label className="flex items-center gap-3 p-2.5 bg-slate-50 border border-slate-300 rounded-xl cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.is_published}
                                onChange={(e) => setData('is_published', e.target.checked)}
                                className="w-5 h-5 text-emerald-600 rounded border-slate-300 cursor-pointer"
                            />
                            <span className="font-bold text-sm text-slate-800">
                                {data.is_published ? 'Dipublikasikan (Published)' : 'Sebagai Draf (Draft)'}
                            </span>
                        </label>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Ringkasan (Excerpt)
                    </label>
                    <textarea
                        rows={2}
                        value={data.excerpt}
                        onChange={(e) => setData('excerpt', e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Konten Markdown *
                    </label>
                    <div className="border border-slate-300 rounded-2xl overflow-hidden min-h-[420px]">
                        <div ref={editorRef} style={{ height: '420px' }}></div>
                    </div>
                </div>
            </form>

            {/* DISTINCT COLORED FOOTER */}
            <div className="px-8 py-4 bg-emerald-50 border-t border-emerald-200 flex items-center justify-end gap-3 shrink-0">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl font-bold text-sm text-slate-600 bg-white border border-slate-300 hover:bg-slate-100 cursor-pointer"
                >
                    Batal
                </button>
                <button
                    type="submit"
                    form="edit-form-inner"
                    disabled={processing}
                    className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                    {processing ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Menyimpan...</span>
                        </>
                    ) : (
                        <>
                            <Check className="w-4 h-4" />
                            <span>Perbarui Artikel</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

function UploadCoverModal({ postId, onClose }) {
    const { data, setData, post, processing, errors } = useForm({
        cover_image: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/dashboard/posts/${postId}/cover`, {
            onSuccess: () => onClose(),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 bg-slate-800 text-white flex items-center justify-between">
                    <h3 className="font-bold text-base">Unggah Foto Sampul</h3>
                    <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-white cursor-pointer">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <p className="text-xs text-slate-500">
                        Format berkas harus berupa gambar (JPG, PNG, WebP) dengan ukuran maksimal 3 MB.
                    </p>

                    <div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setData('cover_image', e.target.files[0])}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                            required
                        />
                        {errors.cover_image && <p className="text-xs text-rose-600 mt-1.5">{errors.cover_image}</p>}
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
                            {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            <span>Unggah Sampul</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
