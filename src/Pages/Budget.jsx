import React, { useState } from 'react';
import { 
  DollarSign, PieChart, Plus, Edit2, Trash2, 
  AlertCircle, CheckCircle, TrendingUp, Archive,
  Coffee, Home, ShoppingBag, Smartphone, 
  Users, Book, Gift
} from 'react-feather';

import { Car } from "lucide-react";

const Budget = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Sample data - replace with your actual data
  const budgetCategories = [
    { id: 1, name: 'Food & Dining', icon: <Coffee />, budget: 15000, spent: 16000 },
    { id: 2, name: 'Housing', icon: <Home />, budget: 25000, spent: 20000 },
    { id: 3, name: 'Transportation', icon: <Car />, budget: 8000, spent: 6000 },
    { id: 4, name: 'Shopping', icon: <ShoppingBag />, budget: 10000, spent: 9500 },
    { id: 5, name: 'Entertainment', icon: <Smartphone />, budget: 5000, spent: 2500 },
    { id: 6, name: 'Family', icon: <Users />, budget: 12000, spent: 8000 },
    { id: 7, name: 'Education', icon: <Book />, budget: 7000, spent: 5000 },
    { id: 8, name: 'Gifts', icon: <Gift />, budget: 3000, spent: 1000 },
  ];

  return (
    <div className="max-w-7xl mx-auto ">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Budget Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              Track and manage your spending limits across categories
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Total Budget:</span>
            <span className="text-lg font-semibold text-gray-900">
              ₹{budgetCategories.reduce((acc, cat) => acc + cat.budget, 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-50 text-green-600 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <CheckCircle size={20} />
          <span>Budget updated successfully!</span>
          <button 
            onClick={() => setShowSuccess(false)}
            className="ml-2 p-1 hover:bg-green-100 rounded-full"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Budget Categories List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <PieChart className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Budget Categories</h2>
                </div>
                <button className="text-sm text-gray-500 hover:text-gray-700">
                  View All
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {budgetCategories.map((category) => (
                <div 
                  key={category.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-gray-100">
                        {React.cloneElement(category.icon, { 
                          size: 20,
                          className: "text-gray-600"
                        })}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{category.name}</h3>
                        <div className="mt-1 flex items-center gap-2 text-sm">
                          <span className="text-gray-500">Budget:</span>
                          <span className="font-medium text-gray-900">
                            ₹{category.budget.toLocaleString()}
                          </span>
                          <span className="text-gray-300">•</span>
                          <span className="text-gray-500">Spent:</span>
                          <span className={`font-medium ${
                            ((category.spent / category.budget)*100)>=95 ? 'text-red-600' : ((category.spent / category.budget)*100)>=80 && ((category.spent / category.budget)*100) <100? 'text-yellow-400' :'text-green-400'
                          }`}>
                            ₹{category.spent.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setSelectedCategory(category)}
                        className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          ((category.spent / category.budget)*100)>=95 ? 'bg-red-500' : ((category.spent / category.budget)*100)>=80 && ((category.spent / category.budget)*100) <100?  'bg-yellow-400' : 'bg-green-400'
                        }`}
                        style={{ 
                          width: `${Math.min((category.spent / category.budget) * 100, 100)}%`
                        }}
                      />
                    </div>
                    <div className="mt-1 flex justify-between text-xs text-gray-500">
                      <span>{((category.spent / category.budget) * 100).toFixed(0)}% used</span>
                      <span>₹{(category.budget - category.spent).toLocaleString()} remaining</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Budget Form */}
        <div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 sticky top-8">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Plus className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedCategory ? 'Edit Budget' : 'Add Budget'}
                </h2>
              </div>
            </div>

            <form className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Category Name</label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
                    placeholder="Enter category name"
                    defaultValue={selectedCategory?.name}
                  />
                  <Archive className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Budget Amount</label>
                <div className="relative">
                  <input
                    type="number"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
                    placeholder="Enter amount"
                    defaultValue={selectedCategory?.budget}
                  />
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  {selectedCategory ? (
                    <>
                      <Edit2 size={18} />
                      <span>Update Budget</span>
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      <span>Add Budget</span>
                    </>
                  )}
                </button>
                {selectedCategory && (
                  <button
                    type="button"
                    onClick={() => setSelectedCategory(null)}
                    className="flex-1 px-6 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 text-blue-600 text-sm">
                <AlertCircle size={20} />
                <p>Budget changes will take effect immediately</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Budget;