// options.js

// DOM Elements
const patternList = document.getElementById('patternList');
const addPatternButton = document.getElementById('addPattern');
const saveButton = document.getElementById('save');
const statusDiv = document.getElementById('status');

// Load saved patterns when the page loads
document.addEventListener('DOMContentLoaded', loadPatterns);

// Add pattern button click handler
addPatternButton.addEventListener('click', () => {
  addPatternInput();
});

// Save button click handler
saveButton.addEventListener('click', savePatterns);

function createPatternInput(value = '') {
  const div = document.createElement('div');
  div.className = 'pattern-item';
  
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'pattern-input';
  input.value = value;
  input.placeholder = 'Enter URL pattern (e.g., https://example.com/*)';
  
  const removeButton = document.createElement('button');
  removeButton.textContent = 'Remove';
  removeButton.className = 'remove';
  removeButton.onclick = () => div.remove();
  
  div.appendChild(input);
  div.appendChild(removeButton);
  
  return div;
}

function addPatternInput(value = '') {
  patternList.appendChild(createPatternInput(value));
}

function showStatus(message, isError = false) {
  statusDiv.textContent = message;
  statusDiv.style.display = 'block';
  statusDiv.className = `status ${isError ? 'error' : 'success'}`;
  setTimeout(() => {
    statusDiv.style.display = 'none';
  }, 3000);
}

async function loadPatterns() {
  const result = await chrome.storage.sync.get('urlPatterns');
  const patterns = result.urlPatterns || [];
  
  patternList.innerHTML = '';
  patterns.forEach(pattern => {
    addPatternInput(pattern);
  });
}

async function savePatterns() {
  const inputs = document.querySelectorAll('.pattern-input');
  const patterns = Array.from(inputs)
    .map(input => input.value.trim())
    .filter(pattern => pattern !== '');
  
  await chrome.storage.sync.set({ urlPatterns: patterns });
  showStatus('Patterns saved successfully!');
} 