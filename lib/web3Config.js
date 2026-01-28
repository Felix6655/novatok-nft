'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

export const config = getDefaultConfig({
  appName: 'NovaTok Explorer',
  projectId: projectId || 'demo-project-id',
  chains: [sepolia],
  ssr: true,
});

export const isWalletConnectConfigured = Boolean(projectId);
