// `icon` (emoji) is kept only for BarChart's <canvas> axis labels — Chart.js
// draws literal text/glyphs on canvas and can't render a Lucide React/SVG
// icon component there. Every other UI (AddExpense picker, ExpenseCard list)
// renders the type-matched Lucide icon from getGroupTypeIcon instead.
export const EXPENSE_CATEGORIES = [
  { label: "Food", icon: "🍴", color: "bg-orange-50 text-orange-600 border-orange-200", hex: "#ea580c" },
  { label: "Grocery", icon: "🛒", color: "bg-green-50 text-green-600 border-green-200", hex: "#16a34a" },
  { label: "Ent", icon: "🎬", color: "bg-purple-50 text-purple-600 border-purple-200", hex: "#9333ea" },
  { label: "Bills", icon: "📄", color: "bg-blue-50 text-blue-600 border-blue-200", hex: "#2563eb" },
  { label: "Travel", icon: "🚕", color: "bg-yellow-50 text-yellow-600 border-yellow-200", hex: "#ca8a04" },
  { label: "Shopping", icon: "🛍️", color: "bg-slate-50 text-slate-600 border-slate-200", hex: "#475569" },
  { label: "Others", icon: "✨", color: "bg-slate-50 text-slate-600 border-slate-200", hex: "#64748b" },
];
