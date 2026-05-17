import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ArrowRight, Layers } from 'lucide-react';
import Link from 'next/link';

interface TopicClusterSidebarProps {
    category?: string;
}

export function TopicClusterSidebar({ category }: TopicClusterSidebarProps) {
    const clusters = [
        {
            name: "AI Growth Engine",
            intent: "Growth",
            topics: ["AEO Strategies", "Lead Gen AI", "Conversion Optimization"],
            active: category === "Marketing"
        },
        {
            name: "Synthesis Lab",
            intent: "Creation",
            topics: ["Generative Writing", "Visual Arts", "Video Models"],
            active: category === "Writing" || category === "Design"
        },
        {
            name: "Ops Automation",
            intent: "Efficiency",
            topics: ["Agentic Workflows", "Smart Data", "Infrastructure"],
            active: category === "Productivity" || category === "Code"
        }
    ];

    return (
        <div className="space-y-8">
            <div className="p-6 rounded-2xl bg-[#0F0F16] border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
                    <Layers className="w-4 h-4 text-primary" />
                </div>

                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Sparkles className="h-3 w-3 text-emerald-400" />
                    Architecture of Intent
                </h3>

                <div className="space-y-6">
                    {clusters.map((cluster, i) => (
                        <div key={i} className={`relative pl-4 border-l-2 ${cluster.active ? 'border-primary' : 'border-white/10 opacity-60'}`}>
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">INTENT: {cluster.intent}</span>
                                {cluster.active && <Badge className="bg-primary/20 text-primary border-primary/30 h-4 px-1.5 text-[8px]">ACTIVE CLUSTER</Badge>}
                            </div>
                            <h4 className="text-sm font-bold text-white mb-2">{cluster.name}</h4>
                            <div className="space-y-1">
                                {cluster.topics.map((t, j) => (
                                    <div key={j} className="text-[11px] text-gray-400 flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-white/20" />
                                        {t}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 text-center">
                    <p className="text-[10px] text-gray-600 mb-4 leading-relaxed italic">
                        "Your content must be a synthesized source for Answer Engines."
                    </p>
                    <Link href="/blog" className="text-[10px] font-black text-white hover:text-primary transition-colors flex items-center justify-center gap-2">
                        EXPLORE FULL KNOWLEDGE GRAPH <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/10">
                <h3 className="text-xs font-bold text-white mb-2">AEO Score: Optimized</h3>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                </div>
                <p className="text-[10px] text-gray-400 mt-2">Semantically structured for Generative Synthesis (GEO Ready).</p>
            </div>
        </div>
    );
}
