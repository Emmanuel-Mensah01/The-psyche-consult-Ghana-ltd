import React from 'react';
import type { Metadata, Viewport } from 'next';
import '../styles/index.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, SITE_KEYWORDS, SITE_PHONE, SITE_EMAIL } from '@/lib/site';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#312e81',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Study Abroad Consultants in Ghana | The Psyche Consult Ghana Ltd',
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  applicationName: SITE_NAME,
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_GH',
    title: 'Study Abroad Consultants in Ghana | The Psyche Consult Ghana Ltd',
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Study Abroad Consultants in Ghana | The Psyche Consult Ghana Ltd',
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      inLanguage: 'en',
    },
    {
      '@type': 'EducationalOrganization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      alternateName: 'The Psyche Consult',
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      email: SITE_EMAIL,
      telephone: SITE_PHONE,
      areaServed: { '@type': 'Country', name: 'Ghana' },
      knowsAbout: ['Study abroad', 'University admissions', 'Student visas', 'Scholarships', 'IELTS and TOEFL preparation'],
      contactPoint: [
        { '@type': 'ContactPoint', telephone: '+233547371731', contactType: 'customer service', areaServed: 'GH', availableLanguage: ['English'] },
        { '@type': 'ContactPoint', telephone: '+233503234148', contactType: 'customer service', areaServed: 'GH', availableLanguage: ['English'] },
      ],
    },
    {
      '@type': 'LocalBusiness',
      '@id': `${SITE_URL}/#accra`,
      name: `${SITE_NAME} (Accra Office)`,
      parentOrganization: { '@id': `${SITE_URL}/#organization` },
      url: SITE_URL,
      telephone: SITE_PHONE,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Flower St. Tabora No.3, Adjacent Orthodox Church',
        addressLocality: 'Accra',
        addressCountry: 'GH',
      },
    },
    {
      '@type': 'LocalBusiness',
      '@id': `${SITE_URL}/#kumasi`,
      name: `${SITE_NAME} (Kumasi Office)`,
      parentOrganization: { '@id': `${SITE_URL}/#organization` },
      url: SITE_URL,
      telephone: SITE_PHONE,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Tanoso Station, Opposite MultiCredit',
        addressLocality: 'Kumasi',
        addressCountry: 'GH',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
</head>
      <body style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
