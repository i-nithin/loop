import React, { useState } from 'react';
import { Save, Calendar, Globe, Image, Link, AlertCircle, CheckCircle } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { CreateAnnouncementData } from '../../types';
import { TIMEZONES, getUserTimezone } from '../../lib/timezones';

interface CreateAnnouncementFormProps {
  onSubmit: (data: CreateAnnouncementData) => Promise<any>;
}

export const CreateAnnouncementForm: React.FC<CreateAnnouncementFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<CreateAnnouncementData>({
    title: '',
    content: '',
    type: 'feature',
    priority: 'medium',
    status: 'draft',
    timezone: getUserTimezone(),
    imageUrl: '',
    linkUrl: '',
    linkText: ''
  });

  const [publishOption, setPublishOption] = useState<'draft' | 'now' | 'scheduled'>('draft');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link'],
      ['clean']
    ],
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }

    if (!formData.content.trim() || formData.content === '<p><br></p>') {
      errors.content = 'Content is required';
    }

    if (publishOption === 'scheduled') {
      if (!scheduledDate) {
        errors.scheduledDate = 'Scheduled date is required';
      }
      if (!scheduledTime) {
        errors.scheduledTime = 'Scheduled time is required';
      }

      if (scheduledDate && scheduledTime) {
        const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
        const now = new Date();
        const minScheduleTime = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes from now

        if (scheduledDateTime <= minScheduleTime) {
          errors.scheduledDateTime = 'Scheduled time must be at least 5 minutes in the future';
        }
      }
    }

    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      errors.imageUrl = 'Please enter a valid image URL';
    }

    if (formData.linkUrl && !isValidUrl(formData.linkUrl)) {
      errors.linkUrl = 'Please enter a valid link URL';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      let status: 'draft' | 'scheduled' | 'published' = 'draft';
      let scheduledAt: string | undefined;

      if (publishOption === 'now') {
        status = 'published';
      } else if (publishOption === 'scheduled') {
        status = 'scheduled';
        scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
      }

      const submissionData: CreateAnnouncementData = {
        ...formData,
        status,
        scheduledAt
      };

      await onSubmit(submissionData);

      // Success message based on publish option
      let successMessage = 'Announcement saved as draft successfully!';
      if (publishOption === 'now') {
        successMessage = 'Announcement published successfully!';
      } else if (publishOption === 'scheduled') {
        const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
        const formattedDate = scheduledDateTime.toLocaleDateString();
        const formattedTime = scheduledDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        successMessage = `Announcement scheduled successfully for ${formattedDate} at ${formattedTime}!`;
      }

      setSuccess(successMessage);

      // Reset form
      setFormData({
        title: '',
        content: '',
        type: 'feature',
        priority: 'medium',
        status: 'draft',
        timezone: getUserTimezone(),
        imageUrl: '',
        linkUrl: '',
        linkText: ''
      });
      setPublishOption('draft');
      setScheduledDate('');
      setScheduledTime('');
      setValidationErrors({});

    } catch (err: any) {
      console.error('Error creating announcement:', err);
      setError(err.message || 'Failed to create announcement. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    const minTime = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes from now
    return {
      date: minTime.toISOString().split('T')[0],
      time: minTime.toTimeString().slice(0, 5)
    };
  };

  const minDateTime = getMinDateTime();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create New Announcement</h2>
        <p className="text-gray-600">Share updates, features, and news with your users</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-green-800">{success}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  validationErrors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter announcement title"
              />
              {validationErrors.title && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <div className={`border rounded-lg ${validationErrors.content ? 'border-red-300' : 'border-gray-300'}`}>
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                  modules={quillModules}
                  placeholder="Write your announcement content..."
                />
              </div>
              {validationErrors.content && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.content}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="feature">🎉 Feature</option>
                  <option value="update">🔄 Update</option>
                  <option value="news">📢 News</option>
                  <option value="bugfix">🐛 Bug Fix</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Publishing Options */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Publishing Options
          </h3>

          <div className="space-y-4">
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="publishOption"
                  value="draft"
                  checked={publishOption === 'draft'}
                  onChange={(e) => setPublishOption(e.target.value as any)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="font-medium text-gray-900">Save as Draft</span>
                  <p className="text-sm text-gray-500">Save for later editing and publishing</p>
                </div>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="publishOption"
                  value="now"
                  checked={publishOption === 'now'}
                  onChange={(e) => setPublishOption(e.target.value as any)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="font-medium text-gray-900">Publish Now</span>
                  <p className="text-sm text-gray-500">Make announcement visible immediately</p>
                </div>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="publishOption"
                  value="scheduled"
                  checked={publishOption === 'scheduled'}
                  onChange={(e) => setPublishOption(e.target.value as any)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="font-medium text-gray-900">Schedule for Later</span>
                  <p className="text-sm text-gray-500">Publish at a specific date and time</p>
                </div>
              </label>
            </div>

            {publishOption === 'scheduled' && (
              <div className="ml-7 space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      required
                      min={minDateTime.date}
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        validationErrors.scheduledDate ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {validationErrors.scheduledDate && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.scheduledDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time *
                    </label>
                    <input
                      type="time"
                      required
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        validationErrors.scheduledTime ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {validationErrors.scheduledTime && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.scheduledTime}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Timezone
                  </label>
                  <select
                    value={formData.timezone}
                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {TIMEZONES.map((tz) => (
                      <option key={tz.value} value={tz.value}>
                        {tz.label} ({tz.offset})
                      </option>
                    ))}
                  </select>
                </div>

                {validationErrors.scheduledDateTime && (
                  <p className="text-sm text-red-600">{validationErrors.scheduledDateTime}</p>
                )}

                <div className="text-xs text-blue-700 bg-blue-100 p-2 rounded">
                  <strong>Note:</strong> Announcements must be scheduled at least 5 minutes in the future.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Media & Links */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Media & Links (Optional)</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Image className="w-4 h-4" />
                Image URL
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  validationErrors.imageUrl ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="https://example.com/image.jpg"
              />
              {validationErrors.imageUrl && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.imageUrl}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Link className="w-4 h-4" />
                  Link URL
                </label>
                <input
                  type="url"
                  value={formData.linkUrl}
                  onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    validationErrors.linkUrl ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="https://example.com"
                />
                {validationErrors.linkUrl && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.linkUrl}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link Text
                </label>
                <input
                  type="text"
                  value={formData.linkText}
                  onChange={(e) => setFormData({ ...formData, linkText: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Learn More"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {publishOption === 'draft' ? 'Save Draft' : 
                 publishOption === 'now' ? 'Publish Now' : 'Schedule Announcement'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};