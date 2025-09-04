'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Globe, Database, HardDrive, Activity } from 'lucide-react'

const stats = [
  {
    name: 'Total Sites',
    value: '12',
    change: '+2',
    changeType: 'positive',
    icon: Globe,
  },
  {
    name: 'Databases',
    value: '8',
    change: '+1',
    changeType: 'positive',
    icon: Database,
  },
  {
    name: 'Backups',
    value: '24',
    change: '+5',
    changeType: 'positive',
    icon: HardDrive,
  },
  {
    name: 'Server Status',
    value: 'Online',
    change: '99.9%',
    changeType: 'positive',
    icon: Activity,
  },
]

export function DashboardOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.name}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.name}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              <span className={`inline-flex items-center ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>{' '}
              from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
