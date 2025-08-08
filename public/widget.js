// Announcements Widget SDK
(function() {
  'use strict';

  // Default configuration
  const defaultConfig = {
    position: 'bottom-right',
    theme: 'light',
    showBadge: true,
    autoOpen: false,
    apiUrl: window.location.origin
  };

  // Merge user config with defaults
  const config = Object.assign({}, defaultConfig, window.AnnouncementsConfig || {});

  // Widget HTML template
  const widgetHTML = `
    <div id="announcements-widget" class="announcements-widget" style="
      position: fixed;
      z-index: 10000;
      ${getPositionStyles(config.position)}
    ">
      <div id="widget-button" class="widget-button" style="
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: ${config.theme === 'dark' ? '#374151' : '#ffffff'};
        border: 1px solid ${config.theme === 'dark' ? '#4B5563' : '#e5e7eb'};
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        position: relative;
      ">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${config.theme === 'dark' ? '#ffffff' : '#374151'}" stroke-width="2">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
          <path d="m13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        <div id="notification-badge" class="notification-badge" style="
          position: absolute;
          top: -8px;
          right: -8px;
          width: 20px;
          height: 20px;
          background: #ef4444;
          color: white;
          border-radius: 50%;
          display: none;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        "></div>
      </div>
      
      <div id="widget-panel" class="widget-panel" style="
        width: 320px;
        max-height: 400px;
        background: ${config.theme === 'dark' ? '#1f2937' : '#ffffff'};
        border: 1px solid ${config.theme === 'dark' ? '#374151' : '#e5e7eb'};
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        display: none;
        margin-bottom: 16px;
        overflow: hidden;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      ">
        <div class="widget-header" style="
          padding: 16px;
          border-bottom: 1px solid ${config.theme === 'dark' ? '#374151' : '#e5e7eb'};
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: ${config.theme === 'dark' ? '#1f2937' : '#ffffff'};
        ">
          <div style="display: flex; align-items: center; gap: 8px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${config.theme === 'dark' ? '#ffffff' : '#374151'}" stroke-width="2">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
              <path d="m13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <h3 style="
              margin: 0;
              font-size: 16px;
              font-weight: 600;
              color: ${config.theme === 'dark' ? '#ffffff' : '#111827'};
            ">Announcements</h3>
          </div>
          <button id="close-button" style="
            background: none;
            border: none;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            color: ${config.theme === 'dark' ? '#9ca3af' : '#6b7280'};
          ">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div id="announcements-list" class="announcements-list" style="
          max-height: 320px;
          overflow-y: auto;
        ">
          <div style="
            padding: 32px 16px;
            text-align: center;
            color: ${config.theme === 'dark' ? '#9ca3af' : '#6b7280'};
          ">Loading announcements...</div>
        </div>
      </div>
    </div>
  `;

  function getPositionStyles(position) {
    const positions = {
      'bottom-right': 'bottom: 24px; right: 24px;',
      'bottom-left': 'bottom: 24px; left: 24px;',
      'top-right': 'top: 24px; right: 24px;',
      'top-left': 'top: 24px; left: 24px;'
    };
    return positions[position] || positions['bottom-right'];
  }

  function getTypeIcon(type) {
    const icons = {
      feature: '🎉',
      update: '🔄',
      news: '📢',
      bugfix: '🐛'
    };
    return icons[type] || '📌';
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
  }

  function getStoredReadStatus() {
    const stored = localStorage.getItem('announcements-read');
    return stored ? new Set(JSON.parse(stored)) : new Set();
  }

  function saveReadStatus(readSet) {
    localStorage.setItem('announcements-read', JSON.stringify([...readSet]));
  }

  function markAsRead(id) {
    const readSet = getStoredReadStatus();
    readSet.add(id);
    saveReadStatus(readSet);
    updateBadge();
  }

  function isRead(id) {
    const readSet = getStoredReadStatus();
    return readSet.has(id);
  }

  function getUnreadCount(announcements) {
    const readSet = getStoredReadStatus();
    return announcements.filter(ann => !readSet.has(ann.id)).length;
  }

  function updateBadge() {
    fetchAnnouncements().then(announcements => {
      const unreadCount = getUnreadCount(announcements);
      const badge = document.getElementById('notification-badge');
      if (badge) {
        if (config.showBadge && unreadCount > 0) {
          badge.textContent = unreadCount > 9 ? '9+' : unreadCount;
          badge.style.display = 'flex';
        } else {
          badge.style.display = 'none';
        }
      }
    });
  }

  function renderAnnouncements(announcements) {
    const list = document.getElementById('announcements-list');
    if (!list) return;

    if (announcements.length === 0) {
      list.innerHTML = `
        <div style="
          padding: 32px 16px;
          text-align: center;
          color: ${config.theme === 'dark' ? '#9ca3af' : '#6b7280'};
        ">No announcements yet</div>
      `;
      return;
    }

    list.innerHTML = announcements.map(announcement => {
      const unread = !isRead(announcement.id);
      return `
        <div class="announcement-item" data-id="${announcement.id}" style="
          padding: 16px;
          border-bottom: 1px solid ${config.theme === 'dark' ? '#374151' : '#e5e7eb'};
          cursor: pointer;
          transition: background-color 0.2s ease;
          ${unread ? `background: ${config.theme === 'dark' ? '#1e3a8a' : '#eff6ff'};` : ''}
        ">
          <div style="display: flex; align-items: flex-start; gap: 8px;">
            <span style="font-size: 18px;">${getTypeIcon(announcement.type)}</span>
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                <h4 style="
                  margin: 0;
                  font-size: 14px;
                  font-weight: 600;
                  color: ${config.theme === 'dark' ? '#ffffff' : '#111827'};
                ">${announcement.title}</h4>
                ${unread ? `<div style="width: 8px; height: 8px; background: #3b82f6; border-radius: 50%;"></div>` : ''}
              </div>
              <div style="
                margin: 0 0 8px 0;
                font-size: 13px;
                line-height: 1.4;
                color: ${config.theme === 'dark' ? '#d1d5db' : '#4b5563'};
              ">${announcement.content}</div>
              ${announcement.linkUrl ? `
                <a href="${announcement.linkUrl}" target="_blank" style="
                  font-size: 12px;
                  color: #3b82f6;
                  text-decoration: none;
                  display: inline-flex;
                  align-items: center;
                  gap: 4px;
                ">
                  ${announcement.linkText || 'Learn More'}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15,3 21,3 21,9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </a>
              ` : ''}
            </div>
            <div style="
              font-size: 11px;
              color: ${config.theme === 'dark' ? '#9ca3af' : '#6b7280'};
              white-space: nowrap;
            ">${formatDate(announcement.publishedAt || announcement.createdAt)}</div>
          </div>
        </div>
      `;
    }).join('');

    // Add click handlers
    list.querySelectorAll('.announcement-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = item.dataset.id;
        if (!isRead(id)) {
          markAsRead(id);
          item.style.background = config.theme === 'dark' ? '#1f2937' : '#ffffff';
          const badge = item.querySelector('div[style*="background: #3b82f6"]');
          if (badge) badge.remove();
        }
      });
    });
  }

  async function fetchAnnouncements() {
    try {
      const userId = config.userId;
      if (!userId) {
        console.error('User ID is required for announcements widget');
        return [];
      }

      const response = await fetch(`${config.supabaseUrl}/functions/v1/announcements`, {
        headers: {
          'x-user-id': userId,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch announcements');
      }
      const announcements = await response.json();
      return announcements;
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
      return [];
    }
  }

  function initWidget() {
    // Create widget container
    const widgetContainer = document.createElement('div');
    widgetContainer.innerHTML = widgetHTML;
    document.body.appendChild(widgetContainer.firstElementChild);

    // Get elements
    const button = document.getElementById('widget-button');
    const panel = document.getElementById('widget-panel');
    const closeButton = document.getElementById('close-button');

    let isOpen = config.autoOpen;

    function togglePanel() {
      isOpen = !isOpen;
      if (isOpen) {
        panel.style.display = 'block';
        button.style.display = 'none';
        loadAnnouncements();
      } else {
        panel.style.display = 'none';
        button.style.display = 'flex';
      }
    }

    function loadAnnouncements() {
      fetchAnnouncements().then(announcements => {
        renderAnnouncements(announcements);
        // Mark all as seen after a delay
        setTimeout(() => {
          const unreadIds = announcements.filter(a => !isRead(a.id)).map(a => a.id);
          const readSet = getStoredReadStatus();
          unreadIds.forEach(id => readSet.add(id));
          saveReadStatus(readSet);
          updateBadge();
        }, 2000);
      });
    }

    // Event listeners
    button.addEventListener('click', togglePanel);
    closeButton.addEventListener('click', togglePanel);

    // Hover effects
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'scale(1.05)';
    });
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'scale(1)';
    });

    // Initialize
    if (isOpen) {
      togglePanel();
    } else {
      updateBadge();
    }

    // Auto-update badge periodically
    setInterval(updateBadge, 30000);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }

})();