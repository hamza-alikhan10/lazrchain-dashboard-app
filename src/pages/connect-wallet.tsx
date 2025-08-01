import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setWalletAddress, setWalletSaved } from '@/features/layout/layoutSlice';
import { ConnectWalletButton } from '@/components/newComponents/ConnectWalletButton';
import { isTronLinkInstalled } from '@/lib/utils/checkTron';
import {
  Puzzle,
  ArrowUpLeft,
  Wallet,
  KeyRound,
  RefreshCw,
  BadgeCheck,
  Settings,
  PlugZap,
} from 'lucide-react';

export default function ConnectWalletPage() {
  const walletAddress = useAppSelector((state) => state.layout.walletAddress);
  const walletSaved = useAppSelector((state) => state.layout.walletSaved);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [tronReady, setTronReady] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const installed = isTronLinkInstalled();
      setTronReady(installed);

      // ⚠ If wallet is "saved" but TronLink is gone, reset state
      if (walletSaved && !installed) {
        dispatch(setWalletSaved(false));
        dispatch(setWalletAddress(''));
      }

      // ✅ Redirect only if both wallet is saved & Tron is ready
      if (walletSaved && installed) {
        clearInterval(interval);
        navigate('/');
      }
    }, 500);

    return () => clearInterval(interval);
  }, [walletSaved]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-black to-zinc-900 text-white px-4">
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-7xl">

        {/* Step 1: Install TronLink */}
        <div className="flex-1 bg-red-950/20 border border-red-400 rounded-xl p-6 space-y-4 text-center text-red-300">
          <div className="flex items-center justify-center gap-2 text-red-400 font-semibold text-base">
            <BadgeCheck className="w-5 h-5" />
            <span>Step 1: Install TronLink</span>
          </div>
          <p className="text-sm">❌ TronLink is not installed.</p>
          <a
            href="https://www.tronlink.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-white transition text-sm"
          >
            Install TronLink Extension
          </a>
        </div>

        {/* Step 2: Setup Wallet */}
        <div className="flex-1 bg-yellow-950/20 border border-yellow-300 rounded-xl p-6 space-y-4 text-yellow-200">
          <div className="flex items-center justify-center gap-2 text-yellow-300 font-semibold text-base">
            <Settings className="w-5 h-5" />
            <span>Step 2: Setup Wallet</span>
          </div>
          <p className="text-yellow-300 font-medium text-sm text-center">
            ⚠ Create or import a wallet in TronLink to proceed.
          </p>
          <div className="text-xs space-y-3 text-left mx-auto max-w-xs">
            <div className="flex items-center gap-2">
              <Puzzle className="w-4 h-4 text-yellow-400" />
              <span>Click extension icon (top right)</span>
            </div>
            <div className="flex items-center gap-2">
              <ArrowUpLeft className="w-4 h-4 text-yellow-400" />
              <span>Click TronLink icon</span>
            </div>
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-yellow-400" />
              <span>Open TronLink wallet</span>
            </div>
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-yellow-400" />
              <span>Import or create wallet</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-yellow-400" />
              <span>Reload this page</span>
            </div>
          </div>
          <div className="text-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 mt-2 rounded text-xs transition"
            >
              🔁 Reload Page
            </button>
          </div>
        </div>

        {/* Step 3: Connect Wallet */}
        <div className="flex-1 bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-xl text-white space-y-6">
          <div className="flex items-center justify-center gap-2 text-white font-semibold text-base">
            <PlugZap className="w-5 h-5 text-green-300" />
            <span>Step 3: Connect Wallet</span>
          </div>
          <p className="text-sm text-center text-zinc-300">
            Please connect your <strong>TronLink</strong> wallet to continue using the app.
          </p>

          {walletSaved && tronReady ? (
            <div className="bg-green-700/40 p-4 rounded text-center text-green-200 font-mono text-sm">
              ✅ Wallet Connected: <br />
              <span className="break-all">{walletAddress}</span>
            </div>
          ) : (
            <ConnectWalletButton />
          )}

          <div className="text-xs text-zinc-400 mt-4 text-center">
            Ensure TronLink extension is installed and unlocked in your browser.
          </div>
        </div>
      </div>
    </main>
  );
}