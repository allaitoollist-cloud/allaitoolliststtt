'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getBrowserClient } from '@/lib/supabase-browser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Save, ArrowLeft, Sparkles, Plus, Trash2, ChevronDown, ChevronUp, Info, CheckCircle2, Circle } from 'lucide-react';
import Link from 'next/link';
import { MarkdownEditor } from '@/components/admin/MarkdownEditor';

interface FAQ { question: string; answer: string; }

interface BlogFormProps {
    initialData?: {
        id?: string;
        title: string;
        slug: string;
        content: string;
        excerpt: string;
        cover_image: string;
        meta_title: string;
        meta_description: string;
        meta_keywords: string;
        category: string;
        is_published: boolean;
        template?: string;
        focus_keyword?: string;
        faq?: FAQ[];
    };
    isEditing?: boolean;
}

const INSTRUCTIONS = [
    { icon: '🎯', label: 'Focus Keyword', text: 'Set one primary keyword (e.g. "ChatGPT review"). Use it in title, first paragraph, 2+ headings, and last paragraph.' },
    { icon: '🤖', label: 'AEO (Answer Engine)', text: 'Write FAQ section with 5 direct Q&As. Start answers with the answer, not filler. Perplexity and ChatGPT cite these directly.' },
    { icon: '🌐', label: 'GEO (Generative Engine)', text: 'Include at least one clear fact, statistic, or definition per section. AI engines synthesize concrete information, not vague prose.' },
    { icon: '🔗', label: 'Entity SEO', text: 'Name specific tools, companies, people. Entities help search engines understand what the article is "about" beyond keywords.' },
    { icon: '📚', label: 'Semantic / NLP', text: 'Use synonyms and related terms naturally: "AI tool", "AI software", "machine learning tool", "AI assistant" — not just the keyword.' },
    { icon: '📋', label: 'Structure', text: 'Use H2 for main sections, H3 for subsections. Include: intro, 5+ sections, pros/cons or features list, FAQ, conclusion with CTA.' },
    { icon: '✍️', label: 'Length', text: 'Minimum 1200 words for Google ranking. 1500-2000 words for topical authority. Use the AI Generator to hit this automatically.' },
    { icon: '🔗', label: 'Internal Links', text: 'Link to your homepage and related tools: [Tool Name](https://allaitoollist.com/tool/slug). This builds topical clusters.' },
];

function SEOChecklist({ formData, faqs }: { formData: any; faqs: FAQ[] }) {
    const wordCount = formData.content.split(/\s+/).filter(Boolean).length;
    const hasH2 = (formData.content.match(/^## /m) || []).length >= 3;
    const hasFocusInTitle = formData.focus_keyword && formData.title.toLowerCase().includes(formData.focus_keyword.toLowerCase());
    const hasFocusInMeta = formData.focus_keyword && formData.meta_description.toLowerCase().includes(formData.focus_keyword.toLowerCase());
    const items = [
        { label: 'Title has focus keyword', ok: hasFocusInTitle },
        { label: 'Meta description filled (150+ chars)', ok: formData.meta_description.length >= 150 },
        { label: 'Focus keyword in meta description', ok: hasFocusInMeta },
        { label: '3+ H2 headings', ok: hasH2 },
        { label: '1200+ words', ok: wordCount >= 1200 },
        { label: '5 FAQ questions added (AEO)', ok: faqs.length >= 5 },
        { label: 'Meta title ≤60 chars', ok: formData.meta_title.length > 0 && formData.meta_title.length <= 60 },
        { label: 'Excerpt filled', ok: formData.excerpt.length > 50 },
    ];
    const score = items.filter(i => i.ok).length;
    return (
        <Card className="border-white/10">
            <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">SEO Checklist</p>
                    <Badge className={score >= 7 ? 'bg-green-500/20 text-green-400' : score >= 4 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}>
                        {score}/{items.length}
                    </Badge>
                </div>
                <div className="space-y-1.5">
                    {items.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                            {item.ok
                                ? <CheckCircle2 className="h-3.5 w-3.5 text-green-400 shrink-0" />
                                : <Circle className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
                            }
                            <span className={item.ok ? 'text-foreground' : 'text-muted-foreground'}>{item.label}</span>
                        </div>
                    ))}
                </div>
                <div className="text-xs text-muted-foreground pt-1 border-t border-white/10">
                    {wordCount.toLocaleString()} words · {Math.max(1, Math.ceil(wordCount / 200))} min read
                </div>
            </CardContent>
        </Card>
    );
}

