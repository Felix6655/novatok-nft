import './globals.css';
import Providers from '@/components/Providers';
import Navbar from '@/components/Navbar';
import CosmicBackground from '@/components/CosmicBackground';
import { ToastProvider } from '@/components/Toast';

export const metadata = {
  title: 'NovaTok Explorer - NFT Marketplace & AI Create Hub',
  description: 'Create, discover, generate, and trade NFTs on Ethereum Sepolia',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen text-white antialiased">
        <Providers>
          <ToastProvider>
            <CosmicBackground />
            <Navbar />
            <main className="pt-16">
              {children}
            </main>
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}
