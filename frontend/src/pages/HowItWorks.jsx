import React from "react";

const steps = [
  {
    step: "01",
    title: "Onboard Your Organization",
    desc: "Add your company, employees, salary structure, and compliance details in minutes."
  },
  {
    step: "02",
    title: "Configure Payroll & Leave Rules",
    desc: "Define pay cycles, tax rules, leave policies, and approvals with full flexibility."
  },
  {
    step: "03",
    title: "Automate Payroll Processing",
    desc: "Run payroll instantly with accurate calculations, deductions, and payslips."
  },
  {
    step: "04",
    title: "Track, Approve & Report",
    desc: "Manage leave requests, audit payroll history, and export compliance-ready reports."
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="relative w-full py-28 bg-gradient-to-b from-black via-black/95 to-black text-white">
      
      {/* Section Header */}
      <div className="mx-auto max-w-7xl px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-bold">
          How <span className="text-blue-400">WorkLedger</span> Works
        </h2>
        <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
          A simple, transparent workflow designed for modern payroll and leave management.
        </p>
      </div>

      {/* Steps */}
      <div className="mx-auto max-w-7xl px-6 mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((item) => (
          <div
            key={item.step}
            className="relative rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6
                       hover:bg-white/15 transition"
          >
            {/* Step Number */}
            <div className="text-5xl font-bold text-blue-400/40">
              {item.step}
            </div>

            {/* Content */}
            <h3 className="mt-4 text-xl font-semibold">
              {item.title}
            </h3>
            <p className="mt-3 text-gray-300 text-sm leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-24 text-center">
        <button className="px-8 py-4 bg-blue-500 text-white rounded-full font-semibold
                           hover:bg-blue-600 transition shadow-lg">
          Start Using WorkLedger
        </button>
      </div>
    </section>
  );
};

export default HowItWorks;
