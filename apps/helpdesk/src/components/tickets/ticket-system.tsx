'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  MessageSquare, 
  Plus, 
  Clock, 
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react'
import { useState } from 'react'

const ticketStatuses = {
  open: { label: 'Open', color: 'default', icon: MessageSquare },
  'in-progress': { label: 'In Progress', color: 'secondary', icon: Clock },
  resolved: { label: 'Resolved', color: 'default', icon: CheckCircle },
  closed: { label: 'Closed', color: 'destructive', icon: XCircle },
}

const priorityLevels = {
  low: { label: 'Low', color: 'default' },
  medium: { label: 'Medium', color: 'secondary' },
  high: { label: 'High', color: 'destructive' },
  urgent: { label: 'Urgent', color: 'destructive' },
}

const sampleTickets = [
  {
    id: 'TICKET-001',
    subject: 'Website not loading properly',
    status: 'open',
    priority: 'high',
    createdAt: '2 hours ago',
    lastReply: '1 hour ago',
    replies: 3,
  },
  {
    id: 'TICKET-002',
    subject: 'SSL certificate renewal',
    status: 'in-progress',
    priority: 'medium',
    createdAt: '1 day ago',
    lastReply: '30 minutes ago',
    replies: 5,
  },
  {
    id: 'TICKET-003',
    subject: 'Database backup failed',
    status: 'resolved',
    priority: 'urgent',
    createdAt: '3 days ago',
    lastReply: '2 days ago',
    replies: 8,
  },
  {
    id: 'TICKET-004',
    subject: 'PHP version update request',
    status: 'closed',
    priority: 'low',
    createdAt: '1 week ago',
    lastReply: '1 week ago',
    replies: 2,
  },
]

export function TicketSystem() {
  const [showCreateForm, setShowCreateForm] = useState(false)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Support Tickets</h2>
          <p className="text-muted-foreground mt-2">
            Get help from our support team or track your existing tickets
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Ticket
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">4</p>
                <p className="text-sm text-muted-foreground">Total Tickets</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">2</p>
                <p className="text-sm text-muted-foreground">Open</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">1</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">1</p>
                <p className="text-sm text-muted-foreground">Resolved</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tickets */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Tickets</CardTitle>
          <CardDescription>
            Your recent support tickets and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sampleTickets.map((ticket) => {
              const status = ticketStatuses[ticket.status as keyof typeof ticketStatuses]
              const priority = priorityLevels[ticket.priority as keyof typeof priorityLevels]
              
              return (
                <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <status.icon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{ticket.subject}</div>
                      <div className="text-sm text-muted-foreground">
                        {ticket.id} • Created {ticket.createdAt} • {ticket.replies} replies
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={priority.color as any}>{priority.label}</Badge>
                    <Badge variant={status.color as any}>{status.label}</Badge>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Create Ticket Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Ticket</CardTitle>
            <CardDescription>
              Describe your issue and we'll get back to you as soon as possible
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <input
                  type="text"
                  placeholder="Brief description of your issue"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Priority</label>
                <select className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  rows={6}
                  placeholder="Please provide detailed information about your issue..."
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
                <Button>Submit Ticket</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
