import { Announcement } from '../types';

export const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'New Dashboard Analytics',
    content: 'We\'ve added comprehensive analytics to your dashboard. Track user engagement, conversion rates, and performance metrics all in one place.',
    type: 'feature',
    priority: 'high',
    publishedAt: '2024-01-15T10:00:00Z',
    isPublished: true,
    imageUrl: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    link: '/analytics',
    linkText: 'View Analytics'
  },
  {
    id: '2',
    title: 'Performance Improvements',
    content: 'We\'ve optimized our servers for 40% faster load times and improved overall application performance.',
    type: 'update',
    priority: 'medium',
    publishedAt: '2024-01-12T14:30:00Z',
    isPublished: true
  },
  {
    id: '3',
    title: 'Security Update',
    content: 'Enhanced security measures including two-factor authentication and improved encryption protocols.',
    type: 'update',
    priority: 'high',
    publishedAt: '2024-01-10T09:15:00Z',
    isPublished: true,
    link: '/security',
    linkText: 'Learn More'
  },
  {
    id: '4',
    title: 'Mobile App Launch',
    content: 'Our mobile app is now available on iOS and Android. Download it today for on-the-go access to all your favorite features.',
    type: 'news',
    priority: 'high',
    publishedAt: '2024-01-08T16:45:00Z',
    isPublished: true,
    imageUrl: 'https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    link: '/mobile',
    linkText: 'Download App'
  }
];