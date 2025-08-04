import React, { useState } from 'react';
import { Plus, Settings, BarChart, Code } from 'lucide-react';
import { useAnnouncements } from '../../hooks/useAnnouncements';
import { AnnouncementList } from './AnnouncementList';
import { CreateAnnouncementForm } from './CreateAnnouncementForm';
import { EmbedCodeGenerator } from './EmbedCodeGenerator';
import { Analytics } from './Analytics';

type ActiveTab = 'announcements' | 'create' | 'analytics' | 'embed';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('announcements');
  const { announcements, loading, addAnnouncement, updateAnnouncement, deleteAnnouncement } = useAnnouncements();

  const tabs = [
    { id: 'announcements' as const, label: 'Announcements', icon: Settings },
    { id: 'create' as const, label: 'Create New', icon: Plus },
    { id: 'analytics' as const, label: 'Analytics', icon: BarChart },
    { id: 'embed' as const, label: 'Embed Code', icon: Code },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'announcements':
        return (
          <AnnouncementList
            announcements={announcements}
            loading={loading}
            error={error}
            onUpdate={updateAnnouncement}
            onDelete={deleteAnnouncement}
          />
        );
      case 'create':
        return <CreateAnnouncementForm onSubmit={addAnnouncement} />;
      case 'analytics':
        return <Analytics announcements={announcements} />;
      case 'embed':
        return <EmbedCodeGenerator />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                    activeTab === id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </nav>
          </div>
          <div className="p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};