export interface Announcement {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: 'feature' | 'update' | 'news' | 'bugfix';
  priority: 'low' | 'medium' | 'high';
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  scheduledAt?: string;
  publishedAt?: string;
  timezone: string;
  imageUrl?: string;
  linkUrl?: string;
  linkText?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnnouncementStats {
  totalAnnouncements: number;
  publishedAnnouncements: number;
  scheduledAnnouncements: number;
  draftAnnouncements: number;
  unreadCount: number;
}

export interface CreateAnnouncementData {
  title: string;
  content: string;
  type: 'feature' | 'update' | 'news' | 'bugfix';
  priority: 'low' | 'medium' | 'high';
  status: 'draft' | 'scheduled' | 'published';
  scheduledAt?: string;
  timezone: string;
  imageUrl?: string;
  linkUrl?: string;
  linkText?: string;
}

export interface Timezone {
  value: string;
  label: string;
  offset: string;
}