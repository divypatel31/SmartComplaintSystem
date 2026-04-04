const colorMap = {
  brand:   { bg: 'bg-brand-50',   border: 'border-brand-200',   icon: 'bg-brand-100 text-brand-600',   text: 'text-brand-700'   },
  amber:   { bg: 'bg-amber-50',   border: 'border-amber-200',   icon: 'bg-amber-100 text-amber-600',   text: 'text-amber-700'   },
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: 'bg-emerald-100 text-emerald-600',text: 'text-emerald-700' },
  violet:  { bg: 'bg-violet-50',  border: 'border-violet-200',  icon: 'bg-violet-100 text-violet-600',  text: 'text-violet-700'  },
  gray:    { bg: 'bg-gray-50',    border: 'border-gray-200',    icon: 'bg-gray-100 text-gray-500',      text: 'text-gray-600'    },
};

export default function StatCard({ label, value, icon, color = 'brand' }) {
  const c = colorMap[color] || colorMap.brand;
  return (
    <div className={`${c.bg} border ${c.border} rounded-xl p-5 flex items-center gap-4 shadow-card`}>
      <div className={`w-11 h-11 rounded-xl ${c.icon} flex items-center justify-center text-xl flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <p className={`font-display text-2xl font-bold ${c.text}`}>{value}</p>
        <p className="font-body text-xs text-gray-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}
