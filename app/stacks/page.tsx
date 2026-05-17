'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { Layers, Plus, Star, Share2, Lock, Zap, Heart, ArrowRight } from 'lucide-react';

const SAMPLE_STACKS = [
    {
        id: 1,
        name: 'Ultimate Content Creator Stack',
        description: 'Everything you need to create, edit and distribute AI-powered content.',
        author: 'Sarah M.', avatar: '👩‍💻', likes: 1243,
        tools: [
            { name: 'ChatGPT', category: 'Writing', logo: '🤖', pricing: 'Freemium' },
            { name: 'Midjourney', category: 'Image', logo: '🎨', pricing: 'Paid' },
            { name: 'Descript', category: 'Video', logo: '✂️', pricing: 'Freemium' },
            { name: 'Canva AI', category: 'Design', logo: '🖌️', pricing: 'Freemium' },
        ],
        tags: ['Content', 'Marketing', 'Video'],
        featured: true,
    },
    {
        id: 2,
        name: 'AI Developer Toolkit 2026',
        description: 'The essential AI tools for every modern software developer.',
        author: 'Alex K.', avatar: '👨‍💻', likes: 892,
        tools: [
            { name: 'GitHub Copilot', category: 'Code', logo: '🐙', pricing: 'Paid' },
            { name: 'Cursor', category: 'Code', logo: '⚡', pricing: 'Freemium' },
            { name: 'Claude', category: 'Assistant', logo: '🧠', pricing: 'Freemium' },
            { name: 'Vercel AI', category: 'Deployment', logo: '▲', pricing: 'Freemium' },
        ],
        tags: ['Development', 'Code', 'Engineering'],
        featured: true,
    },
    {
        id: 3,
        name: 'SEO & Marketing Powerhouse',
        description: 'Dominate search rankings with this curated AI SEO toolkit.',
        author: 'Maria L.', avatar: '📈', likes: 567,
        tools: [
            { name: 'Surfer SEO', category: 'SEO', logo: '🏄', pricing: 'Paid' },
            { name: 'Jasper', category: 'Writing', logo: '✍️', pricing: 'Paid' },
            { name: 'Semrush AI', category: 'SEO', logo: '🔍', pricing: 'Paid' },
        ],
        tags: ['SEO', 'Marketing', 'Content'],
        featured: false,
    },
    {
        id: 4,
        name: 'Free AI Tools Stack',
        description: 'Build a powerful AI workflow without spending a dime.',
        author: 'Tom B.', avatar: '💡', likes: 2109,
        tools: [
            { name: 'ChatGPT Free', category: 'Assistant', logo: '🤖', pricing: 'Free' },
            { name: 'DALL-E 3', category: 'Image', logo: '🎨', pricing: 'Free' },
            { name: 'Notion AI', category: 'Productivity', logo: '📝', pricing: 'Freemium' },
            { name: 'Bing AI', category: 'Search', logo: '🔍', pricing: 'Free' },
        ],
        tags: ['Free', 'Budget', 'Productivity'],
        featured: false,
    },
];

const PRICING_COLORS: Record<string, string> = {
    Free: 'bg-green-100 text-green-700',
    Freemium: 'bg-blue-100 text-blue-700',
    Paid: 'bg-red-100 text-red-700',
};

