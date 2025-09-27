'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Power, Copy, ExternalLink } from 'lucide-react';
import { walletService } from '@/app/lib/wallet';
import { cn } from '@/app/lib/utils';

interface WalletConnectProps {
  className?: string;
  variant?: 'button' | 'card' | 'inline';
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
}

export function WalletConnect({
  className,
  variant = 'button',
  onConnect,
  onDisconnect
}: WalletConnectProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check connection status on mount
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    const connected = walletService.isConnected();
    setIsConnected(connected);

    if (connected) {
      const addr = await walletService.getAddress();
      setAddress(addr);

      if (addr) {
        const bal = await walletService.getBalance(addr);
        setBalance(bal);
      }
    }
  };

  const handleConnect = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await walletService.connectWallet();

      if (result) {
        setIsConnected(true);
        setAddress(result.address);
        const bal = await walletService.getBalance(result.address);
        setBalance(bal);

        onConnect?.(result.address);
      } else {
        setError('Failed to connect wallet');
      }
    } catch (err) {
      console.error('Wallet connection error:', err);
      setError('Failed to connect wallet. Please try again.');
    }

    setIsLoading(false);
  };

  const handleDisconnect = async () => {
    await walletService.disconnectWallet();
    setIsConnected(false);
    setAddress(null);
    setBalance('0');
    onDisconnect?.();
  };

  const copyAddress = async () => {
    if (address) {
      try {
        await navigator.clipboard.writeText(address);
        // Could add a toast notification here
      } catch (err) {
        console.error('Failed to copy address:', err);
      }
    }
  };

  const openInExplorer = () => {
    if (address) {
      const network = walletService.getNetworkInfo();
      window.open(`${network.blockExplorer}/address/${address}`, '_blank');
    }
  };

  if (variant === 'inline') {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        {isConnected && address ? (
          <>
            <div className="flex items-center space-x-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{walletService.formatAddress(address)}</span>
            </div>
            <button
              onClick={handleDisconnect}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
              title="Disconnect wallet"
            >
              <Power className="w-4 h-4" />
            </button>
          </>
        ) : (
          <button
            onClick={handleConnect}
            disabled={isLoading}
            className="flex items-center space-x-2 px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
            ) : (
              <Wallet className="w-4 h-4" />
            )}
            <span>{isLoading ? 'Connecting...' : 'Connect Wallet'}</span>
          </button>
        )}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "bg-card border rounded-lg p-4 shadow-sm",
          className
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Wallet className="w-5 h-5 text-primary" />
            <h3 className="font-medium">Wallet Connection</h3>
          </div>
          {isConnected && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-600">Connected</span>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {isConnected && address ? (
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Address</label>
              <div className="flex items-center space-x-2 mt-1">
                <code className="flex-1 px-2 py-1 bg-muted rounded text-sm font-mono">
                  {walletService.formatAddress(address)}
                </code>
                <button
                  onClick={copyAddress}
                  className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                  title="Copy address"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={openInExplorer}
                  className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                  title="View in explorer"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Balance</label>
              <p className="text-lg font-semibold mt-1">{balance} ETH</p>
            </div>

            <button
              onClick={handleDisconnect}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
            >
              <Power className="w-4 h-4" />
              <span>Disconnect</span>
            </button>
          </div>
        ) : (
          <button
            onClick={handleConnect}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
            ) : (
              <Wallet className="w-4 h-4" />
            )}
            <span>{isLoading ? 'Connecting...' : 'Connect Coinbase Wallet'}</span>
          </button>
        )}

        <div className="mt-4 text-xs text-muted-foreground">
          <p>Connect your wallet to enable micro-transactions and premium features.</p>
        </div>
      </motion.div>
    );
  }

  // Default button variant
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {isConnected && address ? (
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium">
              {walletService.formatAddress(address)}
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            {balance} ETH
          </div>
          <button
            onClick={handleDisconnect}
            className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
            title="Disconnect wallet"
          >
            <Power className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleConnect}
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
          ) : (
            <Wallet className="w-4 h-4" />
          )}
          <span>{isLoading ? 'Connecting...' : 'Connect Wallet'}</span>
        </motion.button>
      )}

      {error && (
        <div className="text-sm text-destructive">{error}</div>
      )}
    </div>
  );
}

