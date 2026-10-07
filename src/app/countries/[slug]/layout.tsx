import type { Metadata } from 'next';
import { countryInfo } from '@/lib/countryInfo';
import { pageMeta } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const info = countryInfo[slug];
  if (!info) {
    const name = slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return pageMeta({
      title: `Study in ${name} from Ghana`,
      description: `Study in ${name}: partner universities, admission requirements, student visa guidance and costs for Ghanaian students, with free counselling from The Psyche Consult Ghana.`,
      path: `/countries/${slug}`,
    });
  }
  return pageMeta({
    title: `Study in ${info.name} from Ghana: Universities, Visa & Costs`,
    description: `${info.tagline} Explore partner universities, costs, admission requirements and the student visa process, with free guidance for Ghanaian students.`,
    path: `/countries/${slug}`,
    keywords: [`study in ${info.name} from Ghana`, `${info.name} student visa Ghana`, `${info.name} universities for Ghanaian students`, `${info.name} scholarships`],
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
