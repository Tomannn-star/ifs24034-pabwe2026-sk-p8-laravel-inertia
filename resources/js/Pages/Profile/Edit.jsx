import React, { useRef } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import {
    User,
    Mail,
    AtSign,
    Lock,
    Camera,
    Trash2,
    Shield,
    Save,
    CheckCircle2
} from 'lucide-react';

export default function Edit({ profile }) {
    const fileInputRef = useRef(null);

    // Profile form
    const {
        data: profileData,
        setData: setProfileData,
        post: postProfile,
        processing: profileProcessing,
        errors: profileErrors,
        recentlySuccessful: profileSuccess
    } = useForm({
        _method: 'put',
        name: profile.name || '',
        username: profile.username || '',
        email: profile.email || '',
        photo: null,
    });

    // Password form
    const {
        data: passwordData,
        setData: setPasswordData,
        put: putPassword,
        processing: passwordProcessing,
        errors: passwordErrors,
        reset: resetPassword,
        recentlySuccessful: passwordSuccess
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        postProfile('/profile', {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        putPassword('/profile/password', {
            preserveScroll: true,
            onSuccess: () => resetPassword(),
        });
    };

    const handleDeletePhoto = () => {
        if (confirm('Apakah Anda yakin ingin menghapus foto profil ini?')) {
            router.delete('/profile/photo', {
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout>
            <Head title="Pengaturan Profil - BlogVerse Pro" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        Pengaturan Akun & Profil
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Kelola data pribadi, foto profil, dan kata sandi akun BlogVerse Pro Anda.
                    </p>
                </div>

                {/* Section 1: Informasi Profil */}
                <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                                <User className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    Informasi Profil
                                </h2>
                                <p className="text-xs text-slate-500">
                                    Perbarui nama, username, email, dan foto profil Anda.
                                </p>
                            </div>
                        </div>

                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700">
                            <Shield className="w-3.5 h-3.5" />
                            {profile.role === 'admin' ? 'Administrator' : 'Penulis (Member)'}
                        </span>
                    </div>

                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                        {/* Profile Photo */}
                        <div>
                            <label htmlFor="profile-photo" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                                Foto Profil
                            </label>
                            <div className="flex items-center gap-6">
                                <div className="relative group">
                                    {profile.profile_photo_url ? (
                                        <img
                                            src={profile.profile_photo_url}
                                            alt={profile.name}
                                            className="w-24 h-24 rounded-3xl object-cover border-2 border-purple-200 shadow-md"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 rounded-3xl bg-linear-to-br from-purple-500 to-indigo-600 text-white font-extrabold text-3xl flex items-center justify-center shadow-md">
                                            {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                    )}

                                    <button
                                        type="button"
                                        aria-label="Ganti foto profil"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute bottom-0 right-0 p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-md transition cursor-pointer"
                                        title="Ganti Foto"
                                    >
                                        <Camera className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    <input
                                        id="profile-photo"
                                        type="file"
                                        ref={fileInputRef}
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                setProfileData('photo', e.target.files[0]);
                                            }
                                        }}
                                    />
                                    <div className="flex flex-wrap items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-xl transition cursor-pointer"
                                        >
                                            Pilih Foto Baru
                                        </button>
                                        {profile.profile_photo_url && (
                                            <button
                                                type="button"
                                                onClick={handleDeletePhoto}
                                                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                                Hapus Foto
                                            </button>
                                        )}
                                    </div>
                                    {profileData.photo && (
                                        <p className="text-xs font-semibold text-purple-600">
                                            File terpilih: {profileData.photo.name}
                                        </p>
                                    )}
                                    <p className="text-[11px] text-slate-600">
                                        Format JPG, PNG, WEBP. Maksimal 2 MB.
                                    </p>
                                    {profileErrors.photo && (
                                        <p className="text-xs text-rose-600 font-semibold">{profileErrors.photo}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Full Name */}
                        <div>
                            <label htmlFor="profile-name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                Nama Lengkap
                            </label>
                            <div className="relative">
                                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    id="profile-name"
                                    type="text"
                                    value={profileData.name}
                                    onChange={(e) => setProfileData('name', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 focus:bg-white font-medium transition"
                                    required
                                />
                            </div>
                            {profileErrors.name && (
                                <p className="text-xs text-rose-600 font-semibold mt-1">{profileErrors.name}</p>
                            )}
                        </div>

                        {/* Username & Email in Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="profile-username" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                    Username
                                </label>
                                <div className="relative">
                                    <AtSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        id="profile-username"
                                        type="text"
                                        value={profileData.username}
                                        onChange={(e) => setProfileData('username', e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 focus:bg-white font-medium transition"
                                        required
                                    />
                                </div>
                                {profileErrors.username && (
                                    <p className="text-xs text-rose-600 font-semibold mt-1">{profileErrors.username}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="profile-email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        id="profile-email"
                                        type="email"
                                        value={profileData.email}
                                        onChange={(e) => setProfileData('email', e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 focus:bg-white font-medium transition"
                                        required
                                    />
                                </div>
                                {profileErrors.email && (
                                    <p className="text-xs text-rose-600 font-semibold mt-1">{profileErrors.email}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            {profileSuccess && (
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Profil berhasil diperbarui.
                                </span>
                            )}
                            <button
                                type="submit"
                                disabled={profileProcessing}
                                className="ml-auto inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md transition disabled:opacity-50 cursor-pointer"
                            >
                                <Save className="w-4 h-4" />
                                <span>{profileProcessing ? 'Menyimpan...' : 'Simpan Profil'}</span>
                            </button>
                        </div>
                    </form>
                </div>

                {/* Section 2: Ubah Password */}
                <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                            <Lock className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">
                                Ubah Kata Sandi
                            </h2>
                            <p className="text-xs text-slate-500">
                                Pastikan akun Anda tetap aman dengan menggunakan kata sandi yang kuat dan unik.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="current-password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                Kata Sandi Saat Ini
                            </label>
                            <input
                                id="current-password"
                                type="password"
                                value={passwordData.current_password}
                                onChange={(e) => setPasswordData('current_password', e.target.value)}
                                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 focus:bg-white font-medium transition"
                                placeholder="••••••••"
                                required
                            />
                            {passwordErrors.current_password && (
                                <p className="text-xs text-rose-600 font-semibold mt-1">{passwordErrors.current_password}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="new-password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                    Kata Sandi Baru
                                </label>
                                <input
                                    id="new-password"
                                    type="password"
                                    value={passwordData.password}
                                    onChange={(e) => setPasswordData('password', e.target.value)}
                                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 focus:bg-white font-medium transition"
                                    placeholder="Minimal 6 karakter"
                                    required
                                />
                                {passwordErrors.password && (
                                    <p className="text-xs text-rose-600 font-semibold mt-1">{passwordErrors.password}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="new-password-confirmation" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                    Konfirmasi Kata Sandi Baru
                                </label>
                                <input
                                    id="new-password-confirmation"
                                    type="password"
                                    value={passwordData.password_confirmation}
                                    onChange={(e) => setPasswordData('password_confirmation', e.target.value)}
                                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 focus:bg-white font-medium transition"
                                    placeholder="Ulangi kata sandi baru"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            {passwordSuccess && (
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Kata sandi berhasil diperbarui.
                                </span>
                            )}
                            <button
                                type="submit"
                                disabled={passwordProcessing}
                                className="ml-auto inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition disabled:opacity-50 cursor-pointer"
                            >
                                <Lock className="w-4 h-4" />
                                <span>{passwordProcessing ? 'Menyimpan...' : 'Perbarui Kata Sandi'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
