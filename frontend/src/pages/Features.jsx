import React from "react";

const features = [
  {
    title: "Automated Payroll Processing",
    desc: "Run accurate payroll in seconds with automated tax, deductions, and compliance calculations."
  },
  {
    title: "Leave Management System",
    desc: "Track leave balances, approve requests, and manage policies with full transparency."
  },
  {
    title: "Tax & Compliance Engine",
    desc: "Stay compliant with built-in tax rules and automatic updates for regulations."
  },
  {
    title: "Employee Self-Service",
    desc: "Allow employees to download payslips, apply for leave, and track requests."
  },
  {
    title: "Detailed Reports & Analytics",
    desc: "Generate payroll summaries, audit logs, and export compliance-ready reports."
  },
  {
    title: "Secure Cloud Infrastructure",
    desc: "Enterprise-grade security with encrypted payroll and employee data."
  }
];

const Features = () => {
  return (
    <section className="relative w-full py-28 bg-gradient-to-b from-black via-black/95 to-black text-white">
      
      {/* Section Header */}
      <div className="mx-auto max-w-7xl px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-bold">
          Powerful Features for <span className="text-blue-400">Modern Teams</span>
        </h2>
        <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
          Everything you need to manage payroll, leave, and compliance in one unified platform.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="mx-auto max-w-7xl px-6 mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <div
            key={index}
            className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-8
                       hover:bg-white/15 transition duration-300"
          >
            <h3 className="text-xl font-semibold">
              {feature.title}
            </h3>
            <p className="mt-4 text-gray-300 text-sm leading-relaxed">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Highlight Feature Block */}
      <div className="mx-auto max-w-7xl px-6 mt-28">
        <div className="rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold">
            Built for Scalability & Security
          </h3>
          <p className="mt-6 text-gray-300 max-w-3xl mx-auto">
            Whether you're a startup or a global enterprise, WorkLedger adapts to your payroll
            needs with secure infrastructure, high performance, and reliable uptime.
          </p>

          <button className="mt-10 px-8 py-4 bg-blue-500 text-white rounded-full font-semibold
                             hover:bg-blue-600 transition shadow-lg">
            Explore All Features
          </button>
        </div>
      </div>
    </section>
  );
};

export default Features;
