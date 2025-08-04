import React from 'react';
import { BarChart, Users, Eye, TrendingUp, Clock, Archive } from 'lucide-react';
import { Announcement } from '../../types';

interface AnalyticsProps {
  announcements: Announcement[];
}

export const Analytics: React.FC<AnalyticsProps> = ({ announcements }) => {
  const stats = {
    total: announcements.length,
    published: announcements.filter(a => a.status === 'published').length,
    scheduled: announcements.filter(a => a.status === 'scheduled').length,
    drafts: announcements.filter(a => a.status === 'draft').length,
    archived: announcements.filter(a => a.status === 'archived').length,
    thisMonth: announcements.filter(a => {
      const date = new Date(a.createdAt);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length
  };

  const typeStats = announcements.reduce((acc, ann) => {
    acc[ann.type] = (acc[ann.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Analytics Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="flex items-center">
            <BarChart className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-600">Total Announcements</p>
              <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg">
          <div className="flex items-center">
            <Eye className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-green-600">Published</p>
              <p className="text-2xl font-bold text-green-900">{stats.published}</p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 p-6 rounded-lg">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-orange-600">Scheduled</p>
              <p className="text-2xl font-bold text-orange-900">{stats.scheduled}</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-6 rounded-lg">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-yellow-600">Drafts</p>
              <p className="text-2xl font-bold text-yellow-900">{stats.drafts}</p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 p-6 rounded-lg">
          <div className="flex items-center">
            <Archive className="w-8 h-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-red-600">Archived</p>
              <p className="text-2xl font-bold text-red-900">{stats.archived}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-purple-600">This Month</p>
              <p className="text-2xl font-bold text-purple-900">{stats.thisMonth}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Announcements by Type</h3>
        <div className="space-y-4">
          {Object.entries(typeStats).map(([type, count]) => (
            <div key={type} className="flex items-center justify-between">
              <span className="capitalize text-gray-600">{type}</span>
              <div className="flex items-center gap-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(count / stats.total) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-8">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Announcements by Status</h3>
        <div className="space-y-4">
          {[
            { status: 'published', count: stats.published, color: 'bg-green-600' },
            { status: 'scheduled', count: stats.scheduled, color: 'bg-orange-600' },
            { status: 'draft', count: stats.drafts, color: 'bg-yellow-600' },
            { status: 'archived', count: stats.archived, color: 'bg-red-600' }
          ].map(({ status, count, color }) => (
            <div key={status} className="flex items-center justify-between">
              <span className="capitalize text-gray-600">{status}</span>
              <div className="flex items-center gap-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className={`${color} h-2 rounded-full`}
                    style={{ width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-8">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};