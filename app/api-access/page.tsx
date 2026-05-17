import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Metadata } from 'next';
import { Code, Zap, Database, Globe, Shield, CheckCircle2, Copy } from 'lucide-react';
import { CheckoutButton } from '@/components/CheckoutButton';

export const metadata: Metadata = {
    title: 'AI Tools API Access — Developer Plans | All AI Tool List',
    description: 'Access 10,000+ AI tools via REST API. Search, filter, get details. Build AI discovery apps with our data.',
};

const PLANS = [
    {
        name: 'Free', price: '$0', period: '/month',
        color: 'border-gray-200 bg-white',
        limits: '100 req/day',
        priceKey: null,
        features: [
            '100 API requests/day',
            'Tools search endpoint',
            'Basic tool data (name, category, pricing)',
            'JSON responses',
            'Community support',
        ],
        cta: 'Get Free Key',
        ctaStyle: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
        href: 'mailto:hello@allaitoollist.com?subject=Free API Key',
    },
    {
        name: 'Pro', price: '$29', period: '/month',
        color: 'border-blue-400 bg-white ring-2 ring-blue-400',
        limits: '10,000 req/day',
        popular: true,
        priceKey: 'api_pro',
        features: [
            '10,000 API requests/day',
            'All endpoints included',
            'Full tool data (descriptions, tags, URLs)',
            'Categories & use-cases API',
            'Trending & featured tools',
            'Email support',
        ],
        cta: 'Get Pro Key',
        ctaStyle: 'bg-blue-600 hover:bg-blue-700 text-white',
        href: null,
    },
    {
        name: 'Enterprise', price: '$199', period: '/month',
        color: 'border-purple-300 bg-white',
        limits: 'Unlimited',
        priceKey: 'api_enterprise',
        features: [
            'Unlimited API requests',
            'All Pro features',
            'Webhooks (new tools, updates)',
            'Bulk data export (CSV/JSON)',
            'White-label data usage',
            'SLA + dedicated support',
            'Custom data fields',
        ],
        cta: 'Get Enterprise',
        ctaStyle: 'bg-purple-600 hover:bg-purple-700 text-white',
        href: null,
    },
];

const ENDPOINTS = [
    { method: 'GET', path: '/api/tools', desc: 'List all tools with filters (category, pricing, search)' },
    { method: 'GET', path: '/api/tools/:slug', desc: 'Get full details for a specific tool' },
    { method: 'GET', path: '/api/categories', desc: 'List all tool categories with counts' },
    { method: 'GET', path: '/api/tools/trending', desc: 'Get currently trending AI tools' },
    { method: 'GET', path: '/api/tools/featured', desc: 'Get featured/editor-picked tools' },
    { method: 'GET', path: '/api/tools/:slug/alternatives', desc: 'Get alternatives for a specific tool' },
];

const CODE_EXAMPLE = `// Fetch AI tools by category
const res = await fetch(
  'https://allaitoollist.com/api/tools?category=Writing&pricing=Free',
  {
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    }
  }
);

const { tools } = await res.json();
console.log(tools[0]);
// { name: "ChatGPT", category: "Writing", pricing: "Freemium", ... }`;

