'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Edit, FolderOpen, Search, Package, Loader2, Save, X, GripVertical } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { useToast } from '@/components/ui/use-toast';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    icon?: string;
    color: string;
    tool_count?: number;
    created_at: string;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        icon: '',
        color: '#6366f1'
    });

    const { toast } = useToast();
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        setLoading(true);

        // Get categories
        const { data: catData, error: catError } = await supabase
            .from('categories')
            .select('*')
            .order('name');

        if (catError) {
            toast({ title: 'Error', description: 'Failed to load categories', variant: 'destructive' });
            setLoading(false);
            return;
        }

        // Get tool counts per category
        const { data: tools } = await supabase
            .from('tools')
            .select('category');

        // Count tools per category
        const toolCounts: Record<string, number> = {};
        tools?.forEach(tool => {
            const cat = tool.category;
            toolCounts[cat] = (toolCounts[cat] || 0) + 1;
        });

        // Merge counts with categories
        const categoriesWithCounts = catData?.map(cat => ({
            ...cat,
            tool_count: toolCounts[cat.name] || 0
        })) || [];

        setCategories(categoriesWithCounts);
        setLoading(false);
    };

    const openAddDialog = () => {
        setEditingCategory(null);
        setFormData({ name: '', description: '', icon: '', color: '#6366f1' });
        setIsDialogOpen(true);
    };

    const openEditDialog = (category: Category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            description: category.description || '',
            icon: category.icon || '',
            color: category.color || '#6366f1'
        });
        setIsDialogOpen(true);
    };

    const handleSave = async () => {
        if (!formData.name.trim()) {
            toast({ title: 'Error', description: 'Category name is required', variant: 'destructive' });
            return;
        }

        setSaving(true);
        const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        if (editingCategory) {
            // Update existing category
            const { error } = await supabase
                .from('categories')
                .update({
                    name: formData.name,
                    slug: slug,
                    description: formData.description,
                    icon: formData.icon || null,
                    color: formData.color
                })
                .eq('id', editingCategory.id);

            if (error) {
                toast({ title: 'Error', description: error.message, variant: 'destructive' });
            } else {
                // Also update tool categories if name changed
                if (editingCategory.name !== formData.name) {
                    await supabase
                        .from('tools')
                        .update({ category: formData.name })
                        .eq('category', editingCategory.name);
                }
                toast({ title: 'Success', description: 'Category updated!' });
                setIsDialogOpen(false);
                loadCategories();
            }
        } else {
            // Add new category
            const { error } = await supabase
                .from('categories')
                .insert({
                    name: formData.name,
                    slug: slug,
                    description: formData.description,
                    icon: formData.icon || null,
                    color: formData.color
                });

            if (error) {
                toast({ title: 'Error', description: error.message, variant: 'destructive' });
            } else {
                toast({ title: 'Success', description: 'Category added!' });
                setIsDialogOpen(false);
                loadCategories();
            }
        }

        setFormData({ name: '', description: '', icon: '', color: '#6366f1' });
        setSaving(false);
    };

    const handleDelete = async () => {
        if (!categoryToDelete) return;

        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', categoryToDelete.id);

        if (error) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        } else {
            toast({ title: 'Success', description: 'Category deleted!' });
            loadCategories();
        }

        setIsDeleteDialogOpen(false);
        setCategoryToDelete(null);
    };

    const confirmDelete = (category: Category) => {
        setCategoryToDelete(category);
        setIsDeleteDialogOpen(true);
    };

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalTools = categories.reduce((sum, cat) => sum + (cat.tool_count || 0), 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Categories</h1>
                    <p className="text-muted-foreground">Manage tool categories and organize your directory</p>
                </div>
                <Button onClick={openAddDialog}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Category
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-card/50 border-white/10">
                    <CardContent className="pt-4 pb-3">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-purple-500/10">
                                <FolderOpen className="h-4 w-4 text-purple-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{categories.length}</p>
                                <p className="text-xs text-muted-foreground">Categories</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card/50 border-white/10">
                    <CardContent className="pt-4 pb-3">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-blue-500/10">
                                <Package className="h-4 w-4 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{totalTools}</p>
                                <p className="text-xs text-muted-foreground">Total Tools</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card/50 border-white/10">
                    <CardContent className="pt-4 pb-3">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-green-500/10">
                                <Package className="h-4 w-4 text-green-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {categories.length > 0 ? Math.round(totalTools / categories.length) : 0}
                                </p>
                                <p className="text-xs text-muted-foreground">Avg Tools/Cat</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card/50 border-white/10">
                    <CardContent className="pt-4 pb-3">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-orange-500/10">
                                <FolderOpen className="h-4 w-4 text-orange-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {categories.filter(c => (c.tool_count || 0) === 0).length}
                                </p>
                                <p className="text-xs text-muted-foreground">Empty Cats</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-card/50"
                />
            </div>

            {/* Categories Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredCategories.map((cat) => (
                        <Card key={cat.id} className="bg-card/50 border-white/10 hover:border-primary/30 transition-colors group">
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div
                                                className="w-3 h-3 rounded-full flex-shrink-0"
                                                style={{ backgroundColor: cat.color }}
                                            />
                                            <h3 className="font-semibold truncate">{cat.name}</h3>
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                            {cat.description || 'No description'}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary" className="text-xs">
                                                <Package className="h-3 w-3 mr-1" />
                                                {cat.tool_count || 0} tools
                                            </Badge>
                                            {cat.icon && (
                                                <Badge variant="outline" className="text-xs">
                                                    {cat.icon}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => openEditDialog(cat)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-destructive hover:text-destructive"
                                            onClick={() => confirmDelete(cat)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {filteredCategories.length === 0 && !loading && (
                        <div className="col-span-full text-center py-12 text-muted-foreground">
                            {searchQuery ? 'No categories found matching your search' : 'No categories yet. Add one!'}
                        </div>
                    )}
                </div>
            )}

            {/* Add/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {editingCategory ? 'Edit Category' : 'Add New Category'}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g., Writing, Video, Marketing"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Brief description of this category"
                                rows={3}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="icon">Icon (emoji)</Label>
                                <Input
                                    id="icon"
                                    value={formData.icon}
                                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                    placeholder="📝"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="color">Color</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="color"
                                        type="color"
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                        className="w-12 h-10 p-1 cursor-pointer"
                                    />
                                    <Input
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                        placeholder="#6366f1"
                                        className="flex-1"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={saving}>
                            {saving ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <Save className="h-4 w-4 mr-2" />
                            )}
                            {editingCategory ? 'Update' : 'Add'} Category
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Category?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{categoryToDelete?.name}"?
                            {(categoryToDelete?.tool_count || 0) > 0 && (
                                <span className="block mt-2 text-orange-500">
                                    ⚠️ This category has {categoryToDelete?.tool_count} tools.
                                    Tools will not be deleted but will have no category.
                                </span>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
