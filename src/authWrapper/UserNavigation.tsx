// structure/AdminNavigation.tsx
import Dashboard from '@/pages/Dashboard';
import ReferralProgramPage from '@/pages/ReferralProgramPage';
import RewardsPage from '@/pages/RewardsPage';
import LoginPage from '@/pages/LoginPage';
import Layout from '@/components/newComponents/Layout';
import { useToast } from '@/hooks/use-toast';
import ConnectWalletPage from '@/pages/connect-wallet';

export const getUserRoutes = () => {
  const { toast } = useToast();

 return [
  
    { path: '/',                  element: <Layout><Dashboard /></Layout>,           isPrivate: true },
    { path: '/referral_programs', element: <Layout><ReferralProgramPage /></Layout>, isPrivate: true },
    { path: '/rewards',           element: <Layout><RewardsPage /></Layout>,         isPrivate: true },
    { path: '/login',             element: <LoginPage toast={toast} />,              isPrivate: false },
    { path: '/connect-wallet',    element: <ConnectWalletPage />,                    isPrivate: true },
  ];

};
