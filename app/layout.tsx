import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Saathi (साथी) — GenAI Co-pilot for Gig & Informal Workers',
  description: 'Multilingual GenAI assistant providing earnings audit, dispute drafting, welfare scheme access, document explanation, and safety guidance for gig and informal workers.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 min-h-screen antialiased text-slate-900">
        {children}
      </body>
    </html>
  );
}
