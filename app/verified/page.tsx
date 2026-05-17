import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Metadata } from 'next';
import { CheckCircle2, Shield, TrendingUp, Star, Code, Zap, Award, Globe } from 'lucide-react';
import { CheckoutButton } from '@/components/CheckoutButton';

export const metadata: Metadata = {
    title: 'Verified Badge Program — Boost Your AI Tool\'s Credibility | All AI Tool List',
    description: 'Get the All AI Tool List Verified Badge. Show users your tool is tested, trustworthy, and top-rated.',
};

const PLANS = [
    {
        name: 'Basic', price: '$99', period: '/year',
        color: 'border-gray-200 bg-white',
        badge: '✓ Verified',
        badgeStyle: 'bg-gray-100 text-gray-700',
        priceKey: 'verified_basic',
        features: [
            'Verified checkmark on listing',
            'Verified badge embed code',
            'Manual review & audit',
            '1 listing',
        ],
        cta: 'Get Basic',
        ctaStyle: 'bg-gray-800 hover:bg-gray-900 text-white w-full py-3 rounded-xl font-bold transition-colors',
    },
    {
        name: 'Pro', price: '$199', period: '/year',
        color: 'border-blue-400 bg-white ring-2 ring-blue-400',
        badge: '✓ Verified Pro',
        badgeStyle: 'bg-blue-100 text-blue-700',
        popular: true,
        priceKey: 'verified_pro',
        features: [
            'Everything in Basic',
            'Blue "Verified Pro" badge',
            'Priority listing placement',
            'Category page feature',
            'Monthly performance report',
        ],
        cta: 'Get Pro',
        ctaStyle: 'bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded-xl font-bold transition-colors',
    },
    {
        name: 'Enterprise', price: '$499', period: '/year',
        color: 'border-purple-300 bg-white',
        badge: '✓ Verified Enterprise',
        badgeStyle: 'bg-purple-100 text-purple-700',
        priceKey: 'verified_enterprise',
        features: [
            'Everything in Pro',
            'Gold "Enterprise" badge',
            'Homepage feature slot',
            'Blog post / case study',
            'Newsletter mention',
            'Dedicated account manager',
            'Up to 5 listings',
        ],
        cta: 'Get Enterprise',
        ctaStyle: 'bg-purple-600 hover:bg-purple-700 text-white w-full py-3 rounded-xl font-bold transition-colors',
    },
];

const BENEFITS = [
    { icon: TrendingUp, title: '40% More Clicks', desc: 'Verified tools get 40% more profile visits than non-verified competitors.' },
    { icon: Star, title: 'Higher Trust', desc: 'Users are 3x more likely to try a verified tool. The badge signals quality.' },
    { icon: Globe, title: 'SEO Boost', desc: 'Your verified listing gets rich snippets and schema markup for better Google rankings.' },
    { icon: Shield, title: 'Manual Audit', desc: 'Our team personally tests your tool. Only tools that pass get the badge.' },
];

export default function VerifiedPage() {
    const embedCode = `<a href="https://allaitoollist.com/verified" target="_blank">
  <img src="https://allaitoollist.com/badges/verified.png"
       alt="Verified on All AI Tool List"
       width="160" height="40" />
</a>`;

    return (
        <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
            <Navbar />

            {/* Hero */}
            <div className="bg-gradient-to-br from-blue-700 to-indigo-800 text-white">
                <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2 text-sm font-semibold mb-6">
                        <CheckCircle2 className="w-4 h-4 text-green-300" />
                        Verified Badge Program
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-5 leading-tight">
                        Show the World Your Tool is <span className="text-yellow-300">Trusted</span>
                    </h1>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        The All AI Tool List Verified badge tells users your tool has been manually tested, reviewed, and approved by our experts.
                    </p>

                    {/* Badge Preview */}
                    <div className="inline-flex items-center gap-3 bg-white text-blue-700 rounded-2xl px-8 py-4 text-lg font-black shadow-2xl">
                        <CheckCircle2 className="w-7 h-7 text-blue-500 fill-blue-500" />
                        Verified by All AI Tool List
                        <Award className="w-6 h-6 text-yellow-500" />
                    </div>
                </div>
            </div>

            <main className="flex-grow">

                {/* Benefits */}
                <div className="max-w-6xl mx-auto px-4 py-16">
                    <h2 className="text-center text-3xl font-black text-gray-900 mb-3">Why Get Verified?</h2>
                    <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto">Tools with our verified badge consistently outperform non-verified listings.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {BENEFITS.map(b => (
                            <div key={b.title} className="bg-white rounded-2xl border border-gray-200 p-6 text-center hover:border-blue-300 transition-colors">
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <b.icon className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">{b.title}</h3>
                                <p className="text-sm text-gray-500">{b.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pricing */}
                <div className="bg-white border-y border-gray-200 py-16">
                    <div className="max-w-5xl mx-auto px-4">
                        <h2 className="text-center text-3xl font-black text-gray-900 mb-3">Choose Your Plan</h2>
                        <p className="text-center text-gray-500 mb-12">Annual billing. Cancel anytime.</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {PLANS.map(plan => (
                                <div key={plan.name} className={`relative rounded-2xl border p-8 ${plan.color}`}>
                                    {plan.popular && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                                            Most Popular
                                        </div>
                                    )}
                                    <div className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-4 ${plan.badgeStyle}`}>
                                        {plan.badge}
                                    </div>
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
                                    <CheckoutButton
                                        priceKey={plan.priceKey}
                                        className={`block text-center ${plan.ctaStyle}`}
                                    >
                                        {plan.cta}
                                    </CheckoutButton>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Badge Embed Code */}
                <div className="max-w-3xl mx-auto px-4 py-16">
                    <h2 className="text-center text-3xl font-black text-gray-900 mb-3">Embed on Your Website</h2>
                    <p className="text-center text-gray-500 mb-8">Once verified, embed this badge anywhere on your site.</p>
                    <div className="bg-gray-900 rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-3">
                            <Code className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-400 font-mono">Embed Code</span>
                        </div>
                        <pre className="text-green-400 text-sm font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap">{embedCode}</pre>
                    </div>

                    <div className="mt-10 text-center">
                        <h3 className="font-bold text-gray-900 mb-2">How It Works</h3>
                        <div className="grid grid-cols-3 gap-4 mt-6">
                            {[
                                { step: '1', title: 'Apply', desc: 'Choose a plan and email us your tool details' },
                                { step: '2', title: 'Review', desc: 'Our team manually tests your tool (3-5 days)' },
                                { step: '3', title: 'Verified!', desc: 'Get your badge, embed code and listing upgrade' },
                            ].map(s => (
                                <div key={s.step} className="text-center">
                                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-lg mx-auto mb-3">{s.step}</div>
                                    <div className="font-bold text-gray-900 mb-1">{s.title}</div>
                                    <div className="text-xs text-gray-500">{s.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </main>
            <Footer />
        </div>
    );
}
