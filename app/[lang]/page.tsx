// app/[lang]/page.tsx
import { getDictionary } from '../dictionaries';
import { HomePageClient } from '@/components/HomePageClient';

type Props = {
  params: Promise<{ lang: 'en' | 'es' }>;
};

export default async function Home({ params }: Props) {
  const { lang } = await params; // Resolve the promise to access `lang`
  const dict = await getDictionary(lang);
  return <HomePageClient dict={dict} />;
}