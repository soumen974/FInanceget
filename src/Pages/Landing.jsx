import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, PieChart, DollarSign, TrendingUp, Target, Users, Goal, ChartNetwork, Radar, ChartNoAxesGantt, ChevronRight, Shield, Clock, RefreshCw, Moon, Sun } from 'lucide-react';

// Color Palette
const COLORS = {
  primary: '#6366F1',    // Modern Indigo
  accent: '#FBBF24',     // Vibrant Amber
  bgLight: '#F9FAFB',    // Soft Gray
  bgDark: '#0a0a0a',     // Black
  textDark: '#1F2937',   // Dark Gray
  textLight: '#6B7280',  // Light Gray
};

const LandingPage = () => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.removeItem('theme');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const features = [
    { title: "Smart Budgeting", description: "Plan and track with ease.", icon: <ChartNoAxesGantt /> },
    { title: "Expense Tracking", description: "Know where your money goes.", icon: <Radar /> },
    { title: "Financial Reports", description: "See your financial story.", icon: <ChartNetwork /> },
    { title: "Goal Setting", description: "Reach your money milestones.", icon: <Goal /> },
  ];

  const testimonials = [
    { name: "Soumen Bhunia", role: "Freelancer", content: "Transformed my finances!", avatar: "SB" },
    { name: "Monika Pal.", role: "Owner", content: "Optimized my expenses.", avatar: "MP" },
    { name: "Souvagya Ranjan Dash.", role: "Software Engineer", content: "Optimized my expenses.", avatar: "SRD" },
    { name: "Ritesh Das.", role: "Software Engineer", content: "Optimized my expenses.", avatar: "RD" },
  ];

  const benefits = [
    { icon: <Clock />, title: "Real-Time", description: "Instant updates" },
    { icon: <Shield />, title: "Secure", description: "Top-tier protection" },
    { icon: <RefreshCw />, title: "Sync", description: "Seamless tracking" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white">
      {/* Theme Toggle Button */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 p-2 rounded-full bg-gray-50 dark:bg-[#ffffff17] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#ffffff24] transition-colors duration-150 z-50"
        aria-label="Toggle theme"
      >
        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* Hero Section */}
      <header className="pt-16 pb-24 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Master Your <span className="text-indigo-600 dark:text-indigo-400">Finances</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
            Budget, track, and grow your money with a simple, powerful tool.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-150"
            >
              Start Free <ChevronRight size={18} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-white dark:bg-[#ffffff17] text-indigo-600 dark:text-indigo-400 px-6 py-3 rounded-lg font-medium border border-indigo-600 dark:border-[#ffffff24] hover:bg-indigo-50 dark:hover:bg-[#ffffff24] transition-colors duration-150"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Your Money, Simplified</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-gray-50 dark:bg-[#ffffff17] hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors duration-150"
              >
                <div className="mb-4 text-indigo-600 dark:text-indigo-400">{feature.icon}</div>
                <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 px-4 bg-indigo-600 text-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold mb-1">5+</div>
            <div className="text-sm text-indigo-100">Users</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1">₹15K+</div>
            <div className="text-sm text-indigo-100">Tracked</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1">4.9/5</div>
            <div className="text-sm text-indigo-100">Rating</div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">User Love</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-4 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#ffffff24] rounded-lg"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-indigo-600 dark:bg-indigo-500 text-white rounded-full flex items-center justify-center font-medium text-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-medium">{testimonial.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Get Started Now</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">Join the financial revolution with FinanceGet.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-150"
            >
              Try Free <ChevronRight size={18} />
            </Link>
            <button className="inline-flex items-center gap-2 bg-gray-50 dark:bg-[#ffffff17] text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-[#ffffff24] transition-colors duration-150">
              Contact Us
            </button>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                {benefit.icon} {benefit.title}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 px-4 text-gray-400">
        <div className="max-w-5xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Wallet className="h-6 w-6 text-indigo-500" />
              <span className="text-lg font-bold text-white">FinanceGet</span>
            </div>
            <p className="text-sm">Simplify your financial life.</p>
          </div>
          {[
            { title: "Product", links: ["Features", "Pricing", "Docs"] },
            { title: "Company", links: ["About", "Blog", "Careers"] },
            { title: "Legal", links: ["Privacy", "Terms"] },
          ].map((section, index) => (
            <div key={index}>
              <h4 className="text-sm font-medium text-white mb-4">{section.title}</h4>
              <ul className="space-y-2 text-sm">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href="#" className="hover:text-indigo-400 transition-colors duration-150">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center text-xs">© {new Date().getFullYear()} FinanceGet</div>
      </footer>
    </div>
  );
};

export default LandingPage;