export function BlogForm({ initialData, isEditing = false }: BlogFormProps) {
    const router = useRouter();
    const { toast } = useToast();
    const supabase = getBrowserClient();
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [keywords, setKeywords] = useState('');
    const [showInstructions, setShowInstructions] = useState(false);
    const [faqs, setFaqs] = useState<FAQ[]>(initialData?.faq || []);

    const getToken = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        return session?.access_token || '';
    };

    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        slug: initialData?.slug || '',
        content: initialData?.content || '',
        excerpt: initialData?.excerpt || '',
        cover_image: initialData?.cover_image || '',
        meta_title: initialData?.meta_title || '',
        meta_description: initialData?.meta_description || '',
        meta_keywords: initialData?.meta_keywords || '',
        category: initialData?.category || '',
        is_published: initialData?.is_published || false,
        template: initialData?.template || 'default',
        focus_keyword: initialData?.focus_keyword || '',
        related_tool_slug: (initialData as any)?.related_tool_slug || '',
    });

    const generateSlug = (title: string) =>
        title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setFormData(prev => ({ ...prev, title, slug: !isEditing ? generateSlug(title) : prev.slug }));
    };

    const handleGenerateBlog = async () => {
        if (!keywords.trim()) {
            toast({ title: 'Error', description: 'Please enter keywords', variant: 'destructive' });
            return;
        }
        setGenerating(true);
        try {
            const token = await getToken();
            const response = await fetch('/api/generate-blog', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
                body: JSON.stringify({ keywords: keywords.trim(), category: formData.category || '' }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Generation failed');
            if (data.success && data.blog) {
                const b = data.blog;
                setFormData(prev => ({
                    ...prev,
                    title: b.title || prev.title,
                    slug: b.slug || prev.slug,
                    content: b.content || prev.content,
                    excerpt: b.excerpt || prev.excerpt,
                    meta_title: b.meta_title || prev.meta_title,
                    meta_description: b.meta_description || prev.meta_description,
                    meta_keywords: b.meta_keywords || prev.meta_keywords,
                    category: b.category || prev.category,
                    focus_keyword: b.focus_keyword || prev.focus_keyword,
                    is_published: false,
                }));
                if (b.faq?.length) setFaqs(b.faq);
                toast({ title: '✅ Blog generated!', description: `"${b.title?.substring(0, 50)}..."` });
            }
        } catch (error: any) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        } finally {
            setGenerating(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = await getToken();
            const blog = {
                ...formData,
                faq: faqs,
                template: ['default', 'modern', 'minimal', 'magazine', 'story'].includes(formData.template)
                    ? formData.template : 'default',
            };
            const res = await fetch('/api/save-blog', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
                body: JSON.stringify({ blog, id: isEditing ? initialData?.id : undefined }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to save');
            toast({ title: 'Success', description: `Blog ${isEditing ? 'updated' : 'created'} successfully.` });
            router.push('/admin/blogs');
            router.refresh();
        } catch (error: any) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    const addFaq = () => setFaqs(prev => [...prev, { question: '', answer: '' }]);
    const removeFaq = (i: number) => setFaqs(prev => prev.filter((_, idx) => idx !== i));
    const updateFaq = (i: number, field: 'question' | 'answer', val: string) =>
        setFaqs(prev => prev.map((f, idx) => idx === i ? { ...f, [field]: val } : f));

    return (
        <div className="flex gap-6 max-w-[1400px] mx-auto">
            {/* Left: Main form */}
            <form onSubmit={handleSubmit} className="flex-1 min-w-0 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/blogs">
                            <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                        </Link>
                        <h1 className="text-2xl font-bold">{isEditing ? 'Edit Post' : 'Create New Post'}</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <Switch
                                id="published"
                                checked={formData.is_published}
                                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
                            />
                            <Label htmlFor="published" className="text-sm">Published</Label>
                        </div>
                        <Button type="submit" disabled={loading}>
                            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : <><Save className="mr-2 h-4 w-4" />Save Post</>}
                        </Button>
                    </div>
                </div>

                {/* AI Generator */}
                <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="p-5 space-y-3">
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                            <h3 className="font-semibold">AI Blog Generator</h3>
                            <Badge variant="outline" className="text-xs border-green-500/30 text-green-400">AEO + GEO + Entity SEO</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">Enter a keyword or AI tool name → AI writes a 1500-word, fully optimized blog with FAQ, schema, and entity mentions.</p>
                        <div className="flex gap-2">
                            <Input
                                placeholder="e.g. ChatGPT, Midjourney review, best AI writing tools..."
                                value={keywords}
                                onChange={(e) => setKeywords(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter' && !generating) handleGenerateBlog(); }}
                                disabled={generating}
                                className="flex-1"
                            />
                            <Button type="button" onClick={handleGenerateBlog} disabled={generating || !keywords.trim()} className="gap-2 shrink-0">
                                {generating ? <><Loader2 className="h-4 w-4 animate-spin" />Generating...</> : <><Sparkles className="h-4 w-4" />Generate</>}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Instructions toggle */}
                <button
                    type="button"
                    onClick={() => setShowInstructions(v => !v)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-sm"
                >
                    <span className="flex items-center gap-2 font-medium">
                        <Info className="h-4 w-4 text-primary" />
                        Writing Instructions — AEO, GEO, NLP, Entity SEO Guide
                    </span>
                    {showInstructions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {showInstructions && (
                    <Card className="border-white/10">
                        <CardContent className="p-5 grid sm:grid-cols-2 gap-4">
                            {INSTRUCTIONS.map((item, i) => (
                                <div key={i} className="space-y-1">
                                    <p className="text-sm font-semibold flex items-center gap-2">
                                        <span>{item.icon}</span>{item.label}
                                    </p>
                                    <p className="text-xs text-muted-foreground leading-relaxed">{item.text}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {/* Basic fields */}
                <Card className="border-white/10">
                    <CardContent className="p-5 space-y-4">
                        <div className="grid gap-2">
                            <Label>Title *</Label>
                            <Input value={formData.title} onChange={handleTitleChange} placeholder="Blog post title" required />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Slug</Label>
                                <Input value={formData.slug} onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))} placeholder="post-url-slug" required />
                            </div>
                            <div className="grid gap-2">
                                <Label>Category</Label>
                                <Input value={formData.category} onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))} placeholder="AI Tools, Reviews, Tutorials..." />
                            </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Focus Keyword <span className="text-xs text-muted-foreground ml-1">(primary SEO keyword)</span></Label>
                                <Input value={formData.focus_keyword} onChange={(e) => setFormData(prev => ({ ...prev, focus_keyword: e.target.value }))} placeholder="e.g. ChatGPT review" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Related Tool Slug <span className="text-xs text-muted-foreground ml-1">(shows tool card on blog)</span></Label>
                                <Input value={formData.related_tool_slug} onChange={(e) => setFormData(prev => ({ ...prev, related_tool_slug: e.target.value }))} placeholder="e.g. chatgpt, midjourney" />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Excerpt <span className="text-xs text-muted-foreground ml-1">(used in cards + meta)</span></Label>
                            <Textarea value={formData.excerpt} onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))} placeholder="2-3 sentence summary" rows={3} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Cover Image URL</Label>
                            <Input value={formData.cover_image} onChange={(e) => setFormData(prev => ({ ...prev, cover_image: e.target.value }))} placeholder="https://..." />
                        </div>
                    </CardContent>
                </Card>

                {/* SEO */}
                <Card className="border-white/10">
                    <CardContent className="p-5 space-y-4">
                        <div className="border-b border-white/10 pb-3 mb-1">
                            <h3 className="font-semibold">SEO Optimization</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">These fields appear in Google search results</p>
                        </div>
                        <div className="grid gap-2">
                            <Label>Meta Title <span className="text-xs text-muted-foreground">{formData.meta_title.length}/60</span></Label>
                            <Input value={formData.meta_title} onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))} placeholder="Title for Google (50-60 chars)" maxLength={60} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Meta Description <span className="text-xs text-muted-foreground">{formData.meta_description.length}/160</span></Label>
                            <Textarea value={formData.meta_description} onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))} placeholder="Description for Google (150-160 chars)" rows={3} maxLength={160} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Meta Keywords</Label>
                            <Input value={formData.meta_keywords} onChange={(e) => setFormData(prev => ({ ...prev, meta_keywords: e.target.value }))} placeholder="keyword1, keyword2, keyword3" />
                        </div>
                    </CardContent>
                </Card>

                {/* FAQ Builder */}
                <Card className="border-white/10">
                    <CardContent className="p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                            <div>
                                <h3 className="font-semibold flex items-center gap-2">
                                    ❓ FAQ Section
                                    <Badge variant="outline" className="text-[10px] border-blue-500/30 text-blue-400">AEO</Badge>
                                </h3>
                                <p className="text-xs text-muted-foreground mt-0.5">5+ Q&As make your blog citable by AI answer engines (ChatGPT, Perplexity, Gemini)</p>
                            </div>
                            <Button type="button" size="sm" variant="outline" onClick={addFaq} className="gap-1.5 shrink-0">
                                <Plus className="h-3.5 w-3.5" />Add Q&A
                            </Button>
                        </div>
                        {faqs.length === 0 && (
                            <p className="text-xs text-muted-foreground text-center py-4">No FAQs yet. Add 5+ for AEO optimization. Use AI Generator to auto-generate them.</p>
                        )}
                        <div className="space-y-4">
                            {faqs.map((faq, i) => (
                                <div key={i} className="p-4 border border-white/10 rounded-xl space-y-2 relative">
                                    <button type="button" onClick={() => removeFaq(i)} className="absolute top-3 right-3 text-muted-foreground hover:text-red-400 transition-colors">
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                    <div className="pr-6">
                                        <Label className="text-xs">Question {i + 1}</Label>
                                        <Input
                                            value={faq.question}
                                            onChange={(e) => updateFaq(i, 'question', e.target.value)}
                                            placeholder="What is...? How does...? Is...?"
                                            className="mt-1 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs">Answer</Label>
                                        <Textarea
                                            value={faq.answer}
                                            onChange={(e) => updateFaq(i, 'answer', e.target.value)}
                                            placeholder="Direct, clear answer (1-3 sentences for AEO)"
                                            className="mt-1 text-sm"
                                            rows={2}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Content editor */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold">Content</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">Use ## for H2 sections, ### for H3 — these become the Table of Contents</p>
                        </div>
                        <Select value={formData.template} onValueChange={(v) => setFormData(prev => ({ ...prev, template: v }))}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Template" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="default">📄 Default</SelectItem>
                                <SelectItem value="modern">✨ Modern</SelectItem>
                                <SelectItem value="minimal">🎨 Minimal</SelectItem>
                                <SelectItem value="magazine">📰 Magazine</SelectItem>
                                <SelectItem value="story">📖 Story</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <MarkdownEditor value={formData.content} onChange={(content) => setFormData(prev => ({ ...prev, content }))} />
                </div>
            </form>

            {/* Right: SEO panel */}
            <aside className="hidden xl:block w-72 shrink-0 space-y-4 pt-[72px]">
                <SEOChecklist formData={formData} faqs={faqs} />
            </aside>
        </div>
    );
}
