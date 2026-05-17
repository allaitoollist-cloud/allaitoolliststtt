import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Clock, DollarSign, Briefcase, ExternalLink, Sparkles, Building2, Zap } from 'lucide-react';
import { CheckoutButton } from '@/components/CheckoutButton';

export const metadata: Metadata = {
    title: 'AI Jobs Board — Find & Post AI Roles | All AI Tool List',
    description: 'Browse hundreds of AI, ML, and tech jobs. Post your AI job opening and reach thousands of AI professionals.',
};

const SAMPLE_JOBS = [
    { id: 1, title: 'AI Product Manager', company: 'OpenAI', location: 'San Francisco, CA', type: 'Full-time', salary: '$150k–$220k', category: 'Product', remote: true, logo: '🤖', featured: true, posted: '2 days ago' },
    { id: 2, title: 'Machine Learning Engineer', company: 'Anthropic', location: 'Remote', type: 'Full-time', salary: '$180k–$280k', category: 'Engineering', remote: true, logo: '🧠', featured: true, posted: '3 days ago' },
    { id: 3, title: 'AI Prompt Engineer', company: 'Midjourney', location: 'Remote', type: 'Full-time', salary: '$90k–$140k', category: 'Engineering', remote: true, logo: '🎨', featured: false, posted: '5 days ago' },
    { id: 4, title: 'LLM Research Scientist', company: 'Google DeepMind', location: 'London, UK', type: 'Full-time', salary: '£130k–£200k', category: 'Research', remote: false, logo: '🔬', featured: false, posted: '1 week ago' },
    { id: 5, title: 'AI Solutions Architect', company: 'AWS', location: 'New York, NY', type: 'Full-time', salary: '$160k–$230k', category: 'Engineering', remote: true, logo: '☁️', featured: false, posted: '1 week ago' },
    { id: 6, title: 'Head of AI Marketing', company: 'Jasper AI', location: 'Austin, TX', type: 'Full-time', salary: '$120k–$180k', category: 'Marketing', remote: true, logo: '✍️', featured: false, posted: '2 weeks ago' },
    { id: 7, title: 'AI Data Scientist', company: 'Stability AI', location: 'Remote', type: 'Contract', salary: '$80–$120/hr', category: 'Data', remote: true, logo: '📊', featured: false, posted: '2 weeks ago' },
    { id: 8, title: 'Computer Vision Engineer', company: 'Runway ML', location: 'New York, NY', type: 'Full-time', salary: '$140k–$200k', category: 'Engineering', remote: false, logo: '🎬', featured: false, posted: '3 weeks ago' },
];

const CATEGORIES = ['All', 'Engineering', 'Research', 'Product', 'Marketing', 'Data', 'Design'];

export default function JobsPage() {
    return (
        <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
            <Navbar />

            {/* Hero */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
                <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm font-semibold mb-6">
                        <Briefcase className="w-4 h-4" />
                        AI Jobs Board
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-4">Find Your Next AI Role</h1>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Browse top AI, ML & tech jobs from leading companies. Updated daily.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link href="#post-job" className="px-8 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors">
                            Post a Job — $99
                        </Link>
                        <Link href="#jobs" className="px-8 py-3 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-400 transition-colors border border-blue-400">
                            Browse {SAMPLE_JOBS.length}+ Jobs
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="grid grid-cols-3 md:grid-cols-3 gap-6 text-center">
                        {[
                            { label: 'Active Jobs', value: '500+' },
                            { label: 'AI Companies', value: '120+' },
                            { label: 'Monthly Applicants', value: '15k+' },
                        ].map(s => (
                            <div key={s.label}>
                                <div className="text-2xl font-black text-blue-600">{s.value}</div>
                                <div className="text-sm text-gray-500">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <main className="flex-grow max-w-7xl mx-auto px-4 py-10 w-full">
                {/* Category Filter */}
                <div className="flex flex-wrap gap-2 mb-8" id="jobs">
                    {CATEGORIES.map(cat => (
                        <button key={cat} className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${cat === 'All' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}>
                            {cat}
                        </button>
                    ))}
                    <label className="ml-auto flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                        <input type="checkbox" className="rounded" defaultChecked /> Remote only
                    </label>
                </div>

                {/* Featured Jobs */}
                <div className="space-y-3 mb-8">
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Featured</h2>
                    {SAMPLE_JOBS.filter(j => j.featured).map(job => (
                        <div key={job.id} className="bg-white border-2 border-blue-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-blue-400 transition-colors group">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl shrink-0">{job.logo}</div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">Featured</span>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                                    <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" />{job.company}</span>
                                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
                                    <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" />{job.salary}</span>
                                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{job.posted}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${job.remote ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{job.remote ? '🌍 Remote' : '🏢 Office'}</span>
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{job.type}</span>
                                <button className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-lg border border-blue-200 hover:border-blue-400 transition-colors">
                                    Apply <ExternalLink className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* All Jobs */}
                <div className="space-y-3">
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">All Jobs</h2>
                    {SAMPLE_JOBS.filter(j => !j.featured).map(job => (
                        <div key={job.id} className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-blue-300 transition-colors group">
                            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl shrink-0">{job.logo}</div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">{job.title}</h3>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                                    <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" />{job.company}</span>
                                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
                                    <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" />{job.salary}</span>
                                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{job.posted}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${job.remote ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{job.remote ? '🌍 Remote' : '🏢 Office'}</span>
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{job.type}</span>
                                <button className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-lg border border-blue-200 hover:border-blue-400 transition-colors">
                                    Apply <ExternalLink className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Post a Job CTA */}
                <div id="post-job" className="mt-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-10 text-white text-center">
                    <Sparkles className="w-10 h-10 mx-auto mb-4 opacity-80" />
                    <h2 className="text-3xl font-black mb-3">Post an AI Job</h2>
                    <p className="text-blue-100 mb-2 max-w-xl mx-auto">Reach 15,000+ AI professionals monthly. Your listing stays live for 30 days.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6">
                        {[
                            { name: 'Standard', price: '$99', priceKey: 'job_basic', features: ['30-day listing', 'Category placement', 'Email distribution'] },
                            { name: 'Featured', price: '$199', priceKey: 'job_featured', features: ['30-day featured badge', 'Top of results', 'Email + newsletter blast', 'Social media post'] },
                        ].map(plan => (
                            <div key={plan.name} className="bg-white/10 border border-white/20 rounded-2xl p-6 text-left w-full max-w-xs">
                                <div className="text-lg font-bold mb-1">{plan.name}</div>
                                <div className="text-3xl font-black mb-4">{plan.price}</div>
                                <ul className="space-y-2 text-sm text-blue-100 mb-5">
                                    {plan.features.map(f => <li key={f} className="flex items-center gap-2">✓ {f}</li>)}
                                </ul>
                                <CheckoutButton
                                    priceKey={plan.priceKey}
                                    className="block w-full text-center bg-white text-blue-600 font-bold py-2.5 rounded-xl hover:bg-blue-50 transition-colors"
                                >
                                    Post Now
                                </CheckoutButton>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-blue-200 mt-6">Questions? Email <a href="mailto:hello@allaitoollist.com" className="underline">hello@allaitoollist.com</a></p>
                </div>
            </main>

            <Footer />
        </div>
    );
}
