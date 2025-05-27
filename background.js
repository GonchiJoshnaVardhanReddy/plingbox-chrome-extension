// Background script for Chrome extension
chrome.runtime.onInstalled.addListener(() => {
  console.log("Plingbox extension installed")
})

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  // This will open the popup automatically
})

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fetchEmails") {
    // Handle email fetching logic here
    // You can integrate with actual temp mail APIs
    sendResponse({ success: true })
  }
})

// Set up periodic email checking (optional)
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "checkEmails") {
    // Check for new emails periodically
    console.log("Checking for new emails...")
  }
})

// Create alarm for periodic checking
chrome.alarms.create("checkEmails", { periodInMinutes: 5 })
