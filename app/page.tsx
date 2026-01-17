import { supabase } from '@/lib/supabase';
import HomeClient from '@/components/HomeClient';
import { dbToolToTool } from '@/types';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

// SEO Metadata
export const metadata: Metadata = {
  title: 'AI Tool List - Discover 1000+ Best AI Tools & Software Directory 2024',
  description: 'Explore the ultimate directory of 1000+ AI tools for writing, coding, design, marketing & more. Compare features, pricing & reviews. Find your perfect AI tool today!',
  keywords: [
    'AI tools',
    'artificial intelligence tools',
    'AI software directory',
    'best AI tools 2024',
    'AI writing tools',
    'AI image generators',
    'AI coding assistants',
    'ChatGPT alternatives',
    'AI productivity tools',
    'free AI tools',
    'AI tool comparison',
    'machine learning tools',
    'AI marketing tools',
    'AI design tools',
    'AI video editors'
  ],
  authors: [{ name: 'AI Tool List Team' }],
  creator: 'AI Tool List',
  publisher: 'AI Tool List',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://allaitoollist.com',
    title: 'AI Tool List - Discover 1000+ Best AI Tools & Software',
    description: 'The ultimate directory of AI-powered tools. Find, compare and choose the best AI tools for your needs. Updated daily with new tools and reviews.',
    siteName: 'All AI Tool List',
    images: [
      {
        url: 'https://allaitoollist.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Tool List - Best AI Tools Directory',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Tool List - Discover 1000+ Best AI Tools',
    description: 'Find, compare and choose the best AI tools. Updated daily with new tools, reviews and comparisons.',
    images: ['https://allaitoollist.com/twitter-image.jpg'],
    creator: '@allaitoollist',
  },
  alternates: {
    canonical: 'https://allaitoollist.com',
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
};

export default async function Home() {
  // Fetch all tools (is_draft column may not exist, so we fetch all)
  const { data: allDbTools, error: allError } = await supabase
    .from('tools')
    .select('*')
    .order('created_at', { ascending: false });

  if (allError) {
    console.error('Error fetching all tools:', allError);
  }

  // Since is_draft column doesn't exist, show all tools
  const tools = (allDbTools || []).map(dbToolToTool);

  // Log for debugging
  if (process.env.NODE_ENV === 'development') {
    console.log(`Homepage: Found ${tools.length} tools`);
  }

  // Calculate category counts
  const categoryCounts: Record<string, number> = {};
  tools.forEach(tool => {
    const cat = tool.category;
    if (cat) {
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    }
  });

  // Create categories array with counts and descriptions
  const categoryDescriptions: Record<string, string> = {
    'Text & Writing': 'AI writing assistants, content generators, and grammar tools',
    'Image Generation': 'AI art generators, image editors, and design tools',
    'Video & Audio': 'Video editing, voice synthesis, and audio processing tools',
    'Code & Development': 'AI coding assistants, debugging tools, and code generators',
    'Productivity': 'Task automation, scheduling, and workflow optimization tools',
    'Marketing': 'SEO tools, social media management, and ad optimization',
    'Design': 'UI/UX design tools, prototyping, and creative AI assistants',
    'Data & Analytics': 'Data visualization, analysis, and business intelligence tools',
    'Customer Support': 'Chatbots, help desk automation, and support tools',
    'Sales': 'Lead generation, CRM automation, and sales enablement tools',
  };

  const categories = Object.entries(categoryCounts)
    .map(([name, count]) => ({
      name,
      count,
      description: categoryDescriptions[name] || 'Discover amazing AI tools in this category',
    }))
    .sort((a, b) => b.count - a.count) // Sort by count descending
    .slice(0, 9); // Show top 9 categories

  // JSON-LD Schema Markup for SEO
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'All AI Tool List',
    url: 'https://allaitoollist.com',
    logo: 'https://allaitoollist.com/logo.png',
    description: 'The ultimate directory of AI-powered tools and software',
    sameAs: [
      'https://twitter.com/allaitoollist',
      'https://facebook.com/allaitoollist',
      'https://linkedin.com/company/allaitoollist',
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'All AI Tool List',
    url: 'https://allaitoollist.com',
    description: 'Discover and compare 1000+ AI tools across all categories',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://allaitoollist.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'AI Tools Directory',
    description: 'Comprehensive list of AI-powered tools and software',
    numberOfItems: tools.length,
    itemListElement: tools.slice(0, 10).map((tool, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'SoftwareApplication',
        name: tool.name,
        description: tool.shortDescription,
        applicationCategory: tool.category,
        offers: {
          '@type': 'Offer',
          price: tool.pricing === 'Free' ? '0' : undefined,
          priceCurrency: 'USD',
        },
      },
    })),
  };

  return (
    <>
      {/* JSON-LD Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <HomeClient initialTools={tools} categories={categories} />
    </>
  );
}
