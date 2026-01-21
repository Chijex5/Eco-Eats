'use client';

import { useState } from 'react';
import { Scan, Check, X, AlertCircle, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

export default function RedeemVoucherPage() {
  const [voucherCode, setVoucherCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    code?: string;
    amount?: number;
    beneficiary?: string;
    message?: string;
  } | null>(null);

  const handleScan = async () => {
    if (!voucherCode.trim()) return;
    
    setIsScanning(true);
    setScanResult(null);

    // Simulate scanning/validation
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock validation result
    const isValid = voucherCode.toUpperCase().startsWith('EAT-');
    
    if (isValid) {
      setScanResult({
        success: true,
        code: voucherCode.toUpperCase(),
        amount: 150000, // ₦1,500 in kobo
        beneficiary: 'John Doe',
        message: 'Voucher validated successfully!',
      });
    } else {
      setScanResult({
        success: false,
        message: 'Invalid voucher code. Please check and try again.',
      });
    }

    setIsScanning(false);
  };

  const handleRedeem = async () => {
    setIsScanning(true);
    
    // Simulate redemption
    await new Promise(resolve => setTimeout(resolve, 1000));

    setScanResult({
      ...scanResult!,
      message: 'Voucher redeemed successfully! Payment will be processed.',
    });

    setIsScanning(false);

    // Reset after 3 seconds
    setTimeout(() => {
      setVoucherCode('');
      setScanResult(null);
    }, 3000);
  };

  const handleReset = () => {
    setVoucherCode('');
    setScanResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[var(--muted)] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-[var(--secondary)] text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg">
            <Scan className="w-4 h-4" />
            <span>Redeem Voucher</span>
          </div>
          <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">
            Scan & Validate Vouchers
          </h1>
          <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
            Enter voucher code or scan QR code to validate and redeem beneficiary meal vouchers.
          </p>
        </div>

        {/* Scanner Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Enter Voucher Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* QR Scanner Placeholder */}
            <div className="bg-[var(--muted)] rounded-xl p-8 text-center border-2 border-dashed border-[var(--border)]">
              <Scan className="w-16 h-16 text-[var(--muted-foreground)] mx-auto mb-4" />
              <p className="text-[var(--muted-foreground)] mb-2">
                QR Code Scanner
              </p>
              <p className="text-sm text-[var(--muted-foreground)]">
                (Camera scanner will be implemented in Phase B)
              </p>
            </div>

            {/* Manual Entry */}
            <div className="text-center text-sm text-[var(--muted-foreground)] relative">
              <span className="bg-white px-4 relative z-10">Or enter code manually</span>
              <div className="absolute top-1/2 left-0 right-0 h-px bg-[var(--border)] -z-0"></div>
            </div>

            <div className="space-y-4">
              <Input
                label="Voucher Code"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                placeholder="e.g., EAT-7H3K2"
                className="text-center text-lg font-mono"
              />

              <Button
                size="lg"
                className="w-full"
                onClick={handleScan}
                disabled={isScanning || !voucherCode.trim()}
              >
                {isScanning ? (
                  <>
                    <Scan className="w-4 h-4 mr-2 animate-spin" />
                    Validating...
                  </>
                ) : (
                  <>
                    <Scan className="w-4 h-4 mr-2" />
                    Validate Voucher
                  </>
                )}
              </Button>
            </div>

            {/* Scan Result */}
            {scanResult && (
              <Card className={`border-2 ${
                scanResult.success 
                  ? 'border-[var(--primary)] bg-gradient-to-br from-[var(--primary)]/5 to-white' 
                  : 'border-red-500 bg-gradient-to-br from-red-50 to-white'
              }`}>
                <CardContent className="py-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      scanResult.success ? 'bg-[var(--primary)] text-white' : 'bg-red-500 text-white'
                    }`}>
                      {scanResult.success ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-bold text-lg mb-2 ${
                        scanResult.success ? 'text-[var(--foreground)]' : 'text-red-700'
                      }`}>
                        {scanResult.message}
                      </h3>
                      {scanResult.success && (
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between py-2 border-b border-[var(--border)]">
                            <span className="text-[var(--muted-foreground)]">Voucher Code:</span>
                            <span className="font-mono font-semibold">{scanResult.code}</span>
                          </div>
                          <div className="flex items-center justify-between py-2 border-b border-[var(--border)]">
                            <span className="text-[var(--muted-foreground)]">Beneficiary:</span>
                            <span className="font-semibold">{scanResult.beneficiary}</span>
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <span className="text-[var(--muted-foreground)]">Voucher Value:</span>
                            <span className="text-xl font-bold text-[var(--primary)]">
                              ₦{((scanResult.amount || 0) / 100).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {scanResult.success && (
                    <div className="mt-6 flex gap-3">
                      <Button
                        size="lg"
                        className="flex-1"
                        onClick={handleRedeem}
                        disabled={isScanning}
                      >
                        {isScanning ? 'Redeeming...' : 'Confirm & Redeem'}
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={handleReset}
                        disabled={isScanning}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}

                  {!scanResult.success && (
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full mt-4"
                      onClick={handleReset}
                    >
                      Try Again
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-gradient-to-br from-[var(--accent)]/5 to-white border-[var(--accent)]/20">
          <CardHeader>
            <CardTitle>How to Redeem Vouchers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-[var(--primary)] text-white rounded-full flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--foreground)] mb-1">Request Voucher</h4>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Ask the beneficiary to show their voucher QR code or tell you the code
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-[var(--primary)] text-white rounded-full flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--foreground)] mb-1">Scan or Enter Code</h4>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Use the QR scanner or manually enter the voucher code to validate it
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-[var(--primary)] text-white rounded-full flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--foreground)] mb-1">Verify & Serve</h4>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Check the voucher value, confirm redemption, and serve the meal
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-[var(--primary)] text-white rounded-full flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--foreground)] mb-1">Get Paid</h4>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Redeemed vouchers are automatically processed for payment within 24-48 hours
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
