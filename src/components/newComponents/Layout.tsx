import { ReactNode, useEffect, useRef} from "react";
import { useNavigate } from "react-router-dom";

import Topbar from "@/components/newComponents/Topbar";
import ProfileModal from "@/components/newComponents/ProfileModal";
import Sidebar from "@/components/newComponents/Sidebar";
import { useUserData } from "@/hooks/useUserData";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useToast } from "@/hooks/use-toast";
import {
  toggleSidebar,
  toggleProfile,
  setOldPassword,
  setNewPassword,
  resetPasswordFields,
  setActiveTab,
  setWalletAddress,
  setWalletSaved,
  resetLayoutState,
  setProfile
} from "@/features/layout/layoutSlice";
import { logout } from '@/features/authUser/authSlice';

import { useLogoutMutation } from "@/features/authUser/authApi";


//api 
import { useSaveWalletAddressMutation } from "@/features/wallet/walletAddressApi";

interface LayoutProps {
  userEmail: string;
  setIsLoggedIn: (value: boolean) => void;
  children: ReactNode;
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { userEmail, isLoggedIn } = useAppSelector((state) => state.auth);
  const { user } = useUserData();
  const [Logout] = useLogoutMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
    const { toast: showToast, dismiss } = useToast();
    const { toast } = useToast();


  const {
    isSidebarOpen,
    isProfileOpen,
    walletAddress,
    oldPassword,
    newPassword,
    activeTab,
    walletSaved,
  } = useAppSelector((state) => state.layout);

  const [saveWalletAddress] = useSaveWalletAddressMutation();

    // Ref for the first toast
  const firstToastId = useRef<string | null>(null);

  useEffect(() => {
    // On page load: if wallet empty and not saved
    if (!walletAddress && !walletSaved) {
      if(!isProfileOpen){
        dispatch(toggleProfile());  //open ProfileModel
      }

      dispatch(setProfile(true)); 

      // const toastObj = showToast({
      showToast({
        title: "Wallet Required !",
        description: "Please connect your wallet to continue.",
        duration: Infinity, // persistent
        className: "bg-yellow-300 text-black",
      });
      // firstToastId.current = toastObj.id;
    }
  }, []);

//   const handleInputFocus = () => {
//     // Remove first toast if exists
//     if (firstToastId.current && walletAddress.trim()) {
//       dismiss(firstToastId.current);
//       firstToastId.current = null;
//     }
//   };

// const handleBlur = () => {
//   if (!walletAddress.trim() || walletSaved) return;

//   let remainingTime = 10;

//   const confirmToast = showToast({
//     title: "Confirm Wallet Address?",
//     description: `This can't be changed later once it is saved. Wallet: ${walletAddress}`,
//     duration: 10000,
//     className: "bg-red-500 text-white confirm-wallet-toast",
//     action: (
//       <div className="flex items-center gap-3">
//         <span className="text-sm">{remainingTime}s</span>
//         <button
//           onClick={() => {
//             dismiss(confirmToast.id);
//             dispatch(setWalletAddress(""));
//           }}
//           className="ml-4 text-white hover:underline"
//         >
//           ✕
//         </button>
//       </div>
//     ),
//   });

//   const intervalId = setInterval(() => {
//     remainingTime -= 1;
//     if (remainingTime >= 0) {
//       confirmToast.update({
//         id: confirmToast.id,
//         action: (
//           <div className="flex items-center gap-3">
//             <span className="text-sm">{remainingTime}s</span>
//             <button
//               onClick={() => {
//                 dismiss(confirmToast.id);
//                 dispatch(setWalletAddress(""));
//                 clearInterval(intervalId);
//               }}
//               className="ml-4 text-white hover:underline"
//             >
//               ✕
//             </button>
//           </div>
//         ),
//       });
//     }
//   }, 1000);

//   setTimeout(async () => {
//     clearInterval(intervalId);
//     if (walletAddress.trim()) {
//       try {
//         const response = await saveWalletAddress({
//           email: userEmail || user?.email ,
//           walletAddress,
//         }).unwrap();

//         dispatch(setWalletSaved(true));

//         toast({
//           title: "Wallet Saved",
//           description: response.message,
//           duration: 3000,
//         });
//       } catch (error: any) {
//         const err = error?.data;

//         const toastMap: Record<string, { title: string; description: string }> = {
//           MISSING_FIELDS: {
//             title: "Missing Fields",
//             description: "Email and wallet address are required.",
//           },
//           USER_NOT_FOUND: {
//             title: "User Not Found",
//             description: "No account found for this email.",
//           },
//           SERVER_ERROR: {
//             title: "Server Error",
//             description: "Something went wrong while saving wallet address.",
//           },
//         };

//         const toastContent = toastMap[err?.type] ?? {
//           title: "Unknown Error",
//           description: "An error occurred. Please try again.",
//         };

//         toast({
//           variant: "destructive",
//           title: toastContent.title,
//           description: toastContent.description,
//           duration: 3000,
//         });
//       }
//     }
//   }, 10000);
// };



const handleLogout = async () => {
  try {
    // Call logout API
    const response = await Logout().unwrap();

    // Clear Redux state
    dispatch(logout()); // You must define this action in your authSlice

    // Show toast
    setTimeout(() => {
          toast({
      title: "Logged Out",
      description: response.message || "You have been successfully logged out.",
      duration: 3000,
    });
    }, 1000);

    // Optional: redirect to login page
    navigate("/login");

  } catch (error: any) {
   setTimeout(() => {
     toast({
      variant: "destructive",
      title: "Logout Failed",
      description: "An error occurred during logout.",
      duration: 3000,
    });
   }, 1000);
  }
};

  const handleProfileUpdate = async () => {
    if (oldPassword && newPassword.length >= 8) {
      toast({
        title: "Password Updated",
        description: "Your password has been updated.",
        duration: 3000,
      });
    }
    dispatch(resetPasswordFields());
    dispatch(toggleProfile());
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => dispatch(setActiveTab(tab))}
        handleLogout={handleLogout}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => dispatch(toggleSidebar())}
      />

      <div className="flex-1">
        {/* Header */}
        <Topbar
          activeTab={activeTab}
          toggleSidebar={() => dispatch(toggleSidebar())}
          userEmail={userEmail || user?.email}
          user={user}
          onProfileClick={() => dispatch(toggleProfile())}
        />

        {/* Profile Modal */}
        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => dispatch(toggleProfile())}
          userEmail={userEmail || user?.email}
          walletAddress={walletAddress || "Not connected"}
          oldPassword={oldPassword}
          newPassword={newPassword}
          setOldPassword={(value) => dispatch(setOldPassword(value))}
          setNewPassword={(value) => dispatch(setNewPassword(value))}
          handleProfileUpdate={handleProfileUpdate}
        />
        {/* Pages */}
        {children}
      </div>
    </div>
  );
};

export default Layout;
