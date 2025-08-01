import { useConnectTronWallet } from '@/hooks/useConnectTronWallet';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export const ConnectWalletButton = () => {
  const { connectTronWallet } = useConnectTronWallet();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await connectTronWallet();
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting}
      className={`w-full px-4 py-2 rounded text-sm transition flex items-center justify-center ${
        isConnecting
          ? 'bg-yellow-300 text-gray-700 cursor-not-allowed'
          : 'bg-yellow-400 hover:bg-yellow-500 text-black'
      }`}
    >
      {isConnecting ? (
        <>
          <Loader2 className="animate-spin mr-2 h-4 w-4" />
          Connecting...
        </>
      ) : (
        'Connect Wallet'
      )}
    </button>
  );
};
