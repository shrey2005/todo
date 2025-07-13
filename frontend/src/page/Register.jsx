import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { CheckCircle, Mail, Lock, Upload, User } from 'lucide-react';
import { useAuth } from '../store/useAuth';
import PasswordStrength from '../components/PasswordStrength';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
    email: yup.string().required('Email is required').email('Invalid email address'),
    username: yup.string().required('Username is required'),
});

export default function Register() {
    const navigate = useNavigate();
    const { signup, error, isLoading } = useAuth();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors: formError },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const passValue = watch('password');
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageError, setImageError] = useState(null);

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

    const handleImageChange = (e) => {
        try {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 5 * 1024 * 1024) {
                    setImageError({ image: 'Image size should be less than 5MB' });
                    return;
                }
            }
            setProfileImage(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
            setImageError(null);
        } catch (err) {
            console.log('Error while image change : ', err);
        }
    };

    return (
        <div className="min-h-screen p-4 flex items-center justify-center bg-gradient-to-br from-blue-50  to-indigo-100">
            <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-2xl">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-2 text-gray-800">Create Account</h2>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Profile Image */}
                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <div className="w-24 h-24  rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Profile preview" className="w-full h-full object-cover" />
                                ) : (
                                    <Upload className="w-8 h-8 text-gray-400" />
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>
                        <label htmlFor="profile-image" className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 cursor-pointer">
                            Upload Profile Image
                        </label>
                        {imageError && <p className="mt-1 text-sm text-red-600">{imageError.image}</p>}
                       
                            <span className="text-xs text-gray-300">Click image to select</span> 
                    </div>

                    {/* Full Name */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Full Name"
                                {...register('username')}
                                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-indigo-400 text-black rounded-md placeholder-gray-300 focus:ring-2 focus:ring-indigo-300 outline-none"
                            />
                        </div>
                        {formError?.username && <p className="mt-1 text-sm text-red-600">{formError?.username?.message}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="email"
                                placeholder="Email Address"
                                {...register('email')}
                                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-indigo-400 text-black rounded-md placeholder-gray-300 focus:ring-2 focus:ring-indigo-300 outline-none"
                            />
                        </div>
                        {formError?.email && <p className="mt-1 text-sm text-red-600">{formError?.email?.message}</p>}
                    </div>
                    
                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="password"
                                placeholder="Password"
                                {...register('password')}
                                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                                    error?.password ? 'border-red-300' : 'border-gray-300'
                                }`}
                            />
                        </div>
                    </div>
                
                    {/* Password Strength */}
                    <PasswordStrength password={passValue} />

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Creating Account...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-5 h-5 mr-2" />
                                Create Account
                            </>
                        )}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-700">
                    Already have an account?{' '}
                    <Link to="/" className="text-indigo-300 hover:underline font-medium">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
