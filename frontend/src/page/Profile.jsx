import { useEffect, useState } from 'react';
import { useAuth } from '../store/useAuth';
import defaultAvatar from '../assets/default-avatar.jpg';
import { UPLOAD_URL } from '../constant';

export default function ProfilePage() {
    const { profile, fetchProfile, updateProfile, loading } = useAuth();
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(defaultAvatar);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    useEffect(() => {
        if (profile?.file) {
            setPreview(`${UPLOAD_URL}${profile.file}`);
        } else {
            setPreview(defaultAvatar);
        }
    }, [profile]);

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        if (file) {
            formData.append('file', file);
        }
        await updateProfile(formData, profile?.id);
        await fetchProfile();
        setFile(null);
        setShowModal(false);
    };

    const closeModal = () => {
        setShowModal(false);
        setFile(null);
        setPreview(profile?.imageUrl ? `${UPLOAD_URL}${profile.file}` : defaultAvatar);
    };

    return (
        <div className="w-screen min-h-screen bg-gray-100 flex justify-center px-4 py-10">
            <div className="bg-white border border-gray-300 rounded-2xl shadow-lg p-10 w-full max-w-screen-md transition-all duration-300">

                {/* Header Section */}
                <div className="relative flex items-center justify-center mb-10">
                    <button
                        onClick={() => (window.location.href = '/dashboard')}
                        className="absolute left-0 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                        &larr; Back
                    </button>
                    <h2 className="text-3xl font-bold text-gray-800">User Profile</h2>
                </div>

                {/* Content */}
                {loading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                        {/* Profile Image Section */}
                        <div className="flex flex-col items-center">
                            <img
                                src={preview}
                                alt="Profile"
                                className="w-40 h-40 rounded-full object-cover border-4 border-blue-100 shadow-md cursor-pointer transition-transform hover:scale-105"
                                onClick={() => setShowModal(true)}
                            />
                            <button
                                onClick={() => setShowModal(true)}
                                className="mt-4 text-blue-600 font-semibold hover:underline"
                            >
                                {profile?.file ? 'Edit Profile Picture' : 'Add Profile Picture'}
                            </button>
                        </div>

                        {/* Profile Info Section */}
                        <div className="space-y-6 text-gray-700 text-base bg-gray-50 rounded-xl border border-gray-200 p-6 shadow-sm">
                            <div className="flex justify-between">
                                <span className="font-semibold text-gray-600">Full Name:</span>
                                <span>{profile?.username}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold text-gray-600">Email:</span>
                                <span>{profile?.email}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
                    <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-6 relative">
                        <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">
                            {profile?.imageUrl ? 'Edit Profile Picture' : 'Add Profile Picture'}
                        </h3>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                setFile(e.target.files[0]);
                                setPreview(URL.createObjectURL(e.target.files[0]));
                            }}
                            className="block w-full mb-4 text-sm text-gray-600"
                        />

                        <div className="flex gap-4">
                            <button
                                onClick={handleUpload}
                                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                {profile?.file ? 'Update' : 'Upload'}
                            </button>
                            <button
                                onClick={closeModal}
                                className="flex-1 bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
}
