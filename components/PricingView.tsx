
import React from 'react';
import { UserTier } from '../types';

interface PricingViewProps {
  onSelectTier: (tier: UserTier) => void;
  currentTier: UserTier;
}

const PricingView: React.FC<PricingViewProps> = ({ onSelectTier, currentTier }) => {
  const tiers = [
    {
      id: UserTier.FREE,
      name: 'Executive Free',
      price: '$0',
      period: 'Forever',
      description: 'Essential AI assistance for individual professionals.',
      features: [
        'Standard Gemini Flash Chat',
        'Nano Banana Image Engine (1:1 only)',
        'Basic Python Code Generation',
        '10 Reports per day',
        'Community Support'
      ],
      buttonText: currentTier === UserTier.FREE ? 'Current Plan' : 'Downgrade'
    },
    {
      id: UserTier.PRO,
      name: 'Emerald Pro',
      price: '$49',
      period: 'per month',
      description: 'Unrestricted high-performance AI for corporate leaders.',
      features: [
        'Unlimited Pro-Grade Chat',
        'Nano Banana Pro (High-Res 1K-4K)',
        'Advanced Photo Editing Studio',
        'Priority Python Analysis Node',
        'Custom Enterprise Aspect Ratios',
        '24/7 Dedicated Support'
      ],
      featured: true,
      buttonText: currentTier === UserTier.PRO ? 'Current Plan' : 'Upgrade to Pro'
    }
  ];

  return (
    <div className="h-full bg-slate-50 overflow-y-auto p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Executive Membership</h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Scale your operations with Gemini-powered intelligence. Choose the tier that aligns with your professional velocity.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tiers.map((tier) => (
            <div 
              key={tier.id}
              className={`relative bg-white rounded-3xl p-8 border-2 transition-all shadow-xl hover:shadow-2xl ${
                tier.featured 
                ? 'border-emerald-500 ring-4 ring-emerald-500/10' 
                : 'border-slate-100'
              }`}
            >
              {tier.featured && (
                <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-emerald-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                  Most Professional
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{tier.name}</h3>
                <p className="text-slate-500 text-sm">{tier.description}</p>
              </div>

              <div className="mb-8 flex items-baseline">
                <span className="text-5xl font-black text-slate-900">{tier.price}</span>
                <span className="text-slate-400 ml-2 font-medium">/ {tier.period}</span>
              </div>

              <ul className="space-y-4 mb-10">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-sm text-slate-600">
                    <svg className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => onSelectTier(tier.id)}
                disabled={currentTier === tier.id}
                className={`w-full py-4 rounded-2xl font-bold uppercase tracking-widest transition-all ${
                  tier.featured
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200'
                    : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                } disabled:opacity-50 disabled:cursor-default`}
              >
                {tier.buttonText}
              </button>
            </div>
          ))}
        </div>

        <footer className="mt-20 text-center border-t border-slate-200 pt-10">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-4">Enterprise Compliance</p>
          <p className="text-slate-500 text-sm max-w-3xl mx-auto leading-relaxed">
            All plans include end-to-end encryption and adhere to global executive data protection standards. 
            For custom deployment and API white-labeling, contact our strategy team.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default PricingView;
