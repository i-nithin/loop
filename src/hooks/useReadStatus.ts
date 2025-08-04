import { useState, useEffect } from 'react';

export const useReadStatus = () => {
  const [readAnnouncements, setReadAnnouncements] = useState<Set<string>>(new Set());

  useEffect(() => {
    const stored = localStorage.getItem('readAnnouncements');
    if (stored) {
      setReadAnnouncements(new Set(JSON.parse(stored)));
    }
  }, []);

  const markAsRead = (id: string) => {
    const updated = new Set([...readAnnouncements, id]);
    setReadAnnouncements(updated);
    localStorage.setItem('readAnnouncements', JSON.stringify([...updated]));
  };

  const markAllAsRead = (ids: string[]) => {
    const updated = new Set([...readAnnouncements, ...ids]);
    setReadAnnouncements(updated);
    localStorage.setItem('readAnnouncements', JSON.stringify([...updated]));
  };

  const isRead = (id: string) => readAnnouncements.has(id);

  const getUnreadCount = (announcementIds: string[]) => {
    return announcementIds.filter(id => !readAnnouncements.has(id)).length;
  };

  return {
    markAsRead,
    markAllAsRead,
    isRead,
    getUnreadCount
  };
};