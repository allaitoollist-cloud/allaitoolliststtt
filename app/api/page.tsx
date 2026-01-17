import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { Code, Terminal, Key, Database, Globe, PlayCircle } from 'lucide-react';

export const metadata: Metadata = {
    title: 'API Documentation - AI Tool List',
    description: 'Integrate the largest AI tools database into your application. REST API documentation, endpoints, and authentication keys.',
};

export default function ApiDocsPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background font-sans text-foreground">
            <Navbar />

            <main className="flex-grow pt-24 pb-20">
                {/* Hero */}
                <div className="container mx-auto px-4 max-w-4xl text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary text-xs font-bold mb-6 border border-primary/20">
                        <Terminal className="h-3.5 w-3.5" /> DEVELOPER API
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                        Build with our Data
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                        Access real-time data on thousands of AI tools.
                        Power your applications, research, or aggregator with our robust REST API.
                    </p>
                    <div className="mt-8 flex justify-center gap-4">
                        <Button size="lg" className="rounded-full px-8">Get API Key</Button>
                        <Button variant="outline" size="lg" className="rounded-full px-8">Read Docs</Button>
                    </div>
                </div>

                {/* API Specs Container */}
                <div className="container mx-auto px-4 max-w-5xl grid lg:grid-cols-4 gap-8">

                    {/* Sidebar Nav (Sticky) */}
                    <aside className="hidden lg:block lg:col-span-1">
                        <div className="sticky top-24 space-y-8">
                            <div>
                                <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">Getting Started</h3>
                                <ul className="space-y-2 text-sm font-medium">
                                    <li className="text-primary pl-3 border-l-2 border-primary cursor-pointer">Introduction</li>
                                    <li className="text-muted-foreground pl-3 border-l-2 border-transparent hover:border-border hover:text-foreground cursor-pointer transition-colors">Authentication</li>
                                    <li className="text-muted-foreground pl-3 border-l-2 border-transparent hover:border-border hover:text-foreground cursor-pointer transition-colors">Rate Limits</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">Endpoints</h3>
                                <ul className="space-y-2 text-sm font-medium">
                                    <li className="text-muted-foreground pl-3 border-l-2 border-transparent hover:border-border hover:text-foreground cursor-pointer transition-colors">GET /tools</li>
                                    <li className="text-muted-foreground pl-3 border-l-2 border-transparent hover:border-border hover:text-foreground cursor-pointer transition-colors">GET /tools/{`{id}`}</li>
                                    <li className="text-muted-foreground pl-3 border-l-2 border-transparent hover:border-border hover:text-foreground cursor-pointer transition-colors">GET /categories</li>
                                    <li className="text-muted-foreground pl-3 border-l-2 border-transparent hover:border-border hover:text-foreground cursor-pointer transition-colors">GET /search</li>
                                </ul>
                            </div>
                        </div>
                    </aside>

                    {/* Main Docs Content */}
                    <div className="lg:col-span-3 space-y-12">

                        {/* Section: Intro */}
                        <section id="introduction">
                            <h2 className="text-3xl font-bold mb-4">Introduction</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                                The AI Tool List API provides programmatic access to our entire database of verified AI software.
                                You can retrieve tool details, search by tags, and access metadata like pricing and categories.
                            </p>
                            <div className="bg-secondary/10 border border-border rounded-xl p-6">
                                <h4 className="font-bold mb-2 flex items-center gap-2"><Globe className="h-4 w-4" /> Base URL</h4>
                                <code className="bg-black/80 text-white px-4 py-2 rounded-lg font-mono text-sm block">
                                    https://api.aitoollist.com/v1
                                </code>
                            </div>
                        </section>

                        {/* Section: Authentication */}
                        <section id="auth">
                            <h2 className="text-3xl font-bold mb-4">Authentication</h2>
                            <p className="text-muted-foreground mb-6">
                                All API requests require an API key to be included in the header.
                            </p>
                            <div className="space-y-4">
                                <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-700">
                                    <div className="bg-slate-800/50 px-4 py-2 border-b border-slate-700 flex items-center justify-between">
                                        <span className="text-xs font-mono text-slate-400">Header Example</span>
                                        <span className="text-xs text-slate-500">BASH</span>
                                    </div>
                                    <div className="p-4 overflow-x-auto">
                                        <pre className="text-sm font-mono text-blue-300">
                                            curl -H "Authorization: Bearer YOUR_API_KEY" \<br />
                                            &nbsp;&nbsp;https://api.aitoollist.com/v1/tools
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section: Endpoints */}
                        <section id="endpoints">
                            <h2 className="text-3xl font-bold mb-8">Endpoints</h2>

                            {/* GET /tools */}
                            <div className="mb-10">
                                <div className="flex items-center gap-4 mb-4">
                                    <Badge className="bg-green-500/10 text-green-600 border-green-500/20 font-bold px-3">GET</Badge>
                                    <code className="text-lg font-mono font-semibold">/tools</code>
                                </div>
                                <p className="text-muted-foreground mb-4">Retrieve a paginated list of published tools.</p>

                                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">Parameters</h4>
                                <div className="overflow-x-auto border border-border rounded-lg mb-6">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-secondary/5 border-b border-border">
                                            <tr>
                                                <th className="p-3 font-semibold">Name</th>
                                                <th className="p-3 font-semibold">Type</th>
                                                <th className="p-3 font-semibold">Description</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b border-border/50">
                                                <td className="p-3 font-mono text-primary">page</td>
                                                <td className="p-3 text-muted-foreground">integer</td>
                                                <td className="p-3 text-muted-foreground">Page number (default: 1)</td>
                                            </tr>
                                            <tr className="border-b border-border/50">
                                                <td className="p-3 font-mono text-primary">limit</td>
                                                <td className="p-3 text-muted-foreground">integer</td>
                                                <td className="p-3 text-muted-foreground">Items per page (max: 100)</td>
                                            </tr>
                                            <tr>
                                                <td className="p-3 font-mono text-primary">category</td>
                                                <td className="p-3 text-muted-foreground">string</td>
                                                <td className="p-3 text-muted-foreground">Filter by category slug</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* GET /tools/search */}
                            <div>
                                <div className="flex items-center gap-4 mb-4">
                                    <Badge className="bg-green-500/10 text-green-600 border-green-500/20 font-bold px-3">GET</Badge>
                                    <code className="text-lg font-mono font-semibold">/tools/search</code>
                                </div>
                                <p className="text-muted-foreground mb-4">Search tools by keyword or vector similarity.</p>
                            </div>
                        </section>

                    </div>
                </div>

            </main>
            <Footer />
        </div>
    );
}
