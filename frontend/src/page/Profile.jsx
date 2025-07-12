import { useEffect, useState } from 'react';
import { useAuth } from '../store/useAuth';
import defaultAvatar from '../assets/default-avatar.jpg';
import { UPLOAD_URL } from '../constant';

const SuccessSVG = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    );
};

const CancelSVG = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    );
};

const EditSVG = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13z"
            />
        </svg>
    );
};
export default function ProfilePage() {
    const { profile, fetchProfile, updateProfile, loading } = useAuth();
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(defaultAvatar);

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
    };

    return (
        <div className="bg-gray-50 flex flex-col items-center justify-center py-10 px-4">
            <div className="w-full bg-white rounded-xl shadow-lg border border-gray-200 p-8 flex flex-col items-center">
                {/* Header */}
                <div className="w-full flex items-center mb-8">
                    <button
                        onClick={() => (window.location.href = '/dashboard')}
                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                    >
                        <span className="text-xl">&larr;</span>
                        <span>Back</span>
                    </button>
                </div>

                {/* Profile Image & Upload */}
                <div className="relative flex flex-col items-center mb-6">
                    <img src={preview} alt="Profile" className="w-28 h-28 rounded-full object-cover border-2 border-blue-200 shadow" />
                    {file ? (
                        <div className="absolute bottom-2 right-2 flex flex-col items-center gap-2">
                            <button
                                onClick={handleUpload}
                                className="bg-blue-600 text-base font-medium rounded-full p-2 shadow hover:bg-blue-700 transition"
                                title="Upload Profile Picture"
                            >
                                <SuccessSVG />
                            </button>
                            <button
                                onClick={() => {
                                    setFile(null);
                                    setPreview(profile?.file ? `${UPLOAD_URL}${profile.file}` : defaultAvatar);
                                }}
                                className="bg-gray-100  text-gray-800 rounded-full p-2 shadow hover:bg-gray-200 transition"
                                title="Cancel"
                            >
                                <CancelSVG />
                            </button>
                        </div>
                    ) : (
                        <>
                            <button
                                onClick={() => document.getElementById('profile-file-input').click()}
                                className="absolute bottom-2 text-base right-2 bg-blue-600 text-white rounded-full p-2 shadow hover:bg-blue-700 transition"
                                title="Edit Profile Picture"
                            >
                                <EditSVG />
                            </button>
                            <input
                                id="profile-file-input"
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={(e) => {
                                    setFile(e.target.files[0]);
                                    setPreview(URL.createObjectURL(e.target.files[0]));
                                }}
                            />
                        </>
                    )}
                </div>
                {/* Profile Info */}
                {loading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : (
                    <div className="w-full space-y-4">
                        <div className="flex items-center justify-between border-b pb-2">
                            <span className="font-medium text-gray-600">Full Name</span>
                            <span className="text-gray-800">{profile?.username}</span>
                        </div>
                        <div className="flex items-center justify-between border-b pb-2">
                            <span className="font-medium text-gray-600">Email</span>
                            <span className="text-gray-800">{profile?.email}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