export default function ApiAccessPage() {
    return (
        <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
            <Navbar />

            {/* Hero */}
            <div className="bg-gradient-to-br from-gray-900 to-blue-950 text-white">
                <div className="max-w-5xl mx-auto px-4 py-16 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm font-semibold mb-6 font-mono">
                        <Code className="w-4 h-4 text-blue-400" />
                        REST API · JSON · 10,000+ Tools
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-4">
                        Build with the AI Tools API
                    </h1>
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        Access our entire database of 10,000+ AI tools via clean REST API. Search, filter, discover — power your app with AI tool data.
                    </p>

                    {/* Code Preview */}
                    <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6 text-left max-w-2xl mx-auto mb-8">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-3 h-3 bg-red-500 rounded-full" />
                            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                            <div className="w-3 h-3 bg-green-500 rounded-full" />
                            <span className="text-xs text-gray-500 ml-2 font-mono">example.js</span>
                        </div>
                        <pre className="text-green-400 text-sm font-mono overflow-x-auto leading-relaxed">{CODE_EXAMPLE}</pre>
                    </div>

                    <a href="mailto:hello@allaitoollist.com?subject=Free API Key" className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-bold px-8 py-3 rounded-xl transition-colors">
                        <Zap className="w-4 h-4" /> Get Free API Key
                    </a>
                </div>
            </div>

            <main className="flex-grow">

                {/* Stats */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-6xl mx-auto px-4 py-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                            {[
                                { icon: Database, label: 'AI Tools', value: '10,000+' },
                                { icon: Globe, label: 'Categories', value: '80+' },
                                { icon: Zap, label: 'Uptime', value: '99.9%' },
                                { icon: Shield, label: 'API Keys Issued', value: '500+' },
                            ].map(s => (
                                <div key={s.label} className="flex flex-col items-center">
                                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-2">
                                        <s.icon className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="text-2xl font-black text-blue-600">{s.value}</div>
                                    <div className="text-sm text-gray-500">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Endpoints */}
                <div className="max-w-4xl mx-auto px-4 py-12">
                    <h2 className="text-2xl font-black text-gray-900 mb-2">Available Endpoints</h2>
                    <p className="text-gray-500 mb-6 text-sm">Base URL: <code className="bg-gray-100 px-2 py-0.5 rounded font-mono text-blue-700">https://allaitoollist.com</code></p>
                    <div className="space-y-2">
                        {ENDPOINTS.map(ep => (
                            <div key={ep.path} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:border-blue-300 transition-colors">
                                <span className="text-xs font-black text-green-700 bg-green-100 px-2.5 py-1 rounded-lg shrink-0 font-mono">{ep.method}</span>
                                <code className="text-sm font-mono text-blue-700 shrink-0">{ep.path}</code>
                                <span className="text-sm text-gray-500">{ep.desc}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pricing */}
                <div className="bg-white border-y border-gray-200 py-12">
                    <div className="max-w-5xl mx-auto px-4">
                        <h2 className="text-center text-3xl font-black text-gray-900 mb-3">API Pricing</h2>
                        <p className="text-center text-gray-500 mb-10">Start free, scale as you grow.</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {PLANS.map(plan => (
                                <div key={plan.name} className={`relative rounded-2xl border p-8 ${plan.color}`}>
                                    {plan.popular && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                                            Most Popular
                                        </div>
                                    )}
                                    <div className="text-xs font-mono text-gray-400 mb-2">{plan.limits}</div>
                                    <h3 className="text-xl font-black text-gray-900 mb-2">{plan.name}</h3>
                                    <div className="text-4xl font-black text-gray-900 mb-1">
                                        {plan.price}<span className="text-sm font-medium text-gray-400">{plan.period}</span>
                                    </div>
                                    <ul className="space-y-2.5 my-6 text-sm text-gray-600">
                                        {plan.features.map(f => (
                                            <li key={f} className="flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> {f}
                                            </li>
                                        ))}
                                    </ul>
                                    {plan.priceKey ? (
                                        <CheckoutButton
                                            priceKey={plan.priceKey}
                                            className={`block w-full text-center py-3 rounded-xl font-bold transition-colors ${plan.ctaStyle}`}
                                        >
                                            {plan.cta}
                                        </CheckoutButton>
                                    ) : (
                                        <a href={plan.href!} className={`block w-full text-center py-3 rounded-xl font-bold transition-colors ${plan.ctaStyle}`}>
                                            {plan.cta}
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* FAQ CTA */}
                <div className="max-w-3xl mx-auto px-4 py-12 text-center">
                    <h2 className="text-2xl font-black text-gray-900 mb-3">Questions?</h2>
                    <p className="text-gray-500 mb-6">We respond within 24 hours. Enterprise customers get a dedicated Slack channel.</p>
                    <a href="mailto:hello@allaitoollist.com?subject=API Access Question" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl transition-colors">
                        Contact Us →
                    </a>
                </div>
            </main>

            <Footer />
        </div>
    );
}
