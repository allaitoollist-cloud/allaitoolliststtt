'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Eye, MousePointerClick, Calendar } from 'lucide-react';

interface AnalyticsPanelProps {
    apiKey: string;
}

interface TrafficStat {
    date: string;
    impressions: number;
    clicks: number;
    ctr: number;
}

export default function AnalyticsPanel({ apiKey }: AnalyticsPanelProps) {
    const [siteUrl, setSiteUrl] = useState('');
    const [dateRange, setDateRange] = useState('30');
    const [stats, setStats] = useState<TrafficStat[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchStats = async () => {
        setIsLoading(true);

        // Simulate API call (replace with actual Bing Webmaster API call)
        await new Promise(resolve => setTimeout(resolve, 1500));

        const mockStats: TrafficStat[] = Array.from({ length: parseInt(dateRange) }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (parseInt(dateRange) - i - 1));
            const impressions = Math.floor(Math.random() * 10000) + 1000;
            const clicks = Math.floor(impressions * (Math.random() * 0.1 + 0.02));

            return {
                date: date.toISOString().split('T')[0],
                impressions,
                clicks,
                ctr: (clicks / impressions) * 100
            };
        });

        setStats(mockStats);
        setIsLoading(false);
    };

    const totalImpressions = stats.reduce((sum, stat) => sum + stat.impressions, 0);
    const totalClicks = stats.reduce((sum, stat) => sum + stat.clicks, 0);
    const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-2">Traffic and Analytics</h2>
                <p className="text-gray-300">View your website's performance metrics from Bing search</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="analyticsUrl" className="block text-sm font-medium text-gray-200 mb-2">
                        Website URL
                    </label>
                    <input
                        type="url"
                        id="analyticsUrl"
                        value={siteUrl}
                        onChange={(e) => setSiteUrl(e.target.value)}
                        placeholder="https://yoursite.com"
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label htmlFor="dateRange" className="block text-sm font-medium text-gray-200 mb-2">
                        Date Range
                    </label>
                    <select
                        id="dateRange"
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="7">Last 7 days</option>
                        <option value="30">Last 30 days</option>
                        <option value="90">Last 90 days</option>
                    </select>
                </div>
            </div>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={fetchStats}
                disabled={isLoading || !siteUrl}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Loading Analytics...' : 'Fetch Analytics'}
            </motion.button>

            {stats.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl p-6">
                            <div className="flex items-center justify-between mb-2">
                                <Eye className="w-8 h-8 text-blue-400" />
                                <TrendingUp className="w-5 h-5 text-green-400" />
                            </div>
                            <h3 className="text-sm font-medium text-gray-300 mb-1">Total Impressions</h3>
                            <p className="text-3xl font-bold text-white">{totalImpressions.toLocaleString()}</p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl p-6">
                            <div className="flex items-center justify-between mb-2">
                                <MousePointerClick className="w-8 h-8 text-purple-400" />
                                <TrendingUp className="w-5 h-5 text-green-400" />
                            </div>
                            <h3 className="text-sm font-medium text-gray-300 mb-1">Total Clicks</h3>
                            <p className="text-3xl font-bold text-white">{totalClicks.toLocaleString()}</p>
                        </div>

                        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-6">
                            <div className="flex items-center justify-between mb-2">
                                <Calendar className="w-8 h-8 text-green-400" />
                                <TrendingUp className="w-5 h-5 text-green-400" />
                            </div>
                            <h3 className="text-sm font-medium text-gray-300 mb-1">Average CTR</h3>
                            <p className="text-3xl font-bold text-white">{avgCTR.toFixed(2)}%</p>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10 overflow-x-auto">
                        <h3 className="text-xl font-bold text-white mb-4">Daily Performance</h3>
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Date</th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-300">Impressions</th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-300">Clicks</th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-300">CTR</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.map((stat, index) => (
                                    <motion.tr
                                        key={index}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                    >
                                        <td className="py-3 px-4 text-sm text-white">{stat.date}</td>
                                        <td className="py-3 px-4 text-sm text-right text-blue-300">{stat.impressions.toLocaleString()}</td>
                                        <td className="py-3 px-4 text-sm text-right text-purple-300">{stat.clicks.toLocaleString()}</td>
                                        <td className="py-3 px-4 text-sm text-right text-green-300">{stat.ctr.toFixed(2)}%</td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