export default function StacksPage() {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
            <Navbar />

            {/* Hero */}
            <div className="bg-gradient-to-br from-violet-600 to-purple-800 text-white">
                <div className="max-w-5xl mx-auto px-4 py-16 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm font-semibold mb-6">
                        <Layers className="w-4 h-4" />
                        AI Tool Stacks
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-4">
                        Build & Share Your Perfect<br />AI Workflow Stack
                    </h1>
                    <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
                        Discover curated AI tool combinations for every use case. Share yours and help the community.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-2 px-8 py-3 bg-white text-purple-700 font-bold rounded-xl hover:bg-purple-50 transition-colors"
                        >
                            <Plus className="w-4 h-4" /> Create Your Stack
                        </button>
                        <a href="#stacks" className="flex items-center gap-2 px-8 py-3 bg-purple-500 text-white font-bold rounded-xl hover:bg-purple-400 transition-colors border border-purple-400">
                            Browse Stacks
                        </a>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="grid grid-cols-3 gap-6 text-center">
                        {[
                            { label: 'Public Stacks', value: '320+' },
                            { label: 'AI Tools Tracked', value: '10k+' },
                            { label: 'Stack Saves', value: '45k+' },
                        ].map(s => (
                            <div key={s.label}>
                                <div className="text-2xl font-black text-purple-600">{s.value}</div>
                                <div className="text-sm text-gray-500">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <main className="flex-grow max-w-7xl mx-auto px-4 py-10 w-full" id="stacks">

                {/* Featured Stacks */}
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">⭐ Featured Stacks</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    {SAMPLE_STACKS.filter(s => s.featured).map(stack => (
                        <div key={stack.id} className="bg-white border-2 border-purple-200 rounded-2xl p-6 hover:border-purple-400 transition-all group cursor-pointer">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="font-black text-gray-900 text-lg group-hover:text-purple-700 transition-colors">{stack.name}</h3>
                                    <p className="text-sm text-gray-500 mt-1">{stack.description}</p>
                                </div>
                            </div>

                            <div className="flex gap-2 mb-4 flex-wrap">
                                {stack.tools.map(tool => (
                                    <div key={tool.name} className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5">
                                        <span className="text-base">{tool.logo}</span>
                                        <span className="text-xs font-semibold text-gray-700">{tool.name}</span>
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${PRICING_COLORS[tool.pricing] || 'bg-gray-100 text-gray-600'}`}>{tool.pricing}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-wrap gap-1.5 mb-4">
                                {stack.tags.map(tag => (
                                    <span key={tag} className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">{tag}</span>
                                ))}
                            </div>

                            <div className="flex items-center justify-between text-sm text-gray-500">
                                <span>{stack.avatar} by {stack.author}</span>
                                <div className="flex items-center gap-3">
                                    <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                                        <Heart className="w-4 h-4" /> {stack.likes.toLocaleString()}
                                    </button>
                                    <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                                        <Share2 className="w-4 h-4" /> Share
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* All Stacks */}
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">All Stacks</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 mb-12">
                    {SAMPLE_STACKS.filter(s => !s.featured).map(stack => (
                        <div key={stack.id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-purple-300 transition-all group cursor-pointer">
                            <h3 className="font-bold text-gray-900 mb-1 group-hover:text-purple-700 transition-colors">{stack.name}</h3>
                            <p className="text-xs text-gray-500 mb-3">{stack.description}</p>
                            <div className="flex gap-2 mb-3 flex-wrap">
                                {stack.tools.map(tool => (
                                    <div key={tool.name} className="flex items-center gap-1 bg-gray-50 rounded-lg px-2 py-1 text-xs border border-gray-100">
                                        {tool.logo} {tool.name}
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-400">
                                <span>{stack.avatar} {stack.author}</span>
                                <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {stack.likes.toLocaleString()}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pro CTA */}
                <div className="bg-gradient-to-br from-violet-600 to-purple-800 rounded-3xl p-10 text-white text-center">
                    <Zap className="w-10 h-10 mx-auto mb-4 opacity-80" />
                    <h2 className="text-3xl font-black mb-3">Go Pro — Unlimited Stacks</h2>
                    <p className="text-purple-100 mb-8 max-w-lg mx-auto">
                        Free users can save 1 stack. Upgrade to Pro for unlimited stacks, private stacks, and team sharing.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <div className="bg-white/10 border border-white/20 rounded-2xl p-6 text-left max-w-xs w-full">
                            <div className="text-base font-bold mb-1">Free</div>
                            <div className="text-3xl font-black mb-3">$0</div>
                            <ul className="text-sm text-purple-100 space-y-2 mb-4">
                                <li>✓ 1 public stack</li><li>✓ Browse all stacks</li><li>✓ Save favorites</li>
                            </ul>
                            <button onClick={() => setShowModal(true)} className="w-full py-2.5 bg-white/20 hover:bg-white/30 rounded-xl font-bold transition-colors">Create Stack</button>
                        </div>
                        <div className="bg-white rounded-2xl p-6 text-left max-w-xs w-full text-gray-900">
                            <div className="text-base font-bold mb-1 text-purple-700">Pro ⚡</div>
                            <div className="text-3xl font-black mb-3">$9<span className="text-base font-medium text-gray-500">/mo</span></div>
                            <ul className="text-sm text-gray-600 space-y-2 mb-4">
                                <li>✓ Unlimited stacks</li><li>✓ Private stacks</li><li>✓ Team sharing</li><li>✓ Analytics</li><li>✓ Featured placement</li>
                            </ul>
                            <a href="mailto:hello@allaitoollist.com?subject=Pro Stack Builder" className="block w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-center rounded-xl font-bold transition-colors">Upgrade to Pro</a>
                        </div>
                    </div>
                </div>
            </main>

            {/* Create Stack Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-black text-gray-900 mb-2">Create Your Stack</h3>
                        <p className="text-sm text-gray-500 mb-6">This feature is coming soon! Join the waitlist to be first.</p>
                        <input type="email" placeholder="your@email.com" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-3 focus:outline-none focus:border-purple-400" />
                        <button className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition-colors">Join Waitlist</button>
                        <button onClick={() => setShowModal(false)} className="w-full mt-2 text-gray-400 text-sm py-2">Cancel</button>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
