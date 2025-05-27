"use client"

import { useState, useEffect } from "react"
import { Copy, RefreshCw, Mail, Clock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"

interface Email {
  id: string
  sender: string
  subject: string
  body: string
  timestamp: string
  isRead: boolean
}

const mockEmails: Email[] = [
  {
    id: "1",
    sender: "noreply@github.com",
    subject: "Welcome to GitHub!",
    body: "Thank you for signing up. Please verify your email address to get started with GitHub.",
    timestamp: "2 min ago",
    isRead: false,
  },
  {
    id: "2",
    sender: "support@netflix.com",
    subject: "Your Netflix verification code",
    body: "Your verification code is 123456. This code will expire in 10 minutes.",
    timestamp: "5 min ago",
    isRead: true,
  },
  {
    id: "3",
    sender: "no-reply@amazon.com",
    subject: "Confirm your Amazon account",
    body: "Please click the link below to confirm your Amazon account and complete your registration.",
    timestamp: "12 min ago",
    isRead: true,
  },
]

export default function TempMailPopup() {
  const [emails, setEmails] = useState<Email[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [tempEmail] = useState("user123@tempmail.com")
  const { toast } = useToast()

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(tempEmail)
      toast({
        title: "Copied!",
        description: "Email address copied to clipboard",
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the email manually",
        variant: "destructive",
      })
    }
  }

  const refreshEmails = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setEmails(mockEmails)
      setIsLoading(false)
      toast({
        title: "Refreshed",
        description: "Inbox updated successfully",
      })
    }, 1500)
  }

  useEffect(() => {
    // Load emails on mount
    refreshEmails()
  }, [])

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
  }

  return (
    <div className="w-[400px] h-[600px] bg-gray-900 text-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-blue-400" />
          <h1 className="text-lg font-semibold">TempMail Notifier</h1>
        </div>
      </header>

      <main className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
        {/* Temporary Email Card */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-300">Your Temporary Email</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-700 rounded-md px-3 py-2 text-sm font-mono">{tempEmail}</div>
              <Button
                size="sm"
                variant="outline"
                onClick={copyToClipboard}
                className="bg-gray-700 border-gray-600 hover:bg-gray-600 text-gray-100"
                aria-label="Copy email address"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Refresh Button */}
        <Button
          onClick={refreshEmails}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          aria-label="Refresh inbox"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Refreshing..." : "Refresh Inbox"}
        </Button>

        {/* Inbox Section */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-gray-300">Inbox ({emails.length})</h2>
            {emails.some((email) => !email.isRead) && (
              <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                {emails.filter((email) => !email.isRead).length} new
              </span>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex-1 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-400 border-t-transparent"></div>
                <p className="text-sm text-gray-400">Loading emails...</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && emails.length === 0 && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Mail className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No new mails yet</p>
                <p className="text-gray-500 text-xs mt-1">Emails will appear here when received</p>
              </div>
            </div>
          )}

          {/* Email List */}
          {!isLoading && emails.length > 0 && (
            <ScrollArea className="flex-1">
              <div className="space-y-3">
                {emails.map((email, index) => (
                  <Card
                    key={email.id}
                    className={`bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer ${
                      !email.isRead ? "border-blue-500/50" : ""
                    }`}
                    role="button"
                    tabIndex={0}
                    aria-label={`Email from ${email.sender}: ${email.subject}`}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-medium text-gray-200 truncate">{email.sender}</p>
                            {!email.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>}
                          </div>
                          <p className="text-sm font-medium text-gray-100 mb-1 truncate">{email.subject}</p>
                          <p className="text-xs text-gray-400 mb-2 line-clamp-2">{truncateText(email.body, 80)}</p>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{email.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </main>
    </div>
  )
}
