'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Database, Settings, Trash2 } from 'lucide-react'

const databases = [
  {
    id: '1',
    name: 'example_db',
    type: 'MySQL',
    size: '2.5 MB',
    users: 2,
  },
  {
    id: '2',
    name: 'blog_db',
    type: 'PostgreSQL',
    size: '1.2 MB',
    users: 1,
  },
  {
    id: '3',
    name: 'api_db',
    type: 'MySQL',
    size: '5.8 MB',
    users: 3,
  },
]

export function DatabasesList() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Databases</CardTitle>
            <CardDescription>
              Manage your databases and users
            </CardDescription>
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Database
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {databases.map((db) => (
            <div key={db.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <Database className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">{db.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {db.type} • {db.size} • {db.users} users
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{db.type}</Badge>
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
