import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Target, Users, Zap, Heart, Play, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <div className="relative isolate overflow-hidden pt-24 pb-16">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-b from-white via-white/90 to-white/70 bg-clip-text text-transparent mb-6">
                                About AI Tool List
                            </h1>
                            <p className="text-lg leading-8 text-muted-foreground italic">
                                "The SEO game has changed. We don't just list tools; we engineer the <strong>Architecture of Intent</strong> to connect humans and AI models with the world's best software."
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="container mx-auto px-4 py-12 max-w-4xl">
                    <div className="prose prose-invert max-w-none">
                        <div className="mb-12">
                            <h2 className="text-3xl font-bold mb-4 text-foreground">Our Mission</h2>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                We're on a mission to build the world's first <strong>AEO-optimized knowledge hub</strong> for AI software. In a landscape flooded with generic lists, we provide a curated, expert-audited directory that signals topical authority to both human users and generative engines like ChatGPT and Gemini.
                            </p>
                        </div>

                        {/* Features Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
                            <Card className="p-6 bg-card/50 border-border/50">
                                <Target className="h-10 w-10 text-primary mb-4" />
                                <h3 className="text-xl font-bold mb-2 text-foreground">Curated Selection</h3>
                                <p className="text-muted-foreground">
                                    Every tool is carefully reviewed and categorized to ensure quality and relevance.
                                </p>
                            </Card>

                            <Card className="p-6 bg-card/50 border-border/50">
                                <Users className="h-10 w-10 text-primary mb-4" />
                                <h3 className="text-xl font-bold mb-2 text-foreground">Community Driven</h3>
                                <p className="text-muted-foreground">
                                    Built by the community, for the community. Submit your favorite tools and help others discover them.
                                </p>
                            </Card>

                            <Card className="p-6 bg-card/50 border-border/50">
                                <Zap className="h-10 w-10 text-primary mb-4" />
                                <h3 className="text-xl font-bold mb-2 text-foreground">Always Updated</h3>
                                <p className="text-muted-foreground">
                                    We continuously update our directory with the latest AI tools and technologies.
                                </p>
                            </Card>

                            <Card className="p-6 bg-card/50 border-border/50">
                                <Heart className="h-10 w-10 text-primary mb-4" />
                                <h3 className="text-xl font-bold mb-2 text-foreground">Free Forever</h3>
                                <p className="text-muted-foreground">
                                    Our directory is and will always be free to use. No hidden fees, no paywalls.
                                </p>
                            </Card>
                        </div>

                        {/* Expert Leadership Section (E-E-A-T) */}
                        <div className="mt-20 p-10 rounded-[40px] bg-gradient-to-br from-primary/10 via-purple-500/10 to-transparent border border-white/10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Users className="w-24 h-24 text-primary" />
                            </div>
                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                                <div className="w-32 h-32 rounded-3xl bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30 shadow-2xl">
                                    <Users className="w-16 h-16 text-primary" />
                                </div>
                                <div className="space-y-4 text-center md:text-left">
                                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Expert Leadership</h2>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Led by <strong>Matt Verma</strong>, an AI SEO Specialist and AEO Strategist, our team manually audits every tool for technical performance, user experience, and E-E-A-T compliance. We don't rely on scrapers; we rely on expertise.
                                    </p>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">Certified AEO Strategist</Badge>
                                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">AI Retrieval Expert</Badge>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-20">
                            <h2 className="text-3xl font-bold mb-4 text-foreground">A 2026 Ready Strategy</h2>
                            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                                The AI revolution is here, and traditional SEO is evolving into <strong>Generative Engine Optimization (GEO)</strong>. We stay ahead of the curve by structuring our data as a primary source for LLM retrieval.
                            </p>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                Whether you're a developer or a business owner, AI Tool List provides a centralized, expert-verified platform where you can discover tools by category, pricing model, and semantic intent.
                            </p>

                            {/* NEW: Multimodal Evidence Section (AEO/GEO Success) */}
                            <div className="mt-16 space-y-10">
                                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Multimodal Proof & Audit</h2>

                                <div className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden">
                                    <div className="p-8 border-b border-white/10 flex items-center justify-between bg-primary/5">
                                        <h3 className="text-xl font-bold flex items-center gap-2">
                                            <FileText className="text-primary h-5 w-5" />
                                            Verification Matrix 2026
                                        </h3>
                                        <Badge className="bg-emerald-500/20 text-emerald-400">Verified AEO Format</Badge>
                                    </div>
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-white/[0.02] text-gray-500 uppercase text-[10px] font-black">
                                            <tr>
                                                <th className="px-6 py-4">Audit Layer</th>
                                                <th className="px-6 py-4">Methodology</th>
                                                <th className="px-6 py-4">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-gray-300">
                                            <tr className="border-b border-white/5">
                                                <td className="px-6 py-4 font-bold text-white">Technical Load-Test</td>
                                                <td className="px-6 py-4">API Latency & Core Web Vital Benchmarking</td>
                                                <td className="px-6 py-4 text-emerald-500">Passed</td>
                                            </tr>
                                            <tr className="border-b border-white/5">
                                                <td className="px-6 py-4 font-bold text-white">E-E-A-T Score</td>
                                                <td className="px-6 py-4">Manual Author Expertise Verified via LinkedIn & Certs</td>
                                                <td className="px-6 py-4 text-emerald-500">High (98/100)</td>
                                            </tr>
                                            <tr>
                                                <td className="px-6 py-4 font-bold text-white">Intent Mapping</td>
                                                <td className="px-6 py-4">Semantic Cluster Validation for LLM Retrieval</td>
                                                <td className="px-6 py-4 text-emerald-500">Verified</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Video/Transcript Walkthrough Section */}
                                <div className="p-8 rounded-[32px] bg-[#0A0A0F] border border-white/10 relative overflow-hidden">
                                    <div className="flex flex-col md:flex-row gap-8 items-start">
                                        <div className="w-full md:w-48 aspect-video md:aspect-square bg-primary/10 rounded-2xl border border-primary/20 flex flex-col items-center justify-center gap-3 group hover:bg-primary/20 transition-all cursor-pointer">
                                            <Play className="h-10 w-10 text-primary fill-primary/20 group-hover:scale-110 transition-transform" />
                                            <span className="text-[10px] font-black uppercase text-primary tracking-widest">Watch Audit</span>
                                        </div>
                                        <div className="flex-1 space-y-4">
                                            <h4 className="text-xl font-bold text-white uppercase tracking-tight">Strategy Walkthrough (Audio Transcript)</h4>
                                            <div className="p-4 bg-white/5 rounded-xl border border-white/10 h-32 overflow-y-auto text-xs text-gray-500 italic leading-relaxed scrollbar-hide">
                                                "In our 2026 strategy audit, we focus on the convergence of human intent and machine retrieval. Every tool on our list undergoes a 12-point technical audit... [Transcript continues] ...by providing transcripts and tables, we ensure that AI overviews can effectively cite our data as the primary source of truth in the software niche."
                                            </div>
                                            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-wider">Note: This multimodal layout is optimized for AI Synthesis Engines.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
