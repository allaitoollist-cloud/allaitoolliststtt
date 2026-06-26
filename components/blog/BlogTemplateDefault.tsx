'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Share2, Sparkles, ChevronDown, ChevronUp, ExternalLink, List } from 'lucide-react';
import Link from 'next/link';
import { markdownToHtml, extractHeadings } from '@/lib/markdown';

interface FAQ { question: string; answer: string; }

interface BlogTemplateDefaultProps {
    blog: {
        title: string;
        excerpt?: string;
        cover_image?: string;
        category?: string;
        created_at: string;
        views?: number;
        content: string;
        formattedDate?: string;
        readingTime?: number;
        faq?: FAQ[];
        focus_keyword?: string;
        schema_markup?: string;
        entity_mentions?: string[];
    };
}

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
    const [open, setOpen] = useState(index === 0);
    return (
        <div className="border border-white/10 rounded-xl overflow-hidden">
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full text-left px-5 py-4 flex items-center justify-between gap-3 hover:bg-white/5 transition-colors"
            >
                <span className="font-semibold text-sm">{question}</span>
                {open ? <ChevronUp className="h-4 w-4 shrink-0 text-primary" /> : <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />}
            </button>
            {open && (
                <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-white/10 pt-3">
                    {answer}
                </div>
            )}
        </div>
    );
}

function TableOfContents({ headings }: { headings: { id: string; text: string; level: number }[] }) {
    if (headings.length < 3) return null;
    return (
        <div className="bg-card border border-white/10 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                <List className="h-4 w-4 text-primary" />
                Table of Contents
            </div>
            <nav className="space-y-1">
                {headings.map((h) => (
                    <a
                        key={h.id}
                        href={`#${h.id}`}
                        className={`block text-xs leading-relaxed hover:text-primary transition-colors ${h.level === 2 ? 'text-foreground/80 py-0.5' : 'text-muted-foreground py-0.5 pl-3 border-l border-white/10'}`}
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                    >
                        {h.text}
                    </a>
                ))}
            </nav>
        </div>
    );
}

