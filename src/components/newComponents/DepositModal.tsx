import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardDescription } from "@/components/ui/card";
import { Copy } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import React from "react";

interface DepositModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  trc20Address: string;
  depositAmount: string;
  copyToClipboard: (value: string, label: string) => void;
  confirmDeposit: () => void;
  isLoading: boolean;
}

const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  trc20Address,
  depositAmount,
  copyToClipboard,
  confirmDeposit,
  isLoading
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-lg text-foreground">Deposit USDT</DialogTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Scan the QR code or copy the TRC20 address to deposit {depositAmount} USDT
          </CardDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-center p-4 bg-background rounded-xl">
            <QRCodeSVG value={trc20Address} size={160} bgColor="#ffffff" fgColor="#000000" />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">TRC20 Address</label>
            <div className="flex space-x-2">
              <Input
                value={trc20Address}
                readOnly
                className="flex-1 text-sm text-foreground bg-muted font-mono"
              />
              <Button
                onClick={() => copyToClipboard(trc20Address, "TRC20")}
                className="btn-success shadow-glow"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={confirmDeposit} className="w-full btn-crypto shadow-glow" disabled={isLoading}>
             {isLoading ? "Processing..." : "Confirm Deposit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DepositModal;
