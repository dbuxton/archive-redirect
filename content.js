// content.js

// Listen for the original URL from the background script
chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  if (message.type === 'SHOW_BANNER' && message.originalUrl) {
    createBanner(message.originalUrl);
  }
});

function createBanner(originalUrl) {
  const banner = document.createElement('div');
  banner.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: #f8f9fa;
    color: #1a1a1a;
    padding: 12px;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    z-index: 999999;
    cursor: pointer;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  `;
  
  banner.textContent = 'Click here to go to the original page';
  
  banner.addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'DISABLE_REDIRECT_FOR_TAB' }, () => {
      window.location.href = originalUrl;
    });
  });
  
  document.body.prepend(banner);
} 