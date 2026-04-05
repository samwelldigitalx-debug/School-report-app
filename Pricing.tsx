import React from 'react';
import { Check, ArrowRight, Zap, Shield, Globe } from 'lucide-react';
import { Button, Card } from './ui';
import { SUBSCRIPTION_PLANS } from '@/src/constants';
import { cn } from '@/src/lib/utils';
import { usePaystackPayment } from 'react-paystack';

interface PricingProps {
  userEmail: string;
  onSelectPlan: (planId: string) => void;
  onPaymentSuccess: (reference: string, planId: string, amount: number) => void;
}

export const Pricing = ({ userEmail, onSelectPlan, onPaymentSuccess }: PricingProps) => {
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
        custom_fields: [
          {
            display_name: "Plan Name",
            variable_name: "plan_name",
            value: SUBSCRIPTION_PLANS.find(p => p.id === planId)?.name || planId
          }
        ]
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Choose Your School Plan</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
            Professional result management for every school size. Scale as you grow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <Card key={plan.id} className={cn(
              "p-8 flex flex-col relative overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1",
              plan.id === 'standard' ? "border-2 border-blue-600 shadow-xl" : "border border-gray-200"
            )}>
              {plan.id === 'standard' && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black uppercase px-4 py-1 rounded-bl-lg tracking-widest">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-xl font-black text-gray-900 mb-2 uppercase tracking-wider">{plan.name}</h3>
                <div className="flex items-baseline">
                  <span className="text-4xl font-black text-gray-900">₦{plan.price.toLocaleString()}</span>
                  <span className="text-gray-500 font-bold ml-2">/month</span>
                </div>
              </div>

              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <div className="bg-blue-100 p-1 rounded-full mr-3 mt-0.5">
                      <Check className="text-blue-600" size={14} />
                    </div>
                    <span className="text-gray-600 font-medium text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                variant={plan.id === 'standard' ? 'primary' : 'outline'} 
                className="w-full py-6 text-lg font-black uppercase tracking-wider"
                onClick={() => handlePayment(plan.id, plan.price)}
              >
                Get Started <ArrowRight className="ml-2" size={20} />
              </Button>
            </Card>
          ))}
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mx-auto">
              <Zap size={32} />
            </div>
            <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight">Instant Setup</h4>
            <p className="text-gray-600 font-medium leading-relaxed">
              Get your school online in minutes. Add classes, subjects, and teachers instantly.
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto">
              <Shield size={32} />
            </div>
            <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight">Secure Data</h4>
            <p className="text-gray-600 font-medium leading-relaxed">
              Your student records are encrypted and backed up daily. No data loss, ever.
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mx-auto">
              <Globe size={32} />
            </div>
            <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight">Cloud Access</h4>
            <p className="text-gray-600 font-medium leading-relaxed">
              Access your school records from anywhere, on any device. Mobile and desktop ready.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
