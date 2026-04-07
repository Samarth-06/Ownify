import { useWeb3 } from '@/contexts/Web3Context';
import { Button } from '@/components/ui/button';
import { Wallet, LogOut, AlertCircle, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function WalletConnect() {
  const { account, isConnected, isCorrectNetwork, connectWallet, disconnectWallet, switchToAmoy, isConnecting, balance } = useWeb3();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  if (!isConnected) {
    return (
      <Button
        onClick={connectWallet}
        disabled={isConnecting}
        className="gap-2"
        variant="outline"
      >
        <Wallet size={16} />
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {!isCorrectNetwork && (
        <Button
          onClick={switchToAmoy}
          variant="destructive"
          className="gap-2 text-xs"
        >
          <AlertCircle size={14} />
          Switch to Amoy
        </Button>
      )}

      {isCorrectNetwork && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/30">
          <CheckCircle size={14} className="text-green-500" />
          <span className="text-xs text-green-500">Connected</span>
        </div>
      )}

      <div className="text-sm text-muted-foreground">
        <div>{account?.slice(0, 6)}...{account?.slice(-4)}</div>
        {balance && <div className="text-xs">{parseFloat(balance).toFixed(4)} MATIC</div>}
      </div>

      <Button
        onClick={disconnectWallet}
        variant="ghost"
        size="sm"
        className="gap-2"
      >
        <LogOut size={16} />
        Disconnect
      </Button>
    </div>
  );
}
