import React from "react";

const Footer = () => {
  return (
    <footer className="relative w-full bg-black text-white border-t border-white/10">
      
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-6 py-20 grid gap-12 md:grid-cols-4">
        
        {/* Brand */}
        <div>
          <h3 className="text-2xl font-bold">
            Work<span className="text-blue-400">Ledger</span>
          </h3>
          <p className="mt-4 text-gray-400 text-sm leading-relaxed">
            A modern payroll and leave management platform designed for
            growing teams and enterprises.
          </p>
        </div>

        {/* Product */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Product</h4>
          <ul className="space-y-3 text-gray-400 text-sm">
            <li className="hover:text-white cursor-pointer transition">How It Works</li>
            <li className="hover:text-white cursor-pointer transition">Features</li>
            <li className="hover:text-white cursor-pointer transition">Pricing</li>
            <li className="hover:text-white cursor-pointer transition">Security</li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Company</h4>
          <ul className="space-y-3 text-gray-400 text-sm">
            <li className="hover:text-white cursor-pointer transition">About Us</li>
            <li className="hover:text-white cursor-pointer transition">Careers</li>
            <li className="hover:text-white cursor-pointer transition">Blog</li>
            <li className="hover:text-white cursor-pointer transition">Contact</li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Legal</h4>
          <ul className="space-y-3 text-gray-400 text-sm">
            <li className="hover:text-white cursor-pointer transition">Privacy Policy</li>
            <li className="hover:text-white cursor-pointer transition">Terms of Service</li>
            <li className="hover:text-white cursor-pointer transition">Cookie Policy</li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <span>© {new Date().getFullYear()} WorkLedger. All rights reserved.</span>
          <span className="mt-2 md:mt-0">
            Built for modern payroll teams
          </span>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
