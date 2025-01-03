// background.js

const ARCHIVE_DOMAINS = [
  'archive.is',
  'archive.md',
  'archive.ph',
  'archive.today'
];

// Keep track of which tabs should not redirect
const noRedirectTabs = new Set();

// Keep track of URL patterns to redirect
let urlPatterns = [];

// Load patterns from storage
async function loadPatterns() {
  const result = await chrome.storage.sync.get('urlPatterns');
  urlPatterns = result.urlPatterns || [];
}

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.urlPatterns) {
    urlPatterns = changes.urlPatterns.newValue;
  }
});

// Check if URL is from an archive domain
function isArchiveDomain(url) {
  const lowercaseUrl = url.toLowerCase();
  return ARCHIVE_DOMAINS.some(domain => lowercaseUrl.includes(domain));
}

// Clean up tab from noRedirectTabs when it's closed
chrome.tabs.onRemoved.addListener((tabId) => {
  noRedirectTabs.delete(tabId);
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'DISABLE_REDIRECT_FOR_TAB' && sender.tab) {
    noRedirectTabs.add(sender.tab.id);
    sendResponse();
  }
});

// Listen for URL changes
chrome.webRequest.onBeforeRequest.addListener(
  async function(details) {
    // Only handle main frame navigation requests
    if (details.type !== 'main_frame') {
      return { cancel: false };
    }

    // Don't redirect if this tab is marked as no-redirect
    if (noRedirectTabs.has(details.tabId)) {
      return;
    }

    const url = new URL(details.url);
    
    // Don't redirect if we're already on an archive domain
    if (isArchiveDomain(url.hostname)) {
      return { cancel: false };
    }

    // Don't proceed if no patterns are loaded
    if (!urlPatterns || urlPatterns.length === 0) {
      return { cancel: false };
    }

    // Check if URL matches any pattern
    if (!urlPatterns.some(pattern => {
      const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
      return regex.test(url.href);
    })) {
      return;
    }

    // Store the original URL with query params for the banner
    const originalUrl = url.href;
    
    // Strip query parameters for the archive URL
    url.search = '';
    
    // Randomly select an archive domain
    const archiveDomain = ARCHIVE_DOMAINS[Math.floor(Math.random() * ARCHIVE_DOMAINS.length)];
    const archiveURL = `https://${archiveDomain}/timegate/${url.href}`;

    console.log('Going to:', archiveURL);
    // Use programmatic navigation
    chrome.tabs.update(details.tabId, {url: archiveURL}, (tab) => {
      // Wait for the page to load before sending the message
      chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
        if (tabId === tab.id && changeInfo.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(listener);
          // Send message to content script
          chrome.tabs.sendMessage(tabId, {
            type: 'SHOW_BANNER',
            originalUrl: originalUrl
          });
        }
      });
    });
  },
  { urls: ['<all_urls>'] }
);

// Initial setup
loadPatterns();