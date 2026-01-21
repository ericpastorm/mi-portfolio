// app/[lang]/page.tsx
import { getDictionary } from '../dictionaries';
import { HomePageClient } from '@/components/HomePageClient';
import StructuredData from '@/components/StructuredData';

type Props = {
  params: Promise<{ lang: 'en' | 'es' }>;
};

export default async function Home({ params }: Props) {
  const { lang } = await params; // Resolve the promise to access `lang`
  const dict = await getDictionary(lang);
  
  return (
    <>
      <StructuredData lang={lang} />
      <HomePageClient dict={dict} />
    </>
  );
}