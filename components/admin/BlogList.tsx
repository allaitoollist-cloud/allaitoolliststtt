'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Search, Plus, Pencil, Trash2, Eye, Filter } from 'lucide-react';
import { getBrowserClient } from '@/lib/supabase-browser';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

interface Blog {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    is_published: boolean;
    created_at: string;
    views: number;
    category: string;
}

export function BlogList({ initialBlogs }: { initialBlogs: Blog[] }) {
    const [blogs, setBlogs] = useState<Blog[]>(initialBlogs);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const supabase = getBrowserClient();

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this blog post?')) return;

        setLoading(true);
        const { error } = await supabase
            .from('blogs')
            .delete()
            .eq('id', id);

        if (error) {
            toast({
                title: 'Error',
                description: 'Failed to delete blog post',
                variant: 'destructive',
            });
        } else {
            toast({
                title: 'Success',
                description: 'Blog post deleted successfully',
            });
            setBlogs(blogs.filter(blog => blog.id !== id));
            router.refresh();
        }
        setLoading(false);
    };

    const filteredBlogs = blogs.filter(blog => {
        const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            blog.slug.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'all'
            ? true
            : statusFilter === 'published'
                ? blog.is_published
                : !blog.is_published;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search blogs..."
                        className="pl-9 bg-card/50"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px] bg-card/50">
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Posts</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="draft">Drafts</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="rounded-md border border-white/10 bg-card/50">
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/10 hover:bg-white/5">
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Views</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredBlogs.length > 0 ? (
                            filteredBlogs.map((blog) => (
                                <TableRow key={blog.id} className="border-white/10 hover:bg-white/5">
                                    <TableCell>
                                        <div className="font-medium">{blog.title}</div>
                                        <div className="text-xs text-muted-foreground line-clamp-1">/{blog.slug}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="bg-primary/5 border-primary/20">
                                            {blog.category || 'Uncategorized'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={blog.is_published ? 'default' : 'secondary'}
                                            className={blog.is_published ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20 border-0' : 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-0'}
                                        >
                                            {blog.is_published ? 'Published' : 'Draft'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-muted-foreground">
                                            <Eye className="h-3 w-3" />
                                            {blog.views || 0}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {new Date(blog.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <Link href={`/blog/${blog.slug}`} target="_blank">
                                                    <DropdownMenuItem>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View Live
                                                    </DropdownMenuItem>
                                                </Link>
                                                <Link href={`/admin/blogs/edit/${blog.id}`}>
                                                    <DropdownMenuItem>
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                </Link>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-red-600 focus:text-red-600"
                                                    onClick={() => handleDelete(blog.id)}
                                                    disabled={loading}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                    No blogs found matching your filters
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="text-xs text-muted-foreground text-center">
                Showing {filteredBlogs.length} of {blogs.length} posts
            </div>
        </div>
    );
}
