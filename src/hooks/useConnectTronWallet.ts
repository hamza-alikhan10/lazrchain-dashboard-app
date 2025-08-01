// hooks/useConnectTronWallet.ts
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAppDispatch } from '@/store/hooks';
import { setWalletAddress, setWalletSaved } from '@/features/layout/layoutSlice';
import { useSaveWalletAddressMutation } from '@/features/wallet/walletAddressApi';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export const useConnectTronWallet = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast: showToast } = useToast();
  const [saveWalletAddress] = useSaveWalletAddressMutation();
  const userEmail = useSelector((state: RootState) => state.auth.userEmail);

  const connectTronWallet = async () => {
    const tronLink = (window as any).tronLink;
    const tronWeb = (window as any).tronWeb;

    if (!tronLink || !tronWeb) {
      navigate('/connect-wallet');
      return;
    }

    try {
      if (tronLink.request) {
        await tronLink.request({ method: 'tron_requestAccounts' });
      } else if (tronWeb.requestAccounts) {
        await tronWeb.requestAccounts();
      }

      const checkReady = () =>
        new Promise<void>((resolve) => {
          const interval = setInterval(() => {
            if (tronWeb.ready && tronWeb.defaultAddress?.base58) {
              clearInterval(interval);
              resolve();
            }
          }, 300);
        });

      await checkReady();

      const address = tronWeb.defaultAddress.base58;
      if (address) {
        dispatch(setWalletAddress(address));

        const response = await saveWalletAddress({
          email: userEmail,
          walletAddress: address,
        }).unwrap();

        dispatch(setWalletSaved(true));

        showToast({
          title: '🔗 Wallet Connected',
          description: 'Wallet connected and saved successfully.',
          className: 'bg-green-500 text-white',
        });
      }
    } catch (err) {
      console.error('❌ TronLink connection failed:', err);
    }
  };

  return { connectTronWallet };
};
