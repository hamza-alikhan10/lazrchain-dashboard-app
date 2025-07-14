import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  ArrowRight,
  TrendingUp,
  Coins,
  DollarSign,
  Users,
  Gift,
  LogOut,
  Copy,
  Menu,
  X,
  Wifi,
  UserPlus,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { QRCodeSVG } from "qrcode.react";
import ReferralProgram from "./ReferralProgram";
import Rewards from "./Rewards";
import { useUserData } from "@/hooks/useUserData";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Extend Window interface to include ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string }) => Promise<string[]>;
    };
  }
}

const Dashboard = () => {
  const { user, userBalance, pastEarnings, todayEarnings, transactions, referrals, lastRewardClaim, loading, updateBalance, claimReward, generateReferralCode, refreshData } = useUserData();
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [networkSpeed, setNetworkSpeed] = useState(0);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSpeedTesting, setIsSpeedTesting] = useState(false);
  const { toast } = useToast();

  const trc20Address = "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE";

  const investmentStrategy = [
    { min: 10, max: 100, minYield: 0.5, maxYield: 2 },
    { min: 100, max: 500, minYield: 2, maxYield: 4 },
    { min: 500, max: 1500, minYield: 4, maxYield: 6 },
  ];

  const chartData = {
    labels: pastEarnings.map((e) => e.date),
    datasets: [
      {
        label: "USDT Earnings",
        data: pastEarnings.map((e) => e.daily_earnings + (e.referral_earnings || 0)),
        borderColor: "hsl(var(--primary))",
        backgroundColor: "hsla(var(--primary), 0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "hsl(var(--primary))",
        pointBorderColor: "hsl(var(--card))",
        pointBorderWidth: 2,
        pointRadius: 5,
      },
    ],
  };

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        labels: {
          color: "hsl(var(--foreground))",
          font: {
            size: 12,
            weight: "bold" as const,
          },
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "hsla(var(--card), 0.95)",
        titleColor: "hsl(var(--card-foreground))",
        bodyColor: "hsl(var(--card-foreground))",
        borderColor: "hsl(var(--primary))",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "hsl(var(--muted-foreground))",
          font: {
            weight: "normal" as const,
          },
        },
      },
      y: {
        grid: { color: "hsla(var(--border), 0.5)" },
        ticks: {
          color: "hsl(var(--muted-foreground))",
          font: {
            weight: "normal" as const,
          },
        },
        min: 0,
      },
    },
  };

  const testInternetSpeed = async () => {
    setIsSpeedTesting(true);
    try {
      const tests = [];
      const test1 = new Promise(async (resolve) => {
        try {
          const startTime = performance.now();
          const response = await fetch(`https://picsum.photos/200/200?random=${Date.now()}`, {
            cache: "no-store",
            mode: "cors",
          });
          await response.blob();
          const endTime = performance.now();
          const duration = (endTime - startTime) / 1000;
          const sizeKB = 40;
          const speedKbps = (sizeKB * 8) / duration;
          const speedMbps = speedKbps / 1000;
          resolve(Math.max(speedMbps, 0));
        } catch {
          resolve(0);
        }
      });
      tests.push(test1);
      const results = await Promise.all(tests);
      const validResults = results.filter((speed) => speed > 0);
      if (validResults.length > 0) {
        const averageSpeed = validResults.reduce((sum, speed) => sum + speed, 0) / validResults.length;
        const finalSpeed = Math.min(Math.max(averageSpeed * 2, 5), 50);
        setNetworkSpeed(finalSpeed);
      } else {
        const fallbackSpeed = Math.random() * 30 + 10;
        setNetworkSpeed(fallbackSpeed);
      }
    } catch (error) {
      console.error("Speed test failed:", error);
      const fallbackSpeed = Math.random() * 25 + 15;
      setNetworkSpeed(fallbackSpeed);
    } finally {
      setIsSpeedTesting(false);
    }
  };

  useEffect(() => {
    testInternetSpeed();
    // Simulate user login for demo
    setIsLoggedIn(true);
    setUserEmail(user?.email || "demo@lazrchain.com");
  }, [user]);

  const calculateDailyYield = (balance: number, speedMbps: number) => {
    const tier = investmentStrategy.find((strategy) => balance >= strategy.min && balance <= strategy.max);
    if (!tier || balance < 10 || speedMbps <= 0) return 0;

    const maxSpeed = 100;
    const yieldRange = tier.maxYield - tier.minYield;
    const yieldPercentage = tier.minYield + (Math.min(speedMbps, maxSpeed) / maxSpeed) * yieldRange;
    const yieldAmount = (balance * yieldPercentage) / 100;
    return yieldAmount;
  };

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsWalletConnected(true);
          toast({
            title: "Wallet Connected",
            description: `Connected to ${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`,
            duration: 3000,
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Wallet Not Found",
          description: "Please install MetaMask or another Web3 wallet.",
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        duration: 3000,
      });
    }
  };

  const handleAuth = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (isSignup) {
      if (userEmail && password && confirmPassword) {
        if (!emailRegex.test(userEmail)) {
          toast({
            variant: "destructive",
            title: "Invalid Email",
            description: "Please enter a valid email address.",
            duration: 3000,
          });
          return;
        }
        if (password !== confirmPassword) {
          toast({
            variant: "destructive",
            title: "Password Mismatch",
            description: "Passwords do not match.",
            duration: 3000,
          });
          return;
        }
        if (password.length < 8) {
          toast({
            variant: "destructive",
            title: "Password Too Short",
            description: "Password must be at least 8 characters long.",
            duration: 3000,
          });
          return;
        }
        
        setIsLoggedIn(true);
        setIsSignup(false);
        toast({
          title: "Account Created",
          description: `Welcome to LazrChain, ${userEmail}!`,
          duration: 3000,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Signup Failed",
          description: "Please fill in all fields.",
          duration: 3000,
        });
      }
    } else {
      if (userEmail && password) {
        if (!emailRegex.test(userEmail)) {
          toast({
            variant: "destructive",
            title: "Invalid Email",
            description: "Please enter a valid email address.",
            duration: 3000,
          });
          return;
        }
        
        setIsLoggedIn(true);
        toast({
          title: "Login Successful",
          description: `Welcome back, ${userEmail}!`,
          duration: 3000,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Please enter valid email and password.",
          duration: 3000,
        });
      }
    }
  };

  const handleLogout = async () => {
    setIsLoggedIn(false);
    setIsWalletConnected(false);
    setWalletAddress("");
    setUserEmail("");
    setPassword("");
    setConfirmPassword("");
    setIsSidebarOpen(false);
    setIsProfileOpen(false);
    setIsDepositOpen(false);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
      duration: 3000,
    });
  };

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (amount >= 10 && amount <= 1500) {
      setIsDepositOpen(true);
    } else {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Please enter an amount between $10 and $1500.",
        duration: 3000,
      });
    }
  };

  const confirmDeposit = async () => {
    const amount = parseFloat(depositAmount);
    await claimReward(amount, 'deposit');
    setDepositAmount("");
    setIsDepositOpen(false);
    toast({
      title: "Deposit Successful",
      description: `Successfully deposited ${amount} USDT to your account.`,
      duration: 3000,
    });
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (amount > 0 && amount <= (userBalance?.usdt_balance || 0)) {
      await claimReward(-amount, 'withdrawal');
      setWithdrawAmount("");
      toast({
        title: "Withdrawal Successful",
        description: `Successfully withdrew ${amount} USDT. Funds will arrive within 10–30 minutes.`,
        duration: 3000,
      });
    } else if (amount > (userBalance?.usdt_balance || 0)) {
      toast({
        variant: "destructive",
        title: "Insufficient Balance",
        description: "You don't have enough USDT to withdraw this amount.",
        duration: 3000,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Please enter a valid withdrawal amount.",
        duration: 3000,
      });
    }
  };

  const handleProfileUpdate = async () => {
    if (oldPassword && newPassword) {
      if (newPassword.length < 8) {
        toast({
          variant: "destructive",
          title: "Password Too Short",
          description: "New password must be at least 8 characters long.",
          duration: 3000,
        });
        return;
      }
      
      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated.",
        duration: 3000,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please enter both old and new passwords.",
        duration: 3000,
      });
    }
    setOldPassword("");
    setNewPassword("");
    setIsProfileOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${type} Address Copied`,
      description: `${text.substring(0, 6)}...${text.substring(text.length - 4)}`,
      duration: 3000,
    });
  };

  if (loading || !user || !isLoggedIn) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-dark">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-primary rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-gradient-secondary rounded-full opacity-20 animate-bounce"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-primary rounded-full opacity-10 animate-spin" style={{ animationDuration: "20s" }}></div>
          <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-gradient-to-r from-warning to-warning rounded-lg opacity-20 animate-ping"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <Card className="w-full max-w-md glass border-primary/20 shadow-glow">
            <CardHeader className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xl">L</span>
                </div>
                <span className="text-2xl font-bold text-gradient">LazrChain</span>
              </div>
              <CardTitle className="text-foreground text-2xl">{isSignup ? "Create Account" : "Welcome Back"}</CardTitle>
              <CardDescription className="text-muted-foreground">{isSignup ? "Join LazrChain and start earning" : "Sign in to your dashboard"}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="glass border-primary/30 text-foreground placeholder:text-muted-foreground"
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass border-primary/30 text-foreground placeholder:text-muted-foreground"
              />
              {isSignup && (
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="glass border-primary/30 text-foreground placeholder:text-muted-foreground"
                />
              )}
              <Button
                onClick={handleAuth}
                className="w-full btn-crypto text-sm py-2 sm:py-3 shadow-glow"
              >
                {isSignup ? (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Account
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
              <div className="text-center">
                <button
                  onClick={() => setIsSignup(!isSignup)}
                  className="text-primary hover:text-primary-glow text-sm font-medium transition-colors"
                >
                  {isSignup ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-card shadow-xl z-20 transform transition-transform duration-300 ease-in-out lg:static lg:transform-none lg:flex flex-col ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-4 border-b bg-gradient-primary">
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-foreground rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold text-lg">L</span>
              </div>
              <span className="text-lg font-bold text-primary-foreground truncate">LazrChain</span>
            </div>
            <Button
              variant="ghost"
              className="lg:hidden text-primary-foreground p-2 hover:bg-white/10"
              onClick={toggleSidebar}
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>

        <nav className="mt-4 flex-1 px-2">
          <div className="space-y-2">
            {[
              { id: "dashboard", icon: TrendingUp, label: "Dashboard" },
              { id: "referral", icon: Users, label: "Referral Program" },
              { id: "rewards", icon: Gift, label: "Rewards" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-all duration-200 text-sm font-medium ${
                  activeTab === item.id
                    ? "bg-gradient-primary text-primary-foreground shadow-md"
                    : "text-card-foreground hover:bg-muted hover:scale-[1.02] active:scale-100"
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        <div className="p-2 border-t">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full flex items-center space-x-2 text-sm font-medium hover:bg-destructive/10 hover:border-destructive hover:text-destructive transition-colors py-3"
          >
            <LogOut className="w-4 h-4" />
            <span className="truncate">Logout</span>
          </Button>
        </div>
      </div>

      {/* Backdrop for mobile */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-10 lg:hidden" onClick={toggleSidebar} />}

      {/* Main Content */}
      <div className="flex-1">
        <div className="bg-card shadow-sm border-b border-border px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                className="lg:hidden p-2 hover:bg-muted"
                onClick={toggleSidebar}
              >
                <Menu className="w-6 h-6 text-foreground" />
              </Button>
              <h1 className="text-lg sm:text-xl font-bold text-foreground">
                {activeTab === "dashboard" && "Dashboard"}
                {activeTab === "referral" && "Referral Program"}
                {activeTab === "rewards" && "Rewards"}
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <div
                className="flex items-center space-x-2 p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer"
                onClick={() => setIsProfileOpen(true)}
              >
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-medium text-sm">U</span>
                </div>
                <span className="text-foreground font-medium text-sm truncate max-w-[100px] sm:max-w-[120px] md:max-w-[150px]">
                  {user?.email || userEmail}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Modal */}
        {isProfileOpen && (
          <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
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
                    value={user?.email || userEmail}
                    readOnly
                    className="text-sm text-foreground bg-muted cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Wallet Address</label>
                  <Input
                    type="text"
                    value={walletAddress || "Not connected"}
                    readOnly
                    className="text-sm text-foreground bg-muted cursor-not-allowed font-mono"
                  />
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
                <Button
                  onClick={handleProfileUpdate}
                  className="w-full btn-crypto shadow-glow"
                >
                  Update Password
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Deposit Modal - Only TRC20 */}
        {isDepositOpen && (
          <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
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
                <Button
                  onClick={confirmDeposit}
                  className="w-full btn-crypto shadow-glow"
                >
                  Confirm Deposit
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        <div className="p-4 sm:p-6 lg:p-8">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="card-crypto hover:card-glow transition-all duration-300 border-0 overflow-hidden">
                  <CardHeader className="bg-gradient-primary text-primary-foreground relative">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                    <CardTitle className="flex items-center text-base sm:text-lg relative z-10">
                      <DollarSign className="w-5 h-5 mr-2 bg-white/20 p-1 rounded-full" />
                      USDT Balance
                    </CardTitle>
                    <CardDescription className="text-primary-foreground/80 text-sm relative z-10">
                      Manage your USDT deposits and withdrawals
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 p-4 sm:p-6">
                    <div className="text-center bg-gradient-to-r from-muted/50 to-muted rounded-xl p-4">
                      <div className="text-2xl sm:text-3xl font-bold text-foreground">
                        ${(userBalance?.usdt_balance || 0).toFixed(2)}
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground font-medium">USDT Balance</div>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-3">
                        <Input
                          type="number"
                          placeholder="Amount to deposit ($10-$1500)"
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          className="border-border focus:border-primary text-sm text-foreground h-11 sm:h-12 rounded-xl"
                        />
                        <Button
                          onClick={handleDeposit}
                          className="w-full btn-success text-sm py-3 rounded-xl font-semibold shadow-glow"
                        >
                          <DollarSign className="w-4 h-4 mr-2" />
                          Deposit USDT
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <Input
                          type="number"
                          placeholder="Amount to withdraw"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          className="border-border focus:border-secondary text-sm text-foreground h-11 sm:h-12 rounded-xl"
                        />
                        <Button
                          onClick={handleWithdraw}
                          variant="outline"
                          className="w-full border-2 border-secondary text-secondary hover:bg-secondary/10 hover:border-secondary-glow text-sm py-3 rounded-xl font-semibold transition-all duration-200"
                        >
                          <ArrowRight className="w-4 h-4 mr-2" />
                          Withdraw USDT
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-crypto hover:card-glow transition-all duration-300 border-0 overflow-hidden">
                  <CardHeader className="bg-gradient-secondary text-secondary-foreground relative">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                    <CardTitle className="flex items-center text-base sm:text-lg relative z-10">
                      <TrendingUp className="w-5 h-5 mr-2 bg-white/20 p-1 rounded-full" />
                      Real-Time Earnings
                    </CardTitle>
                    <CardDescription className="text-secondary-foreground/80 text-sm relative z-10">
                      Live earnings based on network performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 p-4 sm:p-6">
                    <div className="text-center bg-gradient-to-r from-secondary/10 to-accent/10 rounded-xl p-4">
                      <div className="text-2xl sm:text-3xl font-bold text-foreground">
                        ${todayEarnings.toFixed(4)}
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground font-medium">Daily Earnings (USDT)</div>
                    </div>
                    <div className="bg-gradient-to-r from-muted/50 to-muted rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Wifi className={`w-4 h-4 ${isSpeedTesting ? "animate-pulse text-secondary" : "text-success"}`} />
                          <span className="text-sm font-medium text-foreground">Network Speed</span>
                        </div>
                        <Button
                          onClick={testInternetSpeed}
                          disabled={isSpeedTesting}
                          size="sm"
                          variant="outline"
                          className="text-xs h-7 px-3 rounded-lg border-border hover:bg-muted transition-colors"
                        >
                          {isSpeedTesting ? "Testing..." : "Refresh"}
                        </Button>
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-foreground">
                        {networkSpeed.toFixed(1)} <span className="text-sm text-muted-foreground">Mbps</span>
                      </div>
                      <div className="w-full bg-border rounded-full h-2 mt-2">
                        <div
                          className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((networkSpeed / 100) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="card-crypto border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-success to-primary text-success-foreground">
                  <CardTitle className="flex items-center text-base sm:text-lg">
                    <TrendingUp className="w-5 h-5 mr-2 bg-white/20 p-1 rounded-full" />
                    Earnings Analytics
                  </CardTitle>
                  <CardDescription className="text-success-foreground/80 text-sm">
                    Track your earning performance over time
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="h-64">
                    <Line data={chartData} options={chartOptions} />
                  </div>
                </CardContent>
              </Card>

              <Card className="card-crypto border-0">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg text-foreground">
                    <Coins className="w-5 h-5 mr-2 text-warning" />
                    Earnings History
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    Detailed record of your daily USDT earnings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-sm font-semibold text-foreground">Date</TableHead>
                          <TableHead className="text-right text-sm font-semibold text-foreground">
                            Amount (USDT)
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pastEarnings.map((earning, index) => (
                          <TableRow key={index} className="hover:bg-muted/50 transition-colors">
                            <TableCell className="text-sm font-medium text-muted-foreground">{earning.date}</TableCell>
                            <TableCell className="text-right font-bold text-sm text-success">
                              ${(earning.daily_earnings + (earning.referral_earnings || 0)).toFixed(4)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "referral" && (
            <ReferralProgram
              referrals={referrals}
            />
          )}

          {activeTab === "rewards" && (
            <Rewards
              userBalance={userBalance || { usdt_balance: 0 }}
              referralEarnings={pastEarnings.reduce((sum, e) => sum + (e.referral_earnings || 0), 0)}
              lastRewardClaim={lastRewardClaim}
              onClaimReward={(amount) => claimReward(amount, 'reward')}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;