import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardDescription } from "@/components/ui/card";
import React from "react";
import {  useAppSelector } from "@/store/hooks";

import { ConnectWalletButton } from "./ConnectWalletButton";
import { useEffect } from "react";
import { setWalletAddress, setWalletSaved } from "@/features/layout/layoutSlice";
import { useAppDispatch } from "@/store/hooks";


interface ProfileModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  userEmail: string;
  walletAddress: string;
  oldPassword: string;
  newPassword: string;
  setOldPassword: (val: string) => void;
  setNewPassword: (val: string) => void;
  handleProfileUpdate: () => void;
  walletSaved?: boolean; // keep if still useful in modal UI
}


const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  userEmail,
  walletAddress,
  oldPassword,
  newPassword,
  setOldPassword,
  setNewPassword,
  handleProfileUpdate,
}) => {

    const {walletSaved} = useAppSelector((state) => state.layout);
    const tronLink = typeof window !== 'undefined' && (window as any).tronLink;
    const tronWeb = typeof window !== 'undefined' && (window as any).tronWeb;
    const dispatch = useAppDispatch();
  
    const isTronReady = tronLink && tronWeb && tronWeb.ready && tronWeb.defaultAddress?.base58;

    // useEffect(() => {
    //   const tronWeb = (window as any).tronWeb;
    //   const tronLink = (window as any).tronLink;

    //   if (!tronLink || !tronWeb || !tronWeb.ready || !tronWeb.defaultAddress?.base58) {
    //     dispatch(setWalletAddress(''));
    //     dispatch(setWalletSaved(false));
    //   }
    // }, []);

  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-lg text-foreground">Profile Settings</DialogTitle>
          <CardDescription className="text-sm text-muted-foreground">
            View your account information and update your password
          </CardDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Email</label>
            <Input
              type="email"
              value={userEmail}
              readOnly
              className="text-sm text-foreground bg-muted cursor-not-allowed"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Wallet Address</label>

            {walletSaved && isTronReady ? (
              <div className="text-sm text-foreground font-mono bg-muted p-2 rounded">
                {walletAddress}
              </div>
            ) : (
              <ConnectWalletButton/>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Old Password</label>
            <Input
              type="password"
              placeholder="Enter current password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="text-sm text-foreground"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">New Password</label>
            <Input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="text-sm text-foreground"
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleProfileUpdate} className="w-full btn-crypto shadow-glow">
            Update Password
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
