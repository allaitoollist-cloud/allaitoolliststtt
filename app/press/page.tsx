import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Metadata } from 'next';
import { Download, FileText, Image as ImageIcon, LinkIcon, Mail } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'Press Kit - AI Tool List',
    description: 'Download official brand assets, logos, and screenshots for AI Tool List. Contact our media team for inquiries.',
};

export default function PressPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background font-sans text-foreground">
            <Navbar />

            <main className="flex-grow pt-24 pb-20">
                {/* Hero */}
                <div className="container mx-auto px-4 max-w-4xl text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                        Press Resources
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                        Official logos, brand guidelines, and media assets for AI Tool List.
                        Feel free to use these materials for articles and features.
                    </p>
                </div>

                {/* About Boilerplate */}
                <section className="container mx-auto px-4 max-w-3xl mb-16">
                    <h2 className="text-2xl font-bold mb-4">About AI Tool List</h2>
                    <div className="bg-secondary/5 border border-border rounded-xl p-8 copy-block relative group">
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            "AI Tool List is the web's most comprehensive directory of artificial intelligence software.
                            Updated daily, it helps professionals discover, compare, and implement the best AI tools
                            for their specific needs, from marketing automation to code generation."
                        </p>
                        <Button variant="ghost" size="sm" className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <FileText className="h-4 w-4 mr-2" /> Copy
                        </Button>
                    </div>
                </section>

                {/* Logos Section */}
                <section className="container mx-auto px-4 max-w-5xl mb-16">
                    <h2 className="text-2xl font-bold mb-8">Brand Assets</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Light Mode Logo */}
                        <div className="border border-border rounded-xl p-8 bg-white flex flex-col items-center">
                            <div className="flex-1 flex items-center justify-center w-full py-10">
                                {/* Mock Logo Display */}
                                <div className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                                    <div className="bg-primary/10 p-2 rounded-lg"><Zap className="h-8 w-8 text-primary" /></div>
                                    AI Tool List
                                </div>
                            </div>
                            <div className="w-full pt-6 border-t border-border flex justify-between items-center">
                                <span className="text-sm font-medium text-slate-500">Light Logo (PNG)</span>
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Download className="h-4 w-4" /> Download
                                </Button>
                            </div>
                        </div>

                        {/* Dark Mode Logo (on dark bg) */}
                        <div className="border border-border rounded-xl p-8 bg-slate-900 flex flex-col items-center">
                            <div className="flex-1 flex items-center justify-center w-full py-10">
                                {/* Mock Logo Display */}
                                <div className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
                                    <div className="bg-primary/20 p-2 rounded-lg"><Zap className="h-8 w-8 text-white" /></div>
                                    AI Tool List
                                </div>
                            </div>
                            <div className="w-full pt-6 border-t border-slate-700 flex justify-between items-center">
                                <span className="text-sm font-medium text-slate-300">Dark Logo (PNG)</span>
                                <Button variant="secondary" size="sm" className="gap-2 bg-slate-800 text-white hover:bg-slate-700 border-slate-600">
                                    <Download className="h-4 w-4" /> Download
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section className="container mx-auto px-4 max-w-3xl text-center">
                    <h2 className="text-2xl font-bold mb-6">Media Inquiries</h2>
                    <p className="text-muted-foreground mb-8">
                        For interview requests, data partnerships, or more information, please contact our press team.
                    </p>
                    <a href="mailto:press@aitoollist.com">
                        <Button size="lg" className="h-14 px-8 rounded-full text-lg">
                            <Mail className="h-5 w-5 mr-2" /> Contact Press Team
                        </Button>
                    </a>
                </section>

            </main>
            <Footer />
        </div>
    );
}
