import type { Metadata } from 'next';
import { Noto_Sans_JP } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { SnackbarProvider } from '@/components/providers/SnackbarProvider';
import './globals.css';

const notoSansJP = Noto_Sans_JP({
  variable: '--font-noto-sans-jp',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'RecruitLog - ポテンシャル採用評価ログシステム',
  description: 'ポテンシャル採用の0.5次面談評価を管理するシステム',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="ja">
        <body className={`${notoSansJP.variable} antialiased`}>
          <ThemeProvider>
            <SnackbarProvider>{children}</SnackbarProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
