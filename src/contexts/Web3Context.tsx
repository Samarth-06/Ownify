import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { toast } from 'sonner';
import { CHAIN_CONFIG, COPYRIGHT_REGISTRY_ABI, getContractAddress } from '@/config/web3';

interface Web3ContextType {
  account: string | null;
  isConnected: boolean;
  isCorrectNetwork: boolean;
  provider: ethers.BrowserProvider | null;
  contract: ethers.Contract | null;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchToAmoy: () => Promise<void>;
  balance: string;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

const POLYGON_AMOY_CHAINID = CHAIN_CONFIG.POLYGON_AMOY.chainId;

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [balance, setBalance] = useState('0');

  const checkNetwork = useCallback(async (ethereumProvider: any) => {
    try {
      const chainIdHex = await ethereumProvider.request({ method: 'eth_chainId' });
      const chainId = parseInt(chainIdHex, 16);
      return chainId === POLYGON_AMOY_CHAINID;
    } catch {
      return false;
    }
  }, []);

  const initializeContract = useCallback(
    async (ethereumProvider: any, userAccount: string) => {
      const browserProvider = new ethers.BrowserProvider(ethereumProvider);
      const signer = await browserProvider.getSigner();

      const contractAddress = getContractAddress();
      if (!contractAddress) {
        console.warn('Contract address not found in environment');
        return null;
      }

      const copyrightContract = new ethers.Contract(contractAddress, COPYRIGHT_REGISTRY_ABI, signer);
      return { provider: browserProvider, contract: copyrightContract };
    },
    []
  );

  const connectWallet = useCallback(async () => {
    if (typeof window.ethereum === 'undefined') {
      toast.error('MetaMask not installed');
      return;
    }

    try {
      setIsConnecting(true);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const userAccount = accounts[0];
      setAccount(userAccount);
      setIsConnected(true);

      // Check network
      const isCorrect = await checkNetwork(window.ethereum);
      setIsCorrectNetwork(isCorrect);

      if (!isCorrect) {
        toast.error('Please switch to Polygon Amoy network');
        return;
      }

      // Initialize contract
      const result = await initializeContract(window.ethereum, userAccount);
      if (result) {
        setProvider(result.provider);
        setContract(result.contract);

        // Get balance
        const bal = await result.provider.getBalance(userAccount);
        setBalance(ethers.formatEther(bal));
      }

      toast.success(`Connected: ${userAccount.slice(0, 6)}...${userAccount.slice(-4)}`);
    } catch (error) {
      console.error('Connection failed:', error);
      toast.error('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  }, [checkNetwork, initializeContract]);

  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setIsConnected(false);
    setProvider(null);
    setContract(null);
    setBalance('0');
    toast.success('Wallet disconnected');
  }, []);

  const switchToAmoy = useCallback(async () => {
    if (typeof window.ethereum === 'undefined') {
      toast.error('MetaMask not installed');
      return;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x13882' }], // 0x13882 = 80002 in hex
      });
      setIsCorrectNetwork(true);
      toast.success('Switched to Polygon Amoy');
    } catch (error: any) {
      if (error.code === 4902) {
        // Chain not added, add it
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x13882',
                chainName: CHAIN_CONFIG.POLYGON_AMOY.name,
                nativeCurrency: CHAIN_CONFIG.POLYGON_AMOY.nativeCurrency,
                rpcUrls: [CHAIN_CONFIG.POLYGON_AMOY.rpc],
                blockExplorerUrls: [CHAIN_CONFIG.POLYGON_AMOY.explorer],
              },
            ],
          });
          setIsCorrectNetwork(true);
          toast.success('Polygon Amoy added and switched');
        } catch (addError) {
          toast.error('Failed to add Polygon Amoy network');
        }
      } else {
        toast.error('Failed to switch network');
      }
    }
  }, []);

  // Listen for account and network changes
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else if (accounts[0] !== account) {
          setAccount(accounts[0]);
        }
      };

      const handleChainChanged = async () => {
        const isCorrect = await checkNetwork(window.ethereum);
        setIsCorrectNetwork(isCorrect);
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [account, checkNetwork, disconnectWallet]);

  const value: Web3ContextType = {
    account,
    isConnected,
    isCorrectNetwork,
    provider,
    contract,
    isConnecting,
    connectWallet,
    disconnectWallet,
    switchToAmoy,
    balance,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within Web3Provider');
  }
  return context;
};
