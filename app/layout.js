import './globals.css';
import Providers from '@/components/Providers';
import Navbar from '@/components/Navbar';
import CosmicBackground from '@/components/CosmicBackground';

export const metadata = {
  title: 'NovaTok Explorer - NFT Marketplace & AI Create Hub',
  description: 'Create, discover, generate, and trade NFTs on Ethereum Sepolia',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen text-white antialiased">
        <Providers>
          <CosmicBackground />
          <Navbar />
          <main className="pt-16">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
