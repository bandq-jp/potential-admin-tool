import { DashboardLayout } from '@/components/layout/DashboardLayout';

// Force dynamic rendering to avoid static generation issues with Clerk
export const dynamic = 'force-dynamic';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
