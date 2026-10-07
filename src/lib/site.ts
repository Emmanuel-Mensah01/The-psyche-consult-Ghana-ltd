// Single source of truth for SEO. Set NEXT_PUBLIC_SITE_URL in Vercel to your real domain once it is live
// (e.g. https://thepsycheconsultgh.com) and every canonical link, the sitemap and social previews update.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://the-psyche-consult-ghana-ltd.vercel.app').replace(/\/$/, '');
export const SITE_NAME = 'The Psyche Consult Ghana Ltd';
export const SITE_DESCRIPTION =
  'Study abroad consultants in Ghana. Free guidance on university admissions, student visas, scholarships and test prep for the USA, UK, Canada, Spain, France and more. Offices in Accra and Kumasi.';
export const SITE_PHONE = '+233547371731';
export const SITE_EMAIL = 'info@thepsycheconsultgh.com';

export const SITE_KEYWORDS = [
  'study abroad consultants in Ghana',
  'study abroad agency Accra',
  'study abroad agency Kumasi',
  'educational consultancy Ghana',
  'university admission Ghana',
  'student visa consultants Ghana',
  'study in USA from Ghana',
  'study in UK from Ghana',
  'study in Canada from Ghana',
  'scholarships for Ghanaian students',
  'IELTS TOEFL GRE GMAT preparation Ghana',
  'The Psyche Consult Ghana',
];

export const staticRoutes: { path: string; priority: number; changeFrequency: 'daily' | 'weekly' | 'monthly' }[] = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/countries', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/universities', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/scholarships', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/blog', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/booking', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/about', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/ceo-travels', priority: 0.4, changeFrequency: 'monthly' },
  { path: '/careers', priority: 0.4, changeFrequency: 'monthly' },
];
