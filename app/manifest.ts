import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'All AI Tool List',
        short_name: 'AI Tool List',
        description: 'Discover the best AI tools — 2,000+ tools reviewed and categorized.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#2563eb',
        orientation: 'portrait',
        icons: [
            {
                src: '/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
        ],
        categories: ['productivity', 'utilities', 'reference'],
        shortcuts: [
            {
                name: 'Browse AI Tools',
                url: '/',
                description: 'Explore all AI tools',
            },
            {
                name: 'Submit a Tool',
                url: '/submit',
                description: 'Add your AI tool to the directory',
            },
            {
                name: 'AI Categories',
                url: '/categories',
                description: 'Browse by category',
            },
        ],
    };
}
