'use client';

import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { config } from '@/lib/web3Config';
import '@rainbow-me/rainbowkit/styles.css';

// Check if WalletConnect is configured
const isWalletConnectConfigured = Boolean(process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID);

export default function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  }));
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render Web3 providers until client-side
  if (!mounted) {
    return (
      <div className="min-h-screen">
        {children}
      </div>
    );
  }

  // If WalletConnect is not configured, render without Web3 providers
  if (!isWalletConnectConfigured) {
    return (
      <div className="min-h-screen">
        {children}
      </div>
    );
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#a855f7',
            accentColorForeground: 'white',
            borderRadius: 'medium',
            fontStack: 'system',
            overlayBlur: 'small',
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

// Export hook to check if wallet providers are available
export function useWalletProviders() {
  const [available, setAvailable] = useState(false);
  
  useEffect(() => {
    setAvailable(isWalletConnectConfigured);
  }, []);
  
  return available;
}
