'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, ExternalLink, CheckCircle, XCircle } from 'lucide-react';

interface SitesPanelProps {
    apiKey: string;
}

interface Site {
    url: string;
    verified: boolean;
    addedDate: string;
}

export default function SitesPanel({ apiKey }: SitesPanelProps) {
    const [sites, setSites] = useState<Site[]>([
        {
            url: 'https://example.com',
            verified: true,
            addedDate: '2024-01-15'
        },
        {
            url: 'https://blog.example.com',
            verified: false,
            addedDate: '2024-01-18'
        }
    ]);
    const [newSiteUrl, setNewSiteUrl] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const handleAddSite = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsAdding(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        const newSite: Site = {
            url: newSiteUrl,
            verified: false,
            addedDate: new Date().toISOString().split('T')[0]
        };

        setSites([...sites, newSite]);
        setNewSiteUrl('');
        setIsAdding(false);
    };

    const handleRemoveSite = async (url: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setSites(sites.filter(site => site.url !== url));
    };

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-2">Manage Your Sites</h2>
                <p className="text-gray-300">Add, verify, and manage websites in Bing Webmaster Tools</p>
            </div>

            {/* Add New Site Form */}
            <form onSubmit={handleAddSite} className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Add New Site</h3>
                <div className="flex gap-3">
                    <input
                        type="url"
                        value={newSiteUrl}
                        onChange={(e) => setNewSiteUrl(e.target.value)}
                        placeholder="https://yoursite.com"
                        className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={isAdding}
                        className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                        <Plus className="w-5 h-5" />
                        <span>{isAdding ? 'Adding...' : 'Add Site'}</span>
                    </motion.button>
                </div>
            </form>

            {/* Sites List */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Your Sites ({sites.length})</h3>
                <div className="space-y-3">
                    {sites.map((site, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                        >
                            <div className="flex items-center space-x-4 flex-1">
                                {site.verified ? (
                                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                                ) : (
                                    <XCircle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2">
                                        <p className="text-white font-medium truncate">{site.url}</p>
                                        <a
                                            href={site.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:text-blue-300 transition-colors"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                    <div className="flex items-center space-x-4 mt-1">
                                        <span className={`text-xs px-2 py-1 rounded ${site.verified
                                                ? 'bg-green-500/20 text-green-300'
                                                : 'bg-yellow-500/20 text-yellow-300'
                                            }`}>
                                            {site.verified ? 'Verified' : 'Pending Verification'}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            Added: {site.addedDate}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleRemoveSite(site.url)}
                                className="ml-4 p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
                            >
                                <Trash2 className="w-5 h-5" />
                            </motion.button>
                        </motion.div>
                    ))}
                </div>

                {sites.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-400">No sites added yet. Add your first site above!</p>
                    </div>
                )}
            </div>

            {/* Verification Instructions */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-blue-300 mb-3">Site Verification Steps</h3>
                <ol className="space-y-2 text-sm text-gray-300 list-decimal list-inside">
                    <li>Add your site using the form above</li>
                    <li>Download the verification file from Bing Webmaster Tools</li>
                    <li>Upload the file to your website's root directory</li>
                    <li>Click "Verify" in Bing Webmaster Tools</li>
                    <li>Once verified, you can start using all API features</li>
                </ol>
            </div>
        </div>
    );
}
