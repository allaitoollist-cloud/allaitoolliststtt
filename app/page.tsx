import { supabase } from '@/lib/supabase';
import HomeClient from '@/components/HomeClient';
import { dbToolToTool } from '@/types';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

// SEO Metadata
export const metadata: Metadata = {
  title: 'AI Tool List 2026: The Architecture of Intent & Best AI Tools Directory',
  description: 'Explore the ultimate AEO-optimized database of AI tools. Structured by informational intent and topical clusters for marketing, writing, coding, and business growth.',
  keywords: [
    'architecture of intent',
    'AEO optimized AI tools',
    'GEO SEO strategy 2026',
    'best AI tools for marketing',
    'topical knowledge clusters',
    'AI writing tools list',
    'AI software directory',
    'informational intent AI',
    'best AI software for business',
    'submit AI tool listing'
  ],
  authors: [{ name: 'AI Tool List Team' }],
  creator: 'AI Tool List',
  publisher: 'AI Tool List',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://allaitoollist.com',
    title: 'AI Tool List 2026: The Best AI Tools Directory & Comparison',
    description: 'Explore 2500+ AI tools. Compare features, pricing, and reviews. The most comprehensive AI software database for professionals.',
    siteName: 'All AI Tool List',
    images: [
      {
        url: 'https://allaitoollist.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Tool List - Best AI Tools Directory 2026',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Tool List 2026: Discover & Compare Best AI Tools',
    description: 'Find the best AI software for your workflow. Updated daily with new listings and honest reviews.',
    images: ['https://allaitoollist.com/twitter-image.jpg'],
    creator: '@allaitoollist',
  },
  alternates: {
    canonical: 'https://allaitoollist.com',
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
    "knowsAbout": [
      "Artificial Intelligence",
      "Generative AI",
      "AEO (Answer Engine Optimization)",
      "GEO (Generative Engine Optimization)",
      "Digital Marketing",
      "Software Reviews"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "contact@allaitoollist.com"
    }
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
    itemListElement: tools.slice(0, 15).map((tool, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'SoftwareApplication',
        name: tool.name,
        description: tool.shortDescription,
        applicationCategory: tool.category,
        operatingSystem: "Web, Windows, macOS, iOS, Android",
        author: {
          "@type": "Organization",
          "name": "All AI Tool List Verified"
        },
        offers: {
          '@type': 'Offer',
          price: tool.pricing === 'Free' ? '0' : undefined,
          priceCurrency: 'USD',
          availability: "https://schema.org/InStock"
        },
        ...(tool.rating && {
          aggregateRating: {
            "@type": "AggregateRating",
            "ratingValue": tool.rating,
            "reviewCount": tool.reviewCount || 0
          }
        })
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What are the best free AI tools for marketing in 2026?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The best free AI tools for marketing in 2026 include powerful writing assistants for SEO, automated social media managers, and AI analytics platforms with verified free tiers."
                }
              },
              {
                "@type": "Question",
                "name": "What is AEO and GEO in the context of AI tools?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "AEO (Answer Engine Optimization) and GEO (Generative Engine Optimization) are strategies to ensure your AI tool or content is easily synthesized by AI models like ChatGPT, Gemini, and Claude."
                }
              }
            ]
          })
        }}
      />

      <HomeClient initialTools={tools} categories={categories} />
    </>
  );
}