export function BlogTemplateDefault({ blog }: BlogTemplateDefaultProps) {
    const formattedDate = blog.formattedDate || '';
    const readingTime = blog.readingTime || Math.ceil((blog.content || '').split(/\s+/).length / 200);
    const headings = extractHeadings(blog.content || '');
    const faqs: FAQ[] = blog.faq && Array.isArray(blog.faq) && blog.faq.length > 0 ? blog.faq : [];
    const htmlContent = markdownToHtml(blog.content || '');

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({ title: blog.title, url: window.location.href });
        } else {
            navigator.clipboard.writeText(window.location.href);
        }
    };

    return (
        <>
            {/* JSON-LD Schema */}
            {blog.schema_markup && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: blog.schema_markup }}
                />
            )}

            <article className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Cover image */}
                {blog.cover_image && (
                    <div className="mb-8 rounded-2xl overflow-hidden max-h-[480px]">
                        <img src={blog.cover_image} alt={blog.title} className="w-full h-full object-cover" />
                    </div>
                )}

                <div className="space-y-6 max-w-4xl mx-auto">
                    {blog.category && <Badge variant="secondary">{blog.category}</Badge>}

                    <h1 className="text-3xl md:text-5xl font-bold leading-tight">{blog.title}</h1>

                    {blog.excerpt && (
                        <p className="text-xl text-muted-foreground leading-relaxed">{blog.excerpt}</p>
                    )}

                    {/* Meta bar */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-y border-white/10 py-4">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{readingTime} min read</span>
                        </div>
                        {blog.views ? <span>{blog.views.toLocaleString()} views</span> : null}
                        {blog.focus_keyword && (
                            <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                                {blog.focus_keyword}
                            </Badge>
                        )}
                        <Button variant="ghost" size="sm" className="gap-2 ml-auto" onClick={handleShare}>
                            <Share2 className="h-3.5 w-3.5" />Share
                        </Button>
                    </div>

                    {/* TL;DR */}
                    <div className="bg-primary/5 border-l-4 border-primary p-5 rounded-r-xl">
                        <h2 className="text-base font-bold flex items-center gap-2 mb-2">
                            <Sparkles className="h-4 w-4 text-primary" />Quick Takeaway (TL;DR)
                        </h2>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            {blog.excerpt || 'Key insights from this article synthesized for fast AI retrieval and answer engine optimization (AEO).'}
                        </p>
                    </div>

                    {/* Main layout: content + sidebar */}
                    <div className="grid lg:grid-cols-[1fr_280px] gap-10 pt-4">

                        {/* Article content */}
                        <div className="min-w-0">
                            <div
                                className="prose prose-invert max-w-none
                                    prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-4
                                    prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-3
                                    prose-p:text-base prose-p:leading-relaxed prose-p:text-muted-foreground
                                    prose-li:text-muted-foreground prose-li:leading-relaxed
                                    prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                                    prose-strong:text-foreground prose-strong:font-semibold
                                    prose-blockquote:border-primary prose-blockquote:text-muted-foreground
                                    prose-code:bg-white/10 prose-code:text-primary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm"
                                dangerouslySetInnerHTML={{ __html: htmlContent }}
                            />

                            {/* Entity mentions */}
                            {blog.entity_mentions && blog.entity_mentions.length > 0 && (
                                <div className="mt-10 pt-6 border-t border-white/10">
                                    <p className="text-xs text-muted-foreground mb-3 font-semibold uppercase tracking-wider">Topics & Entities Covered</p>
                                    <div className="flex flex-wrap gap-2">
                                        {blog.entity_mentions.map((e, i) => (
                                            <Badge key={i} variant="outline" className="text-xs">{e}</Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* FAQ Section */}
                            {faqs.length > 0 && (
                                <section className="mt-12 pt-8 border-t border-white/10">
                                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                        <span className="text-primary">❓</span>
                                        Frequently Asked Questions
                                    </h2>
                                    <div className="space-y-3">
                                        {faqs.map((f, i) => (
                                            <FAQItem key={i} question={f.question} answer={f.answer} index={i} />
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* CTA Box */}
                            <div className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 text-center space-y-4">
                                <p className="text-lg font-bold">🚀 Find 1000+ AI Tools — Free</p>
                                <p className="text-sm text-muted-foreground">
                                    Browse our curated directory of the best AI tools across 50+ categories.
                                    Filter by pricing, category, and use case.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                                    <Link href="/">
                                        <Button className="gap-2">
                                            <Sparkles className="h-4 w-4" />
                                            Explore AI Tools
                                        </Button>
                                    </Link>
                                    <Link href="/submit">
                                        <Button variant="outline" className="gap-2 border-white/20">
                                            <ExternalLink className="h-4 w-4" />
                                            Submit Your Tool
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Sticky Sidebar */}
                        <aside className="hidden lg:block">
                            <div className="sticky top-8 space-y-5">
                                <TableOfContents headings={headings} />

                                {/* CTA mini */}
                                <div className="bg-card border border-white/10 rounded-2xl p-5 text-center space-y-3">
                                    <p className="text-sm font-bold text-white">🚀 Discover AI Tools</p>
                                    <p className="text-[11px] text-muted-foreground leading-relaxed">Browse 1000+ curated AI tools across 50+ categories — free.</p>
                                    <Link href="/" className="block">
                                        <Button size="sm" className="w-full gap-2 text-xs">
                                            <Sparkles className="h-3 w-3" />Browse Directory
                                        </Button>
                                    </Link>
                                    <Link href="/submit" className="block">
                                        <Button size="sm" variant="outline" className="w-full gap-2 text-xs border-white/10">
                                            <ExternalLink className="h-3 w-3" />Submit Your Tool
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </article>
        </>
    );
}
