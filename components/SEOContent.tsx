import {
    Sparkles, CheckCircle2, ArrowRight,
    ShieldCheck, Layers, BarChart3, Zap, ChevronDown,
    MessageCircleQuestion
} from 'lucide-react';
import Link from 'next/link';

interface CategoryWithCount {
    name: string;
    count: number;
    description: string;
}

interface SEOContentProps {
    categories?: CategoryWithCount[];
}

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
    'Text & Writing':     'AI writing assistants, content generators, and grammar tools',
    'Image Generation':   'AI art generators, image editors, and design tools',
    'Video & Audio':      'Video editing, voice synthesis, and audio processing tools',
    'Code & Development': 'AI coding assistants, debugging tools, and code generators',
    'Productivity':       'Task automation, scheduling, and workflow optimization tools',
    'Marketing':          'SEO tools, social media management, and ad optimization',
    'Design':             'UI/UX design tools, prototyping, and creative AI assistants',
    'Data & Analytics':   'Data visualization, analysis, and business intelligence tools',
    'Customer Support':   'Chatbots, help desk automation, and support tools',
    'Text & Content':     'Advanced NLP tools for content strategy and creation',
};

const FAQS = [
    {
        question: 'How do we verify the AI tools in our directory?',
        answer: 'Every tool listed goes through a manual review process. We test the core functionality, verify the current pricing models, and ensure the tool is safe and actually useful for its stated category.',
    },
    {
        question: 'Can I use these AI tools for free?',
        answer: "Many tools in our directory are either 100% free or offer a Freemium model. You can use our \"Free\" filter to find tools that don't require a subscription or credit card to start.",
    },
    {
        question: 'How often is the list updated?',
        answer: 'Our team of AI researchers adds new tools and updates existing ones daily. We track product launches, model updates, and pricing shifts to keep the directory accurate.',
    },
    {
        question: 'Do you offer an API for developers?',
        answer: 'Yes! We offer a high-performance API that allows developers to integrate our verified database into their own applications. Check our API Access page for documentation.',
    },
];

