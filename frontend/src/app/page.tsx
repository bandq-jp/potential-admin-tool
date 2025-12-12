import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    try {
      const res = await fetch('/api/backend/users/me', { cache: 'no-store' });
      const user = await res.json();
      if (user?.role === 'client') {
        redirect('/client');
      }
    } catch {
      // fall through to dashboard
    }
    redirect('/dashboard');
  } else {
    redirect('/sign-in');
  }
}
