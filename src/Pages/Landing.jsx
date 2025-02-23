import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, PieChart, DollarSign, TrendingUp, Target, Users, Goal, ChartNetwork, Radar, ChartNoAxesGantt, ChevronRight, Shield, Clock, RefreshCw, Moon, Sun, Check, BarChart2, Calendar, TrendingDown } from 'lucide-react';

// Original Color Palette
const COLORS = {
  primary: '#6366F1',    // Modern Indigo
  accent: '#FBBF24',     // Vibrant Amber
  bgLight: '#F9FAFB',    // Soft Gray
  bgDark: '#0a0a0a',    // Black (reverted to original)
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

  const financialTools = [
    {
      title: "Budget Allocator",
      description: "Distribute your income with the 50/30/20 rule or customize it.",
      icon: <PieChart className="text-indigo-600 dark:text-indigo-400" />,
      free: true,
      premium: "Custom Rules",
    },
    {
      title: "Savings Goal Tracker",
      description: "Set and monitor savings goals for any timeline.",
      icon: <Target className="text-indigo-600 dark:text-indigo-400" />,
      free: "Current Year",
      premium: "Multi-Year",
    },
    {
      title: "Expense Analyzer",
      description: "Break down spending patterns over time.",
      icon: <BarChart2 className="text-indigo-600 dark:text-indigo-400" />,
      free: "Current Year",
      premium: "Historical Data",
    },
    {
      title: "Forecasting",
      description: "Predict future savings and expenses based on trends.",
      icon: <TrendingUp className="text-indigo-600 dark:text-indigo-400" />,
      free: false,
      premium: "Full Access",
    },
  ];

  const testimonials = [
    { name: "Soumen Bhunia", role: "Freelancer", content: "Transformed my finances!", avatar: "SB" },
    { name: "Monika Pal", role: "Software Engineer", content: "Optimized my expenses.", avatar: "MP" },
    { name: "Souvagya Dash", role: "Software Engineer", content: "Planning made easy!", avatar: "SRD" },
    { name: "Ritesh Das", role: "Software Engineer", content: "Love the forecasting!", avatar: "RD" },
  ];

  const benefits = [
    { icon: <Clock />, title: "Real-Time", description: "Instant updates" },
    { icon: <Shield />, title: "Secure", description: "Top-tier protection" },
    { icon: <RefreshCw />, title: "Sync", description: "Seamless tracking" },
  ];

  const pricingPlans = [
    {
      name: "Basic",
      price: "₹0",
      priceSubtext: "/whole life",
      description: "Perfect for getting started with financial tracking.",
      features: [
        "Track budgets & goals for the current year",
        "Default 50/30/20 budgeting rule",
        "Real-time expense tracking",
        "Basic financial reports",
      ],
      cta: "Start Free",
      link: "/register",
      highlighted: false,
    },
    {
      name: "Premium",
      price: "₹29",
      priceSubtext: "/year",
      description: "Unlock advanced tools for total financial control.",
      features: [
        "Everything in Basic",
        "Track previous year data",
        "Customizable finance rules",
        "Advanced goal setting",
        "Financial forecasting",
        "Priority support",
      ],
      cta: "Go Premium",
      link: "/register",
      highlighted: true,
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white transition-colors duration-300">
      {/* Theme Toggle Button */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 p-2 rounded-full bg-gray-50 dark:bg-[#ffffff17] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#ffffff24]  transition-all duration-200 z-50"
        aria-label="Toggle theme"
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Hero Section */}
      <header className="pt-20 pb-24 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Master Your <span className="text-indigo-600 dark:text-indigo-400">Finances</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto">
            Budget, track, and grow your money with powerful tools.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 shadow-md transition-all duration-200"
            >
              Start Free <ChevronRight size={18} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-white dark:bg-[#ffffff17] text-indigo-600 dark:text-indigo-400 px-6 py-3 rounded-lg font-medium border border-indigo-600 dark:border-[#ffffff24] hover:bg-indigo-50 dark:hover:bg-[#ffffff24] shadow-md transition-all duration-200"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Your Money, Simplified</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-gray-50 dark:bg-[#ffffff17] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 border border-gray-100 dark:border-gray-700/50"
              >
                <div className="mb-4 text-indigo-600 dark:text-indigo-400">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Financial Planning Tools Section */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-[#1414145e]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Financial Planning Tools</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 text-center mb-12">
            Take control with tools designed for every financial goal.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {financialTools.map((tool, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-gray-50 dark:bg-[#4646465d] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 border border-gray-100 dark:border-gray-700/50"
              >
                <div className="mb-4">{tool.icon}</div>
                <h3 className="text-lg font-semibold mb-2 text-[#1F2937] dark:text-white">{tool.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{tool.description}</p>
                <div className="flex items-center gap-2 text-xs">
                  <span className={`px-2 py-1 rounded-full ${tool.free ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                    {tool.free === true ? 'Free' : typeof tool.free === 'string' ? tool.free : 'Premium Only'}
                  </span>
                  {tool.premium && (
                    <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                      {tool.premium}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Choose Your Plan</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 text-center mb-12">
            Start for free or unlock premium financial tools.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl shadow-md transition-all duration-300 border ${
                  plan.highlighted
                    ? 'bg-indigo-600 text-white border-indigo-700 transform -translate-y-2 shadow-lg'
                    : 'bg-gray-50 dark:bg-[#ffffff17] border-gray-100 dark:border-gray-700/50 hover:shadow-lg hover:-translate-y-1'
                }`}
              >
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.priceSubtext && (
                    <span className={`text-sm ${plan.highlighted ? 'text-indigo-200' : 'text-gray-600 dark:text-gray-400'}`}>
                      {plan.priceSubtext}
                    </span>
                  )}
                </div>
                <p className={`text-sm mb-6 ${plan.highlighted ? 'text-indigo-100' : 'text-gray-600 dark:text-gray-400'}`}>
                  {plan.description}
                </p>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check size={16} className={plan.highlighted ? 'text-indigo-200' : 'text-indigo-600 dark:text-indigo-400'} />
                      <span className={plan.highlighted ? 'text-indigo-100' : 'text-gray-700 dark:text-gray-300'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={plan.link}
                  className={`inline-flex items-center justify-center w-full gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    plan.highlighted
                      ? 'bg-white text-indigo-600 hover:bg-indigo-50 shadow-sm'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                  }`}
                >
                  {plan.cta} <ChevronRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 px-4 bg-indigo-600 dark:bg-[#14141485] text-white dark:text-indigo-600">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold mb-2">10+</div>
            <div className="text-sm text-indigo-100">Users</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">₹15K+</div>
            <div className="text-sm text-indigo-100">Tracked</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">4.9/5</div>
            <div className="text-sm text-indigo-100">Rating</div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">User Love</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-6 bg-gray-100 dark:bg-[#ffffff17] rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 border border-gray-100 dark:border-gray-700/50"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-indigo-600 dark:bg-indigo-500 text-white rounded-full flex items-center justify-center font-medium text-lg shadow-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get Started Now</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">Join the financial revolution with FinanceGet.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 shadow-md transition-all duration-200"
            >
              Try Free <ChevronRight size={18} />
            </Link>
            <button className="inline-flex items-center gap-2 bg-white dark:bg-[#ffffff17] text-indigo-600 dark:text-indigo-400 px-8 py-3 rounded-lg font-medium hover:bg-indigo-50 dark:hover:bg-[#ffffff24] border border-indigo-600 dark:border-[#ffffff24] shadow-md transition-all duration-200">
              Contact Us
            </button>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 bg-gray-50 dark:bg-[#ffffff17] px-4 py-2 rounded-full shadow-sm">
                <span className="text-indigo-600 dark:text-indigo-400">{benefit.icon}</span> 
                <span>{benefit.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="dark:bg-[#1414145e] bg-[#0a0a0a] py-12 px-4 text-gray-400">
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
                    <a href="#" className="hover:text-indigo-400 transition-colors duration-200">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center text-xs border-t border-[#222222a0] pt-4">© {new Date().getFullYear()} FinanceGet</div>
      </footer>
    </div>
  );
};

export default LandingPage;