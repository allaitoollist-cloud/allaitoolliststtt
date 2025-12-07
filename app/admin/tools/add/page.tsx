'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Loader2, Plus, Wand2 } from 'lucide-react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import { useToast } from '@/components/ui/use-toast';
import { categories, pricingModels, platforms } from '@/types';

export default function AddToolPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [saving, setSaving] = useState(false);
    const [fetching, setFetching] = useState(false);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const [tool, setTool] = useState({
        name: '',
        slug: '',
        short_description: '',
        full_description: '',
        url: '',
        icon: '',
        category: '',
        pricing: '',
        tags: [] as string[],
        platform: ['Web'] as string[],
        trending: false,
        featured: false,
        verified: false,
        is_draft: true, // Default to draft
    });

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    const handleFetchMetadata = async () => {
        if (!tool.url) {
            toast({ title: 'Error', description: 'Please enter a URL first', variant: 'destructive' });
            return;
        }

        setFetching(true);
        try {
            const response = await fetch('/api/fetch-metadata', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: tool.url }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch metadata');
            }

            setTool(prev => ({
                ...prev,
                name: prev.name || data.title || '',
                short_description: prev.short_description || data.description?.substring(0, 160) || '',
                full_description: prev.full_description || data.description || '',
                icon: prev.icon || data.icon || '',
                slug: prev.slug || generateSlug(data.title || ''),
            }));

            toast({ title: 'Success', description: 'Metadata fetched successfully!' });
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive'
            });
        }
        setFetching(false);
    };

    const handleSave = async () => {
        // Validation
        if (!tool.name.trim()) {
            toast({ title: 'Error', description: 'Tool name is required', variant: 'destructive' });
            return;
        }
        if (!tool.url.trim()) {
            toast({ title: 'Error', description: 'URL is required', variant: 'destructive' });
            return;
        }
        if (!tool.short_description.trim()) {
            toast({ title: 'Error', description: 'Short description is required', variant: 'destructive' });
            return;
        }
        if (!tool.category) {
            toast({ title: 'Error', description: 'Category is required', variant: 'destructive' });
            return;
        }
        if (!tool.pricing) {
            toast({ title: 'Error', description: 'Pricing is required', variant: 'destructive' });
            return;
        }

        setSaving(true);

        // Generate slug if empty
        const slug = tool.slug || generateSlug(tool.name);

        const { data, error } = await supabase
            .from('tools')
            .insert({
                name: tool.name,
                slug: slug,
                short_description: tool.short_description,
                full_description: tool.full_description || tool.short_description,
                url: tool.url,
                icon: tool.icon || null,
                category: tool.category,
                pricing: tool.pricing,
                tags: tool.tags,
                platform: tool.platform,
                trending: tool.trending,
                featured: tool.featured,
                verified: tool.verified,
                is_draft: tool.is_draft,
                views: 0,
                rating: 0,
                review_count: 0,
            })
            .select()
            .single();

        if (error) {
            toast({
                title: 'Error',
                description: `Failed to add tool: ${error.message}`,
                variant: 'destructive',
            });
        } else {
            toast({
                title: 'Success',
                description: `Tool "${tool.name}" added successfully!`,
            });
            router.push('/admin/tools');
        }
        setSaving(false);
    };

    const handleTagsChange = (value: string) => {
        const tags = value.split(',').map(tag => tag.trim()).filter(Boolean);
        setTool({ ...tool, tags });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/tools">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Add New Tool</h1>
                        <p className="text-muted-foreground">Manually add a tool to the directory</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {tool.is_draft && (
                        <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500">
                            Will be saved as Draft
                        </Badge>
                    )}
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Plus className="h-4 w-4 mr-2" />
                        )}
                        Add Tool
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>Tool name, description and URL</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Tool Name *</Label>
                                    <Input
                                        id="name"
                                        value={tool.name}
                                        onChange={(e) => {
                                            setTool({
                                                ...tool,
                                                name: e.target.value,
                                                slug: tool.slug || generateSlug(e.target.value)
                                            });
                                        }}
                                        placeholder="Enter tool name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="slug">Slug (auto-generated)</Label>
                                    <Input
                                        id="slug"
                                        value={tool.slug}
                                        onChange={(e) => setTool({ ...tool, slug: e.target.value })}
                                        placeholder="auto-generated-from-name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="url">Website URL *</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="url"
                                        type="url"
                                        value={tool.url}
                                        onChange={(e) => setTool({ ...tool, url: e.target.value })}
                                        placeholder="https://example.com"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={handleFetchMetadata}
                                        disabled={fetching || !tool.url}
                                        title="Auto-Fill details from URL"
                                    >
                                        {fetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Enter URL and click the wand to auto-fill details
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="icon">Icon URL (optional)</Label>
                                <Input
                                    id="icon"
                                    value={tool.icon}
                                    onChange={(e) => setTool({ ...tool, icon: e.target.value })}
                                    placeholder="https://example.com/icon.png"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Leave empty to auto-fetch favicon
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="short_description">Short Description * (max 160 chars)</Label>
                                <Textarea
                                    id="short_description"
                                    value={tool.short_description}
                                    onChange={(e) => setTool({ ...tool, short_description: e.target.value })}
                                    placeholder="Brief description (1-2 sentences)"
                                    rows={2}
                                    maxLength={160}
                                />
                                <p className="text-xs text-muted-foreground">
                                    {tool.short_description.length}/160 characters
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="full_description">Full Description</Label>
                                <Textarea
                                    id="full_description"
                                    value={tool.full_description}
                                    onChange={(e) => setTool({ ...tool, full_description: e.target.value })}
                                    placeholder="Detailed description of the tool, features, use cases..."
                                    rows={6}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Tags & Platforms</CardTitle>
                            <CardDescription>Help users find this tool</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="tags">Tags (comma separated)</Label>
                                <Input
                                    id="tags"
                                    value={tool.tags.join(', ')}
                                    onChange={(e) => handleTagsChange(e.target.value)}
                                    placeholder="AI, Writing, Productivity, Marketing"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Add relevant tags to improve discoverability
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label>Platforms (click to toggle)</Label>
                                <div className="flex flex-wrap gap-2">
                                    {platforms.map((platform) => (
                                        <Badge
                                            key={platform}
                                            variant={tool.platform.includes(platform) ? 'default' : 'outline'}
                                            className="cursor-pointer hover:opacity-80 transition-opacity"
                                            onClick={() => {
                                                const newPlatforms = tool.platform.includes(platform)
                                                    ? tool.platform.filter(p => p !== platform)
                                                    : [...tool.platform, platform];
                                                setTool({ ...tool, platform: newPlatforms });
                                            }}
                                        >
                                            {platform}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Category & Pricing *</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Select
                                    value={tool.category}
                                    onValueChange={(value) => setTool({ ...tool, category: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.filter(c => c !== 'All').map((cat) => (
                                            <SelectItem key={cat} value={cat}>
                                                {cat}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Pricing Model</Label>
                                <Select
                                    value={tool.pricing}
                                    onValueChange={(value) => setTool({ ...tool, pricing: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select pricing" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {pricingModels.filter(p => p !== 'All').map((price) => (
                                            <SelectItem key={price} value={price}>
                                                {price}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Status & Visibility</CardTitle>
                            <CardDescription>Control how tool appears</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Save as Draft</Label>
                                    <p className="text-xs text-muted-foreground">Hide from public until ready</p>
                                </div>
                                <Switch
                                    checked={tool.is_draft}
                                    onCheckedChange={(checked) => setTool({ ...tool, is_draft: checked })}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Featured</Label>
                                    <p className="text-xs text-muted-foreground">Show in featured section</p>
                                </div>
                                <Switch
                                    checked={tool.featured}
                                    onCheckedChange={(checked) => setTool({ ...tool, featured: checked })}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Trending</Label>
                                    <p className="text-xs text-muted-foreground">Mark as trending</p>
                                </div>
                                <Switch
                                    checked={tool.trending}
                                    onCheckedChange={(checked) => setTool({ ...tool, trending: checked })}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Verified</Label>
                                    <p className="text-xs text-muted-foreground">Mark as verified & trusted</p>
                                </div>
                                <Switch
                                    checked={tool.verified}
                                    onCheckedChange={(checked) => setTool({ ...tool, verified: checked })}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
