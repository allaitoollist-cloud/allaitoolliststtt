'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import WebmasterDashboard from '@/components/webmaster/WebmasterDashboard';
import WebmasterHeader from '@/components/webmaster/WebmasterHeader';

export default function WebmasterPageClient() {
    const [apiKey, setApiKey] = useState<string>('');
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const handleAuthenticate = (key: string) => {
        setApiKey(key);
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        setApiKey('');
        setIsAuthenticated(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <WebmasterHeader
                isAuthenticated={isAuthenticated}
                onLogout={handleLogout}
            />

            <main className="container mx-auto px-4 py-8">
                {!isAuthenticated ? (
                    <AuthenticationForm onAuthenticate={handleAuthenticate} />
                ) : (
                    <WebmasterDashboard apiKey={apiKey} />
                )}
            </main>
        </div>
    );
}

function AuthenticationForm({ onAuthenticate }: { onAuthenticate: (key: string) => void }) {
    const [inputKey, setInputKey] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputKey.trim()) {
            onAuthenticate(inputKey.trim());
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto mt-20"
        >
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-4">
                        Bing Webmaster API Interface
                    </h1>
                    <p className="text-gray-300">
                        Enter your API key to manage your website indexing and analytics
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="apiKey" className="block text-sm font-medium text-gray-200 mb-2">
                            API Key
                        </label>
                        <input
                            type="text"
                            id="apiKey"
                            value={inputKey}
                            onChange={(e) => setInputKey(e.target.value)}
                            placeholder="Enter your Bing Webmaster API Key"
                            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        Connect to Webmaster API
                    </motion.button>
                </form>

                <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <h3 className="text-sm font-semibold text-blue-300 mb-2">How to get your API Key:</h3>
                    <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
                        <li>Visit Bing Webmaster Tools</li>
                        <li>Navigate to Settings → API Access</li>
                        <li>Generate or copy your API key</li>
                        <li>Paste it above to connect</li>
                    </ol>
                </div>
            </div>
        </motion.div>
    );
}
