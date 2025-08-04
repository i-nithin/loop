import React, { useState } from 'react';
import { Settings, Globe } from 'lucide-react';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { UserMenu } from './components/common/UserMenu';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { DemoSite } from './components/demo/DemoSite';

function App() {
  const [view, setView] = useState<'admin' | 'demo'>('admin');

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">l</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">loop</h1>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setView('admin')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      view === 'admin'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    Admin
                  </button>
                  <button
                    onClick={() => setView('demo')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      view === 'demo'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Globe className="w-4 h-4" />
                    Demo Site
                  </button>
                </div>
                <UserMenu />
              </div>
            </div>
          </div>
        </div>

        {view === 'admin' ? <AdminDashboard /> : <DemoSite />}
      </div>
    </ProtectedRoute>
  );
}

export default App;