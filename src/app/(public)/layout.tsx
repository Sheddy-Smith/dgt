import { GlobalHeader } from '@/components/layout/global-header'
import { BottomNav } from '@/components/layout/bottom-nav'
import { Toaster } from '@/components/ui/sonner'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />
      
      <main className="pb-20 md:pb-8">
        {children}
      </main>

      <BottomNav />
      
      <Toaster position="top-center" />
    </div>
  )
}
