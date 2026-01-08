import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "James Petry - Computational Design Portfolio",
  description: "Portfolio showcasing computational design projects and architectural innovation",
  keywords: ["computational design", "architecture", "parametric design", "portfolio", "James Petry", "urban planning", "3D modeling"],
  authors: [{ name: "James Petry" }],
  creator: "James Petry",
  openGraph: {
    title: "James Petry - Computational Design Portfolio",
    description: "Portfolio showcasing computational design projects and architectural innovation",
    type: "website",
    locale: "en_US",
    // Update with your production URL after deployment
    // url: "https://yourdomain.com",
    // images: ["/og-image.png"], // Add an Open Graph image (1200x630px recommended)
  },
  twitter: {
    card: "summary_large_image",
    title: "James Petry - Computational Design Portfolio",
    description: "Portfolio showcasing computational design projects and architectural innovation",
    // images: ["/twitter-image.png"], // Add a Twitter card image (1200x600px recommended)
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon.ico', sizes: 'any' },
    ],
    apple: '/favicon/apple-touch-icon.png',
    other: [
      {
        rel: 'manifest',
        url: '/favicon/site.webmanifest',
      },
      {
        rel: 'android-chrome-192x192',
        url: '/favicon/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        rel: 'android-chrome-512x512',
        url: '/favicon/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

