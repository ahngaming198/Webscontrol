import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { DashboardOverview } from '@/components/dashboard/overview'
import { SitesList } from '@/components/sites/sites-list'
import { DatabasesList } from '@/components/databases/databases-list'
import { BackupsList } from '@/components/backups/backups-list'

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your hosting control panel
          </p>
        </div>
        
        <DashboardOverview />
        
        <div className="grid gap-6 md:grid-cols-2">
          <SitesList />
          <DatabasesList />
        </div>
        
        <BackupsList />
      </div>
    </DashboardLayout>
  )
}
