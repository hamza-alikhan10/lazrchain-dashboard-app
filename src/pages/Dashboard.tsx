const USDT_CONTRACT_ADDRESS = import.meta.env.VITE_USDT_CONTRACT_ADDRESS || "TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf";
const ADMIN_ADDRESS = import.meta.env.VITE_ADMIN_ADDRESS || "TRCxE7B7Gmu9UG2YA3c3H6FNqJ7F8v7EKV";

import { useState, useEffect } from "react";
import DepositModal from "@/components/newComponents/DepositModal";
import EarningsChart from "@/components/newComponents/EarningsChart";
import { useDepositUSDTMutation, useGetUserYieldQuery, useWithdrawUSDTMutation, useGetTotalYieldQuery } from "@/features/wallet/deposit&withdrawalApi";
import { useGetUserDailyEarningsQuery } from "@/features/wallet/dailyEarningsApi";


import { useAppSelector } from "@/store/hooks";

import {
  DollarSign,
  TrendingUp,
  Wifi,
  ArrowRight,
  Coins,
  Loader2
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {useUserData } from "@/hooks/useUserData";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
// const testPrivateKey = import.meta.env.VITE_TEST_USER_PRIVATE_KEY;
// const [loading, setIsLoading] = useState(false);



const Dashboard = () => {
  const {
    userBalance,
    pastEarnings,
    todayEarnings,
    claimReward,
  } = useUserData();

  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [networkSpeed, setNetworkSpeed] = useState(5);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isSpeedTesting, setIsSpeedTesting] = useState(false);
const [totalDeposited, setTotalDeposited] = useState(() => {
  const stored = localStorage.getItem('totalDeposited');
  return stored ? parseFloat(stored) : 0;
});

  const { toast } = useToast();
  const navigate = useNavigate();

  const trc20Address = "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE";

  const [depositUSDT, { isLoading: isDepositLoading }] = useDepositUSDTMutation();
  const [withdrawUSDT, { isLoading:isWithdrowaProcessing }] = useWithdrawUSDTMutation();
  
    const { userId } = useAppSelector((state) => state.auth);

    const {walletAddress, walletSaved} = useAppSelector((state) => state.layout);
    
  

  
const {
  data: yieldData,
  isLoading: isYieldLoading,
  error: yieldError,
} = useGetUserYieldQuery(userId, { skip: !userId });

const {
  data: totalYieldData,
  isLoading: isTotalYieldLoading,
  error: totalYieldError,
} = useGetTotalYieldQuery(userId, { skip: !userId });


const {
  data: dailyEarnings,
  isLoading: isDailyEarningsLoading,
  error: dailyEarningsError,
} = useGetUserDailyEarningsQuery(userId, { skip: !userId });

useEffect(() => {
  if (dailyEarningsError) {
    toast({
      variant: "destructive",
      title: "Earnings Fetch Error",
      description: "Unable to load daily earnings history.",
      duration: 3000,
    });
  }
}, [dailyEarningsError, toast]);

useEffect(() => {
  if (totalYieldError) {
    toast({
      variant: 'destructive',
      title: 'Yield Fetch Error',
      description:
        'Unable to retrieve real-time earnings data. Please try again later.',
      duration: 3000,
    });
  }
}, [totalYieldError, toast]);

useEffect(() => {
  if (yieldError) {
    toast({
      variant: "destructive",
      title: "Yield Fetch Error",
      description:
        "Unable to retrieve real-time earnings data. Please try again later.",
      duration: 3000,
    });
  }
}, [yieldError, toast]);

const copyToClipboard = (value: string, label: string) => {
    navigator.clipboard.writeText(value).then(() => {
        toast({
        title: `${label} Copied`,
        description: `${label} address has been copied to clipboard.`,
        duration: 3000,
        });
    }).catch(() => {
        toast({
        variant: "destructive",
        title: "Copy Failed",
        description: "Unable to copy to clipboard.",
        duration: 3000,
        });
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

  // useEffect(() => {
  //   const stored = localStorage.getItem('totalDeposited');
  //   if (stored) {
  //     setTotalDeposited(parseFloat(stored));
  //   }
  // }, []);

  const confirmDeposit = async () => {
    try {
      const tronWeb = (window as any).tronWeb;
      if (!tronWeb || !tronWeb.defaultAddress?.base58) {
        throw new Error("TronLink wallet not connected.");
      }

      const userAddress = tronWeb.defaultAddress.base58;
      const usdt = await tronWeb.contract().at(USDT_CONTRACT_ADDRESS);
      const amountInSun = tronWeb.toSun(parseFloat(depositAmount));

      // Step 1: Send TRC20 transaction to admin wallet
      const txHash = await usdt.transfer(ADMIN_ADDRESS, amountInSun).send();

      // Step 2: Call backend via RTK mutation
      depositUSDT({
        walletAddress: userAddress,
        txHash,
        amount: parseFloat(depositAmount),
      })
        .unwrap()
        .then((data) => {
          toast({
            title: "✅ Deposit Successful",
            description: `${data.amount} USDT deposited successfully. Tx: ${txHash}`,
            duration: 4000,
          });

          // setTotalDeposited(data.totalDeposited);
          localStorage.setItem("totalDeposited", data.totalDeposited.toString());
          setIsDepositOpen(false);
          setDepositAmount("");
        })
        .catch((error: any) => {
          const toastMap: Record<string, { title: string; description: string }> = {
            MISSING_FIELDS: {
              title: "Missing Fields",
              description: "Wallet, amount or transaction hash is missing.",
            },
            USER_NOT_FOUND: {
              title: "Wallet Not Linked",
              description: "No user found for this wallet address.",
            },
            TX_NOT_FOUND: {
              title: "Transaction Missing",
              description: "Transaction not found on-chain.",
            },
            TX_FAILED: {
              title: "Transaction Failed",
              description: "Transaction was not successful on-chain.",
            },
            INVALID_TX_TARGET: {
              title: "Invalid Transaction",
              description: "Transaction does not match wallet or admin address.",
            },
            AMOUNT_MISMATCH: {
              title: "Amount Mismatch",
              description: "Sent amount does not match entered amount.",
            },
            SERVER_ERROR: {
              title: "Server Error",
              description: "An unexpected server error occurred.",
            },
          };

          const fallback = {
            title: "Unknown Error",
            description: "Something went wrong. Please try again.",
          };

          toast({
            ...(toastMap[error?.data?.type] || fallback),
            variant: "destructive",
            duration: 4000,
          });
        });
    } catch (error: any) {
      toast({
        title: "❌ Wallet Error",
        description: error?.message || "Unable to connect or transfer.",
        variant: "destructive",
      });
    }
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);

    if (amount <= 0 || isNaN(amount)) {
      toast({
        variant: 'destructive',
        title: 'Invalid Amount',
        description: 'Please enter a valid withdrawal amount.',
        duration: 3000,
      });
      return;
    }

    try {
      const res = await withdrawUSDT({ userId, amount }).unwrap();

      if (res.success) {
        toast({
          title: 'Withdrawal Successful',
          description: `✅ ${res.amount} USDT withdrawn. TxID: ${res.txHash}`,
          duration: 5000,
        });
        setWithdrawAmount('');
      }
    } catch (err: any) {
      const error = err?.data;

      switch (error?.type) {
        case 'INSUFFICIENT_FUNDS':
          toast({
            variant: 'destructive',
            title: 'Insufficient Balance',
            description: error.message,
            duration: 4000,
          });
          break;
        case 'USER_NOT_FOUND':
          toast({
            variant: 'destructive',
            title: 'User Not Found',
            description: error.message,
            duration: 4000,
          });
          break;
        case 'TX_SEND_ERROR':
          toast({
            variant: 'destructive',
            title: 'Transfer Failed',
            description: 'Could not process USDT transaction. Try again later.',
            duration: 4000,
          });
          break;
        case 'TX_NOT_FOUND':
          toast({
            variant: 'destructive',
            title: 'Transaction Not Found',
            description: 'No transaction found on-chain.',
            duration: 4000,
          });
          break;
        case 'TX_FAILED':
          toast({
            variant: 'destructive',
            title: 'Transaction Failed',
            description: 'Transaction was reverted or failed on-chain.',
            duration: 4000,
          });
          break;
        default:
          toast({
            variant: 'destructive',
            title: 'Unexpected Error',
            description: error?.message || 'Something went wrong during withdrawal.',
            duration: 4000,
          });
          break;
      }
    }
  };

  const testInternetSpeed = async () => {
    setIsSpeedTesting(true);
    const fallbackSpeed = Math.random() * 25 + 15;
    setTimeout(() => {
      setNetworkSpeed(fallbackSpeed);
      setIsSpeedTesting(false);
    }, 1000);
  };

  useEffect(() => {
    const tronWeb = (window as any).tronWeb;
    const tronLink = (window as any).tronLink;

      if (!tronWeb || !tronLink) {
        navigate('/connect-wallet');
      }
    
  }, []);

  const chartData = {
    labels: dailyEarnings?.map((e) => new Date(e.date).toLocaleDateString()) || [],
    datasets: [
      {
        label: "USDT Earnings",
        data: dailyEarnings?.map((e) => e.profitAmount) || [],
        borderColor: "hsl(var(--primary))",
        backgroundColor: "hsla(var(--primary), 0.1)",
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
        <>
            <DepositModal
                isOpen={isDepositOpen}
                onClose={() => setIsDepositOpen(false)}
                trc20Address={trc20Address}
                depositAmount={depositAmount}
                copyToClipboard={copyToClipboard}
                confirmDeposit={confirmDeposit}
                isLoading={isDepositLoading}
            />

            <div className="p-4 sm:p-6 lg:p-8 space-y-6">
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
                      {isTotalYieldLoading ? (
                        <>
                          <span>Loading...</span>
                        </>
                      ) : (
                        <span>
                          {totalYieldData?.totalYield?.toFixed(2) ?? '0.00'}
                        </span>
                      )}
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
                        disabled={isWithdrowaProcessing}
                        className={`w-full border-2 border-secondary text-sm py-3 rounded-xl font-semibold transition-all duration-200 ${
                          isWithdrowaProcessing
                            ? 'border-blue-500 text-blue-500 bg-blue-50'
                            : 'border-secondary text-secondary hover:bg-secondary/10 hover:border-secondary-glow'
                        }`}
                      >
                        {isWithdrowaProcessing ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <ArrowRight className="w-4 h-4 mr-2" />
                            Withdraw USDT
                          </>
                        )}
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
                      {isYieldLoading ? (
                        <span className="animate-pulse">Loading...</span>
                      ) : (
                        `$${(yieldData?.yield || 0).toFixed(4)}`
                      )}
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

                <Card>
                    <EarningsChart chartData={chartData} chartOptions={chartOptions} />
                </Card>

                <Card>
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
                        {isDailyEarningsLoading ? (
                          <TableRow>
                            <TableCell
                              colSpan={2}
                              className="text-center text-sm font-medium text-muted-foreground py-6"
                            >
                              Loading...
                            </TableCell>
                          </TableRow>
                        ) : dailyEarnings && dailyEarnings.length > 0 ? (
                          dailyEarnings.map((earning, index) => (
                            <TableRow
                              key={index}
                              className="hover:bg-muted/50 transition-colors"
                            >
                              <TableCell className="text-sm font-medium text-muted-foreground">
                                {new Date(earning.date).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="text-right font-bold text-sm text-success">
                                ${earning.profitAmount.toFixed(4)}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={2}
                              className="text-center text-sm font-medium text-muted-foreground py-6"
                            >
                              No records yet
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
                </Card>
            </div>
        </>
  );
};

export default Dashboard;
