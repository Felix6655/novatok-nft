"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wallet, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { isContractConfigured } from "@/lib/web3/nft";

export default function Navbar() {
  const pathname = usePathname();
  const [walletAddress, setWalletAddress] = useState("");
  const [walletError, setWalletError] = useState("");

  const connectWallet = async () => {
    try {
      setWalletError("");

      if (!window.ethereum) {
        setWalletError("MetaMask not detected. Please install MetaMask.");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts?.[0]) setWalletAddress(accounts[0]);
    } catch (err) {
      console.error("Wallet connect error:", err);
      setWalletError("Wallet connection failed. Try again.");
    }
  };

  useEffect(() => {
    // optional: auto-read accounts if already connected
    const readAccounts = async () => {
      try {
        if (!window.ethereum) return;
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts?.[0]) setWalletAddress(accounts[0]);
      } catch {}
    };
    readAccounts();
  }, []);

  return (
    <header>
      {/* your JSX here */}
      <button onClick={connectWallet}>
        {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "Connect"}
      </button>

      {walletError ? <p>{walletError}</p> : null}
    </header>
  );
}
