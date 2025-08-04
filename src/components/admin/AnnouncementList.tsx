import React from 'react';
import { Edit, Trash2, Eye, EyeOff, Calendar, Clock, Globe, AlertCircle } from 'lucide-react';
import { Announcement } from '../../types';
import { formatDateInTimezone } from '../../lib/timezones';

interface AnnouncementListProps {
  announcements: Announcement[];
  loading: boolean;
  error: string | null;
  onUpdate: (id: string, updates: Partial<Announcement>) => void;
  onDelete: (id: string) => void;
}

export const AnnouncementList: React.FC<AnnouncementListProps> = ({
  announcements,
  loading,
  error,
  onUpdate,
  onDelete
}) => {
  const getTypeColor = (type: string) => {
    const colors = {
      feature: 'bg-green-100 text-green-800',
      update: 'bg-blue-100 text-blue-800',
      news: 'bg-purple-100 text-purple-800',
      bugfix: 'bg-red-100 text-red-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-gray-100 text-gray-600',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-600';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-600',
      scheduled: 'bg-blue-100 text-blue-800',
      published: 'bg-green-100 text-green-800',
      archived: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-600';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-24 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">All Announcements</h2>
        <div className="text-sm text-gray-500">
          {announcements.length} total, {announcements.filter(a => a.status === 'published').length} published
        </div>
      </div>

      {announcements.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements yet</h3>
          <p className="text-gray-500">Create your first announcement to get started.</p>
        </div>
      )}

      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {announcement.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(announcement.type)}`}>
                    {announcement.type}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(announcement.priority)}`}>
                    {announcement.priority}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(announcement.status)}`}>
                    {announcement.status}
                  </span>
                </div>
                <div 
                  className="text-gray-600 mb-3 line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: announcement.content }}
                />
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(announcement.createdAt).toLocaleDateString()}
                  </div>
                  
                  {announcement.status === 'scheduled' && announcement.scheduledAt && (
                    <div className="flex items-center gap-1 text-blue-600">
                      <Clock className="w-4 h-4" />
                      <span>
                        Scheduled: {formatDateInTimezone(new Date(announcement.scheduledAt), announcement.timezone)}
                      </span>
                    </div>
                  )}
                  
                  {announcement.status === 'published' && announcement.publishedAt && (
                    <div className="flex items-center gap-1 text-green-600">
                      <Eye className="w-4 h-4" />
                      <span>
                        Published: {new Date(announcement.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    <span>{announcement.timezone}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {announcement.status === 'draft' && (
                  <button
                    onClick={() => onUpdate(announcement.id, { status: 'published' })}
                    className="px-3 py-1 rounded text-sm font-medium bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                  >
                    Publish
                  </button>
                )}
                
                {announcement.status === 'published' && (
                  <button
                    onClick={() => onUpdate(announcement.id, { status: 'archived' })}
                    className="px-3 py-1 rounded text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    Archive
                  </button>
                )}
                
                {announcement.status === 'scheduled' && (
                  <button
                    onClick={() => onUpdate(announcement.id, { status: 'published' })}
                    className="px-3 py-1 rounded text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                  >
                    Publish Now
                  </button>
                )}
                
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(announcement.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};