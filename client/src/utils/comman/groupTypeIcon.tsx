import {
  Wallet,
  Plane,
  Home as HomeIcon,
  ShoppingBag,
  ShoppingCart,
  UtensilsCrossed,
  Receipt,
  Clapperboard,
  HeartPulse,
  Car,
  Briefcase,
  PartyPopper,
  type LucideIcon,
} from "lucide-react";

// Keyword-matched icon per group type, colored via currentColor so it always
// tracks the theme (real uploaded category images were fixed-color assets and
// kept rendering as plain black squares — see REDESIGN_PLAN.md 2026-08-20).
const GROUP_TYPE_ICON_RULES: [RegExp, LucideIcon][] = [
  [/trip|travel|vacation|holiday|tour/i, Plane],
  [/flat|room|house|rent|roommate/i, HomeIcon],
  [/grocery|groceries/i, ShoppingCart],
  [/shop|mall/i, ShoppingBag],
  [/food|dinner|lunch|restaurant|dining|cafe/i, UtensilsCrossed],
  [/bill|utility|utilities|electricity/i, Receipt],
  [/movie|entertainment|cinema|\bent\b/i, Clapperboard],
  [/party|event|celebration|festival|diwali/i, PartyPopper],
  [/health|medical|doctor|hospital|pharmacy/i, HeartPulse],
  [/cab|taxi|transport|uber|ride|fuel|petrol/i, Car],
  [/office|work|colleague/i, Briefcase],
];

export const getGroupTypeIcon = (name?: string | null): LucideIcon => {
  if (name) {
    const match = GROUP_TYPE_ICON_RULES.find(([pattern]) => pattern.test(name));
    if (match) return match[1];
  }
  return Wallet;
};
