import React, { useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import { normalizeViewerHeadings } from '../../utils/markdown';
import {
    ArrowLeft,
    Calendar,
    User,
    Tag,
    LogIn,
    UserPlus,
    Share2,
    BookOpen,
    CheckCircle2
} from 'lucide-react';

export default function PostShow({ post }) {
    const viewerRef = useRef(null);
    const viewerInstance = useRef(null);

    useEffect(() => {
        if (viewerRef.current && !viewerInstance.current) {
            viewerInstance.current = new Viewer({
                el: viewerRef.current,
                initialValue: post.content || '',
            });
            normalizeViewerHeadings(viewerRef.current, 2);
        }

        return () => {
            if (viewerInstance.current) {
                viewerInstance.current.destroy();
                viewerInstance.current = null;
            }
        };
    }, [post.content]);

    return (
        <AppLayout isPublic={true}>
            <Head title={`${post.title} - BlogVerse Pro`} />

            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Back to articles navigation */}
                <div className="mb-8">
                    <Link
                        href="/articles"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Kembali ke Galeri Artikel</span>
                    </Link>
                </div>

                {/* Article Header */}
                <header className="space-y-6 mb-10">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                        <Tag className="w-3.5 h-3.5" />
                        <span>{post.category_label || post.category}</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                        {post.title}
                    </h1>

                    {post.excerpt && (
                        <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-serif italic border-l-4 border-blue-500 pl-4 py-1">
                            {post.excerpt}
                        </p>
                    )}

                    {/* Author and Metadata Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-200 text-sm">
                        <div className="flex items-center gap-3">
                            {post.author.profile_photo_url ? (
                                <img
                                    src={post.author.profile_photo_url}
                                    alt={post.author.name}
                                    className="w-12 h-12 rounded-full object-cover border border-slate-200"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-lg shadow-sm">
                                    {post.author.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div>
                                <div className="font-bold text-slate-900">{post.author.name}</div>
                                <div className="text-xs text-slate-500">@{post.author.username} • Penulis BlogVerse</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-500">
                            <span className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4 text-slate-400" />
                                <span>{post.published_at || 'Baru Saja'}</span>
                            </span>
                        </div>
                    </div>
                </header>

                {/* Cover Image Banner */}
                {post.cover_url && (
                    <div className="mb-12 rounded-2xl overflow-hidden border border-slate-200 shadow-sm aspect-video bg-slate-100">
                        <img
                            src={post.cover_url}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* Article Content Rendered with TOAST UI Viewer */}
                <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-xs mb-16">
                    <div ref={viewerRef} className="toastui-editor-contents text-slate-800 leading-relaxed text-base sm:text-lg" />
                </div>

                {/* Community Invitation Card (Bagian Bawah Halaman Baca Artikel) */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Komunitas Penulis BlogVerse Pro</span>
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
                            Tertarik Menulis dan Membagikan Artikel Anda Sendiri?
                        </h2>

                        <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
                            Bergabunglah bersama ribuan penulis di platform BlogVerse Pro. Dapatkan akses ke
                            editor Markdown lengkap, sistem analitik artikel pribadi, ekspor spreadsheet, dan bantuan AI pintar.
                        </p>

                        <div className="pt-2 flex flex-wrap items-center gap-3">
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-slate-900 bg-white hover:bg-blue-50 shadow-md transition cursor-pointer text-sm"
                            >
                                <LogIn className="w-4 h-4 text-blue-600" />
                                <span>Halaman Login (Masuk)</span>
                            </Link>
                            <Link
                                href="/register"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white bg-blue-900/60 hover:bg-blue-900/80 border border-white/30 backdrop-blur-sm transition cursor-pointer text-sm"
                            >
                                <UserPlus className="w-4 h-4" />
                                <span>Halaman Register (Daftar Penulis)</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </article>
        </AppLayout>
    );
}