export function SEOContent({ categories = [] }: SEOContentProps) {
    return (
        <div className="space-y-20">

            {/* ── Browse by Category ── */}
            {categories.length > 0 && (
                <section>
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-orange-600 font-black text-xs uppercase tracking-[0.2em]">
                                <Sparkles className="w-4 h-4" />
                                Discovery Engine
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                                Browse <span className="text-gray-400">All Categories</span>
                            </h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {categories.slice(0, 12).map((category) => (
                            <Link
                                key={category.name}
                                href={`/category/${encodeURIComponent(category.name)}`}
                                className="group relative flex flex-col p-6 rounded-[24px] bg-white border border-gray-100 hover:border-orange-200 hover:shadow-2xl hover:shadow-orange-500/8 transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-11 h-11 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-orange-500 transition-all duration-300 border border-gray-100 group-hover:border-orange-500">
                                        <Sparkles className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                                    </div>
                                    {/* Tool count — prominent */}
                                    <div className="text-right">
                                        <span className="text-[22px] font-black text-gray-900 leading-none block">
                                            {category.count}
                                        </span>
                                        <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">tools</span>
                                    </div>
                                </div>
                                <h3 className="text-[15px] font-black text-gray-900 mb-1.5 group-hover:text-orange-700 transition-colors">
                                    {category.name}
                                </h3>
                                <p className="text-[12px] text-gray-500 font-medium leading-relaxed line-clamp-2">
                                    {category.description || CATEGORY_DESCRIPTIONS[category.name] || 'Curated list of verified AI solutions.'}
                                </p>
                            </Link>
                        ))}
                    </div>

                    <div className="flex justify-center mt-10">
                        <Link
                            href="/categories"
                            className="inline-flex items-center gap-3 px-10 py-4 bg-gray-900 hover:bg-orange-500 text-white font-black rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 group text-[15px]"
                        >
                            Explore 70+ Categories
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </section>
            )}

            {/* ── Trust & Stats Section ── */}
            <section>
                <div className="bg-gray-900 rounded-[40px] p-8 md:p-14 relative overflow-hidden ring-1 ring-white/10">
                    <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-orange-500/10 rounded-full blur-[80px] -translate-y-1/3 translate-x-1/3 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-amber-400/5 rounded-full blur-[60px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

                    <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left: copy */}
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 text-orange-400 font-black text-xs uppercase tracking-[0.2em]">
                                    <ShieldCheck className="w-4 h-4" />
                                    The All AI Standard
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                                    Trusted by <span className="text-orange-400">Industry Experts</span>
                                </h2>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <div className="w-11 h-11 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                                        <CheckCircle2 className="w-5 h-5 text-orange-400" />
                                    </div>
                                    <h4 className="text-[16px] font-black text-white">Verified Listings</h4>
                                    <p className="text-[13px] text-gray-400 font-medium leading-relaxed">
                                        Every tool is audited for safety, accuracy, and utility before listing.
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <div className="w-11 h-11 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                                        <Sparkles className="w-5 h-5 text-orange-400" />
                                    </div>
                                    <h4 className="text-[16px] font-black text-white">Intent Focused</h4>
                                    <p className="text-[13px] text-gray-400 font-medium leading-relaxed">
                                        Grouped by intent — find solutions for your specific workflow faster.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right: stats */}
                        <div className="bg-white/5 backdrop-blur-sm rounded-[32px] p-8 border border-white/10">
                            <div className="grid grid-cols-2 gap-6">
                                {[
                                    { value: '5,375+', label: 'Verified Tools', icon: Layers },
                                    { value: '71',     label: 'Categories',    icon: BarChart3 },
                                    { value: 'Daily',  label: 'Updates',       icon: Zap },
                                    { value: '100%',   label: 'Accuracy',      icon: ShieldCheck },
                                ].map((stat) => (
                                    <div key={stat.label} className="flex flex-col gap-3">
                                        <div className="w-10 h-10 bg-orange-500/15 rounded-xl flex items-center justify-center border border-orange-500/20">
                                            <stat.icon className="w-5 h-5 text-orange-400" />
                                        </div>
                                        <div>
                                            <div className="text-[32px] font-black text-white leading-none">{stat.value}</div>
                                            <div className="text-[11px] font-black text-gray-500 uppercase tracking-widest mt-1">{stat.label}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FAQ Section ── */}
            <section>
                <div className="grid lg:grid-cols-[1fr_2fr] gap-16 items-start">

                    {/* Left sticky */}
                    <div className="lg:sticky lg:top-32 space-y-6 bg-orange-50 rounded-[32px] p-8 border border-orange-100">
                        <div className="flex items-center gap-2 text-orange-600 font-black text-xs uppercase tracking-[0.2em]">
                            <MessageCircleQuestion className="w-5 h-5" />
                            Help Center
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 leading-tight">
                            Common<br /><span className="text-gray-400">Questions</span>
                        </h2>
                        <p className="text-[15px] text-gray-600 font-medium leading-relaxed">
                            Need more help? Our team is ready to guide you through the AI landscape.
                        </p>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-orange-500 text-white font-black text-[14px] hover:bg-orange-600 transition-all shadow-md shadow-orange-200 group"
                        >
                            Contact Support
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* FAQ Accordion */}
                    <div className="space-y-3">
                        {FAQS.map((faq, index) => (
                            <details
                                key={index}
                                className="group bg-white border-2 border-gray-100 hover:border-orange-200 rounded-[24px] overflow-hidden transition-all duration-200 open:border-orange-200 open:shadow-lg open:shadow-orange-500/5"
                            >
                                <summary className="cursor-pointer px-7 py-5 font-black text-[16px] text-gray-800 flex items-center justify-between gap-4 hover:bg-orange-50/50 open:bg-orange-50/50 transition-colors list-none select-none">
                                    <div className="flex items-center gap-4">
                                        <span className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-[12px] font-black shrink-0 group-open:bg-orange-500 group-open:text-white transition-all">
                                            {index + 1}
                                        </span>
                                        <span>{faq.question}</span>
                                    </div>
                                    <div className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 group-open:bg-orange-500 group-open:text-white group-open:border-orange-500 transition-all shrink-0">
                                        <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform duration-300" />
                                    </div>
                                </summary>
                                <div className="px-7 pb-6 pt-2 text-[15px] text-gray-600 font-medium leading-relaxed border-t border-orange-100">
                                    <div className="pl-11">
                                        {faq.answer}
                                    </div>
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
