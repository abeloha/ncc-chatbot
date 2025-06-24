import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "NORA - NCC Online Response AI",
  description:
    "NORA - NCC Online Response AI - is an intelligent AI-powered assistant developed to provide reliable, real-time support to customers and stakeholders of the Nigerian Communications Commission. ",
  generator: "NCC",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "NORA",
    siteName: "NCC",
    url: "https://www.ncc.gov.ng/",
    description:
      "NORA - NCC Online Response AI - is an intelligent AI-powered assistant developed to provide reliable, real-time support to customers and stakeholders of the Nigerian Communications Commission. ",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NORA AI Chatbot",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NORA",
    description:
      "NORA - NCC Online Response AI - is an intelligent AI-powered assistant developed to provide reliable, real-time support to customers and stakeholders of the Nigerian Communications Commission. ",
    images: ["/og-image.jpg"],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
