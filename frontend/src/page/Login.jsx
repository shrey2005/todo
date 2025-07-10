import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader } from 'lucide-react';
import { useAuth } from '../store/useAuth';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const Login = () => {
    const { isLoading, error, login } = useAuth();
    const navigate = useNavigate();

    const schema = yup.object().shape({
        email: yup.string().required('Email is required').email('Invalid email address'),
        password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
    });

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors: formError },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (formData) => {
        const payload = {
            email: formData.email,
            password: formData.password,
        };
        try {
            await login(payload);
            if (!error) {
                navigate('/dashboard');
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md bg-gray-900 bg-opacity-70 rounded-xl shadow-lg">
                <div className="p-8">
                    <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
                        Welcome Back
                    </h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                        <button
                            className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg
                            shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500
                            focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
                            type="submit"
                        >
                            {isLoading ? <Loader className="w-6 h-6 animate-spin mx-auto" /> : 'Login'}
                        </button>
                    </form>
                </div>
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
