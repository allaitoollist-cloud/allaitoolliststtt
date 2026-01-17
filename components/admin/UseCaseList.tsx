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
import { useToast } from '@/components/ui/use-toast';
import { Edit, Trash2, Plus, Loader2, Archive, Link as LinkIcon, AlertTriangle } from 'lucide-react';

interface UseCase {
    id: string;
    name: string;
    slug: string;
    status: 'draft' | 'published' | 'archived';
    description?: string;
    count?: number; // Linked tools count
}

export default function UseCaseList({ initialUseCases }: { initialUseCases: UseCase[] }) {
    const [useCases, setUseCases] = useState<UseCase[]>(initialUseCases);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const { toast } = useToast();
    const router = useRouter();
    const supabase = getBrowserClient();

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        status: 'draft',
        description: ''
    });

    const resetForm = () => {
        setFormData({ name: '', slug: '', status: 'draft', description: '' });
        setEditingId(null);
    };

    const handleEdit = (useCase: UseCase) => {
        setFormData({
            name: useCase.name,
            slug: useCase.slug,
            status: useCase.status,
            description: useCase.description || ''
        });
        setEditingId(useCase.id);
        setIsOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this use case?')) return;

        const { error } = await supabase.from('use_cases').delete().eq('id', id);
        if (error) {
            toast({ title: 'Error', description: 'Failed to delete use case', variant: 'destructive' });
        } else {
            setUseCases(useCases.filter(uc => uc.id !== id));
            toast({ title: 'Deleted', description: 'Use case removed' });
            router.refresh();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editingId) {
                // Update
                const { error } = await supabase
                    .from('use_cases')
                    .update(formData)
                    .eq('id', editingId);

                if (error) throw error;

                // Optimistic Update
                setUseCases(useCases.map(uc => uc.id === editingId ? { ...uc, ...formData } as UseCase : uc));
                toast({ title: 'Success', description: 'Use case updated' });

            } else {
                // Create
                const { data, error } = await supabase
                    .from('use_cases')
                    .insert([formData])
                    .select()
                    .single();

                if (error) throw error;

                setUseCases([data, ...useCases]);
                toast({ title: 'Success', description: 'New use case created' });
            }

            setIsOpen(false);
            resetForm();
            router.refresh();

        } catch (error: any) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Use Case Management</h2>
                    <p className="text-muted-foreground">Create and manage content categories for SEO.</p>
                </div>
                <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
                    <DialogTrigger asChild>
                        <Button className="gap-2"><Plus className="h-4 w-4" /> New Use Case</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingId ? 'Edit Use Case' : 'Create New Use Case'}</DialogTitle>
                            <DialogDescription>
                                Defines a specific user intent page (e.g. "for-marketing").
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={e => {
                                        const name = e.target.value;
                                        // Auto-generate slug if making new
                                        if (!editingId) {
                                            const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                                            setFormData(prev => ({ ...prev, name, slug }));
                                        } else {
                                            setFormData(prev => ({ ...prev, name }));
                                        }
                                    }}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="slug">Slug (URL)</Label>
                                <Input
                                    id="slug"
                                    value={formData.slug}
                                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">SEO Description</Label>
                                <Input
                                    id="description"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(val: any) => setFormData({ ...formData, status: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">Draft (Hidden)</SelectItem>
                                        <SelectItem value="published">Published (Live)</SelectItem>
                                        <SelectItem value="archived">Archived</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <DialogFooter>
                                <Button type="submit" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Changes
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
                            <TableHead>Name</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Linked Tools</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {useCases.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    No use cases found. Create one to get started.
                                </TableCell>
                            </TableRow>
                        )}
                        {useCases.map((uc) => (
                            <TableRow key={uc.id}>
                                <TableCell className="font-medium">{uc.name}</TableCell>
                                <TableCell className="text-muted-foreground font-mono text-xs">{uc.slug}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <LinkIcon className="h-3 w-3 text-muted-foreground" />
                                        {uc.count || 0}
                                        {(uc.count === 0 && uc.status === 'published') && (
                                            <span title="Warning: Published but empty" className="text-amber-500 cursor-help">
                                                <AlertTriangle className="h-4 w-4" />
                                            </span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={uc.status === 'published' ? 'default' : 'secondary'}>
                                        {uc.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button size="icon" variant="ghost" onClick={() => handleEdit(uc)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(uc.id)}>
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
