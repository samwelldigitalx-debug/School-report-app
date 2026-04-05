import React from 'react';
import { Button, Card } from './ui';
import { School, Subscription } from '@/src/types';
import { CreditCard, CheckCircle, Clock, AlertCircle, History, Download, Zap } from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '@/src/constants';
import { cn } from '@/src/lib/utils';
import { usePaystackPayment } from 'react-paystack';

interface BillingProps {
  school: School;
  subscriptions: Subscription[];
  userEmail: string;
  onUpgrade: () => void;
  onPaymentSuccess: (reference: string, planId: string, amount: number) => void;
}

export const Billing = ({ school, subscriptions, userEmail, onUpgrade, onPaymentSuccess }: BillingProps) => {
  const activePlan = SUBSCRIPTION_PLANS.find(p => p.id === school.subscriptionPlan);
  const isExpired = new Date(school.subscriptionExpiry) < new Date();

  const paystackPublicKey = (import.meta as any).env?.VITE_PAYSTACK_PUBLIC_KEY || '';
  const [paymentConfig, setPaymentConfig] = React.useState<any>(null);

  const initializePayment = usePaystackPayment(paymentConfig || {
    reference: '',
    email: '',
    amount: 0,
    publicKey: '',
  });

  React.useEffect(() => {
    if (paymentConfig) {
      initializePayment({
        onSuccess: (response: any) => {
          onPaymentSuccess(response.reference, paymentConfig.metadata.planId, paymentConfig.amount / 100);
          setPaymentConfig(null);
        },
        onClose: () => {
          console.log('Payment closed');
          setPaymentConfig(null);
        }
      });
    }
  }, [paymentConfig, initializePayment, onPaymentSuccess]);

  const handlePayment = (planId: string, amount: number) => {
    if (!paystackPublicKey || paystackPublicKey === 'pk_test_your_paystack_public_key') {
      alert('Paystack Public Key is not configured. Please add it to your environment variables.');
      return;
    }

    setPaymentConfig({
      reference: (new Date()).getTime().toString(),
      email: userEmail,
      amount: amount * 100,
      publicKey: paystackPublicKey,
      metadata: {
        planId,
        schoolId: school.id,
        custom_fields: [
          {
            display_name: "School Name",
            variable_name: "school_name",
            value: school.name
          }
        ]
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Billing & Subscriptions</h1>
        <Button onClick={onUpgrade}>
          <Zap size={18} className="mr-2" /> Upgrade Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Plan Card */}
        <Card className="lg:col-span-2 p-8 border-0 shadow-xl bg-gradient-to-br from-blue-600 to-blue-800 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <CreditCard size={160} />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                Current Active Plan
              </div>
              <div className={cn(
                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                isExpired ? "bg-red-500" : "bg-emerald-500"
              )}>
                {isExpired ? 'Expired' : 'Active'}
              </div>
            </div>

            <h2 className="text-4xl font-black uppercase tracking-tight mb-2">{activePlan?.name}</h2>
            <p className="text-blue-100 font-medium mb-8">
              Your subscription will {isExpired ? 'expired' : 'renew'} on {new Date(school.subscriptionExpiry).toLocaleDateString()}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-white/10">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest">Monthly Cost</p>
                <p className="text-xl font-black">₦{activePlan?.price.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest">Student Limit</p>
                <p className="text-xl font-black">
                  {school.subscriptionPlan === 'basic' ? '150' : school.subscriptionPlan === 'standard' ? '500' : 'Unlimited'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest">Payment Method</p>
                <p className="text-xl font-black flex items-center">
                  Paystack <CheckCircle size={16} className="ml-2 text-emerald-400" />
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="space-y-6">
          <Card className="p-6 border-0 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Days Remaining</p>
                <p className="text-2xl font-black text-gray-900">
                  {Math.max(0, Math.ceil((new Date(school.subscriptionExpiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} Days
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-0 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                <History size={24} />
              </div>
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Last Payment</p>
                <p className="text-2xl font-black text-gray-900">₦{activePlan?.price.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          {isExpired && activePlan && (
            <Card className="p-6 border-0 bg-red-50 text-red-700 shadow-sm flex items-start space-x-4">
              <AlertCircle size={24} className="flex-shrink-0" />
              <div>
                <p className="text-sm font-black uppercase tracking-tight">Subscription Expired</p>
                <p className="text-xs font-medium mt-1">Please renew your subscription to continue generating results.</p>
                <Button 
                  variant="danger" 
                  size="sm" 
                  className="mt-4 w-full"
                  onClick={() => handlePayment(activePlan.id, activePlan.price)}
                >
                  Renew Now
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Transaction History */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Transaction History</h3>
          <Button variant="outline" size="sm">
            <Download size={16} className="mr-2" /> Export History
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 uppercase text-[10px] font-black tracking-widest border-b border-gray-100">
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Reference</th>
                <th className="px-6 py-4">Plan</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-50">
              {subscriptions.length > 0 ? (
                subscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-600">{new Date(sub.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-500 uppercase">{sub.reference}</td>
                    <td className="px-6 py-4 font-bold text-gray-900 uppercase">{sub.plan}</td>
                    <td className="px-6 py-4 font-black text-gray-900">₦{sub.amount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase rounded-full tracking-wider">Successful</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Download size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400 font-medium italic">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
