'use client';

import { useComparison } from '@/contexts/ComparisonContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, ExternalLink, DollarSign, Tag } from 'lucide-react';
import Link from 'next/link';

interface ComparisonModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ComparisonModal({ isOpen, onClose }: ComparisonModalProps) {
    const { comparisonTools, removeFromComparison } = useComparison();

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <span className="bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Tool Comparison
                        </span>
                    </DialogTitle>
                </DialogHeader>

                <div className="mt-6 overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left p-4 font-semibold sticky left-0 bg-background z-10">
                                    Feature
                                </th>
                                {comparisonTools.map((tool) => (
                                    <th key={tool.id} className="p-4 min-w-[250px]">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="relative group">
                                                <button
                                                    onClick={() => removeFromComparison(tool.id)}
                                                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                                                    <span className="text-2xl">🤖</span>
                                                </div>
                                            </div>
                                            <h3 className="font-bold text-center">{tool.name}</h3>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {/* Category */}
                            <tr className="border-b border-white/5 hover:bg-white/5">
                                <td className="p-4 font-medium sticky left-0 bg-background">
                                    <div className="flex items-center gap-2">
                                        <Tag className="h-4 w-4 text-primary" />
                                        Category
                                    </div>
                                </td>
                                {comparisonTools.map((tool) => (
                                    <td key={tool.id} className="p-4 text-center">
                                        <span className="inline-block px-3 py-1 bg-primary/10 border border-primary/30 rounded-full text-sm">
                                            {tool.category}
                                        </span>
                                    </td>
                                ))}
                            </tr>

                            {/* Pricing */}
                            <tr className="border-b border-white/5 hover:bg-white/5">
                                <td className="p-4 font-medium sticky left-0 bg-background">
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="h-4 w-4 text-primary" />
                                        Pricing
                                    </div>
                                </td>
                                {comparisonTools.map((tool) => (
                                    <td key={tool.id} className="p-4 text-center">
                                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${tool.pricing === 'Free'
                                            ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                                            : tool.pricing === 'Freemium'
                                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                                                : 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                                            }`}>
                                            {tool.pricing}
                                        </span>
                                    </td>
                                ))}
                            </tr>

                            {/* Description */}
                            <tr className="border-b border-white/5 hover:bg-white/5">
                                <td className="p-4 font-medium sticky left-0 bg-background">
                                    Description
                                </td>
                                {comparisonTools.map((tool) => (
                                    <td key={tool.id} className="p-4 text-sm text-muted-foreground">
                                        {tool.shortDescription}
                                    </td>
                                ))}
                            </tr>

                            {/* Tags */}
                            <tr className="border-b border-white/5 hover:bg-white/5">
                                <td className="p-4 font-medium sticky left-0 bg-background">
                                    Tags
                                </td>
                                {comparisonTools.map((tool) => (
                                    <td key={tool.id} className="p-4">
                                        <div className="flex flex-wrap gap-1 justify-center">
                                            {Array.isArray(tool.tags) && tool.tags.slice(0, 3).map((tag, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-2 py-0.5 bg-secondary/50 rounded text-xs"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                ))}
                            </tr>

                            {/* Website Link */}
                            <tr className="border-b border-white/5 hover:bg-white/5">
                                <td className="p-4 font-medium sticky left-0 bg-background">
                                    Website
                                </td>
                                {comparisonTools.map((tool) => (
                                    <td key={tool.id} className="p-4 text-center">
                                        <Link
                                            href={tool.url}
                                            target="_blank"
                                            className="inline-flex items-center gap-1 text-primary hover:underline text-sm"
                                        >
                                            Visit Site
                                            <ExternalLink className="h-3 w-3" />
                                        </Link>
                                    </td>
                                ))}
                            </tr>

                            {/* View Details */}
                            <tr>
                                <td className="p-4 font-medium sticky left-0 bg-background">
                                    Actions
                                </td>
                                {comparisonTools.map((tool) => (
                                    <td key={tool.id} className="p-4 text-center">
                                        <Link href={`/tool/${tool.slug}`}>
                                            <Button
                                                size="sm"
                                                className="rounded-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90"
                                            >
                                                View Details
                                            </Button>
                                        </Link>
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 flex justify-end">
                    <Button variant="outline" onClick={onClose} className="rounded-full">
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
