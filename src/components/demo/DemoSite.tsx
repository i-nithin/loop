import React from 'react';
import { Star, Heart, Share2 } from 'lucide-react';
import { AnnouncementWidget } from '../widget/AnnouncementWidget';

export const DemoSite: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
              <h1 className="text-xl font-bold text-gray-900">Demo Site</h1>
            </div>
            <nav className="flex items-center gap-6">
              <a href="#" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Pricing</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">About</a>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Get Started
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Our Amazing Product
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            This is a demo website to showcase how the announcement widget works. 
            Look for the bell icon to see the latest updates and features!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Amazing Features</h3>
            <p className="text-gray-600">
              Discover powerful features that will transform your workflow and boost productivity.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">User Friendly</h3>
            <p className="text-gray-600">
              Built with user experience in mind, making complex tasks simple and intuitive.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Share2 className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Integration</h3>
            <p className="text-gray-600">
              Seamlessly integrate with your existing tools and workflows in minutes.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Stay Updated with Our Announcements
          </h3>
          <p className="text-gray-600 mb-6">
            We regularly ship new features, improvements, and important updates. 
            Check the announcement widget (bell icon) to stay in the loop!
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Widget Active
            </div>
            <div className="text-sm text-gray-500">
              • Position it anywhere on your site
            </div>
            <div className="text-sm text-gray-500">
              • Fully customizable appearance
            </div>
          </div>
        </div>
      </main>

      <AnnouncementWidget
        config={{
          position: 'bottom-right',
          theme: 'light',
          showBadge: true,
          autoOpen: false
        }}
      />
    </div>
  );
};