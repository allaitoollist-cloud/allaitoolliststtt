import { Metadata } from 'next';
import WebmasterPageClient from './WebmasterPageClient';

export const metadata: Metadata = {
    title: 'Bing Webmaster API Interface | URL Indexing & Analytics Dashboard',
    description: 'Manage your website indexing with Bing Webmaster API. Submit URLs for indexing, view traffic analytics, and monitor site performance in real-time.',
    keywords: [
        'Bing Webmaster API',
        'URL indexing',
        'SEO tools',
        'website analytics',
        'Bing search console',
        'webmaster tools',
        'site indexing',
        'search engine optimization'
    ],
    openGraph: {
        title: 'Bing Webmaster API Interface',
        description: 'Professional dashboard for managing Bing Webmaster API - Submit URLs, track analytics, and optimize your search presence',
        type: 'website',
    },
};

export default function WebmasterPage() {
    return <WebmasterPageClient />;
}
