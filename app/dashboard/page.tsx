import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { getServerUser } from '@/lib/auth-helpers';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Settings, Heart, PlusCircle, FileText } from 'lucide-react';
import { ToolCard } from '@/components/ToolCard';
import { dbToolToTool } from '@/types';
import { BoostButton } from '@/components/BoostButton';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const user = await getServerUser();

    if (!user) {
        redirect('/login?redirect=/dashboard');
    }

    const cookieStore = cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
            },
        }
    );

    // Fetch user profile
    const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    // Fetch recent favorites (limit to 3 for dashboard)
    const { data: favoritesData } = await supabase
        .from('favorites')
        .select(`
            tool_id,
            tools (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

    const favoriteTools = (favoritesData || [])
        .map(fav => fav.tools)
        .filter(tool => tool !== null)
        .map(dbTool => dbToolToTool(dbTool as any));

    // Fetch user's submitted tools
    // Assuming there's a submissions table, or we just look up tools where submitter matches
    // But since submissions schema uses `submitter_email`, let's just count them or show placeholder
    const { data: submissions } = await supabase
        .from('tool_submissions')
        .select('*')
        .eq('submitter_email', user.email)
        .order('created_at', { ascending: false });

    // Match approved submissions to live tools by slug (more reliable than name)
    const approvedSubs = submissions?.filter(s => s.status === 'approved') || [];
    let liveTools: any[] = [];
    if (approvedSubs.length > 0) {
        const slugsToTry = approvedSubs
            .map(s => s.tool_slug || s.tool_name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
            .filter(Boolean);
        const namesToTry = approvedSubs.map(s => s.tool_name).filter(Boolean);

        const [bySlug, byName] = await Promise.all([
            slugsToTry.length > 0
                ? supabase.from('tools').select('id, name, slug, featured').in('slug', slugsToTry)
                : Promise.resolve({ data: [] }),
            namesToTry.length > 0
                ? supabase.from('tools').select('id, name, slug, featured').in('name', namesToTry)
                : Promise.resolve({ data: [] }),
        ]);

        const combined = [...(bySlug.data || []), ...(byName.data || [])];
        const seen = new Set<string>();
        liveTools = combined.filter(t => { if (seen.has(t.id)) return false; seen.add(t.id); return true; });
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back, {profile?.full_name || user.email}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Profile Summary Card */}
                    <Card className="col-span-1">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <User className="w-5 h-5 text-blue-600" />
                                Account Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-xl font-bold text-blue-600">
                                    {(profile?.full_name || user.email || 'U').charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold">{profile?.full_name || 'No Name Set'}</p>
                                    <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                                </div>
                            </div>
                            <Link href="/settings">
                                <Button variant="outline" className="w-full">
                                    <Settings className="w-4 h-4 mr-2" />
                                    Edit Profile
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Stats Card */}
                    <Card className="col-span-1 md:col-span-2">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <FileText className="w-5 h-5 text-purple-600" />
                                Your Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 border rounded-xl bg-gray-50 flex flex-col items-center justify-center text-center">
                                    <span className="text-3xl font-black text-gray-900">{favoritesData?.length || 0}</span>
                                    <span className="text-sm text-gray-500 font-medium mt-1">Saved Tools</span>
                                </div>
                                <div className="p-4 border rounded-xl bg-gray-50 flex flex-col items-center justify-center text-center">
                                    <span className="text-3xl font-black text-gray-900">{submissions?.length || 0}</span>
                                    <span className="text-sm text-gray-500 font-medium mt-1">Submitted Tools</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Favorites */}
                <div className="mb-10">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Heart className="w-5 h-5 text-red-500" />
                            Recent Favorites
                        </h2>
                        <Link href="/favorites" className="text-sm text-blue-600 hover:underline font-medium">
                            View All
                        </Link>
                    </div>
                    
                    {favoriteTools.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {favoriteTools.map((tool) => (
                                <ToolCard key={tool.id} tool={tool} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 border rounded-xl bg-gray-50">
                            <Heart className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 mb-4">You haven't favorited any tools yet.</p>
                            <Link href="/">
                                <Button>Explore Tools</Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Submissions */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <PlusCircle className="w-5 h-5 text-green-500" />
                            Your Submitted Tools
                        </h2>
                        <Link href="/submit">
                            <Button size="sm" variant="outline">Submit Another</Button>
                        </Link>
                    </div>

                    {submissions && submissions.length > 0 ? (
                        <div className="bg-white border rounded-xl overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-3 font-semibold text-gray-900">Tool Name</th>
                                        <th className="px-6 py-3 font-semibold text-gray-900">Status</th>
                                        <th className="px-6 py-3 font-semibold text-gray-900">Date Submitted</th>
                                        <th className="px-6 py-3 font-semibold text-gray-900 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {submissions.map((sub) => {
                                        const liveTool = liveTools.find(t => t.name.toLowerCase() === sub.tool_name.toLowerCase());
                                        
                                        return (
                                            <tr key={sub.id} className="border-b last:border-0 hover:bg-gray-50">
                                                <td className="px-6 py-4 font-medium text-gray-900">{sub.tool_name}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                        sub.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                        sub.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                        'bg-amber-100 text-amber-700'
                                                    }`}>
                                                        {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">
                                                    {new Date(sub.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {sub.status === 'approved' && liveTool ? (
                                                        <BoostButton 
                                                            toolSlug={liveTool.slug} 
                                                            toolName={liveTool.name} 
                                                            isFeatured={liveTool.featured} 
                                                        />
                                                    ) : (
                                                        <span className="text-xs text-gray-400">-</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12 border rounded-xl bg-gray-50">
                            <PlusCircle className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 mb-4">You haven't submitted any tools yet.</p>
                            <Link href="/submit">
                                <Button>Submit a Tool</Button>
                            </Link>
                        </div>
                    )}
                </div>

            </main>

            <Footer />
        </div>
    );
}
