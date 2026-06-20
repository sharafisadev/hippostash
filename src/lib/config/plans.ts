import type { PlanId } from "@/lib/types";

export interface Plan {
  id: PlanId;
  name: string;
  tagline: string;
  price: { monthly: number; yearly: number };
  badge?: string;
  cta: string;
  highlighted?: boolean;
  features: string[];
}

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: "free",
    name: "Free",
    tagline: "Everything you need to get organized.",
    price: { monthly: 0, yearly: 0 },
    cta: "Get Started Free",
    features: [
      "1 GB storage",
      "Up to 50 files",
      "Basic file types (PDF, JPG, PNG)",
      "No conversions",
      "Community support",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    tagline: "For power users who never want to run out of room.",
    price: { monthly: 9, yearly: 79 },
    badge: "Most Popular",
    cta: "Start Pro",
    highlighted: true,
    features: [
      "25 GB storage",
      "Unlimited files",
      "All file types",
      "50 conversions / month",
      "Priority support",
    ],
  },
  business: {
    id: "business",
    name: "Business",
    tagline: "Share, scale, and automate with your whole team.",
    price: { monthly: 29, yearly: 249 },
    cta: "Start Business",
    features: [
      "100 GB storage",
      "Unlimited files + conversions",
      "Team sharing (up to 5 users)",
      "API access",
      "Dedicated support",
    ],
  },
};

export const PLAN_LIST: Plan[] = [PLANS.free, PLANS.pro, PLANS.business];

export function yearlySavingsPercent(plan: Plan): number {
  if (plan.price.monthly === 0) return 0;
  const fullYear = plan.price.monthly * 12;
  if (fullYear === 0) return 0;
  return Math.round(((fullYear - plan.price.yearly) / fullYear) * 100);
}
