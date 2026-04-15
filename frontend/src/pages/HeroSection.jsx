import React from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_URL;
  console.log(baseUrl);
  const navigatePage =async()=>{
    await navigate("/login");

  }
  return (
    <section
      className="relative min-h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: "url('/background.avif')" }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80"></div>

      {/* Navbar */}
      <header className="relative z-20 pt-4">
        <nav className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between rounded-full
                         text-white ">
          
          {/* Logo */}
          <div className="text-2xl font-bold tracking-tight">
            Work<span className="text-blue-400">Ledger</span>
          </div>

          {/* Nav Links */}
          <ul className="hidden md:flex items-center gap-8 font-medium text-gray-200">
            <li className="cursor-pointer hover:text-white transition">
              How it Works
            </li>
            <li className="cursor-pointer hover:text-white transition">
              Features
            </li>
          </ul>

          {/* CTA */}
          <button onClick={navigatePage} className="px-5 py-2 bg-blue-500 text-white rounded-full font-semibold 
                             hover:bg-blue-600 transition shadow-md">
            Login
          </button>
        </nav>
      </header>

      {/* Hero Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 flex min-h-[calc(100vh-96px)]
                      flex-col items-center justify-center text-center text-white">
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight max-w-5xl">
          Global Payroll & Leave Management <br />
          <span className="text-blue-400">Built for Modern Teams</span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-gray-200 max-w-2xl">
          Automate payroll, leave tracking, and tax compliance effortlessly —
          all from one unified, enterprise-ready platform.
        </p>

        <div className="mt-12 flex gap-5">
          <button className="px-7 py-3 bg-blue-500 text-white rounded-full font-semibold 
                             hover:bg-blue-600 transition shadow-lg">
            Get Started
          </button>
          <button className="px-7 py-3 border border-white/40 rounded-full font-semibold 
                             hover:bg-white/10 transition">
            Learn More
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/70 text-sm animate-bounce">
        ↓ Scroll
      </div>
    </section>
  );
};

export default HeroSection;
