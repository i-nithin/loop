import React, { useState } from 'react';
import { Copy, Check, Code, Settings } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const EmbedCodeGenerator: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();
  const [config, setConfig] = useState({
    position: 'bottom-right',
    theme: 'light',
    showBadge: true,
    autoOpen: false
  });

  const embedCode = `<!-- Announcements Widget -->
<script>
  window.AnnouncementsConfig = {
    userId: '${user?.id || 'YOUR_USER_ID'}',
    position: '${config.position}',
    theme: '${config.theme}',
    showBadge: ${config.showBadge},
    autoOpen: ${config.autoOpen}
  };
</script>
<script src="${window.location.origin}/widget.js"></script>`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Embed Code Generator</h2>
        <p className="text-gray-600">
          Copy this code and paste it into your website to display the announcements widget.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Configuration
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Position
            </label>
            <select
              value={config.position}
              onChange={(e) => setConfig({ ...config, position: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="bottom-right">Bottom Right</option>
              <option value="bottom-left">Bottom Left</option>
              <option value="top-right">Top Right</option>
              <option value="top-left">Top Left</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Theme
            </label>
            <select
              value={config.theme}
              onChange={(e) => setConfig({ ...config, theme: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="showBadge"
              checked={config.showBadge}
              onChange={(e) => setConfig({ ...config, showBadge: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="showBadge" className="ml-2 block text-sm text-gray-900">
              Show notification badge
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="autoOpen"
              checked={config.autoOpen}
              onChange={(e) => setConfig({ ...config, autoOpen: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="autoOpen" className="ml-2 block text-sm text-gray-900">
              Auto-open on page load
            </label>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-gray-500" />
            <span className="font-medium text-gray-700">Embed Code</span>
          </div>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <pre className="p-4 text-sm text-gray-800 overflow-x-auto">
          <code>{embedCode}</code>
        </pre>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Installation Instructions</h4>
        <ol className="text-sm text-blue-800 space-y-1">
          <li>0. Replace 'YOUR_USER_ID' with your actual user ID: <code className="bg-blue-100 px-1 rounded">{user?.id}</code></li>
          <li>1. Copy the embed code above</li>
          <li>2. Paste it before the closing <code>&lt;/body&gt;</code> tag on your website</li>
          <li>3. The widget will appear automatically on your site</li>
          <li>4. Customize the position and appearance using the configuration options</li>
        </ol>
      </div>
    </div>
  );
};