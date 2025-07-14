import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader, LogIn } from 'lucide-react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../store/useAuth';

const schema = yup.object().shape({
    email: yup.string().required('Email is required').email('Invalid email address'),
    password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
});

const Login = () => {
    const { isLoading, login } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors: formError },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (formData) => {
        try {
            const payload = {
                email: formData.email,
                password: formData.password,
            };
            const result = await login(payload);
            if (result.success) {
                navigate('/dashboard');
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-4">
            <div className="w-full max-w-md bg-white shadow-xl p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-2 text-gray-800">Welcome Back</h2>
                    <p className="text-gray-600">Sign in to your account</p>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
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
                                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-indigo-400 text-black rounded-md placeholder-gray-300 focus:ring-2 focus:ring-indigo-300 outline-none"
                            />
                        </div>
                    </div>
                    <button
                        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        disabled={isLoading}
                        type="submit"
                    >
                        {isLoading ? (
                            <>
                                <Loader className="w-5 h-5 animate-spin mr-2" />
                                Signing In...
                            </>
                        ) : (
                            <>
                                <LogIn className="w-5 h-5 mr-2" />
                                Sign In
                            </>
                        )}
                    </button>
                </form>
                <div className="px-8 py-4 flex justify-center">
                    <p className="text-sm text-gray-400">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-green-400 hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
