import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://gig-kavach.raghavbhatirv.in'),
  title: 'Gig Kavach (गिग कवच) — काम में आपका भरोसेमंद सुरक्षा कवच',
  description: 'Multilingual GenAI co-pilot for gig and informal workers: earnings audit, dispute drafting, government welfare schemes, document explainer, and worker safety.',
  openGraph: {
    title: 'Gig Kavach (गिग कवच) — काम में आपका भरोसेमंद सुरक्षा कवच',
    description: 'Multilingual GenAI co-pilot for gig and informal workers: earnings audit, dispute drafting, government welfare schemes, document explainer, and worker safety.',
    url: 'https://gig-kavach.raghavbhatirv.in',
    siteName: 'Gig Kavach',
  },
  icons: {
    icon: '/favicon.ico',
  },
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
    <html lang="hi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-[#f8faf9] text-[#102a24] min-h-screen antialiased font-sans selection:bg-[#ccfbf1] selection:text-[#0f766e]">
        {children}
      </body>
    </html>
  );
}
