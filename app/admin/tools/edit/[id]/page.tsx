'use client';

import { useState, useEffect } from 'react';
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
import { ArrowLeft, Save, Eye, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import { useToast } from '@/components/ui/use-toast';
import { categories, pricingModels, platforms } from '@/types';

interface ToolEditPageProps {
    params: { id: string };
}

export default function ToolEditPage({ params }: ToolEditPageProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const [tool, setTool] = useState({
        id: '',
        name: '',
        slug: '',
        short_description: '',
        full_description: '',
        url: '',
        icon: '',
        category: '',
        pricing: '',
        tags: [] as string[],
        platform: [] as string[],
        trending: false,
        featured: false,
        verified: false,
        is_draft: false,
    });

    useEffect(() => {
        const fetchTool = async () => {
            const { data, error } = await supabase
                .from('tools')
                .select('*')
                .eq('id', params.id)
                .single();

            if (error) {
                toast({
                    title: 'Error',
                    description: 'Failed to load tool',
                    variant: 'destructive',
                });
                router.push('/admin/tools');
                return;
            }

            if (data) {
                setTool({
                    id: data.id,
                    name: data.name || '',
                    slug: data.slug || '',
                    short_description: data.short_description || '',
                    full_description: data.full_description || '',
                    url: data.url || '',
                    icon: data.icon || '',
                    category: data.category || '',
                    pricing: data.pricing || '',
                    tags: data.tags || [],
                    platform: data.platform || [],
                    trending: data.trending || false,
                    featured: data.featured || false,
                    verified: data.verified || false,
                    is_draft: data.is_draft || false,
                });
            }
            setLoading(false);
        };

        fetchTool();
    }, [params.id, router, supabase, toast]);

    const handleSave = async () => {
        setSaving(true);

        // Generate slug if empty
        const slug = tool.slug || tool.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        const { error } = await supabase
            .from('tools')
            .update({
                name: tool.name,
                slug: slug,
                short_description: tool.short_description,
                full_description: tool.full_description,
                url: tool.url,
                icon: tool.icon,
                category: tool.category,
                pricing: tool.pricing,
                tags: tool.tags,
                platform: tool.platform,
                trending: tool.trending,
                featured: tool.featured,
                verified: tool.verified,
                is_draft: tool.is_draft,
            })
            .eq('id', params.id);

        if (error) {
            toast({
                title: 'Error',
                description: `Failed to save: ${error.message}`,
                variant: 'destructive',
            });
        } else {
            toast({
                title: 'Success',
                description: 'Tool saved successfully!',
            });
        }
        setSaving(false);
    };

    const handleTagsChange = (value: string) => {
        const tags = value.split(',').map(tag => tag.trim()).filter(Boolean);
        setTool({ ...tool, tags });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/tools">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Edit Tool</h1>
                        <p className="text-muted-foreground">Update tool information</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {tool.is_draft && (
                        <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500">
                            Draft
                        </Badge>
                    )}
                    <Link href={`/tool/${tool.slug || tool.id}`} target="_blank">
                        <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                        </Button>
                    </Link>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4 mr-2" />
                        )}
                        Save Changes
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
                                        onChange={(e) => setTool({ ...tool, name: e.target.value })}
                                        placeholder="Enter tool name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="slug">Slug</Label>
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
                                <Input
                                    id="url"
                                    type="url"
                                    value={tool.url}
                                    onChange={(e) => setTool({ ...tool, url: e.target.value })}
                                    placeholder="https://example.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="icon">Icon URL</Label>
                                <Input
                                    id="icon"
                                    value={tool.icon}
                                    onChange={(e) => setTool({ ...tool, icon: e.target.value })}
                                    placeholder="https://example.com/icon.png"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="short_description">Short Description *</Label>
                                <Textarea
                                    id="short_description"
                                    value={tool.short_description}
                                    onChange={(e) => setTool({ ...tool, short_description: e.target.value })}
                                    placeholder="Brief description (1-2 sentences)"
                                    rows={2}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="full_description">Full Description</Label>
                                <Textarea
                                    id="full_description"
                                    value={tool.full_description}
                                    onChange={(e) => setTool({ ...tool, full_description: e.target.value })}
                                    placeholder="Detailed description of the tool..."
                                    rows={6}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Tags & Platforms</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="tags">Tags (comma separated)</Label>
                                <Input
                                    id="tags"
                                    value={tool.tags.join(', ')}
                                    onChange={(e) => handleTagsChange(e.target.value)}
                                    placeholder="AI, Writing, Productivity"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Platforms</Label>
                                <div className="flex flex-wrap gap-2">
                                    {platforms.map((platform) => (
                                        <Badge
                                            key={platform}
                                            variant={tool.platform.includes(platform) ? 'default' : 'outline'}
                                            className="cursor-pointer"
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
                            <CardTitle>Category & Pricing</CardTitle>
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
                                <Label>Pricing</Label>
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
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Draft Mode</Label>
                                    <p className="text-xs text-muted-foreground">Hide from public</p>
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
                                    <p className="text-xs text-muted-foreground">Mark as verified</p>
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
