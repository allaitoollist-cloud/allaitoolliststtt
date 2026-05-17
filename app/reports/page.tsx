import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Metadata } from 'next';
import { BarChart3, TrendingUp, Download, Lock, FileText, Zap, Users, Globe } from 'lucide-react';

export const metadata: Metadata = {
    title: 'AI Industry Reports & Trend Data | All AI Tool List',
    description: 'Data-driven reports on AI tool trends, market growth, pricing analysis and category insights. Download now.',
};

const REPORTS = [
    {
        id: 1,
        title: 'State of AI Tools 2026',
        subtitle: 'The definitive annual report on the AI tools market',
        cover: '📊',
        pages: 68,
        price: '$149',
        category: 'Annual Report',
        highlights: [
            'Top 100 AI tools by category',
            'Pricing trends analysis',
            'Market growth projections',
            'Category-wise breakdown',
            'Emerging tool categories',
        ],
        preview: ['AI tool market grew 340% in 2025', 'Writing AI is the largest category (28%)', 'Free-tier tools increased by 180%'],
        featured: true,
    },
    {
        id: 2,
        title: 'AI Tool Pricing Report Q1 2026',
        subtitle: 'How AI companies price their products and why',
        cover: '💰',
        pages: 34,
        price: '$79',
        category: 'Pricing Analysis',
        highlights: [
            'Freemium vs paid conversion rates',
            'Average MRR by category',
            'LTD (Lifetime Deal) market analysis',
            'Enterprise pricing patterns',
        ],
        preview: ['67% of new AI tools launch as Freemium', 'Average paid plan: $24/month', 'Enterprise deals up 220% YoY'],
        featured: true,
    },
    {
        id: 3,
        title: 'Generative AI Category Deep Dive',
        subtitle: 'Image, Video and Audio AI tools — market overview',
        cover: '🎨',
        pages: 42,
        price: '$99',
        category: 'Category Report',
        highlights: [
            'Image AI tool comparisons',
            'Video generation market leaders',
            'Audio AI emerging players',
            'User adoption metrics',
        ],
        preview: ['Image AI has 140+ active tools', 'Video AI growing at 5x YoY', 'Suno & Udio lead Audio AI'],
        featured: false,
    },
    {
        id: 4,
        title: 'AI Tools for SMBs — Buyer Guide',
        subtitle: 'Which AI tools actually deliver ROI for small businesses',
        cover: '🏢',
        pages: 28,
        price: '$49',
        category: 'Buyer Guide',
        highlights: [
            'Top tools by use case',
            'Budget recommendations',
            'ROI calculators included',
            'Implementation roadmap',
        ],
        preview: ['SMBs save avg 12h/week with AI', 'Top 3 categories: Writing, Design, Automation', 'Avg AI budget: $150/month'],
        featured: false,
    },
];

export default function ReportsPage() {
    return (
        <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
            <Navbar />

            {/* Hero */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-800 text-white">
                <div className="max-w-5xl mx-auto px-4 py-16 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm font-semibold mb-6">
                        <BarChart3 className="w-4 h-4" />
                        AI Industry Reports
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-4">
                        Data-Driven AI Market Intelligence
                    </h1>
                    <p className="text-xl text-emerald-100 mb-6 max-w-2xl mx-auto">
                        Deep research reports on the AI tools market. Trusted by VCs, founders, and researchers worldwide.
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center text-sm">
                        {[
                            { icon: Users, label: '2,400+ Buyers' },
                            { icon: FileText, label: '12 Reports Published' },
                            { icon: Globe, label: '45 Countries' },
                        ].map(s => (
                            <div key={s.label} className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2">
                                <s.icon className="w-4 h-4" /> {s.label}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <main className="flex-grow max-w-6xl mx-auto px-4 py-12 w-full">

                {/* Featured Reports */}
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Featured Reports</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    {REPORTS.filter(r => r.featured).map(report => (
                        <div key={report.id} className="bg-white border-2 border-emerald-200 rounded-2xl overflow-hidden hover:border-emerald-400 transition-all group">
                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 text-center border-b border-emerald-100">
                                <div className="text-5xl mb-3">{report.cover}</div>
                                <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-bold">{report.category}</span>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-black text-gray-900 mb-1 group-hover:text-emerald-700 transition-colors">{report.title}</h3>
                                <p className="text-sm text-gray-500 mb-4">{report.subtitle}</p>

                                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                                    <div className="text-xs font-bold text-gray-400 uppercase mb-2">Preview Insights</div>
                                    {report.preview.map(p => (
                                        <div key={p} className="flex items-center gap-2 text-sm text-gray-700 py-1">
                                            <TrendingUp className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> {p}
                                        </div>
                                    ))}
                                </div>

                                <div className="text-xs text-gray-400 mb-4">{report.pages} pages · PDF + Excel data</div>

                                <div className="flex items-center justify-between">
                                    <div className="text-3xl font-black text-gray-900">{report.price}</div>
                                    <a
                                        href={`mailto:hello@allaitoollist.com?subject=Report Purchase - ${report.title}`}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors"
                                    >
                                        <Download className="w-4 h-4" /> Buy Report
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* All Reports */}
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">All Reports</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
                    {REPORTS.filter(r => !r.featured).map(report => (
                        <div key={report.id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-emerald-300 transition-all group flex gap-5">
                            <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center text-3xl shrink-0 border border-gray-100">{report.cover}</div>
                            <div className="flex-1 min-w-0">
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{report.category}</span>
                                <h3 className="font-bold text-gray-900 mt-1 mb-1 group-hover:text-emerald-700 transition-colors">{report.title}</h3>
                                <p className="text-xs text-gray-500 mb-3">{report.subtitle} · {report.pages} pages</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xl font-black text-gray-900">{report.price}</span>
                                    <a
                                        href={`mailto:hello@allaitoollist.com?subject=Report Purchase - ${report.title}`}
                                        className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-800 transition-colors"
                                    >
                                        <Download className="w-3.5 h-3.5" /> Buy
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Custom Research CTA */}
                <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-3xl p-10 text-white text-center">
                    <BarChart3 className="w-10 h-10 mx-auto mb-4 opacity-80" />
                    <h2 className="text-3xl font-black mb-3">Need Custom Research?</h2>
                    <p className="text-emerald-100 mb-6 max-w-lg mx-auto">
                        VCs, enterprises and agencies hire us for bespoke AI market research. Competitive analysis, whitespace mapping, trend forecasting.
                    </p>
                    <a href="mailto:hello@allaitoollist.com?subject=Custom Research Inquiry" className="inline-flex items-center gap-2 bg-white text-emerald-700 font-bold px-8 py-3 rounded-xl hover:bg-emerald-50 transition-colors">
                        Request Custom Report →
                    </a>
                    <p className="text-xs text-emerald-200 mt-4">Starting at $1,500 · 2-week delivery</p>
                </div>
            </main>

            <Footer />
        </div>
    );
}
