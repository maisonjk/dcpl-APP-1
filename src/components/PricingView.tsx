import React, { useState } from "react";
import { motion } from "motion/react";
import { Check, Zap, Church, HandHeart, Loader2 } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { api } from "../api";

const PRICE_IDS = {
  disciple_monthly: import.meta.env.VITE_STRIPE_PRICE_DISCIPLE_MONTHLY || "",
  disciple_yearly: import.meta.env.VITE_STRIPE_PRICE_DISCIPLE_YEARLY || "",
  church_monthly: import.meta.env.VITE_STRIPE_PRICE_CHURCH_MONTHLY || "",
  church_yearly: import.meta.env.VITE_STRIPE_PRICE_CHURCH_YEARLY || "",
};

interface PricingViewProps {
  onSignUpRequired: () => void;
}

export default function PricingView({ onSignUpRequired }: PricingViewProps) {
  const { user, tier, isAtLeast } = useAuth();
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (planKey: "disciple" | "church") => {
    if (!user) { onSignUpRequired(); return; }
    const priceId = billing === "monthly"
      ? PRICE_IDS[`${planKey}_monthly`]
      : PRICE_IDS[`${planKey}_yearly`];

    if (!priceId) {
      alert("Stripe price IDs not configured. Add them to your .env file.");
      return;
    }

    setLoading(planKey);
    try {
      const { url } = await api.stripe.checkout(priceId);
      if (url) window.location.href = url;
    } catch {
      alert("Unable to start checkout. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const handleManageBilling = async () => {
    setLoading("portal");
    try {
      const { url } = await api.stripe.portal();
      if (url) window.location.href = url;
    } catch {
      alert("Unable to open billing portal.");
    } finally {
      setLoading(null);
    }
  };

  const plans = [
    {
      name: "Free",
      icon: <HandHeart className="w-5 h-5" />,
      price: { monthly: "$0", yearly: "$0" },
      tagline: "Begin your discipleship journey",
      features: [
        "Daily Bible verse",
        "Basic Bible study",
        "Prayer journal (5 prayers)",
        "30-day discipleship path",
        "1 accountability partner",
        "Basic reminders",
      ],
      tierKey: "free" as const,
      planKey: null as null,
      popular: false,
    },
    {
      name: "Disciple Plus",
      icon: <Zap className="w-5 h-5" />,
      price: { monthly: "$7.99", yearly: "$79" },
      tagline: "Deepen your faith, grow together",
      features: [
        "Everything in Free",
        "Unlimited Bible study tracks",
        "Accountability circles (up to 5)",
        "AI scripture reflections",
        "Mission challenges",
        "Premium devotionals",
        "Prayer groups",
        "Growth insights",
      ],
      tierKey: "disciple_plus" as const,
      planKey: "disciple" as const,
      popular: true,
    },
    {
      name: "Church & Leader",
      icon: <Church className="w-5 h-5" />,
      price: { monthly: "$49", yearly: "$499" },
      tagline: "Lead your congregation forward",
      features: [
        "Everything in Disciple Plus",
        "Church dashboard",
        "Up to 100 members",
        "Group discipleship tracking",
        "Leader tools",
        "Custom reading plans",
        "Prayer request management",
        "Church branding",
        "Engagement analytics",
      ],
      tierKey: "church_leader" as const,
      planKey: "church" as const,
      popular: false,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[900px] mx-auto space-y-10 pb-28 text-left"
    >
      <div className="border-l-4 border-[#1A1A1A] pl-5 space-y-1.5">
        <span className="font-sans text-[11px] text-[#1A1A1A] uppercase tracking-[0.2em] font-bold block">
          Membership Plans
        </span>
        <h2 className="font-serif text-3xl font-bold text-[#1A1A1A]">
          Invest in Your Spiritual Growth
        </h2>
        <p className="text-sm text-neutral-500 max-w-lg font-sans leading-relaxed">
          Start free, upgrade when you're ready to go deeper. Cancel anytime.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex border border-[#1A1A1A] bg-white p-1 w-fit">
          <button
            onClick={() => setBilling("monthly")}
            className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition ${
              billing === "monthly" ? "bg-[#1A1A1A] text-white" : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling("yearly")}
            className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition ${
              billing === "yearly" ? "bg-[#1A1A1A] text-white" : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            Yearly
            <span className="ml-1.5 text-[8px] bg-green-600 text-white px-1.5 py-0.5 font-bold">
              SAVE 17%
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {plans.map((plan) => {
          const isCurrent = tier === plan.tierKey;

          return (
            <div
              key={plan.tierKey}
              className={`flex flex-col border-2 bg-white p-6 relative ${
                plan.popular
                  ? "border-[#1A1A1A] shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]"
                  : "border-neutral-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-6">
                  <span className="bg-[#1A1A1A] text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 mb-2">
                <span className="text-[#1A1A1A]">{plan.icon}</span>
                <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">{plan.name}</h3>
              </div>

              <div className="mb-1">
                <span className="font-serif text-3xl font-bold text-[#1A1A1A]">
                  {plan.price[billing]}
                </span>
                <span className="text-neutral-400 text-xs font-sans ml-1">
                  /{billing === "monthly" ? "mo" : "yr"}
                </span>
              </div>

              <p className="text-xs text-neutral-500 font-sans mb-5 leading-relaxed">
                {plan.tagline}
              </p>

              <ul className="space-y-2 mb-6 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-xs text-neutral-700 font-sans">
                    <Check className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.tierKey === "free" ? (
                <div className="w-full border border-[#1A1A1A] py-3 text-[10px] uppercase font-bold tracking-widest text-center text-neutral-500">
                  {isCurrent ? "Your current plan" : "Free forever"}
                </div>
              ) : isCurrent ? (
                <button
                  onClick={handleManageBilling}
                  disabled={loading === "portal"}
                  className="w-full border border-[#1A1A1A] hover:bg-neutral-50 py-3 text-[10px] uppercase font-bold tracking-widest text-center transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading === "portal" && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Manage Billing
                </button>
              ) : (
                <button
                  onClick={() => plan.planKey && handleSubscribe(plan.planKey)}
                  disabled={!!loading}
                  className={`w-full py-3 text-[10px] uppercase font-bold tracking-widest text-center transition disabled:opacity-50 flex items-center justify-center gap-2 ${
                    plan.popular
                      ? "bg-[#1A1A1A] text-white hover:bg-neutral-800"
                      : "border border-[#1A1A1A] hover:bg-neutral-50 text-[#1A1A1A]"
                  }`}
                >
                  {loading === plan.planKey && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {plan.tierKey === "disciple_plus" ? "Start Disciple Plus" : "Start Church Plan"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-center text-[11px] text-neutral-400 font-sans">
        Secure payments via Stripe · Cancel anytime · No hidden fees
      </p>
    </motion.div>
  );
}
