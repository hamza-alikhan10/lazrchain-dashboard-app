import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Copy, 
  Share2, 
  Gift, 
  TrendingUp,
  Star,
  UserPlus,
  DollarSign
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { QRCodeSVG } from "qrcode.react";

interface Referral {
  id: string;
  email: string;
  joined_date: string;
  total_earnings: number;
  status: 'active' | 'inactive';
}

interface ReferralProgramProps {
  referrals: Referral[];
}

const ReferralProgram = ({ referrals }: ReferralProgramProps) => {
  const [referralCode] = useState("LAZR8X9K2M");
  const [isQRVisible, setIsQRVisible] = useState(false);
  const { toast } = useToast();
  
  const referralLink = `https://lazrchain.app/ref/${referralCode}`;
  const totalReferralEarnings = referrals.reduce((sum, ref) => sum + ref.total_earnings, 0);
  const activeReferrals = referrals.filter(ref => ref.status === 'active').length;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${type} Copied!`,
      description: `${text.substring(0, 30)}${text.length > 30 ? '...' : ''}`,
      duration: 3000,
    });
  };

  const shareReferral = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join LazrChain - Earn Crypto Daily!',
          text: 'Start earning USDT by sharing your internet bandwidth. Use my referral code for bonus rewards!',
          url: referralLink,
        });
      } catch (error) {
        console.log('Error sharing:', error);
        copyToClipboard(referralLink, 'Referral Link');
      }
    } else {
      copyToClipboard(referralLink, 'Referral Link');
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-crypto hover:card-glow transition-all duration-300">
          <CardHeader className="bg-gradient-primary text-primary-foreground rounded-t-lg">
            <CardTitle className="flex items-center text-lg">
              <Users className="w-5 h-5 mr-2" />
              Total Referrals
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-foreground">{referrals.length}</div>
            <p className="text-sm text-muted-foreground mt-1">
              {activeReferrals} active • {referrals.length - activeReferrals} inactive
            </p>
          </CardContent>
        </Card>

        <Card className="card-crypto hover:card-glow transition-all duration-300">
          <CardHeader className="bg-gradient-success text-success-foreground rounded-t-lg">
            <CardTitle className="flex items-center text-lg">
              <DollarSign className="w-5 h-5 mr-2" />
              Total Earnings
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-foreground">${totalReferralEarnings.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground mt-1">From referral commissions</p>
          </CardContent>
        </Card>

        <Card className="card-crypto hover:card-glow transition-all duration-300">
          <CardHeader className="bg-gradient-secondary text-secondary-foreground rounded-t-lg">
            <CardTitle className="flex items-center text-lg">
              <TrendingUp className="w-5 h-5 mr-2" />
              Commission Rate
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-foreground">10%</div>
            <p className="text-sm text-muted-foreground mt-1">Of your referrals' earnings</p>
          </CardContent>
        </Card>
      </div>

      {/* Referral Link Section */}
      <Card className="card-crypto">
        <CardHeader>
          <CardTitle className="flex items-center text-xl text-foreground">
            <Share2 className="w-6 h-6 mr-2 text-primary" />
            Your Referral Link
          </CardTitle>
          <CardDescription>
            Share this link with friends and earn 10% of their daily earnings forever!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Referral Code</label>
                <div className="flex space-x-2">
                  <Input
                    value={referralCode}
                    readOnly
                    className="flex-1 bg-muted/50 text-foreground font-mono text-lg"
                  />
                  <Button
                    onClick={() => copyToClipboard(referralCode, 'Referral Code')}
                    className="btn-crypto"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Referral Link</label>
                <div className="flex space-x-2">
                  <Input
                    value={referralLink}
                    readOnly
                    className="flex-1 bg-muted/50 text-foreground font-mono text-sm"
                  />
                  <Button
                    onClick={() => copyToClipboard(referralLink, 'Referral Link')}
                    className="btn-crypto"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={shareReferral}
                  className="btn-crypto flex-1"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Link
                </Button>
                <Button
                  onClick={() => setIsQRVisible(!isQRVisible)}
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  QR Code
                </Button>
              </div>
            </div>

            {isQRVisible && (
              <div className="flex justify-center items-center">
                <div className="bg-white p-4 rounded-xl shadow-lg">
                  <QRCodeSVG 
                    value={referralLink} 
                    size={200}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="M"
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card className="card-crypto">
        <CardHeader>
          <CardTitle className="flex items-center text-xl text-foreground">
            <Gift className="w-6 h-6 mr-2 text-primary" />
            How Referrals Work
          </CardTitle>
          <CardDescription>
            Earn passive income by inviting friends to LazrChain
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                <UserPlus className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground">1. Invite Friends</h3>
              <p className="text-sm text-muted-foreground">
                Share your referral link with friends and family
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-gradient-success rounded-full flex items-center justify-center mx-auto">
                <Star className="w-8 h-8 text-success-foreground" />
              </div>
              <h3 className="font-semibold text-foreground">2. They Join & Earn</h3>
              <p className="text-sm text-muted-foreground">
                Your friends start earning USDT by sharing bandwidth
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto">
                <DollarSign className="w-8 h-8 text-secondary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground">3. You Earn Commission</h3>
              <p className="text-sm text-muted-foreground">
                Get 10% of their daily earnings automatically
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referrals Table */}
      <Card className="card-crypto">
        <CardHeader>
          <CardTitle className="flex items-center text-xl text-foreground">
            <Users className="w-6 h-6 mr-2 text-primary" />
            Your Referrals
          </CardTitle>
          <CardDescription>
            Track your referred users and their performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          {referrals.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-foreground font-semibold">User</TableHead>
                    <TableHead className="text-foreground font-semibold">Joined Date</TableHead>
                    <TableHead className="text-foreground font-semibold">Status</TableHead>
                    <TableHead className="text-right text-foreground font-semibold">Your Earnings</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {referrals.map((referral) => (
                    <TableRow key={referral.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium text-foreground">
                        {referral.email}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(referral.joined_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={referral.status === 'active' ? 'default' : 'secondary'}
                          className={referral.status === 'active' ? 'bg-success text-success-foreground' : ''}
                        >
                          {referral.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-bold text-success">
                        ${referral.total_earnings.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Referrals Yet</h3>
              <p className="text-muted-foreground mb-6">
                Start sharing your referral link to earn commission from your friends' earnings
              </p>
              <Button 
                onClick={shareReferral}
                className="btn-crypto"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Your Link
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralProgram;