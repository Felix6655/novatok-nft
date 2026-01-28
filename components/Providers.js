'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { config, isWalletConnectConfigured } from '@/lib/web3Config';
import { useState } from 'react';
import '@rainbow-me/rainbowkit/styles.css';

export default function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient());

  if (!isWalletConnectConfigured) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] text-white">
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
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
