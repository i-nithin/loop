import React, { useState, useEffect } from 'react';
import { Bell, X, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { useAnnouncements } from '../../hooks/useAnnouncements';
import { useReadStatus } from '../../hooks/useReadStatus';
import { Announcement } from '../../types';

interface WidgetConfig {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  theme?: 'light' | 'dark';
  showBadge?: boolean;
  autoOpen?: boolean;
}

interface AnnouncementWidgetProps {
  config?: WidgetConfig;
}

export const AnnouncementWidget: React.FC<AnnouncementWidgetProps> = ({
  config = {
    position: 'bottom-right',
    theme: 'light',
    showBadge: true,
    autoOpen: false
  }
}) => {
  const [isOpen, setIsOpen] = useState(config.autoOpen || false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { announcements } = useAnnouncements();
  const { markAsRead, markAllAsRead, isRead, getUnreadCount } = useReadStatus();

  const publishedAnnouncements = announcements.filter(a => a.isPublished);
  const unreadCount = getUnreadCount(publishedAnnouncements.map(a => a.id));

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4'
  };

  const themeClasses = config.theme === 'dark' 
    ? 'bg-gray-800 text-white border-gray-700'
    : 'bg-white text-gray-900 border-gray-200';

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      setTimeout(() => {
        markAllAsRead(publishedAnnouncements.map(a => a.id));
      }, 1000);
    }
  };

  const handleAnnouncementClick = (announcement: Announcement) => {
    if (!isRead(announcement.id)) {
      markAsRead(announcement.id);
    }
    if (expandedId === announcement.id) {
      setExpandedId(null);
    } else {
      setExpandedId(announcement.id);
    }
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      feature: '🎉',
      update: '🔄',
      news: '📢',
      bugfix: '🐛'
    };
    return icons[type as keyof typeof icons] || '📌';
  };

  return (
    <div className={`fixed z-50 ${positionClasses[config.position!]}`}>
      {!isOpen && (
        <button
          onClick={handleToggle}
          className={`relative p-3 rounded-full shadow-lg border transition-all hover:scale-105 ${themeClasses}`}
        >
          <Bell className="w-6 h-6" />
          {config.showBadge && unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      )}

      {isOpen && (
        <div className={`w-80 max-h-96 border rounded-lg shadow-xl overflow-hidden ${themeClasses}`}>
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              <h3 className="font-semibold">Announcements</h3>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {publishedAnnouncements.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No announcements yet
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {publishedAnnouncements.map((announcement) => {
                  const unread = !isRead(announcement.id);
                  const expanded = expandedId === announcement.id;
                  
                  return (
                    <div
                      key={announcement.id}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        unread ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => handleAnnouncementClick(announcement)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{getTypeIcon(announcement.type)}</span>
                            <h4 className="font-medium text-sm">{announcement.title}</h4>
                            {unread && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <p className={`text-xs text-gray-600 ${expanded ? '' : 'line-clamp-2'}`}>
                            {announcement.content}
                          </p>
                          {expanded && announcement.imageUrl && (
                            <img
                              src={announcement.imageUrl}
                              alt=""
                              className="w-full h-32 object-cover rounded mt-2"
                            />
                          )}
                          {expanded && announcement.link && (
                            <a
                              href={announcement.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs mt-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {announcement.linkText || 'Learn More'}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          <span className="text-xs text-gray-500">
                            {new Date(announcement.publishedAt).toLocaleDateString()}
                          </span>
                          {expanded ? (
                            <ChevronUp className="w-4 h-4 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
