import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.VERCEL_URL as string),
  title: 'MyAlias',
  description: 'www.myalias.pro is a secure email alias generator that forwards emails to your real inbox. It allows you to create, enable, or delete aliases on demand. With myalias.pro, you can effectively manage and reduce spam by turning off aliases receiving excessive unwanted emails.',
  icons: "/favicon.ico",
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#3F51B5',
  openGraph: {
    type: 'website',
    url: 'https://myalias.pro/',
    title: 'MyAlias',
    description: 'www.myalias.pro is a secure email alias generator that forwards emails to your real inbox. It allows you to create, enable, or delete aliases on demand. With myalias.pro, you can effectively manage and reduce spam by turning off aliases receiving excessive unwanted emails.',
    siteName: "MyAlias",
    images: [{
      url: "https://myalias.pro/myalias-removebg.png",
    }],
  },
  twitter: { card: 'summary_large_image'},
  alternates: { canonical: 'https://myalias.pro/signup'}
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}