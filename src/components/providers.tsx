'use client';

import { PrivyProvider } from '@privy-io/react-auth';

export default function Providers({ children }: { children: React.ReactNode }) {
    const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || '';

    // If appId is missing (e.g., during build-time prerendering), 
    // we bypass the provider to prevent build failure.
    if (!appId) {
        return <>{children}</>;
    }

    return (
        <PrivyProvider
            appId={appId}
            config={{
                appearance: {
                    theme: 'dark',
                    accentColor: '#00D1FF', // Arc Blue
                    showWalletLoginFirst: true,
                },
                loginMethods: ['email', 'google', 'wallet'],
                embeddedWallets: {
                    createOnLogin: 'off',
                    noPromptOnSignature: true,
                },
            }}
            onSuccess={() => {
                console.log('✅ Privy login successful');
            }}
        >
            {children}
        </PrivyProvider>
    );
}
