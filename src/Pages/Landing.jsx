import React from 'react';
import { Link } from 'react-router-dom';
import {Wallet}from 'lucide-react';
import { 
  // Wallet, 
  PieChart, 
  DollarSign, 
  TrendingUp, 
  Target,
  Users,
  Goal,
  ChartNetwork ,
  MessageSquare,
  Radar,
  ChartNoAxesGantt, 
  ChevronRight,
  Menu,
  X,
  Star,
  Shield,
  Clock,
  RefreshCw
} from 'lucide-react';
const LandingPage = () => {
  const features = [
    {
      title: "Smart Budgeting",
      description: "Set and track budgets with intelligent insights and real-time updates",
      icon: <ChartNoAxesGantt className="w-6 h-6" />,
    },
    {
      title: "Expense Tracking",
      description: "Monitor your spending habits across multiple categories",
      icon:<Radar className="w-6 h-6" />,
    },
    {
      title: "Financial Reports",
      description: "Generate detailed reports and visualize your financial journey",
      icon:<ChartNetwork className="w-6 h-6" />,
    },
    {
      title: "Goal Setting",
      description: "Set financial goals and track your progress towards achieving them",
      icon:<Goal className="w-6 h-6" />,
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Freelancer",
      content: "This app has completely transformed how I manage my finances. The insights are invaluable!",
      avatar: "SJ"
    },
    {
      name: "Mike Chen",
      role: "Small Business Owner",
      content: "The budgeting features helped me optimize my business expenses significantly.",
      avatar: "MC"
    }
  ];

  const benefits = [
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Real-time Updates",
      description: "Track your finances as they happen with instant notifications"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Bank-grade Security",
      description: "Your data is protected with enterprise-level encryption"
    },
    {
      icon: <RefreshCw className="w-6 h-6" />,
      title: "Automatic Sync",
      description: "Connect your accounts for seamless transaction tracking"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <header className="pt-20 pb-32 px-4 text-center">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Take Control of Your
            <span className="text-blue-600"> Financial Future</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Smart budgeting, expense tracking, and financial insights all in one place.
            Start your journey to financial freedom today.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register" 
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Get Started Free
            </Link>
            <Link to="/login" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors">
              Sign In
            </Link>

            
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6  text-blue-600 ">
              Everything you need to manage money
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features to help you track, manage, and grow your finances
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((benefit, index) => (
              <div key={index}
                className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 hover:border-blue-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="p-3 bg-blue-50 rounded-lg w-fit mb-4 group-hover:bg-blue-100 transition-colors">
                  {React.cloneElement(benefit.icon, { className: "text-blue-600" })}
                </div>
                <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
           </div>
          
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 px-4 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold mb-2">50K+</div>
            <div className="text-blue-100">Active Users</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">$2M+</div>
            <div className="text-blue-100">Money Tracked</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">4.9/5</div>
            <div className="text-blue-100">User Rating</div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Loved by thousands of users
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="p-6 bg-white rounded-xl shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-600">{testimonial.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
        <div className="relative max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-200  transition-all duration-300">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-medium text-sm mb-4">
                Get Started Today
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to take control?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Join thousands of users who are already managing their finances smarter with FinanceGet.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" 
                className="group relative inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold overflow-hidden transition-all duration-300 hover:bg-blue-700">
                <span className="relative z-10">Start Free Trial</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
              <button className="inline-flex items-center justify-center gap-2 bg-gray-50 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                Contact Sales
              </button>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-500" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 pt-20 pb-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center">
                <Wallet className="h-8 w-8 text-blue-500" />
                <span className="ml-2 text-xl font-bold text-white">FinanceGet</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Your complete financial management solution for personal and business needs.
              </p>
              <div className="flex gap-4">
                {['twitter', 'facebook', 'linkedin', 'github'].map((social) => (
                  <a key={social} href={`#${social}`} 
                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-colors">
                    <span className="sr-only">{social}</span>
                    {/* Add social icons here */}
                  </a>
                ))}
              </div>
            </div>
            
            {/* Footer Links */}
            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Integrations", "Documentation", "API Reference"]
              },
              {
                title: "Company",
                links: ["About", "Blog", "Careers", "Press Kit", "Partners"]
              },
              {
                title: "Resources",
                links: ["Community", "Contact", "DPA", "Privacy Policy", "Terms of Service"]
              }
            ].map((section, index) => (
              <div key={index} className="space-y-6">
                <h4 className="text-white font-semibold">{section.title}</h4>
                <ul className="space-y-4">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© {new Date().getFullYear()} FinanceGet. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;