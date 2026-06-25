'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, TrendingUp, Eye, Package, Star, Users, MessageSquare, Mail } from 'lucide-react';
import { getBrowserClient } from '@/lib/supabase-browser';
import { formatCategoryName } from '@/lib/category-utils';

export default function AnalyticsPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalTools: 0,
        totalViews: 0,
        totalReviews: 0,
        totalSubmissions: 0,
        totalUsers: 0,
        totalSubscribers: 0,
    });
    const [topTools, setTopTools] = useState<any[]>([]);
    const [topCategories, setTopCategories] = useState<any[]>([]);
    const [recentSubmissions, setRecentSubmissions] = useState<any[]>([]);
    const [submissionsPerDay, setSubmissionsPerDay] = useState<any[]>([]);
    const supabase = getBrowserClient();

    useEffect(() => {
        const load = async () => {
            setLoading(true);

            const [
                { count: toolCount },
                { data: tools },
                { count: reviewCount },
                { count: subCount },
                { data: subs },
                { count: subscriberCount },
                { count: userCount },
            ] = await Promise.all([
                supabase.from('tools').select('*', { count: 'exact', head: true }),
                supabase.from('tools').select('id, name, slug, category, views, featured, verified').order('views', { ascending: false }).limit(10),
                supabase.from('reviews').select('*', { count: 'exact', head: true }),
                supabase.from('tool_submissions').select('*', { count: 'exact', head: true }),
                supabase.from('tool_submissions').select('created_at, status').order('created_at', { ascending: false }).limit(60),
                supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true }),
                supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
            ]);

            // Top tools by views
            setTopTools(tools || []);

            // Category breakdown
            const { data: allTools } = await supabase.from('tools').select('category, views');
            const catMap: Record<string, { count: number; views: number }> = {};
            (allTools || []).forEach(t => {
                if (t.category) {
                    const cat = formatCategoryName(t.category);
                    if (!catMap[cat]) catMap[cat] = { count: 0, views: 0 };
                    catMap[cat].count++;
                    catMap[cat].views += t.views || 0;
                }
            });
            const cats = Object.entries(catMap)
                .map(([name, { count, views }]) => ({ name, count, views }))
                .sort((a, b) => b.views - a.views)
                .slice(0, 10);
            setTopCategories(cats);

            // Submissions per day (last 7 days)
            const days: Record<string, number> = {};
            const now = new Date();
            for (let i = 6; i >= 0; i--) {
                const d = new Date(now);
                d.setDate(d.getDate() - i);
                days[d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })] = 0;
            }
            (subs || []).forEach(s => {
                const d = new Date(s.created_at);
                const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                if (key in days) days[key]++;
            });
            setSubmissionsPerDay(Object.entries(days).map(([date, count]) => ({ date, count })));

            setRecentSubmissions((subs || []).slice(0, 7));

            const totalViews = (allTools || []).reduce((sum, t) => sum + (t.views || 0), 0);
            setStats({
                totalTools: toolCount || 0,
                totalViews,
                totalReviews: reviewCount || 0,
                totalSubmissions: subCount || 0,
                totalUsers: userCount || 0,
                totalSubscribers: subscriberCount || 0,
            });

            setLoading(false);
        };

        load();
    }, []);

    const statCards = [
        { label: 'Total Tools', value: stats.totalTools, icon: Package, color: 'bg-blue-500/10 text-blue-500' },
        { label: 'Total Views', value: stats.totalViews.toLocaleString(), icon: Eye, color: 'bg-purple-500/10 text-purple-500' },
        { label: 'Reviews', value: stats.totalReviews, icon: Star, color: 'bg-yellow-500/10 text-yellow-500' },
        { label: 'Submissions', value: stats.totalSubmissions, icon: TrendingUp, color: 'bg-orange-500/10 text-orange-500' },
        { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-indigo-500/10 text-indigo-500' },
        { label: 'Subscribers', value: stats.totalSubscribers, icon: Mail, color: 'bg-green-500/10 text-green-500' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Analytics</h1>
                <p className="text-muted-foreground">Overview of your directory performance.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {statCards.map(({ label, value, icon: Icon, color }) => (
                    <Card key={label} className="bg-card/50 border-white/10">
                        <CardContent className="pt-4 pb-3">
                            <div className="flex items-center gap-2">
                                <div className={`p-2 rounded-lg ${color}`}><Icon className="h-4 w-4" /></div>
                                <div>
                                    <p className="text-2xl font-bold">{value}</p>
                                    <p className="text-xs text-muted-foreground">{label}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Submissions last 7 days */}
                <Card className="bg-card/50 border-white/10">
                    <CardHeader>
                        <CardTitle className="text-base">Submissions — Last 7 Days</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-2 h-32">
                            {submissionsPerDay.map(({ date, count }) => {
                                const max = Math.max(...submissionsPerDay.map(d => d.count), 1);
                                const pct = (count / max) * 100;
                                return (
                                    <div key={date} className="flex-1 flex flex-col items-center gap-1">
                                        <span className="text-xs text-muted-foreground">{count}</span>
                                        <div
                                            className="w-full bg-primary/20 rounded-t"
                                            style={{ height: `${Math.max(pct, 4)}%` }}
                                        />
                                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">{date}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Top categories */}
                <Card className="bg-card/50 border-white/10">
                    <CardHeader>
                        <CardTitle className="text-base">Top Categories by Views</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {topCategories.slice(0, 6).map((cat, i) => {
                                const max = topCategories[0]?.views || 1;
                                const pct = Math.round((cat.views / max) * 100);
                                return (
                                    <div key={cat.name} className="space-y-0.5">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground truncate">{cat.name}</span>
                                            <span className="font-medium ml-2">{cat.views.toLocaleString()}</span>
                                        </div>
                                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary/60 rounded-full" style={{ width: `${pct}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Top tools table */}
            <Card className="bg-card/50 border-white/10">
                <CardHeader>
                    <CardTitle className="text-base">Top Tools by Views</CardTitle>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-white/10 hover:bg-white/5">
                                <TableHead>#</TableHead>
                                <TableHead>Tool</TableHead>
                                <TableHead className="hidden sm:table-cell">Category</TableHead>
                                <TableHead className="hidden md:table-cell">Badges</TableHead>
                                <TableHead className="text-right">Views</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {topTools.map((tool, i) => (
                                <TableRow key={tool.id} className="border-white/10 hover:bg-white/5">
                                    <TableCell className="text-muted-foreground font-mono text-xs w-8">{i + 1}</TableCell>
                                    <TableCell className="font-medium">{tool.name}</TableCell>
                                    <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">{formatCategoryName(tool.category)}</TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <div className="flex gap-1">
                                            {tool.featured && <Badge className="bg-purple-500/10 text-purple-400 border-0 text-xs">Featured</Badge>}
                                            {tool.verified && <Badge className="bg-green-500/10 text-green-400 border-0 text-xs">Verified</Badge>}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-bold">{(tool.views || 0).toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                            {topTools.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">No data yet</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
