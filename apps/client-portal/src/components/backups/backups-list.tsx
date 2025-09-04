'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, HardDrive, Download, Trash2, Clock } from 'lucide-react'

const backups = [
  {
    id: '1',
    name: 'example.com-daily-2024-01-15',
    type: 'Site',
    size: '45.2 MB',
    status: 'completed',
    createdAt: '2 hours ago',
  },
  {
    id: '2',
    name: 'example_db-backup-2024-01-15',
    type: 'Database',
    size: '12.8 MB',
    status: 'completed',
    createdAt: '1 day ago',
  },
  {
    id: '3',
    name: 'full-backup-2024-01-14',
    type: 'Full',
    size: '2.1 GB',
    status: 'running',
    createdAt: '2 days ago',
  },
]

export function BackupsList() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Backups</CardTitle>
            <CardDescription>
              View and manage your backups
            </CardDescription>
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Backup
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {backups.map((backup) => (
            <div key={backup.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <HardDrive className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">{backup.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {backup.type} • {backup.size} • {backup.createdAt}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={backup.status === 'completed' ? 'default' : 'secondary'}>
                  {backup.status}
                </Badge>
                {backup.status === 'completed' && (
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                )}
                {backup.status === 'running' && (
                  <Button variant="ghost" size="sm">
                    <Clock className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
