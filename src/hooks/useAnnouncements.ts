import { useState, useEffect } from 'react';
import { Announcement, CreateAnnouncementData } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export const useAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchAnnouncements();
    }
  }, [user]);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      const transformedData: Announcement[] = data?.map(item => ({
        id: item.id,
        userId: item.user_id,
        title: item.title,
        content: item.content,
        type: item.type,
        priority: item.priority,
        status: item.status,
        scheduledAt: item.scheduled_at,
        publishedAt: item.published_at,
        timezone: item.timezone,
        imageUrl: item.image_url,
        linkUrl: item.link_url,
        linkText: item.link_text,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      })) || [];

      setAnnouncements(transformedData);
    } catch (err) {
      console.error('Error fetching announcements:', err);
      setError('Failed to load announcements. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addAnnouncement = async (announcementData: CreateAnnouncementData) => {
    try {
      setError(null);
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error: insertError } = await supabase
        .from('announcements')
        .insert([{
          user_id: user.id,
          title: announcementData.title,
          content: announcementData.content,
          type: announcementData.type,
          priority: announcementData.priority,
          status: announcementData.status,
          scheduled_at: announcementData.scheduledAt || null,
          timezone: announcementData.timezone,
          image_url: announcementData.imageUrl || null,
          link_url: announcementData.linkUrl || null,
          link_text: announcementData.linkText || null,
          published_at: announcementData.status === 'published' ? new Date().toISOString() : null
        }])
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      const newAnnouncement: Announcement = {
        id: data.id,
        userId: data.user_id,
        title: data.title,
        content: data.content,
        type: data.type,
        priority: data.priority,
        status: data.status,
        scheduledAt: data.scheduled_at,
        publishedAt: data.published_at,
        timezone: data.timezone,
        imageUrl: data.image_url,
        linkUrl: data.link_url,
        linkText: data.link_text,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };

      setAnnouncements(prev => [newAnnouncement, ...prev]);
      return newAnnouncement;
    } catch (err) {
      console.error('Error creating announcement:', err);
      setError('Failed to create announcement. Please try again.');
      throw err;
    }
  };

  const updateAnnouncement = async (id: string, updates: Partial<Announcement>) => {
    try {
      setError(null);
      
      const updateData: any = {};
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.content !== undefined) updateData.content = updates.content;
      if (updates.type !== undefined) updateData.type = updates.type;
      if (updates.priority !== undefined) updateData.priority = updates.priority;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.scheduledAt !== undefined) updateData.scheduled_at = updates.scheduledAt;
      if (updates.timezone !== undefined) updateData.timezone = updates.timezone;
      if (updates.imageUrl !== undefined) updateData.image_url = updates.imageUrl;
      if (updates.linkUrl !== undefined) updateData.link_url = updates.linkUrl;
      if (updates.linkText !== undefined) updateData.link_text = updates.linkText;
      
      // Handle status changes
      if (updates.status === 'published' && !updates.publishedAt) {
        updateData.published_at = new Date().toISOString();
      }

      const { data, error: updateError } = await supabase
        .from('announcements')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      const updatedAnnouncement: Announcement = {
        id: data.id,
        userId: data.user_id,
        title: data.title,
        content: data.content,
        type: data.type,
        priority: data.priority,
        status: data.status,
        scheduledAt: data.scheduled_at,
        publishedAt: data.published_at,
        timezone: data.timezone,
        imageUrl: data.image_url,
        linkUrl: data.link_url,
        linkText: data.link_text,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };

      setAnnouncements(prev => 
        prev.map(ann => ann.id === id ? updatedAnnouncement : ann)
      );
      
      return updatedAnnouncement;
    } catch (err) {
      console.error('Error updating announcement:', err);
      setError('Failed to update announcement. Please try again.');
      throw err;
    }
  };

  const deleteAnnouncement = async (id: string) => {
    try {
      setError(null);
      
      const { error: deleteError } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      setAnnouncements(prev => prev.filter(ann => ann.id !== id));
    } catch (err) {
      console.error('Error deleting announcement:', err);
      setError('Failed to delete announcement. Please try again.');
      throw err;
    }
  };

  return {
    announcements,
    loading,
    error,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    refetch: fetchAnnouncements
  };
};