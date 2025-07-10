import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { User, Mail, Lock, Loader } from 'lucide-react';
import { useAuth } from '../store/useAuth';
import PasswordStrength from '../components/PasswordStrength';

export default function Register() {
    const navigate = useNavigate();
    const { signup, error, isLoading } = useAuth();
    const { register, handleSubmit, watch } = useForm({
        // resolver: yupResolver(schema),
    });

    const passValue = watch('password');
    const [profileImage, setProfileImage] = useState(null);

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();

            Object.entries(data).forEach(([key, value]) => {
                formData.append(key, value);
            });

            if (profileImage) {
                formData.append('file', profileImage);
            }

            const payload = formData;
            const response = await signup(payload);
            if (response) {
                navigate('/');
            }
        } catch (error) {
            console.log('Error while register : ', error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md p-8 bg-gray-900 rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
                    Create Account
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="relative mb-6 flex flex-col items-center">
                        <label className="block text-gray-300 mb-2">Profile Image</label>
                        <button
                            type="button"
                            className="mb-3 w-20 h-20 rounded-full overflow-hidden border-2 border-green-500 bg-gray-800 flex items-center justify-center focus:outline-none"
                            onClick={() => document.getElementById('profile-image-input').click()}
                            tabIndex={0}
                        >
                            {profileImage ? (
                                <img src={URL.createObjectURL(profileImage)} alt="Profile Preview" className="object-cover w-full h-full" />
                            ) : (
                                <User className="text-gray-500 w-10 h-10" />
                            )}
                        </button>
                        <input
                            id="profile-image-input"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setProfileImage(e.target.files[0])}
                            className="hidden"
                        />
                        <span className="text-xs text-gray-400">Click image to select</span>
                    </div>
                    <div className="relative mb-6">
                        <div className="absolute inset-y-0 flex items-center pl-3 pointer-events-none">
                            <User className="size-5 text-green-500 " />
                        </div>
                        <input
                            type="text"
                            placeholder="Full Name"
                            {...register('username')}
                            className="w-full pl-10 pr-3 py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400 transition duration-200"
                        />
                    </div>
                    <div className="relative mb-6">
                        <div className="absolute inset-y-0 flex items-center pl-3 pointer-events-none">
                            <Mail className="size-5 text-green-500 " />
                        </div>
                        <input
                            type="email"
                            placeholder="Email Address"
                            {...register('email')}
                            className="w-full pl-10 pr-3 py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400 transition duration-200"
                        />
                    </div>
                    <div className="relative mb-6">
                        <div className="absolute inset-y-0 flex items-center pl-3 pointer-events-none">
                            <Lock className="size-5 text-green-500 " />
                        </div>
                        <input
                            type="password"
                            placeholder="Password"
                            {...register('password')}
                            className="w-full pl-10 pr-3 py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400 transition duration-200"
                        />
                    </div>
                    {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}
                    <PasswordStrength password={passValue} />
                    <button
                        className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
                        font-bold rounded-lg shadow-lg hover:from-green-600
                        hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                         focus:ring-offset-gray-900 transition duration-200"
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader className="animate-spin mx-auto" size={24} /> : 'Sign Up'}
                    </button>
                </form>
                <p className="px-8 py-4 flex justify-center text-gray-400 text-sm">
                    Already have an account?
                    <Link to="/" className="text-green-400 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
