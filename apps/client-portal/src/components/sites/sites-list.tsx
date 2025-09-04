'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Globe, Settings, Trash2 } from 'lucide-react'

const sites = [
  {
    id: '1',
    domain: 'example.com',
    status: 'active',
    ssl: true,
    phpVersion: '8.1',
    lastBackup: '2 hours ago',
  },
  {
    id: '2',
    domain: 'blog.example.com',
    status: 'active',
    ssl: false,
    phpVersion: '8.0',
    lastBackup: '1 day ago',
  },
  {
    id: '3',
    domain: 'api.example.com',
    status: 'inactive',
    ssl: true,
    phpVersion: '8.2',
    lastBackup: '3 days ago',
  },
]

export function SitesList() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Sites</CardTitle>
            <CardDescription>
              Manage your websites and domains
            </CardDescription>
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Site
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sites.map((site) => (
            <div key={site.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">{site.domain}</div>
                  <div className="text-sm text-muted-foreground">
                    PHP {site.phpVersion} • Last backup: {site.lastBackup}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={site.status === 'active' ? 'default' : 'secondary'}>
                  {site.status}
                </Badge>
                {site.ssl && (
                  <Badge variant="outline">SSL</Badge>
                )}
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
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
