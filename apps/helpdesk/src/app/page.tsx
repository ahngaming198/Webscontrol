import { HelpdeskLayout } from '@/components/layout/helpdesk-layout'
import { KnowledgeBase } from '@/components/knowledge-base/knowledge-base'
import { TicketSystem } from '@/components/tickets/ticket-system'

export default function HelpdeskPage() {
  return (
    <HelpdeskLayout>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Help & Support</h1>
          <p className="text-xl text-muted-foreground mt-4">
            Find answers to your questions or get help from our support team
          </p>
        </div>
        
        <KnowledgeBase />
        
        <TicketSystem />
      </div>
    </HelpdeskLayout>
  )
}
