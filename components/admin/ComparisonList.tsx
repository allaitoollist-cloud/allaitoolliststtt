'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getBrowserClient } from '@/lib/supabase-browser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Edit, Trash2, Plus, Loader2, ArrowRightLeft, AlertTriangle } from 'lucide-react';
import { Tool } from '@/types';

interface Comparison {
    id: string;
    tool_a_id: string;
    tool_b_id: string;
    title: string;
    slug: string;
    status: 'draft' | 'published' | 'archived';
    overview?: string;
    created_at: string;
    tool_a?: { name: string };
    tool_b?: { name: string };
}

interface SimpleTool {
    id: string;
    name: string;
    slug: string;
}

export default function ComparisonList({ initialComparisons, tools }: { initialComparisons: Comparison[], tools: SimpleTool[] }) {
    const [comparisons, setComparisons] = useState<Comparison[]>(initialComparisons);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const { toast } = useToast();
    const router = useRouter();
    const supabase = getBrowserClient();

    // Form
    const [formData, setFormData] = useState({
        tool_a_id: '',
        tool_b_id: '',
        title: '',
        slug: '',
        overview: '',
        status: 'draft'
    });

    const resetForm = () => {
        setFormData({ tool_a_id: '', tool_b_id: '', title: '', slug: '', overview: '', status: 'draft' });
        setEditingId(null);
    };

    const generateMeta = (aId: string, bId: string) => {
        if (!aId || !bId) return;
        const toolA = tools.find(t => t.id === aId);
        const toolB = tools.find(t => t.id === bId);
        if (toolA && toolB) {
            // Sort names to avoid duplicates? Usually we respect user order, or force alphabetical
            // Let's force alphabetical order for canonical comparison
            const sorted = [toolA, toolB].sort((a, b) => a.name.localeCompare(b.name));
            const canonA = sorted[0];
            const canonB = sorted[1];

            // Only update if not editing or fields empty
            if (!editingId) {
                setFormData(prev => ({
                    ...prev,
                    tool_a_id: canonA.id,
                    tool_b_id: canonB.id,
                    title: `${canonA.name} vs ${canonB.name}`,
                    slug: `${canonA.slug}-vs-${canonB.slug}`
                }));
            }
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        const { error } = await supabase.from('comparisons').delete().eq('id', id);
        if (!error) {
            setComparisons(prev => prev.filter(c => c.id !== id));
            toast({ title: 'Deleted', description: 'Comparison removed.' });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Validation
        if (formData.tool_a_id === formData.tool_b_id) {
            toast({ title: "Invalid", description: "Cannot compare a tool to itself.", variant: "destructive" });
            setLoading(false);
            return;
        }

        try {
            if (editingId) {
                const { error } = await supabase.from('comparisons').update(formData).eq('id', editingId);
                if (error) throw error;
                toast({ title: 'Updated', description: 'Comparison updated.' });
            } else {
                const { data, error } = await supabase.from('comparisons').insert([formData]).select().single();
                if (error) throw error;
                // We need to fetch/mock names for immediate update since insert doesn't return joined data
                // Quick fix: page refresh is safer
                toast({ title: 'Created', description: 'Comparison created.' });
            }
            setIsOpen(false);
            resetForm();
            router.refresh(); // Refresh server data
        } catch (error: any) {
            toast({ title: 'Error', description: error.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (comp: Comparison) => {
        setEditingId(comp.id);
        setFormData({
            tool_a_id: comp.tool_a_id,
            tool_b_id: comp.tool_b_id,
            title: comp.title,
            slug: comp.slug,
            overview: comp.overview || '',
            status: comp.status as any
        });
        setIsOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Comparisons</h2>
                    <p className="text-muted-foreground">Manage head-to-head tool pages.</p>
                </div>
                <Dialog open={isOpen} onOpenChange={(v) => { setIsOpen(v); if (!v) resetForm(); }}>
                    <DialogTrigger asChild>
                        <Button className="gap-2"><Plus className="h-4 w-4" /> Create Comparison</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>{editingId ? 'Edit Comparison' : 'New Comparison'}</DialogTitle>
                            <DialogDescription>
                                Compare two tools. Use alphabetical order for best SEO practices (A vs B).
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Tool A</Label>
                                    <Select
                                        value={formData.tool_a_id}
                                        onValueChange={(val) => {
                                            setFormData(prev => ({ ...prev, tool_a_id: val }));
                                            if (!editingId && formData.tool_b_id) generateMeta(val, formData.tool_b_id);
                                        }}
                                    >
                                        <SelectTrigger><SelectValue placeholder="Select Tool A" /></SelectTrigger>
                                        <SelectContent>
                                            {tools.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Tool B</Label>
                                    <Select
                                        value={formData.tool_b_id}
                                        onValueChange={(val) => {
                                            setFormData(prev => ({ ...prev, tool_b_id: val }));
                                            if (!editingId && formData.tool_a_id) generateMeta(formData.tool_a_id, val);
                                        }}
                                    >
                                        <SelectTrigger><SelectValue placeholder="Select Tool B" /></SelectTrigger>
                                        <SelectContent>
                                            {tools.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label>Page Title</Label>
                                <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                                <Label>URL Slug</Label>
                                <Input value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Overview / Meta Description</Label>
                                <Textarea value={formData.overview} onChange={e => setFormData({ ...formData, overview: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Status</Label>
                                <Select value={formData.status} onValueChange={(v: any) => setFormData({ ...formData, status: v })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="under_review">Under Review</SelectItem>
                                        <SelectItem value="published">Published</SelectItem>
                                        <SelectItem value="archived">Archived</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <DialogFooter>
                                <Button type="submit" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Comparison
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-md border bg-card text-card-foreground shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Comparison</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Last Updated</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {comparisons.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    No comparisons created yet.
                                </TableCell>
                            </TableRow>
                        )}
                        {comparisons.map(comp => (
                            <TableRow key={comp.id}>
                                <TableCell>
                                    <div className="font-semibold">{comp.title}</div>
                                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                                        {comp.tool_a?.name || 'Deleted'} <ArrowRightLeft className="h-3 w-3" /> {comp.tool_b?.name || 'Deleted'}
                                    </div>
                                </TableCell>
                                <TableCell className="text-xs font-mono text-muted-foreground">{comp.slug}</TableCell>
                                <TableCell>
                                    <Badge variant={comp.status === 'published' ? 'default' : 'secondary'}>
                                        {comp.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {new Date(comp.created_at).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button size="icon" variant="ghost" onClick={() => handleEdit(comp)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(comp.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
