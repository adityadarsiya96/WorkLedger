import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();

  const formSubmit = async (data) => {
    try {
      setAuthError("");
      setSuccessMsg("");
      const response = await axios.post("http://localhost:3000/auth/register", data);

      if (response.data.success) {
         setSuccessMsg("Registration successful! Your account is pending HR approval.");
         // Optionally wait a couple of seconds and redirect to login
         setTimeout(() => {
             navigate("/login");
         }, 3000);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setAuthError(error.response.data.message);
      } else {
        setAuthError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <section className='relative min-h-screen w-full bg-cover bg-center flex items-center justify-center' style={{backgroundImage:"url('/background.avif')"}}>
        {/* Dark Overlay */}
        <div className='absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80'></div>

        {/* Register Card */}
        <div className='relative z-10 w-full max-w-md p-8 mx-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl'>
            
            {/* Header */}
            <div className='text-center mb-8'>
                <h1 className='text-3xl font-bold text-white'>Create Account</h1>
                <p className='text-gray-300 mt-2'>Join WorkLedger today</p>
            </div>

            {/* Form */}
            {authError && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm text-center">
                    {authError}
                </div>
            )}
            
            {successMsg && (
                <div className="mb-4 p-3 rounded-lg bg-green-500/20 border border-green-500/50 text-green-200 text-sm text-center">
                    {successMsg}
                </div>
            )}

            <form onSubmit={handleSubmit(formSubmit)} className='space-y-6'>
                <div>
                    <label className='block text-sm font-medium text-gray-200 mb-1'>Full Name</label>
                    <input 
                        type="text" 
                        {...register("name", { required: true })}
                        placeholder="John Doe"
                        required
                        className='w-full px-4 py-3 rounded-lg bg-black/30 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all'
                    />
                </div>

                <div>
                    <label className='block text-sm font-medium text-gray-200 mb-1'>Email Address</label>
                    <input 
                        type="email" 
                        {...register("email", { required: true })}
                        placeholder="name@company.com"
                        required
                        className='w-full px-4 py-3 rounded-lg bg-black/30 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all'
                    />
                </div>

                <div>
                    <label className='block text-sm font-medium text-gray-200 mb-1'>Password</label>
                    <input 
                        type="password"
                        {...register("password", { required: true })} 
                        placeholder="••••••••"
                        required
                        className='w-full px-4 py-3 rounded-lg bg-black/30 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all'
                    />
                </div>

                <div className='flex items-center text-sm'>
                    <label className='flex items-center text-gray-300 cursor-pointer'>
                        <input type="checkbox" required className='mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500' />
                        I agree to the Terms and Privacy Policy
                    </label>
                </div>

                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={`w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transform active:scale-[0.98] transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                    {isSubmitting ? 'Creating account...' : 'Sign Up'}
                </button>
            </form>

            {/* Footer */}
            <p className='text-center mt-8 text-gray-400'>
                Already have an account? 
                <Link to="/login" className='ml-1 text-white font-medium hover:underline'>Sign In</Link>
            </p>
        </div>
    </section>
  );
};

export default RegisterPage;
