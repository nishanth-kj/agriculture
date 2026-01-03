'use client';

import { useEffect, useState } from 'react';

export default function EnvDebugPage() {
    const [clientEnv, setClientEnv] = useState<string>('');

    useEffect(() => {
        // This runs on the client side
        setClientEnv(process.env.NEXT_PUBLIC_API_URL || 'NOT SET');
    }, []);

    return (
        <div className="min-h-screen bg-background p-10">
            <div className="max-w-2xl mx-auto bg-card border border-border rounded-xl p-8 shadow-lg">
                <h1 className="text-3xl font-bold mb-6">🔍 Environment Variable Debug</h1>

                <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                        <h2 className="font-semibold text-lg mb-2">Client-Side (Browser)</h2>
                        <p className="text-sm text-muted-foreground mb-1">NEXT_PUBLIC_API_URL:</p>
                        <code className={`block p-2 rounded ${clientEnv === 'NOT SET' ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' : 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300'}`}>
                            {clientEnv}
                        </code>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">⚠️ If you see "NOT SET":</h3>
                        <ol className="list-decimal list-inside space-y-1 text-sm">
                            <li>Add <code className="bg-yellow-100 dark:bg-yellow-900 px-1">NEXT_PUBLIC_API_URL=https://agriculture-j9bi.onrender.com/api</code> to your .env file</li>
                            <li>Stop the dev server (Ctrl+C)</li>
                            <li>Run <code className="bg-yellow-100 dark:bg-yellow-900 px-1">npm run dev</code> again</li>
                            <li>Refresh this page</li>
                        </ol>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">✅ If you see the correct URL:</h3>
                        <p className="text-sm">Your environment variable is configured correctly! API calls should now go to the production server.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
