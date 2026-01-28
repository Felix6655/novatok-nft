'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { isWalletConnectConfigured } from '@/lib/web3Config';
import { SEPOLIA_CHAIN_ID } from '@/lib/constants';
import { Wallet, AlertCircle } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/marketplace', label: 'Marketplace' },
  { href: '/create', label: 'Create' },
  { href: '/mint', label: 'Mint' },
  { href: '/my-nfts', label: 'My NFTs' },
];

export default function Navbar() {
  const pathname = usePathname();
  const chainId = isWalletConnectConfigured ? useChainId() : null;
  const { isConnected } = isWalletConnectConfigured ? useAccount() : { isConnected: false };
  const { switchChain } = isWalletConnectConfigured ? useSwitchChain() : { switchChain: null };
  
  const isCorrectNetwork = chainId === SEPOLIA_CHAIN_ID;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white">
              N
            </div>
            <span className="text-xl font-bold text-white">NovaTok</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname === link.href
                    ? 'bg-white/10 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Wallet Section */}
          <div className="flex items-center gap-3">
            {isWalletConnectConfigured ? (
              <>
                {isConnected && (
                  <>
                    {isCorrectNetwork ? (
                      <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/20 border border-green-500/30">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-sm text-green-300">Connected to Sepolia</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => switchChain?.({ chainId: SEPOLIA_CHAIN_ID })}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/30 hover:bg-orange-500/30 transition-colors"
                      >
                        <AlertCircle className="w-4 h-4 text-orange-400" />
                        <span className="text-sm text-orange-300">Switch to Sepolia</span>
                      </button>
                    )}
                  </>
                )}
                <ConnectButton.Custom>
                  {({
                    account,
                    chain,
                    openAccountModal,
                    openChainModal,
                    openConnectModal,
                    mounted,
                  }) => {
                    const ready = mounted;
                    const connected = ready && account && chain;

                    return (
                      <div
                        {...(!ready && {
                          'aria-hidden': true,
                          style: {
                            opacity: 0,
                            pointerEvents: 'none',
                            userSelect: 'none',
                          },
                        })}
                      >
                        {(() => {
                          if (!connected) {
                            return (
                              <button
                                onClick={openConnectModal}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium transition-all"
                              >
                                <Wallet className="w-4 h-4" />
                                Connect
                              </button>
                            );
                          }

                          return (
                            <button
                              onClick={openAccountModal}
                              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-all border border-white/10"
                            >
                              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                              {account.displayName}
                            </button>
                          );
                        })()}
                      </div>
                    );
                  }}
                </ConnectButton.Custom>
              </>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500/20 border border-yellow-500/30">
                <AlertCircle className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-yellow-300">WalletConnect not configured</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
