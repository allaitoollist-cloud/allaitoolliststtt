import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, Eye, TrendingUp, DollarSign } from 'lucide-react';
import { supabase } from '@/lib/supabase';

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

    // Mock stats for revenue as we don't have that data yet
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
            title: "Revenue (Mo)",
            value: "$0",
            change: "Not tracked",
            icon: DollarSign,
        },
    ];

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
