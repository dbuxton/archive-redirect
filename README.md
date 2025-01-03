# Archive Redirect Extension

A Chrome extension that helps preserve web content by automatically redirecting specified URLs to archived versions on archive.is. This helps ensure long-term access to web content that might otherwise become unavailable due to link rot, server outages, or content changes.

## Features

- Configure custom URL patterns for automatic archival
- View both archived and original versions of pages
- Easy-to-use banner for returning to original content
- Supports multiple archive.is domains for reliability
- Preserves original URLs in browser history

## Why Use Web Archives?

- Preserve important web content for future reference
- Access historical versions of web pages
- Ensure citation stability for research and documentation
- Guard against link rot and content changes
- Create reliable, permanent references to web content

## Installation

1. Clone this repository or download the source code
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory
5. The extension icon should appear in your Chrome toolbar

## Development

If you want to contribute or modify the extension:

```bash
# Install dependencies
npm install

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix
```

## Configuration

1. Click the extension icon to open the options page
2. Add URL patterns for sites you want to automatically go to archive versions of
3. Patterns support wildcards (e.g., `https://example.com/*`)

## How It Works

When you visit a URL matching your configured patterns, the extension will:
1. Redirect to the archived version on archive.is
2. Show a banner allowing you to return to the original page
3. Preserve the original URL in your browser history

## Contributing

Contributions are welcome! Please ensure you:
1. Follow the existing code style
2. Add appropriate tests
3. Update documentation as needed
4. Run linting before submitting PRs

## License

This project is licensed under the MIT License - see the LICENSE file for details.