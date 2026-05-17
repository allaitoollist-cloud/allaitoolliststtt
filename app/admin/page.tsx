import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, Eye, TrendingUp, DollarSign, Zap } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { AnalyticsCharts } from '@/components/admin/AnalyticsCharts';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    // Fetch real data
    const { count: toolsCount } = await supabase
        .from('tools')
        .select('*', { count: 'exact', head: true });

    const { count: pendingCount } = await supabase
        .from('tool_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

    const { data: toolsData } = await supabase
        .from('tools')
        .select('views');

    const totalViews = toolsData?.reduce((acc, curr) => acc + (curr.views || 0), 0) || 0;

    const { data: recentSubmissions } = await supabase
        .from('tool_submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

    const { data: topTools } = await supabase
        .from('tools')
        .select('*')
        .order('views', { ascending: false })
        .limit(5);

    // Real sponsorship data
    const { count: approvedSponsorships } = await supabase
        .from('sponsorship_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');

    const { count: pendingSponsorships } = await supabase
        .from('sponsorship_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

    const { data: recentSponsorships } = await supabase
        .from('sponsorship_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

    const totalRevenue = (approvedSponsorships || 0) * 49;

    const stats = [
        {
            title: "Total Tools",
            value: toolsCount || 0,
            change: "From database",
            icon: FileText,
        },
        {
            title: "Pending Submissions",
            value: pendingCount || 0,
            change: "Needs review",
            icon: FileText,
            alert: (pendingCount || 0) > 0
        },
        {
            title: "Total Views",
            value: totalViews.toLocaleString(),
            change: "All time",
            icon: Eye,
        },
        {
            title: "Revenue (Est.)",
            value: `$${totalRevenue}`,
            change: `${approvedSponsorships || 0} approved · ${pendingSponsorships || 0} pending`,
            icon: DollarSign,
            alert: (pendingSponsorships || 0) > 0
        },
    ];

    // Mock data for charts (since we don't have real historical data yet)
    const dailyViews = [
        { date: 'Mon', views: 120 },
        { date: 'Tue', views: 145 },
        { date: 'Wed', views: 132 },
        { date: 'Thu', views: 198 },
        { date: 'Fri', views: 240 },
        { date: 'Sat', views: 180 },
        { date: 'Sun', views: 210 },
    ];

    // Calculate category stats from toolsData
    const categoryCount: Record<string, number> = {};
    const { data: allTools } = await supabase.from('tools').select('category');

    allTools?.forEach(tool => {
        const cat = tool.category || 'Uncategorized';
        categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });

    const categoryStats = Object.entries(categoryCount)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5); // Top 5 categories

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">Overview of your directory's performance.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <Card key={stat.title} className="bg-card/50 border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className={`text-xs ${stat.alert ? 'text-red-400 font-bold' : 'text-muted-foreground'}`}>
                                {stat.change}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Analytics Charts */}
            <AnalyticsCharts data={{ dailyViews, categoryStats }} />

            {/* Pending Sponsorships Alert */}
            {(pendingSponsorships || 0) > 0 && (
                <Card className="bg-orange-500/10 border-orange-500/30">
                    <CardContent className="p-5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Zap className="w-6 h-6 text-orange-400 fill-orange-400 shrink-0" />
                            <div>
                                <p className="font-semibold text-orange-300">
                                    {pendingSponsorships} Pending Sponsorship Request{(pendingSponsorships || 0) > 1 ? 's' : ''}
                                </p>
                                <p className="text-sm text-orange-400/70">
                                    Review and approve after receiving payment via Binance/Payoneer.
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/admin/sponsorships"
                            className="text-sm font-medium text-orange-400 hover:text-orange-300 border border-orange-500/40 px-4 py-2 rounded-lg whitespace-nowrap shrink-0 hover:bg-orange-500/10 transition-colors"
                        >
                            Review Now →
                        </Link>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Submissions */}
                <Card className="bg-card/50 border-white/10">
                    <CardHeader>
                        <CardTitle>Recent Submissions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentSubmissions && recentSubmissions.length > 0 ? (
                                recentSubmissions.map((submission) => (
                                    <div key={submission.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 border border-white/5">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center font-bold text-primary">
                                                AI
                                            </div>
                                            <div>
                                                <div className="font-medium">{submission.tool_name}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {new Date(submission.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className={`text-xs px-2 py-1 rounded ${submission.status === 'approved' ? 'bg-green-500/10 text-green-500' :
                                                submission.status === 'rejected' ? 'bg-red-500/10 text-red-500' :
                                                    'bg-yellow-500/10 text-yellow-500'
                                                }`}>
                                                {submission.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-muted-foreground py-4">
                                    No submissions found
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Performing Tools */}
                <Card className="bg-card/50 border-white/10">
                    <CardHeader>
                        <CardTitle>Top Performing Tools</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topTools && topTools.length > 0 ? (
                                topTools.map((tool, i) => (
                                    <div key={tool.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="text-muted-foreground w-4">{i + 1}</span>
                                            <div className="font-medium">{tool.name}</div>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Eye className="h-3 w-3" />
                                            {tool.views?.toLocaleString()}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-muted-foreground py-4">
                                    No tools found
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
