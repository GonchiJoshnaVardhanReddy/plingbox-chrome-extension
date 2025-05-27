class TempMailExtension {
  constructor() {
    this.currentEmail = ""
    this.emails = []
    this.isLoading = false
    this.init()
  }

  init() {
    this.bindEvents()
    this.loadStoredData()
    this.generateTempEmail()
  }

  bindEvents() {
    document.getElementById("copy-btn").addEventListener("click", () => this.copyEmail())
    document.getElementById("refresh-btn").addEventListener("click", () => this.refreshEmails())
  }

  async loadStoredData() {
    try {
      const result = await chrome.storage.local.get(["tempEmail", "emails"])
      if (result.tempEmail) {
        this.currentEmail = result.tempEmail
        this.updateEmailDisplay()
      }
      if (result.emails) {
        this.emails = result.emails
        this.updateEmailList()
      }
    } catch (error) {
      console.error("Error loading stored data:", error)
    }
  }

  async saveData() {
    try {
      await chrome.storage.local.set({
        tempEmail: this.currentEmail,
        emails: this.emails,
      })
    } catch (error) {
      console.error("Error saving data:", error)
    }
  }

  generateTempEmail() {
    // Generate a random temporary email
    const domains = ["tempmail.org", "10minutemail.com", "guerrillamail.com"]
    const randomString = Math.random().toString(36).substring(2, 10)
    const randomDomain = domains[Math.floor(Math.random() * domains.length)]
    this.currentEmail = `${randomString}@${randomDomain}`
    this.updateEmailDisplay()
    this.saveData()
  }

  updateEmailDisplay() {
    document.getElementById("email-display").textContent = this.currentEmail
  }

  async copyEmail() {
    try {
      await navigator.clipboard.writeText(this.currentEmail)
      this.showToast("Email copied to Plingbox clipboard!")
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = this.currentEmail
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      this.showToast("Email copied to Plingbox clipboard!")
    }
  }

  async refreshEmails() {
    if (this.isLoading) return

    this.setLoading(true)

    try {
      // Simulate API call - replace with actual temp mail API
      await this.simulateEmailFetch()
      this.showToast("Plingbox inbox refreshed successfully!")
    } catch (error) {
      console.error("Error refreshing emails:", error)
      this.showToast("Failed to refresh Plingbox inbox", "error")
    } finally {
      this.setLoading(false)
    }
  }

  async simulateEmailFetch() {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock email data - replace with actual API integration
    const mockEmails = [
      {
        id: Date.now().toString(),
        sender: "noreply@github.com",
        subject: "Welcome to GitHub!",
        body: "Thank you for signing up. Please verify your email address to get started with GitHub.",
        timestamp: new Date().toLocaleString(),
        isRead: false,
      },
      {
        id: (Date.now() - 1000).toString(),
        sender: "support@netflix.com",
        subject: "Your Netflix verification code",
        body: "Your verification code is 123456. This code will expire in 10 minutes.",
        timestamp: new Date(Date.now() - 300000).toLocaleString(),
        isRead: true,
      },
    ]

    this.emails = mockEmails
    this.updateEmailList()
    this.saveData()
  }

  setLoading(loading) {
    this.isLoading = loading
    const refreshBtn = document.getElementById("refresh-btn")
    const refreshIcon = document.getElementById("refresh-icon")
    const refreshText = document.getElementById("refresh-text")
    const loadingState = document.getElementById("loading-state")
    const emailList = document.getElementById("email-list")
    const emptyState = document.getElementById("empty-state")

    if (loading) {
      refreshBtn.disabled = true
      refreshIcon.classList.add("animate-spin")
      refreshText.textContent = "Refreshing..."
      loadingState.classList.remove("hidden")
      emailList.classList.add("hidden")
      emptyState.classList.add("hidden")
    } else {
      refreshBtn.disabled = false
      refreshIcon.classList.remove("animate-spin")
      refreshText.textContent = "Refresh Inbox"
      loadingState.classList.add("hidden")
      this.updateEmailList()
    }
  }

  updateEmailList() {
    const emailList = document.getElementById("email-list")
    const emptyState = document.getElementById("empty-state")
    const emailCount = document.getElementById("email-count")
    const newBadge = document.getElementById("new-badge")

    emailCount.textContent = this.emails.length

    const unreadCount = this.emails.filter((email) => !email.isRead).length
    if (unreadCount > 0) {
      newBadge.textContent = `${unreadCount} new`
      newBadge.classList.remove("hidden")
    } else {
      newBadge.classList.add("hidden")
    }

    if (this.emails.length === 0) {
      emailList.classList.add("hidden")
      emptyState.classList.remove("hidden")
      return
    }

    emailList.classList.remove("hidden")
    emptyState.classList.add("hidden")

    emailList.innerHTML = this.emails
      .map(
        (email) => `
            <div class="bg-gray-800 border border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer rounded-lg ${!email.isRead ? "border-blue-500/50" : ""}" 
                 onclick="window.tempMail.markAsRead('${email.id}')">
                <div class="p-3">
                    <div class="flex items-start gap-3">
                        <div class="flex-shrink-0">
                            <div class="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                </svg>
                            </div>
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center gap-2 mb-1">
                                <p class="text-sm font-medium text-gray-200 truncate">${email.sender}</p>
                                ${!email.isRead ? '<div class="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>' : ""}
                            </div>
                            <p class="text-sm font-medium text-gray-100 mb-1 truncate">${email.subject}</p>
                            <p class="text-xs text-gray-400 mb-2 line-clamp-2">${this.truncateText(email.body, 80)}</p>
                            <div class="flex items-center gap-1 text-xs text-gray-500">
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>${email.timestamp}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `,
      )
      .join("")
  }

  markAsRead(emailId) {
    const email = this.emails.find((e) => e.id === emailId)
    if (email) {
      email.isRead = true
      this.updateEmailList()
      this.saveData()
    }
  }

  truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
  }

  showToast(message, type = "success") {
    const toast = document.getElementById("toast")
    const toastMessage = document.getElementById("toast-message")

    toastMessage.textContent = message
    toast.style.transform = "translateY(0)"

    setTimeout(() => {
      toast.style.transform = "translateY(100%)"
    }, 3000)
  }
}

// Initialize the extension when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.tempMail = new TempMailExtension()
})
