import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const [loginError, setLoginError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm();

    const formSubmit = async (data) => {
        try {
            setLoginError("");
            const response = await axios.post("http://localhost:3000/auth/login", data, {
                withCredentials: true
            });

            if (response.data.success) {
                setUser(response.data.user);
                const userRole = response.data.user.role;
                console.log(userRole);
                switch (userRole) {
                    case "EMPLOYEE":
                        navigate("/employee/dashboard");
                        break;
                    case "HR":
                        navigate("/hr/dashboard");
                        break;
                    case "MANAGER":
                        navigate("/manager/dashboard");
                        break;
                    case "ADMIN":
                        navigate("/admin/dashboard");
                        break;
                    default:
                        navigate("/");
                        break;
                }
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setLoginError(error.response.data.message);
            } else {
                setLoginError("Login failed. Please try again.");
            }
        }
    };


    return (
        <section className='relative min-h-screen w-full bg-cover bg-center flex items-center justify-center' style={{ backgroundImage: "url('/background.avif')" }}>
            {/* Dark Overlay */}
            <div className='absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80'></div>

            {/* Login Card */}
            <div className='relative z-10 w-full max-w-md p-8 mx-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl'>

                {/* Header */}
                <div className='text-center mb-8'>
                    <h1 className='text-3xl font-bold text-white'>Welcome Back</h1>
                    <p className='text-gray-300 mt-2'>Please enter your details to sign in</p>
                </div>

                {/* Form */}
                {loginError && (
                    <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm text-center">
                        {loginError}
                    </div>
                )}
                <form onSubmit={handleSubmit(formSubmit)} className='space-y-6'>
                    <div>
                        <label className='block text-sm font-medium text-gray-200 mb-1'>Email Address</label>
                        <input
                            type="email"
                            {...register("email")}
                            placeholder="name@company.com"
                            className='w-full px-4 py-3 rounded-lg bg-black/30 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all'
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-200 mb-1'>Password</label>
                        <input
                            type="password"
                            {...register("password")}
                            placeholder="••••••••"
                            className='w-full px-4 py-3 rounded-lg bg-black/30 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all'
                        />
                    </div>

                    <div className='flex items-center justify-between text-sm'>
                        <label className='flex items-center text-gray-300 cursor-pointer'>
                            <input type="checkbox" className='mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500' />
                            Remember me
                        </label>
                        <a href="#" className='text-blue-400 hover:text-blue-300 transition-colors'>Forgot password?</a>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transform active:scale-[0.98] transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                {/* Footer */}
                <p className='text-center mt-8 text-gray-400'>
                    Don't have an account?
                    <Link to="/register" className='ml-1 text-white font-medium hover:underline'>Create one</Link>
                </p>
            </div>
        </section>

    );
};

export default LoginPage;
