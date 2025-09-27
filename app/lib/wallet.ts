'use client';

import { createWalletClient, custom, http, createPublicClient, type WalletClient, type PublicClient } from 'viem';
import { base } from 'viem/chains';
import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk';

// Wallet configuration
const WALLET_CONFIG = {
  base: {
    chain: base,
    rpcUrl: 'https://mainnet.base.org',
    chainId: 8453
  }
};

// Coinbase Wallet SDK instance
let coinbaseWalletSDK: CoinbaseWalletSDK | null = null;

// Wallet clients
let walletClient: WalletClient | null = null;
let publicClient: PublicClient | null = null;

export class WalletService {
  private static instance: WalletService;

  public static getInstance(): WalletService {
    if (!WalletService.instance) {
      WalletService.instance = new WalletService();
    }
    return WalletService.instance;
  }

  // Initialize Coinbase Wallet SDK
  private initializeCoinbaseWallet(): CoinbaseWalletSDK {
    if (!coinbaseWalletSDK) {
      coinbaseWalletSDK = new CoinbaseWalletSDK({
        appName: 'SudoPath',
        appLogoUrl: '/logo.png',
        darkMode: false,
        overrideIsMetaMask: false
      });
    }
    return coinbaseWalletSDK;
  }

  // Connect wallet
  async connectWallet(): Promise<{ address: string; chainId: number } | null> {
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        throw new Error('Wallet connection only available in browser');
      }

      // Initialize Coinbase Wallet
      const sdk = this.initializeCoinbaseWallet();
      const ethereum = sdk.makeWeb3Provider({
        options: {
          rpc: {
            8453: WALLET_CONFIG.base.rpcUrl
          }
        }
      });

      // Request account access
      await ethereum.request({ method: 'eth_requestAccounts' });

      // Create wallet client
      walletClient = createWalletClient({
        chain: base,
        transport: custom(ethereum)
      });

      // Create public client
      publicClient = createPublicClient({
        chain: base,
        transport: http(WALLET_CONFIG.base.rpcUrl)
      });

      // Get connected address
      const [address] = await walletClient.getAddresses();
      const chainId = await walletClient.getChainId();

      return { address, chainId };
    } catch (error) {
      console.error('Error connecting wallet:', error);
      return null;
    }
  }

  // Disconnect wallet
  async disconnectWallet(): Promise<void> {
    try {
      if (coinbaseWalletSDK) {
        // Reset the SDK instance
        coinbaseWalletSDK = null;
        walletClient = null;
        publicClient = null;
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  }

  // Get wallet address
  async getAddress(): Promise<string | null> {
    try {
      if (!walletClient) return null;
      const addresses = await walletClient.getAddresses();
      return addresses[0] || null;
    } catch (error) {
      console.error('Error getting address:', error);
      return null;
    }
  }

  // Get wallet balance
  async getBalance(address: string): Promise<string> {
    try {
      if (!publicClient) throw new Error('Wallet not connected');

      const balance = await publicClient.getBalance({
        address: address as `0x${string}`
      });

      // Convert from wei to ETH
      return (Number(balance) / 1e18).toFixed(4);
    } catch (error) {
      console.error('Error getting balance:', error);
      return '0';
    }
  }

  // Check if wallet is connected
  isConnected(): boolean {
    return walletClient !== null && publicClient !== null;
  }

  // Get wallet client (for advanced operations)
  getWalletClient(): WalletClient | null {
    return walletClient;
  }

  // Get public client (for read operations)
  getPublicClient(): PublicClient | null {
    return publicClient;
  }

  // Switch to Base network
  async switchToBase(): Promise<boolean> {
    try {
      if (!walletClient) return false;

      await walletClient.switchChain({ id: WALLET_CONFIG.base.chainId });
      return true;
    } catch (error) {
      console.error('Error switching to Base:', error);
      return false;
    }
  }

  // Send transaction (for micro-payments)
  async sendTransaction(
    to: string,
    value: string,
    data?: string
  ): Promise<string | null> {
    try {
      if (!walletClient) throw new Error('Wallet not connected');

      const hash = await walletClient.sendTransaction({
        to: to as `0x${string}`,
        value: BigInt(value),
        data: data as `0x${string}` | undefined
      });

      return hash;
    } catch (error) {
      console.error('Error sending transaction:', error);
      return null;
    }
  }

  // Sign message
  async signMessage(message: string): Promise<string | null> {
    try {
      if (!walletClient) throw new Error('Wallet not connected');

      const address = await this.getAddress();
      if (!address) return null;

      const signature = await walletClient.signMessage({
        account: address as `0x${string}`,
        message
      });

      return signature;
    } catch (error) {
      console.error('Error signing message:', error);
      return null;
    }
  }

  // Check if user has sufficient balance for transaction
  async hasSufficientBalance(
    address: string,
    requiredAmount: string
  ): Promise<boolean> {
    try {
      const balance = await this.getBalance(address);
      const balanceNum = parseFloat(balance);
      const requiredNum = parseFloat(requiredAmount);

      return balanceNum >= requiredNum;
    } catch (error) {
      console.error('Error checking balance:', error);
      return false;
    }
  }

  // Get gas estimate for transaction
  async estimateGas(
    to: string,
    value: string,
    data?: string
  ): Promise<string | null> {
    try {
      if (!publicClient) return null;

      const gasEstimate = await publicClient.estimateGas({
        to: to as `0x${string}`,
        value: BigInt(value),
        data: data as `0x${string}` | undefined
      });

      return gasEstimate.toString();
    } catch (error) {
      console.error('Error estimating gas:', error);
      return null;
    }
  }

  // Get current gas price
  async getGasPrice(): Promise<string | null> {
    try {
      if (!publicClient) return null;

      const gasPrice = await publicClient.getGasPrice();
      return gasPrice.toString();
    } catch (error) {
      console.error('Error getting gas price:', error);
      return null;
    }
  }

  // Format address for display
  formatAddress(address: string): string {
    if (address.length < 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  // Validate address
  isValidAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  // Get network info
  getNetworkInfo() {
    return {
      name: 'Base',
      chainId: WALLET_CONFIG.base.chainId,
      rpcUrl: WALLET_CONFIG.base.rpcUrl,
      blockExplorer: 'https://basescan.org'
    };
  }
}

// Token-related utilities for micro-transactions
export class TokenService {
  private walletService: WalletService;

  constructor() {
    this.walletService = WalletService.getInstance();
  }

  // Check $DEGEN balance (example token)
  async getDegenBalance(address: string): Promise<string> {
    try {
      const publicClient = this.walletService.getPublicClient();
      if (!publicClient) return '0';

      // DEGEN contract address on Base
      const degenContract = '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed3';

      // This would require ERC20 ABI and contract interaction
      // For now, return placeholder
      return '0';
    } catch (error) {
      console.error('Error getting DEGEN balance:', error);
      return '0';
    }
  }

  // Transfer tokens (for payments)
  async transferTokens(
    tokenAddress: string,
    to: string,
    amount: string
  ): Promise<string | null> {
    try {
      const walletClient = this.walletService.getWalletClient();
      if (!walletClient) return null;

      // This would require ERC20 transfer function encoding
      // For now, return placeholder
      return null;
    } catch (error) {
      console.error('Error transferring tokens:', error);
      return null;
    }
  }
}

// Export singleton instances
export const walletService = WalletService.getInstance();
export const tokenService = new TokenService();

