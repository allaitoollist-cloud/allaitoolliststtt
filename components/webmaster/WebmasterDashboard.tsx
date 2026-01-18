'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import IndexingPanel from './IndexingPanel';
import AnalyticsPanel from './AnalyticsPanel';
import SitesPanel from './SitesPanel';
import { BarChart3, Globe, Upload } from 'lucide-react';

interface WebmasterDashboardProps {
    apiKey: string;
}

export default function WebmasterDashboard({ apiKey }: WebmasterDashboardProps) {
    const [activeTab, setActiveTab] = useState('indexing');

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-white/5 p-1 rounded-lg">
                        <TabsTrigger
                            value="indexing"
                            className="flex items-center space-x-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                        >
                            <Upload className="w-4 h-4" />
                            <span>URL Indexing</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="analytics"
                            className="flex items-center space-x-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                        >
                            <BarChart3 className="w-4 h-4" />
                            <span>Analytics</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="sites"
                            className="flex items-center space-x-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                        >
                            <Globe className="w-4 h-4" />
                            <span>Sites</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="indexing" className="mt-6">
                        <IndexingPanel apiKey={apiKey} />
                    </TabsContent>

                    <TabsContent value="analytics" className="mt-6">
                        <AnalyticsPanel apiKey={apiKey} />
                    </TabsContent>

                    <TabsContent value="sites" className="mt-6">
                        <SitesPanel apiKey={apiKey} />
                    </TabsContent>
                </Tabs>
            </div>
        </motion.div>
    );
}
