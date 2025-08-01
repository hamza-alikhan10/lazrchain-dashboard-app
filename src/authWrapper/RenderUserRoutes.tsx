// import { Routes, Route, Navigate } from "react-router-dom";
// import { useToast } from "@/hooks/use-toast";
// import LoginPage from "@/pages/LoginPage";
// import Dashboard from "@/pages/Dashboard";
// import ReferralProgramPage from "@/pages/ReferralProgramPage";
// import RewardsPage from "@/pages/RewardsPage";
// import Layout from "@/components/newComponents/Layout";
// import { useAppSelector } from "@/store/hooks";

// const AppRoutes = () => {
//   const { toast } = useToast();
//   const { isLoggedIn } = useAppSelector((state) => state.auth);

//   if (!isLoggedIn) {
//     return (
//       <Routes>
//         <Route path="/*" element={<LoginPage toast={toast} />} />
//       </Routes>
//     );
//   }

//   return (
//     <Routes>
//       <Route path="/" element={<Layout><Dashboard /></Layout>} />
//       <Route path="/referral_programs" element={<Layout><ReferralProgramPage /></Layout>} />
//       <Route path="/rewards" element={<Layout><RewardsPage /></Layout>} />
//       <Route path="*" element={<Navigate to="/" />} />
//     </Routes>
//   );
// };

// export default AppRoutes;


// structure/RenderAdminRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { getUserRoutes } from './UserNavigation';
import { useVerifyAuthQuery } from '@/features/authUser/authApi';
import { Ghost } from 'lucide-react';

const RenderAdminRoutes = () => {
  const { data, isLoading } = useVerifyAuthQuery();
  const isAuthenticated = data?.isAuthenticated;

  const routeList = getUserRoutes();

  if (isLoading) {
    return (
            <div className="flex justify-center items-center h-screen">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
            </div>
    );
  }

  return (
    <Routes>
      {routeList.map((route, i) => {
        if (route.isPrivate && isAuthenticated) {
          return <Route key={i} path={route.path} element={route.element} />;
        } else if (!route.isPrivate) {
          return <Route key={i} path={route.path} element={route.element} />;
        }
        return null;
      })}
      {/* Fallback Route */}
      <Route path="*" element={<Navigate to={isAuthenticated ? '/' : '/login'} />} />
    </Routes>
  );
};

export default RenderAdminRoutes;
