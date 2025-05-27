# Plingbox Chrome Extension

A Chrome extension for managing temporary email addresses and viewing received emails in a clean, modern interface - Plingbox

## Features

- Generate temporary email addresses
- Copy email addresses to clipboard
- Refresh inbox to check for new emails
- View email details (sender, subject, body preview)
- Dark mode interface
- Responsive design
- Local storage for email persistence

## Installation

### Development Installation

1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The extension will appear in your Chrome toolbar

### Production Installation

1. Download the latest release from the releases page
2. Follow the same steps as development installation

## Usage

1. Click the extension icon in your Chrome toolbar
2. Copy the generated temporary email address
3. Use it for signups or services that require email verification
4. Click "Refresh Inbox" to check for new emails
5. View received emails in the popup interface

## Development

### Project Structure

\`\`\`
plingbox-extension/
├── manifest.json          # Extension configuration
├── popup.html            # Main popup interface
├── popup.js              # Popup functionality
├── background.js         # Background service worker
├── styles.css            # Styling
├── icons/                # Extension icons
└── README.md            # This file
\`\`\`

### API Integration

To integrate with a real temporary email service:

1. Update the `simulateEmailFetch()` method in `popup.js`
2. Add the API endpoint to `host_permissions` in `manifest.json`
3. Implement proper error handling for API failures

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
\`\`\`

\`\`\`gitignore file=".gitignore"
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production builds
dist/
build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Extension specific
*.crx
*.pem
key.pem

# Logs
logs
*.log

# Temporary files
*.tmp
*.temp
